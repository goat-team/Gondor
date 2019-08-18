const fs               = require('fs');
const { eachOf }       = require('async');
const { pubToAddress } = require('ethereumjs-util');
const ec               = require('elliptic').ec('secp256k1');

const Network          = require('./network');

class Wallet {

    constructor(Gondor) {
        this.walletFile     = './.wallet.json';
        this.Gondor         = Gondor;
        this.Gondor.network = Gondor.network || new Network('BTC');
        this.Gondor.wallet  = require('../.wallet.json');
        this.Coins          = require('./constants/coins');
    };

    async init () {
        const hdPublicKeyShort = this.Gondor.hdpublickeyshort;
        const coin             = this.Coins[this.Gondor.network.alias];

        if (!this._checkInstanceExists()) {
            this.Gondor.wallet[hdPublicKeyShort]                                   = {};
            this.Gondor.wallet[hdPublicKeyShort]['coins']                          = {}
            this.Gondor.wallet[hdPublicKeyShort]['coins'][coin.index]              = {};
            this.Gondor.wallet[hdPublicKeyShort]['coins'][coin.index]['addresses'] = {};
        }

        if (!this.checkInstanceHasAddress(hdPublicKeyShort, coin.index)) {
            const firstAddress                                                     = this.getFirstAddress();
            this.Gondor.wallet[hdPublicKeyShort]['coins'][coin.index]['addresses'] = { '0': firstAddress };
            const walletString                                                     = JSON.stringify(this.Gondor.wallet);
            this.writeWallet(walletString);
        }

        return true;
    };

    checkInstanceHasAddress (hdPublicKeyShort, coinIndex) {
        return Object.keys(this.Gondor.wallet[hdPublicKeyShort].coins[coinIndex].addresses).length ? true : false;
    };

    checkInstanceHasCoin (hdPublicKeyShort, coinIndex) {
        const coins = Object.keys(this.Gondor.wallet[hdPublicKeyShort].coins);
        return coins.includes(coinIndex) ? true : false;
    };

    getFirstAddress () {
        if (this._isEther()) {
            return this._deriveEtherAddress('0');
        } else {
            return this._deriveAddress('0');
        }
    };

    writeWallet (wallet) {
        return fs.writeFileSync(this.walletFile, wallet);
    };

    _checkInstanceExists () {
        return this.Gondor.wallet.hasOwnProperty(this.Gondor.hdpublickeyshort) ? true : false;
    };


    _isEther () {
        return this.Coins[this.Gondor.network.alias].isEther;
    }

    get coinCount () {
        return this._countAllCoins();
    };

    _countAllCoins () {
        let count = {};

        eachOf(this.Gondor.wallet, (wallet, key, callback) => {
            eachOf(wallet.coins, (coin, key, callback) => {
                count[key] = { key: key };
                callback();
            });
            callback();
        });

        return Object.keys(count).length;
    };

    get addressCount () {
        return this._countAllAddresses();
    };

    _countAllAddresses () {
        let count = 0;

        eachOf(this.Gondor.wallet, (wallet) => {
            eachOf(wallet.coins, (coin, key, callback) => {
                count += Object.keys(coin.addresses).length;
                callback();
            });
        });

        return count;
    };

    get nextAddress () {
        return this._nextAddress();
    };

    _nextAddress () {
        const hdPublicKeyShort = this.Gondor.hdpublickeyshort;
        const coinIndex        = this.Coins[this.Gondor.network.alias].index;
        const index            = this._countCoinAddresses(hdPublicKeyShort);
        let address            = '';

        if (this._isEther()) {
            address = this._deriveEtherAddress(index);
        } else {
            address = this._deriveAddress(index);
        }

        this.Gondor.wallet[hdPublicKeyShort]['coins'][coinIndex]['addresses'][index] = address;

        this.writeWallet(JSON.stringify(this.Gondor.wallet));

        return [address, index];
    };

    _countCoinAddresses () {
        let count     = 0;
        let coinIndex = this.Coins[this.Gondor.network.alias].index;
        eachOf(this.Gondor.wallet[this.Gondor.hdpublickeyshort]['coins'][coinIndex].addresses, (address, key, callback) => {
            count++;
            callback();
        });

        return count;
    };

    getAddressByIndex (index) {
        if (this._isEther()) {
            return this._deriveEtherAddress(index);
        } else {
            return this._deriveAddress(index);
        }
    };

    _deriveAddress (index) {
        const coinNetwork = this.Gondor.network;
        const coinIndex   = this.Coins[this.Gondor.network.alias].index;

        return this.Gondor.hdprivatekey.deriveChild("m/44'/" + coinIndex + "'/0'/0/" + index).privateKey.toAddress(coinNetwork).toString();
    };

    _deriveEtherAddress (index) {
        const coinIndex = this.Coins[this.Gondor.network.alias].index;

        const derived = this.Gondor.hdprivatekey.deriveChild("m/44'/" + coinIndex + "'/0'/0/" + index);
        const key     = ec.keyFromPublic(derived.publicKey.toBuffer()).getPublic().toJSON();
        const address = pubToAddress(
            Buffer.concat([this._padTo32(new Buffer(key[0].toArray())), this._padTo32(new Buffer(key[1].toArray()))])
        )
        return '0x' + address.toString('hex');
    };

    getAddressPrivateKey (address, index) {
        const activeWallet = this.Gondor.wallet[this.Gondor.hdpublickeyshort].coins[this.Coins[this.Gondor.network.alias].index].addresses;
        const addressIndex = Object.keys(activeWallet).find(key => activeWallet[key] === address) || index;
        const coinIndex    = this.Coins[this.Gondor.network.alias].index;

        if (this._isEther()) {
            const privateKey = this.Gondor.hdprivatekey.deriveChild("m/44'/" + coinIndex + "'/0'/0/" + addressIndex).privateKey;
            return '0x' + this._padTo32(privateKey.toBuffer()).toString('hex');
        } else {
            return this.Gondor.hdprivatekey.deriveChild("m/44'/" + coinIndex + "'/0'/0/" + addressIndex).privateKey.toWIF();
        }
    };

    getAddressIndex (address) {
        const activeWallet = this.Gondor.wallet[this.Gondor.hdpublickeyshort].coins[this.Coins[this.Gondor.network.alias].index].addresses;
        return Object.keys(activeWallet).find(key => activeWallet[key] === address)
    };

    _padTo32(message) {
        while (message.length < 32) {
            message = Buffer.concat([new Buffer([0]), message]);
        }
        if (message.length !== 32) {
           throw new Error(`invalid key length: ${message.length}`);
        }
        return message;
    };

    get listAddresses () {
        let addresses   = [];
        const coinIndex = this.Coins[this.Gondor.network.alias].index;
        eachOf(this.Gondor.wallet[this.Gondor.hdpublickeyshort].coins[coinIndex].addresses, (address, key, callback) => {
            addresses.push(address)
            callback();
        });

        return addresses;
    };
};

module.exports = Wallet;
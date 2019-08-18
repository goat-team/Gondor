const bitcore = require('bitcore-lib');

const Coins   = require('./constants/coins');

const bitcoreNetworks = bitcore.Networks;

class Network {

    constructor(callsign) {
        this.coin = Coins[callsign];
        this.network = bitcoreNetworks.add({
            name: this.coin.name,
            alias: this.coin.callsign,
            pubkeyhash: this.coin.pubKeyHash,
            privatekey: this.coin.wif,
            scripthash: this.coin.scriptHash,
            xpubkey: this.coin.bip32.public,
            xprivkey: this.coin.bip32.private
        });

        return this.network;
    };
};

module.exports = Network;
const color         = require('ansi-colors');
const Wallet        = require('./wallet');
const Network       = require('./network');
const HDPrivateKey  = require('./hdprivatekey');
const Coins         = require('./constants/coins');
const Prompts       = require('./constants/prompts');

const Prompt = {
    getPhrase: () => {
        return new Promise(resolve => {
            Prompts.phrase().run().then(mnemonic => {
                if (mnemonic === '') { console.log('This is not a valid mnemonic!');
                } else { resolve(mnemonic); }
            });
        });
    },

    getAddressIndex: () => {
        return new Promise(resolve => {
            Prompts.getAddressIndex().run().then(index => {
                if (/^[0-9]*$/.exec(index))  {
                    resolve(index);
                } else {
                    console.log('Valid indexes are between 0 - 2147483648')
                }
            });
        });
    },

    selectCoin: () => {
        return new Promise(resolve => {
            Prompts.selectCoin().run().then(coin => resolve(coin));
        });
    },

    listAddresses: addresses => {
        return new Promise(resolve => {
            Prompts.listAddresses(addresses).run().then(addresses => resolve(addresses));
        });
    },

    mainMenu: (Gondor) => {
        return new Promise(resolve => {
            Prompts.main().run().then(selected => {
                const wallet = new Wallet(Gondor);
                switch (selected) {
                    case 'Wallet Details':
                        const walletCount = Object.keys(Gondor.wallet).length;
                        console.log(                                                                   "\n" +
                            'Active Coin      : ' + color.bgCyan(color.black(Gondor.network.name))   + "\n" +
                            'Known Phrases    : ' + walletCount                                      + "\n" +
                            'Coins Tracked    : ' + wallet.coinCount                                 + "\n" +
                            'Addresses Tracked: ' + wallet.addressCount                              + "\n" +
                                                                                                       "\n"
                        );

                        Prompt.mainMenu(Gondor);
                        break;
                    case 'List Addresses':
                            console.log("\n", color.bgCyan(color.black(Gondor.network.name + ' Addresses')), "\n");

                            const addresses = wallet.listAddresses;

                            Prompt.listAddresses(addresses).then(address => {
                                if (address === '<-- Back') {
                                    Prompt.mainMenu(Gondor);
                                } else {
                                    const addressIndex = wallet.getAddressIndex(address);
                                    const privateKey   = wallet.getAddressPrivateKey(address);
                                    console.log(                                                                "\n" +
                                        'Address     @ Index ' + addressIndex + '            : ' + address    + "\n" +
                                        'Private Key @ Index ' + addressIndex + ' (KEEP SAFE): ' + privateKey + "\n"
                                    );

                                    Prompt.mainMenu(Gondor);
                                }
                            });
                        break;
                    case 'Get Next Address':
                        const address    = wallet.nextAddress;
                        const privateKey = wallet.getAddressPrivateKey(address[0]);

                        console.log(                                                              "\n" +
                            'Address     @ Index ' + address[1] + '            : ' + address[0] + "\n" +
                            'Private Key @ Index ' + address[1] + ' (KEEP SAFE): ' + privateKey + "\n"
                        );

                        Prompt.mainMenu(Gondor);
                        break;
                    case 'Get Address By Index':
                        Prompt.getAddressIndex().then(index => {
                            const address    = wallet.getAddressByIndex(index, Gondor.network);
                            const privateKey = wallet.getAddressPrivateKey(address, index);

                            console.log(                                                         "\n" +
                                'Address     @ Index ' + index + '            : ' + address    + "\n" +
                                'Private Key @ Index ' + index + ' (KEEP SAFE): ' + privateKey + "\n"
                            );

                            Prompt.mainMenu(Gondor);
                        });
                        break;
                    case 'Change Coins':
                        Prompt.selectCoin().then(coin => {
                            Gondor.network          = new Network(coin);
                            const hdprivatekey      = new HDPrivateKey(Gondor.mnemonic, Gondor.network);
                            Gondor.hdprivatekey     = hdprivatekey.generate();

                            const coinIndex = Coins[coin].index;
                            const exists = wallet.checkInstanceHasCoin(Gondor.hdpublickeyshort, coinIndex);
                            if (!exists) {
                                const firstAddress                                                      = wallet.getFirstAddress(coinIndex);
                                Gondor.wallet[Gondor.hdpublickeyshort]['coins'][coinIndex]              = {}
                                Gondor.wallet[Gondor.hdpublickeyshort]['coins'][coinIndex]['addresses'] = { '0': firstAddress };
                                const walletString                                                      = JSON.stringify(Gondor.wallet);
                                wallet.writeWallet(walletString);
                            }

                            Prompt.mainMenu(Gondor);
                        });
                        break;
                    default:
                        Prompt.mainMenu(Gondor);
                }
            });
        });
    }
};

module.exports = Prompt;
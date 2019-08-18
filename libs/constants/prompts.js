const async                        = require('async');
const { Select, Invisible, Input } = require('enquirer');

const Coins                        = require('./coins');

const Prompts = {
    phrase: () => {
        return new Invisible({ message: 'What is your mnemonic Phrase? (Input is hidden)' });
    },

    selectCoin: () => {
        const coins       = [];
        const sortedCoins = Object.keys(Coins).reduce((a, b) => (a[b] = Coins[b], a), {});

        async.eachOf(sortedCoins, (coin, key, callback) => {
            coins.push(coin.callsign);

            callback();
        }, (err) => {
            if (err) console.log(err)
        });

        return new Select({ name: 'cointype', message: 'Choose Coin', choices: coins });
    },

    main: () => {
        return new Select(
            {
                name: 'welcome',
                message: 'Main Options',
                choices: ['Wallet Details', 'List Addresses', 'Get Next Address', 'Get Address By Index', 'Change Coins']
            }
        );
    },

    listAddresses: addresses => {
        addresses.push('<-- Back');

        return new Select({ name: 'addresses', message: 'Select Address', choices: addresses });
    },

    getAddressIndex: () => {
        return new Input({ message: 'What address index are you wanting?', initial: '0' });
    }
};

module.exports = Prompts;
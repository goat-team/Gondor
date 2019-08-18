const Coins = {
    'BTC': {
        index: '0',
        name: 'Bitcoin',
        callsign: 'BTC',
        isEther: false,
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4
        },
        pubKeyHash: 0x00,
        scriptHash: 0x05,
        wif: 0x80
    },

    'LTC': {
        index: '2',
        name: 'Litecoin',
        callsign: 'LTC',
        isEther: false,
        bip32: {
            public: 0x019da462,
            private: 0x019d9cfe
        },
        pubKeyHash: 0x30,
        scriptHash: 0x32,
        wif: 0xb0
    },

    'DOGE': {
        index: '3',
        name: 'Doge',
        callsign: 'DOGE',
        isEther: false,
        bip32: {
            public: 0x02facafd,
            private: 0x02fac398
        },
        pubKeyHash: 0x1e,
        scriptHash: 0x16,
        wif:0x9e
    },

    'VTC': {
        index: '28',
        name: 'Vertcoin',
        callsign: 'VTC',
        isEther: false,
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4
        },
        pubKeyHash: 0x47,
        scriptHash: 0x05,
        wif: 0x80
    },

    'ETH': {
        index: '60',
        name: 'Ethereum',
        callsign: 'ETH',
        isEther: true,
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4
        },
        pubKeyHash: 0x00,
        scriptHash: 0x05,
        wif: 0x80
    },

    'ETC': {
        index: '61',
        name: 'Ethereum Classic',
        callsign: 'ETC',
        isEther: true,
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4
        },
        pubKeyHash: 0x00,
        scriptHash: 0x05,
        wif: 0x80
    },

    'CRW': {
        index: '72',
        name: 'Crown',
        callsign: 'CRW',
        isEther: false,
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4
        },
        pubKeyHash: 0x00,
        scriptHash: 0x05,
        wif: 0x80
    },

    'ZEC': {
        index: '133',
        name: 'zcash',
        callsign: 'ZEC',
        isEther: false,
        bip32: {
            public: 0x0488B21E,
            private: 0x0488ADE4
        },
        pubKeyHash: 0x1CB8,
        scriptHash: 0x1CBD,
        wif: 0x80
    }
};

module.exports = Coins;
const Network = require('./network');

class HDPrivateKey {

    constructor(mnemonic, network) {
        this.mnemonic = mnemonic;
        this.network = network
    };

    generate() {
        return this.mnemonic.toHDPrivateKey('', this.network);
    };
};

module.exports = HDPrivateKey;
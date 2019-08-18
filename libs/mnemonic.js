const bitcoreMnemonic = require('bitcore-mnemonic');

class Mnemonic {

    constructor(phrase) {
        this.phrase = phrase;
    };

    isValid() {
        return bitcoreMnemonic.isValid(this.phrase);
    };

    generate() {
        return new bitcoreMnemonic(this.phrase);
    };

};

module.exports = Mnemonic;
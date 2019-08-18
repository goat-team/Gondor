class HDPublicKey {

    constructor(HDPrivateKey) {
        this.hdPublicKey = HDPrivateKey.hdPublicKey
    };
};

module.exports = HDPublicKey;
const Wallet       = require('./libs/wallet');
const Network      = require('./libs/network');
const Mnemonic     = require('./libs/mnemonic');
const HDPrivateKey = require('./libs/hdprivatekey');

const Prompt = require('./libs/prompt')

async function init () {
    const Gondor            = {};
    Gondor.network          = new Network('BTC');
    Gondor.phrase           = await Prompt.getPhrase();

    const mnemonic          = new Mnemonic(Gondor.phrase);
    Gondor.mnemonic         = mnemonic.generate();

    const hdprivatekey      = new HDPrivateKey(Gondor.mnemonic, Gondor.network);
    Gondor.hdprivatekey     = hdprivatekey.generate();

    Gondor.hdpublickey      = Gondor.hdprivatekey.hdPublicKey;
    Gondor.hdpublickeyshort = Gondor.hdpublickey.toString().slice(-8);

    const wallet            = new Wallet(Gondor);
    await wallet.init();

    Prompt.mainMenu(Gondor);
};

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");

    process.exit(1);
});

init();
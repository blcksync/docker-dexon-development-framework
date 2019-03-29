/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */
// We use truffle-hdwallet-provider 0.0.6 here
let HDWalletProvider = require("truffle-hdwallet-provider");
const secret = require('./secret');
// process.env.MNENOMIC overrides user settings
console.log('secret.custom_mnemonic=' + secret.custom_mnemonic);
let mnemonic = secret.custom_mnemonic;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    testnet: {
      provider: new HDWalletProvider(
        mnemonic,
        /*
        * mnemonic is from BIP39
        * BIP39 is the method for deriving private keys from mnemonic words.
        * With different derivation path,
        * we can generate different private keys from the same set of mnemonic word
        */
        "http://testnet.dexon.org:8545",
        0,
        1,
        true,
        "m/44'/237'/0'/0/",
        /*
        * Derivation Path <= "m/44'/237'/0'/0/"
        * 
        * BIP44 defines how what derivation path should be like,
        * and it relies on coin type.
        * 
        * Ethereum is registered as 60 『"m/44'/60'/0'/0/"』,
        * while DEXON is registered as 237 『"m/44'/237'/0'/0/"』.
        * 
        * Therefore, given the same set of mnemonic words,
        * the addresses for Ethereum and DEXON are different.
        */
      ),
      network_id: "*"
    },
    development: {
      from: "0x48dbe58e9337d13b5f29fce031e69a1a5b3e46d3",
      network_id: "5777",
      host: "dexon-ganache",
      port: 7545,
    },
  }
};

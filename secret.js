// User define, or it will try to pick up the env varible MNENOMIC
const mnemonic = process.env.MNENOMIC || '';

module.exports = {
  mnemonic: mnemonic,
};

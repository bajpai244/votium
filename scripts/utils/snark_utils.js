/** @format */

const circomlib = require('circomlib');
const ffjavascript = require('ffjavascript');
const bigInt = require('./bigInt');

const { leBuff2int, leInt2Buff } = ffjavascript.utils;

const pedersenHash = (data) =>
  circomlib.babyJub.unpackPoint(circomlib.pedersenHash.hash(data))[0];

/** BigNumber to hex string of specified length */

const toHex = (num, length = 32) => {
  const str =
    num instanceof Buffer ? num.toString('hex') : bigInt(num).toString(16);
  return '0x' + str.padStart(length * 2, '0');
};

const callDataToArgs = (callData) => {
  let temp = callData.split(',');
  const proofData = temp[0];
  temp = temp.splice(1, temp.length);
  const pubSignals = JSON.parse(temp.join(','));
  return { proofData, pubSignals };
};

const buff248 = (buf) => {
  const newBuf = Buffer.alloc(31);

  for (let i = 0; i < 31; i += 1) {
    if (buf[i]) {
      newBuf[i] = buf[i];
    } else {
      newBuf[i] = 0;
    }
  }

  return newBuf;
};

module.exports = {
  pedersenHash,
  toHex,
  callDataToArgs,
  buff248,
};

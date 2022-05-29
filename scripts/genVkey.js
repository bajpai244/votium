/** @format */

const { Scalar, utils } = require('ffjavascript');
const circomlib = require('circomlib');
const crypto = require('crypto');
const { privateKey } = require('../scripts/data');

const { stringifyBigInts, leBuff2int, leInt2Buff } = utils;

/** Generate random number of specified byte length */
const rbigint = (nbytes) => leBuff2int(crypto.randomBytes(nbytes));

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

const buff512 = (buf) => {
  const newBuf = Buffer.alloc(64);

  for (let i = 0; i < 64; i += 1) {
    if (buf[i]) {
      newBuf[i] = buf[i];
    } else {
      newBuf[i] = 0;
    }
  }

  return newBuf;
};

const pedersenHash = (data) =>
  circomlib.babyJub.unpackPoint(circomlib.pedersenHash.hash(data))[0];

const pK = pedersenHash(
  buff512(leInt2Buff(Scalar.fromString('0x' + privateKey)))
);
const vKey = pedersenHash(buff512(leInt2Buff(pK)));
const nullifier = pedersenHash(buff512(leInt2Buff(vKey)));

console.log('private key=>', pK);
console.log('voting key =>', vKey);
console.log('nullifier hash =>', nullifier);

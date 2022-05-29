const circomlib = require('circomlib')
import crypto from 'crypto'
import { T_Deposit } from '../types';
const ffjavascript = require('ffjavascript')
const bigInt = require('./bigInt');

const { leBuff2int, leInt2Buff } = ffjavascript.utils;

export const rbigint: (nbytes: number) => BigInt = (nbytes: number) => bigInt.leBuff2int(crypto.randomBytes(nbytes))

/** Compute pedersen hash */

export const pedersenHash: (data: Buffer) => BigInt = (data: Buffer) => circomlib.babyJub.unpackPoint(circomlib.pedersenHash.hash(data))[0];


/** BigNumber to hex string of specified length */

export const toHex = (num: any, length = 32) => {

	const str =
		num instanceof Buffer
			? num.toString("hex")
			: bigInt(num).toString(16);
	return "0x" + str.padStart(length * 2, "0");
}

export const createDeposit: (arg: { nullifier: BigInt, secret: BigInt }) => T_Deposit = ({ nullifier, secret }) => {

	const preimage = Buffer.concat([
		nullifier.leInt2Buff(31),
		secret.leInt2Buff(31),
	]);

	const commitment = pedersenHash(preimage);
	const commitmentHex = toHex(commitment);
	const nullifierHash = pedersenHash(nullifier.leInt2Buff(31));
	const nullifierHex = toHex(nullifierHash);

	const deposit: T_Deposit = {
		nullifier, secret, preimage, commitment, commitmentHex, nullifierHash, nullifierHex

	}
	return deposit;
}

export const callDataToArgs = (callData: string) => {
	let temp = callData.split(',');
	const proofData = temp[0];
	temp = temp.splice(1, temp.length);
	const pubSignals = JSON.parse(temp.join(','));
	return { proofData, pubSignals };
};

export const buff248 = (buf: Buffer) => {
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

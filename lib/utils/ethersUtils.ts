/** @format */


import { ethers } from "ethers";
import { abi, bytecode } from '../../artifacts/contracts/Votium.sol/Votium.json'
import { } from "../../typechain";
import bigInt from 'big-integer'
import { Votium } from "../../typechain-types";

const contractAddress = "0x77d8db0BbaB7edcfc0d97E6A19570A581949DFc7";

export const toHex = (num: any, length = 32) => {
	const str =
		num instanceof Buffer ? num.toString('hex') : bigInt(num).toString(16);
	return '0x' + str.padStart(length * 2, '0');
};

export const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');

export const getWallet = async () => {
	return new ethers.Wallet(
		'a3a0cc60db27052a4c65063c2a007dec8ac011e21e562d0cdef7bc4aebc6960c',
		provider
	);
};

export const getContract = async () => {
	const wallet = await getWallet();
	const contract = new ethers.ContractFactory(abi, bytecode, wallet);
	return contract.attach(contractAddress) as Votium;
}
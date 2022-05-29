/** @format */

const { ethers } = require('ethers');
const bigInt = require('big-integer');

const {
  abi,
  bytecode,
} = require('../../artifacts/contracts/Votium.sol/Votium.json');

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');

const getWallet = async () => {
  return new ethers.Wallet(
    'a3a0cc60db27052a4c65063c2a007dec8ac011e21e562d0cdef7bc4aebc6960c',
    provider
  );
};

const getContract = async (wallet) => {
  const Contract = await new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await Contract.attach(
    '0x77d8db0BbaB7edcfc0d97E6A19570A581949DFc7'
  );

  return contract;
};

const toHex = (num, length = 32) => {
  const str =
    num instanceof Buffer ? num.toString('hex') : bigInt(num).toString(16);
  return '0x' + str.padStart(length * 2, '0');
};

module.exports = {
  provider,
  getWallet,
  getContract,
  toHex,
};

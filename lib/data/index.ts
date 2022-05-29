import { toLower } from 'ramda'
import Web3 from 'web3';

const tempIsProd = process.env.NEXT_PUBLIC_IS_PROD === "true"

export const denominations = [0.1, 1, 10, 100, 1000]

export const rpc = process.env.NEXT_PUBLIC_RPC ? process.env.NEXT_PUBLIC_RPC : 'http://127.0.0.1:8545';
export const web3 = new Web3(rpc, null, { transactionConfirmationBlocks: 1 });

const contractJson = require('../../public/contracts/ETHTornado.json');
const circuit = require('../../public/circuits/withdraw.json');

export const erc20ContractJson = require('../../public/contracts/ERC20Mock.json');
export const erc20tornadoJson = require('../../public/contracts/ERC20Tornado.json');

// const proving_key = await (
// 	await fetch('http://localhost:8100/circuits/withdraw_proving_key.bin')
// ).arrayBuffer();

export const MERKLE_TREE_HEIGHT = process.env.MERKLE_TREE_HEIGHT || 20;
export const ETH_AMOUNT = 100000000000000000;
export const TOKEN_AMOUNT = 100000000000000000;

export const PRIVATE_KEY =
	'a3a0cc60db27052a4c65063c2a007dec8ac011e21e562d0cdef7bc4aebc6960c';


const tornadoAddress = "0x77d8db0BbaB7edcfc0d97E6A19570A581949DFc7"

if (PRIVATE_KEY) {
	const account = web3.eth.accounts.privateKeyToAccount('0x' + PRIVATE_KEY);
	web3.eth.accounts.wallet.add('0x' + PRIVATE_KEY);
	web3.eth.defaultAccount = account.address;
} else {
	console.log(
		'Warning! PRIVATE_KEY not found. Please provide PRIVATE_KEY in .env file if you deposit'
	);
}

const contractMapping = {
	localhost: {
		0.1: "0x77d8db0BbaB7edcfc0d97E6A19570A581949DFc7",
		1: "0x7E5a3e941E6fD1cB79Af79b4702Fd0429D325b72",
		10: "0x4207003620592734B126F94aB1A233d26D12CE63",
		100: "0xe79eb3FaCA5b75428C0b955f5C82D3b9BCDFA15d",
		1000: "0x5e0780B320e57Dbea4DB55acb6A1aAEBE593cB30",
	},
	matic: {
		0.1: "0x77d8db0BbaB7edcfc0d97E6A19570A581949DFc7",
		1: "0x7E5a3e941E6fD1cB79Af79b4702Fd0429D325b72",
		10: "0x4207003620592734B126F94aB1A233d26D12CE63",
		100: "0xe79eb3FaCA5b75428C0b955f5C82D3b9BCDFA15d",
		1000: "0x5e0780B320e57Dbea4DB55acb6A1aAEBE593cB30",
	}
}

// groth16 initialises a lot of Promises that will never be resolved, that's why we need to use process.exit to terminate the CLI
// groth16 = await buildGroth16();

export const getNetId = async () => { return await web3.eth.net.getId(); }

export const isLocalRPC = async () => {
	return (await getNetId()) > 42
};

export const getSenderAddress = () => {
	const account = web3.eth.accounts.privateKeyToAccount('0x' + PRIVATE_KEY);
	return account.address;
}

export const Tornados = {
	0.1: new web3.eth.Contract(contractJson.abi, tempIsProd ? contractMapping.matic['0.1'] : contractMapping.localhost['0.1']),
	1: new web3.eth.Contract(contractJson.abi, tempIsProd ? contractMapping.matic['1'] : contractMapping.localhost['1']),
	10: new web3.eth.Contract(contractJson.abi, tempIsProd ? contractMapping.matic['10'] : contractMapping.localhost['10']),
	100: new web3.eth.Contract(contractJson.abi, tempIsProd ? contractMapping.matic['100'] : contractMapping.localhost['100']),
	1000: new web3.eth.Contract(contractJson.abi, tempIsProd ? contractMapping.matic['1000'] : contractMapping.localhost['1000'])
}

export const eth_to_wei = {
	0.1: "100000000000000000",
	1: "1000000000000000000",
	10: "10000000000000000000",
	100: "100000000000000000000",
	1000: "1000000000000000000000",
}

export const tornado = new web3.eth.Contract(contractJson.abi, tornadoAddress);
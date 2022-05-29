import { getContract } from "./ethersUtils";
import { buff248, toHex } from './snark_utils'
import { ethers } from 'ethers'
import { abi, bytecode } from '../../artifacts/contracts/Votium.sol/Votium.json'
import { Votium } from "../../typechain-types";

const { utils } = require('ffjavascript');
const { stringifyBigInts, leBuff2int } = utils;
const snarkjs = require("snarkjs")

export const callDataToArgs = (callData: string) => {
	let temp = callData.split(",");
	const proofData = temp[0];
	temp = temp.splice(1, temp.length);
	const pubSignals = JSON.parse(temp.join(","));
	return { proofData, pubSignals };
};

const addVoter = async (zkey: string) => {
	const contract = await getContract();
	const password = leBuff2int(buff248(Buffer.from(zkey)));

	const { ethereum } = window;

	// console.log('Generating SNARK proof');
	// console.time('Proof time');

	try {
		if (ethereum) {
			const provider = new ethers.providers.Web3Provider(ethereum);

			const signer = provider.getSigner();

			// const getWallet = async () => {
			// 	return new ethers.Wallet(
			// 		'a3a0cc60db27052a4c65063c2a007dec8ac011e21e562d0cdef7bc4aebc6960c',
			// 		provider
			// 	);
			// };

			const getContract = async (wallet) => {
				const Contract = await new ethers.ContractFactory(abi, bytecode, wallet);
				return await Contract.attach('0x77d8db0BbaB7edcfc0d97E6A19570A581949DFc7') as Votium;
			}

			const contract = await getContract(signer);

			const tx = await (await contract.addVotingKey(toHex(zkey))).wait();
			console.log(tx);

			// 	const { nonce, passwordHash } = (await contract.users(account));

			// 	const input = {
			// 		"password": password,
			// 		"targetHash": passwordHash,
			// 		"nonce": `${nonce}`
			// 	}

			// 	const { proof, publicSignals } = await snarkjs.plonk.fullProve(
			// 		input,
			// 		'circuit.wasm',
			// 		'circuit_final.zkey'
			// 	);

			// 	const callData = await snarkjs.plonk.exportSolidityCallData(
			// 		proof,
			// 		publicSignals
			// 	);

			// 	const { proofData, pubSignals } = callDataToArgs(callData);

			// 	console.log("callData =>", proofData, pubSignals);

			// 	contract.authenticate(proofData, pubSignals);
			// }

			// alert("valid password");

			// console.timeEnd('Proof time');

			alert("voter added");
		}
	}
	catch (err) {
		alert("voter already existed!");
		console.log(err);
	}


}

export default addVoter
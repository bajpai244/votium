import assert from "assert";
import { callDataToArgs, toHex } from './snark_utils'
import { T_Denomination, T_Deposit } from '../types/index'
import { MERKLE_TREE_HEIGHT, getSenderAddress, getNetId, Tornados, tornado } from '../data/index'
import { Contract } from 'web3-eth-contract'

const { utils } = require('ffjavascript');
const merkleTree = require("fixed-merkle-tree");
const snarkjs = require("snarkjs")

const bigInt = require('./bigInt');

const { unstringifyBigInts } = utils;

const generateMerkleProof: (arg: T_Deposit, tornado: Contract) => Promise<{ pathElements: Array<any>; pathIndices: Array<any>; root: any; }> = async (deposit, tornado) => {
	// Get all deposit events from smart contract and assemble merkle tree from them
	console.log('Getting current state from tornado contract');


	const events = await tornado.getPastEvents('Deposit', {
		fromBlock: 0,
		toBlock: 'latest',
	});

	const leaves = events
		.sort((a, b) => a.returnValues.leafIndex - b.returnValues.leafIndex) // Sort events in chronological order
		.map((e) => e.returnValues.commitment);
	const tree = new merkleTree(MERKLE_TREE_HEIGHT, leaves);

	// Find current commitment in the tree
	const depositEvent = events.find(
		(e) => e.returnValues.commitment === toHex(deposit.commitment)
	);

	const leafIndex = depositEvent ? depositEvent.returnValues.leafIndex : -1;

	// Validate that our data is correct
	const root = tree.root();
	const isValidRoot = await tornado.methods.isKnownRoot(toHex(root)).call();
	const isSpent = await tornado.methods
		.isSpent(toHex(deposit.nullifierHash))
		.call();


	assert(isValidRoot === true, 'Merkle tree is corrupted');
	assert(isSpent === false, 'The note is already spent');
	assert(leafIndex >= 0, 'The deposit is not found in the tree');

	// Compute merkle proof of our commitment
	const { pathElements, pathIndices } = tree.path(leafIndex);

	console.log(typeof (pathElements), typeof (pathIndices), typeof (tree.root()))

	return { pathElements, pathIndices, root: tree.root() };
}

const generateProof: (arg: { deposit: T_Deposit, recipient: string, relayerAddress: string, fee: number, refund: 0, }, tornado: Contract) => Promise<{ proof: Object, args: Array<string>, publicSignals: Object }> = async ({
	deposit,
	recipient,
	relayerAddress = "",
	fee = 0,
	refund = 0,
}, tornado) => {
	// Compute merkle proof of our commitment
	const { root, pathElements, pathIndices } = await generateMerkleProof(
		deposit,
		tornado
	);

	// Prepare circuit input
	const input = {
		// Public snark inputs
		root: root,
		nullifierHash: deposit.nullifierHash,
		recipient: bigInt(recipient),
		relayer: bigInt(relayerAddress),
		fee: bigInt(fee),
		refund: bigInt(refund),

		// Private snark inputs
		nullifier: deposit.nullifier,
		secret: deposit.secret,
		pathElements: pathElements,
		pathIndices: pathIndices,
	};

	console.log('Generating SNARK proof');
	console.time('Proof time');

	const { proof, publicSignals } = await snarkjs.plonk.fullProve(
		input,
		'circuit.wasm',
		'circuit_final.zkey'
	);

	console.timeEnd('Proof time');

	const args = [
		toHex(input.root),
		toHex(input.nullifierHash),
		toHex(input.recipient, 20),
		toHex(input.relayer, 20),
		toHex(input.fee),
		toHex(input.refund),
	];

	return {
		proof,
		args,
		publicSignals,
	};
}


const withdraw = async (deposit: T_Deposit, recipient: string, amount: T_Denomination) => {

	console.log('amount is =>', amount);
	const tornado = Tornados[amount];

	const { proof, args, publicSignals } = await generateProof({
		deposit,
		recipient,
		relayerAddress: "0",
		refund: 0,
		fee: 0,
	}, tornado);

	const callData = await snarkjs.plonk.exportSolidityCallData(
		unstringifyBigInts(proof),
		unstringifyBigInts(publicSignals)
	);

	const { proofData, pubSignals } = callDataToArgs(callData);

	const refund = 0;

	await tornado.methods
		.withdraw(proofData, pubSignals, ...args)
		.send({ from: getSenderAddress(), value: refund.toString(), gas: 1e6 })
		.on('transactionHash', async (txHash: string) => {

			const netId = await getNetId();

			if (netId === 1 || netId === 42) {
				console.log(
					`View transaction on etherscan https://${getCurrentNetworkName()}etherscan.io/tx/${txHash}`
				);
			} else {
				console.log(`The transaction is done and hash is ${txHash}`);
			}
		})
		.on('error', function (e: Error) {
			console.error('on transactionHash error', e.message);
		});

}

export default withdraw
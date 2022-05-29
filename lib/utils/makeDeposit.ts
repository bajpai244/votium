import { isLocalRPC, getSenderAddress, getNetId, Tornados, eth_to_wei } from '../data/index'
import { T_Denomination } from '../types';
import { rbigint, pedersenHash, toHex, createDeposit } from './snark_utils'

/**
 * Create deposit object from secret and nullifier
 */

const deposit: (arg: { currency: string, amount: T_Denomination }) => Promise<string> = async ({ currency, amount }) => {

	const tornado = Tornados[amount];

	const deposit = createDeposit({
		nullifier: rbigint(31),
		secret: rbigint(31),
	});
	const note = toHex(deposit.preimage, 62);
	const noteString = `tunnel-${currency}-${amount}-${await getNetId()}-${note}`;
	console.log(`Your note: ${noteString}`);

	const value = eth_to_wei[amount];

	console.log("Submitting deposit transaction");

	const txHash = await tornado.methods
		.deposit(toHex(deposit.commitment))
		.send({ value, from: getSenderAddress(), gas: 2e6 });


	console.log(txHash);

	return noteString
}


const makeDeposit = async (amount: T_Denomination) => {
	return await deposit({ currency: "eth", amount })
}

export default makeDeposit
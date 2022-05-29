import { T_Deposit } from "../types";
import { createDeposit } from '../utils/snark_utils'

const { utils } = require("ffjavascript")
const { leBuff2int } = utils

const parseNote = (noteString: string) => {
	const noteRegex =
		/tunnel-(?<currency>\w+)-(?<amount>[\d.]+)-(?<netId>\d+)-0x(?<note>[0-9a-fA-F]{124})/g;
	const match = noteRegex.exec(noteString);
	if (!match || typeof match === "undefined") {
		throw new Error('The note has invalid format');
	}
	const buf = Buffer.from(match.groups.note, 'hex');
	const nullifier = leBuff2int(buf.slice(0, 31)) as BigInt;
	const secret = leBuff2int(buf.slice(31, 62)) as BigInt;
	const deposit = createDeposit({ nullifier, secret }) as T_Deposit;
	const netId = Number(match.groups.netId);

	return {
		currency: match.groups.currency,
		amount: match.groups.amount,
		netId,
		deposit,
	};
}

export default parseNote
import { getContract } from "./ethersUtils";
import { buff248 } from './snark_utils'
const { utils } = require('ffjavascript');
const circomlib = require('circomlib');

const { stringifyBigInts, leBuff2int } = utils;

const pedersenHash = (data: any) => circomlib.babyJub.unpackPoint(circomlib.pedersenHash.hash(data))[0];

const addPerson = async (passwordRaw: string) => {
	const contract = await getContract();
	const { ethereum } = window;

	try {
		if (ethereum) {
			const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
			const account = accounts[0] as string;

			const password = buff248(Buffer.from(passwordRaw));
			const passwordHash = pedersenHash(password);

			const tx = await (await contract.addPerson(account, stringifyBigInts(passwordHash))).wait();

			// const user = await contract.users(account);

			console.log('tx ->', tx.status);
			// console.log('user->', user.passwordHash);
			console.log('password Hash ->', passwordHash);
		}

		alert('user added successfully');
	}
	catch (err) {
		alert('user already exists');
	}
}

export default addPerson

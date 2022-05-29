import { getContract } from "./ethersUtils"
import { callDataToArgs } from "./snark_utils";

const vote = async (proof: string) => {

	const contract = await getContract();
	const { proofData, pubSignals } = callDataToArgs(proof);

	const nullifier = pubSignals[0] as string;
	const vote = pubSignals[1] as string;

	try {
		await contract.vote(proofData, pubSignals, nullifier, vote);
		alert('vote submitted successfully!')
	}
	catch (err) {
		alert('voter has already submitted the proof');
		console.log('error is ->', err)
	}
}

export default vote
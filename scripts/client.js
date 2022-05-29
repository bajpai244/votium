/** @format */

const hre = require('hardhat');
const { getWallet, getContract, toHex, provider } = require('./utils/index');
const { Scalar, utils } = require('ffjavascript');
const circomlib = require('circomlib');
const crypto = require('crypto');
const merkleTree = require('fixed-merkle-tree');
const snarkjs = require('snarkjs');
const bigInt = require('./utils/bigInt');
const assert = require('assert');
const { callDataToArgs } = require('./utils/snark_utils');

const { unstringifyBigInts, stringifyBigInts } = utils;

const privateKey =
  '13139291465511710102474669453589139498179604995626650459882535211852380949664';

const votingKey =
  '20835832726222637243907351991763794635730990235607240607147891109783685482881';

const nullifier =
  '6717990157496733324101424064208458279147526003964834776659927355672015802007';

const pedersenHash = (data) =>
  circomlib.babyJub.unpackPoint(circomlib.pedersenHash.hash(data))[0];

const buff248 = (buf) => {
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

//   const generateMerkleProof
//    Promise<{
//     pathElements: Array<any>,
//     pathIndices: Array<any>,
//     root: any,
// } >

const generateMerkleProof = async (zKey) => {
  // Get all deposit events from smart contract and assemble merkle tree from them
  console.log('Getting current state from Votium contract');

  const wallet = await getWallet();

  const contract = await getContract(wallet);

  const eventsFilter = contract.filters.Deposit();
  const events = await contract.queryFilter(eventsFilter);

  const leaves = events
    .sort((a, b) => a.args.leafIndex - b.args.leafIndex)
    .map((e) => e.args.vKey);

  const tree = new merkleTree(20, leaves);

  // 0x1b5830ab6bd0439675dc82adb33df83ff84d743b79e816def807d903dc9becaf

  // Find current commitment in the tree
  const depositEvent = events.find((e) => e.args.vKey === toHex(zKey));

  const leafIndex = depositEvent ? depositEvent.args.leafIndex : -1;

  // Validate that our data is correct
  const root = tree.root();
  const isValidRoot = await contract.isKnownRoot(toHex(root));

  assert(isValidRoot === true, 'Merkle tree is corrupted');
  assert(leafIndex >= 0, 'The deposit is not found in the tree');

  // Compute merkle proof of our commitment
  const { pathElements, pathIndices } = tree.path(leafIndex);

  return { pathElements, pathIndices, root: tree.root() };
};

const withdraw = async (vKey) => {
  const { pathElements, pathIndices, root } = await generateMerkleProof(vKey);

  const input = {
    privateKey: unstringifyBigInts(privateKey),
    vKey: unstringifyBigInts(votingKey),
    nullifier: unstringifyBigInts(nullifier),
    vote: 1,
    root: root,
    pathElements: pathElements,
    pathIndices: pathIndices,
  };

  // console.log(
  //   `
  //   privateKey: "${unstringifyBigInts(privateKey)}",
  //   vKey: "${unstringifyBigInts(votingKey)}",
  //   nullifier: "${unstringifyBigInts(nullifier)}",
  //   vote: "1",
  //   root: "${root}",
  //   pathElements: "${pathElements}",
  //   pathIndices: "${pathIndices}",
  //   `
  // );

  console.log('Generating SNARK proof');
  console.time('Proof time');

  const { proof, publicSignals } = await snarkjs.plonk.fullProve(
    input,
    'circuit.wasm',
    'circuit_final.zkey'
  );

  console.timeEnd('Proof time');

  const callData = await snarkjs.plonk.exportSolidityCallData(
    unstringifyBigInts(proof),
    unstringifyBigInts(publicSignals)
  );

  // const { proofData, pubSignals: pSig } = callDataToArgs(callData);

  // try {
  //   const wallet = await getWallet();
  //   const contract = await getContract(wallet);

  //   await contract.vote(proofData, pSig, nullifier, 1);
  // } catch (err) {
  //   console.log('vote has already voted', err);
  // }

  console.log('-------------------------------');
  console.log(callData);
  console.log('-------------------------------');
};

const main = async () => {
  const wallet = await getWallet();
  const contract = await getContract(wallet);

  const privateKey = '';

  await withdraw(votingKey);

  // const txReciet = await (await contract.addVotingKey(toHex(votingKey))).wait();

  // const { pathElements, pathIndices, root } = await generateMerkleProof(
  //   votingKey
  // );
  // console.log(toHex(root));
  // console.log(pathIndices, pathElements);

  // console.log(await contract.getLastRoot());
};

main();

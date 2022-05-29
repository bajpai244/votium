/** @format */

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');
const hasher_data = require('./data/Hasher.json');
const { getWallet } = require('./utils/index');

async function main() {
  const wallet = await getWallet();

  const Verifier = await hre.ethers.getContractFactory('PlonkVerifier', wallet);
  const verifier = await (await Verifier.deploy()).deployed();

  const timer = (sec) =>
    new Promise((resolve) => {
      setTimeout(
        () => {
          resolve();
        },
        sec ? sec : 2000
      );
    });

  await timer();

  const txReciept = await (
    await wallet.sendTransaction({
      from: wallet.address,
      data: hasher_data.bytecode,
      value: 0,
    })
  ).wait();

  const hasherAddress = txReciept.contractAddress;

  await timer();

  const Identifier = await hre.ethers.getContractFactory('Votium', wallet);

  const votium = await (
    await Identifier.deploy(verifier.address, hasherAddress, 20)
  ).deployed();

  console.log('Votium =>', votium.address);
  console.log('Verifier =>', verifier.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

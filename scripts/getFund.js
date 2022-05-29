/** @format */

const { ethers } = require('hardhat');
const { eoa } = require('./data/index');
const { provider } = require('./utils/index');

const main = async () => {
  const tx = {
    to: eoa,
    value: ethers.utils.parseEther('80.0'),
  };

  const wallet = new ethers.Wallet(
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    provider
  );

  // const signedTx = wallet.signTransaction(tx);

  await (await wallet.sendTransaction(tx)).wait();
  console.log('balance on localhost => ', await provider.getBalance(eoa));
};

main();

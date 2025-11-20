require('dotenv').config();
const { ethers } = require('hardhat');

const ROUTER_ADDRESS = process.env.PCS_ROUTER || '0x9ac64cc6e4415144c455bd8e4837fea55603e5c3';

async function main() {
  const [seller] = await ethers.getSigners();
  console.log('Selling OMC using account:', seller.address);

  const fs = require('fs');
  const tokenAddress = fs.readFileSync('deployed-address.txt', 'utf8').trim();
  if (!tokenAddress) throw new Error('No deployed-address.txt or empty');

  const token = await ethers.getContractAt('MyToken', tokenAddress);
  const router = await ethers.getContractAt(
    ['function swapExactTokensForETH(uint amountIn,uint amountOutMin,address[] calldata path,address to,uint deadline) returns (uint[] memory amounts)'],
    ROUTER_ADDRESS
  );

  const amountIn = process.env.SELL_TOKENS || ethers.utils.parseUnits('1000', 18).toString(); // default 1,000 OMC
  const amountOutMin = 0;
  const WBNB = process.env.WBNB || '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd';
  const path = [tokenAddress, WBNB];

  // approve router
  console.log('Approving router to spend tokens...');
  const approveTx = await token.connect(seller).approve(ROUTER_ADDRESS, amountIn);
  await approveTx.wait();

  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
  const tx = await router.connect(seller).swapExactTokensForETH(amountIn, amountOutMin, path, seller.address, deadline, { gasLimit: 400000 });
  const rc = await tx.wait();
  console.log('Sell swap complete, tx:', rc.transactionHash);
}

main().catch((err) => { console.error(err); process.exitCode = 1; });

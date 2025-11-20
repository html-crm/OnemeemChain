require('dotenv').config();
const { ethers } = require('hardhat');

const ROUTER_ADDRESS = process.env.PCS_ROUTER || '0x9ac64cc6e4415144c455bd8e4837fea55603e5c3';

async function main() {
  const [buyer] = await ethers.getSigners();
  console.log('Buying OMC using account:', buyer.address);

  const fs = require('fs');
  const tokenAddress = fs.readFileSync('deployed-address.txt', 'utf8').trim();
  if (!tokenAddress) throw new Error('No deployed-address.txt or empty');

  const router = await ethers.getContractAt(
    ['function swapExactETHForTokens(uint amountOutMin,address[] calldata path,address to,uint deadline) payable returns (uint[] memory amounts)'],
    ROUTER_ADDRESS
  );

  const amountOutMin = 0; // set slippage tolerance as needed
  const bnbAmount = process.env.BUY_BNB || ethers.utils.parseEther('0.05').toString(); // default 0.05 BNB

  const WBNB = process.env.WBNB || '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd';
  const path = [WBNB, tokenAddress];
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  const tx = await router.connect(buyer).swapExactETHForTokens(amountOutMin, path, buyer.address, deadline, { value: bnbAmount, gasLimit: 300000 });
  const rc = await tx.wait();
  console.log('Swap complete, tx:', rc.transactionHash);
}

main().catch((err) => { console.error(err); process.exitCode = 1; });

require('dotenv').config();
const { ethers } = require('hardhat');

// PancakeSwap V2 Router (testnet commonly)
const ROUTER_ADDRESS = process.env.PCS_ROUTER || '0x9ac64cc6e4415144c455bd8e4837fea55603e5c3';
const WBNB_ADDRESS = process.env.WBNB || '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Adding liquidity using account:', deployer.address);

  // read deployed token address
  const fs = require('fs');
  const tokenAddress = fs.readFileSync('deployed-address.txt', 'utf8').trim();
  if (!tokenAddress) throw new Error('No deployed-address.txt or empty');

  const token = await ethers.getContractAt('MyToken', tokenAddress);
  const router = await ethers.getContractAt(
    ['function addLiquidityETH(address token,uint amountTokenDesired,uint amountTokenMin,uint amountETHMin,address to,uint deadline) payable returns (uint amountToken, uint amountETH, uint liquidity)','function WETH() view returns(address)'],
    ROUTER_ADDRESS
  );

  // amounts from env or defaults
  const tokenAmount = process.env.LIQ_TOKEN || ethers.utils.parseUnits('1000000', 18).toString(); // default 1,000,000 OMC
  const bnbAmount = process.env.LIQ_BNB || ethers.utils.parseEther('0.5').toString(); // default 0.5 BNB

  // approve router to spend tokens
  console.log('Approving router to spend tokens...');
  const approveTx = await token.connect(deployer).approve(ROUTER_ADDRESS, tokenAmount);
  await approveTx.wait();

  console.log('Calling addLiquidityETH on router...');
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes
  const tx = await router.connect(deployer).addLiquidityETH(
    token.address,
    tokenAmount,
    0,
    0,
    deployer.address,
    deadline,
    { value: bnbAmount, gasLimit: 800000 }
  );
  const receipt = await tx.wait();
  console.log('Liquidity added, tx hash:', receipt.transactionHash);
}

main().catch((err) => { console.error(err); process.exitCode = 1; });

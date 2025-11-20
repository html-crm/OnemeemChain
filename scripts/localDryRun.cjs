require('dotenv').config();
const { ethers } = require('hardhat');

async function main() {
  const [deployer, user] = await ethers.getSigners();
  console.log('Deployer:', deployer.address);
  console.log('User:', user.address);

  // Deploy token (smaller supply for local run)
  const initialSupply = ethers.utils.parseUnits('1000000', 18); // 1,000,000
  const MyToken = await ethers.getContractFactory('MyToken');
  const token = await MyToken.deploy('OneMeeemChain', 'OMC', initialSupply);
  await token.deployed();
  console.log('Token deployed at', token.address);

  // Deploy MockDEX
  const MockDEX = await ethers.getContractFactory('MockDEX');
  const dex = await MockDEX.deploy();
  await dex.deployed();
  console.log('MockDEX deployed at', dex.address);

  // initialize
  await dex.initialize(token.address);

  // transfer some tokens to deployer (already minted to deployer); send some to user for sell tests
  const transferTx = await token.transfer(user.address, ethers.utils.parseUnits('10000', 18));
  await transferTx.wait();
  console.log('Transferred 10,000 OMC to user for testing');

  // Approve DEX to pull tokens from deployer for liquidity
  const liqTokenAmount = ethers.utils.parseUnits('500000', 18); // 500k tokens
  console.log('Approving DEX to spend tokens for liquidity...');
  await token.approve(dex.address, liqTokenAmount);

  // Add liquidity: send 10 ETH along with 500k tokens
  console.log('Adding liquidity: 500,000 OMC + 10 ETH');
  const addTx = await dex.addLiquidity(liqTokenAmount, { value: ethers.utils.parseEther('10') });
  await addTx.wait();
  let reserves = await dex.getReserves();
  console.log('Reserves after liquidity - tokens:', ethers.utils.formatUnits(reserves[0],18), 'ETH:', ethers.utils.formatEther(reserves[1]));

  // Simulate buy: user buys with 0.5 ETH
  console.log('User buying with 0.5 ETH...');
  const buyTx = await dex.connect(user).buy({ value: ethers.utils.parseEther('0.5') });
  await buyTx.wait();
  const userTokenBal = await token.balanceOf(user.address);
  console.log('User token balance after buy:', ethers.utils.formatUnits(userTokenBal,18));

  // Simulate sell: user approves and sells 1000 OMC
  const sellAmount = ethers.utils.parseUnits('1000', 18);
  console.log('User approving DEX to spend 1,000 OMC then selling...');
  await token.connect(user).approve(dex.address, sellAmount);
  const sellTx = await dex.connect(user).sell(sellAmount);
  await sellTx.wait();
  const userEthBal = await ethers.provider.getBalance(user.address);
  console.log('User ETH balance after sell:', ethers.utils.formatEther(userEthBal));

  console.log('Local dry-run completed. Token:', token.address, 'DEX:', dex.address);
}

main().catch((err) => { console.error(err); process.exitCode = 1; });

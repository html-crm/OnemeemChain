import { createRequire } from 'module';
import dotenv from 'dotenv';
dotenv.config();

const hreModule = await import('hardhat');
const hre = hreModule.default ?? hreModule;
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with account:', deployer.address);

  const initialSupply = ethers.parseUnits('1000000', 18); // 1,000,000 tokens
  const MyToken = await ethers.getContractFactory('MyToken');
  const token = await MyToken.deploy('MyToken', 'MTK', initialSupply);

  await token.waitForDeployment();
  console.log('MyToken deployed to:', token.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

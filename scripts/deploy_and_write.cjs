require('dotenv').config();

module.exports = async function (hre) {
  const { ethers } = hre;

  const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with account:', deployer.address);

    // Token configuration
    const name = 'OneMeeemChain';
    const symbol = 'OMC';
    // 1 billion tokens with 18 decimals
    const initialSupply = ethers.utils.parseUnits('1000000000', 18);

    const MyToken = await ethers.getContractFactory('MyToken');
    const token = await MyToken.deploy(name, symbol, initialSupply);
    await token.deployed();

    console.log(`${name} (${symbol}) deployed to:`, token.address);

    fs.writeFileSync('deployed-address.txt', token.address);
    console.log('Wrote deployed address to deployed-address.txt');
};

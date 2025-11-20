import { expect } from 'chai';
import hardhat from 'hardhat';

const { ethers } = hardhat;

describe('MyToken', function () {
  it('deploys and mints initial supply to deployer', async function () {
    const [deployer] = await ethers.getSigners();

    const initialSupply = ethers.utils.parseUnits('1000000', 18);

    const MyToken = await ethers.getContractFactory('MyToken');
    const token = await MyToken.deploy('MyToken', 'MTK', initialSupply);
    await token.deployed();

    const balance = await token.balanceOf(deployer.address);
    expect(balance.toString()).to.equal(initialSupply.toString());
  });
});

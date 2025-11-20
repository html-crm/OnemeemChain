require('dotenv').config();
require('@nomiclabs/hardhat-ethers');

const { PRIVATE_KEY, BSC_MAINNET_RPC, BSC_TESTNET_RPC } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.20',
  networks: {
    bscMainnet: {
      url: BSC_MAINNET_RPC || 'https://bsc-dataseed.binance.org/',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
    },
    bscTestnet: {
      url: BSC_TESTNET_RPC || 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
    }
  }
};

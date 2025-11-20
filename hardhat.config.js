require('dotenv').config();
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-etherscan');

const { PRIVATE_KEY, BSC_MAINNET_RPC, BSC_TESTNET_RPC, BSCSCAN_API_KEY } = process.env;

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
  },
  etherscan: {
    // BscScan API key
    apiKey: BSCSCAN_API_KEY || ''
  }
};
/**
 * Minimal Hardhat configuration to satisfy CLI requirement.
 * Adjust solidity version or add plugins/networks as needed.
 */
import 'dotenv/config';

const config = {
  solidity: '0.8.20',
};

export default config;

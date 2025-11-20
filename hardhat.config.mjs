import 'dotenv/config';
import '@nomicfoundation/hardhat-toolbox';

const { PRIVATE_KEY, BSC_MAINNET_RPC, BSC_TESTNET_RPC, BSCSCAN_API_KEY } = process.env;

/** Clean ESM Hardhat config for BSC */
export default {
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
    apiKey: BSCSCAN_API_KEY || ''
  }
};

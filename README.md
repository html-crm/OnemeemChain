# my-bsc-token

Minimal BSC token project using Hardhat (v2), OpenZeppelin and ethers v5.

Quickstart

1. Install dependencies:

```powershell
cd my-bsc-token
npm install --legacy-peer-deps
```

2. Create `.env` from `.env.example` and fill `PRIVATE_KEY` and RPC endpoints.

# OneMeeemChain (OMC)

This repository contains a minimal BSC token project using Hardhat (v2), OpenZeppelin Contracts and ethers v5.

Token summary
- Name: OneMeeemChain
- Symbol: OMC
- Total supply: 1,000,000,000 (1 billion) with 18 decimals
- Contract: OpenZeppelin ERC20 with initial mint to deployer

Quickstart

1. Install dependencies:

```powershell
cd my-bsc-token
npm install --legacy-peer-deps
```

2. Create `.env` from `.env.example` and fill `PRIVATE_KEY` and RPC endpoints.

3. Compile contracts:

```powershell
npx hardhat compile
```

4. Run tests (uses built-in Hardhat network):

```powershell
npx hardhat test test/run-MyToken.cjs
```

5. Deploy to BSC testnet or mainnet (example):

```powershell
# after filling .env
npx hardhat run scripts/deploy.cjs --network bscTestnet
npx hardhat run scripts/deploy.cjs --network bscMainnet
```

Verification on BscScan

1. Add `BSCSCAN_API_KEY` and `PRIVATE_KEY` to your `.env` file.
2. After deploying a contract, run the verifier (pass the deployed address and constructor args):

```powershell
# Example: verify deployed MyToken (OneMeeemChain) with constructor args
# initialSupply is 1e9 * 10^18 = 1000000000 followed by 18 decimals
npx hardhat verify --network bscTestnet <DEPLOYED_ADDRESS> "OneMeeemChain" "OMC" "1000000000000000000000000000"
```

Notes
- Keep `.env` out of source control. Use a secure secret manager for real deployments.
- This project uses Hardhat v2 + ethers v5 for stable plugin compatibility. Migrating to Hardhat v3 / ESM and ethers v6 is possible but requires changes; ask if you want that.

CI

- A GitHub Actions workflow is included to compile and test on push. There's also a tag-based workflow that can deploy and verify when repository secrets (`PRIVATE_KEY`, `BSC_TESTNET_RPC`, `BSC_MAINNET_RPC`, `BSCSCAN_API_KEY`) are provided.

If you'd like, I can:
- Update the CI workflow to deploy to testnet immediately on push to a specific branch.
- Prepare a one-click deployment script that runs locally and outputs the deployed address and ABI.
- Proceed to deploy to BSC testnet/mainnet if you provide the deployer private key (or set it as a GitHub secret) and confirm which network to use.

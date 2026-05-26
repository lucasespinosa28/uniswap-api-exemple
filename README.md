# Uniswap API Swap Example

This repository provides a practical, working example of how to integrate and use the [Uniswap Trade API](https://docs.uniswap.org/api/trading/swapping-api) using TypeScript and `ethers.js`. 

It serves as a reference implementation demonstrating the complete lifecycle of a token swap, including:
- Checking token allowances (`/check_approval`)
- Generating swap quotes (`/quote`)
- Handling Permit2 off-chain signatures
- Routing swap transactions via AMM Classic or UniswapX (`/swap` or `/order`)

## Prerequisites

- [Bun](https://bun.sh/) runtime installed.
- An API key from the [Uniswap Developer Dashboard](https://developers.uniswap.org/dashboard).

## Installation

1. Clone the repository.
2. Install the required dependencies:

```bash
bun install
```

## Configuration

Create a `.env` file in the root directory and add your credentials:

```env
API_URL=https://trade-api.gateway.uniswap.org/v1
API_KEY=your_uniswap_api_key
RPC_URL=your_blockchain_rpc_url
PRIVATE_KEY=your_wallet_private_key
```

*Note: Never commit your `.env` file with real private keys to version control.*

## Running the Example

To execute the example swap script, run:

```bash
bun run start
```

This will run the `src/main.ts` orchestrator, which sequentially runs through the approval, quoting, signing, and broadcasting steps required for a successful Uniswap API integration.

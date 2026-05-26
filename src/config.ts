export const config = {
  apiUrl: process.env.API_URL || "",
  apiKey: process.env.API_KEY || "",
  rpcUrl: process.env.RPC_URL || "",
  privateKey: process.env.PRIVATE_KEY || "",
  constants: {
    USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    WETH: "0x4200000000000000000000000000000000000006",
    chainID: 8453,
  },
};

if (!config.apiUrl) throw new Error("API_URL is not set");
if (!config.apiKey) throw new Error("API_KEY is not set");
if (!config.rpcUrl) throw new Error("RPC_URL is not set");
if (!config.privateKey) throw new Error("PRIVATE_KEY is not set");

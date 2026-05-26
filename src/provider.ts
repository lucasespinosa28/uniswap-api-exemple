import { ethers } from "ethers";
import { config } from "./config.js";

export const provider = new ethers.JsonRpcProvider(
  config.rpcUrl,
  config.constants.chainID
);
export const signer = new ethers.Wallet(config.privateKey, provider);

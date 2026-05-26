import { config } from "./config.js";
import { provider, signer } from "./provider.js";
import { checkApproval, getQuote, submitSwap, submitOrder } from "./api.js";
import { RoutingPreference, QuoteType } from "./types.js";

async function main() {
  try {
    const walletAddress = await signer.getAddress();
    const amount = (1e6).toString(); // 1 USDC
    const { USDC, WETH, chainID } = config.constants;

    console.log(`Starting swap for ${walletAddress} on chain ${chainID}`);

    // 1. Check Approval
    console.log("Checking approval...");
    const approvalRes = await checkApproval(
      walletAddress,
      amount,
      USDC,
      WETH,
      chainID
    );

    if (approvalRes.approval) {
      console.log("Approval required, sending transaction...");
      const tx = await signer.sendTransaction(approvalRes.approval);
      console.log(`Approval transaction broadcasted: ${tx.hash}`);
      await tx.wait();
      console.log("Approval transaction mined.");
    } else {
      console.log("No approval required.");
    }

    // 2. Get Quote
    console.log("Requesting quote...");
    const quoteRes = await getQuote(
      walletAddress,
      USDC,
      WETH,
      amount,
      chainID,
      RoutingPreference.BEST_PRICE,
      QuoteType.EXACT_INPUT
    );

    const { quote, permitData, routing } = quoteRes;
    console.log(`Received quote with routing: ${routing}`);

    // Validate quote expiration
    if (quote.orderInfo && quote.orderInfo.deadline) {
       const now = Math.floor(Date.now() / 1000);
       if (now > quote.orderInfo.deadline) {
           throw new Error("Quote has already expired.");
       }
    }

    // 3. Sign Permit Data (if required)
    let signature: string | undefined;
    if (permitData) {
      console.log("Signing permit data...");
      signature = await signer.signTypedData(
        permitData.domain,
        permitData.types,
        permitData.values
      );
      console.log("Permit data signed.");
    }

    // 4. Submit Swap or Order
    if (
      routing === "CLASSIC" ||
      routing === "WRAP" ||
      routing === "UNWRAP" ||
      routing === "BRIDGE"
    ) {
      console.log("Submitting swap...");
      const swapRes = await submitSwap(quote, routing, signature, permitData);

      if (swapRes.swap) {
        // Validate transaction data before broadcast
        if (!swapRes.swap.data || swapRes.swap.data === "" || swapRes.swap.data === "0x") {
          throw new Error("Invalid transaction: empty data field");
        }

        const txRequest = {
          ...swapRes.swap,
          gasLimit: (BigInt(swapRes.swap.gasLimit) * 110n) / 100n, // Add 10% buffer
        };
        const tx = await signer.sendTransaction(txRequest);
        console.log(
          `Transaction broadcasted: https://basescan.org/tx/${tx.hash}`
        );

        console.log("Waiting for transaction to be mined...");
        const receipt = await tx.wait();
        console.log(`Transaction mined in block ${receipt?.blockNumber}!`);
      } else {
         console.error("No swap data returned in response.");
      }
    } else if (
      routing === "DUTCH_V2" ||
      routing === "DUTCH_V3" ||
      routing === "PRIORITY"
    ) {
      console.log("Submitting order...");
      const orderRes = await submitOrder(quote, signature);
      console.log("Order submitted successfully:", orderRes);
    } else {
      console.error(`Unknown routing type: ${routing}`);
    }
  } catch (error) {
    console.error("An error occurred during the swap process:", error);
  }
}

main();

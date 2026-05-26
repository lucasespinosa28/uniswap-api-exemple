import { config } from "./config.js";
import type {
  ApprovalResponseJson,
  OrderResponseJson,
  QuoteResponseJson,
  SwapResponseJson,
  RoutingPreference,
  QuoteType,
} from "./types.js";

const commonHeaders = {
  "x-api-key": config.apiKey,
  "Content-Type": "application/json",
  Accept: "application/json",
};

export async function checkApproval(
  walletAddress: string,
  amount: string,
  tokenIn: string,
  tokenOut: string,
  chainId: number
): Promise<ApprovalResponseJson> {
  const response = await fetch(`${config.apiUrl}/check_approval`, {
    method: "POST",
    headers: {
      ...commonHeaders,
      "x-permit2-disabled": "true",
    },
    body: JSON.stringify({
      walletAddress,
      amount,
      token: tokenIn,
      chainId,
      tokenOut,
      tokenOutChainID: chainId,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `check_approval error: ${response.status} ${response.statusText}`
    );
  }

  return (await response.json()) as ApprovalResponseJson;
}

export async function getQuote(
  swapper: string,
  tokenIn: string,
  tokenOut: string,
  amount: string,
  chainId: number,
  routingPreference: RoutingPreference,
  quoteType: QuoteType
): Promise<QuoteResponseJson> {
  const response = await fetch(`${config.apiUrl}/quote`, {
    method: "POST",
    headers: commonHeaders,
    body: JSON.stringify({
      swapper,
      tokenInChainId: chainId,
      tokenOutChainId: chainId,
      tokenIn,
      tokenOut,
      amount,
      routingPreference,
      type: quoteType,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `quote error: ${response.status} ${response.statusText}`
    );
  }

  return (await response.json()) as QuoteResponseJson;
}

export async function submitSwap(
  quote: any,
  routing: string,
  signature?: string,
  permitData?: any
): Promise<SwapResponseJson> {
  const payload: any = { quote, routing };
  if (signature) payload.signature = signature;
  if (permitData) payload.permitData = permitData;

  const response = await fetch(`${config.apiUrl}/swap`, {
    method: "POST",
    headers: commonHeaders,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(
      `swap error: ${response.status} ${response.statusText} - ${errorBody}`
    );
  }

  return (await response.json()) as SwapResponseJson;
}

export async function submitOrder(
  quote: any,
  signature?: string
): Promise<OrderResponseJson> {
  const payload: any = { quote };
  if (signature) payload.signature = signature;

  const response = await fetch(`${config.apiUrl}/order`, {
    method: "POST",
    headers: commonHeaders,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(
      `order error: ${response.status} ${response.statusText} - ${errorBody}`
    );
  }

  return (await response.json()) as OrderResponseJson;
}

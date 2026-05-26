export type ApprovalResponseJson = {
  requestId: string;
  approval: {
    to: string;
    from: string;
    data: string;
    value: string;
    chainId: number;
  };
  cancel: null;
};

export type OrderResponseJson = {
  requestId: string;
  orderId: string;
  orderStatus: string;
};

export type QuoteResponseJson = {
  requestId: string;
  quote: {
    encodedOrder: string;
    orderId: string;
    orderInfo: {
      chainId: number;
      nonce: string;
      reactor: string;
      swapper: string;
      deadline: number;
      additionalValidationContract: string;
      additionalValidationData: string;
      decayStartTime: number;
      decayEndTime: number;
      exclusiveFiller: string;
      exclusivityOverrideBps: string;
      input: {
        startAmount: string;
        endAmount: string;
        token: string;
      };
      outputs: Array<{
        startAmount: string;
        endAmount: string;
        token: string;
        recipient: string;
      }>;
    };
    input: {
      amount: string;
      token: string;
      maximumAmount: string;
    };
    output: {
      amount: string;
      token: string;
      recipient: string;
      minimumAmount: string;
    };
    portionBips: number;
    portionAmount: string;
    portionRecipient: string;
    quoteId: string;
    slippageTolerance: number;
    classicGasUseEstimateUSD: string;
    aggregatedOutputs: Array<{
      token: string;
      amount: string;
      recipient: string;
      bps: number;
      minAmount: string;
    }>;
  };
  routing: string;
  permitTransaction: {
    to: string;
    from: string;
    data: string;
    value: string;
    gasLimit: string;
    chainId: number;
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
    gasPrice: string;
  };
  permitData?: {
    domain: Record<string, any>;
    values: Record<string, any>;
    types: Record<string, any>;
  } | null;
  permitGasFee: string;
};

export type SwapResponseJson = {
  requestId: string;
  swap: {
    to: string;
    from: string;
    data: string;
    value: string;
    gasLimit: string;
    chainId: number;
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
    gasPrice: string;
  };
  gasFee: string;
};

export enum RoutingPreference {
  BEST_PRICE = "BEST_PRICE",
  FASTEST = "FASTEST",
}

export enum QuoteType {
  EXACT_INPUT = "EXACT_INPUT",
  EXACT_OUTPUT = "EXACT_OUTPUT",
}

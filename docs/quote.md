---
name: uniswap-api/aggregator_quote
description: Get a quote
endpoint: POST /quote
base_url: https://trade-api.gateway.uniswap.org/v1
---

# POST /quote

Get a quote

## When to use

Requests a quote according to the specified swap parameters. This endpoint may be used to get a quote for a swap, a bridge, or a wrap/unwrap. The resulting response includes a quote for the swap and the proposed route by which the quote was achieved. The response will also include estimated gas fees for the proposed quote route. If the proposed route is via a Uniswap Protocol pool, the response may include a permit2 message for the swapper to sign prior to making a /swap request. The proposed route will also be simulated. If the simulation fails, the response will include an error message or `txFailureReason`.

Certain routing options may be whitelisted by the requestor through the use of the `protocols` field. Further, the requestor may ask for the best price route or for the fastest price route through the 'routingPreference' field. Note that the fastest price route refers to the speed with which a quote is returned, not the number of transactions that may be required to get from the input token and chain to the output token and chain. Further note that all `routingPreference` values except for `FASTEST` and `BEST_PRICE` are deprecated. For more information on the `protocols` and `routingPreference` fields, see the [Token Trading Workflow](https://uniswap-docs.readme.io/reference/trading-flow#swap-routing) explanation of Swap Routing.

API integrators using this API for the benefit of customer end users may request a service fee be taken from the output token and deposited to a fee collection address. To request this, please reach out to your Uniswap Labs contact. This optional fee is associated to the API key and is always taken from the output token. Note if there is a fee and the `type` is `EXACT_INPUT`, the output amount quoted will **not** include the fee subtraction. If there is a fee and the `type` is `EXACT_OUTPUT`, the input amount quoted will **not** include the fee addition. Instead, in both cases, the fee will be recorded in the `portionBips` and `portionAmount` fields.

Native ETH on UniswapX: UniswapX routes (e.g. `DUTCH_V2`, `DUTCH_V3`, `PRIORITY`) can use native ETH as the input token by setting `tokenIn` to the native currency address (e.g. `0x0000000000000000000000000000000000000000`) and passing `x-erc20eth-enabled: true`. Native ETH input on UniswapX requires wallet support for EIP-7914, a smart wallet activated on your desired network, and a sufficient native allowance (set via /swap_7702 if x-erc20eth-enabled header is set to `true`). If these requirements are not met, UniswapX quotes for native input may be omitted and the response may fall back to `CLASSIC` routing instead.

## Request

```
POST https://trade-api.gateway.uniswap.org/v1/quote
Content-Type: application/json
x-api-key: required
```

### Required parameters

| Name | Type | Enum | Description |
|------|------|------|-------------|
| `type` | enum | EXACT_INPUT, EXACT_OUTPUT | The handling of the `amount` field. `EXACT_INPUT` means the requester will send the specified `amount` of input tokens a |
| `amount` | string |  | The quantity of tokens denominated in the token's base units. (For example, for an ERC20 token one token is 1x10^18 base |
| `tokenInChainId` | enum | 1, 10, 56, 130, 137, ... | The unique ID of the blockchain. For a list of supported chains see the [FAQ](https://api-docs.uniswap.org/guides/faqs). |
| `tokenOutChainId` | enum | 1, 10, 56, 130, 137, ... | The unique ID of the blockchain. For a list of supported chains see the [FAQ](https://api-docs.uniswap.org/guides/faqs). |
| `tokenIn` | string |  | The token which will be sent, specified by its token address. For a list of supported tokens, see the [FAQ](https://api- |
| `tokenOut` | string |  | The token which will be received, specified by its token address. For a list of supported tokens, see the [FAQ](https:// |
| `swapper` | string |  | The wallet address which will be used to send the token. |

### Optional parameters

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `x-universal-router-version` | enum | 2.0 | The version of the Universal Router to use for the swap journey. *MUST* be consistent throughout the |
| `x-erc20eth-enabled` | boolean | false | Enable native ETH input support for UniswapX via ERC20-ETH (EIP-7914). When set to true and `tokenIn |
| `x-permit2-disabled` | boolean | false | Disables the Permit2 approval flow. When set to `true`, `permitData` is returned as `null` and the h |
| `generatePermitAsTransaction` | boolean | false | Indicates whether you want to receive a permit2 transaction to sign and submit onchain, or a permit  |
| `slippageTolerance` | number |  | The slippage tolerance as a percentage up to a maximum of two decimal places. For Uniswap Protocols  |
| `autoSlippage` | enum |  | The auto slippage strategy to employ. For Uniswap Protocols (v2, v3, v4) the auto slippage will be a |
| `routingPreference` | enum | BEST_PRICE | The `routingPreference` specifies the preferred strategy to determine the quote. If the `routingPref |
| `protocols` | enum[] |  | The protocols to use for the swap/order. If the `protocols` field is defined, then you can only set  |
| `hooksOptions` | enum |  | The hook options to use for V4 pool quotes. `V4_HOOKS_INCLUSIVE` will get quotes for V4 pools with o |
| `spreadOptimization` | enum | EXECUTION | For UniswapX swaps, when set to `EXECUTION`, quotes optimize for looser spreads at higher fill rates |
| `urgency` | enum | UrgencyWithOverrides |  | The urgency impacts the estimated gas price of the transaction. The higher the urgency, the higher t |
| `permitAmount` | enum | FULL | For Uniswap Protocols (v2, v3, v4) swaps, specify the input token spend allowance (e.g. quantity) to |
| `recipient` | string |  | (optional) The wallet address which will receive the output of the swap. If not provided, the output |
| `integratorFees` | object[] |  | Optional integrator fee configuration. When provided, the specified fee is applied to the swap inste |

## Example

```bash
curl --request POST \
  --url 'https://trade-api.gateway.uniswap.org/v1/quote' \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: YOUR_API_KEY' \
  --header 'x-universal-router-version: 2.0' \
  --header 'x-erc20eth-enabled: false' \
  --header 'x-permit2-disabled: false' \
  --data '{
  "type": "EXACT_INPUT",
  "amount": "1000000000",
  "tokenInChainId": 1,
  "tokenOutChainId": 1,
  "tokenIn": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  "tokenOut": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  "swapper": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "slippageTolerance": 0.5
}'
```

```typescript
const response = await fetch("https://trade-api.gateway.uniswap.org/v1/quote", {
  method: 'POST',
  headers: {
      "Content-Type": "application/json",
      "x-api-key": "YOUR_API_KEY",
      "x-universal-router-version": "2.0",
      "x-erc20eth-enabled": "false",
      "x-permit2-disabled": "false"
  },
  body: JSON.stringify({
      "type": "EXACT_INPUT",
      "amount": "1000000000",
      "tokenInChainId": 1,
      "tokenOutChainId": 1,
      "tokenIn": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "tokenOut": "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      "swapper": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      "slippageTolerance": 0.5
  }),
})

const data = await response.json()
console.log(data)
```

## Workflow

Part of the swap flow:
1. `POST /quote` — get a price quote ← **this endpoint**
2. `POST /check_approval` — verify token allowance
3. `POST /swap` — execute the trade

## Common errors

- **403** — missing or invalid `x-api-key` header
- **400** — missing required parameter or invalid value
- **429** — rate limit exceeded, back off and retry

## Important

- Amounts use **base units** (e.g., 1 USDC = `1000000` because USDC has 6 decimals)
- Token addresses must be valid checksummed Ethereum addresses
- Common chain IDs: 1 (Ethereum), 10 (Optimism), 137 (Polygon), 42161 (Arbitrum), 8453 (Base)

## AI Skills

For a richer experience in Claude Code or Cursor:
- `npx skills add uniswap/uniswap-trading --skill swap-integration` — Full swap flow integration for apps
- `npx skills add uniswap/uniswap-driver --skill swap-planner` — Plan swaps with deep links

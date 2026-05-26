---
name: uniswap-api/check_approval
description: Check if token approval is required
endpoint: POST /check_approval
base_url: https://trade-api.gateway.uniswap.org/v1
---

# POST /check_approval

Check if token approval is required

## When to use

Allows the requestor to check if the `walletAddress` has the required approval to transact the `token` up to the `amount` specified. If the `walletAddress` does not have the required approval, the response will include a transaction to approve the token spend. If the `walletAddress` has the required approval, the response will return the approval with a `null` value. If the parameter `includeGasInfo` is set to `true` and an approval is needed, then the response will include both the transaction and the gas fee for the approval transaction.

Certain tokens may require that approval be reset before approving a new spend amount. If this condition is detected for the `walletAddress` and `token`, the response will include the necessary approval cancellation in the `cancel` paragraph. When `cancel` is not applicable, the paragraph will have a `null` value.

## Request

```
POST https://trade-api.gateway.uniswap.org/v1/check_approval
Content-Type: application/json
x-api-key: required
```

### Required parameters

| Name | Type | Enum | Description |
|------|------|------|-------------|
| `walletAddress` | string |  | The wallet address which will be used to send the token. |
| `token` | string |  | The token which will be sent, specified by its token address. For a list of supported tokens, see the [FAQ](https://api- |
| `amount` | string |  | The quantity of tokens denominated in the token's base units. (For example, for an ERC20 token one token is 1x10^18 base |
| `chainId` | enum | 1, 10, 56, 130, 137, ... | The unique ID of the blockchain. For a list of supported chains see the [FAQ](https://api-docs.uniswap.org/guides/faqs). |

### Optional parameters

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `x-permit2-disabled` | boolean | false | Disables the Permit2 approval flow. When set to `true`, `permitData` is returned as `null` and the h |
| `urgency` | enum | UrgencyWithOverrides |  | The urgency impacts the estimated gas price of the transaction. The higher the urgency, the higher t |
| `includeGasInfo` | boolean | false | If set to `true`, the response will include the estimated gas fee for the proposed transaction. |
| `tokenOut` | string |  | The token which will be received, specified by its token address. For a list of supported tokens, se |
| `tokenOutChainId` | enum | 1 | The unique ID of the blockchain. For a list of supported chains see the [FAQ](https://api-docs.unisw |

## Example

```bash
curl --request POST \
  --url 'https://trade-api.gateway.uniswap.org/v1/check_approval' \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: YOUR_API_KEY' \
  --header 'x-permit2-disabled: false' \
  --data '{
  "walletAddress": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "token": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  "amount": "1000000000",
  "chainId": 1
}'
```

```typescript
const response = await fetch("https://trade-api.gateway.uniswap.org/v1/check_approval", {
  method: 'POST',
  headers: {
      "Content-Type": "application/json",
      "x-api-key": "YOUR_API_KEY",
      "x-permit2-disabled": "false"
  },
  body: JSON.stringify({
      "walletAddress": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      "token": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "amount": "1000000000",
      "chainId": 1
  }),
})

const data = await response.json()
console.log(data)
```

## Workflow

Part of the swap flow:
1. `POST /quote` — get a price quote
2. `POST /check_approval` — verify token allowance ← **this endpoint**
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

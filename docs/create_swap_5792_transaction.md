---
name: uniswap-api/create_swap_5792_transaction
description: Create swap EIP 5792 calldata
endpoint: POST /swap_5792
base_url: https://trade-api.gateway.uniswap.org/v1
---

# POST /swap_5792

Create swap EIP 5792 calldata

## When to use

Create the EIP 5792 calldata for a swap transaction (including wrap/unwrap and bridging) against the Uniswap Protocols. If the `quote` parameter includes the fee parameters, then the calldata will include the fee disbursement. The gas estimates will be **more precise** when the response calldata would be valid if submitted on-chain.

## Request

```
POST https://trade-api.gateway.uniswap.org/v1/swap_5792
Content-Type: application/json
x-api-key: required
```

### Required parameters

| Name | Type | Enum | Description |
|------|------|------|-------------|
| `quote` | ClassicQuote | WrapUnwrapQuote | BridgeQuote |  |  |

### Optional parameters

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `x-universal-router-version` | enum | 2.0 | The version of the Universal Router to use for the swap journey. *MUST* be consistent throughout the |
| `permitData` | object |  | the permit2 message object for the customer to sign to permit spending by the permit2 contract. |
| `deadline` | number |  | The unix timestamp at which the order will be reverted if not filled. |
| `urgency` | enum | UrgencyWithOverrides |  | The urgency impacts the estimated gas price of the transaction. The higher the urgency, the higher t |

### `permitData` fields

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `domain` | object |  |  |
| `values` | object |  |  |
| `types` | object |  |  |

## Example

```bash
curl --request POST \
  --url 'https://trade-api.gateway.uniswap.org/v1/swap_5792' \
  --header 'Content-Type: application/json' \
  --header 'x-api-key: YOUR_API_KEY' \
  --header 'x-universal-router-version: 2.0' \
  --data '{
  "quote": "<ClassicQuote | WrapUnwrapQuote | BridgeQuote>"
}'
```

```typescript
const response = await fetch("https://trade-api.gateway.uniswap.org/v1/swap_5792", {
  method: 'POST',
  headers: {
      "Content-Type": "application/json",
      "x-api-key": "YOUR_API_KEY",
      "x-universal-router-version": "2.0"
  },
  body: JSON.stringify({
      "quote": "<ClassicQuote | WrapUnwrapQuote | BridgeQuote>"
  }),
})

const data = await response.json()
console.log(data)
```

## Depends on

**Get a Quote** — call `POST /quote` first.
Pass the entire response body as the request body for this endpoint.

Part of the swap flow:
1. `POST /quote` — get a price quote
2. `POST /check_approval` — verify token allowance
3. `POST /swap` — execute the trade ← **this endpoint**

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

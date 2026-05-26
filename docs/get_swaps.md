---
name: uniswap-api/get_swaps
description: Get swaps status
endpoint: GET /swaps
base_url: https://trade-api.gateway.uniswap.org/v1
---

# GET /swaps

Get swaps status

## When to use

Get the status of swap or bridge transactions. Accepts on-chain transaction hashes (`txHashes`), ERC-4337 userOperation hashes (`userOpHashes`), or both. At least one of the two must contain at least one item.

## Request

```
GET https://trade-api.gateway.uniswap.org/v1/swaps
x-api-key: required
```

### Optional parameters

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `txHashes` | string[] |  | On-chain transaction hashes. At least one of `txHashes` or `userOpHashes` must be provided. |
| `userOpHashes` | string[] |  | ERC-4337 UserOperation hashes. At least one of `txHashes` or `userOpHashes` must be provided. |
| `chainId` | enum | 1 |  |

## Example

```bash
curl --request GET \
  --url 'https://trade-api.gateway.uniswap.org/v1/swaps' \
  --header 'x-api-key: YOUR_API_KEY'
```

```typescript
const response = await fetch("https://trade-api.gateway.uniswap.org/v1/swaps", {
  method: 'GET',
  headers: {
      "x-api-key": "YOUR_API_KEY"
  },
})

const data = await response.json()
console.log(data)
```

## Common errors

- **403** — missing or invalid `x-api-key` header
- **400** — missing required parameter or invalid value
- **429** — rate limit exceeded, back off and retry

## Important

- Amounts use **base units** (e.g., 1 USDC = `1000000` because USDC has 6 decimals)
- Token addresses must be valid checksummed Ethereum addresses
- Common chain IDs: 1 (Ethereum), 10 (Optimism), 137 (Polygon), 42161 (Arbitrum), 8453 (Base)

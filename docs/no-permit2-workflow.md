# Swapping with Proxy Approval (/docs/trading/swapping-api/concepts/no-permit2-workflow)

Use the Uniswap API proxy approval flow when Permit2 signing is unavailable and you need a compatibility swap path.

## Swapping Without Permit2
The Uniswap API supports an alternative swap flow that does not require Permit2 signatures. This option is available for integrators that cannot support Permit2 signing flows due to infrastructure constraints.

In this flow, the swapping wallet grants a standard ERC-20 approval directly to a proxy contract, which then routes the swap through the Universal Router. This allows integrators to maintain a traditional approve to swap transaction flow without generating a Permit2 signature.

However, **using the [Permit2 flow](/docs/trading/swapping-api/concepts/permit2) whenever possible is recommended**, as it provides better security and a more flexible approval model for users.

## When to Use Proxy Approval
The no-Permit2 flow may be appropriate if:

* Your infrastructure requires a strict approve —> swap transaction sequence
* Your system cannot generate Permit2 signatures
* Your wallet or signing system does not support EIP-712 signing

## How the Proxy Approval Flow Works
Instead of using Permit2 approvals, users approve a proxy contract that forwards the swap to the Universal Router.

The transaction flow becomes:

1. User approves the proxy contract for the input token
2. The swap transaction is sent to the proxy contract
3. The proxy contract forwards execution to the Universal Router

The proxy contract acts as a thin wrapper around the Universal Router and does not change routing or pricing behavior.

From a technical standpoint, the flow looks identical to a permit2 workflow. You continue to make `/check_approval`, `/quote`, and `/swap` requests:

1. Your application calls `/check_approval` with `x-permit2-enabled: false` in the header
2. The API returns an approval transaction for the proxy contract (if necessary)
3. The swapping wallet (your user) signs the transaction and you broadcast it
4. Your application calls `/quote` with `x-permit2-enabled: false` in the header
5. The API returns a quote and route. `permitData` is always `null`
6. Your application calls `/swap` with `x-permit2-enabled: false` in the header to generate a final swap calldata
7. The swapping wallet (your user) signs the swap transaction and you broadcast it

## Enabling the Proxy Approval Flow
The Uniswap API exposes a request header that disables Permit2 behavior: `x-permit2-enabled: false`

When this header is included, the API switches to the proxy approval model. This affects three endpoints:

| Endpoint         | Behavior                                                       |
| ---------------- | -------------------------------------------------------------- |
| /check\_approval | Returns ERC-20 approve calldata targeting the proxy contract   |
| /quote           | Does not include permitData                                    |
| /swap            | Swap transaction targets the proxy contract instead of Permit2 |

The proxy contract is deployed on all supported chains at `0x02E5be68D46DAc0B524905bfF209cf47EE6dB2a9`.

## Approval & Simulation Behavior
When using the proxy approval flow, the approval and simulation path differs from the standard Permit2 integration.

In the Permit2 flow, the API simulates three calls to account for the wallet's approval state:

1. approve(token to Permit2)
2. Permit2 approve to Universal Router
3. Swap execution

In the no-Permit2 flow, the simulation path is shorter because Permit2 is not involved:

1. approve(token to proxy)
2. Swap execution via the proxy contract

Because of this difference, the swap call occurs earlier in the simulation sequence. Internally, this changes how gas estimation and validation are calculated for the swap transaction. From an integrator perspective, no additional configuration is required beyond setting: `x-permit2-enabled: false`

The Uniswap API will automatically adjust approval checks, simulation behavior, and gas estimation to match the proxy-based swap flow.

## Transaction Flow Comparison
Both flows ultimately execute swaps through the **Universal Router**, but the approval model differs as shown below:

## Permit2 flow (recommended)
1. Wallet approves Permit2 for token spend (token to Permit2)
2. Permit2 message signature sets amount of token Permit2 can spend in a transaction
3. swap via Universal Router

## Proxy approval flow
1. Wallet approves proxy contract for token spend (token to proxy)
2. swap via proxy to Universal Router

## Why We Recommend Permit2 Over Proxy Approval
Permit2 provides important security and usability advantages over the proxy approval workflow.

## 1. Reduced approval risk
Traditional ERC-20 approvals (e.g. proxy approval) grant persistent unlimited token allowances to a contract. If a contract is compromised, those approvals remain active. This is the most common attack vector for malicious actors to drain victim wallets.

Permit2 enables signature-based approvals that are scoped to a specific swap, reducing long-lived approval risk.

## 2. Fewer wallet transactions
Permit2 allows approval and swap authorization to be combined into a single transaction flow. This improves user experience by reducing unnecessary approval transactions. One long-lived Permit2 approval can be reused with new offchain (e.g. non-transaction) signatures for each subsequent swap.

## 3. More flexible permissioning
Permit2 supports:

* Token allowances scoped to specific contracts
* Expiring approvals
* Signature-based authorization

This provides a safer and more flexible model compared to traditional ERC-20 approvals.

## 4. Better handling of fee-on-transfer tokens
Permit2 also avoids an extra token transfer that occurs in the no-Permit2 proxy flow.

* In the standard Permit2 flow, tokens move directly from the wallet to the Universal Router in a single transfer.
* In the proxy approval flow, tokens are first transferred from the wallet to the proxy contract, and then forwarded to the Universal Router.

This additional transfer causes the fee on transfer to apply twice, once in the transfer to the proxy contract and again in the transfer to Universal Router. This results in worse execution for the user.

Using Permit2 avoids this extra transfer step and helps ensure more consistent execution across tokens with non-standard transfer behavior.

## 5. Ecosystem standard
Permit2 is widely adopted across the Ethereum ecosystem and is the default swap flow used by the Uniswap interface. Using Permit2 ensures your integration follows the same security model used by the broader Uniswap ecosystem.

## Recommendation
If your system supports EIP-712 signing, we recommend implementing the Permit2 flow. The no-Permit2 flow should be considered a compatibility option for systems that cannot support Permit2 signatures.

For guidance on the recommended integration, see the [Permit2 guide](/docs/trading/swapping-api/concepts/permit2).

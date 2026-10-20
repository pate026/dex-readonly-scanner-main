import "dotenv/config";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
const rpcUrl = process.env.PUBLIC_BASE_RPC_URL;
if (!rpcUrl) throw new Error("RPC puuttuu");
const client = createPublicClient({
chain: base,
transport: http(rpcUrl),
});
const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const abi = [{
type: "function",
name: "decimals",
stateMutability: "view",
inputs: [],
outputs: [{ type: "uint8" }],
}];
const decimals = await client.readContract({
address: USDC,
abi,
functionName: "decimals",
});
console.log("USDC decimals:", decimals);
const WETH = "0x4200000000000000000000000000000000000006";
const wethDecimals = await client.readContract({
address: WETH,
abi,
functionName: "decimals",
});
console.log("WETH decimals:", wethDecimals);
const QUOTER = "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a";
const quoterAbi = [{
type: "function",
name: "quoteExactInputSingle",
stateMutability: "nonpayable",
inputs: [{
name: "params",
type: "tuple",
components: [
{ name: "tokenIn", type: "address" },
{ name: "tokenOut", type: "address" },
{ name: "amountIn", type: "uint256" },
{ name: "fee", type: "uint24" },
{ name: "sqrtPriceLimitX96", type: "uint160" },
],
}],
outputs: [
{ name: "amountOut", type: "uint256" },
{ name: "sqrtPriceX96After", type: "uint160" },
{ name: "initializedTicksCrossed", type: "uint32" },
{ name: "gasEstimate", type: "uint256" },
],
}];
const amountIn = 1000n * 10n ** 6n;
const quote = await client.simulateContract({
address: QUOTER,
abi: quoterAbi,
functionName: "quoteExactInputSingle",
args: [{
tokenIn: USDC,
tokenOut: WETH,
amountIn,
fee: 500,
sqrtPriceLimitX96: 0n,
}],
});
const [amountOut] = quote.result;
console.log("WETH ulos:", amountOut);
console.log("WETH:", Number(amountOut) / 1e18);


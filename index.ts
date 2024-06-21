import { AORI_HTTP_DEVELOPMENT_API, AORI_TAKER_DEVELOPMENT_API, approveToken, ChainId, getDefaultZone, quoteAndRetryTakeOrder } from "@aori-io/sdk";
import { parseEther, Wallet } from "ethers";
import "dotenv/config";

const takerWallet = new Wallet(process.env.PRIVATE_KEY || "");

const USDT = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9";
const USDC = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";

console.log(`Starting - address: ${takerWallet.address}`);

(async () => {
    try {
        await approveToken(takerWallet, ChainId.ARBITRUM_MAINNET, USDT, getDefaultZone(ChainId.ARBITRUM_MAINNET), parseEther("100"));
        console.log("Successfully approved USDT");
    } catch (e) {
        console.log(e);
    }
})();

setInterval(async () => {

    try {
        // Attempt to sell 1 USDT for some USDC on Arbitrum every 10 seconds
        await quoteAndRetryTakeOrder(takerWallet, {
            inputToken: USDT,
            inputAmount: 1 * 10**6,
            outputToken: USDC,
            chainId: ChainId.ARBITRUM_MAINNET
        }, 1000, AORI_HTTP_DEVELOPMENT_API, AORI_TAKER_DEVELOPMENT_API);
        console.log("Success");
    } catch (e) {
        console.log(e);
    }
}, 10_000);
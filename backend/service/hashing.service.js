import crypto from "crypto";
import config from "../src/config/config.js";

export function createHashOf(input){
    const hashedInput=crypto.createHmac("sha256", config.CRYPTO_SECRET)
    .update(input).digest("hex");
    return hashedInput;
}
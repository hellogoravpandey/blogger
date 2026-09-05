import IORedis from "ioredis"
import config from "./config.js"

const connection = new IORedis({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    maxRetriesPerRequest: null,
});


export default connection;
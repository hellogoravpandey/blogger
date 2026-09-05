import {Queue} from "bullmq"
import connection from "../config/redis.config.js"

const emailQueue = new Queue("email", {
    connection
})

export async function scheduleAssetCleanup() {
    return emailQueue.add("cleanup-assets", {}, {
        jobId: "asset-cleanup-schedule",
        repeat: {
            every: 60 * 60 * 1000,
        },
        removeOnComplete: true,
        removeOnFail: 100,
    });
}

export default emailQueue;
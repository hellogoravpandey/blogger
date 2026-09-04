import { Worker } from "bullmq"
import connection from "../config/redis.config.js"
import sendMail from "../../service/welcomeEmail.service.js"

const emailWorker = new Worker(
    "email",  // queue_name in the redis connection
    async (job)=>{
        console.log("processing data", job.name);
        console.log("Data: ", job.data);
        await sendMail(job.data.to, job.data.username);
        return {
            success: true
        };
    },
    {
        connection,
        concurrency: 5
    }
)


//listeners
emailWorker.on("completed", (job)=>{
    console.log(`job ${job.name} completed`);
})

emailWorker.on("failed", (job)=>{
    console.log(`job ${job.name} failed `);
})


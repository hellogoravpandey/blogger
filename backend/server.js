import connectToMongoDb from "./src/datbase.js";
import config from "./src/config/config.js";
import authRouter from "./routes/auth.routes.js";
import blogRouter from "./routes/blog.routes.js";
import { createApp } from "./src/app.js";
import uploadRouter from "./routes/upload.routes.js";
import { scheduleAssetCleanup } from "./src/queues/email.queue.js";
import adminRouter from "./routes/admin.routes.js";

const app = createApp({ authRouter, blogRouter, uploadRouter, adminRouter });

//connection to mongoDB
connectToMongoDb();
scheduleAssetCleanup().catch((error) => {
  console.error("asset cleanup scheduling failed", error);
});

app.listen(config.PORT, () => {
  console.log(`server started at ${config.PORT}`);
});

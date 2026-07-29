import app from "./src/app.js";
import connectToMongoDb from "./src/datbase.js";
import authRouter from "./routes/auth.routes.js";
import blogRouter from "./routes/blog.routes.js";
import config from "./src/config/config.js";
import { checkForAuthentication } from "./middlewares/authentication.middleware.js";

//connection to mongoDB
connectToMongoDb();
//server listen
app.use("/api/auth", authRouter);
app.use("/api/blogs", checkForAuthentication, blogRouter);
app.listen(config.PORT, ()=>{
    console.log(`server started at ${config.PORT}`);
})


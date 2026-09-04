import app from "./src/app.js";
import connectToMongoDb from "./src/datbase.js";
import authRouter from "./routes/auth.routes.js";
import blogRouter from "./routes/blog.routes.js";
import config from "./src/config/config.js";
import { checkForAuthentication } from "./middlewares/authentication.middleware.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.middleware.js";

//connection to mongoDB
connectToMongoDb();

app.use("/api/auth", checkForAuthentication, authRouter);
app.use("/api/blogs", checkForAuthentication, blogRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`server started at ${config.PORT}`);
});

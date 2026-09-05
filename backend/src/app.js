import cookieParser from "cookie-parser";
import express, { urlencoded } from "express"
import morgan from "morgan"
import  fs from "fs"
import path from "path"
import cors from "cors"
import { checkForAuthentication } from "../middlewares/authentication.middleware.js";
import { errorHandler, notFoundHandler } from "../middlewares/errorHandler.middleware.js";

export function createApp({ authRouter = null, blogRouter = null, uploadRouter = null } = {}) {
	const app=express();
	app.use(express.json());
	app.use(urlencoded({extended: false}));

	if (process.env.NODE_ENV !== "test") {
		const accessLogStream = fs.createWriteStream(path.resolve("./access.log"), { flags: 'a' });
		app.use(morgan('combined', { stream: accessLogStream }));
	}

	app.use(cookieParser());
	app.use(express.static(path.resolve("./public")));
	app.use(cors({origin: "http://localhost:5173", credentials: true}));
	if (authRouter) app.use("/api/auth", checkForAuthentication, authRouter);
	if (blogRouter) app.use("/api/blogs", checkForAuthentication, blogRouter);
	if (uploadRouter) app.use("/api/uploads", checkForAuthentication, uploadRouter);
	app.use(notFoundHandler);
	app.use(errorHandler);
	return app;
}

export default createApp();
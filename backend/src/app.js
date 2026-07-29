import cookieParser from "cookie-parser";
import express, { urlencoded } from "express"
import morgan from "morgan"
import  fs from "fs"
import path from "path"

const app=express();
//file is open once 
//write it as a stream
const accessLogStream = fs.createWriteStream(path.resolve("./access.log"), { flags: 'a' });
app.use(express.json());
app.use(urlencoded({extended: false}));
app.use(morgan('combined', { stream: accessLogStream }));
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));
export default  app;
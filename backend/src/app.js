import cookieParser from "cookie-parser";
import express, { urlencoded } from "express"
import morgan from "morgan"
import  fs from "fs"
import path from "path"
import cors from "cors"


const app=express();
//file is open once 
//write it as a stream
const accessLogStream = fs.createWriteStream(path.resolve("./access.log"), { flags: 'a' });
app.use(express.json());
app.use(urlencoded({extended: false}));
app.use(morgan('combined', { stream: accessLogStream }));
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));
app.use(cors({origin: "http://localhost:5173", credentials: true}))
export default  app;
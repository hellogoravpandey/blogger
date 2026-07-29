import mongoose from "mongoose";
import config from "./config/config.js";
async function connectToMongoDb(){
    await mongoose.connect(config.MONGODB_URL)
    .then(()=>{
        console.log("connected to MongoDB with default url");
    })
    .catch((error)=>{
        console.log("MongoDB connection ERROR: ",error );
        
    })
}
export default connectToMongoDb;

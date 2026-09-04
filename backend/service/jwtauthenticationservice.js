import jwt from "jsonwebtoken";
import config from "../src/config/config.js"
export function setJWTToken(payload, expiry){
    //synchronously handled 
    const token=jwt.sign(
        payload,
         config.JWT_SECRET,
         { expiresIn: expiry });

    return token;
}


export function validateJWTToken(token){
    const decoded=jwt.verify(token, config.JWT_SECRET);
    return decoded;
}


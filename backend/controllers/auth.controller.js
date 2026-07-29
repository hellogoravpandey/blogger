import User from "../models/user.models.js";
import {createHashOf}  from "../service/hashing.service.js";
import { setJWTToken, validateJWTToken } from "../service/jwtauthenticationservice.js";
import Session from "../models/session.models.js";
import mongoose from "mongoose";
import { generateOTP, sendOtpVerificationEmail } from "../utils/OtpVerificationEmail.utils.js";
import OtpRecords from "../models/otp.models.js";

export async function register(req, res){
    const {username, email, password }=req.body;
    //hash password
    const hashedPassword=createHashOf(password);
    //create user
    try {
         const user=await User.create({
            username,
            email,
            password: hashedPassword
        }); 
        return res.status(201).json({
            message: "user successfully created"
        });
    } catch (error) {
        console.log("Error in creating user", error );
        return res.status(500).json({
            message: "Internal server error"
        });
    }
    
}

export async function sendOtp(req, res){
    //validated email
    const {email}=req.body;
    const user =await User.findOne({email});
    if(!user){
        return res.status(404).json({
            message: "user not found"
        })
    }
    if(user.isVerified){
        return res.status(409).json({
            message: "user already verified"
        })
    }
    //user not verified
    const otp=generateOTP();
    const hashedOtp=createHashOf(otp);
    const mongoSession=await mongoose.startSession();
    try {
        // transaction start
        mongoSession.startTransaction()
        // otp entry
        await OtpRecords.create([
            {
                user: user._id,
                otpHash: hashedOtp,
                expiresAt: new Date(Date.now() + 10*60*1000),  // in ms,
                purpose: "Email Verification"
            }
        ], {session: mongoSession});
        // send otp in  email
        console.log("receiptent email is",email);
        await sendOtpVerificationEmail(email.trim(), otp);
        //commit
        await mongoSession.commitTransaction();
        //otp send
        return res.status(200).json({
            "message": "successfully send the OTP"
        })
    } catch (error) {
        console.log("Error in OTP sending", error);
        //abort 
        await mongoSession.abortTransaction();
        return res.status(500).json({
            message: "Internal Server Error"
        })
    } finally{
        await mongoSession.endSession();
    }
}

export async function verifyOtp(req, res){   
    //validated email, ot
    const {email, otp}=req.body;
    console.log("email received", email);
    console.log("email received", otp);
    const user=await User.findOne({email: email});
    if(!user){
        return res.status(400).json({
            message: "user not found"
        })
    }
    if(user.isVerified){
        return res.status(409).json({
            message: "email already verified"
        })
    }
    
    // user exist and not verified
    const hashedOtp=createHashOf(otp);
    const otpDoc =await OtpRecords.findOne({
        user: user._id,
        otpHash: hashedOtp,
        expiresAt: {$lt: new Date()},
        purpose: "Email Verification"
    });

    if(!otp){
        return res.status(401).json({
            message: "otp wrong, unauthorized request"
        })
    };
    //otp matched found 
    // start mongoose session
    const mongoSession=await mongoose.startSession();
    try {
        //start transaction
        mongoSession.startTransaction();
        await User.updateOne(
            { _id: user._id },
              { $set: { isVerified: true} },
            { session: mongoSession }
        );
        await OtpRecords.deleteOne(
            {_id: otpDoc._id},
            { session: mongoSession }
        );
        await mongoSession.commitTransaction();
        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });
    } catch (error) {
        console.log("error in update user and delte otp", error);
        //abort
        await mongoSession.abortTransaction();
        return res.status(500).json({
            message: "internal Error"
        })
    }finally{
        //end the session before resturn ( try and catch )
       await mongoSession.endSession();
    }

}

export async function login(req, res){
    const {email, password }=req.body;
    //hash password
    const hashedPassword=createHashOf(password);
    const user=await User.findOne({
        email: email,
        password: hashedPassword,
    });
    //user not found
    if(!user){
        return res.status(401).json({
            message: "Unathorized user"
        });  
      };
    //user found but not verified
    // if(!user.isVerified){
    //     return res.status(401).json({
    //         message: "email verification required"
    //     });
    // }
    //user found
    const mongoSession=await mongoose.startSession()
    try {
        //start transcation
        mongoSession.startTransaction();
        const refreshToken=setJWTToken({
        user_id: user._id
        }, "7d");
        //hashed refreshtoken
        const hashedRefreshToken=createHashOf(refreshToken);
        const userSession=await Session.create([{
        user: user._id,
        refreshTokenHash: hashedRefreshToken,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
        }], {session: mongoSession});
        //accessToken
        const accessToken=setJWTToken({
        session_id: userSession[0]._id,
        user_id: user._id
        }, "15m");
        //sending refreshToken by cookie
        res.cookie("refreshToken", refreshToken, {
        httpOnly: true,  // client site js wont read
        secure: true,
        sameSite: true,
        maxAge: 7 * 24 * 60 * 60 * 1000   // milliseconds mei 
        });
        //commit the session db 
        await mongoSession.commitTransaction();
        //response 
        return res.status(201).json({
        message: "user  logged in ",
        acessToken: accessToken
        })
 
    } catch (error) {
        console.log("received Error: ", error);
        // abort the session transaction
        await mongoSession.abortTransaction();
        return res.status(500).json({
            message: "internal server error"
        })
    } finally{
         await mongoSession.endSession();
    }
}

export async function refreshToken(req, res){
   //create new refresh and access token
    const refreshToken=req.cookies?.refreshToken;
    if(!refreshToken){
        return res.status(401).json({
            message: "Unauthorized to access, no refresh token"
        })
    }
    //session
    //hashedrefreshtoken
    const refreshTokenHash=createHashOf(refreshToken);
    const session=await Session.findOne({
        refreshTokenHash,
        revoked: false
    })
    //verify, decode the access token
    const decoded=validateJWTToken(refreshToken);
    if(!decoded){
        return res.status(401).json({
            message: "Unauthorized to access, invalid token"
        })
    }

    //new refreshToken
    const newRefreshToken=setJWTToken({
        user_id: decoded.user_id
    }, '7d');
    //new token 
    const newAcessToken=setJWTToken({
        user_id: decoded.user_id
    }, '15m');

    //changing refreshToken in the session
    const newRefreshTokenHash=createHashOf(newRefreshToken);
    session.refreshTokenHash=newRefreshTokenHash;
    await session.save();
    //sendind the new refresh token
    res.clearCookie("refreshToken");
    res.cookie("refreshToken", newRefreshToken);
    //sending newAccessToken
    return res.status(200).json({
        message: "success",
        accessToken: newAcessToken
    })
}

export async function logout(req, res){
    const refreshToken=req.cookies?.refreshToken;
    if(!refreshToken){
        return res.status(401).json({
                message: "Unauthorized access"
            }
        )
    }; 
    //session delete ( for one logged session )
    //hashedrefreshToken
    const refreshTokenHash=createHashOf(refreshToken);
    const session=await Session.findOne({
        refreshTokenHash: refreshTokenHash,
        revoked: false
    })
    
    if(!session){
        return res.status(401).json({
            message: "unauthorized acess, invalid refresh token"
        });
    };  
    //session soft delete/ revoke
    session.revoked=true;
    await session.save();
    //clear cookie
    res.clearCookie("refreshToken");

    return res.status(200).json({
        message: "logout successfully"
    });

}
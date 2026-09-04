import User from "../models/user.models.js";
import {createHashOf}  from "../service/hashing.service.js";
import { setJWTToken, validateJWTToken } from "../service/jwtauthenticationservice.js";
import Session from "../models/session.models.js";
import mongoose from "mongoose";
import { generateOTP, sendOtpVerificationEmail } from "../utils/OtpVerificationEmail.utils.js";
import OtpRecords from "../models/otp.models.js";
import { deleteImage, uploadImage } from "../service/cloudinary.js";
import googleClient from "../src/config/google.config.js";
import emailQueue from "../src/queues/email.queue.js";
import {
    ConflictError,
    NotFoundRequestError,
    UnauthorizedRequestError,
} from "../utils/errorHandler.utils.js";


export async function getUserInfo(req, res){
        const user = await User.findOne({_id: req.user?.user_id})
        .select("username profileImageURL email isVerified bookmarks");
        if(!user){
            throw new UnauthorizedRequestError("No such user found");
        }

        return res.status(200).json({
            message: "success",
            user: user
        });
} 


export async function register(req, res){
    const {username, email, password }=req.body;
    const hashedPassword=createHashOf(password);
    let uploadedProfileImage=null;
    try {
        console.log("path of the profile image; ", req.file);
        if(req.file){
            uploadedProfileImage=await uploadImage(req.file.path);
        }
         const user=await User.create({
            username,
            email,
            password: hashedPassword,
            profileImageURL: uploadedProfileImage?.secure_url
        }); 
        await emailQueue.add("welcome-email", {
            to: email,
            username: username
        })
        return res.status(201).json({
            message: "user successfully created"
        });
    } catch (error) {
        console.log("Error in register controller: ", error );
        if(uploadedProfileImage){
            await deleteImage(uploadedProfileImage);
        }
        throw error;
    }
    
}

export async function sendOtp(req, res){
    const {email}=req.body;
    const user =await User.findOne({email});
    if(!user){
        throw new NotFoundRequestError("user not found");
    }
    if(user.isVerified){
        throw new ConflictError("user already verified");
    }
    const otp=generateOTP();
    const hashedOtp=createHashOf(otp);
    const mongoSession=await mongoose.startSession();
    try {
        mongoSession.startTransaction()
        await OtpRecords.create([
            {
                user: user._id,
                otpHash: hashedOtp,
                expiresAt: new Date(Date.now() + 10*60*1000),
                purpose: "Email Verification"
            }
        ], {session: mongoSession});
        console.log("receiptent email is",email);
        await sendOtpVerificationEmail(email.trim(), otp);
        await mongoSession.commitTransaction();
        return res.status(200).json({
            "message": "successfully send the OTP"
        })
    } catch (error) {
        console.log("Error in OTP sending", error);
        await mongoSession.abortTransaction();
        throw error;
    } finally{
        await mongoSession.endSession();
    }
}

export async function verifyOtp(req, res){   
    const {email, otp}=req.body;
    console.log("email received", email);
    console.log("email received", otp);
    const user=await User.findOne({email: email});
    if(!user){
        throw new NotFoundRequestError("user not found");
    }
    if(user.isVerified){
        throw new ConflictError("email already verified");
    }
    
    const hashedOtp=createHashOf(otp);
    const otpDoc =await OtpRecords.findOne({
        user: user._id,
        otpHash: hashedOtp,
        expiresAt: {$lt: new Date()},
        purpose: "Email Verification"
    });

    if(!otpDoc){
        throw new UnauthorizedRequestError("otp wrong, unauthorized request");
    };
    const mongoSession=await mongoose.startSession();
    try {
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
        await mongoSession.abortTransaction();
        throw error;
    }finally{
       await mongoSession.endSession();
    }

}

export async function login(req, res){
    console.log("inside logiin");
    const {email, password }=req.body;
    const hashedPassword=createHashOf(password);
    const user=await User.findOne({
        email: email,
        password: hashedPassword,
    });
    if(!user){
        throw new UnauthorizedRequestError("Unathorized user");
      };
    const mongoSession=await mongoose.startSession()
    try {
        mongoSession.startTransaction();
        const refreshToken=setJWTToken({
        user_id: user._id
        }, "7d");
        const hashedRefreshToken=createHashOf(refreshToken);
        const userSession=await Session.create([{
        user: user._id,
        refreshTokenHash: hashedRefreshToken,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
        }], {session: mongoSession});

        const accessToken=setJWTToken({
        session_id: userSession[0]._id,
        user_id: user._id
        }, "15m");
        res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
        });
        await mongoSession.commitTransaction();
        return res.status(201).json({
        message: "user  logged in ",
        acessToken: accessToken
        })
 
    } catch (error) {
        console.log("received Error: ", error);
        await mongoSession.abortTransaction();
        throw error;
    } finally{
         await mongoSession.endSession();
    }
}

export async function refreshToken(req, res){
    console.log("inside refreshToken");
    const refreshToken=req.cookies?.refreshToken;
    if(!refreshToken){
        throw new UnauthorizedRequestError("Unauthorized to access, no refresh token");
    }
    const refreshTokenHash=createHashOf(refreshToken);
    const session=await Session.findOne({
        refreshTokenHash,
        revoked: false
    })
    const decoded=validateJWTToken(refreshToken);
    if(!decoded){
        throw new UnauthorizedRequestError("Unauthorized to access, invalid token");
    }

    const newRefreshToken=setJWTToken({
        user_id: decoded.user_id
    }, '7d');
    const newAcessToken=setJWTToken({
        user_id: decoded.user_id
    }, '15m');

    const newRefreshTokenHash=createHashOf(newRefreshToken);
    session.refreshTokenHash=newRefreshTokenHash;
    await session.save();
    res.clearCookie("refreshToken");
    res.cookie("refreshToken", newRefreshToken);
    return res.status(200).json({
        message: "success",
        accessToken: newAcessToken
    })
}

export async function logout(req, res){
    const refreshToken=req.cookies?.refreshToken;
    if(!refreshToken){
        throw new UnauthorizedRequestError("Unauthorized access");
    }; 
    const refreshTokenHash=createHashOf(refreshToken);
    const session=await Session.findOne({
        refreshTokenHash: refreshTokenHash,
        revoked: false
    })
    
    if(!session){
        throw new UnauthorizedRequestError("unauthorized acess, invalid refresh token");
    };  
    session.revoked=true;
    await session.save();
    res.clearCookie("refreshToken");

    return res.status(200).json({
        message: "logout successfully"
    });

}



// will do this later 



// export async function googleLogin(req, res){
//     // generate a redirecting url 
//     // res.redirect(url) 
//     const authorizationUrl = googleClient(  {
//         access_type: "offline",
//         scope: [
//             "openid",
//             "email",
//             "profile"
//         ],
//         prompt: "select_account"
//     })

//     res.redirect(authorizationUrl);
// }


// export async function googleCallback(req, res){
//     try {
//         const {code} = req.query;
//         console.log("google send code: ", code);
//         const {tokens} = await googleClient.getToken(code);
//         googleClient.setCredentials(tokens)
//         console.log("google token received");

//         // verification of user 
//         const ticket = await googleClient.verifyIdToken({
//             idToken: tokens.id_token,
//             audience: process.env.GOOGLE_CLIENT_ID,
//             });
//         const payload = ticket.getPayload();
//         console.log("google user payload ", payload );
        
//         const user = await User.findOne({googleId: payload.sub});
//         if(!user){
//             user = await User.create({
//                 username: payload.name,
//                 email: payload.email,
//                 profileImageURL: payload.picture,
//                 isVerified: payload.email_verified,
//             })
//         }
//          // generate refreshToken 
//          const refreshToken =setJWTToken({
//            user_id: user._id
//         }, "7d");   
//         // generate accessToken 
//     } catch (error) {
//         console.log("google authentication error");

//         return res.status(500).json({
//             message: "Google authentication failed"
//         })
        
//     }
// }

import mongoose from "mongoose";

const OtpRecordsSchema=new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: "users",
            required: true
        },
        otpHash:{
            type: String,
            required: true,
            unique: true
        },
        expiresAt:{
            type: Date,
            required: true
        },
        attemps:{
            type: Number,
            default: 0
        },
        purpose: {
            type: String,
            enum: [
                "Email Verification",
                 "Password Reset"
                ], 
            required: true 
        }
    },{timestamps: true});

const OtpRecord=mongoose.model("otpRecords", OtpRecordsSchema);
export default OtpRecord;
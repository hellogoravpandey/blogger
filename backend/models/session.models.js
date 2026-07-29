import mongoose from "mongoose";
const sessionSchema=new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "user ref is required"],
    },
    refreshTokenHash: {
        type: String,
        required: [true, "refreshToken is required"],
    },
    ip:{
        type: String,
        required: [true, "ip is required"],
    },
    userAgent:{
        type: String,
        required: [true, "Username is required"],
    },
    revoked:{
        type: Boolean,
        default: "false"
    }
}, {timestamps: true});

const Session=mongoose.model("session", sessionSchema);
// exporting
export default Session;


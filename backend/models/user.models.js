import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username must be unique"]
    },
    profileImageURL: {
        type: String, 
        default: '/images/default_avatar.png'
    },
    email: {
        type: String, 
        required: [true, "Email is required"],
         unique: [true, "Email must be unique"]
    },
    password: {
        type: String, 
        required: [true, "password is required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    bookmarks:[
        {
            type: mongoose.Types.ObjectId,
            ref: "blogs"
        }
    ]

}, {timestamps: true});

const User=mongoose.model("users", userSchema);
// exporting
export default User;


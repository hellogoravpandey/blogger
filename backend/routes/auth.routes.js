import {Router} from "express";
import { register, login, refreshToken, logout, verifyOtp, sendOtp } from "../controllers/auth.controller.js";

import { validate } from "../middlewares/validation.middleware.js";
import { validateEmail, validateUsername, validatePassword, validateOtp } from "../validators/userAuth.validators.js";
import { uploadAvatar } from "../middlewares/multer.middleware.js";

const router=Router();


function requiredProfileImage(req, res, next){
    if(!req.file){
        return res.status(400).
        json({
            message: "profile image is required"
        });
    };
    next();
}


router.post("/register", (req, res, next)=>{
    uploadAvatar.single("profileImageURL")(req, res, (err)=>{
         if (err) {
            return res.status(400).json({
                message: err.message
            });
        }
        next();
    });},
    validate([
    {field: "email", validator: validateEmail},
    {field: "username", validator:validateUsername},
    {field: "password", validator:validatePassword},
]),requiredProfileImage, register);
router.post("/login", validate([
    {field: "email", validator: validateEmail},
    {field: "password", validator: validatePassword},
]), login);
router.post("/send-otp", validate([
    {field: "email", validator:validateEmail},
]), sendOtp);
router.post("/verify-otp", validate([
    {field: "otp", validator: validateOtp}
]), verifyOtp);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;
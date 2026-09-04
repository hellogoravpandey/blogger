import {Router} from "express";
import { register, login, refreshToken, logout, verifyOtp, sendOtp, getUserInfo } from "../controllers/auth.controller.js";

import { validate } from "../middlewares/validation.middleware.js";
import { validateEmail, validateUsername, validatePassword, validateOtp } from "../validators/userAuth.validators.js";
import { uploadAvatar } from "../middlewares/multer.middleware.js";
import { AppError, BadRequestError } from "../utils/errorHandler.utils.js";

const router=Router();


//register
router.post("/register", (req, res, next)=>{
    uploadAvatar.single("profileImage")(req, res, (err)=>{
         if (err) {
            return next(err instanceof AppError ? err : new BadRequestError(err.message));
        }
        next();
    });},
    validate([
    {field: "email", validator: validateEmail},
    {field: "username", validator:validateUsername},
    {field: "password", validator:validatePassword},
]), register);

//get me
router.get("/me", getUserInfo);

// login
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


// google oauth routes 
// router.get("/google", )
// router.get("/google/callback")
export default router;
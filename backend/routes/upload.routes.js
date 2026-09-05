import { Router } from "express";
import { uploadAsset } from "../controllers/asset.controller.js";
import { uploadInlineImage } from "../middlewares/multer.middleware.js";
import { AppError, BadRequestError } from "../utils/errorHandler.utils.js";

const router = Router();

router.post("/image", (req, res, next) => {
    uploadInlineImage.single("image")(req, res, (error) => {
        if (error) return next(error instanceof AppError ? error : new BadRequestError(error.message));
        next();
    });
}, uploadAsset);

export default router;
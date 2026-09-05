import Asset from "../models/asset.models.js";
import { deleteImage, uploadImage } from "../service/cloudinary.js";
import { BadRequestError, UnauthorizedRequestError } from "../utils/errorHandler.utils.js";

export async function uploadAsset(req, res) {
    if (!req.user) throw new UnauthorizedRequestError("login required to upload an image");
    if (!req.file) throw new BadRequestError("image file is required");
    if (!req.body.draftId) throw new BadRequestError("draftId is required");

    const upload = await uploadImage(req.file.path);
    try {
        const asset = await Asset.create({
            ownerId: req.user.user_id,
            storageKey: upload.storageKey,
            url: upload.url,
            draftId: req.body.draftId,
            status: "TEMPORARY",
        });

        return res.status(201).json({
            assetId: asset._id,
            url: asset.url,
        });
    } catch (error) {
        await deleteImage(upload);
        throw error;
    }
}
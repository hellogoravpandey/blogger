import Asset from "../models/asset.models.js";
import { deleteImage } from "./cloudinary.js";

const cleanupAgeMs = Number(process.env.ASSET_CLEANUP_AGE_MS || 24 * 60 * 60 * 1000);

export async function cleanupAssets(now = new Date()) {
    const cutoff = new Date(now.getTime() - cleanupAgeMs);
    const assets = await Asset.find({
        status: { $in: ["TEMPORARY", "UNUSED"] },
        updatedAt: { $lt: cutoff },
    });

    for (const asset of assets) {
        try {
            await deleteImage(asset.storageKey);
            await Asset.deleteOne({ _id: asset._id });
        } catch (error) {
            console.error(`asset cleanup failed for ${asset._id}`, error);
        }
    }

    return { scanned: assets.length };
}
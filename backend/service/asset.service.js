import mongoose from "mongoose";
import Asset from "../models/asset.models.js";
import { BadRequestError, ForbiddenRequestError, NotFoundRequestError } from "../utils/errorHandler.utils.js";

export async function validateDraftAssets({ assetIds, ownerId, draftId }) {
    if (assetIds.length === 0) return [];
    if (!draftId) throw new BadRequestError("draftId is required when content contains images");
    if (assetIds.some((assetId) => !mongoose.Types.ObjectId.isValid(assetId))) {
        throw new BadRequestError("content contains an invalid asset id");
    }

    const assets = await Asset.find({ _id: { $in: assetIds } });
    if (assets.length !== assetIds.length) {
        throw new NotFoundRequestError("one or more assets were not found");
    }

    for (const asset of assets) {
        if (asset.ownerId.toString() !== ownerId.toString()) {
            throw new ForbiddenRequestError("asset belongs to another user");
        }
        if (asset.status === "ATTACHED" || asset.draftId !== draftId) {
            throw new ForbiddenRequestError("asset does not belong to this draft");
        }
    }
    return assets;
}

export async function reconcileDraftAssets({ assetIds, ownerId, draftId }) {
    if (!draftId && assetIds.length === 0) return [];
    const assets = await validateDraftAssets({ assetIds, ownerId, draftId });
    await Asset.updateMany(
        { ownerId, draftId, status: { $in: ["TEMPORARY", "UNUSED"] }, _id: { $nin: assetIds } },
        { $set: { status: "UNUSED" } },
    );
    if (assetIds.length > 0) {
        await Asset.updateMany(
            { _id: { $in: assetIds } },
            { $set: { status: "TEMPORARY" } },
        );
    }
    return assets;
}

export async function attachDraftAssets({ assetIds, ownerId, draftId, blogId }) {
    await validateDraftAssets({ assetIds, ownerId, draftId });
    if (assetIds.length > 0) {
        await Asset.updateMany(
            { _id: { $in: assetIds }, ownerId, draftId },
            { $set: { status: "ATTACHED", blogId, draftId: null } },
        );
    }
}
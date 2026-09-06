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

export async function reconcileBlogAssets({ oldAssetIds, newAssetIds, ownerId, blogId, draftId, blogStatus }) {
    const oldIds = new Set(oldAssetIds);
    const newIds = new Set(newAssetIds);
    const addedIds = [...newIds].filter((assetId) => !oldIds.has(assetId));
    const removedIds = [...oldIds].filter((assetId) => !newIds.has(assetId));
    const allIds = [...newIds];

    if (allIds.some((assetId) => !mongoose.Types.ObjectId.isValid(assetId))) {
        throw new BadRequestError("content contains an invalid asset id");
    }

    const assets = allIds.length > 0
        ? await Asset.find({ _id: { $in: allIds } })
        : [];
    if (assets.length !== allIds.length) {
        throw new NotFoundRequestError("one or more assets were not found");
    }

    for (const asset of assets) {
        if (asset.ownerId.toString() !== ownerId.toString()) {
            throw new ForbiddenRequestError("asset belongs to another user");
        }

        const isExistingBlogAsset = asset.status === "ATTACHED"
            && asset.blogId?.toString() === blogId.toString();
        const isNewDraftAsset = (asset.status === "TEMPORARY" || asset.status === "UNUSED")
            && asset.draftId === draftId;

        if (!isExistingBlogAsset && !isNewDraftAsset) {
            throw new ForbiddenRequestError("asset cannot be attached to this blog");
        }
    }

    if (removedIds.length > 0) {
        await Asset.updateMany(
            { _id: { $in: removedIds }, ownerId, blogId, status: "ATTACHED" },
            { $set: { status: "UNUSED", blogId: null } },
        );
    }

    if (addedIds.length > 0) {
        const update = blogStatus === "published"
            ? { $set: { status: "ATTACHED", blogId, draftId: null } }
            : { $set: { status: "TEMPORARY", blogId: null, draftId } };
        await Asset.updateMany(
            { _id: { $in: addedIds }, ownerId, draftId, status: { $in: ["TEMPORARY", "UNUSED"] } },
            update,
        );
    }
}

export async function markBlogAssetsUnused(blogId) {
    await Asset.updateMany(
        { blogId, status: "ATTACHED" },
        { $set: { status: "UNUSED", blogId: null } },
    );
}
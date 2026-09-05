import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true,
    },
    storageKey: {
        type: String,
        required: true,
        unique: true,
    },
    url: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["TEMPORARY", "UNUSED", "ATTACHED"],
        default: "TEMPORARY",
        index: true,
    },
    draftId: {
        type: String,
        index: true,
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "blog",
        default: null,
        index: true,
    },
}, { timestamps: true });

const Asset = mongoose.model("asset", assetSchema);
export default Asset;
import Blog from "../models/blog.models.js";
import Comment from "../models/comment.models.js";
import Asset from "../models/asset.models.js";
import { UnauthorizedRequestError } from "../utils/errorHandler.utils.js";

export async function getUserDashboard(req, res) {
    if (!req.user) throw new UnauthorizedRequestError("login required");
    const ownerId = req.user.user_id;
    const [blogStats, commentCount, assetCount, recentBlogs] = await Promise.all([
        Blog.aggregate([
            { $match: { createdBy: ownerId } },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]),
        Comment.countDocuments({ createdBy: ownerId, isDeleted: false }),
        Asset.countDocuments({ ownerId }),
        Blog.find({ createdBy: ownerId })
            .sort({ createdAt: -1 }).limit(5).select("title status createdAt coverImageURL"),
    ]);
    const counts = blogStats.reduce((result, item) => ({ ...result, [item._id]: item.count }), {});
    return res.json({
        message: "success",
        stats: {
            totalBlogs: Object.values(counts).reduce((sum, count) => sum + count, 0),
            publishedBlogs: counts.published || 0,
            draftBlogs: counts.draft || 0,
            commentCount,
            assetCount,
        },
        recentBlogs,
    });
}
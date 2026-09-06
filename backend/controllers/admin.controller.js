import Asset from "../models/asset.models.js";
import Blog from "../models/blog.models.js";
import Comment from "../models/comment.models.js";
import User from "../models/user.models.js";
import { BadRequestError, ForbiddenRequestError, NotFoundRequestError } from "../utils/errorHandler.utils.js";

function boundaries() {
    const now = new Date();
    const today = new Date(now); today.setHours(0, 0, 0, 0);
    const week = new Date(today); week.setDate(week.getDate() - 7);
    const month = new Date(today); month.setDate(month.getDate() - 30);
    return { now, today, week, month };
}

export async function getAdminDashboard(req, res) {
    const { today, week, month } = boundaries();
    const [totalUsers, totalBlogs, totalComments, totalAssets, newUsersToday, newUsersWeek, newUsersMonth, newBlogsToday, newBlogsWeek, newBlogsMonth, byStatus, assetsByStatus, topAuthors, recentUsers, recentBlogs, recentComments, growthUsers, growthBlogs] = await Promise.all([
        User.countDocuments(), Blog.countDocuments(), Comment.countDocuments({ isDeleted: false }), Asset.countDocuments(),
        User.countDocuments({ createdAt: { $gte: today } }), User.countDocuments({ createdAt: { $gte: week } }), User.countDocuments({ createdAt: { $gte: month } }),
        Blog.countDocuments({ createdAt: { $gte: today } }), Blog.countDocuments({ createdAt: { $gte: week } }), Blog.countDocuments({ createdAt: { $gte: month } }),
        Blog.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
        Asset.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
        Blog.aggregate([{ $group: { _id: "$createdBy", blogCount: { $sum: 1 } } }, { $sort: { blogCount: -1 } }, { $limit: 5 }, { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "author" } }, { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } }, { $project: { _id: 1, blogCount: 1, username: "$author.username" } }]),
        User.find().sort({ createdAt: -1 }).limit(5).select("username email role createdAt"),
        Blog.find().sort({ createdAt: -1 }).limit(5).select("title status createdAt").populate("createdBy", "username"),
        Comment.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(5).select("content blogId createdBy createdAt").populate("createdBy", "username"),
        User.aggregate([{ $match: { createdAt: { $gte: month } } }, { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
        Blog.aggregate([{ $match: { createdAt: { $gte: month } } }, { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
    ]);
    return res.json({ message: "success", stats: { totalUsers, totalBlogs, totalComments, totalAssets, newUsersToday, newUsersWeek, newUsersMonth, newBlogsToday, newBlogsWeek, newBlogsMonth }, blogStats: { byStatus }, assetStats: { byStatus: assetsByStatus }, topAuthors, growth: { users: growthUsers, blogs: growthBlogs }, recentUsers, recentBlogs, recentComments });
}

export async function getAdminUsers(req, res) {
    const search = String(req.query.search || "").trim();
    const filter = search ? { $or: [{ username: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] } : {};
    const users = await User.find(filter).sort({ createdAt: -1 }).limit(100).select("username email role isVerified createdAt");
    return res.json({ message: "success", users });
}

export async function updateUserRole(req, res) {
    const { userId } = req.params;
    const { role } = req.body;
    if (!["USER", "ADMIN"].includes(role)) throw new BadRequestError("invalid role");
    if (String(req.user.user_id) === userId && role !== "ADMIN") throw new ForbiddenRequestError("you cannot remove your own admin access");
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select("username email role");
    if (!user) throw new NotFoundRequestError("user not found");
    return res.json({ message: "role updated", user });
}

export async function getAdminBlogs(req, res) {
    const blogs = await Blog.find().sort({ createdAt: -1 }).limit(100).select("title status createdAt createdBy").populate("createdBy", "username email");
    return res.json({ message: "success", blogs });
}
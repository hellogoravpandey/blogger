import {Router} from "express";
import { getAllBlogs, addNewBlog, addNewComment, getBlogByID, updateBlog, deleteBlog, publishBlog, unpublishBlog, likeBlog, unlikeBlog, bookmarkBlog, unbookmarkBlog, updateComment, deleteComment} from "../controllers/blog.controller.js";
import {uploadBlogCoverImage} from "../middlewares/multer.middleware.js";
import { validateAndNormalizeBlog, validateAndNormalizeAddComment, validateAndNormalizeUpdateComment } from "../middlewares/blogValidation.middleware.js";

const router=Router();
//dynamic routes must be in the last
router.get("/", getAllBlogs);
router.post("/",(req, res, next) => {
     uploadBlogCoverImage.single('coverImageURL')(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                message: err.message
            });
        }
        next();
    });}
    ,validateAndNormalizeBlog, addNewBlog);
router.get("/:id", getBlogByID);
router.patch("/:id", validateAndNormalizeBlog, updateBlog);
router.delete("/:id", deleteBlog);
router.patch("/:id/publish", publishBlog);
router.patch("/:id/unpublish", unpublishBlog);
router.patch("/:id/like", likeBlog);
router.patch("/:id/unlike", unlikeBlog);
router.patch("/:id/bookmark", bookmarkBlog);
router.patch("/:id/unbookmark", unbookmarkBlog);

// comments 
router.post("/:id/comments", validateAndNormalizeAddComment, addNewComment);
router.patch("/:blogid/comments/:commentid", validateAndNormalizeUpdateComment, updateComment);
router.delete("/:blogid/comments/:commentid", deleteComment);
router.get("/:id/comments", addNewComment);
router.get("/:id/comments/:id/replies", addNewComment);
export default router;





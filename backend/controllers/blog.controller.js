import Blog from "../models/blog.models.js";
import Comment from "../models/comment.models.js";
import mongoose from "mongoose";
import User from "../models/user.models.js";
import Asset from "../models/asset.models.js";
import { deleteImage, uploadImage } from "../service/cloudinary.js";
import { extractAssetIds } from "../utils/assetContent.utils.js";
import { attachDraftAssets, reconcileDraftAssets, validateDraftAssets } from "../service/asset.service.js";
import {
    BadRequestError,
    ForbiddenRequestError,
    NotFoundRequestError,
    UnauthorizedRequestError,
} from "../utils/errorHandler.utils.js";


export async function   getAllBlogs(req, res){
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 6;  

        page = Math.max(page, 1);
        limit = Math.min(limit, 50);
        const skip = (page-1)*limit
        const [blogs, totalBlogs] = await Promise.all([
            Blog.find({})
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
            .populate("createdBy", "username isVerified profileImageURL"),
            Blog.countDocuments()
        ]);
        const totalPages = Math.ceil(totalBlogs/limit); 
        return res.status(200).json({
            message: "success",
            blogs: blogs,
            pagination: {
                page,
                limit,
                totalBlogs,
                totalPages
            } 
    })
}

export async function getMyBlogs(req, res){
    if(!req.user){
        throw new UnauthorizedRequestError("login required to view your blogs");
    }

    const blogs = await Blog.find({ createdBy: req.user.user_id })
        .sort({ createdAt: -1 })
        .populate("createdBy", "username isVerified profileImageURL");

    return res.status(200).json({
        message: "success",
        blogs,
    });
}



export async function addNewBlog(req, res){
    if(!req.user){
        throw new UnauthorizedRequestError("login required to create a blog");
    }
    const {title, content, draftId}=req.body;
    const assetIds = extractAssetIds(content);
    await reconcileDraftAssets({ assetIds, ownerId: req.user.user_id, draftId });
    let uploadCoverImage=null;
    try {
        if(req.file){
            console.log("cover image path", req.file.path);
            uploadCoverImage=await uploadImage(req.file.path);
        }
        const blog=await Blog.create({
        title: title,
        content,
        draftId,
        coverImageURL: uploadCoverImage?.secure_url,
        createdBy: req.user.user_id
    });
    console.log("blog is created", blog);
    return res.status(201).json({
        "message": "successfully created    the blog"        
    })
    } catch (error) {
        console.log("error: ", error);
        if(uploadCoverImage){
            await deleteImage(uploadCoverImage);
        }
        throw error;
    } 
   
}

export async function  getBlogByID(req, res){
    const blogId=req.params.id;
    if(!mongoose.Types.ObjectId.isValid(blogId)){
        throw new BadRequestError("invalid blog id");
    }
    const blog= await Blog.findOne({_id: blogId}).populate("createdBy", "username isVerified profileImageURL");
    if(!blog){
        throw new NotFoundRequestError("blog not found");
    }
    return res.status(200).json({
        message: "success",
        blog: blog
    })
}

export async function updateBlog(req, res){
    if(!req.user){
        throw new UnauthorizedRequestError("login required to update a blog");
    }
    const blogId=req.params.id;
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        throw new BadRequestError("Invalid blog id");
    }
    const blog=await Blog.findOne({_id: blogId});
    if(!blog){
        throw new NotFoundRequestError("blog not found");
    };
    if(blog.createdBy.toString() !== req.user.user_id.toString()){
        throw new ForbiddenRequestError("unauthorized user");
    };
    const {title, content, draftId}=req.body;
    const assetIds = extractAssetIds(content);
    await reconcileDraftAssets({
        assetIds,
        ownerId: req.user.user_id,
        draftId: draftId || blog.draftId,
    });
    blog.title=title;
    blog.content=content;
    blog.draftId=draftId || blog.draftId;
    await blog.save();
    return res.status(200).json({
        message: "successfully updated the blog"
    });
}

export async function deleteBlog(req, res){
    if(!req.user){
        throw new UnauthorizedRequestError("login required to delete a blog");
    }
    const blogId=req.params.id;
     if (!mongoose.Types.ObjectId.isValid(blogId)) {
        throw new BadRequestError("Invalid blog id");
    }
    const blog =await Blog.findById(blogId);
    if(!blog){
        throw new NotFoundRequestError("blog not found");
    };

    if(blog.createdBy.toString() !== req.user.user_id.toString()){
        throw new ForbiddenRequestError("unauthorized user");
    };
    await Asset.updateMany(
        { blogId: blog._id, status: "ATTACHED" },
        { $set: { status: "UNUSED", blogId: null } },
    );
    await blog.deleteOne();
    return res.status(200).json({
        message: "deleted the blog"
    })

}

export async function publishBlog(req, res){
    if(!req.user){
        throw new UnauthorizedRequestError("login required to publish a blog");
    }
    const blogId=req.params.id;
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        throw new BadRequestError("Invalid blog id");
    }
    const blog=await Blog.findById(blogId);
    if(!blog){
        throw new NotFoundRequestError("blog not found");
    };
    if(blog.createdBy.toString() !== req.user.user_id.toString()){
        throw new ForbiddenRequestError("unauthorized change");
    };
    const assetIds = extractAssetIds(blog.content);
    await attachDraftAssets({
        assetIds,
        ownerId: req.user.user_id,
        draftId: blog.draftId,
        blogId: blog._id,
    });
    blog.status="published";
    blog.publishedAt=new Date();
    await blog.save();
    return res.status(200).json({
        message: "succesfully published"
    });
}  

export async function unpublishBlog(req, res){
    if(!req.user){
        throw new UnauthorizedRequestError("login required to unpublish a blog");
    }
    const blogId=req.params.id;
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        throw new BadRequestError("Invalid blog id");
    }
    const blog=await Blog.findById(blogId);
    if(!blog){
        throw new NotFoundRequestError("blog not found");
    };
    if(blog.createdBy.toString() !== req.user.user_id.toString()){
        throw new ForbiddenRequestError("unauthorized change");
    };
    blog.status="draft";
    await blog.save();
    return res.status(203).json({
        message: "succesfully moved to draft"
    });
} 

export async function likeBlog(req, res){
    if(!req.user){
        throw new UnauthorizedRequestError("log in to like a post");
    }
    const blogId=req.params.id;
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        throw new BadRequestError("Invalid blog id");
    }
    const blog=await Blog.findById(blogId);
    if(!blog){
        throw new NotFoundRequestError("blog not found");
    };
    if(blog.likes.includes(req.user.user_id)){
        throw new BadRequestError("already liked");
    };
    console.log("value of req.user._id", req.user.user_id);
    console.log("value of user", req.user);
    blog.likes.push(req.user.user_id);
    await blog.save();
    const blogValue = await Blog.findById(blogId);
    console.log("blog after like update", blogValue);
    return res.status(203).json({
        "message": "successfully liked"
    });
}

export async function unlikeBlog(req, res){
    if(!req.user){
        throw new UnauthorizedRequestError("login required to like a post");
    }
    const blogId=req.params.id;
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        throw new BadRequestError("Invalid blog id");
    }
    const blog=await Blog.findById(blogId);
    if(!blog){
        throw new NotFoundRequestError("blog not found");
    };
    if(!blog.likes.includes(req.user.user_id)){
        throw new BadRequestError("already unliked");
    };
    blog.likes.pull(req.user.user_id);
    await blog.save();
    return res.status(203).json({
        "message": "successfully unliked "
    });
}

export async function bookmarkBlog(req, res) {
    if(!req.user){
        throw new UnauthorizedRequestError("login required to bookmark a post");
    }
    const user = await User.findOne({_id: req.user.user_id});
    if(user.bookmarks.includes(req.params.id)){
        throw new BadRequestError("already bookmarked");
    };
    await User.findOneAndUpdate({_id: req.user.user_id},
        {
            $addToSet:{
                bookmarks: req.params.id
            }
        }
    );
    return res.status(203).json({
        message: "bookmarked"
    })
}

export async function unbookmarkBlog(req, res) {
    if(!req.user){
        throw new UnauthorizedRequestError("login required to bookmark a post");
    }
    const user = await User.findOne({_id: req.user.user_id});
    if(!user.bookmarks.includes(req.params.id)){
        throw new BadRequestError("already unbookmarked");
    }
    await User.findOneAndUpdate({_id: req.user.user_id},
        {
            $pull:{
                bookmarks: req.params.id 
            }
        }
    );
    return res.status(203).json({
        message: "bookmarked removed"
    })
}

export async function addNewComment(req, res){
const indexes = await Comment.collection.indexes();
console.log("indexes are: ", indexes);

if(!req.user){
    throw new UnauthorizedRequestError("login required ");
};
const blogId=req.params.id;
if(!mongoose.Types.ObjectId.isValid(blogId)){
    throw new BadRequestError("invalid blogId");
};
const blog=await Blog.findOne({_id: blogId, status: "published"});
if(!blog){
    throw new NotFoundRequestError("blog not found");
};

const {content, parentComment}=req.body;
const mongoSession=await mongoose.startSession();
try {
    mongoSession.startTransaction();
    const parent=await Comment.findById(parentComment);
    let depth=0;
    if(parent){
        if(parent.depth > 1){
        throw new BadRequestError("reply depth exceeds");
    }
    if(parent.blogId.toString() !== blogId ){
        throw new BadRequestError("invalid parent comment");
    }
    depth=parent.depth + 1;
    };
    const [comment]=await Comment.create([{
        content: content,
        blogId: blogId,
        createdBy: req.user.user_id,
        parentComment: parentComment,
        depth: depth
    }], {session: mongoSession});

    await Blog.updateOne({_id: blogId}, {
        $inc : {
            commentCount: 1
        }
    }, {session: mongoSession});
    if(parent){
    await Comment.updateOne({_id: parentComment}, {
        $inc: {
            repliesCount: 1
        }
    });
    }
    await comment.populate("createdBy", "username profileImageURL isVerified");
    await mongoSession.commitTransaction();
    return res.status(201).json({
        message: "success",
        comment: comment
    })
} catch (error) {
    console.log("comment create db error; ",error);
    await mongoSession.abortTransaction();
    throw error;
}finally{
    await mongoSession.endSession();
}
}

export async function updateComment(req, res){
         if(!req.user){
        throw new UnauthorizedRequestError("login required ");
    };
    const {blogid: blogId, commentid: commentId}=req.params;
    console.log("blogId inside the updatecomment controller", blogId, "  ", commentId);
    const {content }=req.body;
    if(!mongoose.Types.ObjectId.isValid(blogId)){
        throw new BadRequestError("invalid blogId");
    };
    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new BadRequestError("invalid commentId");
    };

    const blog =await Blog.findById(blogId);
    if(!blog){
        throw new NotFoundRequestError("blog not found ");
    };
    const comment =await Comment.findById(commentId);
    if(!comment){
        throw new NotFoundRequestError("comment not found");
    };
    console.log("req.user.-di", req.user.user_id);
    if(comment.createdBy.toString()!== req.user.user_id){
        throw new ForbiddenRequestError("unauthorized user");
    };
    comment.content=content;
    comment.populate("createdBy", "username profileImageURL isVerified");
    await comment.save();    

    return res.status(200).json({
        message: "succefully updated",
        comment: comment
    });
}

export async function deleteComment (req, res){
    const mongoSession = await mongoose.startSession();
    try {
        mongoSession.startTransaction();
        const {blogId, commentId} = req.params;
        const userId = req.user._id;
        
        if(!mongoose.Types.ObjectId.isValid(blogId)){
        throw new BadRequestError("invalid blogId");
        };

        if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new BadRequestError("invalid commentId");
    };
        const blog = await Blog.findById(blogId)
            .session(session);
        if (!blog) {
            throw new NotFoundRequestError("blog not found.");
        }

        const comment = await Comment.findById(commentId)
            .session(session);
        if (!comment) {
            throw new NotFoundRequestError("Comment not found.");
        }
        
        if (comment.isDeleted === true) {
            throw new BadRequestError("Comment already deleted.");
        }

        if (comment.createdBy.toString() !== userId.toString()) {
            throw new ForbiddenRequestError("You are not authorized to delete this comment.");
        }

        comment.isDeleted = true;
        comment.deletedAt = new Date();
        await comment.save({ mongoSession });
     
        await Blog.findByIdAndUpdate(
            comment.blogId,
            {
                $inc: {
                    commentsCount: -1
                }
            },
            {
                mongoSession
            }
        );
        
        if (comment.parentComment) {
            await Comment.findByIdAndUpdate(
                comment.parentComment,
                {
                    $inc: {
                        replyCount: -1
                    }
                },
                {
                    mongoSession
                }
            );
        }

        await mongoSession.commitTransaction();
        return res.status(200).json({
            message: "Comment deleted successfully."
        });

    }
    catch (error) {
        await mongoSession.abortTransaction();
        console.error(error);
        throw error;
    }
    finally {
        mongoSession.endSession();
    }

};

export async function getTopLevelComments( req, res){
const {page=1, limit=5, sort='latest'}=req.query;
const {blogid: blogId}=req.params;
if(!mongoose.Types.ObjectId.isValid(blogId)){
        throw new BadRequestError("invalid blogId");
    };

page=Number(page);
limit=Number(limit);

const sortOptions ={
    "latest": {
        createdAt: -1
    },
    "oldest": {
        createdAt: 1
    },
    "mostLiked": {
        likeCount: -1
    },
    "modified": {
        modifiedAt: -1 
    }
};

const allComments = await Comment.find({blogId: blogId, parentComment: null, isDeleted: false})
.populate("createdBy", "username profileImageURL isVerified")
.sort(sortOptions[sort] || sortOptions.latest)
.skip((page-1)*limit)
.limit(limit);


const totalComments=await Comment.countDocuments({
    blogId: blogId,
    parentComment: null,
    isDeleted: false
});

return res.status(200).json({
    message: "success",
    page: page,
    totalPages: Math.ceil(totalCommentsCount/limit),
    limit: limit, 
    totalComments: totalComments,
    comments: allComments,
   
})
};

export async function getAllReplies(req, res){
    const { blogid: blogId, commentid: commentId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(blogId)){
    throw new BadRequestError("invalid blogId");
    };
    if(!mongoose.Types.ObjectId.isValid(commentId)){
    throw new BadRequestError("invalid commentId");
    };

    const comment = await Comment.findById(commentId);
    if(!comment){
    throw new NotFoundRequestError("comment not found");
    }
        const replies=await Comment.find({
            parentComment: commentId,
            isDeleted: false
        })
        .populate("createdBy", "username profileImageURL isVerified")
        .sort({createdAt: -1});

        return res.status(200).json({
            message: "success",
            totalReplies: replies.length,
            replies: replies
    })
}

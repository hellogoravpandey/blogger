import Blog from "../models/blog.models.js";
import Comment from "../models/comment.models.js";
import mongoose from "mongoose";
import fs from "fs";
import User from "../models/user.models.js";
import { measureMemory } from "vm";

export async function getAllBlogs(req, res){
    // 1. whom a particular users blog 
    // 2. find({}).populate(createdBy, "username");  //user have sensitive infos 
    // 3. return res.status(200).json( {message, all })

    const blogs=await Blog.find({})
    .populate("createdBy", "username")
    .sort({
        createdAt: -1
    });

    return res.status(200).json({
        "blogs": blogs,
    })

}

export async function addNewBlog(req, res){
    //multer added req.file and req.body 
    const {title, body: content}=req.body;
    try {
        const blog=await Blog.create({
        title: title,
        body: content,
        coverImageURL:req.file?.filename ?`/uploads/${req.file.filename}`:null,
        createdBy: req.user===null?null:req.user.user_id
    });
    console.log("blog is created", blog);
    return res.status(201).json({
        "message": "successfully created the blog"        
    })
    } catch (error) {
        //need to delete the temp file
        console.log("error: ", error);
        try {
            await fs.unlink(`/public/uploads${req.file.filename}`);            
        } catch (error) {
            console.log("temp File deletion error", error);

        }
        
        return res.status(500).json({
            "message": "Internal server error"
        })

    } 
   
}

export async function  getBlogByID(req, res){
    // 1. cont blog_id=req.params.id
    // 2. const blog=Blog.findOne({_id: blog_id}).populate("createdBy", "username");
    // 3. return res.status(200).

    const blogId=req.params.id;
    if(!mongoose.Types.ObjectId.isValid(blogId)){
        return res.status(400).json({
            message: "invalid blog id"
        });
    }
    const blog= await Blog.findOne({_id: blogId}).populate("createdBy", "username");
    if(!blog){
        return res.staus(404).json({
            message: "blog not found"
        });
    }
    return res.status(200).json({
        blog: blog
    })
}

export async function updateBlog(req, res){
    // 1. blog_id=req.params.id
    // 2. blog-> Blog.find({blog_id})
    // 3. !blog --> return res.
    // 4. blog.createdBy === req.body.user._id ==> res
    // 4. blog.title, blog.coontent ...
    // 4. await blog.save();
    // 5. return res
    
    const blogId=req.params.id;
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({
            message: "Invalid blog id"
        });
    }
    const blog=await Blog.findOne({_id: blogId});
    if(!blog){
        return res.status(404).json({
            message: "blog not found"
        });
    };
    if(blog.createdBy !== req.user._id){
        return res.status(403).json({
            message: "unauthorized user"
        });
    };
    // updating the required field (if present)
    const {title, body}=req.body;
    blog.title=title;
    blog.body=body;
    await blog.save();
    return res.status(204).json({
        message: "successfully updated the blog"
    });
}

export async function deleteBlog(req, res){
    // blogId =req.params.id
    // blog=Blog.findById(blogId)
    // !blog=> return res
    // blog.createdBy !== req.user_d ==> return res not authorized
    // await blog.deleteOne();
    // return res
    const blogId=req.params.id;
     if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({
            message: "Invalid blog id"
        });
    }
    const blog =await Blog.findById(blogId);
    if(!blog){
        return res.status(404).json({
            message: "blog not found"
        });
    };

    if(blog.createdBy !== req.user._id){
        return res.status(403).json({
            "message": "unauthorized user"
        });
    };
    await blog.deleteOne();
    return res.status(204).json({
        message: "deleted the blog"
    })

}

export async function publishBlog(req, res){
    //1. blog = findById(req.body.id)
    //2. !blog--> blog not found
    //3. blog.createdBy !== req.user.user_id ==> unauthorized
    //4. blog.status="published"
    //5. blog.publishedAt = new Date.now();
    //6. await blog.save()
    //7. ==> messag: success
    const blogId=req.params.id;
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({
            message: "Invalid blog id"
        });
    }
    const blog=await Blog.findById(blogId);
    if(!blog){
        return res.status(404).json({
            message: "blog not found"
        });
    };
    if(blog.createdBy !== req.user._id){
        return res.status(403).json({
            message: "unauthorized change"
        });
    };
    blog.status="published";
    blog.publishedAt=new Date();
    await blog.save();
    return res.status(203).json({
        message: "succesfully published"
    });
}  

export async function unpublishBlog(req, res){
    const blogId=req.params.id;
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({
            message: "Invalid blog id"
        });
    }
    const blog=await Blog.findById(blogId);
    if(!blog){
        return res.status(404).json({
            message: "blog not found"
        });
    };
    if(blog.createdBy !== req.user._id){
        return res.status(403).json({
            message: "unauthorized change"
        });
    };
    blog.status="draft";
    await blog.save();
    return res.status(203).json({
        message: "succesfully moved to draft"
    });
} 

export async function likeBlog(req, res){
    // blog = findById(req.params.id)
    // !blog
    // !req.user  ( null --> not a logged user)
    // blog.likes.push(req.user._id);
    // return res.status(203)
    
    if(!req.user){
        return res.status(401).json({
            message: "log in to like a post"
        })
    }
    const blogId=req.params.id;
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({
            message: "Invalid blog id"
        });
    }
    const blog=await Blog.findById(blogId);
    if(!blog){
        return res.status(404).json({
            message: "blog not found"
        });
    };
    if(blog.likes.includes(req.user._id)){
        return res.status(400).json({
            message: "already liked"
        });
    };
    blog.likes.push(req.user._id);
    await blog.save();
    return res.status(203).json({
        "message": "successfully liked"
    });
}

export async function unlikeBlog(req, res){
    // blog = findById(req.params.id)
    // !blog
    // !req.user  ( null --> not a logged user)
    // blog.likes.push(req.user._id);
    // return res.status(203)

    if(!req.user){
        return res.status(401).json({
            message: "login required to like a post"
        })
    }
    const blogId=req.params.id;
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({
            message: "Invalid blog id"
        });
    }
    const blog=await Blog.findById(blogId);
    if(!blog){
        return res.status(404).json({
            message: "blog not found"
        });
    };
    if(!blog.likes.includes(req.user._id)){
        return res.status(400).json({
            message: "already unliked"
        });
    };
    blog.likes.pull(req.user._id);
    await blog.save();
    return res.status(203).json({
        "message": "successfully unliked "
    });
}

export async function bookmarkBlog(req, res) {
    if(!req.user){
        return res.status(401).json({
            message: "login required to bookmark a post" 
        })
    }
    await User.findOneAndUpdate({_id: req.user._id},
        {
            $addToSet:{
                bookmarks: req.params.id // blog_id is saved in each user
            }
        }
    );
    return res.status(203).json({
        message: "bookmarked"
    })
}

export async function unbookmarkBlog(req, res) {
    if(!req.user){
        return res.status(401).json({
            message: "login required to bookmark a post" 
        })
    }
    await User.findOneAndUpdate({_id: req.user._id},
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

// comment controllers
export async function addNewComment(req, res){
// steps
// // post /blogs/:id/comment
// 1. authenticate the req.user
// 1. params.id
// 2. blog --> at ( id) ( published: true)
// transaction
// validate reply 
// parentcomment = comment.findByID(parentCommet)
// if(parentcomment.depth) > 1 ==> "cant comment"
// parent.blog. !=== blogId  ==> invalid comment,  
// create comment --> Comment.create()
// blog.commentCount++
// if(parentComment)
// //end


const indexes = await Comment.collection.indexes();
console.log("indexes are: ", indexes);

// login user only
if(!req.user){
    return res.status(401).json({
        message: "login required "
    });
};
const blogId=req.params.id;
// valid blogId?
if(!mongoose.Types.ObjectId.isValid(blogId)){
    return res.status(400).json({
        message: "invalid blogId"
    });
};
//valid blogId, blog published ?? 
const blog=await Blog.findOne({_id: blogId, status: "published"});   // it return reference to the heap obj  storage, but still it is not a mongoDB document reference  
if(!blog){
    return res.status(404).json({
        message: "blog not found"
    });
};

// anyone logged in user can comment in a post, no authentication 
const {content, parentComment}=req.body;
const mongoSession=await mongoose.startSession();
try {
    mongoSession.startTransaction();
    //valid reply?
    const parent=await Comment.findById(parentComment);
    // when no parent depth=0
    let depth=0;
    if(parent){
        if(parent.depth > 1){
        return res.status(400).json({
            message: "reply depth exceeds"
        })
    }
    // valid reply
    //valid parent comment?  
    if(parent.blogId.toString() !== blogId ){
        return res.status(400).json({
            message: "invalid parent comment"
        })
    }
    //depth 
    depth=parent.depth + 1;
    };
    const [comment]=await Comment.create([{
        content: content,
        blogId: blogId,
        createdBy: req.user.user_id,
        parentComment: parentComment,
        depth: depth
    }], {session: mongoSession});

    // blog comment ++   ----> // will create concurrency problem in future
    // blog.commentCount++;
    // blog.save({session: mongoSession});

    // atomic way latest read and write
    await Blog.updateOne({_id: blogId}, {
        $inc : {
            commentCount: 1
        }
    }, {session: mongoSession});
    //parent reply add
    if(parent){
    // parent.repliesCount++;
    // parent.save({session: mongoSession});
    // attomic latest-read and update
    await Comment.updateOne({_id: parentComment}, {
        $inc: {
            repliesCount: 1
        }
    });
    }
    await comment.populate("createdBy", "username profileImageURL isVerified");
    //create
    //commit
    await mongoSession.commitTransaction();
    return res.status(201).json({
        message: "success",
        comment: comment
    })
} catch (error) {
    console.log("comment create db error; ",error);
    await mongoSession.abortTransaction();
    return res.status(500).json({
        message: "internal server error"
    });
}finally{
    await mongoSession.endSession();
}
}

export async function updateComment(req, res){
    //steps 
    // !req.user --> login required 
    // {blogId, commentId }= req.params
    // blogId and commentId --> valid ??
    // blog =blog.find({ blogid,published})
    // !blog --> error 
    // comment --> exist ?? 
    // !comment --> error
    // authenticate user for the comment 
    // comment.createdBy !== req.user.user_id ==> error
    // update -->
    // {title, content}= req.body
    // comment.title =title
    // comment.content=content
    // await comment.save()
     //only logged in user 
    
   
         if(!req.user){
        return res.status(401).json({
            message: "login required "
        });
    };
    const {blogid: blogId, commentid: commentId}=req.params;
    console.log("blogId inside the updatecomment controller", blogId, "  ", commentId);
    const {content }=req.body;
    // valid blogId?
    if(!mongoose.Types.ObjectId.isValid(blogId)){
        return res.status(400).json({
            message: "invalid blogId"
        });
    };
    //commentId
    if(!mongoose.Types.ObjectId.isValid(commentId)){
        return res.status(400).json({
            message: "invalid commentId"
        });
    };

    // blog exist?
    const blog =await Blog.findById(blogId);
    console.log("blog", blog);
    if(!blog){
        console.log("value of vlog insise !blog", blog)
        return res.status(404).json({
            message: "blog not found "
        });
    };
    // comment exist?
    const comment =await Comment.findById(commentId);
    if(!comment){
        return res.status(404).json({
            message: "comment not found"
        });
    };
    // authorization check ( only the creater can update)
    console.log("req.user.-di", req.user.user_id);
    if(comment.createdBy.toString()!== req.user.user_id){
        return res.status(403).json({
            "message": "unauthorized user"
        });
    };
    //update
    comment.content=content;
    comment.populate("createdBy", "username profileImageURL isVerified");
    await comment.save();    

    return res.status(200).json({
        message: "succefully updated",
        comment: comment
    });
    

}

export async function deleteComment (req, res){
    // export async function deleteComment(req, res){
    //    // !req.user --> error
    //    // {blogId, commentId}
    //    // !blogId
    //    // !commentId
    //    // authorized user can delete the comment
    //    // transaction
    //    // if(comment.parentComment) ==> softdelete
    //    // hard delete 
    //    //   await Comment.findByIdUpdate({comment.parentComment}, $dec:{counted }).
    //    // await blog.commentCount--; 
    // } 
    const mongoSession = await mongoose.startSession();
    try {
        mongoSession.startTransaction();
        const {blogId, commentId} = req.params;
        const userId = req.user._id;
        
        // blogId valid?
        if(!mongoose.Types.ObjectId.isValid(blogId)){
        return res.status(400).json({
            message: "invalid blogId"
        });};

        //commentId valid?
        if(!mongoose.Types.ObjectId.isValid(commentId)){
        return res.status(400).json({
            message: "invalid commentId"
        });
    };
        // blog exist?
        const blog = await Blog.findById(blogId)
            .session(session);
        if (!blog) {
            await mongoSession.abortTransaction();
            return res.status(404).json({
                message: "blog not found."
            });
        }

        // comment exist?
        const comment = await Comment.findById(commentId)
            .session(session);
        if (!comment) {
            await mongoSession.abortTransaction();
            return res.status(404).json({
                message: "Comment not found."
            });
        }
        
        //alreadu deleted
        if (comment.isDeleted === true) {
            await mongoSession.abortTransaction();
            return res.status(400).json({
                message: "Comment already deleted."
            });
        }

        //authorization
        if (comment.createdBy.toString() !== userId.toString()) {
            await mongoSession.abortTransaction();
            return res.status(403).json({
                message: "You are not authorized to delete this comment."
            });
        }

        //soft delete
        comment.isDeleted = true;
        comment.deletedAt = new Date();
        await comment.save({ mongoSession });
     
        //update blog commentCount 
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
        
        // update parentComment reply count
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

        //commit
        await mongoSession.commitTransaction();
        return res.status(200).json({
            message: "Comment deleted successfully."
        });

    }
    catch (error) {
        await mongoSession.abortTransaction();
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
    finally {
        mongoSession.endSession();
    }

};


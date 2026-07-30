import mongoose from "mongoose";
const commentSchema=new mongoose.Schema({
    content: {
        type: String,
        required: [true, "content is required"],  
    },
    blogId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "createdBy is required"],
        unique: [true, "createdBy must be unique "]
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments',
        default: null
    },
    //status
    //soft delete
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    //stats
    likeCount: {
        type: Number,
        default: 0
    },
    repliesCount: {
        type: Number,
        default: 0
    },

    // to check the current depth of the comment(reply)
    depth: {
        type:Number,
        default:0,
        min:0,
        max:1
    }
    
}
, {timestamps: true});

const Comment=mongoose.model('comment', commentSchema);
export default Comment;
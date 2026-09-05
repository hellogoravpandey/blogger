import mongoose from "mongoose";
const blogSchema=new mongoose.Schema({
    title: {
        type: String,
        required: true,  
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    coverImageURL:{
        type: String,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    draftId: {
        type: String,
        index: true
    },
    //status
    status:{
        type: String,
        enum: ["draft", "archived", "published"],
        default: "draft"
    },
    //stats
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: "users"
        }
    ], 
    commentCount:{
        type: Number,
        default: 0
    }
}
, {timestamps: true});

const Blog=mongoose.model('blog', blogSchema);
export default Blog;

// category 
// tags: [ ]


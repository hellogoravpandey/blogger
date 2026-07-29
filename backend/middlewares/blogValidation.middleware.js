
function respondIfBodyEmpty (req, res){
     if(!req.body){
        return res.status(404).json({
            message: "body is empty, fields are required"
        })
    }
    return;
}
export function validateAndNormalizeBlog(req, res, next){
    respondIfBodyEmpty(req, res);
    //body not empty
    const {title, body: content}=req.body;
    if(!title || title.trim()===""){
        return res.status(400).json({
            message: "title is required"
        })
    };
    if(!content|| content.trim()===""){
        return res.status(400).json({
            message: "body is required"
        })
    }
    //normalized
    req.body.title=title.trim();
    req.body.body=content.trim();
    next();
}


export function validateAndNormalizeAddComment(req, res, next){
    console.log("reached the validateand normalize  middleware");
    respondIfBodyEmpty(req, res);
    const {content, parentComment}=req.body;
    if(!content || content.trim()===""){
        return res.status(400).json({
            message: "content is required"
        });
    };
    
    if(parentComment==="undefined"){
        return res.status(400).json({
            message: "parent comment is required"
        });
    };
    //normalized
    req.body.content=content.trim();
    if(req.body.parentComment !== null){
    req.body.parentComment=parentComment.trim();
    };
    next();
}


export function validateAndNormalizeUpdateComment(req, res, next){
    respondIfBodyEmpty(req, res);
    const {content}=req.body;
    if(!content || content.trim()===""){
        return res.status(400).json({
            "message": "content is required"
        })
    }
    //normalized
    req.body.content=content.trim();
    next();
}





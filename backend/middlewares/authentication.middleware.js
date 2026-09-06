import User from "../models/user.models.js";
import { UnauthorizedRequestError } from "../utils/errorHandler.utils.js";
import { validateJWTToken } from "../service/jwtauthenticationservice.js";

export async function checkForAuthentication(req, res, next){
    // steps
    // 0. req.user=null
    // 1. {accessToken} = req.body
    // 2. !accessToken ==> return next()
    // 3. try:
    // 4. cont decoded = validateToken(acessToken)
    // 5. console.log(req.user)
    // 6. req.user=user
    // 7. console.log(req.user)
    // 8. catch(error): 
    // 8. console.log(error);
    // 10. return next()

    req.user=null;
    console.log(req.headers.authorization);
    if(!req.headers.authorization){
        console.log("accessToken not found");
        return next();
    };
    const accessToken=req.headers.authorization.split(" ")[1];
    try {
        const decoded=validateJWTToken(accessToken);
        const user = await User.findById(decoded.user_id)
            .select("_id username email role isVerified profileImageURL bookmarks");
        if (!user) return next(new UnauthorizedRequestError("user no longer exists"));
        req.user={
            user_id: user._id,
            session_id: decoded.session_id,
            role: user.role || "USER",
            username: user.username,
            email: user.email,
        };
        return next();
    } catch (error) {
        console.log("error inside checkForAuth", error);
        return next();
    }
}


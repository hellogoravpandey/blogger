import { ForbiddenRequestError } from "../utils/errorHandler.utils.js";

export function canManageBlog(user, blog) {
    if (user?.role === "ADMIN") return true;
    return Boolean(user && blog?.createdBy?.toString() === user.user_id.toString());
}

export function assertCanManageBlog(user, blog) {
    if (!canManageBlog(user, blog)) {
        throw new ForbiddenRequestError("unauthorized user");
    }
}
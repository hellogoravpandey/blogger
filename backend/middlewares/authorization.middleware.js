import { ForbiddenRequestError, UnauthorizedRequestError } from "../utils/errorHandler.utils.js";

export function requireAuthenticated(req, res, next) {
    if (!req.user) return next(new UnauthorizedRequestError("login required"));
    return next();
}

export function requireAdmin(req, res, next) {
    if (!req.user) return next(new UnauthorizedRequestError("login required"));
    if (req.user.role !== "ADMIN") return next(new ForbiddenRequestError("admin access required"));
    return next();
}
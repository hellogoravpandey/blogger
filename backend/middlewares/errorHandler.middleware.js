import { MulterError } from "multer";
import {
  AppError,
  BadRequestError,
  ConflictError,
  InternalError,
  NotFoundRequestError,
  UnauthorizedRequestError,
  ValidationError,
} from "../utils/errorHandler.utils.js";

function mapKnownError(error) {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof MulterError) {
    return new BadRequestError(error.message, { multerCode: error.code });
  }

  if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
    return new UnauthorizedRequestError("Unauthorized to access, invalid token");
  }

  if (error.name === "CastError") {
    return new BadRequestError("Invalid id");
  }

  if (error.name === "ValidationError" && error.errors) {
    const details = Object.values(error.errors).map((item) => item.message);
    return new ValidationError("Validation failed", details);
  }

  if (error.code === 11000) {
    return new ConflictError("Resource already exists", error.keyValue ?? null);
  }

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return new BadRequestError("Invalid JSON body");
  }

  return new InternalError("Internal server error");
}

export function notFoundHandler(req, res, next) {
  next(new NotFoundRequestError(`Cannot ${req.method} ${req.originalUrl}`));
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const isAppError = error instanceof AppError;
  if (!isAppError) {
    console.error(error);
  }

  const mapped = mapKnownError(error);
  const isProduction = process.env.NODE_ENV === "production";
  const payload = {
    message: mapped.message,
    code: mapped.code,
    details: mapped.details,
  };

  if (mapped.status >= 500 && isProduction) {
    payload.message = "Internal server error";
    payload.details = null;
  }

  return res.status(mapped.status).json(payload);
}

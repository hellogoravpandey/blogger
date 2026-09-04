import { BadRequestError, ValidationError } from "../utils/errorHandler.utils.js";

function assertBodyPresent(req) {
  if (!req.body) {
    throw new BadRequestError("body is empty, fields are required");
  }
}

export function validateAndNormalizeBlog(req, res, next) {
  try {
    assertBodyPresent(req);
    const { title, body: content } = req.body;
    if (!title || title.trim() === "") {
      throw new ValidationError("title is required");
    }
    if (!content || content.trim() === "") {
      throw new ValidationError("body is required");
    }
    req.body.title = title.trim();
    req.body.body = content.trim();
    next();
  } catch (error) {
    next(error);
  }
}

export function validateAndNormalizeAddComment(req, res, next) {
  try {
    assertBodyPresent(req);
    const { content, parentComment } = req.body;
    if (!content || content.trim() === "") {
      throw new ValidationError("content is required");
    }
    if (parentComment === "undefined") {
      throw new ValidationError("parent comment is required");
    }
    req.body.content = content.trim();
    if (req.body.parentComment !== null) {
      req.body.parentComment = parentComment.trim();
    }
    next();
  } catch (error) {
    next(error);
  }
}

export function validateAndNormalizeUpdateComment(req, res, next) {
  try {
    assertBodyPresent(req);
    const { content } = req.body;
    if (!content || content.trim() === "") {
      throw new ValidationError("content is required");
    }
    req.body.content = content.trim();
    next();
  } catch (error) {
    next(error);
  }
}

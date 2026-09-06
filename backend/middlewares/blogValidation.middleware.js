import { BadRequestError, ValidationError } from "../utils/errorHandler.utils.js";
import { isTiptapDocument } from "../utils/assetContent.utils.js";

function assertBodyPresent(req) {
  if (!req.body) {
    throw new BadRequestError("body is empty, fields are required");
  }
}

export function validateAndNormalizeBlog(req, res, next) {
  try {
    assertBodyPresent(req);
    const { title } = req.body;
    let { content } = req.body;
    if (!title || title.trim() === "") {
      throw new ValidationError("title is required");
    }
    if (typeof content === "string") {
      try {
        content = JSON.parse(content);
      } catch {
        throw new ValidationError("content must be valid Tiptap JSON");
      }
    }
    if (!isTiptapDocument(content)) {
      throw new ValidationError("valid Tiptap content is required");
    }
    req.body.title = title.trim();
    req.body.content = content;
    next();
  } catch (error) {
    next(error);
  }
}

export function validateAndNormalizeBlogUpdate(req, res, next) {
  try {
    assertBodyPresent(req);
    const hasTitle = Object.prototype.hasOwnProperty.call(req.body, "title");
    const hasContent = Object.prototype.hasOwnProperty.call(req.body, "content");

    if (!hasTitle && !hasContent) {
      throw new ValidationError("title or content is required");
    }

    if (hasTitle) {
      if (typeof req.body.title !== "string" || req.body.title.trim() === "") {
        throw new ValidationError("title cannot be empty");
      }
      req.body.title = req.body.title.trim();
    }

    if (hasContent) {
      let { content } = req.body;
      if (typeof content === "string") {
        try {
          content = JSON.parse(content);
        } catch {
          throw new ValidationError("content must be valid Tiptap JSON");
        }
      }
      if (!isTiptapDocument(content)) {
        throw new ValidationError("valid Tiptap content is required");
      }
      req.body.content = content;
    }

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

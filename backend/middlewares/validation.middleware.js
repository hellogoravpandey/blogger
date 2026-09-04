import { AppError, ValidationError } from "../utils/errorHandler.utils.js";

export function validate(validators) {
  return (req, res, next) => {
    try {
      if (!req.body) {
        throw new ValidationError("Body is empty");
      }
      for (const item of validators) {
        const { field, validator } = item;
        req.body[field] = validator(req.body[field]);
      }
      next();
    } catch (error) {
      next(error instanceof AppError ? error : new ValidationError(error.message));
    }
  };
}

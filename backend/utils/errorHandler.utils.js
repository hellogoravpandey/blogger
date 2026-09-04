export class AppError extends Error {
  constructor(
    message,
    { status = 500, code = "INTERNAL_ERROR", details = null } = {},
  ) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class BadRequestError extends AppError {
  constructor(message = "BAD_REQUEST", details = null) {
    super(message, { status: 400, code: "BAD_REQUEST", details });
  }
}

export class UnauthorizedRequestError extends AppError {
  constructor(message = "UNAUTHORIZED_REQUEST", details = null) {
    super(message, { status: 401, code: "UNAUTHORIZED_REQUEST", details });
  }
}

export class ForbiddenRequestError extends AppError {
  constructor(message = "FORBIDDEN_REQUEST", details = null) {
    super(message, { status: 403, code: "FORBIDDEN_REQUEST", details });
  }
}

export class NotFoundRequestError extends AppError {
  constructor(message = "NOT_FOUND_REQUEST", details = null) {
    super(message, { status: 404, code: "NOT_FOUND_REQUEST", details });
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", details = null) {
    super(message, { status: 409, code: "CONFLICT", details });
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation Failed", details = null) {
    super(message, { status: 422, code: "VALIDATION_ERROR", details });
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = "Too Many Requests", details = null) {
    super(message, { status: 429, code: "TOO_MANY_REQUESTS", details });
  }
}

export class InternalError extends AppError {
  constructor(message = "Internal server error", details = null) {
    super(message, { status: 500, code: "INTERNAL_ERROR", details });
  }
}

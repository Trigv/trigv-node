import type { ValidationErrors } from './types.js';

export class TrigvError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends TrigvError {
  readonly errors: ValidationErrors;

  constructor(message: string, errors: ValidationErrors = {}) {
    super(message);
    this.errors = errors;
  }
}

export class AuthenticationError extends TrigvError {
  readonly statusCode = 401;

  constructor(message: string) {
    super(message);
  }
}

export class AuthorizationError extends TrigvError {
  readonly statusCode = 403;

  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends TrigvError {
  readonly statusCode = 404;

  constructor(message: string) {
    super(message);
  }
}

export class RateLimitError extends TrigvError {
  readonly statusCode = 429;
  readonly retryable: boolean;

  constructor(message: string, retryable = true) {
    super(message);
    this.retryable = retryable;
  }
}

export class ApiError extends TrigvError {
  readonly statusCode: number;
  readonly body: unknown;

  constructor(message: string, statusCode: number, body: unknown = null) {
    super(message);
    this.statusCode = statusCode;
    this.body = body;
  }
}

export class NetworkError extends TrigvError {
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.cause = cause;
  }
}

export class TimeoutError extends TrigvError {
  constructor(message = 'Request timed out') {
    super(message);
  }
}

export function isMonthlyLimitMessage(message: string): boolean {
  return message.includes('Monthly event limit');
}

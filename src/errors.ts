import type { ValidationErrors } from './types.js';

export class TrigvError extends Error {
  /** Value of the `X-Request-ID` response header, when the API answered. */
  requestId?: string;

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
  readonly retryAfterMs?: number;

  constructor(message: string, retryAfterMs?: number);
  /** @deprecated Old argument order (message, retryable, retryAfterMs). `retryable` is ignored. */
  constructor(message: string, retryable: boolean, retryAfterMs?: number);
  constructor(message: string, second?: number | boolean, third?: number) {
    super(message);
    this.retryAfterMs = typeof second === 'boolean' ? third : second;
  }

  /** @deprecated Every 429 is retryable now, so this is always `true`. */
  get retryable(): boolean {
    return true;
  }
}

/** 409: another request is delivering the same `idempotency_key`. Retry with the same key. */
export class ConflictError extends TrigvError {
  readonly statusCode = 409;
  readonly retryAfterMs?: number;

  constructor(message: string, retryAfterMs?: number) {
    super(message);
    this.retryAfterMs = retryAfterMs;
  }
}

/** 503: push delivery is unavailable. Retry with the same `idempotency_key`. */
export class ServiceUnavailableError extends TrigvError {
  readonly statusCode = 503;
  readonly retryAfterMs?: number;

  constructor(message: string, retryAfterMs?: number) {
    super(message);
    this.retryAfterMs = retryAfterMs;
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

/** @deprecated The monthly event cap no longer exists. Always returns `false`. */
export function isMonthlyLimitMessage(message: string): boolean {
  void message;
  return false;
}

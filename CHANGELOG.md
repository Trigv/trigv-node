# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-11-01

### Changed

- Default base URL is now `https://api.trigv.com`; paths are `/v1/events` and `/v1/connection`. A base URL ending in `/api` keeps working.
- `public_id` values are 26 character ULIDs (no `evt_` prefix).
- Rate limit is 60 requests per minute per workspace.
- Invalid JSON bodies return 422 and map to `ValidationError`.

### Added

- `ConflictError` (409) and `ServiceUnavailableError` (503), both retryable with `Retry-After` when an `idempotency_key` is set.
- `requestId` on every API error (from the `X-Request-ID` header).

### Removed

- Monthly event cap handling. `RateLimitError.retryable` is gone; every 429 is retryable.

## [1.0.0] - 2026-07-07

### Added

- Initial stable release of `@trigv/sdk`
- `Trigv` client with `sendEvent()` and `verifyConnection()`
- Client-side validation for ingest event fields
- Typed errors (authentication, validation, rate limit, network, timeout)
- Retry policy aligned with Trigv idempotency contract
- ESM and CommonJS builds with TypeScript declarations

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-07-07

### Added

- Initial stable release of `@trigv/sdk`
- `Trigv` client with `sendEvent()` and `verifyConnection()`
- Client-side validation for ingest event fields
- Typed errors (authentication, validation, rate limit, network, timeout)
- Retry policy aligned with Trigv idempotency contract
- ESM and CommonJS builds with TypeScript declarations

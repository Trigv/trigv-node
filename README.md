# @trigv/sdk

Official Trigv SDK for Node.js and TypeScript. Send notification events from scripts, servers, and CI pipelines.

## What Trigv is

Trigv delivers developer notifications to your team's devices. Your backend sends lightweight JSON events; Trigv queues push delivery. Notification title and body are not stored on Trigv servers — metadata only.

## Installation

```bash
npm install @trigv/sdk
```

## Quick start

```typescript
import { Trigv } from '@trigv/sdk';

const trigv = new Trigv({ apiKey: process.env.TRIGV_API_KEY });

await trigv.sendEvent({
  channel: 'general',
  title: 'Deploy finished',
  description: 'Build #42 succeeded in 38s',
});
```

## Authentication

Create a workspace API key at [app.trigv.com](https://app.trigv.com). Keys look like `trgv_xxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.

```typescript
const trigv = new Trigv({ apiKey: 'trgv_your_api_key' });
// or set TRIGV_API_KEY in the environment
```

**Do not** send the API key in the JSON body — use the `Authorization: Bearer` header (handled automatically).

## Sending an event

```typescript
const { event, duplicate } = await trigv.sendEvent({
  channel: 'general',
  title: 'Cron job failed',
  description: 'Nightly backup did not complete',
  level: 'error',
  event_type: 'cron.failed',
});
```

## Event options

| Field | Required | Description |
|-------|:--------:|-------------|
| `channel` | Yes | Channel slug (e.g. `general`, max 120 characters) |
| `title` | Yes | Notification title (max 255 characters) |
| `description` | No | Body text (max 1000 characters) |
| `image_url` | No | Image URL (max 2048 characters; not stored server-side) |
| `url` | No | Destination URL for the notification (max 2048 characters; not stored server-side) |
| `level` | No | `info`, `success`, `warning`, `error` (default: `info`) |
| `delivery_urgency` | No | `standard` or `time_sensitive` (default: `standard`) |
| `event_type` | No | Free-form label (e.g. `deploy.completed`, max 120 characters) |
| `idempotency_key` | No | Dedup key per workspace (max 190 characters) |

## Levels

- `info` — general information (default)
- `success` — completed successfully
- `warning` — attention needed
- `error` — failure or alert

## Delivery urgency

- `standard` — normal notifications (default)
- `time_sensitive` — iOS Time Sensitive delivery (requires user permission)

## Idempotency

When you set `idempotency_key`, retries with the same key return the existing event (`duplicate: true`, HTTP 200, message `already stored`) without sending it again.

A 409 (another request is delivering the same key), 429, 502, 503 (push unavailable) or 504, a network error or a timeout is retried automatically with the same key, honouring `Retry-After`.

```typescript
await trigv.sendEvent({
  channel: 'deploys',
  title: 'Production deploy complete',
  idempotency_key: 'deploy-prod-42',
});
```

## Error handling

```typescript
import {
  ConflictError,
  NotFoundError,
  RateLimitError,
  ServiceUnavailableError,
  ValidationError,
} from '@trigv/sdk';

try {
  await trigv.sendEvent({ channel: 'general', title: 'Hello' });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(error.errors);
  } else if (error instanceof NotFoundError) {
    console.error('Channel not found');
  } else if (
    error instanceof RateLimitError ||
    error instanceof ConflictError ||
    error instanceof ServiceUnavailableError
  ) {
    console.error(`Retry in ${(error.retryAfterMs ?? 0) / 1000}s`);
  }
  // Every API error carries the X-Request-ID header. Quote it to support.
  console.error((error as { requestId?: string }).requestId);
}
```

| Status | Error | Retried |
|--------|-------|:-------:|
| 401 | `AuthenticationError` | No |
| 403 | `AuthorizationError` | No |
| 404 | `NotFoundError` | No |
| 409 | `ConflictError` | Yes, with `idempotency_key` |
| 422 | `ValidationError` | No |
| 429 | `RateLimitError` (60 requests per minute per workspace) | Yes, with `idempotency_key` |
| 503 | `ServiceUnavailableError` | Yes, with `idempotency_key` |
| 502, 504 | `ApiError` | Yes, with `idempotency_key` |

Network errors and timeouts are retried the same way. `verifyConnection()` (`GET /v1/connection`) is always retried, because it is safe to repeat. Retries wait for the `Retry-After` header. If `Retry-After` is longer than the request timeout, the original error is thrown at once, without waiting.

## Configuration

| Option | Default | Description |
|--------|---------|-------------|
| `apiKey` | `TRIGV_API_KEY` env | Workspace API key |
| `baseUrl` | `https://api.trigv.com` | API base URL. A URL ending in `/api` still works |
| `timeout` | `30000` | Request timeout (ms) |
| `maxRetries` | `2` | Retries for retryable errors |

### Verify connection

```typescript
const connection = await trigv.verifyConnection();
console.log(connection.workspace.name);
```

## Examples

See the [`examples/`](./examples/) directory:

- Basic event (`basic.ts`)
- Deploy completed (`deploy-completed.ts`)
- Cron job failed (`cron-failed.ts`)

## Development

```bash
npm install
npm run build
npm test
npm run lint
```

## Testing

```bash
npm test
```

Tests use mocked HTTP — no live API key required.

## Contributing

Contributions welcome. Please open an issue before large changes.

## Licence

MIT

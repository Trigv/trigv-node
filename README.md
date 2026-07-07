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
| `channel` | Yes | Channel slug (e.g. `general`) |
| `title` | Yes | Notification title |
| `description` | No | Body text |
| `image_url` | No | HTTPS image URL (not stored server-side) |
| `level` | No | `info`, `success`, `warning`, `error` (default: `info`) |
| `delivery_urgency` | No | `standard` or `time_sensitive` (default: `standard`) |
| `event_type` | No | Free-form label (e.g. `deploy.completed`) |
| `idempotency_key` | No | Dedup key per workspace |

## Levels

- `info` — general information (default)
- `success` — completed successfully
- `warning` — attention needed
- `error` — failure or alert

## Delivery urgency

- `standard` — normal notifications (default)
- `time_sensitive` — iOS Time Sensitive delivery (requires user permission)

## Idempotency

When you set `idempotency_key`, retries with the same key return the existing event (`duplicate: true`, HTTP 200) without billing again.

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
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  ValidationError,
} from '@trigv/sdk';

try {
  await trigv.sendEvent({ channel: 'general', title: 'Hello' });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(error.errors);
  } else if (error instanceof NotFoundError) {
    console.error('Channel not found');
  } else if (error instanceof RateLimitError) {
    console.error(error.retryable ? 'Retry later' : 'Monthly limit reached');
  }
}
```

## Configuration

| Option | Default | Description |
|--------|---------|-------------|
| `apiKey` | `TRIGV_API_KEY` env | Workspace API key |
| `baseUrl` | `https://api.trigv.com/api` | API base URL |
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

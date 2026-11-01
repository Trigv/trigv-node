import type { LEVELS, DELIVERY_URGENCIES } from './constants.js';

export type NotificationLevel = (typeof LEVELS)[number];

export type DeliveryUrgency = (typeof DELIVERY_URGENCIES)[number];

export interface TrigvClientOptions {
  /** Workspace ingest API key (`trgv_…`). Falls back to `TRIGV_API_KEY` env var. */
  apiKey?: string;
  /** API base URL. Default: `https://api.trigv.com`. A base URL ending in `/api` still works. */
  baseUrl?: string;
  /** Request timeout in milliseconds. Default: 30000 */
  timeout?: number;
  /** Max retries for retryable errors. Default: 2 */
  maxRetries?: number;
  /** Custom fetch implementation (for testing). */
  fetch?: typeof fetch;
}

export interface SendEventParams {
  /** Channel slug (e.g. `general`). Required. */
  channel: string;
  /** Notification title. Required. */
  title: string;
  /** Optional body text. */
  description?: string;
  /** Optional HTTPS image URL (passed through to devices; not stored server-side). */
  image_url?: string;
  /** Optional destination URL (passed through to devices; not stored server-side). */
  url?: string;
  /** Notification level. Default: `info` */
  level?: NotificationLevel;
  /** iOS delivery urgency. Default: `standard` */
  delivery_urgency?: DeliveryUrgency;
  /** Free-form event label (e.g. `deploy.completed`). */
  event_type?: string;
  /** Dedup key per workspace. Retries with the same key return the existing event. */
  idempotency_key?: string;
}

export interface Event {
  public_id: string;
  event_uuid: string;
  status: 'pending' | 'sent' | 'failed';
  level: NotificationLevel;
  event_type: string | null;
  target_device_count: number;
  received_at: string | null;
}

export interface SendEventResult {
  event: Event;
  /** `true` when HTTP 200 ("already stored"), duplicate idempotency key. */
  duplicate: boolean;
  /** Value of the `X-Request-ID` response header. `undefined` when the header is missing. */
  readonly requestId?: string;
}

export interface ConnectionWorkspace {
  public_id: string;
  name: string;
}

export interface ConnectionApiKey {
  public_id: string;
  name: string;
  prefix: string;
}

export interface ConnectionResult {
  workspace: ConnectionWorkspace;
  api_key: ConnectionApiKey;
  /** Value of the `X-Request-ID` response header. `undefined` when the header is missing. */
  readonly requestId?: string;
}

export interface ValidationErrors {
  [field: string]: string[];
}

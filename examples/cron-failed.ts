import { Trigv } from '../src/index.js';

const trigv = new Trigv();

await trigv.sendEvent({
  channel: 'ops',
  title: 'Nightly backup failed',
  description: 'pg_dump exited with code 1 on db-primary',
  level: 'error',
  event_type: 'cron.failed',
});

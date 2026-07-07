import { Trigv } from '../src/index.js';

const trigv = new Trigv();

const { event, duplicate } = await trigv.sendEvent({
  channel: 'deploys',
  title: 'Production deploy complete',
  description: 'Build #42 succeeded in 38s (commit abc1234)',
  level: 'success',
  delivery_urgency: 'standard',
  event_type: 'deploy.completed',
  idempotency_key: 'deploy-prod-42',
  url: 'https://example.com/deployments/42',
});

console.log(event.public_id, duplicate ? '(duplicate)' : '(new)');

import { Trigv } from '../src/index.js';

const trigv = new Trigv();

await trigv.sendEvent({
  channel: 'general',
  title: 'Hello from Node',
});

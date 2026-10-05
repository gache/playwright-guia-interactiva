import { defineConfig } from '@playwright/test';
import { HOSTS, PORT } from './mock-server.mjs';

const kind = process.env.VERIFY_KIND ?? 'fiction'; // 'real' hits the public practice sites; 'fiction' uses the local mock server
const dir = process.env.VERIFY_DIR ?? `./.generated/${process.env.VERIFY_LOC ?? 'es'}/${kind}`;

export default defineConfig({
  testDir: dir,
  retries: 0,
  workers: Number(process.env.VERIFY_WORKERS ?? 2),
  timeout: kind === 'real' ? 45_000 : 30_000,
  reporter: 'line',
  use: kind === 'real'
    ? { actionTimeout: 15_000 }
    : {
        ignoreHTTPSErrors: true,
        actionTimeout: 10_000,
        launchOptions: {
          args: ['--ignore-certificate-errors', '--host-resolver-rules=' + HOSTS.map(h => `MAP ${h} 127.0.0.1:${PORT}`).join(',')],
        },
      },
});

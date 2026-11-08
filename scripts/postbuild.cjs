const { spawnSync } = require('node:child_process');
const path = require('node:path');

// Node-only build-time home SSR, on every host including Netlify.
const result = spawnSync(process.execPath, [path.join(__dirname, 'render-home.mjs')], {
  stdio: 'inherit',
});
if (result.error) console.error('Unable to start home SSR:', result.error);
process.exit(result.status ?? 1);

#!/usr/bin/env node
const { execSync } = require('node:child_process');

const env = {
  ...process.env,
  PRISM_API: process.env.PRISM_API || 'http://localhost:3333',
  PRISM_TOKEN: process.env.PRISM_TOKEN || 'devtoken123'
};

function run(cmd) {
  console.log('>', cmd);
  execSync(cmd, { stdio: 'inherit', env });
}

run(`curl -s ${env.PRISM_API}/health`);
run('node apps/cli/dist/index.js issue:show Helpers-001');
run('node apps/cli/dist/index.js issue:next --category Helpers || true');

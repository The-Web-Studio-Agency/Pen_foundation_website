/**
 * PM2 process file for the VPS:  pm2 start ecosystem.config.cjs
 *
 * One instance on purpose: the CMS keeps saved content in memory and
 * refreshes it from MongoDB every few seconds. Several instances would each
 * hold their own copy, so an admin save could take a moment to show on some
 * requests. One Next.js process comfortably serves this site.
 */
module.exports = {
  apps: [
    {
      name: 'pen-foundation',
      cwd: __dirname,
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000 -H 127.0.0.1',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '1500M',
      env: { NODE_ENV: 'production' },
    },
  ],
};

import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

async function build() {
  try {
    // Create api directory if it doesn't exist
    if (!fs.existsSync('./api')) {
      fs.mkdirSync('./api');
    }

    // Build server
    const result = await esbuild.build({
      entryPoints: ['server/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node16',
      format: 'esm',
      outfile: 'api/index.js',
      external: [
        'pg-native',
        'pg-query-stream',
        '@neondatabase/serverless',
        'express',
        'ws',
        'passport',
        'passport-local',
        'express-session',
        'zod',
        'dotenv'
      ],
      tsconfig: 'tsconfig.json',
      loader: {
        '.ts': 'ts',
        '.tsx': 'tsx',
        '.js': 'js',
        '.jsx': 'jsx'
      },
      logLevel: 'info'
    });

    console.log('Server build complete');
  } catch (error) {
    console.error('Server build failed:', error);
    process.exit(1);
  }
}

build(); 
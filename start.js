import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const envFile = fileURLToPath(new URL('./.env', import.meta.url));
if (existsSync(envFile)) process.loadEnvFile(envFile);
else console.log('No .env found. Starting built-in learning; live AI is optional.');
await import('./server.js');

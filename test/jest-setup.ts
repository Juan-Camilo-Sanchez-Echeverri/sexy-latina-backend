import { config } from 'dotenv';
import { resolve } from 'node:path';

process.env.NODE_ENV = 'local';
config({ path: resolve(process.cwd(), '.env.test'), override: true });

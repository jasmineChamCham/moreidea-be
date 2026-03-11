import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'ts-node prisma/seed.ts',
  },
  datasource: {
    // Use process.env directly so Railway-injected vars are always resolved
    // This URL is used by Prisma CLI for migrations, introspection, etc.
    // It should be a direct connection (not pooled)
    url: process.env.DIRECT_URL,
  },
});

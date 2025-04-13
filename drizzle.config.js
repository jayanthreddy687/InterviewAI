import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './utils/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_EPizYh9rq4uA@ep-nameless-dawn-a57u596v-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require',
  },
});

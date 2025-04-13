import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js'
const sql = neon('postgresql://neondb_owner:npg_EPizYh9rq4uA@ep-nameless-dawn-a57u596v-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require');
export const db = drizzle(sql,{schema});


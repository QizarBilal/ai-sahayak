import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use in-memory database for demo if DATABASE_URL is not set
const connectionString = process.env.DATABASE_URL || 'postgresql://demo:demo@localhost:5432/demo';

let pool: Pool;
let db: any;

try {
  if (process.env.DATABASE_URL) {
    pool = new Pool({ connectionString });
    db = drizzle({ client: pool, schema });
    console.log('Connected to PostgreSQL database');
  } else {
    console.warn('DATABASE_URL not set, using in-memory mock storage');
    // Create a mock db object that will work with the storage layer
    pool = null as any;
    db = null as any;
  }
} catch (error) {
  console.error('Database connection error:', error);
  console.warn('Falling back to in-memory storage');
  pool = null as any;
  db = null as any;
}

export { pool, db };

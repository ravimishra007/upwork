import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Use the provided Supabase PostgreSQL connection string
const connectionString = 'postgresql://postgres:asdfg@147@db.ngytqujgblbravfjcdep.supabase.co:5432/postgres';

export const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });

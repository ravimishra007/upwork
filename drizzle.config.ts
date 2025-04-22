import type { Config } from 'drizzle-kit';

export default {
  schema: './shared/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    connectionString: 'postgresql://postgres:asdfg@147@db.ngytqujgblbravfjcdep.supabase.co:5432/postgres',
  },
} satisfies Config;

import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from './db';

// This script applies all migrations from the migrations folder
async function main() {
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations complete!');
  await pool.end();
}

main().catch((err) => {
  console.error('Error during migration:', err);
  process.exit(1);
}); 
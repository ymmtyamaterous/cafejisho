import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { course } from './schema/course';

async function main() {
  const client = createClient({ url: 'file:/workspace/better-t-app/local.db' });
  const db = drizzle(client);
  
  console.log('Updating courses...');
  const result = await db.update(course).set({ isPremium: true }).returning();
  console.log('Update complete. Number of rows updated:', result.length);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

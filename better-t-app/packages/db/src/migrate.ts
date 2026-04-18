import { migrate as drizzleMigrate } from "drizzle-orm/libsql/migrator";
import { join } from "node:path";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import type * as schema from "./schema";

/**
 * マイグレーションを適用する。
 * 優先順位: 引数 > MIGRATIONS_FOLDER 環境変数 > src/migrations（開発時デフォルト）
 */
export async function migrate(
  db: LibSQLDatabase<typeof schema>,
  migrationsFolder?: string,
) {
  const folder =
    migrationsFolder ??
    process.env.MIGRATIONS_FOLDER ??
    join(import.meta.dirname, "migrations");

  await drizzleMigrate(db, { migrationsFolder: folder });
}

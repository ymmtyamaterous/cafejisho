import { createClient } from "@libsql/client";
const client = createClient({ url: "file:./local.db" });
const r = await client.execute("UPDATE course SET is_premium = 0 WHERE id IN ('course-intermediate', 'course-advanced')");
console.log("Updated rows:", r.rowsAffected);
// Verify
const rows = await client.execute("SELECT id, title, is_premium FROM course");
for (const row of rows.rows) {
  console.log(row.id, row.title, "is_premium:", row.is_premium);
}
client.close();

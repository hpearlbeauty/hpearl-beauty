// Applies src/lib/db/schema.sql to DATABASE_URL. Usage: pnpm db:migrate
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
const url = process.env.DATABASE_URL;
if (!url) { console.error("DATABASE_URL is not set"); process.exit(1); }
const sql = neon(url);
const statements = readFileSync(new URL("../src/lib/db/schema.sql", import.meta.url), "utf8").split(/;\s*\n/).map((s) => s.trim()).filter(Boolean);
for (const s of statements) await sql.query(s);
console.log(`Applied ${statements.length} statements.`);


import { db, sql } from "../lib/db/index";

async function main() {
  console.log("Testing database connection...");
  try {
    // Run a simple query to verify connection
    const result = await sql`SELECT 1 as connected`;
    console.log("Database connection successful!", result);
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    process.exit(0);
  }
}

main()
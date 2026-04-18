import { sql } from "../db";
import type { Friend } from "../../../src/types/friend";

export async function handleGet() {
  const rows = await sql`
    SELECT * FROM friends
    ORDER BY created_at DESC
  `;

  return new Response(JSON.stringify({ friends: rows as Friend[] }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=60",
    },
  });
}

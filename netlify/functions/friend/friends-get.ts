import { sql } from "../db";
import type { Friend } from "../../../src/types/friend";

export async function handleGetById(id: string) {
  const rows = await sql`
    SELECT * FROM friends
    WHERE id = ${id}
  `;

  if (rows.length === 0) {
    return new Response(JSON.stringify({ error: "Friend not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ friend: rows[0] as Friend }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

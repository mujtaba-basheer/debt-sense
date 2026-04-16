import { sql } from "../db";

export async function handleDelete(id: string) {
  const rows = await sql`
    DELETE FROM friends
    WHERE id = ${id}
    RETURNING id
  `;

  if (rows.length === 0) {
    return new Response(JSON.stringify({ error: "Friend not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ deleted: rows[0].id }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

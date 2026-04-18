import { sql } from "../db";

export async function handleDelete(id: string) {
  const rows = await sql`
    DELETE FROM transactions WHERE id = ${id} RETURNING id
  `;

  if (rows.length === 0)
    return new Response("Transaction not found", { status: 404 });

  return new Response(null, { status: 204 });
}

import { sql } from "../db";

export async function handleSettle(id: string) {
  const rows = await sql`
    UPDATE transactions
    SET status = 'settled', updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, status
  `;

  if (rows.length === 0)
    return new Response("Transaction not found", { status: 404 });

  return new Response(JSON.stringify(rows[0]), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

import { sql } from "../db";
import { addTransactionSchema } from "../../../src/logic/transaction";
import type { Transaction } from "../../../src/types/transaction";

export async function handlePatch(id: string, req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = addTransactionSchema.omit({ receipt: true }).safeParse(body);
  if (!result.success) {
    return new Response(
      JSON.stringify({ error: result.error.flatten().fieldErrors }),
      { status: 422, headers: { "Content-Type": "application/json" } },
    );
  }

  const { type, amount, friendId, date, category, notes } = result.data;

  const rows = await sql`
    UPDATE transactions
    SET
      type       = ${type},
      amount     = ${amount},
      friend_id  = ${friendId},
      date       = ${date},
      category   = ${category},
      notes      = ${notes ?? null},
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `;

  if (rows.length === 0) {
    return new Response(JSON.stringify({ error: "Transaction not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ transaction: rows[0] as Transaction }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

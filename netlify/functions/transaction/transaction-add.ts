import { sql } from "../db";
import { addTransactionSchema } from "../../../src/logic/transaction";
import type { Transaction } from "../../../src/types/transaction";

export async function handlePost(req: Request) {
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
    INSERT INTO transactions (friend_id, type, amount, category, date, notes)
    VALUES (${friendId}, ${type}, ${amount}, ${category}, ${date}, ${notes ?? null})
    RETURNING *
  `;

  return new Response(JSON.stringify({ transaction: rows[0] as Transaction }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

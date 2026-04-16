import { sql } from "../db";
import type { Transaction } from "../../../src/types/transaction";

export async function handleGetByFriend(friendId: string) {
  const rows = await sql`
    SELECT * FROM transactions
    WHERE friend_id = ${friendId}
    ORDER BY date DESC, created_at DESC
  `;

  return new Response(JSON.stringify({ transactions: rows as Transaction[] }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

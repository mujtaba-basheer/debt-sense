import { sql } from "../db";
import type { Transaction } from "../../../src/types/transaction";

export type TransactionWithFriend = Transaction & { friend_name: string };

export async function handleGetList() {
  const rows = await sql`
    SELECT
      t.*,
      f.name AS friend_name
    FROM transactions t
    JOIN friends f ON f.id = t.friend_id
    ORDER BY t.date DESC, t.created_at DESC
    LIMIT 20
  `;

  return new Response(JSON.stringify({ transactions: rows as TransactionWithFriend[] }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
    },
  });
}

import { sql } from "../db";

export async function handleSettleAllByFriend(friendId: string) {
  const rows = await sql`
    UPDATE transactions
    SET status = 'settled', updated_at = NOW()
    WHERE friend_id = ${friendId}
      AND status = 'pending'
    RETURNING id
  `;

  return new Response(JSON.stringify({ settled_count: rows.length }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

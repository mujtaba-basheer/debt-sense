import { sql } from "../db";

export async function handleGetSummaryByFriend(friendId: string) {
  const rows = await sql`
    SELECT
      COALESCE(SUM(amount) FILTER (WHERE type = 'lent'), 0)::text     AS total_lent,
      COALESCE(SUM(amount) FILTER (WHERE type = 'borrowed'), 0)::text  AS total_borrowed
    FROM transactions
    WHERE friend_id = ${friendId}
  `;

  const { total_lent, total_borrowed } = rows[0] as {
    total_lent: string;
    total_borrowed: string;
  };

  return new Response(
    JSON.stringify({ total_lent, total_borrowed }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

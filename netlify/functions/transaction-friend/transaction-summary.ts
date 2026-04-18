import { sql } from "../db";

export async function handleGetSummaryByFriend(friendId: string) {
  const rows = await sql`
    SELECT
      COALESCE(SUM(amount) FILTER (WHERE type = 'lent'     AND status = 'pending'), 0)::text AS total_lent,
      COALESCE(SUM(amount) FILTER (WHERE type = 'borrowed' AND status = 'pending'), 0)::text AS total_borrowed
    FROM transactions
    WHERE friend_id = ${friendId}
  `;

  const { total_lent, total_borrowed } = rows[0] as {
    total_lent: string;
    total_borrowed: string;
  };

  return new Response(
    JSON.stringify({ total_lent, total_borrowed }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=1800, stale-while-revalidate=60",
      },
    }
  );
}

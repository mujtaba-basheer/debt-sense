import { sql } from "../db";

export interface TransactionWithFriend {
  id: string;
  friend_id: string;
  friend_name: string;
  type: "lent" | "borrowed";
  amount: string;
  category: string | null;
  date: string;
  notes: string | null;
  receipt_url: string | null;
  created_at: string;
  updated_at: string;
}

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

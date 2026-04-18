import { sql } from "../db";
import type { Transaction } from "../../../src/types/transaction";

export type TransactionWithFriend = Transaction & { friend_name: string };

export async function handleGetLatest() {
  const rows = await sql`
    SELECT
      t.*,
      f.name AS friend_name
    FROM transactions t
    JOIN friends f ON f.id = t.friend_id
    ORDER BY t.date DESC, t.created_at DESC
    LIMIT 20
  `;

  return new Response(
    JSON.stringify({ transactions: rows as TransactionWithFriend[] }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    },
  );
}

export async function handleGetAll(url: URL) {
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
  const limit = Math.min(
    10,
    Math.max(1, parseInt(url.searchParams.get("limit") ?? "20")),
  );
  const type = url.searchParams.get("type"); // "lent" | "borrowed" | null
  const offset = (page - 1) * limit;

  const rows = await sql`
    SELECT
      t.*,
      f.name AS friend_name
    FROM transactions t
    JOIN friends f ON f.id = t.friend_id
    WHERE ${type === "lent" || type === "borrowed" ? sql`t.type = ${type}` : sql`TRUE`}
    ORDER BY t.date DESC, t.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const [{ count }] = await sql`
    SELECT COUNT(*)::int AS count
    FROM transactions t
    WHERE ${type === "lent" || type === "borrowed" ? sql`t.type = ${type}` : sql`TRUE`}
  `;

  return new Response(
    JSON.stringify({
      transactions: rows as TransactionWithFriend[],
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    },
  );
}

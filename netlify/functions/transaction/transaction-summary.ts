import { sql } from "../db";

export interface TransactionSummary {
  total_lent: string;
  total_borrowed: string;
  net_balance: string;
}

export async function handleGetSummary() {
  const rows = await sql`
    SELECT
      COALESCE(SUM(amount) FILTER (WHERE type = 'lent'     AND status = 'pending'), 0)::text AS total_lent,
      COALESCE(SUM(amount) FILTER (WHERE type = 'borrowed' AND status = 'pending'), 0)::text AS total_borrowed,
      (
        COALESCE(SUM(amount) FILTER (WHERE type = 'lent'     AND status = 'pending'), 0) -
        COALESCE(SUM(amount) FILTER (WHERE type = 'borrowed' AND status = 'pending'), 0)
      )::text AS net_balance
    FROM transactions
  `;

  return new Response(JSON.stringify(rows[0] as TransactionSummary), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
    },
  });
}

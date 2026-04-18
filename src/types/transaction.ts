export interface Transaction {
  id: string;
  friend_id: string;
  type: "lent" | "borrowed";
  amount: string; // NUMERIC comes back as string from Neon
  category: string | null;
  date: string;
  notes: string | null;
  receipt_url: string | null;
  status: "pending" | "settled";
  created_at: string;
  updated_at: string;
}

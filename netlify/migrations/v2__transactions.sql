CREATE TABLE transactions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  friend_id    UUID NOT NULL REFERENCES friends(id) ON DELETE CASCADE,
  type         TEXT NOT NULL CHECK (type IN ('lent', 'borrowed')),
  amount       NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  category     TEXT,
  date         DATE NOT NULL DEFAULT CURRENT_DATE,
  notes        TEXT,
  receipt_url  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_friend_id ON transactions (friend_id);

CREATE TRIGGER transactions_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

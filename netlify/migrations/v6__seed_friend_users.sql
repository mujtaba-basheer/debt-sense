CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO users (name, email, password_hash, role, friend_id)
SELECT
  f.name,
  lower(replace(f.name, ' ', '')) || '@debt-sense.com',
  crypt(lower(replace(f.name, ' ', '')) || '_viewer', gen_salt('bf')),
  'viewer',
  f.id
FROM friends f
ON CONFLICT (email) DO NOTHING;

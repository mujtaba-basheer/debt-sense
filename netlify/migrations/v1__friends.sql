CREATE TABLE friends (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  initials    TEXT NOT NULL,                          -- e.g. "JC" — derived on insert
  relation    TEXT NOT NULL CHECK (relation IN ('Friend', 'Family', 'Work', 'Other')),
  gender      TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  avatar_color TEXT NOT NULL DEFAULT '#006c49',
  photo_url   TEXT,                                   -- URL after uploading to storage
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

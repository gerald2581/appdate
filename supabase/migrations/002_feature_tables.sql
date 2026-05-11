-- ============================================================
-- Migration 002: Feature Tables
-- Run AFTER 001_schema.sql
-- ============================================================

-- memories
CREATE TABLE memories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id   UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  title       TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 100),
  description TEXT CHECK (char_length(description) <= 2000),
  memory_date DATE NOT NULL,
  type        TEXT NOT NULL DEFAULT 'memory'
              CHECK (type IN ('memory', 'milestone', 'photo')),
  photo_path  TEXT,   -- Storage path, NOT a public URL
  created_by  UUID NOT NULL REFERENCES profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- date_plans
CREATE TABLE date_plans (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id    UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  title        TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 100),
  description  TEXT CHECK (char_length(description) <= 1000),
  location     TEXT CHECK (char_length(location) <= 200),
  planned_date TIMESTAMPTZ,
  status       TEXT NOT NULL DEFAULT 'planned'
               CHECK (status IN ('planned', 'done', 'cancelled')),
  budget       INTEGER CHECK (budget >= 0),
  created_by   UUID NOT NULL REFERENCES profiles(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER date_plans_updated_at
  BEFORE UPDATE ON date_plans
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- messages
CREATE TABLE messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id  UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  sender_id  UUID NOT NULL REFERENCES profiles(id),
  content    TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 4000),
  type       TEXT NOT NULL DEFAULT 'message'
             CHECK (type IN ('message', 'note')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- locations (live only — one row per user, upserted on position change)
CREATE TABLE locations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  couple_id  UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  lat        DOUBLE PRECISION NOT NULL DEFAULT 0,
  lng        DOUBLE PRECISION NOT NULL DEFAULT 0,
  is_sharing BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- special_dates
CREATE TABLE special_dates (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id  UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  title      TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 100),
  date       DATE NOT NULL,
  type       TEXT NOT NULL DEFAULT 'custom'
             CHECK (type IN ('anniversary', 'birthday', 'event', 'custom')),
  recurring  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Migration 001: Core Tables
-- Run in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- couples must be created BEFORE profiles (profiles FK → couples)
CREATE TABLE couples (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_b     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_a, user_b),
  -- canonical ordering prevents duplicate pairs (a,b) vs (b,a)
  CHECK(user_a < user_b)
);

-- profiles extends auth.users 1-to-1
CREATE TABLE profiles (
  id                 UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name               TEXT NOT NULL DEFAULT '',
  avatar_url         TEXT,
  partner_id         UUID REFERENCES profiles(id),      -- set when linked
  couple_id          UUID REFERENCES couples(id),       -- set when linked
  relationship_start DATE,
  invite_code        TEXT UNIQUE,
  invite_expires_at  TIMESTAMPTZ,
  invite_used        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, name, invite_code, invite_expires_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    encode(gen_random_bytes(16), 'hex'),   -- 128-bit = 32 hex chars
    NOW() + INTERVAL '24 hours'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

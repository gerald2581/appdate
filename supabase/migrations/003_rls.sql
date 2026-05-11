-- ============================================================
-- Migration 003: RLS Helper + All Policies
-- Run AFTER 002_feature_tables.sql
-- ============================================================

-- ── RLS Helper Function ──────────────────────────────────────
-- SECURITY DEFINER: bypasses RLS, so no infinite recursion.
-- STABLE: result cached per query for performance.
-- SET search_path: prevents search_path injection attacks.
CREATE OR REPLACE FUNCTION current_couple_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT couple_id FROM profiles WHERE id = auth.uid() LIMIT 1
$$;

-- Refresh invite code (called when code is expired or used)
CREATE OR REPLACE FUNCTION refresh_invite_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
BEGIN
  new_code := encode(gen_random_bytes(16), 'hex');
  UPDATE profiles
  SET
    invite_code        = new_code,
    invite_expires_at  = NOW() + INTERVAL '24 hours',
    invite_used        = FALSE
  WHERE id = auth.uid();
  RETURN new_code;
END;
$$;

-- ── Enable RLS on all tables ─────────────────────────────────
ALTER TABLE couples       ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories      ENABLE ROW LEVEL SECURITY;
ALTER TABLE date_plans    ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_dates ENABLE ROW LEVEL SECURITY;

-- ── couples ──────────────────────────────────────────────────
-- Users can only see their own couple row
CREATE POLICY "couples_read_own" ON couples
  FOR SELECT USING (user_a = auth.uid() OR user_b = auth.uid());

-- INSERT only via Edge Function (service role) — no user INSERT allowed

-- ── profiles ─────────────────────────────────────────────────
-- Read own profile + partner profile (same couple)
-- Uses current_couple_id() to avoid recursion
CREATE POLICY "profiles_read" ON profiles
  FOR SELECT USING (
    id = auth.uid()
    OR (
      couple_id IS NOT NULL
      AND couple_id = current_couple_id()
    )
  );

-- Update only own profile
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- INSERT is handled by the handle_new_user trigger (SECURITY DEFINER)
-- No user-facing INSERT policy needed

-- ── memories ─────────────────────────────────────────────────
CREATE POLICY "memories_couple_all" ON memories
  FOR ALL USING (couple_id = current_couple_id());

-- ── date_plans ───────────────────────────────────────────────
CREATE POLICY "date_plans_couple_all" ON date_plans
  FOR ALL USING (couple_id = current_couple_id());

-- ── messages ─────────────────────────────────────────────────
CREATE POLICY "messages_couple_all" ON messages
  FOR ALL USING (couple_id = current_couple_id());

-- ── locations ────────────────────────────────────────────────
-- couple_id is denormalized for fast RLS without joining profiles
CREATE POLICY "locations_couple_all" ON locations
  FOR ALL USING (couple_id = current_couple_id());

-- ── special_dates ────────────────────────────────────────────
CREATE POLICY "special_dates_couple_all" ON special_dates
  FOR ALL USING (couple_id = current_couple_id());

-- ── Storage RLS ──────────────────────────────────────────────
-- Run this AFTER creating the 'memories' bucket in Storage dashboard.
-- Bucket name: memories | Type: PRIVATE (not public)

-- Only couple members can upload to their couple_id path
CREATE POLICY "storage_memories_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'memories'
    AND (storage.foldername(name))[1] = current_couple_id()::TEXT
  );

-- Only couple members can read their photos
CREATE POLICY "storage_memories_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'memories'
    AND (storage.foldername(name))[1] = current_couple_id()::TEXT
  );

-- Only couple members can delete their photos
CREATE POLICY "storage_memories_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'memories'
    AND (storage.foldername(name))[1] = current_couple_id()::TEXT
  );

-- ============================================================
-- Migration 005: RPC — link_couple (atomic transaction)
-- Run AFTER 004_indexes.sql
--
-- Called by client: supabase.rpc('link_couple', { invite_code: '...' })
-- Returns: couple_id UUID on success, raises exception on error
-- ============================================================

CREATE OR REPLACE FUNCTION link_couple(p_invite_code TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_my_id       UUID  := auth.uid();
  v_my_couple   UUID;
  v_partner_id  UUID;
  v_couple_id   UUID;
  v_user_a      UUID;
  v_user_b      UUID;
BEGIN
  -- Caller must be authenticated
  IF v_my_id IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  -- Check if already linked
  SELECT couple_id INTO v_my_couple FROM profiles WHERE id = v_my_id;
  IF v_my_couple IS NOT NULL THEN
    RAISE EXCEPTION 'already_linked';
  END IF;

  -- Find partner by invite code (lock row to prevent race condition)
  SELECT id INTO v_partner_id
  FROM profiles
  WHERE
    invite_code       = lower(trim(p_invite_code))
    AND invite_used   = FALSE
    AND invite_expires_at > NOW()
  FOR UPDATE SKIP LOCKED;  -- non-blocking; if locked → concurrent attempt

  IF v_partner_id IS NULL THEN
    RAISE EXCEPTION 'invalid_or_expired_code';
  END IF;

  IF v_partner_id = v_my_id THEN
    RAISE EXCEPTION 'cannot_link_to_self';
  END IF;

  -- Check partner not already linked
  IF (SELECT couple_id FROM profiles WHERE id = v_partner_id) IS NOT NULL THEN
    RAISE EXCEPTION 'partner_already_linked';
  END IF;

  -- Canonical ordering (smaller UUID = user_a) matches CHECK constraint
  IF v_my_id < v_partner_id THEN
    v_user_a := v_my_id;
    v_user_b := v_partner_id;
  ELSE
    v_user_a := v_partner_id;
    v_user_b := v_my_id;
  END IF;

  -- Create couple (unique constraint prevents duplicate)
  INSERT INTO couples (user_a, user_b)
  VALUES (v_user_a, v_user_b)
  RETURNING id INTO v_couple_id;

  -- Update both profiles atomically
  UPDATE profiles
  SET
    partner_id  = v_partner_id,
    couple_id   = v_couple_id,
    updated_at  = NOW()
  WHERE id = v_my_id;

  UPDATE profiles
  SET
    partner_id  = v_my_id,
    couple_id   = v_couple_id,
    invite_used = TRUE,        -- mark code as consumed
    updated_at  = NOW()
  WHERE id = v_partner_id;

  RETURN v_couple_id;
END;
$$;

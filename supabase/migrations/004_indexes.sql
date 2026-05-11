-- ============================================================
-- Migration 004: Performance Indexes
-- Run AFTER 003_rls.sql
-- ============================================================

-- profiles: lookup by invite_code (couple linking)
-- Note: NOW() cannot be used in partial index (not IMMUTABLE), filter on invite_used only
CREATE INDEX idx_profiles_invite_code
  ON profiles(invite_code)
  WHERE invite_used = FALSE;

-- profiles: lookup partner by couple_id
CREATE INDEX idx_profiles_couple_id ON profiles(couple_id);

-- memories: feed ordered by date descending
CREATE INDEX idx_memories_couple_date
  ON memories(couple_id, memory_date DESC);

-- memories: filter by type
CREATE INDEX idx_memories_couple_type
  ON memories(couple_id, type);

-- date_plans: upcoming plans
CREATE INDEX idx_date_plans_couple_status
  ON date_plans(couple_id, status, planned_date);

-- messages: chat history (most recent first)
CREATE INDEX idx_messages_couple_time
  ON messages(couple_id, created_at DESC);

-- locations: partner lookup (single row per user, but FK join)
CREATE INDEX idx_locations_couple ON locations(couple_id);

-- special_dates: upcoming dates
CREATE INDEX idx_special_dates_couple_date
  ON special_dates(couple_id, date);

-- Change relationship_start from DATE to TIMESTAMPTZ
-- so users can set exact time (hours, minutes) for accurate timer

ALTER TABLE profiles
  ALTER COLUMN relationship_start TYPE TIMESTAMPTZ
  USING relationship_start::TIMESTAMPTZ;

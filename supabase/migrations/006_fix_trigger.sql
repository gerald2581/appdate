-- Fix handle_new_user trigger: use gen_random_uuid() instead of gen_random_bytes()
-- gen_random_uuid() is always available in Supabase without extra extensions

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
    substring(replace(gen_random_uuid()::text, '-', ''), 1, 32),
    NOW() + INTERVAL '24 hours'
  );
  RETURN NEW;
END;
$$;

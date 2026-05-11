-- Storage RLS untuk avatars bucket
-- Buat bucket manual di Supabase Dashboard: Storage → New Bucket
-- Name: avatars | Private: ON | Max size: 2MB | MIME: image/*

CREATE POLICY "avatars_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

CREATE POLICY "avatars_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

CREATE POLICY "avatars_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::TEXT
  );

-- RPC: hapus data couple + profile (soft delete — auth user tetap ada)
CREATE OR REPLACE FUNCTION delete_my_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_couple_id UUID;
BEGIN
  -- Ambil couple_id
  SELECT couple_id INTO v_couple_id FROM profiles WHERE id = auth.uid();

  -- Hapus semua data couple jika ada
  IF v_couple_id IS NOT NULL THEN
    DELETE FROM memories      WHERE couple_id = v_couple_id;
    DELETE FROM messages      WHERE couple_id = v_couple_id;
    DELETE FROM date_plans    WHERE couple_id = v_couple_id;
    DELETE FROM special_dates WHERE couple_id = v_couple_id;
    DELETE FROM locations     WHERE couple_id = v_couple_id;

    -- Lepas partner dari couple
    UPDATE profiles SET partner_id = NULL, couple_id = NULL
    WHERE couple_id = v_couple_id;

    DELETE FROM couples WHERE id = v_couple_id;
  END IF;

  -- Hapus profile sendiri
  DELETE FROM profiles WHERE id = auth.uid();
END;
$$;

# Supabase Setup Instructions

## Step A — Run Migrations (SQL Editor)

Buka Supabase Dashboard → pilih project → SQL Editor → klik "New query"

Jalankan file-file berikut **satu per satu**, urut, pastikan tidak ada error sebelum lanjut:

| Order | File | Isi |
|-------|------|-----|
| 1 | `migrations/001_schema.sql` | Tabel couples + profiles + triggers |
| 2 | `migrations/002_feature_tables.sql` | Tabel memories, plans, messages, locations, dates |
| 3 | `migrations/003_rls.sql` | RLS helper function + semua policies |
| 4 | `migrations/004_indexes.sql` | Performance indexes |
| 5 | `migrations/005_rpc_link_couple.sql` | RPC function untuk couple linking |

## Step B — Create Storage Bucket

1. Supabase Dashboard → Storage → New Bucket
2. Name: `memories`
3. **Public bucket: OFF** (private)
4. File size limit: `5 MB`
5. Allowed MIME types: `image/jpeg, image/png, image/webp, image/heic`
6. Klik Save

> Storage RLS policies sudah ada di `003_rls.sql` — akan aktif setelah bucket dibuat.

## Step C — Auth Settings

1. Supabase Dashboard → Authentication → URL Configuration
2. Site URL: `http://localhost:5173` (development)
   - Ganti ke Vercel URL setelah deploy
3. Redirect URLs: tambahkan `http://localhost:5173`

## Step D — Get API Keys

1. Supabase Dashboard → Project Settings → API
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon / public key** → `VITE_SUPABASE_ANON_KEY`
3. Buat file `.env` di root project:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

## Step E — Verify Setup

Jalankan query ini di SQL Editor untuk verifikasi:

```sql
-- Pastikan semua tabel ada
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Expected output:
-- couples
-- date_plans
-- locations
-- memories
-- messages
-- profiles
-- special_dates

-- Pastikan RLS aktif di semua tabel
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Semua kolom rowsecurity harus = true

-- Pastikan functions ada
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- Expected: current_couple_id, handle_new_user, link_couple,
--           refresh_invite_code, set_updated_at
```

import { supabase } from './supabase'
import { uploadToCloudinary, cdnUrl } from './cloudinary'

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
  'image/gif':  'gif',
}

function validateImage(file: File) {
  if (!ALLOWED_TYPES[file.type]) throw new Error('Hanya JPEG, PNG, WebP, atau GIF yang diizinkan')
  if (file.size > 10 * 1024 * 1024) throw new Error('Ukuran file maksimal 10MB')
}

// ── Memories: Cloudinary ─────────────────────────────────────────────────────
// photo_path di DB sekarang menyimpan Cloudinary URL langsung (bukan path Supabase)

export async function uploadPhoto(
  _coupleId: string,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  validateImage(file)
  const { url } = await uploadToCloudinary(file, onProgress)
  return url
}

export async function getSignedUrl(photoPath: string): Promise<string> {
  // Cloudinary URL langsung bisa diakses, tambahkan optimasi
  if (photoPath.includes('cloudinary.com')) return cdnUrl(photoPath)

  // Legacy Supabase signed URL (foto lama sebelum migrasi)
  const { data, error } = await supabase.storage
    .from('memories')
    .createSignedUrl(photoPath, 3600)
  if (error) throw error
  return data.signedUrl
}

export async function deletePhoto(photoPath: string) {
  // Cloudinary — skip delete dari client (API Secret tidak boleh di browser)
  // URL sudah tidak dipakai setelah record DB dihapus
  if (photoPath.includes('cloudinary.com')) return

  // Legacy Supabase
  const { error } = await supabase.storage.from('memories').remove([photoPath])
  if (error) throw error
}

// ── Avatars: tetap Supabase ──────────────────────────────────────────────────
const AVATAR_BUCKET = 'avatars'

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  validateImage(file)
  const ext  = ALLOWED_TYPES[file.type]
  const path = `${userId}/avatar.${ext}`

  const compressed = await compressImage(file)

  await supabase.storage.from(AVATAR_BUCKET).remove([path]).catch(() => null)

  const { error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, compressed, { contentType: compressed.type, upsert: true })

  if (error) throw error
  return path
}

export async function getAvatarUrl(path: string): Promise<string> {
  if (path.includes('cloudinary.com')) return path
  const { data, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .createSignedUrl(path, 3600)
  if (error) throw error
  return data.signedUrl
}

// ── Image compression (untuk avatar) ────────────────────────────────────────
async function compressImage(file: File): Promise<Blob> {
  if (file.size <= 1_000_000) return file

  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      const scale  = Math.sqrt(1_000_000 / file.size)
      canvas.width  = Math.floor(img.naturalWidth  * scale)
      canvas.height = Math.floor(img.naturalHeight * scale)
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        blob => blob ? resolve(blob) : reject(new Error('Compression failed')),
        'image/jpeg',
        0.85,
      )
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = url
  })
}

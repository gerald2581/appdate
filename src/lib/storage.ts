import { supabase } from './supabase'

const BUCKET = 'memories'
const SIGNED_URL_TTL = 3600 // 1 hour

export async function uploadPhoto(coupleId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${coupleId}/${crypto.randomUUID()}.${ext}`

  const compressed = await compressImage(file)

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, compressed, { contentType: compressed.type, upsert: false })

  if (error) throw error
  return path
}

export async function getSignedUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL)

  if (error) throw error
  return data.signedUrl
}

export async function deletePhoto(path: string) {
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw error
}

const AVATAR_BUCKET = 'avatars'

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const ext  = file.name.split('.').pop() ?? 'jpg'
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
  const { data, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .createSignedUrl(path, 3600)
  if (error) throw error
  return data.signedUrl
}

// Compress image to ≤ 1MB before upload
async function compressImage(file: File): Promise<Blob> {
  if (file.size <= 1_000_000) return file

  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      const scale = Math.sqrt(1_000_000 / file.size)
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

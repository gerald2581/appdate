const CLOUD_NAME   = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string
const UPLOAD_URL   = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

export interface UploadResult {
  url: string        // optimized delivery URL
  publicId: string   // for deletion later
}

export async function uploadToCloudinary(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<UploadResult> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', UPLOAD_PRESET)
  fd.append('quality', 'auto')
  fd.append('fetch_format', 'auto')

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', UPLOAD_URL)

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        const r = JSON.parse(xhr.responseText)
        resolve({
          url: r.secure_url,
          publicId: r.public_id,
        })
      } else {
        reject(new Error(`Upload gagal: ${xhr.statusText}`))
      }
    }

    xhr.onerror = () => reject(new Error('Upload gagal, cek koneksi internet'))
    xhr.send(fd)
  })
}

export async function uploadManyToCloudinary(
  files: File[],
  onProgress?: (done: number, total: number) => void,
): Promise<UploadResult[]> {
  let done = 0
  const results = await Promise.all(
    files.map(f =>
      uploadToCloudinary(f).then(r => {
        done++
        onProgress?.(done, files.length)
        return r
      })
    )
  )
  return results
}

// Build optimized URL with auto quality + format
export function cdnUrl(url: string, width = 800): string {
  if (!url.includes('cloudinary.com')) return url
  return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`)
}

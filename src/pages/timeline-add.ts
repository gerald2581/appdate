import { supabase } from '../lib/supabase'
import { getState } from '../store/state'
import { navigate } from '../router'
import { uploadPhoto } from '../lib/storage'
import { showToast } from '../components/toast'
import { todayISO } from '../lib/date-utils'
import { pickCaption } from '../lib/captions'

export function renderTimelineAdd(): HTMLElement {
  const wrapper = document.createElement('div')
  const { user, couple_id } = getState()
  if (!user || !couple_id) return wrapper

  let selectedFiles: File[] = []

  wrapper.innerHTML = `
    <div class="min-h-dvh bg-bg">
      <div class="flex items-center gap-3 px-4 pt-safe-8 pb-6">
        <button id="btn-back"
          class="w-9 h-9 rounded-full border border-border flex items-center justify-center text-ink-muted hover:bg-surface-2 cursor-pointer bg-transparent flex-shrink-0">
          ←
        </button>
        <h1 class="font-display text-xl text-ink">Tambah Kenangan</h1>
      </div>

      <form id="form" class="px-4 flex flex-col gap-5 pb-12" novalidate>

        <!-- Multi-photo picker -->
        <div>
          <label for="photo-input" class="block cursor-pointer">
            <div id="photo-zone"
              class="w-full min-h-[11rem] rounded-2xl bg-surface-2 border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-accent transition-colors overflow-hidden p-3">
              <span class="text-3xl opacity-30">📷</span>
              <span class="text-xs text-ink-muted">Tap untuk pilih foto (bisa lebih dari 1)</span>
            </div>
            <input id="photo-input" type="file" accept="image/*" multiple class="hidden" />
          </label>
          <!-- Upload progress -->
          <div id="upload-progress" class="hidden mt-3">
            <div class="flex justify-between text-xs text-ink-muted mb-1">
              <span id="progress-label">Mengupload...</span>
              <span id="progress-count"></span>
            </div>
            <div class="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
              <div id="progress-bar" class="h-full rounded-full transition-all duration-300"
                   style="background:linear-gradient(90deg,#c8826a,#d4956a); width:0%"></div>
            </div>
          </div>
        </div>

        <!-- Title -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-ink" for="title">Judul *</label>
          <input id="title" class="field" type="text" placeholder="Nama momen ini..." required maxlength="100" />
        </div>

        <!-- Type + Date row -->
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-ink" for="type">Jenis</label>
            <select id="type" class="field">
              <option value="memory">Kenangan</option>
              <option value="milestone">Milestone</option>
              <option value="photo">Foto</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-ink" for="date">Tanggal *</label>
            <input id="date" class="field" type="date" value="${todayISO()}" max="${todayISO()}" required />
          </div>
        </div>

        <p id="error" class="text-sm text-danger hidden"></p>

        <button id="btn-submit" type="submit"
          class="w-full py-3.5 rounded-full bg-ink text-bg text-sm font-medium
                 hover:opacity-80 active:scale-[0.98] transition-all cursor-pointer border-none
                 disabled:opacity-40 disabled:cursor-not-allowed mt-2">
          Simpan Kenangan
        </button>
      </form>
    </div>
  `

  const photoInput    = wrapper.querySelector('#photo-input') as HTMLInputElement
  const photoZone     = wrapper.querySelector('#photo-zone') as HTMLElement
  const progressWrap  = wrapper.querySelector('#upload-progress') as HTMLElement
  const progressBar   = wrapper.querySelector('#progress-bar') as HTMLElement
  const progressLabel = wrapper.querySelector('#progress-label') as HTMLElement
  const progressCount = wrapper.querySelector('#progress-count') as HTMLElement

  const MAX_PHOTOS  = 20
  const PREVIEW_MAX = 9
  const previewUrls: string[] = []

  const revokePreviewUrls = () => {
    previewUrls.forEach(u => URL.revokeObjectURL(u))
    previewUrls.length = 0
  }

  // Photo preview grid — shows up to PREVIEW_MAX thumbs, revokes old URLs
  photoInput.addEventListener('change', () => {
    const raw = Array.from(photoInput.files ?? [])
    if (raw.length === 0) return

    if (raw.length > MAX_PHOTOS) {
      showToast(`Maksimal ${MAX_PHOTOS} foto sekaligus`, 'error')
      photoInput.value = ''
      return
    }

    revokePreviewUrls()
    selectedFiles = raw

    const previewed = raw.slice(0, PREVIEW_MAX)
    previewed.forEach(f => previewUrls.push(URL.createObjectURL(f)))

    if (raw.length === 1) {
      photoZone.innerHTML = `<img src="${previewUrls[0]}" class="w-full h-full object-cover rounded-xl" />`
    } else {
      const extra  = raw.length - previewed.length
      const cols   = Math.min(previewed.length, 3)
      const items  = previewed.map((_, i) => {
        const isLast = extra > 0 && i === previewed.length - 1
        return `<div class="aspect-square rounded-xl overflow-hidden bg-surface-2 relative">
          <img src="${previewUrls[i]}" class="w-full h-full object-cover" />
          ${isLast ? `<div class="absolute inset-0 flex items-center justify-center rounded-xl"
              style="background:rgba(26,25,22,0.55)">
            <span class="text-white text-sm font-bold">+${extra + 1}</span>
          </div>` : ''}
        </div>`
      }).join('')
      photoZone.innerHTML = `
        <div class="grid gap-1.5 w-full" style="grid-template-columns: repeat(${cols}, 1fr)">
          ${items}
        </div>
        <p class="text-xs text-ink-muted mt-2">${raw.length} foto dipilih</p>
      `
    }
  })

  wrapper.querySelector('#btn-back')!.addEventListener('click', () => {
    revokePreviewUrls()
    navigate('/timeline')
  })

  const form      = wrapper.querySelector('#form') as HTMLFormElement
  const submitBtn = wrapper.querySelector('#btn-submit') as HTMLButtonElement
  const errorEl   = wrapper.querySelector('#error') as HTMLElement

  form.addEventListener('submit', async e => {
    e.preventDefault()
    submitBtn.disabled = true
    errorEl.classList.add('hidden')

    const title = (wrapper.querySelector('#title') as HTMLInputElement).value.trim()
    const type  = (wrapper.querySelector('#type') as HTMLSelectElement).value
    const date  = (wrapper.querySelector('#date') as HTMLInputElement).value

    if (!title) {
      errorEl.textContent = 'Judul wajib diisi'
      errorEl.classList.remove('hidden')
      submitBtn.disabled = false
      return
    }

    try {
      if (selectedFiles.length > 0) {
        // Multi-photo upload dengan progress
        progressWrap.classList.remove('hidden')
        submitBtn.textContent = 'Mengupload foto...'

        let uploaded = 0
        const photoPaths: string[] = []

        for (const file of selectedFiles) {
          const path = await uploadPhoto(couple_id, file, (pct) => {
            const overall = ((uploaded + pct / 100) / selectedFiles.length) * 100
            progressBar.style.width = `${overall.toFixed(0)}%`
            progressLabel.textContent = `Mengupload foto ${uploaded + 1} dari ${selectedFiles.length}...`
            progressCount.textContent = `${overall.toFixed(0)}%`
          })
          photoPaths.push(path)
          uploaded++
        }

        progressBar.style.width = '100%'
        progressLabel.textContent = 'Menyimpan kenangan...'
        submitBtn.textContent = 'Menyimpan...'

        // Simpan semua foto sebagai entries terpisah, foto pertama pakai title+description
        const inserts = photoPaths.map((photoPath, i) => ({
          couple_id,
          title:       i === 0 ? title : `${title} ${i + 1}`,
          type,
          memory_date: date,
          description: pickCaption(),
          photo_path:  photoPath,
          created_by:  user.id,
        }))

        const { error } = await supabase.from('memories').insert(inserts)
        if (error) throw error

        showToast(`${photoPaths.length} kenangan tersimpan ✦`, 'success')
      } else {
        // Tanpa foto
        submitBtn.textContent = 'Menyimpan...'
        const { error } = await supabase.from('memories').insert({
          couple_id,
          title,
          type,
          memory_date: date,
          description: pickCaption(),
          photo_path:  null,
          created_by:  user.id,
        })
        if (error) throw error
        showToast('Kenangan tersimpan ✦', 'success')
      }

      revokePreviewUrls()
      navigate('/timeline')
    } catch (err: unknown) {
      progressWrap.classList.add('hidden')
      errorEl.textContent = err instanceof Error ? err.message : 'Gagal menyimpan'
      errorEl.classList.remove('hidden')
      submitBtn.disabled = false
      submitBtn.textContent = 'Simpan Kenangan'
    }
  })

  return wrapper
}

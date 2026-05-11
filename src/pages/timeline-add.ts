import { supabase } from '../lib/supabase'
import { getState } from '../store/state'
import { navigate } from '../router'
import { uploadPhoto } from '../lib/storage'
import { showToast } from '../components/toast'
import { todayISO } from '../lib/date-utils'

export function renderTimelineAdd(): HTMLElement {
  const wrapper = document.createElement('div')
  const { user, couple_id } = getState()
  if (!user || !couple_id) return wrapper

  let selectedFile: File | null = null

  wrapper.innerHTML = `
    <div class="min-h-dvh bg-bg">
      <div class="flex items-center gap-3 px-4 pt-8 pb-6">
        <button id="btn-back"
          class="w-9 h-9 rounded-full border border-border flex items-center justify-center text-ink-muted hover:bg-surface-2 cursor-pointer bg-transparent flex-shrink-0">
          ←
        </button>
        <h1 class="font-display text-xl text-ink">Tambah Kenangan</h1>
      </div>

      <form id="form" class="px-4 flex flex-col gap-5 pb-12" novalidate>

        <!-- Photo picker -->
        <label for="photo-input" class="block cursor-pointer">
          <div id="photo-preview"
            class="w-full h-44 rounded-2xl bg-surface-2 border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-accent transition-colors overflow-hidden">
            <span class="text-3xl opacity-30">📷</span>
            <span class="text-xs text-ink-muted">Tap untuk tambah foto (opsional)</span>
          </div>
          <input id="photo-input" type="file" accept="image/*" class="hidden" />
        </label>

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

        <!-- Description -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-ink" for="description">Cerita (opsional)</label>
          <textarea id="description" class="field" rows="3" placeholder="Tulis cerita di balik momen ini..."></textarea>
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

  // Photo preview handler
  const photoInput   = wrapper.querySelector('#photo-input') as HTMLInputElement
  const photoPreview = wrapper.querySelector('#photo-preview') as HTMLElement

  photoInput.addEventListener('change', () => {
    selectedFile = photoInput.files?.[0] ?? null
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile)
      photoPreview.innerHTML = `<img src="${url}" class="w-full h-full object-cover" />`
    }
  })

  wrapper.querySelector('#btn-back')!.addEventListener('click', () => navigate('/timeline'))

  const form      = wrapper.querySelector('#form') as HTMLFormElement
  const submitBtn = wrapper.querySelector('#btn-submit') as HTMLButtonElement
  const errorEl   = wrapper.querySelector('#error') as HTMLElement

  form.addEventListener('submit', async e => {
    e.preventDefault()
    submitBtn.disabled = true
    submitBtn.textContent = 'Menyimpan...'
    errorEl.classList.add('hidden')

    const title       = (wrapper.querySelector('#title') as HTMLInputElement).value.trim()
    const type        = (wrapper.querySelector('#type') as HTMLSelectElement).value
    const date        = (wrapper.querySelector('#date') as HTMLInputElement).value
    const description = (wrapper.querySelector('#description') as HTMLTextAreaElement).value.trim()

    try {
      let photoPath: string | null = null
      if (selectedFile) photoPath = await uploadPhoto(couple_id, selectedFile)

      const { error } = await supabase.from('memories').insert({
        couple_id,
        title,
        type,
        memory_date: date,
        description: description || null,
        photo_path:  photoPath,
        created_by:  user.id,
      })
      if (error) throw error

      showToast('Kenangan tersimpan ✦', 'success')
      navigate('/timeline')
    } catch (err: unknown) {
      errorEl.textContent = err instanceof Error ? err.message : 'Gagal menyimpan'
      errorEl.classList.remove('hidden')
      submitBtn.disabled = false
      submitBtn.textContent = 'Simpan Kenangan'
    }
  })

  return wrapper
}

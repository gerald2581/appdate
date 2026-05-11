import { supabase } from '../lib/supabase'
import { getState } from '../store/state'
import { navigate } from '../router'
import { showToast } from '../components/toast'

export function renderPlannerAdd(): HTMLElement {
  const wrapper = document.createElement('div')
  const { user, couple_id } = getState()
  if (!user || !couple_id) return wrapper

  wrapper.innerHTML = `
    <div class="min-h-dvh bg-bg">
      <div class="flex items-center gap-3 px-4 pt-safe-8 pb-6">
        <button id="btn-back"
          class="w-9 h-9 rounded-full border border-border flex items-center justify-center text-ink-muted hover:bg-surface-2 cursor-pointer bg-transparent flex-shrink-0">
          ←
        </button>
        <h1 class="font-display text-xl text-ink">Rencana Kencan</h1>
      </div>

      <form id="form" class="px-4 flex flex-col gap-5 pb-12" novalidate>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-ink" for="title">Nama Kencan *</label>
          <input id="title" class="field" type="text" placeholder="Dinner di café favorit" required maxlength="100" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-ink" for="location">Lokasi</label>
          <input id="location" class="field" type="text" placeholder="Nama tempat atau alamat" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-ink" for="planned_date">Tanggal & Waktu</label>
          <input id="planned_date" class="field" type="datetime-local" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-ink" for="budget">Budget (Rp)</label>
          <input id="budget" class="field" type="number" placeholder="0" min="0" step="1000" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-ink" for="description">Catatan</label>
          <textarea id="description" class="field" rows="3" placeholder="Hal-hal yang perlu disiapkan..."></textarea>
        </div>

        <p id="error" class="text-sm text-danger hidden"></p>

        <button id="btn-submit" type="submit"
          class="w-full py-3.5 rounded-full bg-ink text-bg text-sm font-medium
                 hover:opacity-80 active:scale-[0.98] transition-all cursor-pointer border-none
                 disabled:opacity-40 disabled:cursor-not-allowed mt-2">
          Simpan Rencana
        </button>
      </form>
    </div>
  `

  wrapper.querySelector('#btn-back')!.addEventListener('click', () => navigate('/planner'))

  const form      = wrapper.querySelector('#form') as HTMLFormElement
  const submitBtn = wrapper.querySelector('#btn-submit') as HTMLButtonElement
  const errorEl   = wrapper.querySelector('#error') as HTMLElement

  form.addEventListener('submit', async e => {
    e.preventDefault()
    submitBtn.disabled = true
    submitBtn.textContent = 'Menyimpan...'
    errorEl.classList.add('hidden')

    const title       = (wrapper.querySelector('#title') as HTMLInputElement).value.trim()
    const location    = (wrapper.querySelector('#location') as HTMLInputElement).value.trim()
    const plannedDate = (wrapper.querySelector('#planned_date') as HTMLInputElement).value
    const budget      = (wrapper.querySelector('#budget') as HTMLInputElement).value
    const description = (wrapper.querySelector('#description') as HTMLTextAreaElement).value.trim()

    try {
      const { error } = await supabase.from('date_plans').insert({
        couple_id,
        title,
        location:     location || null,
        planned_date: plannedDate || null,
        budget:       budget ? parseInt(budget, 10) : null,
        description:  description || null,
        created_by:   user.id,
      })
      if (error) throw error
      showToast('Rencana tersimpan ◎', 'success')
      navigate('/planner')
    } catch (err: unknown) {
      errorEl.textContent = err instanceof Error ? err.message : 'Gagal menyimpan'
      errorEl.classList.remove('hidden')
      submitBtn.disabled = false
      submitBtn.textContent = 'Simpan Rencana'
    }
  })

  return wrapper
}

import { supabase } from '../lib/supabase'
import { getState } from '../store/state'
import { renderNav } from '../components/nav'
import { navigate } from '../router'
import { showToast } from '../components/toast'
import type { DatePlan } from '../types'

export async function renderPlanner(): Promise<HTMLElement> {
  const wrapper = document.createElement('div')
  const { couple_id } = getState()
  if (!couple_id) return wrapper

  const { data } = await supabase
    .from('date_plans')
    .select('*')
    .eq('couple_id', couple_id)
    .order('planned_date', { ascending: true })

  const plans   = (data ?? []) as DatePlan[]
  const planned = plans.filter(p => p.status === 'planned')
  const done    = plans.filter(p => p.status === 'done')

  wrapper.innerHTML = `
    <div class="min-h-dvh bg-bg pb-[calc(64px+1.5rem)]">
      <div class="px-4 pt-safe-8 pb-6 flex justify-between items-end">
        <div>
          <h1 class="font-display text-2xl text-ink">Rencana Kencan</h1>
          <p class="text-sm text-ink-muted mt-0.5">${planned.length} rencana menanti</p>
        </div>
        <button id="btn-add"
          class="px-4 py-2 rounded-full bg-ink text-bg text-sm font-medium hover:opacity-80 active:scale-[0.97] transition-all cursor-pointer border-none">
          + Buat
        </button>
      </div>

      ${plans.length === 0 ? `
        <div class="px-4 pt-12 flex flex-col items-center text-center">
          <p class="text-5xl mb-5 opacity-20">◎</p>
          <p class="text-base font-medium text-ink mb-2">Belum ada rencana</p>
          <p class="text-sm text-ink-muted mb-6">Mulai rencanakan kencan kalian</p>
          <button id="btn-add-empty"
            class="px-6 py-3 rounded-full bg-ink text-bg text-sm font-medium hover:opacity-80 cursor-pointer border-none">
            Buat Rencana
          </button>
        </div>
      ` : ''}

      ${planned.length > 0 ? `
        <div class="px-4 mb-7">
          <p class="text-[10px] uppercase tracking-[0.15em] text-ink-muted font-medium mb-3">Direncanakan</p>
          <div class="flex flex-col gap-3" id="planned-list">
            ${planned.map(p => planCard(p)).join('')}
          </div>
        </div>
      ` : ''}

      ${done.length > 0 ? `
        <div class="px-4 mb-7">
          <p class="text-[10px] uppercase tracking-[0.15em] text-ink-muted font-medium mb-3">Sudah Dilalui (${done.length})</p>
          <div class="flex flex-col gap-3">
            ${done.slice(0, 5).map(p => planCard(p)).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `

  wrapper.querySelector('#btn-add')?.addEventListener('click', () => navigate('/planner/add'))
  wrapper.querySelector('#btn-add-empty')?.addEventListener('click', () => navigate('/planner/add'))

  wrapper.querySelectorAll('[data-done]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = (btn as HTMLElement).dataset.done!
      const { error } = await supabase.from('date_plans').update({ status: 'done' }).eq('id', id)
      if (error) { showToast('Gagal update', 'error'); return }
      showToast('Kencan selesai! 🎉', 'success')
      const fresh = await renderPlanner()
      wrapper.replaceWith(fresh)
    })
  })

  wrapper.appendChild(renderNav())
  return wrapper
}

function planCard(p: DatePlan): string {
  const dateStr = p.planned_date
    ? new Date(p.planned_date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : null
  const budget = p.budget ? `Rp ${p.budget.toLocaleString('id-ID')}` : null

  return `
    <div class="bg-surface border border-border rounded-2xl overflow-hidden">
      <div class="px-4 pt-4 pb-3">
        <div class="flex justify-between items-start gap-2 mb-2">
          <h3 class="font-display text-base text-ink leading-snug">${p.title}</h3>
          ${p.status === 'done'
            ? `<span class="flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-green-700 font-medium">Selesai ✓</span>`
            : `<span class="flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">Rencana</span>`
          }
        </div>
        ${p.location ? `<p class="text-xs text-ink-muted mb-1">📍 ${p.location}</p>` : ''}
        ${dateStr    ? `<p class="text-xs text-ink-muted mb-1">📅 ${dateStr}</p>`     : ''}
        ${budget     ? `<p class="text-xs text-ink-muted mb-1">💰 ${budget}</p>`     : ''}
        ${p.description ? `<p class="text-sm text-ink-muted leading-relaxed mt-2">${p.description}</p>` : ''}
      </div>
      ${p.status === 'planned' ? `
        <div class="border-t border-border px-4 py-2.5">
          <button data-done="${p.id}"
            class="text-xs font-medium text-ink-muted hover:text-ink transition-colors cursor-pointer bg-transparent border-none">
            ✓ Tandai selesai
          </button>
        </div>
      ` : ''}
    </div>
  `
}

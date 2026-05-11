import { supabase } from '../lib/supabase'
import { getState } from '../store/state'
import { renderNav } from '../components/nav'
import { navigate } from '../router'
import { formatDate, formatShortDate, nextOccurrence } from '../lib/date-utils'
import { getSignedUrl } from '../lib/storage'
import { openDateEditor } from '../components/date-editor'
import type { Memory, SpecialDate } from '../types'

export async function renderHome(): Promise<HTMLElement> {
  const wrapper = document.createElement('div')
  const { user, partner, couple_id } = getState()

  if (!user || !couple_id) return renderSoloHome(user?.name ?? '')

  const [memoriesRes, datesRes] = await Promise.all([
    supabase.from('memories').select('*').eq('couple_id', couple_id)
      .order('created_at', { ascending: false }).limit(3),
    supabase.from('special_dates').select('*').eq('couple_id', couple_id).order('date'),
  ])

  const memories     = (memoriesRes.data ?? []) as Memory[]
  const specialDates = (datesRes.data    ?? []) as SpecialDate[]

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcoming = specialDates
    .map(sd => {
      const d = sd.recurring ? nextOccurrence(sd.date) : new Date(sd.date)
      return { ...sd, nextDate: d, daysLeft: Math.ceil((d.getTime() - today.getTime()) / 86_400_000) }
    })
    .filter(sd => sd.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 3)

  const memoriesWithUrls = await Promise.all(
    memories.map(async m => ({
      ...m,
      photoUrl: m.photo_path ? await getSignedUrl(m.photo_path).catch(() => null) : null,
    }))
  )

  const myInitial      = user.name.charAt(0).toUpperCase()
  const partnerInitial = partner ? partner.name.charAt(0).toUpperCase() : '?'
  const myFirst        = user.name.split(' ')[0]
  const partnerFirst   = partner ? partner.name.split(' ')[0] : 'Partner'

  wrapper.innerHTML = `
    <div class="min-h-dvh pb-[calc(64px+1.5rem)]">

      <!-- Hero glass card -->
      <div class="px-4 pt-safe-10 pb-4">
        <div class="glass-strong px-6 py-8 text-center">

          <!-- Partner avatars -->
          <div class="flex items-center justify-center gap-4 mb-6">
            <div class="flex flex-col items-center gap-1.5">
              <div class="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-semibold shadow-lg select-none"
                   style="background: linear-gradient(135deg, #c8826a, #d4956a)">
                ${myInitial}
              </div>
              <span class="text-xs text-ink-muted font-medium">${myFirst}</span>
            </div>
            <div class="flex flex-col items-center gap-1 pb-5">
              <span class="text-2xl" style="color:#c8826a; opacity:0.6">♡</span>
            </div>
            <div class="flex flex-col items-center gap-1.5">
              <div class="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-semibold shadow-lg select-none"
                   style="background: linear-gradient(135deg, #7a9ec8, #8badd4)">
                ${partnerInitial}
              </div>
              <span class="text-xs text-ink-muted font-medium">${partnerFirst}</span>
            </div>
          </div>

          <!-- Real-time timer -->
          <p class="text-[10px] uppercase tracking-[0.2em] text-ink-muted mb-4">Bersama selama</p>

          ${user.relationship_start ? `
            <div id="timer-grid" class="grid grid-cols-4 gap-2 mb-3"></div>
            <div class="flex items-center justify-center gap-2">
              <p class="text-xs text-ink-muted">Sejak ${formatDate(user.relationship_start)}</p>
              <button id="btn-edit-date" title="Edit tanggal mulai"
                class="border-none bg-transparent cursor-pointer p-1 rounded-full transition-opacity hover:opacity-60 active:scale-90"
                style="color:#c8826a">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </div>
          ` : `
            <p class="text-4xl font-display text-ink mb-3">—</p>
            <button id="btn-set-date"
              class="inline-flex items-center gap-1.5 text-xs border-none bg-transparent cursor-pointer px-3 py-1.5 rounded-full transition-all hover:opacity-80"
              style="color:#c8826a; background:rgba(200,130,106,0.1)">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Set tanggal mulai
            </button>
          `}
        </div>
      </div>

      <!-- Quick actions -->
      <div class="px-4 mb-4">
        <div class="grid grid-cols-2 gap-3">
          ${quickCard('✦', 'Tambah Kenangan',   '/timeline/add')}
          ${quickCard('◎', 'Rencanakan Kencan',  '/planner/add')}
          ${quickCard('✉', 'Kirim Pesan',        '/chat')}
          ${quickCard('◉', 'Cek Lokasi',         '/location')}
        </div>
      </div>

      <!-- Upcoming special dates -->
      ${upcoming.length > 0 ? `
        <div class="px-4 mb-4">
          <p class="text-[10px] uppercase tracking-[0.15em] text-ink-muted font-medium mb-3">Tanggal Spesial</p>
          <div class="flex flex-col gap-2">
            ${upcoming.map(sd => `
              <div class="glass px-4 py-3.5 flex justify-between items-center">
                <div>
                  <p class="text-sm font-medium text-ink">${sd.title}</p>
                  <p class="text-xs text-ink-muted mt-0.5">
                    ${sd.nextDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                  </p>
                </div>
                <span class="text-xs font-semibold" style="color:${sd.daysLeft === 0 ? '#6ab87a' : '#c8826a'}">
                  ${sd.daysLeft === 0 ? 'Hari ini! 🎉' : `${sd.daysLeft}h lagi`}
                </span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Recent memories -->
      <div class="px-4">
        <div class="flex justify-between items-center mb-3">
          <p class="text-[10px] uppercase tracking-[0.15em] text-ink-muted font-medium">Kenangan Terbaru</p>
          ${memories.length > 0 ? `<button id="see-all" class="text-xs border-none bg-transparent cursor-pointer font-medium" style="color:#c8826a">Lihat semua</button>` : ''}
        </div>

        ${memoriesWithUrls.length === 0 ? `
          <div class="glass px-6 py-8 text-center">
            <p class="text-3xl mb-3 opacity-25">✦</p>
            <p class="text-sm font-medium text-ink mb-1">Belum ada kenangan</p>
            <p class="text-xs text-ink-muted mb-4">Catat momen pertama kalian bersama</p>
            <button data-nav="/timeline/add"
              class="px-5 py-2.5 rounded-full text-white text-sm font-medium border-none cursor-pointer transition-opacity hover:opacity-85"
              style="background: linear-gradient(135deg, #c8826a, #d4956a)">
              + Tambah
            </button>
          </div>
        ` : `
          <div class="flex flex-col gap-2">
            ${memoriesWithUrls.map(m => `
              <div class="glass px-4 py-3 flex items-center gap-3">
                ${m.photoUrl
                  ? `<img src="${m.photoUrl}" class="w-12 h-12 rounded-xl object-cover flex-shrink-0 shadow-sm" loading="lazy" />`
                  : `<div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 select-none" style="background:rgba(200,130,106,0.12)">✦</div>`
                }
                <div class="min-w-0">
                  <p class="text-sm font-medium text-ink truncate">${m.title}</p>
                  <p class="text-xs text-ink-muted mt-0.5">${formatShortDate(m.memory_date)}</p>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>
  `

  // Real-time timer
  if (user.relationship_start) {
    const timerGrid = wrapper.querySelector('#timer-grid') as HTMLElement
    let timerId: ReturnType<typeof setInterval>

    function tick() {
      const start = new Date(user!.relationship_start!).getTime()
      const diff  = Date.now() - start
      if (diff < 0) { timerGrid.innerHTML = timerUnit('0', 'hari') + timerUnit('0', 'jam') + timerUnit('0', 'menit') + timerUnit('0', 'detik'); return }

      const days  = Math.floor(diff / 86_400_000)
      const hours = Math.floor((diff % 86_400_000) / 3_600_000)
      const mins  = Math.floor((diff % 3_600_000)  / 60_000)
      const secs  = Math.floor((diff % 60_000)      / 1_000)

      timerGrid.innerHTML =
        timerUnit(days.toString(), 'Hari') +
        timerUnit(String(hours).padStart(2, '0'), 'Jam') +
        timerUnit(String(mins).padStart(2, '0'), 'Menit') +
        timerUnit(String(secs).padStart(2, '0'), 'Detik')
    }

    tick()
    timerId = setInterval(tick, 1000)

    // Cleanup interval on unmount
    const obs = new MutationObserver(() => {
      if (!wrapper.isConnected) { clearInterval(timerId); obs.disconnect() }
    })
    obs.observe(document.body, { childList: true, subtree: false })
  }

  wrapper.querySelector('#see-all')?.addEventListener('click', () => navigate('/timeline'))

  // Edit date — buka bottom sheet, bukan navigasi ke settings
  const openEditor = () => openDateEditor(async () => {
    const fresh = await renderHome()
    wrapper.replaceWith(fresh)
  })
  wrapper.querySelector('#btn-edit-date')?.addEventListener('click', openEditor)
  wrapper.querySelector('#btn-set-date')?.addEventListener('click', openEditor)

  wrapper.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => navigate((btn as HTMLElement).dataset.nav!))
  })

  wrapper.appendChild(renderNav())
  return wrapper
}

function timerUnit(value: string, label: string): string {
  return `
    <div class="flex flex-col items-center gap-1 rounded-2xl py-3"
         style="background:rgba(200,130,106,0.10); border:1px solid rgba(200,130,106,0.18)">
      <span class="font-display font-semibold text-ink leading-none" style="font-size:clamp(1.4rem,6vw,2rem)">${value}</span>
      <span class="text-[9px] uppercase tracking-[0.12em] text-ink-muted font-medium">${label}</span>
    </div>
  `
}

function quickCard(icon: string, label: string, path: string): string {
  return `
    <button data-nav="${path}"
      class="glass p-5 text-left cursor-pointer select-none
             hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-150">
      <span class="block text-2xl mb-2.5 leading-none">${icon}</span>
      <span class="text-[13px] font-medium text-ink leading-snug">${label}</span>
    </button>
  `
}

function renderSoloHome(name: string): HTMLElement {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = `
    <div class="min-h-dvh pb-[calc(64px+1.5rem)]">
      <div class="px-4 pt-safe-10 pb-4">
        <div class="glass-strong px-6 py-10 text-center">
          <p class="text-[10px] uppercase tracking-[0.2em] text-ink-muted mb-3">Selamat datang</p>
          <h1 class="font-display text-4xl text-ink mb-1">${name || 'AppDate'}</h1>
          <p class="text-sm text-ink-muted">Ruang privat kita berdua</p>
        </div>
      </div>

      <div class="mx-4 mb-4">
        <div class="glass p-5">
          <div class="flex items-start gap-3">
            <span class="text-2xl leading-none mt-0.5">♡</span>
            <div class="flex-1">
              <p class="text-sm font-medium text-ink mb-1">Hubungkan dengan partner</p>
              <p class="text-xs text-ink-muted mb-3">Bagikan kode invite ke partner kamu untuk mulai semua fitur bersama.</p>
              <button id="btn-go-onboarding"
                class="px-4 py-2 rounded-full text-white text-xs font-medium border-none cursor-pointer hover:opacity-85 transition-opacity"
                style="background: linear-gradient(135deg, #c8826a, #d4956a)">
                Hubungkan sekarang
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4">
        <p class="text-[10px] uppercase tracking-[0.15em] text-ink-muted font-medium mb-3">Fitur yang tersedia</p>
        <div class="flex flex-col gap-2">
          ${featureRow('✦', 'Timeline Kenangan', 'Catat momen bersama dengan foto')}
          ${featureRow('◎', 'Rencana Kencan', 'Plan date, lokasi, dan budget')}
          ${featureRow('✉', 'Chat Privat', 'Pesan real-time hanya kalian berdua')}
          ${featureRow('◉', 'Live Lokasi', 'Pantau lokasi partner secara real-time')}
        </div>
      </div>
    </div>
  `

  wrapper.querySelector('#btn-go-onboarding')!.addEventListener('click', () => {
    localStorage.removeItem('skip_onboarding')
    navigate('/onboarding')
  })

  wrapper.appendChild(renderNav())
  return wrapper
}

function featureRow(icon: string, title: string, desc: string): string {
  return `
    <div class="glass px-4 py-3 flex items-center gap-3">
      <span class="text-lg leading-none w-6 text-center flex-shrink-0">${icon}</span>
      <div>
        <p class="text-sm font-medium text-ink">${title}</p>
        <p class="text-xs text-ink-muted">${desc}</p>
      </div>
    </div>
  `
}

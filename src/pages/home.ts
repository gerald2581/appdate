import { supabase } from '../lib/supabase'

// ── SVG icon helpers ──────────────────────────────────────────
function icon(paths: string, size = 26): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    style="display:block;flex-shrink:0">${paths}</svg>`
}

const svgSparkle = icon(`
  <path d="M12 2C12 7.25 16.75 12 22 12C16.75 12 12 16.75 12 22C12 16.75 7.25 12 2 12C7.25 12 12 7.25 12 2Z"/>
`)
const svgCamera = icon(`
  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
  <circle cx="12" cy="13" r="4"/>
`)
const svgPlanner = icon(`
  <rect x="3" y="4" width="18" height="18" rx="3"/>
  <line x1="16" y1="2" x2="16" y2="6"/>
  <line x1="8" y1="2" x2="8" y2="6"/>
  <line x1="3" y1="10" x2="21" y2="10"/>
  <path d="M9 16l2 2 4-4"/>
`)
const svgChat = icon(`
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
`)
const svgPin = icon(`
  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
  <circle cx="12" cy="10" r="3"/>
`)
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
    <div style="min-height:100dvh; padding-bottom:calc(72px + 16px)">

      <!-- Hero glass card — top section -->
      <div style="padding: calc(env(safe-area-inset-top,0px) + 24px) 16px 16px">
        <div class="glass-strong" style="padding:24px; text-align:center">

          <!-- Partner avatars — 8px gap system -->
          <div style="display:flex;align-items:center;justify-content:center;gap:24px;margin-bottom:24px">
            <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
              <div style="
                width:56px;height:56px;border-radius:50%;
                display:flex;align-items:center;justify-content:center;
                color:white;font-size:20px;font-weight:600;
                background:linear-gradient(135deg,#c8826a,#d4956a);
                border:2px solid rgba(255,255,255,0.80);
                box-shadow:0 4px 16px rgba(200,130,106,0.28);
                user-select:none;
              ">${myInitial}</div>
              <span style="font-size:11px;color:#6b6860;font-weight:500;letter-spacing:0.04em">${myFirst}</span>
            </div>
            <div style="display:flex;flex-direction:column;align-items:center;padding-bottom:20px;color:#c8826a;opacity:0.55">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="rgba(200,130,106,0.15)" stroke="#c8826a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <div style="display:flex;flex-direction:column;align-items:center;gap:8px">
              <div style="
                width:56px;height:56px;border-radius:50%;
                display:flex;align-items:center;justify-content:center;
                color:white;font-size:20px;font-weight:600;
                background:linear-gradient(135deg,#7a9ec8,#8badd4);
                border:2px solid rgba(255,255,255,0.80);
                box-shadow:0 4px 16px rgba(122,158,200,0.28);
                user-select:none;
              ">${partnerInitial}</div>
              <span style="font-size:11px;color:#6b6860;font-weight:500;letter-spacing:0.04em">${partnerFirst}</span>
            </div>
          </div>

          <!-- Timer label -->
          <p style="font-size:10px;text-transform:uppercase;letter-spacing:0.22em;color:#9a9088;font-weight:600;margin-bottom:16px">Bersama selama</p>

          ${user.relationship_start ? `
            <div id="timer-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px"></div>
            <div style="display:flex;align-items:center;justify-content:center;gap:8px">
              <p style="font-size:11px;color:#9a9088">Sejak ${formatDate(user.relationship_start)}</p>
              <button id="btn-edit-date" title="Edit tanggal mulai" style="
                border:none;background:transparent;cursor:pointer;padding:4px;
                border-radius:50%;color:#c8826a;display:flex;align-items:center;
                transition:opacity 0.15s;
              ">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </div>
          ` : `
            <p style="font-family:'Playfair Display',Georgia,serif;font-size:2.5rem;color:#1a1916;margin-bottom:12px">—</p>
            <button id="btn-set-date" style="
              display:inline-flex;align-items:center;gap:6px;
              font-size:12px;border:none;background:rgba(200,130,106,0.10);
              cursor:pointer;padding:8px 16px;border-radius:999px;
              color:#c8826a;font-family:inherit;
              border:1px solid rgba(200,130,106,0.20);
              transition:opacity 0.15s;
            ">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Set tanggal mulai
            </button>
          `}
        </div>
      </div>

      <!-- Quick actions -->
      <div style="padding:0 16px 16px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          ${quickCard(svgCamera, 'Tambah Kenangan',  '/timeline/add')}
          ${quickCard(svgPlanner,'Rencanakan Kencan', '/planner/add')}
          ${quickCard(svgChat,   'Kirim Pesan',       '/chat')}
          ${quickCard(svgPin,    'Cek Lokasi',        '/location')}
        </div>
      </div>

      <!-- Upcoming special dates -->
      ${upcoming.length > 0 ? `
        <div style="padding:0 16px 16px">
          <div class="section-label">Tanggal Spesial</div>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${upcoming.map(sd => `
              <div class="glass" style="padding:14px 16px;display:flex;justify-content:space-between;align-items:center">
                <div>
                  <p style="font-size:13px;font-weight:500;color:#1a1916;margin-bottom:3px">${sd.title}</p>
                  <p style="font-size:11px;color:#6b6860">
                    ${sd.nextDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                  </p>
                </div>
                <span style="font-size:11px;font-weight:700;color:${sd.daysLeft === 0 ? '#6ab87a' : '#c8826a'};letter-spacing:0.02em">
                  ${sd.daysLeft === 0 ? 'Hari ini! 🎉' : `${sd.daysLeft}h lagi`}
                </span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Recent memories -->
      <div style="padding:0 16px 16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <div class="section-label" style="margin-bottom:0">Kenangan Terbaru</div>
          ${memories.length > 0 ? `<button id="see-all" style="font-size:11px;border:none;background:transparent;cursor:pointer;font-weight:600;color:#c8826a;font-family:inherit;padding:0">Lihat semua</button>` : ''}
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
                  : `<div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 select-none" style="color:#c8826a;background:linear-gradient(145deg,rgba(255,255,255,0.72),rgba(255,238,228,0.50));border:1px solid rgba(255,255,255,0.82);box-shadow:0 3px 10px rgba(200,130,106,0.10),inset 0 1px 0 rgba(255,255,255,0.90)">${icon(`<path d="M12 2C12 7.25 16.75 12 22 12C16.75 12 12 16.75 12 22C12 16.75 7.25 12 2 12C7.25 12 12 7.25 12 2Z"/>`, 18)}</div>`
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
    <div style="
      display:flex;flex-direction:column;align-items:center;gap:5px;
      border-radius:16px;padding:16px 8px;
      background:linear-gradient(155deg,rgba(255,255,255,0.74) 0%,rgba(255,236,224,0.50) 50%,rgba(255,220,204,0.36) 100%);
      backdrop-filter:blur(24px) saturate(1.9) brightness(1.04);
      -webkit-backdrop-filter:blur(24px) saturate(1.9) brightness(1.04);
      border:1px solid rgba(255,255,255,0.80);
      outline:1px solid rgba(200,130,106,0.12);
      outline-offset:-1px;
      box-shadow:
        0 4px 18px rgba(200,130,106,0.11),
        0 1px 4px rgba(0,0,0,0.04),
        inset 0 1.5px 0 rgba(255,255,255,0.94);
    ">
      <span style="font-family:'Playfair Display',Georgia,serif;font-weight:600;color:#1a1916;line-height:1;font-size:clamp(1.25rem,5.5vw,1.75rem)">${value}</span>
      <span style="font-size:9px;text-transform:uppercase;letter-spacing:0.14em;color:#9a9088;font-weight:600">${label}</span>
    </div>
  `
}

function quickCard(svgEl: string, label: string, path: string): string {
  return `
    <button data-nav="${path}" class="glass" style="
      padding:16px;text-align:left;cursor:pointer;
      border:none;font-family:inherit;width:100%;
      transition:transform 0.15s,box-shadow 0.15s;
      active:scale-[0.97];
    " onmousedown="this.style.transform='scale(0.97)'" onmouseup="this.style.transform=''" ontouchstart="this.style.transform='scale(0.97)'" ontouchend="this.style.transform=''">
      <span style="
        display:inline-flex;
        align-items:center;
        justify-content:center;
        width:52px;height:52px;
        border-radius:16px;
        margin-bottom:12px;
        color:#c8826a;
        background:linear-gradient(145deg,rgba(255,255,255,0.72) 0%,rgba(255,240,232,0.48) 100%);
        backdrop-filter:blur(20px) saturate(1.8);
        -webkit-backdrop-filter:blur(20px) saturate(1.8);
        border:1px solid rgba(255,255,255,0.84);
        outline:1px solid rgba(200,130,106,0.10);
        outline-offset:-1px;
        box-shadow:
          0 4px 16px rgba(200,130,106,0.12),
          0 1px 4px rgba(0,0,0,0.04),
          inset 0 1.5px 0 rgba(255,255,255,0.94);
      ">${svgEl}</span>
      <span style="font-size:13px;font-weight:500;color:#1a1916;line-height:1.35;display:block">${label}</span>
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
            <span style="color:#c8826a;display:flex;align-items:center;margin-top:2px">${icon(`<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="rgba(200,130,106,0.10)"/>`, 26)}</span>
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
          ${featureRow(svgSparkle,  'Timeline Kenangan', 'Catat momen bersama dengan foto')}
          ${featureRow(svgPlanner, 'Rencana Kencan',    'Plan date, lokasi, dan budget')}
          ${featureRow(svgChat,    'Chat Privat',        'Pesan real-time hanya kalian berdua')}
          ${featureRow(svgPin,     'Live Lokasi',        'Pantau lokasi partner secara real-time')}
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

function featureRow(svgEl: string, title: string, desc: string): string {
  return `
    <div class="glass" style="padding:12px 16px;display:flex;align-items:center;gap:16px">
      <span style="
        display:inline-flex;
        align-items:center;
        justify-content:center;
        flex-shrink:0;
        width:44px;height:44px;
        border-radius:14px;
        color:#c8826a;
        background:linear-gradient(145deg,rgba(255,255,255,0.70) 0%,rgba(255,240,232,0.46) 100%);
        backdrop-filter:blur(18px) saturate(1.8);
        -webkit-backdrop-filter:blur(18px) saturate(1.8);
        border:1px solid rgba(255,255,255,0.82);
        outline:1px solid rgba(200,130,106,0.10);
        outline-offset:-1px;
        box-shadow:
          0 3px 12px rgba(200,130,106,0.10),
          0 1px 3px rgba(0,0,0,0.04),
          inset 0 1.5px 0 rgba(255,255,255,0.92);
      ">${svgEl}</span>
      <div>
        <p style="font-size:13px;font-weight:500;color:#1a1916;margin-bottom:2px">${title}</p>
        <p style="font-size:11px;color:#6b6860;line-height:1.4">${desc}</p>
      </div>
    </div>
  `
}

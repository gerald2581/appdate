import { supabase } from '../lib/supabase'
import { getState } from '../store/state'
import { renderNav } from '../components/nav'
import { navigate } from '../router'
import { formatDate } from '../lib/date-utils'
import { getSignedUrl } from '../lib/storage'
import { esc } from '../lib/escape'
import { openConfirmModal } from '../components/confirm-modal'
import { showToast } from '../components/toast'
import type { Memory } from '../types'

// ── Physics constants ─────────────────────────────────────────
const CARD_W    = 82
const CARD_H    = 82
const MAX_SCALE = 1.30
const MIN_SCALE = 0.28
const LERP_SCL  = 0.036
const LERP_ROT  = 0.09
const SPEED     = 0.00090   // same speed for all → spacing stays fixed
const HEADER_H  = 160
const NAV_H     = 84
// Gap between cards per lane
const T_STEP    = 0.10

const GLOW: readonly string[] = [
  '200,130,106', '122,158,200', '106,184,122',
  '212,149,106', '160,130,200', '180,160,106',
]

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

// ── Two bezier circuit lanes ──────────────────────────────────
interface Pt   { x: number; y: number }
interface Lane { p0: Pt; p1: Pt; p2: Pt }

function pathBez(t: number, { p0, p1, p2 }: Lane): Pt {
  const u = 1 - t
  return {
    x: u*u*p0.x + 2*u*t*p1.x + t*t*p2.x,
    y: u*u*p0.y + 2*u*t*p1.y + t*t*p2.y,
  }
}

function buildLanes(W: number, H: number): [Lane, Lane] {
  const mid = (HEADER_H + H - NAV_H) / 2
  return [
    // Lane 0 (top): left-mid → arcs UP at center → right-mid
    { p0:{x:-CARD_W,   y:mid - CARD_H*0.6},
      p1:{x:W*0.5,     y:HEADER_H + 10},
      p2:{x:W+CARD_W,  y:mid - CARD_H*0.6} },
    // Lane 1 (bottom): right-mid → arcs DOWN at center → left-mid
    { p0:{x:W+CARD_W,  y:mid + CARD_H*0.6},
      p1:{x:W*0.5,     y:H - NAV_H - 10},
      p2:{x:-CARD_W,   y:mid + CARD_H*0.6} },
  ]
}

// ── Per-card state ────────────────────────────────────────────
interface PhysCard {
  mem: Memory & { photoUrl: string | null }
  el: HTMLDivElement
  inner: HTMLDivElement
  rgb: string
  lane: 0 | 1
  t: number        // 0..1 position along lane
  curS: number; curO: number
  rX: number; rY: number
  tRX: number; tRY: number
  hit: boolean
}

// ── Main render ───────────────────────────────────────────────
export async function renderTimeline(): Promise<HTMLElement> {
  const wrapper = document.createElement('div')
  const { couple_id } = getState()
  if (!couple_id) return wrapper

  const { data, error } = await supabase
    .from('memories').select('*')
    .eq('couple_id', couple_id)
    .order('memory_date', { ascending: false })

  const memories = (data ?? []) as Memory[]

  const mems = await Promise.all(
    memories.map(async m => ({
      ...m,
      photoUrl: m.photo_path ? await getSignedUrl(m.photo_path).catch(() => null) : null,
    }))
  )

  // ── Wrapper ───────────────────────────────────────────────────
  wrapper.style.cssText = `
    position: relative;
    height: 100dvh;
    overflow: hidden;
    background:
      radial-gradient(ellipse at 18% 50%, rgba(255,200,180,0.45) 0%, transparent 58%),
      radial-gradient(ellipse at 82% 22%, rgba(200,170,220,0.32) 0%, transparent 55%),
      radial-gradient(ellipse at 55% 82%, rgba(255,220,160,0.35) 0%, transparent 55%),
      #fdf4f0;
  `

  // ── Header ────────────────────────────────────────────────────
  const header = document.createElement('div')
  header.style.cssText = `
    position: absolute; top: 0; left: 0; right: 0;
    z-index: 300;
    padding: env(safe-area-inset-top, 0px) 0 0;
    pointer-events: none;
  `
  header.innerHTML = `
    <!-- Gradient fade so cards beneath look natural -->
    <div style="
      padding: 20px 20px 28px;
      display: flex; justify-content: space-between; align-items: flex-end;
      background: linear-gradient(to bottom,
        rgba(253,244,240,1.00)  0%,
        rgba(253,244,240,0.96) 60%,
        rgba(253,244,240,0.00) 100%);
      pointer-events: all;
    ">
      <!-- Left: label + title + count -->
      <div>
        <p style="
          font-size:9.5px;text-transform:uppercase;letter-spacing:.28em;
          color:#c8826a;font-weight:600;margin:0 0 5px">
          Kenangan
        </p>
        <h1 style="
          font-family:'Playfair Display',Georgia,serif;
          font-size:28px;color:#1a1916;line-height:1.1;margin:0 0 5px">
          Timeline
        </h1>
        <p style="font-size:11px;color:#9a9088;margin:0;letter-spacing:.02em">
          ${mems.length} momen bersama
        </p>
      </div>

      <!-- Right: Tambah button -->
      <button id="btn-add" style="
        display:flex;align-items:center;gap:6px;
        padding:10px 18px;border-radius:999px;
        background:linear-gradient(135deg,#c8826a,#d4956a);
        color:#fff;font-size:13px;font-weight:600;
        border:none;cursor:pointer;font-family:inherit;
        box-shadow:0 4px 16px rgba(200,130,106,0.38);
        flex-shrink:0;
      ">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2.5" stroke-linecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Tambah
      </button>
    </div>
  `
  wrapper.appendChild(header)

  // ── Empty state ───────────────────────────────────────────────
  if (mems.length === 0) {
    const empty = document.createElement('div')
    empty.style.cssText = `
      position:absolute;inset:0;display:flex;flex-direction:column;
      align-items:center;justify-content:center;text-align:center;padding:32px;
    `
    empty.innerHTML = `
      <p style="font-size:52px;opacity:.14;margin-bottom:18px">✦</p>
      <p style="font-size:16px;font-weight:600;color:#1a1916;margin-bottom:8px">Belum ada kenangan</p>
      <p style="font-size:13px;color:#9a9088;margin-bottom:24px">Catat momen pertama kalian bersama</p>
      <button id="btn-add-empty" style="
        padding:12px 28px;border-radius:999px;
        background:linear-gradient(135deg,#c8826a,#d4956a);
        color:white;font-size:13px;font-weight:600;
        border:none;cursor:pointer;font-family:inherit;
        box-shadow:0 4px 16px rgba(200,130,106,0.4);
      ">Tambah Kenangan</button>
    `
    wrapper.appendChild(empty)
    wrapper.querySelector('#btn-add')!.addEventListener('click', () => navigate('/timeline/add'))
    wrapper.querySelector('#btn-add-empty')!.addEventListener('click', () => navigate('/timeline/add'))
    wrapper.appendChild(renderNav())
    return wrapper
  }

  if (error) {
    const err = document.createElement('p')
    err.style.cssText = 'position:absolute;top:140px;left:0;right:0;text-align:center;font-size:13px;color:#c87878'
    err.textContent = 'Gagal memuat kenangan. Coba refresh.'
    wrapper.appendChild(err)
  }

  // ── Canvas ────────────────────────────────────────────────────
  const canvas = document.createElement('div')
  canvas.style.cssText = 'position:absolute;inset:0;overflow:visible;'
  wrapper.appendChild(canvas)

  // ── Detail sheet ──────────────────────────────────────────────
  const overlay = document.createElement('div')
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:10000;
    display:flex;align-items:flex-end;justify-content:center;
    background:rgba(0,0,0,0);pointer-events:none;
    transition:background .28s ease;
  `

  const sheet = document.createElement('div')
  sheet.style.cssText = `
    position:relative;
    width:100%;max-width:430px;
    background:rgba(255,255,255,0.97);
    backdrop-filter:blur(32px);-webkit-backdrop-filter:blur(32px);
    border-radius:28px 28px 0 0;
    border-top:1px solid rgba(255,255,255,0.85);
    box-shadow:0 -8px 40px rgba(0,0,0,0.15);
    transform:translateY(100%);
    overflow-y:auto;max-height:82vh;
    padding-bottom:env(safe-area-inset-bottom,0px);
  `
  overlay.appendChild(sheet)
  document.body.appendChild(overlay)

  const typeLabel: Record<string, string> = { memory: 'Kenangan', milestone: 'Milestone', photo: 'Foto' }

  const openDetail = (m: Memory & { photoUrl: string | null }, card: PhysCard) => {
    overlay.style.pointerEvents = 'all'

    if (m.photoUrl) {
      // ── Lightbox mode (single photo) ──────────────────
      overlay.dataset.mode = 'lightbox'
      overlay.style.background = 'rgba(253,244,240,0.90)'
      overlay.style.backdropFilter = 'blur(24px) saturate(1.3)'
      overlay.style.alignItems = 'stretch'
      sheet.style.transform = 'none'
      sheet.style.maxHeight = '100vh'
      sheet.style.borderRadius = '0'
      sheet.style.background = 'transparent'
      sheet.style.boxShadow = 'none'
      sheet.style.backdropFilter = 'none'
      sheet.style.borderTop = 'none'
      sheet.style.display = 'flex'
      sheet.style.flexDirection = 'column'
      sheet.style.alignItems = 'center'
      sheet.style.justifyContent = 'flex-start'
      sheet.style.width = '100%'
      sheet.style.maxWidth = '100%'
      sheet.style.height = '100%'
      sheet.style.padding = '0'
      sheet.style.overflowY = 'hidden'

      const btnStyle = (danger: boolean) => `
        width:38px;height:38px;border-radius:50%;padding:0;cursor:pointer;
        background:rgba(255,255,255,0.75);backdrop-filter:blur(12px);
        border:1px solid ${danger ? 'rgba(200,120,120,0.30)' : 'rgba(255,255,255,0.70)'};
        box-shadow:0 2px 8px rgba(0,0,0,0.06),inset 0 1px 0 rgba(255,255,255,0.9);
        color:${danger ? '#c87878' : '#1a1916'};
        display:flex;align-items:center;justify-content:center
      `

      sheet.innerHTML = `
        <!-- Top bar -->
        <div style="width:100%;display:flex;align-items:center;justify-content:space-between;
                    padding:max(16px,env(safe-area-inset-top,16px)) 20px 12px;flex-shrink:0">
          <button id="btn-delete-memory" style="${btnStyle(true)}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
          <button id="btn-close-lb" style="${btnStyle(false)}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Photo -->
        <div style="flex:1;display:flex;align-items:center;padding:0 20px;min-height:0;overflow:hidden">
          <div style="width:100%;
                background:rgba(255,255,255,0.68);
                border:1px solid rgba(255,255,255,0.80);
                box-shadow:0 4px 24px rgba(0,0,0,0.07),inset 0 1px 0 rgba(255,255,255,0.9);
                border-radius:20px;padding:8px">
            <img src="${esc(m.photoUrl)}"
              style="width:100%;max-height:calc(100dvh - 180px);border-radius:13px;
                     object-fit:contain;display:block"
              alt="" />
          </div>
        </div>

        <!-- Title + Date -->
        <div style="padding:10px 24px max(20px,env(safe-area-inset-bottom,20px));
                    flex-shrink:0;text-align:center">
          <p style="font-size:13px;font-weight:600;color:#1a1916;margin:0 0 3px">${esc(m.title)}</p>
          <time style="font-size:12px;color:#9a9088;letter-spacing:.06em">
            ${esc(formatDate(m.memory_date))}
          </time>
        </div>
      `

      // Close
      sheet.querySelector('#btn-close-lb')!.addEventListener('click', closeDetail)

      // Delete
      sheet.querySelector('#btn-delete-memory')!.addEventListener('click', () => {
        openConfirmModal({
          title: 'Hapus Kenangan?',
          message: `"${m.title}" akan dihapus permanen.`,
          confirmLabel: 'Hapus',
          danger: true,
          onConfirm: async () => {
            const { error } = await supabase.from('memories').delete().eq('id', m.id)
            if (error) throw error
            card.el.remove()
            const idx = cards.indexOf(card)
            if (idx !== -1) cards.splice(idx, 1)
            closeDetail()
            showToast('Kenangan dihapus', 'success')
          },
        })
      })
    } else {
      // ── Bottom sheet mode (no photo) ──────────────────
      overlay.style.background = 'rgba(0,0,0,0.48)'
      sheet.style.transform = 'translateY(0)'
      sheet.style.maxHeight = '82vh'
      sheet.style.borderRadius = '28px 28px 0 0'
      sheet.style.background = 'rgba(255,255,255,0.97)'
      sheet.style.boxShadow = '0 -8px 40px rgba(0,0,0,0.15)'
      sheet.style.backdropFilter = 'blur(32px)'
      sheet.style.display = 'block'
      sheet.style.width = '100%'
      sheet.style.height = 'auto'
      sheet.style.padding = '0'
      sheet.style.flexDirection = ''
      sheet.style.alignItems = ''
      sheet.style.justifyContent = ''

      sheet.innerHTML = `
        <div style="width:40px;height:4px;border-radius:999px;background:rgba(0,0,0,0.12);margin:12px auto 0"></div>
        <div style="height:16px"></div>
        <div style="padding:6px 24px 16px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
            <span style="font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:#c8826a;font-weight:700">
              ${esc(typeLabel[m.type] ?? m.type)}
            </span>
            <time style="font-size:11px;color:#9a9088">${esc(formatDate(m.memory_date))}</time>
          </div>
          <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:22px;color:#1a1916;
                     line-height:1.25;margin-bottom:${m.description ? '10px' : '0'}">
            ${esc(m.title)}
          </h2>
          ${m.description ? `<p style="font-size:14px;color:#6b6860;line-height:1.7">${esc(m.description)}</p>` : ''}
        </div>
        <div style="padding:0 24px 32px">
          <button id="btn-delete-memory"
            style="width:100%;padding:12px;border-radius:14px;border:1px solid rgba(200,100,100,0.25);
                   background:rgba(200,100,100,0.06);color:#c87878;font-size:13px;font-weight:600;
                   cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:6px">
            <span>🗑</span> Hapus Kenangan
          </button>
        </div>
      `

      sheet.querySelector('#btn-delete-memory')!.addEventListener('click', () => {
        openConfirmModal({
          title: 'Hapus Kenangan?',
          message: `"${m.title}" akan dihapus permanen.`,
          confirmLabel: 'Hapus',
          danger: true,
          onConfirm: async () => {
            const { error } = await supabase.from('memories').delete().eq('id', m.id)
            if (error) throw error
            card.el.remove()
            const idx = cards.indexOf(card)
            if (idx !== -1) cards.splice(idx, 1)
            closeDetail()
            showToast('Kenangan dihapus', 'success')
          },
        })
      })
    }
  }

  const closeDetail = () => {
    overlay.dataset.mode = ''
    overlay.style.pointerEvents = 'none'
    overlay.style.background = 'rgba(0,0,0,0)'
    overlay.style.backdropFilter = ''
    overlay.style.alignItems = 'flex-end'
    sheet.style.transform = 'translateY(100%)'
    sheet.style.maxHeight = '82vh'
    sheet.style.maxWidth = '430px'
    sheet.style.borderRadius = '28px 28px 0 0'
    sheet.style.borderTop = '1px solid rgba(255,255,255,0.85)'
    sheet.style.background = 'rgba(255,255,255,0.97)'
    sheet.style.boxShadow = '0 -8px 40px rgba(0,0,0,0.15)'
    sheet.style.backdropFilter = 'blur(32px)'
    sheet.style.display = 'block'
    sheet.style.width = '100%'
    sheet.style.height = 'auto'
    sheet.style.overflowY = 'auto'
    sheet.style.flexDirection = ''
    sheet.style.alignItems = ''
    sheet.style.justifyContent = ''
    sheet.style.padding = ''
  }

  overlay.addEventListener('click', e => {
    const tgt = e.target as Element
    if (overlay.dataset.mode === 'lightbox') {
      // close unless tapping photo frame, buttons, or dots
      if (!tgt.closest('button') && !tgt.closest('#lb-frame') && !tgt.closest('#lb-dots')) {
        closeDetail()
      }
    } else {
      if (e.target === overlay) closeDetail()
    }
  })

  // ── Build cards ───────────────────────────────────────────────
  const W = Math.min(window.innerWidth, 430)
  const H = window.innerHeight
  let lanes = buildLanes(W, H)

  const half = Math.ceil(mems.length / 2)

  const cards: PhysCard[] = mems.map((m, i) => {
    const lane = (i < half ? 0 : 1) as 0 | 1
    const slot = i < half ? i : i - half
    const t    = (slot * T_STEP) % 1
    const pos  = pathBez(t, lanes[lane])
    const d    = Math.abs(t - 0.5) * 2
    const initS = lerp(MAX_SCALE, MIN_SCALE, d * d)
    const initO = lerp(1.0, 0.38, d)

    const el = document.createElement('div')
    el.style.cssText = `
      position:absolute;top:0;left:0;
      width:${CARD_W}px;height:${CARD_H}px;
      border-radius:16px;cursor:pointer;
      will-change:transform;transform-origin:center;
    `

    const inner = document.createElement('div')
    inner.style.cssText = `
      width:100%;height:100%;border-radius:16px;overflow:hidden;
      background:rgba(255,255,255,0.62);
      border:.5px solid rgba(255,255,255,0.72);
      box-shadow:inset 0 1px 0 rgba(255,255,255,0.9);
      padding:3px;
    `

    if (m.photoUrl) {
      const img = document.createElement('img')
      img.src = m.photoUrl
      img.draggable = false
      img.loading = 'lazy'
      img.style.cssText = `
        width:100%;height:100%;object-fit:cover;
        border-radius:13px;display:block;
        pointer-events:none;user-select:none;
      `
      inner.appendChild(img)
    } else {
      const txt = document.createElement('div')
      txt.style.cssText = `
        width:100%;height:100%;border-radius:13px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        padding:10px;text-align:center;
        background:linear-gradient(135deg,rgba(200,130,106,0.14),rgba(200,130,106,0.06));
      `
      const iconSpan = document.createElement('span')
      iconSpan.style.cssText = 'font-size:18px;margin-bottom:5px;opacity:.7'
      iconSpan.textContent = '✦'
      const titleSpan = document.createElement('span')
      titleSpan.style.cssText = 'font-size:8.5px;font-weight:700;color:#c8826a;text-transform:uppercase;letter-spacing:.09em;line-height:1.35'
      titleSpan.textContent = m.title.length > 18 ? m.title.slice(0, 18) + '…' : m.title
      txt.appendChild(iconSpan)
      txt.appendChild(titleSpan)
      inner.appendChild(txt)
    }

    el.appendChild(inner)
    canvas.appendChild(el)

    const rgb = GLOW[i % GLOW.length]

    // Touch/mouse events
    const onMove = (cx: number, cy: number) => {
      c.hit = true
      const r  = el.getBoundingClientRect()
      const dx = (cx - (r.left + r.width  / 2)) / (r.width  / 2)
      const dy = (cy - (r.top  + r.height / 2)) / (r.height / 2)
      c.tRX = -dy * 26
      c.tRY =  dx * 26
    }
    const onEnd = () => { c.hit = false; c.tRX = 0; c.tRY = 0 }

    el.addEventListener('mousemove',  e => onMove(e.clientX, e.clientY))
    el.addEventListener('mouseleave', onEnd)
    el.addEventListener('touchmove',  e => {
      e.preventDefault()
      onMove(e.touches[0].clientX, e.touches[0].clientY)
    }, { passive: false })
    el.addEventListener('touchend', onEnd)
    el.addEventListener('click', () => openDetail(m, c))

    // Initial transform
    const ox0 = pos.x - CARD_W / 2 - CARD_W * (initS - 1) / 2
    const oy0 = pos.y - CARD_H / 2 - CARD_H * (initS - 1) / 2
    el.style.transform = `translate(${ox0}px,${oy0}px) scale(${initS})`
    el.style.opacity   = String(initO)

    const c: PhysCard = {
      mem: m, el, inner, rgb,
      lane, t,
      curS: initS, curO: initO,
      rX: 0, rY: 0, tRX: 0, tRY: 0,
      hit: false,
    }
    return c
  })

  // ── RAF loop ──────────────────────────────────────────────────
  let rafId = 0

  const tick = () => {
    const CW = Math.min(window.innerWidth, 430)
    const CH = window.innerHeight
    lanes = buildLanes(CW, CH)

    for (const c of cards) {
      if (!c.hit) {
        c.t = (c.t + SPEED) % 1
      }

      const pos = pathBez(c.t, lanes[c.lane])

      // Scale & opacity: max at t=0.5 (path center = screen center), min at edges
      const d  = Math.abs(c.t - 0.5) * 2
      const tS = c.hit ? MAX_SCALE + 0.18 : lerp(MAX_SCALE, MIN_SCALE, d * d)
      const tO = c.hit ? 1.0 : lerp(1.0, 0.38, d)

      c.curS = lerp(c.curS, tS, LERP_SCL)
      c.curO = lerp(c.curO, tO, LERP_SCL)
      c.rX   = lerp(c.rX, c.tRX, LERP_ROT)
      c.rY   = lerp(c.rY, c.tRY, LERP_ROT)

      c.el.style.zIndex = c.hit ? '100' : String(Math.round(c.curS * 300))

      const ox = pos.x - CARD_W / 2 - CARD_W * (c.curS - 1) / 2
      const oy = pos.y - CARD_H / 2 - CARD_H * (c.curS - 1) / 2

      c.el.style.transform =
        `translate(${ox}px,${oy}px) ` +
        `perspective(900px) ` +
        `rotateX(${c.rX}deg) rotateY(${c.rY}deg) ` +
        `scale(${c.curS})`

      c.el.style.opacity = String(c.curO)

      if (c.hit) {
        c.inner.style.boxShadow =
          `0 8px 24px rgba(${c.rgb},.40),` +
          `0 0 16px rgba(${c.rgb},.20),` +
          `inset 0 1px 0 rgba(255,255,255,.95)`
      } else {
        c.inner.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,.9)`
      }
    }

    rafId = requestAnimationFrame(tick)
  }

  rafId = requestAnimationFrame(tick)

  // lane geometry is computed per-frame from window size — no resize handler needed

  // Cleanup on unmount
  const obs = new MutationObserver(() => {
    if (!wrapper.isConnected) {
      cancelAnimationFrame(rafId)
      overlay.remove()
      obs.disconnect()
    }
  })
  obs.observe(document.body, { childList: true, subtree: false })

  header.querySelector('#btn-add')!.addEventListener('click', () => navigate('/timeline/add'))
  wrapper.appendChild(renderNav())
  return wrapper
}

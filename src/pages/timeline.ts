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
const MAX_SCALE = 1.32
const MIN_SCALE = 0.28
const LERP_SCL  = 0.036
const LERP_ROT  = 0.09
const BASE_SPD  = 0.20
const SPD_VAR   = 0.22
const HEADER_H  = 112
const NAV_H     = 84

const GLOW: readonly string[] = [
  '200,130,106', '122,158,200', '106,184,122',
  '212,149,106', '160,130,200', '180,160,106',
]

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

function scaleAt(cx: number, W: number) {
  const d = Math.abs((cx / W) - 0.5) * 2
  return lerp(MAX_SCALE, MIN_SCALE, d * d)
}

function opacityAt(cx: number, W: number) {
  const d = Math.abs((cx / W) - 0.5) * 2
  return lerp(1.0, 0.36, d)
}

// ── Per-card state ────────────────────────────────────────────
interface PhysCard {
  mem: Memory & { photoUrl: string | null }
  el: HTMLDivElement
  inner: HTMLDivElement
  rgb: string
  x: number; y: number; vx: number; vy: number
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
    position: absolute; top: 0; left: 0; right: 0; z-index: 20;
    padding: 40px 20px 24px;
    display: flex; justify-content: space-between; align-items: flex-end;
    background: linear-gradient(to bottom,
      rgba(253,244,240,0.97) 0%,
      rgba(253,244,240,0.82) 65%,
      transparent 100%);
    pointer-events: all;
  `
  header.innerHTML = `
    <div>
      <p style="font-size:10px;text-transform:uppercase;letter-spacing:.24em;color:#c8826a;font-weight:500;margin-bottom:4px">Kenangan</p>
      <h1 style="font-family:'Playfair Display',Georgia,serif;font-size:30px;color:#1a1916;line-height:1.1">Timeline</h1>
      <p style="font-size:11px;color:#9a9088;margin-top:4px">${mems.length} momen bersama</p>
    </div>
    <button id="btn-add" style="
      padding:9px 20px;border-radius:999px;
      background:linear-gradient(135deg,#c8826a,#d4956a);
      color:white;font-size:13px;font-weight:600;
      border:none;cursor:pointer;font-family:inherit;
      box-shadow:0 4px 14px rgba(200,130,106,0.42);
    ">+ Tambah</button>
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
    position:fixed;inset:0;z-index:200;
    display:flex;align-items:flex-end;justify-content:center;
    background:rgba(0,0,0,0);pointer-events:none;
    transition:background .25s ease;
  `

  const sheet = document.createElement('div')
  sheet.style.cssText = `
    width:100%;max-width:430px;
    background:rgba(255,255,255,0.97);
    backdrop-filter:blur(32px);-webkit-backdrop-filter:blur(32px);
    border-radius:28px 28px 0 0;
    border-top:1px solid rgba(255,255,255,0.85);
    box-shadow:0 -8px 40px rgba(0,0,0,0.15);
    transform:translateY(100%);
    transition:transform .32s cubic-bezier(.32,.72,0,1);
    overflow:hidden;max-height:82vh;overflow-y:auto;
    padding-bottom:env(safe-area-inset-bottom,0px);
  `
  overlay.appendChild(sheet)
  document.body.appendChild(overlay)

  const openDetail = (m: Memory & { photoUrl: string | null }, card: PhysCard) => {
    overlay.style.pointerEvents = 'all'
    overlay.style.background = 'rgba(0,0,0,0.48)'
    sheet.style.transform = 'translateY(0)'

    const typeLabel: Record<string, string> = { memory: 'Kenangan', milestone: 'Milestone', photo: 'Foto' }
    sheet.innerHTML = `
      <!-- Handle -->
      <div style="width:40px;height:4px;border-radius:999px;background:rgba(0,0,0,0.12);margin:12px auto 0"></div>

      ${m.photoUrl ? `
        <div style="width:100%;height:260px;overflow:hidden;margin-top:16px">
          <img src="${esc(m.photoUrl)}" style="width:100%;height:100%;object-fit:cover" alt="${esc(m.title)}" />
        </div>
      ` : `
        <div style="height:16px"></div>
      `}

      <div style="padding:22px 24px 16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <span style="font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:#c8826a;font-weight:700">
            ${esc(typeLabel[m.type] ?? m.type)}
          </span>
          <time style="font-size:11px;color:#9a9088">${esc(formatDate(m.memory_date))}</time>
        </div>
        <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:22px;color:#1a1916;line-height:1.25;margin-bottom:${m.description ? '10px' : '0'}">
          ${esc(m.title)}
        </h2>
        ${m.description ? `<p style="font-size:14px;color:#6b6860;line-height:1.7">${esc(m.description)}</p>` : ''}
      </div>

      <!-- Delete button -->
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
          // Hapus card dari DOM dan array
          card.el.remove()
          const idx = cards.indexOf(card)
          if (idx !== -1) cards.splice(idx, 1)
          closeDetail()
          showToast('Kenangan dihapus', 'success')
        },
      })
    })
  }

  const closeDetail = () => {
    overlay.style.pointerEvents = 'none'
    overlay.style.background = 'rgba(0,0,0,0)'
    sheet.style.transform = 'translateY(100%)'
  }

  overlay.addEventListener('click', e => { if (e.target === overlay) closeDetail() })

  // ── Build cards ───────────────────────────────────────────────
  const W = Math.min(window.innerWidth, 430)
  const H = window.innerHeight

  const cards: PhysCard[] = mems.map((m, i) => {
    const x   = Math.random() * (W - CARD_W)
    const y   = HEADER_H + Math.random() * Math.max(0, H - HEADER_H - NAV_H - CARD_H)
    const spd = BASE_SPD + Math.random() * SPD_VAR
    const ang = Math.random() * Math.PI * 2

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
      box-shadow:0 4px 20px rgba(0,0,0,0.07),inset 0 1px 0 rgba(255,255,255,0.9);
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

    const rgb  = GLOW[i % GLOW.length]
    const initS = scaleAt(x + CARD_W / 2, W)

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

    const c: PhysCard = {
      mem: m, el, inner, rgb,
      x, y,
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd,
      curS: initS, curO: opacityAt(x + CARD_W / 2, W),
      rX: 0, rY: 0, tRX: 0, tRY: 0,
      hit: false,
    }
    return c
  })

  // ── RAF loop ──────────────────────────────────────────────────
  let rafId = 0

  const tick = () => {
    const CW = Math.min(window.innerWidth, 430)

    for (const c of cards) {
      if (!c.hit) {
        c.x += c.vx; c.y += c.vy

        if (c.x < 0)           { c.x = 0;            c.vx =  Math.abs(c.vx) }
        if (c.x > CW - CARD_W) { c.x = CW - CARD_W;  c.vx = -Math.abs(c.vx) }
        if (c.y < HEADER_H)    { c.y = HEADER_H;      c.vy =  Math.abs(c.vy) }
        if (c.y > H - NAV_H - CARD_H) { c.y = H - NAV_H - CARD_H; c.vy = -Math.abs(c.vy) }
      }

      const cx = c.x + CARD_W / 2
      const tS = c.hit ? MAX_SCALE + 0.16 : scaleAt(cx, CW)
      const tO = c.hit ? 1.0 : opacityAt(cx, CW)

      c.curS = lerp(c.curS, tS, LERP_SCL)
      c.curO = lerp(c.curO, tO, LERP_SCL)
      c.rX   = lerp(c.rX, c.tRX, LERP_ROT)
      c.rY   = lerp(c.rY, c.tRY, LERP_ROT)

      c.el.style.zIndex = c.hit ? '100' : String(Math.round(c.curS * 200))

      const ox = c.x - CARD_W * (c.curS - 1) / 2
      const oy = c.y - CARD_H * (c.curS - 1) / 2

      c.el.style.transform =
        `translate(${ox}px,${oy}px) ` +
        `perspective(900px) ` +
        `rotateX(${c.rX}deg) rotateY(${c.rY}deg) ` +
        `scale(${c.curS})`

      c.el.style.opacity = String(c.curO)

      if (c.hit) {
        c.inner.style.boxShadow =
          `0 22px 60px rgba(${c.rgb},.52),` +
          `0 0 44px rgba(${c.rgb},.30),` +
          `inset 0 1px 0 rgba(255,255,255,.95)`
      } else {
        const s = c.curS
        c.inner.style.boxShadow =
          `0 ${(s * 5).toFixed(1)}px ${(s * 22).toFixed(1)}px rgba(0,0,0,.07),` +
          `inset 0 1px 0 rgba(255,255,255,.9)`
      }
    }

    rafId = requestAnimationFrame(tick)
  }

  rafId = requestAnimationFrame(tick)

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

import { navigate } from '../router'

// ── SVG icon library ─────────────────────────────────────────
function svg(paths: string, size = 22): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    style="display:block;flex-shrink:0">${paths}</svg>`
}

const ICONS = {
  // 4-point sparkle — Kenangan
  memories: svg(`
    <path d="M12 2C12 7.25 16.75 12 22 12C16.75 12 12 16.75 12 22C12 16.75 7.25 12 2 12C7.25 12 12 7.25 12 2Z"/>
  `),

  // Calendar with soft check — Kencan
  planner: svg(`
    <rect x="3" y="4" width="18" height="18" rx="3"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <path d="M9 16l2 2 4-4"/>
  `),

  // Soft message bubble — Chat
  chat: svg(`
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  `),

  // Equaliser sliders — Settings
  settings: svg(`
    <line x1="4" y1="6" x2="20" y2="6"/>
    <circle cx="14" cy="6" r="2.2"/>
    <line x1="4" y1="12" x2="20" y2="12"/>
    <circle cx="9" cy="12" r="2.2"/>
    <line x1="4" y1="18" x2="20" y2="18"/>
    <circle cx="15" cy="18" r="2.2"/>
  `),

  // Heart — Home FAB
  heart: (color: string, size = 24) => `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"
      stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"
      style="display:block">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill="${color === 'white' ? 'rgba(255,255,255,0.18)' : 'rgba(200,130,106,0.10)'}"/>
    </svg>
  `,

  // Map pin — Location
  location: svg(`
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  `),

  // Camera — Tambah Kenangan
  camera: svg(`
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  `),
}

const LEFT_ITEMS = [
  { path: '/timeline', icon: ICONS.memories,  label: 'Kenangan' },
  { path: '/planner',  icon: ICONS.planner,   label: 'Kencan'   },
]

const RIGHT_ITEMS = [
  { path: '/chat',     icon: ICONS.chat,      label: 'Chat' },
  { path: '/settings', icon: ICONS.settings,  label: 'Atur' },
]

export function renderNav(): HTMLElement {
  const currentPath = window.location.hash.slice(1).split('?')[0] || '/'
  const isHome = currentPath === '/'

  const nav = document.createElement('nav')
  nav.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 430px;
    height: 68px;
    padding-bottom: env(safe-area-inset-bottom, 0px);
    display: flex;
    align-items: center;
    overflow: visible;
    z-index: 300;
    background: rgba(253,244,240,0.84);
    backdrop-filter: blur(28px) saturate(1.6);
    -webkit-backdrop-filter: blur(28px) saturate(1.6);
    border-top: 1px solid rgba(255,255,255,0.68);
    box-shadow: 0 -4px 28px rgba(200,130,106,0.08), 0 -1px 0 rgba(255,255,255,0.5);
  `

  function makeItem(path: string, icon: string, label: string) {
    const active = currentPath === path
    const btn = document.createElement('button')
    btn.style.cssText = `
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
      padding: 8px 0;
      border: none;
      background: transparent;
      cursor: pointer;
      color: ${active ? '#c8826a' : '#b0a099'};
      transition: color 0.2s, opacity 0.15s;
    `
    btn.innerHTML = `
      <span style="
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border-radius: 14px;
        transition: all 0.26s cubic-bezier(0.34,1.56,0.64,1);
        ${active ? `
          background: linear-gradient(145deg, rgba(255,234,224,0.90) 0%, rgba(255,216,198,0.65) 100%);
          backdrop-filter: blur(22px) saturate(2.0) brightness(1.06);
          -webkit-backdrop-filter: blur(22px) saturate(2.0) brightness(1.06);
          border: 1px solid rgba(255,255,255,0.90);
          box-shadow:
            0 6px 22px rgba(200,130,106,0.20),
            0 2px 6px rgba(200,130,106,0.10),
            inset 0 1.5px 0 rgba(255,255,255,0.96),
            inset 0 -1px 2px rgba(200,130,106,0.08);
          transform: scale(1.06) translateY(-1px);
        ` : `
          background: linear-gradient(145deg, rgba(255,255,255,0.56) 0%, rgba(255,248,244,0.34) 100%);
          backdrop-filter: blur(14px) saturate(1.5);
          -webkit-backdrop-filter: blur(14px) saturate(1.5);
          border: 1px solid rgba(255,255,255,0.64);
          box-shadow:
            0 2px 8px rgba(200,130,106,0.07),
            inset 0 1px 0 rgba(255,255,255,0.86);
          transform: scale(1);
        `}
      ">${icon}</span>
      <span style="
        font-size: 8px;
        font-weight: ${active ? '700' : '500'};
        text-transform: uppercase;
        letter-spacing: 0.1em;
        line-height: 1;
      ">${label}</span>
    `
    btn.addEventListener('click', () => navigate(path))
    btn.addEventListener('touchstart', () => { btn.style.opacity = '0.7' }, { passive: true })
    btn.addEventListener('touchend',   () => { btn.style.opacity = '1'   }, { passive: true })
    return btn
  }

  LEFT_ITEMS.forEach(item => nav.appendChild(makeItem(item.path, item.icon, item.label)))

  // ── CENTER FAB ────────────────────────────────────────────
  const fabWrap = document.createElement('div')
  fabWrap.style.cssText = `
    position: relative;
    flex: 0 0 80px;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
  `

  const halo = document.createElement('div')
  halo.style.cssText = `
    position: absolute;
    top: -26px;
    width: 66px; height: 66px;
    border-radius: 50%;
    background: ${isHome
      ? 'radial-gradient(circle, rgba(200,130,106,0.32) 0%, transparent 68%)'
      : 'radial-gradient(circle, rgba(200,130,106,0.10) 0%, transparent 68%)'
    };
    pointer-events: none;
    transition: all 0.35s ease;
  `

  const fab = document.createElement('button')
  fab.style.cssText = `
    position: absolute;
    top: -24px;
    width: 60px; height: 60px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    transition: transform 0.26s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.26s;
    ${isHome ? `
      background: linear-gradient(145deg, #e09472 0%, #c8826a 50%, #b36858 100%);
      border: 2px solid rgba(255,255,255,0.90);
      box-shadow:
        0 10px 34px rgba(200,130,106,0.52),
        0 4px 12px rgba(180,110,90,0.28),
        0 1px 3px rgba(0,0,0,0.10),
        inset 0 1.5px 0 rgba(255,255,255,0.30),
        inset 0 -1px 0 rgba(0,0,0,0.07);
    ` : `
      background: linear-gradient(145deg, rgba(255,255,255,0.90) 0%, rgba(255,240,232,0.72) 50%, rgba(255,226,212,0.56) 100%);
      backdrop-filter: blur(26px) saturate(1.9) brightness(1.04);
      -webkit-backdrop-filter: blur(26px) saturate(1.9) brightness(1.04);
      border: 1.5px solid rgba(255,255,255,0.92);
      box-shadow:
        0 8px 30px rgba(200,130,106,0.16),
        0 3px 10px rgba(200,130,106,0.09),
        0 1px 3px rgba(0,0,0,0.05),
        inset 0 1.5px 0 rgba(255,255,255,0.96),
        inset 0 -1px 1px rgba(200,130,106,0.07);
    `}
  `

  const heartColor = isHome ? 'white' : '#c8826a'
  fab.innerHTML = `
    ${ICONS.heart(heartColor, 26)}
    <span style="
      font-size: 7px; font-weight: 700;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: ${isHome ? 'rgba(255,255,255,0.80)' : '#c09080'};
      margin-top: 1px;
    ">Home</span>
  `

  fab.addEventListener('click',      () => navigate('/'))
  fab.addEventListener('touchstart', () => { fab.style.transform = 'scale(0.91)' }, { passive: true })
  fab.addEventListener('touchend',   () => { fab.style.transform = 'scale(1)'    }, { passive: true })
  fab.addEventListener('mouseenter', () => { if (!isHome) fab.style.transform = 'scale(1.06) translateY(-1px)' })
  fab.addEventListener('mouseleave', () => { fab.style.transform = 'scale(1) translateY(0)' })

  fabWrap.appendChild(halo)
  fabWrap.appendChild(fab)
  nav.appendChild(fabWrap)

  RIGHT_ITEMS.forEach(item => nav.appendChild(makeItem(item.path, item.icon, item.label)))

  return nav
}

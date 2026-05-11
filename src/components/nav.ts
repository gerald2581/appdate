import { navigate } from '../router'

const LEFT_ITEMS = [
  { path: '/timeline', icon: '✦', label: 'Kenangan' },
  { path: '/planner',  icon: '◎', label: 'Kencan'  },
]

const RIGHT_ITEMS = [
  { path: '/chat',     icon: '✉', label: 'Chat' },
  { path: '/settings', icon: '⚙', label: 'Atur' },
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
    height: 64px;
    padding-bottom: env(safe-area-inset-bottom, 0px);
    display: flex;
    align-items: center;
    overflow: visible;
    z-index: 300;
    background: rgba(255,255,255,0.82);
    backdrop-filter: blur(24px) saturate(1.5);
    -webkit-backdrop-filter: blur(24px) saturate(1.5);
    border-top: 1px solid rgba(255,255,255,0.65);
    box-shadow: 0 -4px 24px rgba(0,0,0,0.07);
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
      gap: 3px;
      padding: 8px 0;
      border: none;
      background: transparent;
      cursor: pointer;
      color: ${active ? '#c8826a' : '#a09890'};
      transition: color 0.15s, opacity 0.15s;
    `
    btn.innerHTML = `
      <span style="
        font-size: 18px;
        line-height: 1;
        display: block;
        transform: ${active ? 'scale(1.15)' : 'scale(1)'};
        transition: transform 0.15s cubic-bezier(0.34,1.56,0.64,1);
      ">${icon}</span>
      <span style="
        font-size: 8.5px;
        font-weight: ${active ? '700' : '500'};
        text-transform: uppercase;
        letter-spacing: 0.1em;
      ">${label}</span>
    `
    btn.addEventListener('click', () => navigate(path))
    btn.addEventListener('touchstart', () => { btn.style.opacity = '0.7' }, { passive: true })
    btn.addEventListener('touchend', () => { btn.style.opacity = '1' }, { passive: true })
    return btn
  }

  // Left side items
  LEFT_ITEMS.forEach(item => nav.appendChild(makeItem(item.path, item.icon, item.label)))

  // ── CENTER FAB ───────────────────────────────────────────
  const fabWrap = document.createElement('div')
  fabWrap.style.cssText = `
    position: relative;
    flex: 0 0 76px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
  `

  // Halo ring (subtle glow behind FAB)
  const halo = document.createElement('div')
  halo.style.cssText = `
    position: absolute;
    top: -22px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: ${isHome
      ? 'radial-gradient(circle, rgba(200,130,106,0.35) 0%, transparent 70%)'
      : 'radial-gradient(circle, rgba(200,130,106,0.12) 0%, transparent 70%)'
    };
    pointer-events: none;
    transition: all 0.3s ease;
  `

  const fab = document.createElement('button')
  fab.style.cssText = `
    position: absolute;
    top: -20px;
    width: 54px;
    height: 54px;
    border-radius: 50%;
    border: 2.5px solid rgba(255,255,255,0.95);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0px;
    transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
    background: ${isHome
      ? 'linear-gradient(145deg, #d4956a, #c8826a, #b8705a)'
      : 'linear-gradient(145deg, #f7ede7, #edddd5)'
    };
    box-shadow: ${isHome
      ? '0 8px 28px rgba(200,130,106,0.6), 0 2px 8px rgba(180,110,90,0.3), inset 0 1px 0 rgba(255,255,255,0.25)'
      : '0 4px 16px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9)'
    };
  `

  const heartColor  = isHome ? 'white' : '#c8826a'
  const labelColor  = isHome ? 'rgba(255,255,255,0.82)' : '#c09080'

  fab.innerHTML = `
    <span style="
      font-size: 20px;
      line-height: 1;
      color: ${heartColor};
      display: block;
      margin-bottom: 1px;
      filter: ${isHome ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))' : 'none'};
    ">♡</span>
    <span style="
      font-size: 7px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: ${labelColor};
    ">Home</span>
  `

  fab.addEventListener('click', () => navigate('/'))
  fab.addEventListener('touchstart', () => {
    fab.style.transform = 'scale(0.91)'
  }, { passive: true })
  fab.addEventListener('touchend', () => {
    fab.style.transform = 'scale(1)'
  }, { passive: true })
  fab.addEventListener('mouseenter', () => {
    if (!isHome) fab.style.transform = 'scale(1.06) translateY(-1px)'
  })
  fab.addEventListener('mouseleave', () => {
    fab.style.transform = 'scale(1) translateY(0)'
  })

  fabWrap.appendChild(halo)
  fabWrap.appendChild(fab)
  nav.appendChild(fabWrap)

  // Right side items
  RIGHT_ITEMS.forEach(item => nav.appendChild(makeItem(item.path, item.icon, item.label)))

  return nav
}

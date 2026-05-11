type RouteHandler = () => HTMLElement | Promise<HTMLElement>

const routes = new Map<string, RouteHandler>()
let container: HTMLElement
let renderGen = 0

export function registerRoute(path: string, handler: RouteHandler) {
  routes.set(path, handler)
}

export function navigate(path: string) {
  window.location.hash = path
}

async function render() {
  const gen = ++renderGen
  const hash = window.location.hash.slice(1) || '/'
  const path = hash.split('?')[0]

  const handler = routes.get(path) ?? routes.get('*')
  if (!handler) return

  // Await page first — old content stays visible during data fetch
  const el = await handler()
  if (gen !== renderGen) return

  const swap = () => {
    container.innerHTML = ''
    container.appendChild(el)
  }

  if ('startViewTransition' in document) {
    // View Transitions API — browser handles background crossfade natively
    document.startViewTransition(swap)
  } else {
    // Graceful fallback: fade-in only
    swap()
    el.style.opacity = '0'
    el.style.transform = 'translateY(10px)'
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1)'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
      setTimeout(() => { el.style.transition = ''; el.style.transform = '' }, 280)
    })
  }
}

export function initRouter(el: HTMLElement) {
  container = el
  window.addEventListener('hashchange', render)
  render()
}

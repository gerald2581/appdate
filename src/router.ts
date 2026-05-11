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

  // Await page first — old content stays visible, no layout-shifting spinner
  const el = await handler()
  if (gen !== renderGen) return

  container.innerHTML = ''
  container.appendChild(el)

  // Subtle fade-in so the swap doesn't feel abrupt
  el.style.opacity = '0'
  requestAnimationFrame(() => {
    el.style.transition = 'opacity 0.18s ease'
    el.style.opacity = '1'
    requestAnimationFrame(() => {
      // Clean up inline transition after it's done
      setTimeout(() => { el.style.transition = '' }, 200)
    })
  })
}

export function initRouter(el: HTMLElement) {
  container = el
  window.addEventListener('hashchange', render)
  render()
}

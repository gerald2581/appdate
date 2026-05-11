type RouteHandler = () => HTMLElement | Promise<HTMLElement>

const routes = new Map<string, RouteHandler>()
let container: HTMLElement
let renderGen = 0  // generation counter — cancels stale async renders

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

  container.innerHTML = `<div class="flex items-center justify-center min-h-dvh"><div class="spinner"></div></div>`

  const el = await handler()

  // If a newer render started while we were awaiting, discard this result
  if (gen !== renderGen) return

  container.innerHTML = ''
  container.appendChild(el)
}

export function initRouter(el: HTMLElement) {
  container = el
  window.addEventListener('hashchange', render)
  render()
}

type ToastType = 'default' | 'success' | 'error'

let container: HTMLElement | null = null

function getContainer(): HTMLElement {
  if (!container) {
    container = document.createElement('div')
    container.className = 'fixed bottom-[calc(64px+1rem)] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[390px] z-50 flex flex-col gap-2 pointer-events-none'
    document.body.appendChild(container)
  }
  return container
}

export function showToast(message: string, type: ToastType = 'default', durationMs = 3000) {
  const c = getContainer()

  const bgClass = {
    default: 'bg-ink',
    success: 'bg-success',
    error:   'bg-danger',
  }[type]

  const toast = document.createElement('div')
  toast.className = `${bgClass} text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg animate-[toast-in_0.2s_ease]`
  toast.textContent = message
  c.appendChild(toast)

  setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transition = 'opacity 0.2s ease'
    setTimeout(() => toast.remove(), 200)
  }, durationMs)
}

interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
  onConfirm: () => void | Promise<void>
}

export function openConfirmModal(opts: ConfirmOptions) {
  const backdrop = document.createElement('div')
  backdrop.className = 'fixed inset-0 z-[300] flex items-end justify-center'
  backdrop.style.cssText = 'background:rgba(0,0,0,0.4); backdrop-filter:blur(4px);'

  const modal = document.createElement('div')
  modal.className = 'w-full max-w-[430px] rounded-t-3xl p-6 pb-10'
  modal.style.cssText = `
    background: rgba(255,255,255,0.94);
    backdrop-filter: blur(32px);
    border-top: 1px solid rgba(255,255,255,0.8);
    box-shadow: 0 -8px 40px rgba(0,0,0,0.15);
    animation: slide-up 0.25s cubic-bezier(0.32,0.72,0,1);
  `

  const confirmColor = opts.danger
    ? 'background: linear-gradient(135deg,#c85050,#d46060); box-shadow:0 4px 16px rgba(200,80,80,0.35)'
    : 'background: linear-gradient(135deg,#c8826a,#d4956a); box-shadow:0 4px 16px rgba(200,130,106,0.35)'

  modal.innerHTML = `
    <div class="w-10 h-1 rounded-full mx-auto mb-5" style="background:rgba(0,0,0,0.15)"></div>
    <h3 class="font-display text-lg text-ink mb-2">${opts.title}</h3>
    <p class="text-sm text-ink-muted mb-6 leading-relaxed">${opts.message}</p>
    <div class="flex gap-3">
      <button id="cm-cancel"
        class="flex-1 py-3.5 rounded-full text-sm font-medium cursor-pointer border-none"
        style="background:rgba(0,0,0,0.06); color:#6b6860">
        Batal
      </button>
      <button id="cm-confirm"
        class="flex-[2] py-3.5 rounded-full text-white text-sm font-semibold cursor-pointer border-none"
        style="${confirmColor}">
        ${opts.confirmLabel ?? 'Konfirmasi'}
      </button>
    </div>
  `

  backdrop.appendChild(modal)
  document.body.appendChild(backdrop)

  function close() {
    backdrop.style.opacity = '0'
    backdrop.style.transition = 'opacity 0.2s ease'
    setTimeout(() => backdrop.remove(), 200)
  }

  backdrop.addEventListener('click', e => { if (e.target === backdrop) close() })
  modal.querySelector('#cm-cancel')!.addEventListener('click', close)

  modal.querySelector('#cm-confirm')!.addEventListener('click', async () => {
    const btn = modal.querySelector('#cm-confirm') as HTMLButtonElement
    btn.disabled = true
    btn.textContent = '...'
    await opts.onConfirm()
    close()
  })
}

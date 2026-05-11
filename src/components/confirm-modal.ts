interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
  onConfirm: () => void | Promise<void>
}

export function openConfirmModal(opts: ConfirmOptions) {
  const backdrop = document.createElement('div')
  backdrop.style.cssText = `
    position:fixed;inset:0;z-index:20000;
    display:flex;align-items:flex-end;justify-content:center;
    background:rgba(0,0,0,0);
    transition:background .22s ease;
  `

  const modal = document.createElement('div')
  modal.style.cssText = `
    width:100%;max-width:430px;
    background:#fdf4f0;
    border-radius:28px 28px 0 0;
    border-top:1px solid rgba(255,255,255,0.85);
    box-shadow:0 -8px 40px rgba(180,120,80,0.14);
    transform:translateY(100%);
    transition:transform .28s cubic-bezier(.32,.72,0,1);
    padding:0 0 env(safe-area-inset-bottom,0px);
    overflow:hidden;
  `

  modal.innerHTML = `
    <!-- Handle -->
    <div style="width:36px;height:4px;border-radius:999px;background:rgba(26,25,22,0.12);
                margin:14px auto 0"></div>

    <!-- Content -->
    <div style="padding:20px 24px 24px">

      <!-- Icon -->
      <div style="width:48px;height:48px;border-radius:16px;
                  background:${opts.danger ? 'rgba(200,100,100,0.1)' : 'rgba(200,130,106,0.1)'};
                  display:flex;align-items:center;justify-content:center;margin-bottom:16px">
        ${opts.danger
          ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c87070"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <polyline points="3 6 5 6 21 6"/>
               <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
             </svg>`
          : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c8826a"
               stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <circle cx="12" cy="12" r="10"/>
               <line x1="12" y1="8" x2="12" y2="12"/>
               <line x1="12" y1="16" x2="12.01" y2="16"/>
             </svg>`
        }
      </div>

      <!-- Text -->
      <h3 style="font-family:'Playfair Display',Georgia,serif;
                 font-size:18px;color:#1a1916;margin:0 0 8px;line-height:1.3">
        ${opts.title}
      </h3>
      <p style="font-size:13px;color:#8a8078;line-height:1.65;margin:0 0 24px">
        ${opts.message}
      </p>

      <!-- Buttons -->
      <div style="display:flex;gap:10px">
        <button id="cm-cancel"
          style="flex:1;padding:14px;border-radius:14px;border:1px solid rgba(26,25,22,0.1);
                 background:rgba(26,25,22,0.04);color:#6b6860;font-size:14px;font-weight:500;
                 cursor:pointer;font-family:inherit;transition:background .15s">
          Tidak
        </button>
        <button id="cm-confirm"
          style="flex:2;padding:14px;border-radius:14px;border:none;
                 ${opts.danger
                   ? 'background:linear-gradient(135deg,#c85858,#d46868);box-shadow:0 4px 14px rgba(200,88,88,0.3)'
                   : 'background:linear-gradient(135deg,#c8826a,#d4956a);box-shadow:0 4px 14px rgba(200,130,106,0.3)'
                 };
                 color:#fff;font-size:14px;font-weight:600;
                 cursor:pointer;font-family:inherit;transition:opacity .15s">
          ${opts.confirmLabel ?? 'Ya'}
        </button>
      </div>
    </div>
  `

  backdrop.appendChild(modal)
  document.body.appendChild(backdrop)

  // Animate in
  requestAnimationFrame(() => {
    backdrop.style.background = 'rgba(0,0,0,0.36)'
    modal.style.transform = 'translateY(0)'
  })

  function close() {
    backdrop.style.background = 'rgba(0,0,0,0)'
    modal.style.transform = 'translateY(100%)'
    setTimeout(() => backdrop.remove(), 280)
  }

  backdrop.addEventListener('click', e => { if (e.target === backdrop) close() })
  modal.querySelector('#cm-cancel')!.addEventListener('click', close)

  modal.querySelector('#cm-confirm')!.addEventListener('click', async () => {
    const btn = modal.querySelector('#cm-confirm') as HTMLButtonElement
    btn.disabled = true
    btn.style.opacity = '0.6'
    btn.textContent = '...'
    try {
      await opts.onConfirm()
    } finally {
      close()
    }
  })
}

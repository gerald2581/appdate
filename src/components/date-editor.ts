import { setRelationshipStart } from '../lib/couple'
import { setState, getState } from '../store/state'
import { showToast } from './toast'

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

function nowDatetimeLocal(): string {
  return toDatetimeLocal(new Date().toISOString())
}

export function openDateEditor(onSaved: () => void) {
  const { user } = getState()
  if (!user) return

  // Backdrop
  const backdrop = document.createElement('div')
  backdrop.className = 'fixed inset-0 z-[200]'
  backdrop.style.cssText = 'background: rgba(0,0,0,0.35); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);'

  // Sheet
  const sheet = document.createElement('div')
  sheet.className = 'fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-[201]'
  sheet.style.cssText = `
    max-width: 430px;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(32px) saturate(1.6);
    -webkit-backdrop-filter: blur(32px) saturate(1.6);
    border-radius: 28px 28px 0 0;
    border-top: 1px solid rgba(255,255,255,0.8);
    box-shadow: 0 -8px 40px rgba(0,0,0,0.15);
    padding: 12px 24px 40px;
    transform: translateY(100%);
    transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  `

  sheet.innerHTML = `
    <!-- Handle bar -->
    <div class="w-10 h-1 rounded-full mx-auto mb-5 mt-1" style="background:rgba(0,0,0,0.15)"></div>

    <!-- Title -->
    <div class="flex justify-between items-center mb-5">
      <h3 class="font-display text-lg text-ink">Edit Tanggal Mulai</h3>
      <button id="btn-close"
        class="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer text-ink-muted hover:opacity-60 transition-opacity"
        style="background:rgba(0,0,0,0.06); font-size:1.1rem">
        ×
      </button>
    </div>

    <!-- Datetime input -->
    <div class="flex flex-col gap-1.5 mb-2">
      <label class="text-xs font-medium uppercase tracking-wider text-ink-muted">Tanggal & Waktu</label>
      <input id="dt-input"
        type="datetime-local"
        value="${toDatetimeLocal(user.relationship_start)}"
        max="${nowDatetimeLocal()}"
        class="w-full px-4 py-3.5 rounded-2xl text-base text-ink outline-none"
        style="background: rgba(200,130,106,0.07); border: 1.5px solid rgba(200,130,106,0.25);
               font-family: inherit; -webkit-appearance: none;" />
    </div>
    <p class="text-xs text-ink-muted mb-6">Atur jam & menit agar timer lebih akurat</p>

    <!-- Buttons -->
    <div class="flex gap-3">
      <button id="btn-cancel"
        class="flex-1 py-3.5 rounded-full text-sm font-medium cursor-pointer border-none transition-all hover:opacity-75"
        style="background:rgba(0,0,0,0.06); color:#6b6860">
        Batal
      </button>
      <button id="btn-save"
        class="flex-[2] py-3.5 rounded-full text-white text-sm font-semibold cursor-pointer border-none transition-all hover:opacity-88 active:scale-[0.98]"
        style="background: linear-gradient(135deg, #c8826a, #d4956a); box-shadow: 0 4px 16px rgba(200,130,106,0.35)">
        Simpan
      </button>
    </div>
  `

  document.body.appendChild(backdrop)
  document.body.appendChild(sheet)

  // Animate in
  requestAnimationFrame(() => {
    sheet.style.transform = 'translateY(0)'
  })

  function close() {
    sheet.style.transform = 'translateY(100%)'
    backdrop.style.opacity = '0'
    backdrop.style.transition = 'opacity 0.25s ease'
    setTimeout(() => {
      sheet.remove()
      backdrop.remove()
    }, 300)
  }

  backdrop.addEventListener('click', close)
  sheet.querySelector('#btn-close')!.addEventListener('click', close)
  sheet.querySelector('#btn-cancel')!.addEventListener('click', close)

  sheet.querySelector('#btn-save')!.addEventListener('click', async () => {
    const val = (sheet.querySelector('#dt-input') as HTMLInputElement).value
    if (!val) { showToast('Pilih tanggal dan waktu dulu', 'error'); return }

    const saveBtn = sheet.querySelector('#btn-save') as HTMLButtonElement
    saveBtn.disabled = true
    saveBtn.textContent = 'Menyimpan...'

    try {
      const iso = new Date(val).toISOString()
      await setRelationshipStart(user!.id, iso)
      const { user: u } = getState()
      setState({ user: { ...u!, relationship_start: iso } })
      showToast('Tanggal tersimpan ♡', 'success')
      close()
      onSaved()
    } catch {
      showToast('Gagal menyimpan', 'error')
      saveBtn.disabled = false
      saveBtn.textContent = 'Simpan'
    }
  })
}

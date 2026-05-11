import { getMyProfile } from '../lib/auth'
import { getMyInviteCode, refreshInviteCode, linkCouple, setRelationshipStart } from '../lib/couple'
import { setState, getState } from '../store/state'
import { getPartnerProfile } from '../lib/auth'
import { navigate } from '../router'
import { showToast } from '../components/toast'
import { todayISO } from '../lib/date-utils'

type Step = 'choice' | 'invite' | 'connect' | 'date'

export async function renderOnboarding(): Promise<HTMLElement> {
  const page = document.createElement('div')
  page.className = 'min-h-dvh flex flex-col justify-center px-6 pb-12 pt-safe-12 bg-bg'

  const user = getState().user!
  let step: Step = 'choice'
  let inviteData = await getMyInviteCode(user.id)

  const isCodeExpired = !inviteData.expiresAt || new Date(inviteData.expiresAt) < new Date()

  async function build() {
    page.innerHTML = ''

    if (step === 'choice') {
      page.innerHTML = `
        <div class="mb-10">
          <h2 class="font-display text-3xl text-ink mb-2">Halo, ${user.name} 👋</h2>
          <p class="text-sm text-ink-muted">Hubungkan akun kamu dengan partner, atau lanjut dulu tanpa partner.</p>
        </div>
        <div class="flex flex-col gap-3">
          <button id="btn-invite" class="w-full py-4 rounded-2xl bg-ink text-bg text-sm font-medium hover:opacity-80 active:scale-[0.98] transition-all">
            Tampilkan kode inviteku
          </button>
          <button id="btn-connect" class="w-full py-4 rounded-2xl border border-border text-ink text-sm font-medium hover:bg-surface-2 active:scale-[0.98] transition-all">
            Masukkan kode dari partner
          </button>
          <button id="btn-skip" class="w-full py-3 text-sm text-ink-muted hover:text-ink transition-colors cursor-pointer border-none bg-transparent mt-2">
            Lewati dulu →
          </button>
        </div>
      `
      page.querySelector('#btn-invite')!.addEventListener('click',  () => { step = 'invite';  build() })
      page.querySelector('#btn-connect')!.addEventListener('click', () => { step = 'connect'; build() })
      page.querySelector('#btn-skip')!.addEventListener('click', () => {
        localStorage.setItem('skip_onboarding', '1')
        navigate('/')
      })
    }

    else if (step === 'invite') {
      const needsRefresh = isCodeExpired || inviteData.used

      if (needsRefresh) {
        inviteData.code = await refreshInviteCode()
      }

      page.innerHTML = `
        <button id="btn-back" class="flex items-center gap-2 text-sm text-ink-muted mb-8 cursor-pointer border-none bg-transparent">
          ← Kembali
        </button>
        <div class="mb-6">
          <h2 class="font-display text-2xl text-ink mb-2">Kode Invite Kamu</h2>
          <p class="text-sm text-ink-muted">Share kode ini ke ${'—'} partner kamu harus daftar dulu, lalu masukkan kode ini.</p>
        </div>

        <div class="bg-surface-2 rounded-2xl p-8 text-center mb-6">
          <p class="font-mono text-2xl font-semibold tracking-[0.2em] text-ink select-all">${inviteData.code}</p>
          <p class="text-xs text-ink-muted mt-3">Berlaku 24 jam · Sekali pakai</p>
        </div>

        <div class="flex flex-col gap-3">
          <button id="btn-copy" class="w-full py-3.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-h active:scale-[0.98] transition-all">
            Salin Kode
          </button>
          <button id="btn-refresh" class="w-full py-3.5 rounded-full border border-border text-ink text-sm font-medium hover:bg-surface-2 active:scale-[0.98] transition-all">
            Reload (cek apakah partner sudah connect)
          </button>
        </div>
      `
      page.querySelector('#btn-back')!.addEventListener('click', () => { step = 'choice'; build() })
      page.querySelector('#btn-copy')!.addEventListener('click', async () => {
        await navigator.clipboard.writeText(inviteData.code)
        showToast('Kode disalin!', 'success')
      })
      page.querySelector('#btn-refresh')!.addEventListener('click', () => window.location.reload())
    }

    else if (step === 'connect') {
      page.innerHTML = `
        <button id="btn-back" class="flex items-center gap-2 text-sm text-ink-muted mb-8 cursor-pointer border-none bg-transparent">
          ← Kembali
        </button>
        <div class="mb-8">
          <h2 class="font-display text-2xl text-ink mb-2">Masukkan Kode</h2>
          <p class="text-sm text-ink-muted">Minta kode invite dari partner kamu.</p>
        </div>
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-ink" for="code-input">Kode Invite Partner</label>
            <input id="code-input" class="field font-mono text-xl text-center tracking-[0.15em] uppercase"
              type="text" placeholder="abc123..." maxlength="32" autocomplete="off" autocapitalize="none" />
          </div>
          <p id="connect-error" class="text-sm text-danger hidden"></p>
          <button id="btn-link" class="w-full py-3.5 rounded-full bg-ink text-bg text-sm font-medium hover:opacity-80 active:scale-[0.98] transition-all disabled:opacity-40">
            Hubungkan
          </button>
        </div>
      `
      page.querySelector('#btn-back')!.addEventListener('click', () => { step = 'choice'; build() })

      const linkBtn = page.querySelector('#btn-link') as HTMLButtonElement
      const errEl   = page.querySelector('#connect-error') as HTMLElement

      linkBtn.addEventListener('click', async () => {
        const code = (page.querySelector('#code-input') as HTMLInputElement).value.trim()
        if (!code) return
        linkBtn.disabled = true
        linkBtn.textContent = 'Menghubungkan...'
        errEl.classList.add('hidden')

        try {
          const coupleId  = await linkCouple(code)
          const updated   = await getMyProfile()
          const partner   = updated?.partner_id ? await getPartnerProfile(updated.partner_id) : null
          setState({ user: updated, partner, couple_id: coupleId })
          step = 'date'
          build()
        } catch (err: unknown) {
          errEl.textContent = err instanceof Error ? err.message : 'Gagal menghubungkan'
          errEl.classList.remove('hidden')
          linkBtn.disabled = false
          linkBtn.textContent = 'Hubungkan'
        }
      })
    }

    else if (step === 'date') {
      const { user: updatedUser } = getState()
      const partnerName = getState().partner?.name ?? 'partner'

      page.innerHTML = `
        <div class="text-center mb-10">
          <div class="text-4xl mb-4">🌸</div>
          <h2 class="font-display text-2xl text-ink mb-2">Yeay, kalian terhubung!</h2>
          <p class="text-sm text-ink-muted">Kamu dan ${partnerName} sekarang sudah terhubung.<br>Kapan kalian mulai bersama?</p>
        </div>
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-ink" for="date-input">Tanggal mulai bersama</label>
            <input id="date-input" class="field" type="date" max="${todayISO()}" value="${updatedUser?.relationship_start ?? ''}" />
          </div>
          <button id="btn-save" class="w-full py-3.5 rounded-full bg-ink text-bg text-sm font-medium hover:opacity-80 active:scale-[0.98] transition-all disabled:opacity-40">
            Simpan & Mulai
          </button>
          <button id="btn-skip" class="w-full py-3.5 rounded-full border border-border text-ink-muted text-sm font-medium hover:bg-surface-2 active:scale-[0.98] transition-all">
            Lewati dulu
          </button>
        </div>
      `

      const saveBtn = page.querySelector('#btn-save') as HTMLButtonElement

      async function finish(date?: string) {
        saveBtn.disabled = true
        if (date && updatedUser) await setRelationshipStart(updatedUser.id, date)
        navigate('/')
        window.location.reload()
      }

      saveBtn.addEventListener('click', async () => {
        const date = (page.querySelector('#date-input') as HTMLInputElement).value
        await finish(date || undefined)
      })
      page.querySelector('#btn-skip')!.addEventListener('click', () => finish())
    }
  }

  await build()
  return page
}

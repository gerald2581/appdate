import { signIn, signUp } from '../lib/auth'
import { navigate } from '../router'

export function renderAuth(): HTMLElement {
  const page = document.createElement('div')
  page.className = 'min-h-dvh flex flex-col justify-center px-5 py-12'

  let isLogin = true

  function build() {
    page.innerHTML = `
      <!-- Logo -->
      <div class="text-center mb-10">
        <h1 class="font-display text-5xl text-ink mb-2" style="letter-spacing:-0.01em">AppDate</h1>
        <p class="text-sm text-ink-muted">Ruang privat kita berdua</p>
      </div>

      <!-- Glass card form -->
      <div class="glass-strong px-6 py-7">

        <!-- Tab toggle -->
        <div class="flex rounded-full p-1 mb-6" style="background:rgba(0,0,0,0.06)">
          <button id="tab-login"
            class="flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border-none"
            style="${isLogin
              ? 'background:rgba(255,255,255,0.9); color:#1a1916; box-shadow:0 2px 8px rgba(0,0,0,0.1)'
              : 'background:transparent; color:#9a9088'}">
            Masuk
          </button>
          <button id="tab-signup"
            class="flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border-none"
            style="${!isLogin
              ? 'background:rgba(255,255,255,0.9); color:#1a1916; box-shadow:0 2px 8px rgba(0,0,0,0.1)'
              : 'background:transparent; color:#9a9088'}">
            Daftar
          </button>
        </div>

        <form id="auth-form" class="flex flex-col gap-4" novalidate>
          ${!isLogin ? `
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-medium text-ink-muted uppercase tracking-wider" for="name">Nama</label>
              <input id="name" class="field" type="text" placeholder="Nama kamu" autocomplete="name" required />
            </div>
          ` : ''}

          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-medium text-ink-muted uppercase tracking-wider" for="email">Email</label>
            <input id="email" class="field" type="email" placeholder="email@kamu.com" autocomplete="email" required />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-medium text-ink-muted uppercase tracking-wider" for="password">Password</label>
            <input id="password" class="field" type="password" placeholder="••••••••"
              autocomplete="${isLogin ? 'current-password' : 'new-password'}" required minlength="8" />
          </div>

          <p id="auth-error" class="text-sm hidden rounded-xl px-3 py-2" style="background:rgba(200,120,120,0.12); color:#b85a5a"></p>

          <button id="auth-submit" type="submit"
            class="w-full py-3.5 rounded-full text-white text-sm font-semibold border-none cursor-pointer
                   hover:opacity-88 active:scale-[0.98] transition-all mt-1 disabled:opacity-50"
            style="background: linear-gradient(135deg, #c8826a 0%, #d4956a 100%); box-shadow: 0 4px 20px rgba(200,130,106,0.35)">
            ${isLogin ? 'Masuk' : 'Buat Akun'}
          </button>
        </form>
      </div>
    `

    page.querySelector('#tab-login')!.addEventListener('click', () => { isLogin = true;  build() })
    page.querySelector('#tab-signup')!.addEventListener('click', () => { isLogin = false; build() })

    const form      = page.querySelector('#auth-form') as HTMLFormElement
    const submitBtn = page.querySelector('#auth-submit') as HTMLButtonElement
    const errorEl   = page.querySelector('#auth-error') as HTMLElement

    form.addEventListener('submit', async e => {
      e.preventDefault()
      submitBtn.disabled = true
      submitBtn.textContent = '...'
      errorEl.classList.add('hidden')

      const email    = (page.querySelector('#email') as HTMLInputElement).value.trim()
      const password = (page.querySelector('#password') as HTMLInputElement).value

      try {
        if (isLogin) {
          await signIn(email, password)
          window.location.reload()
        } else {
          const name = (page.querySelector('#name') as HTMLInputElement).value.trim()
          if (!name) throw new Error('Nama tidak boleh kosong')
          await signUp(email, password, name)
          navigate('/onboarding')
          window.location.reload()
        }
      } catch (err: unknown) {
        errorEl.textContent = err instanceof Error ? err.message : 'Terjadi kesalahan'
        errorEl.classList.remove('hidden')
        submitBtn.disabled = false
        submitBtn.textContent = isLogin ? 'Masuk' : 'Buat Akun'
      }
    })
  }

  build()
  return page
}

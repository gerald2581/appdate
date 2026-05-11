import './styles/main.css'

import { supabase } from './lib/supabase'
import { getMyProfile, getPartnerProfile } from './lib/auth'
import { setState } from './store/state'
import { initRouter, registerRoute, navigate } from './router'
import { renderAuth }       from './pages/auth'
import { renderOnboarding } from './pages/onboarding'

// ── Lazy page imports (keep bundle small) ──────────────────────
const pages = {
  home:        () => import('./pages/home').then(m => m.renderHome()),
  timeline:    () => import('./pages/timeline').then(m => m.renderTimeline()),
  timelineAdd: () => import('./pages/timeline-add').then(m => m.renderTimelineAdd()),
  planner:     () => import('./pages/planner').then(m => m.renderPlanner()),
  plannerAdd:  () => import('./pages/planner-add').then(m => m.renderPlannerAdd()),
  chat:        () => import('./pages/chat').then(m => m.renderChat()),
  location:    () => import('./pages/location').then(m => m.renderLocation()),
  settings:    () => import('./pages/settings').then(m => m.renderSettings()),
}

// ── Routes ─────────────────────────────────────────────────────
registerRoute('/auth',          renderAuth)
registerRoute('/onboarding',    renderOnboarding)
registerRoute('/',              pages.home)
registerRoute('/timeline',      pages.timeline)
registerRoute('/timeline/add',  pages.timelineAdd)
registerRoute('/planner',       pages.planner)
registerRoute('/planner/add',   pages.plannerAdd)
registerRoute('/chat',          pages.chat)
registerRoute('/location',      pages.location)
registerRoute('/settings',      pages.settings)
registerRoute('*', () => { navigate('/'); return document.createElement('div') })

// ── Bootstrap ──────────────────────────────────────────────────
async function boot() {
  const app = document.getElementById('app')!

  // Initial loading screen
  app.innerHTML = `
    <div class="flex flex-col items-center justify-center min-h-dvh gap-4 bg-bg">
      <div class="spinner"></div>
    </div>
  `

  try {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      setState({ isLoading: false })
      initRouter(app)
      navigate('/auth')
      return
    }

    const user = await getMyProfile()
    if (!user) {
      // Profile belum ada — kemungkinan register sebelum migrations jalan
      // Sign out lalu arahkan ke register ulang
      await supabase.auth.signOut()
      setState({ isLoading: false })
      initRouter(app)
      navigate('/auth')
      // Tampilkan pesan setelah router render
      setTimeout(() => {
        const msg = document.createElement('p')
        msg.className = 'text-center text-sm text-danger px-6 mt-4'
        msg.textContent = 'Akun lama terdeteksi sebelum setup selesai. Silakan daftar ulang.'
        document.getElementById('app')?.querySelector('.page, div')?.after(msg)
      }, 300)
      return
    }

    const partner = user.partner_id ? await getPartnerProfile(user.partner_id) : null
    setState({ user, partner, couple_id: user.couple_id, isLoading: false })

    initRouter(app)

    const hash = window.location.hash.slice(1)
    const skippedOnboarding = localStorage.getItem('skip_onboarding') === '1'
    if (!user.partner_id && !skippedOnboarding) {
      navigate('/onboarding')
    } else if (!hash || hash === '/auth' || hash === '/onboarding') {
      navigate('/')
    }

  } catch (err: unknown) {
    // Error boundary — show retry screen instead of white screen
    const msg = err instanceof Error ? err.message : 'Terjadi kesalahan'
    app.innerHTML = `
      <div class="flex flex-col items-center justify-center min-h-dvh gap-6 px-8 bg-bg text-center">
        <p class="font-display text-xl text-ink">Gagal memuat</p>
        <p class="text-sm text-ink-muted max-w-xs">${msg}</p>
        <button onclick="window.location.reload()"
          class="px-6 py-3 rounded-full bg-ink text-bg text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer border-none">
          Coba Lagi
        </button>
      </div>
    `
    setState({ isLoading: false, error: msg })
  }
}

// Re-sync state when auth changes (e.g. token refresh, sign out in another tab)
supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_OUT') {
    navigate('/auth')
    window.location.reload()
  }
})

boot()

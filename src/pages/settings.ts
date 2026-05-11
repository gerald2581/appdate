import { supabase } from '../lib/supabase'
import { getState, setState } from '../store/state'
import { renderNav } from '../components/nav'
import { signOut, updateProfile, updatePassword, deleteMyAccount } from '../lib/auth'
import { setRelationshipStart, getMyInviteCode, refreshInviteCode } from '../lib/couple'
import { uploadAvatar, getAvatarUrl } from '../lib/storage'
import { openConfirmModal } from '../components/confirm-modal'
import { showToast } from '../components/toast'
import { navigate } from '../router'
import { daysSince } from '../lib/date-utils'
import { esc } from '../lib/escape'
import type { SpecialDate } from '../types'

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

function nowDatetimeLocal() { return toDatetimeLocal(new Date().toISOString()) }

const TYPE_ICON: Record<string, string> = {
  anniversary: '❤️', birthday: '🎂', event: '✦', custom: '◎',
}

const TYPE_LABEL: Record<string, string> = {
  anniversary: 'Anniversary', birthday: 'Ulang Tahun', event: 'Event', custom: 'Lainnya',
}

function sectionHeader(label: string) {
  return `
    <div class="flex items-center gap-3 mb-4">
      <div class="w-[3px] h-4 rounded-full flex-shrink-0" style="background: linear-gradient(180deg,#c8826a,#d4956a)"></div>
      <p class="text-[11px] uppercase tracking-[0.18em] font-semibold" style="color:#c8826a">${label}</p>
    </div>
  `
}


export async function renderSettings(): Promise<HTMLElement> {
  const wrapper = document.createElement('div')
  const { user, partner, couple_id } = getState()
  if (!user) return wrapper

  const [sdsRes, inviteData, avatarUrl] = await Promise.all([
    supabase.from('special_dates').select('*').eq('couple_id', couple_id ?? '').order('date'),
    !couple_id ? getMyInviteCode(user.id).catch(() => null) : Promise.resolve(null),
    user.avatar_url ? getAvatarUrl(user.avatar_url).catch(() => null) : Promise.resolve(null),
  ])

  const specialDates = (sdsRes.data ?? []) as SpecialDate[]
  const days = user.relationship_start ? daysSince(user.relationship_start) : null

  wrapper.innerHTML = `
    <div class="min-h-dvh pb-[calc(64px+2rem)]">

      <!-- ── PAGE HEADER ───────────────────────────────────── -->
      <div class="px-5 pt-safe-10 pb-5">
        <p class="text-[10px] uppercase tracking-[0.25em] font-medium mb-1" style="color:#c8826a">AppDate</p>
        <h1 class="font-display text-3xl" style="color:#1a1916">Pengaturan</h1>
      </div>

      <!-- ── 1. PROFIL HERO ────────────────────────────────── -->
      <div class="px-4 mb-5">
        <div class="glass-strong overflow-hidden">

          <!-- Avatar strip -->
          <div class="relative px-6 pt-6 pb-5 flex items-center gap-5"
               style="background: linear-gradient(135deg, rgba(200,130,106,0.08) 0%, rgba(200,130,106,0.03) 100%)">

            <!-- Avatar -->
            <label for="avatar-input" class="relative cursor-pointer flex-shrink-0">
              <div id="avatar-display"
                class="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-semibold select-none overflow-hidden"
                style="background: linear-gradient(135deg,#c8826a,#d4956a); box-shadow: 0 8px 24px rgba(200,130,106,0.4)">
                ${avatarUrl
                  ? `<img src="${esc(avatarUrl)}" class="w-full h-full object-cover" />`
                  : esc(user.name.charAt(0).toUpperCase())
                }
              </div>
              <!-- Edit badge -->
              <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center shadow-md"
                   style="background:#c8826a; border:2px solid white">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <input id="avatar-input" type="file" accept="image/*" class="hidden" />
            </label>

            <!-- Name + email -->
            <div class="flex-1 min-w-0">
              <input id="profile-name"
                class="w-full bg-transparent border-none outline-none font-display text-xl font-semibold leading-tight mb-1 p-0"
                style="color:#1a1916; border-bottom: 1.5px solid rgba(200,130,106,0.2); padding-bottom: 4px;"
                value="${esc(user.name)}" maxlength="50" />
              <p id="user-email" class="text-xs truncate" style="color:#9a9088">Memuat...</p>
            </div>
          </div>

          <!-- Save button -->
          <div class="px-6 pb-6">
            <button id="btn-save-name"
              class="w-full py-3 rounded-xl text-white text-sm font-semibold border-none cursor-pointer transition-all hover:opacity-88 active:scale-[0.98]"
              style="background: linear-gradient(135deg,#c8826a,#d4956a); box-shadow:0 4px 16px rgba(200,130,106,0.35)">
              Simpan Profil
            </button>
          </div>
        </div>
      </div>

      <!-- ── 2. HUBUNGAN ───────────────────────────────────── -->
      <div class="px-4 mb-5">
        ${sectionHeader('Hubungan')}
        <div class="glass p-5 flex flex-col gap-4">

          <!-- Partner card -->
          ${partner ? `
            <div class="flex items-center gap-3 rounded-2xl px-4 py-3.5"
                 style="background: linear-gradient(135deg,rgba(122,158,200,0.12),rgba(122,158,200,0.06)); border:1px solid rgba(122,158,200,0.2)">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 text-sm"
                   style="background: linear-gradient(135deg,#7a9ec8,#8badd4); box-shadow:0 4px 12px rgba(122,158,200,0.35)">
                ${esc(partner.name.charAt(0).toUpperCase())}
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold" style="color:#1a1916">${esc(partner.name)}</p>
                <p class="text-xs" style="color:#9a9088">Partner kamu ♡</p>
              </div>
              <div class="w-2 h-2 rounded-full" style="background:#6ab87a; box-shadow:0 0 6px rgba(106,184,122,0.5)"></div>
            </div>
          ` : inviteData?.code ? `
            <!-- Invite code card -->
            <div class="rounded-2xl px-5 py-4 text-center"
                 style="background: linear-gradient(135deg,rgba(200,130,106,0.1),rgba(212,149,106,0.06)); border:1.5px dashed rgba(200,130,106,0.35)">
              <p class="text-[10px] uppercase tracking-[0.15em] font-medium mb-2" style="color:#9a9088">Kode Invite Kamu</p>
              <p class="font-display text-3xl font-bold tracking-[0.3em] mb-3" style="color:#c8826a">
                ${inviteData.code.toUpperCase()}
              </p>
              <div class="flex gap-2 justify-center">
                <button id="btn-copy-code"
                  class="px-4 py-1.5 rounded-full text-xs font-semibold border-none cursor-pointer"
                  style="background:#c8826a; color:white">
                  Salin
                </button>
                <button id="btn-refresh-code"
                  class="px-4 py-1.5 rounded-full text-xs font-medium border-none cursor-pointer"
                  style="background:rgba(0,0,0,0.06); color:#9a9088">
                  Perbarui
                </button>
              </div>
            </div>
          ` : `
            <div class="rounded-2xl px-4 py-4 text-center" style="background:rgba(200,130,106,0.07)">
              <p class="text-sm text-ink-muted mb-2">Belum terhubung dengan partner</p>
              <button id="btn-go-onboarding"
                class="text-xs font-semibold border-none bg-transparent cursor-pointer" style="color:#c8826a">
                Hubungkan sekarang →
              </button>
            </div>
          `}

          <!-- Relationship datetime -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-xs font-semibold uppercase tracking-wider" style="color:#9a9088">
                Mulai Bersama
              </label>
              ${days !== null ? `
                <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                      style="background:rgba(200,130,106,0.12); color:#c8826a">
                  ${days} hari ♡
                </span>
              ` : ''}
            </div>
            <input id="rel-datetime" type="datetime-local"
              class="field text-sm"
              value="${toDatetimeLocal(user.relationship_start)}"
              max="${nowDatetimeLocal()}" />
            <p class="text-[11px] mt-1.5" style="color:#b0a8a0">Atur jam agar timer di home akurat</p>
          </div>

          <button id="btn-save-rel"
            class="w-full py-3 rounded-xl text-white text-sm font-semibold border-none cursor-pointer transition-all hover:opacity-88 active:scale-[0.98]"
            style="background: linear-gradient(135deg,#c8826a,#d4956a); box-shadow:0 4px 16px rgba(200,130,106,0.3)">
            Simpan Tanggal
          </button>
        </div>
      </div>

      <!-- ── 3. TANGGAL SPESIAL ────────────────────────────── -->
      <div class="px-4 mb-5">
        <div class="flex items-center justify-between mb-4">
          ${sectionHeader('Tanggal Spesial')}
          <button id="btn-show-add-sd"
            class="flex items-center gap-1.5 text-xs font-semibold border-none bg-transparent cursor-pointer -mt-4 px-3 py-1.5 rounded-full transition-all"
            style="color:#c8826a; background:rgba(200,130,106,0.1)">
            <span style="font-size:14px; line-height:1">+</span> Tambah
          </button>
        </div>

        <!-- Add form -->
        <div id="add-sd-form" class="hidden mb-3">
          <div class="glass p-4 mb-3" style="border-color:rgba(200,130,106,0.25)">
            <p class="text-xs font-semibold uppercase tracking-wider mb-3" style="color:#9a9088">Tanggal Baru</p>
            <div class="flex flex-col gap-2.5">
              <input id="sd-title" class="field py-2.5 text-sm"
                type="text" placeholder="Nama (mis. Anniversary pertama)" maxlength="100" />
              <div class="grid grid-cols-2 gap-2">
                <input id="sd-date" class="field py-2.5 text-sm" type="date" />
                <select id="sd-type" class="field py-2.5 text-sm">
                  <option value="anniversary">Anniversary</option>
                  <option value="birthday">Ulang Tahun</option>
                  <option value="event">Event</option>
                  <option value="custom">Lainnya</option>
                </select>
              </div>
              <label class="flex items-center gap-2.5 cursor-pointer px-1">
                <input id="sd-recurring" type="checkbox" checked class="accent-[#c8826a] w-4 h-4" />
                <span class="text-xs" style="color:#6b6860">Ulangi tiap tahun</span>
              </label>
              <div class="flex gap-2 pt-1">
                <button id="btn-cancel-sd"
                  class="flex-1 py-2.5 rounded-xl text-sm cursor-pointer border-none font-medium transition-all hover:opacity-75"
                  style="background:rgba(0,0,0,0.06); color:#6b6860">
                  Batal
                </button>
                <button id="btn-save-sd"
                  class="flex-[2] py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer border-none transition-all hover:opacity-85"
                  style="background: linear-gradient(135deg,#c8826a,#d4956a)">
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Date list -->
        ${specialDates.length === 0 ? `
          <div class="glass px-5 py-8 text-center">
            <p class="text-3xl mb-3 opacity-20">◎</p>
            <p class="text-sm font-medium" style="color:#6b6860">Belum ada tanggal spesial</p>
            <p class="text-xs mt-1" style="color:#9a9088">Tambahkan anniversary, ulang tahun, dll.</p>
          </div>
        ` : `
          <div class="glass overflow-hidden">
            ${specialDates.map((sd, i) => `
              <div class="flex items-center gap-3.5 px-4 py-3.5 ${i < specialDates.length - 1 ? 'border-b' : ''}"
                   style="${i < specialDates.length - 1 ? 'border-color:rgba(0,0,0,0.05)' : ''}">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                     style="background:rgba(200,130,106,0.1)">
                  ${TYPE_ICON[sd.type] ?? '◎'}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold leading-none mb-1" style="color:#1a1916">${esc(sd.title)}</p>
                  <div class="flex items-center gap-2">
                    <p class="text-xs" style="color:#9a9088">
                      ${new Date(sd.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
                    </p>
                    ${sd.recurring ? `
                      <span class="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                            style="background:rgba(200,130,106,0.1); color:#c8826a">↻ tiap tahun</span>
                    ` : ''}
                  </div>
                </div>
                <div class="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0" style="color:#9a9088; background:rgba(0,0,0,0.04)">
                  ${TYPE_LABEL[sd.type] ?? 'Lainnya'}
                </div>
                <button data-delete-sd="${esc(sd.id)}"
                  class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border-none cursor-pointer transition-opacity hover:opacity-60"
                  style="background:rgba(200,100,100,0.1); color:#c87878; font-size:16px; line-height:1">×</button>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- ── 4. AKUN ─────────────────────────────────────── -->
      <div class="px-4 mb-5">
        ${sectionHeader('Akun')}

        <!-- Password section -->
        <div class="glass p-5 mb-3">
          <p class="text-xs font-semibold uppercase tracking-wider mb-3" style="color:#9a9088">Ganti Password</p>
          <div class="flex flex-col gap-2">
            <input id="new-password" class="field py-2.5 text-sm"
              type="password" placeholder="Password baru (min. 8 karakter)" minlength="8" />
            <input id="confirm-password" class="field py-2.5 text-sm"
              type="password" placeholder="Ulangi password baru" />
          </div>
          <button id="btn-change-password"
            class="w-full mt-3 py-2.5 rounded-xl text-sm font-semibold cursor-pointer border-none transition-all hover:opacity-85"
            style="background:rgba(122,158,200,0.15); color:#4a6e90; border:1px solid rgba(122,158,200,0.3)">
            Update Password
          </button>
        </div>

        <!-- Action rows -->
        <div class="glass overflow-hidden">
          <!-- Logout -->
          <button id="btn-logout"
            class="w-full flex items-center gap-4 px-5 py-4 border-none bg-transparent cursor-pointer text-left transition-all hover:opacity-80"
            style="border-bottom: 1px solid rgba(0,0,0,0.05)">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                 style="background:rgba(200,100,100,0.1)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c85050" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-semibold" style="color:#c85050">Keluar dari Akun</p>
              <p class="text-xs" style="color:#9a9088">Perlu login kembali setelah ini</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8d0d8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>

          <!-- Delete account -->
          <button id="btn-delete-account"
            class="w-full flex items-center gap-4 px-5 py-4 border-none bg-transparent cursor-pointer text-left transition-all hover:opacity-80">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                 style="background:rgba(180,80,80,0.08)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b85050" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium" style="color:#a06060">Hapus Akun</p>
              <p class="text-xs" style="color:#9a9088">Hapus semua data secara permanen</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c8d0d8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        <!-- App version -->
        <p class="text-center text-[10px] mt-5" style="color:#c8c0b8">AppDate · v1.0 · Made with ♡</p>
      </div>

    </div>
  `

  // ── Event handlers ────────────────────────────────────────

  supabase.auth.getUser().then(({ data }) => {
    const el = wrapper.querySelector('#user-email')
    if (el && data.user) el.textContent = data.user.email ?? '—'
  })

  // Avatar upload
  const avatarInput = wrapper.querySelector('#avatar-input') as HTMLInputElement
  avatarInput.addEventListener('change', async () => {
    const file = avatarInput.files?.[0]
    if (!file) return
    try {
      const path = await uploadAvatar(user.id, file)
      await supabase.from('profiles').update({ avatar_url: path }).eq('id', user.id)
      setState({ user: { ...user, avatar_url: path } })
      const display = wrapper.querySelector('#avatar-display') as HTMLElement
      const url = URL.createObjectURL(file)
      display.innerHTML = `<img src="${url}" class="w-full h-full object-cover" />`
      showToast('Foto profil diperbarui!', 'success')
    } catch { showToast('Gagal upload foto', 'error') }
  })

  // Save name
  wrapper.querySelector('#btn-save-name')!.addEventListener('click', async () => {
    const name = (wrapper.querySelector('#profile-name') as HTMLInputElement).value.trim()
    if (!name) { showToast('Nama tidak boleh kosong', 'error'); return }
    await updateProfile(user.id, { name })
    setState({ user: { ...user, name } })
    showToast('Profil tersimpan ✓', 'success')
  })

  // Invite code
  wrapper.querySelector('#btn-copy-code')?.addEventListener('click', async () => {
    await navigator.clipboard.writeText(inviteData?.code?.toUpperCase() ?? '').catch(() => null)
    showToast('Kode disalin!', 'success')
  })

  wrapper.querySelector('#btn-refresh-code')?.addEventListener('click', async () => {
    try {
      await refreshInviteCode()
      showToast('Kode diperbarui', 'success')
      const fresh = await renderSettings()
      wrapper.replaceWith(fresh)
    } catch { showToast('Gagal memperbarui kode', 'error') }
  })

  wrapper.querySelector('#btn-go-onboarding')?.addEventListener('click', () => {
    localStorage.removeItem('skip_onboarding')
    navigate('/onboarding')
  })

  // Save relationship datetime
  wrapper.querySelector('#btn-save-rel')!.addEventListener('click', async () => {
    const val = (wrapper.querySelector('#rel-datetime') as HTMLInputElement).value
    if (!val) { showToast('Pilih tanggal dan waktu', 'error'); return }
    const iso = new Date(val).toISOString()
    await setRelationshipStart(user.id, iso)
    setState({ user: { ...user, relationship_start: iso } })
    showToast('Tanggal tersimpan ♡', 'success')
    const fresh = await renderSettings()
    wrapper.replaceWith(fresh)
  })

  // Toggle add-form
  const addSdForm = wrapper.querySelector('#add-sd-form') as HTMLElement
  wrapper.querySelector('#btn-show-add-sd')!.addEventListener('click', () =>
    addSdForm.classList.toggle('hidden')
  )
  wrapper.querySelector('#btn-cancel-sd')!.addEventListener('click', () =>
    addSdForm.classList.add('hidden')
  )

  // Save special date
  wrapper.querySelector('#btn-save-sd')!.addEventListener('click', async () => {
    if (!couple_id) return
    const title     = (wrapper.querySelector('#sd-title') as HTMLInputElement).value.trim()
    const date      = (wrapper.querySelector('#sd-date') as HTMLInputElement).value
    const type      = (wrapper.querySelector('#sd-type') as HTMLSelectElement).value
    const recurring = (wrapper.querySelector('#sd-recurring') as HTMLInputElement).checked
    if (!title || !date) { showToast('Isi nama dan tanggal', 'error'); return }
    const { error } = await supabase.from('special_dates').insert({ couple_id, title, date, type, recurring })
    if (error) { showToast('Gagal menyimpan', 'error'); return }
    showToast('Tanggal spesial ditambahkan!', 'success')
    const fresh = await renderSettings()
    wrapper.replaceWith(fresh)
  })

  // Delete special date
  wrapper.querySelectorAll('[data-delete-sd]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.deleteSd!
      openConfirmModal({
        title: 'Hapus Tanggal Spesial?',
        message: 'Tanggal ini akan dihapus permanen.',
        confirmLabel: 'Hapus',
        danger: true,
        onConfirm: async () => {
          await supabase.from('special_dates').delete().eq('id', id)
          showToast('Dihapus', 'default')
          const fresh = await renderSettings()
          wrapper.replaceWith(fresh)
        },
      })
    })
  })

  // Change password
  wrapper.querySelector('#btn-change-password')!.addEventListener('click', async () => {
    const np = (wrapper.querySelector('#new-password') as HTMLInputElement).value
    const cp = (wrapper.querySelector('#confirm-password') as HTMLInputElement).value
    if (np.length < 6) { showToast('Password min. 6 karakter', 'error'); return }
    if (np !== cp)     { showToast('Password tidak cocok', 'error'); return }
    try {
      await updatePassword(np)
      ;(wrapper.querySelector('#new-password') as HTMLInputElement).value = ''
      ;(wrapper.querySelector('#confirm-password') as HTMLInputElement).value = ''
      showToast('Password berhasil diubah ✓', 'success')
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Gagal ganti password', 'error')
    }
  })

  // Logout
  wrapper.querySelector('#btn-logout')!.addEventListener('click', () => {
    openConfirmModal({
      title: 'Keluar dari Akun?',
      message: 'Kamu akan keluar dan perlu login kembali.',
      confirmLabel: 'Keluar',
      onConfirm: async () => {
        await signOut()
        navigate('/auth')
        window.location.reload()
      },
    })
  })

  // Delete account
  wrapper.querySelector('#btn-delete-account')!.addEventListener('click', () => {
    openConfirmModal({
      title: 'Hapus Akun?',
      message: 'Semua data kamu — kenangan, chat, rencana — akan dihapus permanen. Aksi ini tidak bisa dibatalkan.',
      confirmLabel: 'Hapus Akun Saya',
      danger: true,
      onConfirm: async () => {
        await deleteMyAccount()
        navigate('/auth')
        window.location.reload()
      },
    })
  })

  wrapper.appendChild(renderNav())
  return wrapper
}

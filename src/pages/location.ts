import L from 'leaflet'
import { supabase } from '../lib/supabase'
import { getState } from '../store/state'
import { renderNav } from '../components/nav'
import { startSharingLocation } from '../lib/geo'
import { showToast } from '../components/toast'
import type { LocationRecord } from '../types'
import type { RealtimeChannel } from '@supabase/supabase-js'

const DEFAULT_CENTER: [number, number] = [-6.2, 106.816] // Jakarta

export async function renderLocation(): Promise<HTMLElement> {
  const wrapper = document.createElement('div')
  const { user, partner, couple_id } = getState()
  if (!user || !couple_id) return wrapper

  const { data: locs } = await supabase
    .from('locations')
    .select('*')
    .in('user_id', [user.id, partner?.id].filter(Boolean) as string[])

  const myLoc      = (locs ?? []).find((l: LocationRecord) => l.user_id === user.id)
  const partnerLoc = (locs ?? []).find((l: LocationRecord) => l.user_id === partner?.id)

  let isSharing = myLoc?.is_sharing ?? false
  let stopFn: (() => void) | null = null

  const myInitial      = user.name.charAt(0).toUpperCase()
  const partnerInitial = partner ? partner.name.charAt(0).toUpperCase() : '?'
  const myFirst        = user.name.split(' ')[0]
  const partnerFirst   = partner ? partner.name.split(' ')[0] : 'Partner'

  wrapper.innerHTML = `
    <div class="flex flex-col bg-bg" style="height:100dvh">

      <!-- Header -->
      <div class="flex-shrink-0 bg-surface border-b border-border px-4 z-10">
        <div class="flex justify-between items-center h-14">

          <!-- Status dots -->
          <div class="flex items-center gap-5">
            <div class="flex items-center gap-1.5">
              <div id="my-dot" class="w-2 h-2 rounded-full transition-colors ${isSharing ? 'bg-success' : 'bg-border'}"></div>
              <span class="text-xs text-ink-muted">${myFirst}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div id="partner-dot" class="w-2 h-2 rounded-full transition-colors ${partnerLoc?.is_sharing ? 'bg-success' : 'bg-border'}"></div>
              <span class="text-xs text-ink-muted">${partnerFirst}</span>
            </div>
          </div>

          <!-- Toggle button -->
          <button id="btn-toggle"
            class="${isSharing ? 'bg-danger' : 'bg-accent'} text-white
                   px-4 py-2 rounded-full text-xs font-medium
                   hover:opacity-85 active:scale-95 transition-all cursor-pointer border-none
                   disabled:opacity-50">
            ${isSharing ? '⏹ Stop' : '◉ Bagikan Lokasi'}
          </button>
        </div>
      </div>

      <!-- Map -->
      <div id="map" class="flex-1 z-0" style="padding-bottom:64px"></div>
    </div>
  `

  requestAnimationFrame(() => {
    const mapEl = wrapper.querySelector('#map') as HTMLElement

    const center: [number, number] =
      myLoc?.is_sharing      ? [myLoc.lat, myLoc.lng] :
      partnerLoc?.is_sharing ? [partnerLoc.lat, partnerLoc.lng] :
      DEFAULT_CENTER

    const map = L.map(mapEl, { zoomControl: true, attributionControl: false }).setView(center, 15)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

    function makeIcon(initial: string, color: string) {
      return L.divIcon({
        html: `<div style="background:${color};color:#fff;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px;border:2.5px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,0.22);">${initial}</div>`,
        className: '', iconSize: [36, 36], iconAnchor: [18, 18],
      })
    }

    let myMarker: L.Marker | null = myLoc?.is_sharing
      ? L.marker([myLoc.lat, myLoc.lng], { icon: makeIcon(myInitial, '#C8A98A') }).addTo(map)
      : null

    let partnerMarker: L.Marker | null = partnerLoc?.is_sharing
      ? L.marker([partnerLoc.lat, partnerLoc.lng], { icon: makeIcon(partnerInitial, '#8CA8C8') }).addTo(map)
      : null

    const toggleBtn = wrapper.querySelector('#btn-toggle') as HTMLButtonElement
    const myDot     = wrapper.querySelector('#my-dot') as HTMLElement

    toggleBtn.addEventListener('click', async () => {
      if (isSharing) {
        stopFn?.()
        stopFn = null
        isSharing = false
        myMarker?.remove(); myMarker = null
        myDot.className = myDot.className.replace('bg-success', 'bg-border')
        toggleBtn.classList.replace('bg-danger', 'bg-accent')
        toggleBtn.textContent = '◉ Bagikan Lokasi'
      } else {
        toggleBtn.disabled = true
        toggleBtn.textContent = 'Meminta izin...'
        try {
          stopFn = await startSharingLocation(user.id, couple_id)
          isSharing = true
          myDot.className = myDot.className.replace('bg-border', 'bg-success')
          toggleBtn.classList.replace('bg-accent', 'bg-danger')
          toggleBtn.textContent = '⏹ Stop'
          showToast('Lokasi sedang dibagikan', 'success')
        } catch (err: unknown) {
          showToast(err instanceof Error ? err.message : 'Tidak bisa akses lokasi', 'error')
        } finally {
          toggleBtn.disabled = false
        }
      }
    })

    // Watch partner location via postgres_changes
    let channel: RealtimeChannel | null = null
    if (partner) {
      channel = supabase.channel(`loc:${couple_id}`)
        .on('postgres_changes', {
          event: '*', schema: 'public', table: 'locations',
          filter: `user_id=eq.${partner.id}`,
        }, payload => {
          const loc = payload.new as LocationRecord
          const pDot = wrapper.querySelector('#partner-dot') as HTMLElement
          if (loc.is_sharing) {
            pDot.className = pDot.className.replace('bg-border', 'bg-success')
            if (partnerMarker) {
              partnerMarker.setLatLng([loc.lat, loc.lng])
            } else {
              partnerMarker = L.marker([loc.lat, loc.lng], { icon: makeIcon(partnerInitial, '#8CA8C8') }).addTo(map)
            }
          } else {
            pDot.className = pDot.className.replace('bg-success', 'bg-border')
            partnerMarker?.remove(); partnerMarker = null
          }
        })
        .subscribe()
    }

    // Cleanup map + channels on unmount
    const obs = new MutationObserver(() => {
      if (!wrapper.isConnected) {
        stopFn?.()
        channel?.unsubscribe()
        map.remove()
        obs.disconnect()
      }
    })
    obs.observe(document.body, { childList: true, subtree: false })
  })

  wrapper.appendChild(renderNav())
  return wrapper
}

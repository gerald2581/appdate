import { supabase } from './supabase'

export interface GeoPos { lat: number; lng: number }

const MIN_DISTANCE_M = 25
const WATCH_MAX_AGE_MS = 30_000

export function getCurrentPosition(): Promise<GeoPos> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation tidak tersedia di browser ini'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => reject(new Error(err.message)),
      { enableHighAccuracy: true, timeout: 10_000 },
    )
  })
}

export async function startSharingLocation(userId: string, coupleId: string): Promise<() => void> {
  const initial = await getCurrentPosition()
  await upsertLocation(userId, coupleId, initial, true)

  let last = initial
  let watchId: number | null = null

  function startWatch() {
    watchId = navigator.geolocation.watchPosition(
      async pos => {
        const next: GeoPos = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        if (distanceM(last, next) >= MIN_DISTANCE_M) {
          last = next
          await upsertLocation(userId, coupleId, next, true)
        }
      },
      undefined,
      { enableHighAccuracy: true, maximumAge: WATCH_MAX_AGE_MS },
    )
  }

  function stopWatch() {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      watchId = null
    }
  }

  startWatch()

  // Pause tracking when tab is hidden to save battery
  function onVisibility() {
    if (document.hidden) {
      stopWatch()
    } else {
      startWatch()
    }
  }
  document.addEventListener('visibilitychange', onVisibility)

  return () => {
    stopWatch()
    document.removeEventListener('visibilitychange', onVisibility)
    upsertLocation(userId, coupleId, last, false)
  }
}

async function upsertLocation(userId: string, coupleId: string, pos: GeoPos, isSharing: boolean) {
  await supabase.from('locations').upsert(
    { user_id: userId, couple_id: coupleId, lat: pos.lat, lng: pos.lng, is_sharing: isSharing, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' },
  )
}

function distanceM(a: GeoPos, b: GeoPos): number {
  const R = 6_371_000
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const sin2 = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(sin2), Math.sqrt(1 - sin2))
}

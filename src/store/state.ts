import type { AppState } from '../types'

type Listener = (state: AppState) => void

const listeners = new Set<Listener>()

let state: AppState = {
  user: null,
  partner: null,
  couple_id: null,
  isLoading: true,
  error: null,
}

export function getState(): Readonly<AppState> {
  return state
}

export function setState(patch: Partial<AppState>) {
  state = { ...state, ...patch }
  listeners.forEach(fn => fn(state))
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

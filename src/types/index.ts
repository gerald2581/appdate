export interface Profile {
  id: string
  name: string
  avatar_url: string | null
  partner_id: string | null
  couple_id: string | null
  relationship_start: string | null // ISO date 'YYYY-MM-DD'
  invite_code: string | null
  invite_expires_at: string | null
  invite_used: boolean
  created_at: string
}

export interface Couple {
  id: string
  user_a: string
  user_b: string
  created_at: string
}

export interface Memory {
  id: string
  couple_id: string
  title: string
  description: string | null
  memory_date: string // ISO date
  type: 'memory' | 'milestone' | 'photo'
  photo_path: string | null // Storage path, NOT public URL
  created_by: string
  created_at: string
}

export interface DatePlan {
  id: string
  couple_id: string
  title: string
  description: string | null
  location: string | null
  planned_date: string | null // ISO datetime
  status: 'planned' | 'done' | 'cancelled'
  budget: number | null
  created_by: string
  created_at: string
}

export interface Message {
  id: string
  couple_id: string
  sender_id: string
  content: string
  type: 'message' | 'note'
  created_at: string
}

export interface LocationRecord {
  id: string
  user_id: string
  couple_id: string
  lat: number
  lng: number
  is_sharing: boolean
  updated_at: string
}

export interface SpecialDate {
  id: string
  couple_id: string
  title: string
  date: string // ISO date
  type: 'anniversary' | 'birthday' | 'event' | 'custom'
  recurring: boolean
  created_at: string
}

export interface AppState {
  user: Profile | null
  partner: Profile | null
  couple_id: string | null
  isLoading: boolean
  error: string | null
}

// Broadcast channel message shape for chat
export interface BroadcastMessage {
  id: string
  sender_id: string
  content: string
  type: 'message' | 'note'
  created_at: string
}

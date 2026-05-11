import { supabase } from './supabase'

export async function getMyInviteCode(userId: string): Promise<{ code: string; expiresAt: string | null; used: boolean }> {
  const { data, error } = await supabase
    .from('profiles')
    .select('invite_code, invite_expires_at, invite_used')
    .eq('id', userId)
    .single()

  if (error) throw error
  return {
    code: data.invite_code ?? '',
    expiresAt: data.invite_expires_at,
    used: data.invite_used,
  }
}

export async function refreshInviteCode(): Promise<string> {
  const { data, error } = await supabase.rpc('refresh_invite_code')
  if (error) throw error
  return data as string
}

export async function linkCouple(inviteCode: string): Promise<string> {
  const { data, error } = await supabase.rpc('link_couple', {
    p_invite_code: inviteCode.toLowerCase().trim(),
  })
  if (error) {
    // Map Postgres exception messages to user-friendly strings
    const msg = error.message ?? ''
    if (msg.includes('invalid_or_expired_code')) throw new Error('Kode tidak valid atau sudah kadaluarsa')
    if (msg.includes('already_linked'))           throw new Error('Akunmu sudah terhubung ke partner')
    if (msg.includes('cannot_link_to_self'))      throw new Error('Tidak bisa connect ke akun sendiri')
    if (msg.includes('partner_already_linked'))   throw new Error('Partner sudah terhubung ke orang lain')
    throw new Error('Gagal menghubungkan akun. Coba lagi.')
  }
  return data as string // couple_id UUID
}

export async function setRelationshipStart(userId: string, date: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ relationship_start: date })
    .eq('id', userId)
  if (error) throw error
}

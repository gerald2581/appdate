import { supabase } from '../lib/supabase'
import { getState } from '../store/state'
import { renderNav } from '../components/nav'
import { formatRelative } from '../lib/date-utils'
import { esc } from '../lib/escape'
import type { Message, BroadcastMessage } from '../types'
import type { RealtimeChannel } from '@supabase/supabase-js'

export async function renderChat(): Promise<HTMLElement> {
  const wrapper = document.createElement('div')
  const { user, partner, couple_id } = getState()
  if (!user || !couple_id) return wrapper

  const { data } = await supabase
    .from('messages')
    .select('*')
    .eq('couple_id', couple_id)
    .order('created_at', { ascending: false })
    .limit(50)

  const history = ((data ?? []) as Message[]).reverse()

  const partnerInitial = partner ? esc(partner.name.charAt(0).toUpperCase()) : '?'
  const partnerName    = esc(partner?.name ?? 'Partner')

  wrapper.innerHTML = `
    <div class="flex flex-col bg-bg" style="height:100dvh">

      <!-- Header -->
      <div class="flex-shrink-0 bg-surface border-b border-border px-4
                  pt-[env(safe-area-inset-top,0px)]">
        <div class="flex items-center gap-3 h-14">
          <div class="w-8 h-8 rounded-full bg-sky flex items-center justify-center
                      text-white text-sm font-semibold flex-shrink-0">
            ${partnerInitial}
          </div>
          <div>
            <p class="text-sm font-semibold text-ink leading-none">${partnerName}</p>
            <p class="text-xs text-ink-muted mt-0.5">Pesan privat</p>
          </div>
        </div>
      </div>

      <!-- Message list -->
      <div id="msg-list" class="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        ${history.length === 0 ? `
          <div class="flex flex-col items-center justify-center h-full text-center py-16">
            <p class="text-4xl mb-4 opacity-20">✉</p>
            <p class="text-sm font-medium text-ink mb-1">Belum ada pesan</p>
            <p class="text-xs text-ink-muted">Kirim pesan pertama ke ${partnerName}</p>
          </div>
        ` : history.map(m => bubble(m.content, m.sender_id === user.id, m.created_at)).join('')}
      </div>

      <!-- Input -->
      <div class="flex-shrink-0 bg-surface border-t border-border px-4 py-3"
           style="padding-bottom:calc(env(safe-area-inset-bottom,0px) + 64px + 0.75rem)">
        <div class="flex gap-2 items-end">
          <textarea id="msg-input"
            class="flex-1 field resize-none overflow-hidden py-2.5 text-[15px] leading-relaxed"
            style="min-height:44px;max-height:128px"
            placeholder="Tulis pesan..."
            rows="1"></textarea>
          <button id="btn-send"
            class="w-11 h-11 rounded-full bg-accent flex items-center justify-center
                   text-white text-lg flex-shrink-0 hover:bg-accent-h active:scale-90
                   transition-all cursor-pointer border-none">
            ↑
          </button>
        </div>
      </div>
    </div>
  `

  const msgList = wrapper.querySelector('#msg-list') as HTMLElement
  const input   = wrapper.querySelector('#msg-input') as HTMLTextAreaElement
  const sendBtn = wrapper.querySelector('#btn-send') as HTMLButtonElement

  // Scroll to latest
  msgList.scrollTop = msgList.scrollHeight

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto'
    input.style.height = Math.min(input.scrollHeight, 128) + 'px'
  })

  let channel: RealtimeChannel | null = null

  function appendBubble(content: string, isMe: boolean, timestamp: string) {
    const div = document.createElement('div')
    div.innerHTML = bubble(content, isMe, timestamp)
    const el = div.firstElementChild
    if (el) {
      msgList.appendChild(el)
      msgList.scrollTop = msgList.scrollHeight
    }
  }

  async function sendMessage() {
    const content = input.value.trim()
    if (!content) return
    input.value = ''
    input.style.height = 'auto'

    const now = new Date().toISOString()

    // Optimistic render
    appendBubble(content, true, now)

    // Broadcast to partner (low-latency, no DB round-trip)
    const broadcastPayload: BroadcastMessage = {
      id: crypto.randomUUID(), sender_id: user!.id, content, type: 'message', created_at: now,
    }
    channel?.send({ type: 'broadcast', event: 'new_message', payload: broadcastPayload })

    // Persist to DB
    await supabase.from('messages').insert({
      couple_id, sender_id: user!.id, content, type: 'message',
    })
  }

  sendBtn.addEventListener('click', sendMessage)
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  })

  // Subscribe to partner's broadcast messages
  channel = supabase.channel(`chat:${couple_id}`)
    .on('broadcast', { event: 'new_message' }, ({ payload }) => {
      const msg = payload as BroadcastMessage
      if (msg.sender_id === user.id) return // already in optimistic UI
      appendBubble(msg.content, false, msg.created_at)
    })
    .subscribe()

  // Cleanup on page unmount
  const obs = new MutationObserver(() => {
    if (!wrapper.isConnected) { channel?.unsubscribe(); obs.disconnect() }
  })
  obs.observe(document.body, { childList: true, subtree: false })

  wrapper.appendChild(renderNav())
  return wrapper
}

function bubble(content: string, isMe: boolean, timestamp: string): string {
  return `
    <div class="flex flex-col gap-1 max-w-[78%] ${isMe ? 'self-end items-end' : 'self-start items-start'}">
      <div class="px-4 py-2.5 text-sm leading-relaxed break-words
                  ${isMe
                    ? 'bg-ink text-bg rounded-2xl rounded-br-sm'
                    : 'bg-surface border border-border text-ink rounded-2xl rounded-bl-sm'
                  }">
        ${esc(content)}
      </div>
      <span class="text-[10px] text-ink-muted px-1">${formatRelative(timestamp)}</span>
    </div>
  `
}

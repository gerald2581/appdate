import{i as e,o as t}from"./router-SnC_tAPp.js";import{r as n}from"./index-BAHrnUkX.js";import{t as r}from"./nav-JQzAyBuE.js";import{t as i}from"./escape-1QVFIIou.js";async function a(){let n=document.createElement(`div`),{user:a,partner:s,couple_id:c}=e();if(!a||!c)return n;let{data:l}=await t.from(`messages`).select(`*`).eq(`couple_id`,c).order(`created_at`,{ascending:!1}).limit(50),u=(l??[]).reverse(),d=s?i(s.name.charAt(0).toUpperCase()):`?`,f=i(s?.name??`Partner`);n.innerHTML=`
    <div class="flex flex-col bg-bg" style="height:100dvh">

      <!-- Header -->
      <div class="flex-shrink-0 bg-surface border-b border-border px-4
                  pt-[env(safe-area-inset-top,0px)]">
        <div class="flex items-center gap-3 h-14">
          <div class="w-8 h-8 rounded-full bg-sky flex items-center justify-center
                      text-white text-sm font-semibold flex-shrink-0">
            ${d}
          </div>
          <div>
            <p class="text-sm font-semibold text-ink leading-none">${f}</p>
            <p class="text-xs text-ink-muted mt-0.5">Pesan privat</p>
          </div>
        </div>
      </div>

      <!-- Message list -->
      <div id="msg-list" class="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        ${u.length===0?`
          <div class="flex flex-col items-center justify-center h-full text-center py-16">
            <p class="text-4xl mb-4 opacity-20">✉</p>
            <p class="text-sm font-medium text-ink mb-1">Belum ada pesan</p>
            <p class="text-xs text-ink-muted">Kirim pesan pertama ke ${f}</p>
          </div>
        `:u.map(e=>o(e.content,e.sender_id===a.id,e.created_at)).join(``)}
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
  `;let p=n.querySelector(`#msg-list`),m=n.querySelector(`#msg-input`),h=n.querySelector(`#btn-send`);p.scrollTop=p.scrollHeight,m.addEventListener(`input`,()=>{m.style.height=`auto`,m.style.height=Math.min(m.scrollHeight,128)+`px`});let g=null;function _(e,t,n){let r=document.createElement(`div`);r.innerHTML=o(e,t,n);let i=r.firstElementChild;i&&(p.appendChild(i),p.scrollTop=p.scrollHeight)}async function v(){let e=m.value.trim();if(!e)return;m.value=``,m.style.height=`auto`;let n=new Date().toISOString();_(e,!0,n);let r={id:crypto.randomUUID(),sender_id:a.id,content:e,type:`message`,created_at:n};g?.send({type:`broadcast`,event:`new_message`,payload:r}),await t.from(`messages`).insert({couple_id:c,sender_id:a.id,content:e,type:`message`})}h.addEventListener(`click`,v),m.addEventListener(`keydown`,e=>{e.key===`Enter`&&!e.shiftKey&&(e.preventDefault(),v())}),g=t.channel(`chat:${c}`).on(`broadcast`,{event:`new_message`},({payload:e})=>{let t=e;t.sender_id!==a.id&&_(t.content,!1,t.created_at)}).subscribe();let y=new MutationObserver(()=>{n.isConnected||(g?.unsubscribe(),y.disconnect())});return y.observe(document.body,{childList:!0,subtree:!1}),n.appendChild(r()),n}function o(e,t,r){return`
    <div class="flex flex-col gap-1 max-w-[78%] ${t?`self-end items-end`:`self-start items-start`}">
      <div class="px-4 py-2.5 text-sm leading-relaxed break-words
                  ${t?`bg-ink text-bg rounded-2xl rounded-br-sm`:`bg-surface border border-border text-ink rounded-2xl rounded-bl-sm`}">
        ${i(e)}
      </div>
      <span class="text-[10px] text-ink-muted px-1">${n(r)}</span>
    </div>
  `}export{a as renderChat};
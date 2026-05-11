import{i as e,n as t,o as n}from"./router-SnC_tAPp.js";import{s as r}from"./index-BKN2W0tb.js";import{t as i}from"./nav-JQzAyBuE.js";async function a(){let s=document.createElement(`div`),{couple_id:c}=e();if(!c)return s;let{data:l}=await n.from(`date_plans`).select(`*`).eq(`couple_id`,c).order(`planned_date`,{ascending:!0}),u=l??[],d=u.filter(e=>e.status===`planned`),f=u.filter(e=>e.status===`done`);return s.innerHTML=`
    <div class="min-h-dvh bg-bg pb-[calc(64px+1.5rem)]">
      <div class="px-4 pt-safe-8 pb-6 flex justify-between items-end">
        <div>
          <h1 class="font-display text-2xl text-ink">Rencana Kencan</h1>
          <p class="text-sm text-ink-muted mt-0.5">${d.length} rencana menanti</p>
        </div>
        <button id="btn-add"
          class="px-4 py-2 rounded-full bg-ink text-bg text-sm font-medium hover:opacity-80 active:scale-[0.97] transition-all cursor-pointer border-none">
          + Buat
        </button>
      </div>

      ${u.length===0?`
        <div class="px-4 pt-12 flex flex-col items-center text-center">
          <p class="text-5xl mb-5 opacity-20">◎</p>
          <p class="text-base font-medium text-ink mb-2">Belum ada rencana</p>
          <p class="text-sm text-ink-muted mb-6">Mulai rencanakan kencan kalian</p>
          <button id="btn-add-empty"
            class="px-6 py-3 rounded-full bg-ink text-bg text-sm font-medium hover:opacity-80 cursor-pointer border-none">
            Buat Rencana
          </button>
        </div>
      `:``}

      ${d.length>0?`
        <div class="px-4 mb-7">
          <p class="text-[10px] uppercase tracking-[0.15em] text-ink-muted font-medium mb-3">Direncanakan</p>
          <div class="flex flex-col gap-3" id="planned-list">
            ${d.map(e=>o(e)).join(``)}
          </div>
        </div>
      `:``}

      ${f.length>0?`
        <div class="px-4 mb-7">
          <p class="text-[10px] uppercase tracking-[0.15em] text-ink-muted font-medium mb-3">Sudah Dilalui (${f.length})</p>
          <div class="flex flex-col gap-3">
            ${f.slice(0,5).map(e=>o(e)).join(``)}
          </div>
        </div>
      `:``}
    </div>
  `,s.querySelector(`#btn-add`)?.addEventListener(`click`,()=>t(`/planner/add`)),s.querySelector(`#btn-add-empty`)?.addEventListener(`click`,()=>t(`/planner/add`)),s.querySelectorAll(`[data-done]`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=e.dataset.done,{error:i}=await n.from(`date_plans`).update({status:`done`}).eq(`id`,t);if(i){r(`Gagal update`,`error`);return}r(`Kencan selesai! 🎉`,`success`);let o=await a();s.replaceWith(o)})}),s.appendChild(i()),s}function o(e){let t=e.planned_date?new Date(e.planned_date).toLocaleDateString(`id-ID`,{weekday:`short`,day:`numeric`,month:`long`,year:`numeric`,hour:`2-digit`,minute:`2-digit`}):null,n=e.budget?`Rp ${e.budget.toLocaleString(`id-ID`)}`:null;return`
    <div class="bg-surface border border-border rounded-2xl overflow-hidden">
      <div class="px-4 pt-4 pb-3">
        <div class="flex justify-between items-start gap-2 mb-2">
          <h3 class="font-display text-base text-ink leading-snug">${e.title}</h3>
          ${e.status===`done`?`<span class="flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-green-700 font-medium">Selesai ✓</span>`:`<span class="flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">Rencana</span>`}
        </div>
        ${e.location?`<p class="text-xs text-ink-muted mb-1">📍 ${e.location}</p>`:``}
        ${t?`<p class="text-xs text-ink-muted mb-1">📅 ${t}</p>`:``}
        ${n?`<p class="text-xs text-ink-muted mb-1">💰 ${n}</p>`:``}
        ${e.description?`<p class="text-sm text-ink-muted leading-relaxed mt-2">${e.description}</p>`:``}
      </div>
      ${e.status===`planned`?`
        <div class="border-t border-border px-4 py-2.5">
          <button data-done="${e.id}"
            class="text-xs font-medium text-ink-muted hover:text-ink transition-colors cursor-pointer bg-transparent border-none">
            ✓ Tandai selesai
          </button>
        </div>
      `:``}
    </div>
  `}export{a as renderPlanner};
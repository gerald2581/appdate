import{a as e,i as t,n,o as r}from"./router-SnC_tAPp.js";import{a as i,i as a,n as o,s,u as c}from"./index-DsrYTFIg.js";import{t as l}from"./nav-B2cJ5DU3.js";import{n as u}from"./storage-j0tHUYzK.js";function d(e){if(!e)return``;let t=new Date(e),n=e=>String(e).padStart(2,`0`);return`${t.getFullYear()}-${n(t.getMonth()+1)}-${n(t.getDate())}T${n(t.getHours())}:${n(t.getMinutes())}`}function f(){return d(new Date().toISOString())}function p(n){let{user:r}=t();if(!r)return;let i=document.createElement(`div`);i.className=`fixed inset-0 z-[200]`,i.style.cssText=`background: rgba(0,0,0,0.35); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);`;let a=document.createElement(`div`);a.className=`fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-[201]`,a.style.cssText=`
    max-width: 430px;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(32px) saturate(1.6);
    -webkit-backdrop-filter: blur(32px) saturate(1.6);
    border-radius: 28px 28px 0 0;
    border-top: 1px solid rgba(255,255,255,0.8);
    box-shadow: 0 -8px 40px rgba(0,0,0,0.15);
    padding: 12px 24px 40px;
    transform: translateY(100%);
    transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  `,a.innerHTML=`
    <!-- Handle bar -->
    <div class="w-10 h-1 rounded-full mx-auto mb-5 mt-1" style="background:rgba(0,0,0,0.15)"></div>

    <!-- Title -->
    <div class="flex justify-between items-center mb-5">
      <h3 class="font-display text-lg text-ink">Edit Tanggal Mulai</h3>
      <button id="btn-close"
        class="w-8 h-8 rounded-full flex items-center justify-center border-none cursor-pointer text-ink-muted hover:opacity-60 transition-opacity"
        style="background:rgba(0,0,0,0.06); font-size:1.1rem">
        ×
      </button>
    </div>

    <!-- Datetime input -->
    <div class="flex flex-col gap-1.5 mb-2">
      <label class="text-xs font-medium uppercase tracking-wider text-ink-muted">Tanggal & Waktu</label>
      <input id="dt-input"
        type="datetime-local"
        value="${d(r.relationship_start)}"
        max="${f()}"
        class="w-full px-4 py-3.5 rounded-2xl text-base text-ink outline-none"
        style="background: rgba(200,130,106,0.07); border: 1.5px solid rgba(200,130,106,0.25);
               font-family: inherit; -webkit-appearance: none;" />
    </div>
    <p class="text-xs text-ink-muted mb-6">Atur jam & menit agar timer lebih akurat</p>

    <!-- Buttons -->
    <div class="flex gap-3">
      <button id="btn-cancel"
        class="flex-1 py-3.5 rounded-full text-sm font-medium cursor-pointer border-none transition-all hover:opacity-75"
        style="background:rgba(0,0,0,0.06); color:#6b6860">
        Batal
      </button>
      <button id="btn-save"
        class="flex-[2] py-3.5 rounded-full text-white text-sm font-semibold cursor-pointer border-none transition-all hover:opacity-88 active:scale-[0.98]"
        style="background: linear-gradient(135deg, #c8826a, #d4956a); box-shadow: 0 4px 16px rgba(200,130,106,0.35)">
        Simpan
      </button>
    </div>
  `,document.body.appendChild(i),document.body.appendChild(a),requestAnimationFrame(()=>{a.style.transform=`translateY(0)`});function o(){a.style.transform=`translateY(100%)`,i.style.opacity=`0`,i.style.transition=`opacity 0.25s ease`,setTimeout(()=>{a.remove(),i.remove()},300)}i.addEventListener(`click`,o),a.querySelector(`#btn-close`).addEventListener(`click`,o),a.querySelector(`#btn-cancel`).addEventListener(`click`,o),a.querySelector(`#btn-save`).addEventListener(`click`,async()=>{let i=a.querySelector(`#dt-input`).value;if(!i){s(`Pilih tanggal dan waktu dulu`,`error`);return}let l=a.querySelector(`#btn-save`);l.disabled=!0,l.textContent=`Menyimpan...`;try{let a=new Date(i).toISOString();await c(r.id,a);let{user:l}=t();e({user:{...l,relationship_start:a}}),s(`Tanggal tersimpan ♡`,`success`),o(),n()}catch{s(`Gagal menyimpan`,`error`),l.disabled=!1,l.textContent=`Simpan`}})}async function m(){let e=document.createElement(`div`),{user:s,partner:c,couple_id:d}=t();if(!s||!d)return _(s?.name??``);let[f,v]=await Promise.all([r.from(`memories`).select(`*`).eq(`couple_id`,d).order(`created_at`,{ascending:!1}).limit(3),r.from(`special_dates`).select(`*`).eq(`couple_id`,d).order(`date`)]),y=f.data??[],b=v.data??[],x=new Date;x.setHours(0,0,0,0);let S=b.map(e=>{let t=e.recurring?i(e.date):new Date(e.date);return{...e,nextDate:t,daysLeft:Math.ceil((t.getTime()-x.getTime())/864e5)}}).filter(e=>e.daysLeft>=0).sort((e,t)=>e.daysLeft-t.daysLeft).slice(0,3),C=await Promise.all(y.map(async e=>({...e,photoUrl:e.photo_path?await u(e.photo_path).catch(()=>null):null}))),w=s.name.charAt(0).toUpperCase(),T=c?c.name.charAt(0).toUpperCase():`?`;if(e.innerHTML=`
    <div class="min-h-dvh pb-[calc(64px+1.5rem)]">

      <!-- Hero glass card -->
      <div class="px-4 pt-safe-10 pb-4">
        <div class="glass-strong px-6 py-8 text-center">

          <!-- Partner avatars -->
          <div class="flex items-center justify-center gap-4 mb-6">
            <div class="flex flex-col items-center gap-1.5">
              <div class="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-semibold shadow-lg select-none"
                   style="background: linear-gradient(135deg, #c8826a, #d4956a)">
                ${w}
              </div>
              <span class="text-xs text-ink-muted font-medium">${s.name.split(` `)[0]}</span>
            </div>
            <div class="flex flex-col items-center gap-1 pb-5">
              <span class="text-2xl" style="color:#c8826a; opacity:0.6">♡</span>
            </div>
            <div class="flex flex-col items-center gap-1.5">
              <div class="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-semibold shadow-lg select-none"
                   style="background: linear-gradient(135deg, #7a9ec8, #8badd4)">
                ${T}
              </div>
              <span class="text-xs text-ink-muted font-medium">${c?c.name.split(` `)[0]:`Partner`}</span>
            </div>
          </div>

          <!-- Real-time timer -->
          <p class="text-[10px] uppercase tracking-[0.2em] text-ink-muted mb-4">Bersama selama</p>

          ${s.relationship_start?`
            <div id="timer-grid" class="grid grid-cols-4 gap-2 mb-3"></div>
            <div class="flex items-center justify-center gap-2">
              <p class="text-xs text-ink-muted">Sejak ${o(s.relationship_start)}</p>
              <button id="btn-edit-date" title="Edit tanggal mulai"
                class="border-none bg-transparent cursor-pointer p-1 rounded-full transition-opacity hover:opacity-60 active:scale-90"
                style="color:#c8826a">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            </div>
          `:`
            <p class="text-4xl font-display text-ink mb-3">—</p>
            <button id="btn-set-date"
              class="inline-flex items-center gap-1.5 text-xs border-none bg-transparent cursor-pointer px-3 py-1.5 rounded-full transition-all hover:opacity-80"
              style="color:#c8826a; background:rgba(200,130,106,0.1)">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Set tanggal mulai
            </button>
          `}
        </div>
      </div>

      <!-- Quick actions -->
      <div class="px-4 mb-4">
        <div class="grid grid-cols-2 gap-3">
          ${g(`✦`,`Tambah Kenangan`,`/timeline/add`)}
          ${g(`◎`,`Rencanakan Kencan`,`/planner/add`)}
          ${g(`✉`,`Kirim Pesan`,`/chat`)}
          ${g(`◉`,`Cek Lokasi`,`/location`)}
        </div>
      </div>

      <!-- Upcoming special dates -->
      ${S.length>0?`
        <div class="px-4 mb-4">
          <p class="text-[10px] uppercase tracking-[0.15em] text-ink-muted font-medium mb-3">Tanggal Spesial</p>
          <div class="flex flex-col gap-2">
            ${S.map(e=>`
              <div class="glass px-4 py-3.5 flex justify-between items-center">
                <div>
                  <p class="text-sm font-medium text-ink">${e.title}</p>
                  <p class="text-xs text-ink-muted mt-0.5">
                    ${e.nextDate.toLocaleDateString(`id-ID`,{day:`numeric`,month:`long`})}
                  </p>
                </div>
                <span class="text-xs font-semibold" style="color:${e.daysLeft===0?`#6ab87a`:`#c8826a`}">
                  ${e.daysLeft===0?`Hari ini! 🎉`:`${e.daysLeft}h lagi`}
                </span>
              </div>
            `).join(``)}
          </div>
        </div>
      `:``}

      <!-- Recent memories -->
      <div class="px-4">
        <div class="flex justify-between items-center mb-3">
          <p class="text-[10px] uppercase tracking-[0.15em] text-ink-muted font-medium">Kenangan Terbaru</p>
          ${y.length>0?`<button id="see-all" class="text-xs border-none bg-transparent cursor-pointer font-medium" style="color:#c8826a">Lihat semua</button>`:``}
        </div>

        ${C.length===0?`
          <div class="glass px-6 py-8 text-center">
            <p class="text-3xl mb-3 opacity-25">✦</p>
            <p class="text-sm font-medium text-ink mb-1">Belum ada kenangan</p>
            <p class="text-xs text-ink-muted mb-4">Catat momen pertama kalian bersama</p>
            <button data-nav="/timeline/add"
              class="px-5 py-2.5 rounded-full text-white text-sm font-medium border-none cursor-pointer transition-opacity hover:opacity-85"
              style="background: linear-gradient(135deg, #c8826a, #d4956a)">
              + Tambah
            </button>
          </div>
        `:`
          <div class="flex flex-col gap-2">
            ${C.map(e=>`
              <div class="glass px-4 py-3 flex items-center gap-3">
                ${e.photoUrl?`<img src="${e.photoUrl}" class="w-12 h-12 rounded-xl object-cover flex-shrink-0 shadow-sm" loading="lazy" />`:`<div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 select-none" style="background:rgba(200,130,106,0.12)">✦</div>`}
                <div class="min-w-0">
                  <p class="text-sm font-medium text-ink truncate">${e.title}</p>
                  <p class="text-xs text-ink-muted mt-0.5">${a(e.memory_date)}</p>
                </div>
              </div>
            `).join(``)}
          </div>
        `}
      </div>
    </div>
  `,s.relationship_start){let t=e.querySelector(`#timer-grid`),n;function r(){let e=new Date(s.relationship_start).getTime(),n=Date.now()-e;if(n<0){t.innerHTML=h(`0`,`hari`)+h(`0`,`jam`)+h(`0`,`menit`)+h(`0`,`detik`);return}let r=Math.floor(n/864e5),i=Math.floor(n%864e5/36e5),a=Math.floor(n%36e5/6e4),o=Math.floor(n%6e4/1e3);t.innerHTML=h(r.toString(),`Hari`)+h(String(i).padStart(2,`0`),`Jam`)+h(String(a).padStart(2,`0`),`Menit`)+h(String(o).padStart(2,`0`),`Detik`)}r(),n=setInterval(r,1e3);let i=new MutationObserver(()=>{e.isConnected||(clearInterval(n),i.disconnect())});i.observe(document.body,{childList:!0,subtree:!1})}e.querySelector(`#see-all`)?.addEventListener(`click`,()=>n(`/timeline`));let E=()=>p(async()=>{let t=await m();e.replaceWith(t)});return e.querySelector(`#btn-edit-date`)?.addEventListener(`click`,E),e.querySelector(`#btn-set-date`)?.addEventListener(`click`,E),e.querySelectorAll(`[data-nav]`).forEach(e=>{e.addEventListener(`click`,()=>n(e.dataset.nav))}),e.appendChild(l()),e}function h(e,t){return`
    <div class="flex flex-col items-center gap-1 rounded-2xl py-3"
         style="background:rgba(200,130,106,0.10); border:1px solid rgba(200,130,106,0.18)">
      <span class="font-display font-semibold text-ink leading-none" style="font-size:clamp(1.4rem,6vw,2rem)">${e}</span>
      <span class="text-[9px] uppercase tracking-[0.12em] text-ink-muted font-medium">${t}</span>
    </div>
  `}function g(e,t,n){return`
    <button data-nav="${n}"
      class="glass p-5 text-left cursor-pointer select-none
             hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-150">
      <span class="block text-2xl mb-2.5 leading-none">${e}</span>
      <span class="text-[13px] font-medium text-ink leading-snug">${t}</span>
    </button>
  `}function _(e){let t=document.createElement(`div`);return t.innerHTML=`
    <div class="min-h-dvh pb-[calc(64px+1.5rem)]">
      <div class="px-4 pt-safe-10 pb-4">
        <div class="glass-strong px-6 py-10 text-center">
          <p class="text-[10px] uppercase tracking-[0.2em] text-ink-muted mb-3">Selamat datang</p>
          <h1 class="font-display text-4xl text-ink mb-1">${e||`AppDate`}</h1>
          <p class="text-sm text-ink-muted">Ruang privat kita berdua</p>
        </div>
      </div>

      <div class="mx-4 mb-4">
        <div class="glass p-5">
          <div class="flex items-start gap-3">
            <span class="text-2xl leading-none mt-0.5">♡</span>
            <div class="flex-1">
              <p class="text-sm font-medium text-ink mb-1">Hubungkan dengan partner</p>
              <p class="text-xs text-ink-muted mb-3">Bagikan kode invite ke partner kamu untuk mulai semua fitur bersama.</p>
              <button id="btn-go-onboarding"
                class="px-4 py-2 rounded-full text-white text-xs font-medium border-none cursor-pointer hover:opacity-85 transition-opacity"
                style="background: linear-gradient(135deg, #c8826a, #d4956a)">
                Hubungkan sekarang
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="px-4">
        <p class="text-[10px] uppercase tracking-[0.15em] text-ink-muted font-medium mb-3">Fitur yang tersedia</p>
        <div class="flex flex-col gap-2">
          ${v(`✦`,`Timeline Kenangan`,`Catat momen bersama dengan foto`)}
          ${v(`◎`,`Rencana Kencan`,`Plan date, lokasi, dan budget`)}
          ${v(`✉`,`Chat Privat`,`Pesan real-time hanya kalian berdua`)}
          ${v(`◉`,`Live Lokasi`,`Pantau lokasi partner secara real-time`)}
        </div>
      </div>
    </div>
  `,t.querySelector(`#btn-go-onboarding`).addEventListener(`click`,()=>{localStorage.removeItem(`skip_onboarding`),n(`/onboarding`)}),t.appendChild(l()),t}function v(e,t,n){return`
    <div class="glass px-4 py-3 flex items-center gap-3">
      <span class="text-lg leading-none w-6 text-center flex-shrink-0">${e}</span>
      <div>
        <p class="text-sm font-medium text-ink">${t}</p>
        <p class="text-xs text-ink-muted">${n}</p>
      </div>
    </div>
  `}export{m as renderHome};
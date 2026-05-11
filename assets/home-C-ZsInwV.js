import{a as e,i as t,n,o as r}from"./router-SnC_tAPp.js";import{a as i,i as a,n as o,s,u as c}from"./index-BSKIVpEi.js";import{t as l}from"./nav-JQzAyBuE.js";import{n as u}from"./storage-j0tHUYzK.js";function d(e){if(!e)return``;let t=new Date(e),n=e=>String(e).padStart(2,`0`);return`${t.getFullYear()}-${n(t.getMonth()+1)}-${n(t.getDate())}T${n(t.getHours())}:${n(t.getMinutes())}`}function f(){return d(new Date().toISOString())}function p(n){let{user:r}=t();if(!r)return;let i=document.createElement(`div`);i.className=`fixed inset-0 z-[200]`,i.style.cssText=`background: rgba(0,0,0,0.35); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);`;let a=document.createElement(`div`);a.className=`fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-[201]`,a.style.cssText=`
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
  `,document.body.appendChild(i),document.body.appendChild(a),requestAnimationFrame(()=>{a.style.transform=`translateY(0)`});function o(){a.style.transform=`translateY(100%)`,i.style.opacity=`0`,i.style.transition=`opacity 0.25s ease`,setTimeout(()=>{a.remove(),i.remove()},300)}i.addEventListener(`click`,o),a.querySelector(`#btn-close`).addEventListener(`click`,o),a.querySelector(`#btn-cancel`).addEventListener(`click`,o),a.querySelector(`#btn-save`).addEventListener(`click`,async()=>{let i=a.querySelector(`#dt-input`).value;if(!i){s(`Pilih tanggal dan waktu dulu`,`error`);return}let l=a.querySelector(`#btn-save`);l.disabled=!0,l.textContent=`Menyimpan...`;try{let a=new Date(i).toISOString();await c(r.id,a);let{user:l}=t();e({user:{...l,relationship_start:a}}),s(`Tanggal tersimpan ♡`,`success`),o(),n()}catch{s(`Gagal menyimpan`,`error`),l.disabled=!1,l.textContent=`Simpan`}})}function m(e,t=26){return`<svg width="${t}" height="${t}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    style="display:block;flex-shrink:0">${e}</svg>`}var h=m(`
  <path d="M12 2C12 7.25 16.75 12 22 12C16.75 12 12 16.75 12 22C12 16.75 7.25 12 2 12C7.25 12 12 7.25 12 2Z"/>
`),g=m(`
  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
  <circle cx="12" cy="13" r="4"/>
`),_=m(`
  <rect x="3" y="4" width="18" height="18" rx="3"/>
  <line x1="16" y1="2" x2="16" y2="6"/>
  <line x1="8" y1="2" x2="8" y2="6"/>
  <line x1="3" y1="10" x2="21" y2="10"/>
  <path d="M9 16l2 2 4-4"/>
`),v=m(`
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
`),y=m(`
  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
  <circle cx="12" cy="10" r="3"/>
`);async function b(){let e=document.createElement(`div`),{user:s,partner:c,couple_id:d}=t();if(!s||!d)return C(s?.name??``);let[f,h]=await Promise.all([r.from(`memories`).select(`*`).eq(`couple_id`,d).order(`created_at`,{ascending:!1}).limit(3),r.from(`special_dates`).select(`*`).eq(`couple_id`,d).order(`date`)]),w=f.data??[],T=h.data??[],E=new Date;E.setHours(0,0,0,0);let D=T.map(e=>{let t=e.recurring?i(e.date):new Date(e.date);return{...e,nextDate:t,daysLeft:Math.ceil((t.getTime()-E.getTime())/864e5)}}).filter(e=>e.daysLeft>=0).sort((e,t)=>e.daysLeft-t.daysLeft).slice(0,3),O=await Promise.all(w.map(async e=>({...e,photoUrl:e.photo_path?await u(e.photo_path).catch(()=>null):null}))),k=s.name.charAt(0).toUpperCase(),A=c?c.name.charAt(0).toUpperCase():`?`;if(e.innerHTML=`
    <div class="min-h-dvh pb-[calc(64px+1.5rem)]">

      <!-- Hero glass card -->
      <div class="px-4 pt-safe-10 pb-4">
        <div class="glass-strong px-6 py-8 text-center">

          <!-- Partner avatars -->
          <div class="flex items-center justify-center gap-4 mb-6">
            <div class="flex flex-col items-center gap-1.5">
              <div class="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-semibold shadow-lg select-none"
                   style="background: linear-gradient(135deg, #c8826a, #d4956a)">
                ${k}
              </div>
              <span class="text-xs text-ink-muted font-medium">${s.name.split(` `)[0]}</span>
            </div>
            <div class="flex flex-col items-center gap-1 pb-5">
              <span class="text-2xl" style="color:#c8826a; opacity:0.6">♡</span>
            </div>
            <div class="flex flex-col items-center gap-1.5">
              <div class="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-semibold shadow-lg select-none"
                   style="background: linear-gradient(135deg, #7a9ec8, #8badd4)">
                ${A}
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
          ${S(g,`Tambah Kenangan`,`/timeline/add`)}
          ${S(_,`Rencanakan Kencan`,`/planner/add`)}
          ${S(v,`Kirim Pesan`,`/chat`)}
          ${S(y,`Cek Lokasi`,`/location`)}
        </div>
      </div>

      <!-- Upcoming special dates -->
      ${D.length>0?`
        <div class="px-4 mb-4">
          <p class="text-[10px] uppercase tracking-[0.15em] text-ink-muted font-medium mb-3">Tanggal Spesial</p>
          <div class="flex flex-col gap-2">
            ${D.map(e=>`
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
          ${w.length>0?`<button id="see-all" class="text-xs border-none bg-transparent cursor-pointer font-medium" style="color:#c8826a">Lihat semua</button>`:``}
        </div>

        ${O.length===0?`
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
            ${O.map(e=>`
              <div class="glass px-4 py-3 flex items-center gap-3">
                ${e.photoUrl?`<img src="${e.photoUrl}" class="w-12 h-12 rounded-xl object-cover flex-shrink-0 shadow-sm" loading="lazy" />`:`<div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 select-none" style="color:#c8826a;background:linear-gradient(145deg,rgba(255,255,255,0.72),rgba(255,238,228,0.50));border:1px solid rgba(255,255,255,0.82);box-shadow:0 3px 10px rgba(200,130,106,0.10),inset 0 1px 0 rgba(255,255,255,0.90)">${m(`<path d="M12 2C12 7.25 16.75 12 22 12C16.75 12 12 16.75 12 22C12 16.75 7.25 12 2 12C7.25 12 12 7.25 12 2Z"/>`,18)}</div>`}
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
  `,s.relationship_start){let t=e.querySelector(`#timer-grid`),n;function r(){let e=new Date(s.relationship_start).getTime(),n=Date.now()-e;if(n<0){t.innerHTML=x(`0`,`hari`)+x(`0`,`jam`)+x(`0`,`menit`)+x(`0`,`detik`);return}let r=Math.floor(n/864e5),i=Math.floor(n%864e5/36e5),a=Math.floor(n%36e5/6e4),o=Math.floor(n%6e4/1e3);t.innerHTML=x(r.toString(),`Hari`)+x(String(i).padStart(2,`0`),`Jam`)+x(String(a).padStart(2,`0`),`Menit`)+x(String(o).padStart(2,`0`),`Detik`)}r(),n=setInterval(r,1e3);let i=new MutationObserver(()=>{e.isConnected||(clearInterval(n),i.disconnect())});i.observe(document.body,{childList:!0,subtree:!1})}e.querySelector(`#see-all`)?.addEventListener(`click`,()=>n(`/timeline`));let j=()=>p(async()=>{let t=await b();e.replaceWith(t)});return e.querySelector(`#btn-edit-date`)?.addEventListener(`click`,j),e.querySelector(`#btn-set-date`)?.addEventListener(`click`,j),e.querySelectorAll(`[data-nav]`).forEach(e=>{e.addEventListener(`click`,()=>n(e.dataset.nav))}),e.appendChild(l()),e}function x(e,t){return`
    <div style="
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      border-radius: 18px; padding: 14px 6px;
      background: linear-gradient(160deg, rgba(255,255,255,0.76) 0%, rgba(255,238,228,0.52) 50%, rgba(255,224,208,0.38) 100%);
      backdrop-filter: blur(24px) saturate(1.9) brightness(1.04);
      -webkit-backdrop-filter: blur(24px) saturate(1.9) brightness(1.04);
      border: 1px solid rgba(255,255,255,0.82);
      box-shadow:
        0 6px 22px rgba(200,130,106,0.13),
        0 2px 6px rgba(200,130,106,0.08),
        0 1px 2px rgba(0,0,0,0.04),
        inset 0 1.5px 0 rgba(255,255,255,0.94),
        inset 0 -1px 2px rgba(200,130,106,0.07);
    ">
      <span style="font-family:'Playfair Display',Georgia,serif; font-weight:600; color:#1a1916; line-height:1; font-size:clamp(1.4rem,6vw,2rem)">${e}</span>
      <span style="font-size:9px; text-transform:uppercase; letter-spacing:0.12em; color:#6b6860; font-weight:500">${t}</span>
    </div>
  `}function S(e,t,n){return`
    <button data-nav="${n}"
      class="glass p-4 text-left cursor-pointer select-none
             hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-150">
      <span style="
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 54px; height: 54px;
        border-radius: 17px;
        margin-bottom: 12px;
        color: #c8826a;
        background: linear-gradient(145deg, rgba(255,255,255,0.74) 0%, rgba(255,242,234,0.50) 50%, rgba(255,228,212,0.34) 100%);
        backdrop-filter: blur(22px) saturate(1.9) brightness(1.04);
        -webkit-backdrop-filter: blur(22px) saturate(1.9) brightness(1.04);
        border: 1px solid rgba(255,255,255,0.84);
        box-shadow:
          0 6px 22px rgba(200,130,106,0.13),
          0 2px 7px rgba(200,130,106,0.07),
          0 1px 2px rgba(0,0,0,0.04),
          inset 0 1.5px 0 rgba(255,255,255,0.94),
          inset 0 -1px 2px rgba(200,130,106,0.06);
      ">${e}</span>
      <span class="text-[13px] font-medium text-ink leading-snug block">${t}</span>
    </button>
  `}function C(e){let t=document.createElement(`div`);return t.innerHTML=`
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
            <span style="color:#c8826a;display:flex;align-items:center;margin-top:2px">${m(`<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="rgba(200,130,106,0.10)"/>`,26)}</span>
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
          ${w(h,`Timeline Kenangan`,`Catat momen bersama dengan foto`)}
          ${w(_,`Rencana Kencan`,`Plan date, lokasi, dan budget`)}
          ${w(v,`Chat Privat`,`Pesan real-time hanya kalian berdua`)}
          ${w(y,`Live Lokasi`,`Pantau lokasi partner secara real-time`)}
        </div>
      </div>
    </div>
  `,t.querySelector(`#btn-go-onboarding`).addEventListener(`click`,()=>{localStorage.removeItem(`skip_onboarding`),n(`/onboarding`)}),t.appendChild(l()),t}function w(e,t,n){return`
    <div class="glass px-4 py-3 flex items-center gap-3">
      <span style="
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 44px; height: 44px;
        border-radius: 14px;
        color: #c8826a;
        background: linear-gradient(145deg, rgba(255,255,255,0.72) 0%, rgba(255,242,234,0.48) 100%);
        backdrop-filter: blur(18px) saturate(1.8);
        -webkit-backdrop-filter: blur(18px) saturate(1.8);
        border: 1px solid rgba(255,255,255,0.82);
        box-shadow:
          0 4px 14px rgba(200,130,106,0.11),
          0 1px 3px rgba(0,0,0,0.04),
          inset 0 1.5px 0 rgba(255,255,255,0.92),
          inset 0 -0.5px 1px rgba(200,130,106,0.06);
      ">${e}</span>
      <div>
        <p class="text-sm font-medium text-ink">${t}</p>
        <p class="text-xs text-ink-muted">${n}</p>
      </div>
    </div>
  `}export{b as renderHome};
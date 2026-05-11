const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/home-DAbDiiYu.js","assets/router-SnC_tAPp.js","assets/nav-JQzAyBuE.js","assets/storage-j0tHUYzK.js","assets/timeline-BlUOXIfh.js","assets/confirm-modal-CDDWdlXn.js","assets/escape-1QVFIIou.js","assets/timeline-add-DWYeVdn9.js","assets/planner-57ySuaII.js","assets/planner-add-C9u6IpUn.js","assets/chat-ZBcZ9ikQ.js","assets/location-phhZZ4Je.js","assets/settings-Byo23jMC.js"])))=>i.map(i=>d[i]);
import{a as e,i as t,n,o as r,r as i,t as a}from"./router-SnC_tAPp.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();async function o(e,t){let{data:n,error:i}=await r.auth.signInWithPassword({email:e,password:t});if(i)throw i;return n}async function s(e,t,n){let{data:i,error:a}=await r.auth.signUp({email:e,password:t,options:{data:{name:n}}});if(a)throw a;return i}async function c(){let{error:e}=await r.auth.signOut();if(e)throw e}async function l(){let{data:{user:e}}=await r.auth.getUser();if(!e)return null;let{data:t,error:n}=await r.from(`profiles`).select(`*`).eq(`id`,e.id).single();if(n){if(n.code===`PGRST116`)return null;throw n}return t}async function u(e){let{data:t,error:n}=await r.from(`profiles`).select(`*`).eq(`id`,e).single();return n?null:t}async function d(e,t){let{error:n}=await r.from(`profiles`).update(t).eq(`id`,e);if(n)throw n}async function f(e){let{error:t}=await r.auth.updateUser({password:e});if(t)throw t}async function p(){let{error:e}=await r.rpc(`delete_my_account`);if(e)throw e;await r.auth.signOut()}function m(){let e=document.createElement(`div`);e.className=`min-h-dvh flex flex-col justify-center px-5 pb-12 pt-safe-12`;let t=!0;function r(){e.innerHTML=`
      <!-- Logo -->
      <div class="text-center mb-10">
        <h1 class="font-display text-5xl text-ink mb-2" style="letter-spacing:-0.01em">AppDate</h1>
        <p class="text-sm text-ink-muted">Ruang privat kita berdua</p>
      </div>

      <!-- Glass card form -->
      <div class="glass-strong px-6 py-7">

        <!-- Tab toggle -->
        <div class="flex rounded-full p-1 mb-6" style="background:rgba(0,0,0,0.06)">
          <button id="tab-login"
            class="flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border-none"
            style="${t?`background:rgba(255,255,255,0.9); color:#1a1916; box-shadow:0 2px 8px rgba(0,0,0,0.1)`:`background:transparent; color:#9a9088`}">
            Masuk
          </button>
          <button id="tab-signup"
            class="flex-1 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border-none"
            style="${t?`background:transparent; color:#9a9088`:`background:rgba(255,255,255,0.9); color:#1a1916; box-shadow:0 2px 8px rgba(0,0,0,0.1)`}">
            Daftar
          </button>
        </div>

        <form id="auth-form" class="flex flex-col gap-4" novalidate>
          ${t?``:`
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-medium text-ink-muted uppercase tracking-wider" for="name">Nama</label>
              <input id="name" class="field" type="text" placeholder="Nama kamu" autocomplete="name" required />
            </div>
          `}

          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-medium text-ink-muted uppercase tracking-wider" for="email">Email</label>
            <input id="email" class="field" type="email" placeholder="email@kamu.com" autocomplete="email" required />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-medium text-ink-muted uppercase tracking-wider" for="password">Password</label>
            <input id="password" class="field" type="password" placeholder="••••••••"
              autocomplete="${t?`current-password`:`new-password`}" required minlength="8" />
          </div>

          <p id="auth-error" class="text-sm hidden rounded-xl px-3 py-2" style="background:rgba(200,120,120,0.12); color:#b85a5a"></p>

          <button id="auth-submit" type="submit"
            class="w-full py-3.5 rounded-full text-white text-sm font-semibold border-none cursor-pointer
                   hover:opacity-88 active:scale-[0.98] transition-all mt-1 disabled:opacity-50"
            style="background: linear-gradient(135deg, #c8826a 0%, #d4956a 100%); box-shadow: 0 4px 20px rgba(200,130,106,0.35)">
            ${t?`Masuk`:`Buat Akun`}
          </button>
        </form>
      </div>
    `,e.querySelector(`#tab-login`).addEventListener(`click`,()=>{t=!0,r()}),e.querySelector(`#tab-signup`).addEventListener(`click`,()=>{t=!1,r()});let i=e.querySelector(`#auth-form`),a=e.querySelector(`#auth-submit`),c=e.querySelector(`#auth-error`);i.addEventListener(`submit`,async r=>{r.preventDefault(),a.disabled=!0,a.textContent=`...`,c.classList.add(`hidden`);let i=e.querySelector(`#email`).value.trim(),l=e.querySelector(`#password`).value;try{if(t)await o(i,l),window.location.reload();else{let t=e.querySelector(`#name`).value.trim();if(!t)throw Error(`Nama tidak boleh kosong`);await s(i,l,t),n(`/onboarding`),window.location.reload()}}catch(e){c.textContent=e instanceof Error?e.message:`Terjadi kesalahan`,c.classList.remove(`hidden`),a.disabled=!1,a.textContent=t?`Masuk`:`Buat Akun`}})}return r(),e}async function h(e){let{data:t,error:n}=await r.from(`profiles`).select(`invite_code, invite_expires_at, invite_used`).eq(`id`,e).single();if(n)throw n;return{code:t.invite_code??``,expiresAt:t.invite_expires_at,used:t.invite_used}}async function g(){let{data:e,error:t}=await r.rpc(`refresh_invite_code`);if(t)throw t;return e}async function _(e){let{data:t,error:n}=await r.rpc(`link_couple`,{p_invite_code:e.toLowerCase().trim()});if(n){let e=n.message??``;throw e.includes(`invalid_or_expired_code`)?Error(`Kode tidak valid atau sudah kadaluarsa`):e.includes(`already_linked`)?Error(`Akunmu sudah terhubung ke partner`):e.includes(`cannot_link_to_self`)?Error(`Tidak bisa connect ke akun sendiri`):e.includes(`partner_already_linked`)?Error(`Partner sudah terhubung ke orang lain`):Error(`Gagal menghubungkan akun. Coba lagi.`)}return t}async function v(e,t){let{error:n}=await r.from(`profiles`).update({relationship_start:t}).eq(`id`,e);if(n)throw n}var y=null;function b(){return y||(y=document.createElement(`div`),y.className=`fixed bottom-[calc(64px+1rem)] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[390px] z-50 flex flex-col gap-2 pointer-events-none`,document.body.appendChild(y)),y}function x(e,t=`default`,n=3e3){let r=b(),i={default:`bg-ink`,success:`bg-success`,error:`bg-danger`}[t],a=document.createElement(`div`);a.className=`${i} text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg animate-[toast-in_0.2s_ease]`,a.textContent=e,r.appendChild(a),setTimeout(()=>{a.style.opacity=`0`,a.style.transition=`opacity 0.2s ease`,setTimeout(()=>a.remove(),200)},n)}function S(e){let t=new Date(e);t.setHours(0,0,0,0);let n=new Date;return n.setHours(0,0,0,0),Math.floor((n.getTime()-t.getTime())/864e5)}function C(e){let t=new Date(e),n=new Date,r=new Date(n.getFullYear(),t.getMonth(),t.getDate());return r>n?r:new Date(n.getFullYear()+1,t.getMonth(),t.getDate())}function w(e){return new Date(e).toLocaleDateString(`id-ID`,{day:`numeric`,month:`long`,year:`numeric`})}function T(e){return new Date(e).toLocaleDateString(`id-ID`,{day:`numeric`,month:`short`})}function E(e){let t=Date.now()-new Date(e).getTime(),n=Math.floor(t/6e4),r=Math.floor(t/36e5),i=Math.floor(t/864e5);return n<1?`baru saja`:n<60?`${n}m lalu`:r<24?`${r}j lalu`:i<7?`${i}h lalu`:T(e)}function D(){return new Date().toISOString().split(`T`)[0]}async function O(){let r=document.createElement(`div`);r.className=`min-h-dvh flex flex-col justify-center px-6 pb-12 pt-safe-12 bg-bg`;let i=t().user,a=`choice`,o=await h(i.id),s=!o.expiresAt||new Date(o.expiresAt)<new Date;async function c(){if(r.innerHTML=``,a===`choice`)r.innerHTML=`
        <div class="mb-10">
          <h2 class="font-display text-3xl text-ink mb-2">Halo, ${i.name} 👋</h2>
          <p class="text-sm text-ink-muted">Hubungkan akun kamu dengan partner, atau lanjut dulu tanpa partner.</p>
        </div>
        <div class="flex flex-col gap-3">
          <button id="btn-invite" class="w-full py-4 rounded-2xl bg-ink text-bg text-sm font-medium hover:opacity-80 active:scale-[0.98] transition-all">
            Tampilkan kode inviteku
          </button>
          <button id="btn-connect" class="w-full py-4 rounded-2xl border border-border text-ink text-sm font-medium hover:bg-surface-2 active:scale-[0.98] transition-all">
            Masukkan kode dari partner
          </button>
          <button id="btn-skip" class="w-full py-3 text-sm text-ink-muted hover:text-ink transition-colors cursor-pointer border-none bg-transparent mt-2">
            Lewati dulu →
          </button>
        </div>
      `,r.querySelector(`#btn-invite`).addEventListener(`click`,()=>{a=`invite`,c()}),r.querySelector(`#btn-connect`).addEventListener(`click`,()=>{a=`connect`,c()}),r.querySelector(`#btn-skip`).addEventListener(`click`,()=>{localStorage.setItem(`skip_onboarding`,`1`),n(`/`)});else if(a===`invite`)(s||o.used)&&(o.code=await g()),r.innerHTML=`
        <button id="btn-back" class="flex items-center gap-2 text-sm text-ink-muted mb-8 cursor-pointer border-none bg-transparent">
          ← Kembali
        </button>
        <div class="mb-6">
          <h2 class="font-display text-2xl text-ink mb-2">Kode Invite Kamu</h2>
          <p class="text-sm text-ink-muted">Share kode ini ke — partner kamu harus daftar dulu, lalu masukkan kode ini.</p>
        </div>

        <div class="bg-surface-2 rounded-2xl p-8 text-center mb-6">
          <p class="font-mono text-2xl font-semibold tracking-[0.2em] text-ink select-all">${o.code}</p>
          <p class="text-xs text-ink-muted mt-3">Berlaku 24 jam · Sekali pakai</p>
        </div>

        <div class="flex flex-col gap-3">
          <button id="btn-copy" class="w-full py-3.5 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent-h active:scale-[0.98] transition-all">
            Salin Kode
          </button>
          <button id="btn-refresh" class="w-full py-3.5 rounded-full border border-border text-ink text-sm font-medium hover:bg-surface-2 active:scale-[0.98] transition-all">
            Reload (cek apakah partner sudah connect)
          </button>
        </div>
      `,r.querySelector(`#btn-back`).addEventListener(`click`,()=>{a=`choice`,c()}),r.querySelector(`#btn-copy`).addEventListener(`click`,async()=>{await navigator.clipboard.writeText(o.code),x(`Kode disalin!`,`success`)}),r.querySelector(`#btn-refresh`).addEventListener(`click`,()=>window.location.reload());else if(a===`connect`){r.innerHTML=`
        <button id="btn-back" class="flex items-center gap-2 text-sm text-ink-muted mb-8 cursor-pointer border-none bg-transparent">
          ← Kembali
        </button>
        <div class="mb-8">
          <h2 class="font-display text-2xl text-ink mb-2">Masukkan Kode</h2>
          <p class="text-sm text-ink-muted">Minta kode invite dari partner kamu.</p>
        </div>
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-ink" for="code-input">Kode Invite Partner</label>
            <input id="code-input" class="field font-mono text-xl text-center tracking-[0.15em] uppercase"
              type="text" placeholder="abc123..." maxlength="32" autocomplete="off" autocapitalize="none" />
          </div>
          <p id="connect-error" class="text-sm text-danger hidden"></p>
          <button id="btn-link" class="w-full py-3.5 rounded-full bg-ink text-bg text-sm font-medium hover:opacity-80 active:scale-[0.98] transition-all disabled:opacity-40">
            Hubungkan
          </button>
        </div>
      `,r.querySelector(`#btn-back`).addEventListener(`click`,()=>{a=`choice`,c()});let t=r.querySelector(`#btn-link`),n=r.querySelector(`#connect-error`);t.addEventListener(`click`,async()=>{let i=r.querySelector(`#code-input`).value.trim();if(i){t.disabled=!0,t.textContent=`Menghubungkan...`,n.classList.add(`hidden`);try{let t=await _(i),n=await l();e({user:n,partner:n?.partner_id?await u(n.partner_id):null,couple_id:t}),a=`date`,c()}catch(e){n.textContent=e instanceof Error?e.message:`Gagal menghubungkan`,n.classList.remove(`hidden`),t.disabled=!1,t.textContent=`Hubungkan`}}})}else if(a===`date`){let{user:e}=t();r.innerHTML=`
        <div class="text-center mb-10">
          <div class="text-4xl mb-4">🌸</div>
          <h2 class="font-display text-2xl text-ink mb-2">Yeay, kalian terhubung!</h2>
          <p class="text-sm text-ink-muted">Kamu dan ${t().partner?.name??`partner`} sekarang sudah terhubung.<br>Kapan kalian mulai bersama?</p>
        </div>
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-ink" for="date-input">Tanggal mulai bersama</label>
            <input id="date-input" class="field" type="date" max="${D()}" value="${e?.relationship_start??``}" />
          </div>
          <button id="btn-save" class="w-full py-3.5 rounded-full bg-ink text-bg text-sm font-medium hover:opacity-80 active:scale-[0.98] transition-all disabled:opacity-40">
            Simpan & Mulai
          </button>
          <button id="btn-skip" class="w-full py-3.5 rounded-full border border-border text-ink-muted text-sm font-medium hover:bg-surface-2 active:scale-[0.98] transition-all">
            Lewati dulu
          </button>
        </div>
      `;let i=r.querySelector(`#btn-save`);async function a(t){i.disabled=!0,t&&e&&await v(e.id,t),n(`/`),window.location.reload()}i.addEventListener(`click`,async()=>{let e=r.querySelector(`#date-input`).value;await a(e||void 0)}),r.querySelector(`#btn-skip`).addEventListener(`click`,()=>a())}}return await c(),r}var k=`modulepreload`,A=function(e){return`/appdate/`+e},j={},M=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}r=o(t.map(t=>{if(t=A(t,n),t in j)return;j[t]=!0;let r=t.endsWith(`.css`),i=r?`[rel="stylesheet"]`:``;if(n)for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${i}`))return;let o=document.createElement(`link`);if(o.rel=r?`stylesheet`:k,r||(o.as=`script`),o.crossOrigin=``,o.href=t,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),r)return new Promise((e,n)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},N={home:()=>M(()=>import(`./home-DAbDiiYu.js`).then(e=>e.renderHome()),__vite__mapDeps([0,1,2,3])),timeline:()=>M(()=>import(`./timeline-BlUOXIfh.js`).then(e=>e.renderTimeline()),__vite__mapDeps([4,1,5,2,3,6])),timelineAdd:()=>M(()=>import(`./timeline-add-DWYeVdn9.js`).then(e=>e.renderTimelineAdd()),__vite__mapDeps([7,1,3])),planner:()=>M(()=>import(`./planner-57ySuaII.js`).then(e=>e.renderPlanner()),__vite__mapDeps([8,1,2])),plannerAdd:()=>M(()=>import(`./planner-add-C9u6IpUn.js`).then(e=>e.renderPlannerAdd()),__vite__mapDeps([9,1])),chat:()=>M(()=>import(`./chat-ZBcZ9ikQ.js`).then(e=>e.renderChat()),__vite__mapDeps([10,1,2,6])),location:()=>M(()=>import(`./location-phhZZ4Je.js`).then(e=>e.renderLocation()),__vite__mapDeps([11,1,2])),settings:()=>M(()=>import(`./settings-Byo23jMC.js`).then(e=>e.renderSettings()),__vite__mapDeps([12,1,5,2,3,6]))};i(`/auth`,m),i(`/onboarding`,O),i(`/`,N.home),i(`/timeline`,N.timeline),i(`/timeline/add`,N.timelineAdd),i(`/planner`,N.planner),i(`/planner/add`,N.plannerAdd),i(`/chat`,N.chat),i(`/location`,N.location),i(`/settings`,N.settings),i(`*`,()=>(n(`/`),document.createElement(`div`)));async function P(){let t=document.getElementById(`app`);t.innerHTML=`
    <div class="flex flex-col items-center justify-center min-h-dvh gap-4 bg-bg">
      <div class="spinner"></div>
    </div>
  `;try{let{data:{session:i}}=await r.auth.getSession();if(!i){e({isLoading:!1}),a(t),n(`/auth`);return}let o=await l();if(!o){await r.auth.signOut(),e({isLoading:!1}),a(t),n(`/auth`),setTimeout(()=>{let e=document.createElement(`p`);e.className=`text-center text-sm text-danger px-6 mt-4`,e.textContent=`Akun lama terdeteksi sebelum setup selesai. Silakan daftar ulang.`,document.getElementById(`app`)?.querySelector(`.page, div`)?.after(e)},300);return}e({user:o,partner:o.partner_id?await u(o.partner_id):null,couple_id:o.couple_id,isLoading:!1}),a(t);let s=window.location.hash.slice(1),c=localStorage.getItem(`skip_onboarding`)===`1`;!o.partner_id&&!c?n(`/onboarding`):(!s||s===`/auth`||s===`/onboarding`)&&n(`/`)}catch(n){let r=n instanceof Error?n.message:`Terjadi kesalahan`;t.innerHTML=`
      <div class="flex flex-col items-center justify-center min-h-dvh gap-6 px-8 bg-bg text-center">
        <p class="font-display text-xl text-ink">Gagal memuat</p>
        <p class="text-sm text-ink-muted max-w-xs">${r}</p>
        <button onclick="window.location.reload()"
          class="px-6 py-3 rounded-full bg-ink text-bg text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer border-none">
          Coba Lagi
        </button>
      </div>
    `,e({isLoading:!1,error:r})}}r.auth.onAuthStateChange(e=>{e===`SIGNED_OUT`&&(n(`/auth`),window.location.reload())}),P();export{C as a,h as c,p as d,c as f,T as i,g as l,d as m,w as n,D as o,f as p,E as r,x as s,S as t,v as u};
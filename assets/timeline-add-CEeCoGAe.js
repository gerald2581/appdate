import{i as e,n as t,o as n}from"./router-SnC_tAPp.js";import{o as r,s as i}from"./index-DhKrvOob.js";import{i as a}from"./storage-j0tHUYzK.js";function o(){let o=document.createElement(`div`),{user:s,couple_id:c}=e();if(!s||!c)return o;let l=[];o.innerHTML=`
    <div class="min-h-dvh bg-bg">
      <div class="flex items-center gap-3 px-4 pt-safe-8 pb-6">
        <button id="btn-back"
          class="w-9 h-9 rounded-full border border-border flex items-center justify-center text-ink-muted hover:bg-surface-2 cursor-pointer bg-transparent flex-shrink-0">
          ←
        </button>
        <h1 class="font-display text-xl text-ink">Tambah Kenangan</h1>
      </div>

      <form id="form" class="px-4 flex flex-col gap-5 pb-12" novalidate>

        <!-- Multi-photo picker -->
        <div>
          <label for="photo-input" class="block cursor-pointer">
            <div id="photo-zone"
              class="w-full min-h-[11rem] rounded-2xl bg-surface-2 border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-accent transition-colors overflow-hidden p-3">
              <span class="text-3xl opacity-30">📷</span>
              <span class="text-xs text-ink-muted">Tap untuk pilih foto (bisa lebih dari 1)</span>
            </div>
            <input id="photo-input" type="file" accept="image/*" multiple class="hidden" />
          </label>
          <!-- Upload progress -->
          <div id="upload-progress" class="hidden mt-3">
            <div class="flex justify-between text-xs text-ink-muted mb-1">
              <span id="progress-label">Mengupload...</span>
              <span id="progress-count"></span>
            </div>
            <div class="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
              <div id="progress-bar" class="h-full rounded-full transition-all duration-300"
                   style="background:linear-gradient(90deg,#c8826a,#d4956a); width:0%"></div>
            </div>
          </div>
        </div>

        <!-- Title -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-ink" for="title">Judul *</label>
          <input id="title" class="field" type="text" placeholder="Nama momen ini..." required maxlength="100" />
        </div>

        <!-- Type + Date row -->
        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-ink" for="type">Jenis</label>
            <select id="type" class="field">
              <option value="memory">Kenangan</option>
              <option value="milestone">Milestone</option>
              <option value="photo">Foto</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-ink" for="date">Tanggal *</label>
            <input id="date" class="field" type="date" value="${r()}" max="${r()}" required />
          </div>
        </div>

        <!-- Description -->
        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-ink" for="description">Cerita (opsional)</label>
          <textarea id="description" class="field" rows="3" placeholder="Tulis cerita di balik momen ini..."></textarea>
        </div>

        <p id="error" class="text-sm text-danger hidden"></p>

        <button id="btn-submit" type="submit"
          class="w-full py-3.5 rounded-full bg-ink text-bg text-sm font-medium
                 hover:opacity-80 active:scale-[0.98] transition-all cursor-pointer border-none
                 disabled:opacity-40 disabled:cursor-not-allowed mt-2">
          Simpan Kenangan
        </button>
      </form>
    </div>
  `;let u=o.querySelector(`#photo-input`),d=o.querySelector(`#photo-zone`),f=o.querySelector(`#upload-progress`),p=o.querySelector(`#progress-bar`),m=o.querySelector(`#progress-label`),h=o.querySelector(`#progress-count`);u.addEventListener(`change`,()=>{l=Array.from(u.files??[]),l.length!==0&&(l.length===1?d.innerHTML=`<img src="${URL.createObjectURL(l[0])}" class="w-full h-full object-cover rounded-xl" />`:d.innerHTML=`
        <div class="grid gap-1.5 w-full" style="grid-template-columns: repeat(${Math.min(l.length,3)}, 1fr)">
          ${l.map(e=>`<div class="aspect-square rounded-xl overflow-hidden bg-surface-2">
              <img src="${URL.createObjectURL(e)}" class="w-full h-full object-cover" />
            </div>`).join(``)}
        </div>
        <p class="text-xs text-ink-muted mt-2">${l.length} foto dipilih</p>
      `)}),o.querySelector(`#btn-back`).addEventListener(`click`,()=>t(`/timeline`));let g=o.querySelector(`#form`),_=o.querySelector(`#btn-submit`),v=o.querySelector(`#error`);return g.addEventListener(`submit`,async e=>{e.preventDefault(),_.disabled=!0,v.classList.add(`hidden`);let r=o.querySelector(`#title`).value.trim(),u=o.querySelector(`#type`).value,d=o.querySelector(`#date`).value,g=o.querySelector(`#description`).value.trim();if(!r){v.textContent=`Judul wajib diisi`,v.classList.remove(`hidden`),_.disabled=!1;return}try{if(l.length>0){f.classList.remove(`hidden`),_.textContent=`Mengupload foto...`;let e=0,t=[];for(let n of l){let r=await a(c,n,t=>{let n=(e+t/100)/l.length*100;p.style.width=`${n.toFixed(0)}%`,m.textContent=`Mengupload foto ${e+1} dari ${l.length}...`,h.textContent=`${n.toFixed(0)}%`});t.push(r),e++}p.style.width=`100%`,m.textContent=`Menyimpan kenangan...`,_.textContent=`Menyimpan...`;let o=t.map((e,t)=>({couple_id:c,title:t===0?r:`${r} (${t+1})`,type:u,memory_date:d,description:t===0&&g||null,photo_path:e,created_by:s.id})),{error:v}=await n.from(`memories`).insert(o);if(v)throw v;i(`${t.length} kenangan tersimpan ✦`,`success`)}else{_.textContent=`Menyimpan...`;let{error:e}=await n.from(`memories`).insert({couple_id:c,title:r,type:u,memory_date:d,description:g||null,photo_path:null,created_by:s.id});if(e)throw e;i(`Kenangan tersimpan ✦`,`success`)}t(`/timeline`)}catch(e){f.classList.add(`hidden`),v.textContent=e instanceof Error?e.message:`Gagal menyimpan`,v.classList.remove(`hidden`),_.disabled=!1,_.textContent=`Simpan Kenangan`}}),o}export{o as renderTimelineAdd};
import{i as e,n as t,o as n}from"./router-SnC_tAPp.js";import{o as r,s as i}from"./index-BKN2W0tb.js";import{i as a}from"./storage-j0tHUYzK.js";var o=`There are places we return to not because we have to, but because something in us never truly left.(Some moments don't ask to be remembered — they simply stay, quietly, like a song you didn't know you learned.(In the middle of everything ordinary, there was this — and it was enough to change the whole day.(Not every beautiful thing is loud. Some of them just sit beside you and breathe.(I didn't need a map. I only needed to know you were there, and that was direction enough.(Time doesn't stop, but sometimes it slows — just long enough to let you feel it fully.(The best things aren't planned. They arrive quietly, take off their coat, and stay.(I keep coming back to this moment the way you return to a favourite page — not to find something new, but to feel something real.(There is a kind of warmth that doesn't ask for anything. It just exists, steady and soft, the way you do.(We were just here, doing nothing particular — and somehow that became everything.(You don't need to explain certain things. Some feelings are only for the two people who were there.(The world kept moving. We didn't notice. We were too busy being still together.(It's the small things that hold the most weight — the way the light fell, the way you laughed, the quiet that followed.(Not every love is written in grand gestures. Some of it lives in an afternoon like this one.(I would choose this again. Not the version where everything is perfect — this version, exactly as it was.(There is something about being known by someone that makes even the simplest moment feel like shelter.(We didn't say much. We didn't have to. Being close was already the whole conversation.(This is what I want to remember when everything else fades — not the big moments, but this one.(Somewhere between ordinary and extraordinary, there is a place only two people can find. We found it here.(Beauty isn't always something you seek. Sometimes it just happens while you're not looking, and you catch it just in time.(The photograph holds what words can't quite reach — the particular quality of that light, that silence, that feeling.(I don't think happiness always announces itself. Sometimes it just settles in quietly, like this.(Every story has a page that doesn't need to be read aloud. This is ours.(There's a version of every day that no one else will ever see. This one belongs to us.(You have a way of making ordinary places feel like somewhere I've always wanted to be.(Nothing remarkable happened. Nothing remarkable needed to.(Some things are too tender to describe. So we let the image speak instead.(I didn't fall in love all at once. I fell slowly, in moments exactly like this.(The softest kind of joy is the kind you don't realise you're carrying until later, when you look back.(We built nothing here — no milestone, no occasion. Just the quiet certainty of being together.(Time is always moving. But this moment felt like it waited — just long enough for us to notice.(There is a difference between being seen and being known. You have always known me.(I don't need the whole world to make sense. I just need you to be in the frame.(The day was simple. The feeling was not.(Not all anchors are heavy. Some of them are as light as a person who stays.`.split(`(`);function s(){return o[Math.floor(Math.random()*o.length)]}function c(){let o=document.createElement(`div`),{user:c,couple_id:l}=e();if(!c||!l)return o;let u=[];o.innerHTML=`
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

        <p id="error" class="text-sm text-danger hidden"></p>

        <button id="btn-submit" type="submit"
          class="w-full py-3.5 rounded-full bg-ink text-bg text-sm font-medium
                 hover:opacity-80 active:scale-[0.98] transition-all cursor-pointer border-none
                 disabled:opacity-40 disabled:cursor-not-allowed mt-2">
          Simpan Kenangan
        </button>
      </form>
    </div>
  `;let d=o.querySelector(`#photo-input`),f=o.querySelector(`#photo-zone`),p=o.querySelector(`#upload-progress`),m=o.querySelector(`#progress-bar`),h=o.querySelector(`#progress-label`),g=o.querySelector(`#progress-count`),_=[],v=()=>{_.forEach(e=>URL.revokeObjectURL(e)),_.length=0};d.addEventListener(`change`,()=>{let e=Array.from(d.files??[]);if(e.length===0)return;if(e.length>20){i(`Maksimal 20 foto sekaligus`,`error`),d.value=``;return}v(),u=e;let t=e.slice(0,9);if(t.forEach(e=>_.push(URL.createObjectURL(e))),e.length===1)f.innerHTML=`<img src="${_[0]}" class="w-full h-full object-cover rounded-xl" />`;else{let n=e.length-t.length;f.innerHTML=`
        <div class="grid gap-1.5 w-full" style="grid-template-columns: repeat(${Math.min(t.length,3)}, 1fr)">
          ${t.map((e,r)=>{let i=n>0&&r===t.length-1;return`<div class="aspect-square rounded-xl overflow-hidden bg-surface-2 relative">
          <img src="${_[r]}" class="w-full h-full object-cover" />
          ${i?`<div class="absolute inset-0 flex items-center justify-center rounded-xl"
              style="background:rgba(26,25,22,0.55)">
            <span class="text-white text-sm font-bold">+${n+1}</span>
          </div>`:``}
        </div>`}).join(``)}
        </div>
        <p class="text-xs text-ink-muted mt-2">${e.length} foto dipilih</p>
      `}}),o.querySelector(`#btn-back`).addEventListener(`click`,()=>{v(),t(`/timeline`)});let y=o.querySelector(`#form`),b=o.querySelector(`#btn-submit`),x=o.querySelector(`#error`);return y.addEventListener(`submit`,async e=>{e.preventDefault(),b.disabled=!0,x.classList.add(`hidden`);let r=o.querySelector(`#title`).value.trim(),d=o.querySelector(`#type`).value,f=o.querySelector(`#date`).value;if(!r){x.textContent=`Judul wajib diisi`,x.classList.remove(`hidden`),b.disabled=!1;return}try{if(u.length>0){p.classList.remove(`hidden`),b.textContent=`Mengupload foto...`;let e=0,t=[];for(let n of u){let r=await a(l,n,t=>{let n=(e+t/100)/u.length*100;m.style.width=`${n.toFixed(0)}%`,h.textContent=`Mengupload foto ${e+1} dari ${u.length}...`,g.textContent=`${n.toFixed(0)}%`});t.push(r),e++}m.style.width=`100%`,h.textContent=`Menyimpan kenangan...`,b.textContent=`Menyimpan...`;let o=t.map((e,t)=>({couple_id:l,title:t===0?r:`${r} ${t+1}`,type:d,memory_date:f,description:s(),photo_path:e,created_by:c.id})),{error:_}=await n.from(`memories`).insert(o);if(_)throw _;i(`${t.length} kenangan tersimpan ✦`,`success`)}else{b.textContent=`Menyimpan...`;let{error:e}=await n.from(`memories`).insert({couple_id:l,title:r,type:d,memory_date:f,description:s(),photo_path:null,created_by:c.id});if(e)throw e;i(`Kenangan tersimpan ✦`,`success`)}v(),t(`/timeline`)}catch(e){p.classList.add(`hidden`),x.textContent=e instanceof Error?e.message:`Gagal menyimpan`,x.classList.remove(`hidden`),b.disabled=!1,b.textContent=`Simpan Kenangan`}}),o}export{c as renderTimelineAdd};
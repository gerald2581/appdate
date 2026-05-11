import{i as e,n as t,o as n}from"./router-SnC_tAPp.js";import{s as r}from"./index-BAHrnUkX.js";function i(){let i=document.createElement(`div`),{user:a,couple_id:o}=e();if(!a||!o)return i;i.innerHTML=`
    <div class="min-h-dvh bg-bg">
      <div class="flex items-center gap-3 px-4 pt-safe-8 pb-6">
        <button id="btn-back"
          class="w-9 h-9 rounded-full border border-border flex items-center justify-center text-ink-muted hover:bg-surface-2 cursor-pointer bg-transparent flex-shrink-0">
          ←
        </button>
        <h1 class="font-display text-xl text-ink">Rencana Kencan</h1>
      </div>

      <form id="form" class="px-4 flex flex-col gap-5 pb-12" novalidate>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-ink" for="title">Nama Kencan *</label>
          <input id="title" class="field" type="text" placeholder="Dinner di café favorit" required maxlength="100" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-ink" for="location">Lokasi</label>
          <input id="location" class="field" type="text" placeholder="Nama tempat atau alamat" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-ink" for="planned_date">Tanggal & Waktu</label>
          <input id="planned_date" class="field" type="datetime-local" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-ink" for="budget">Budget (Rp)</label>
          <input id="budget" class="field" type="number" placeholder="0" min="0" step="1000" />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-sm font-medium text-ink" for="description">Catatan</label>
          <textarea id="description" class="field" rows="3" placeholder="Hal-hal yang perlu disiapkan..."></textarea>
        </div>

        <p id="error" class="text-sm text-danger hidden"></p>

        <button id="btn-submit" type="submit"
          class="w-full py-3.5 rounded-full bg-ink text-bg text-sm font-medium
                 hover:opacity-80 active:scale-[0.98] transition-all cursor-pointer border-none
                 disabled:opacity-40 disabled:cursor-not-allowed mt-2">
          Simpan Rencana
        </button>
      </form>
    </div>
  `,i.querySelector(`#btn-back`).addEventListener(`click`,()=>t(`/planner`));let s=i.querySelector(`#form`),c=i.querySelector(`#btn-submit`),l=i.querySelector(`#error`);return s.addEventListener(`submit`,async e=>{e.preventDefault(),c.disabled=!0,c.textContent=`Menyimpan...`,l.classList.add(`hidden`);let s=i.querySelector(`#title`).value.trim(),u=i.querySelector(`#location`).value.trim(),d=i.querySelector(`#planned_date`).value,f=i.querySelector(`#budget`).value,p=i.querySelector(`#description`).value.trim();try{let{error:e}=await n.from(`date_plans`).insert({couple_id:o,title:s,location:u||null,planned_date:d||null,budget:f?parseInt(f,10):null,description:p||null,created_by:a.id});if(e)throw e;r(`Rencana tersimpan ◎`,`success`),t(`/planner`)}catch(e){l.textContent=e instanceof Error?e.message:`Gagal menyimpan`,l.classList.remove(`hidden`),c.disabled=!1,c.textContent=`Simpan Rencana`}}),i}export{i as renderPlannerAdd};
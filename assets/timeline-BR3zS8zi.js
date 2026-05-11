import{i as e,n as t,o as n}from"./router-SnC_tAPp.js";import{n as r,s as i}from"./index-DhKrvOob.js";import{t as a}from"./nav-B2cJ5DU3.js";import{t as o}from"./escape-1QVFIIou.js";import{n as s}from"./storage-j0tHUYzK.js";import{t as c}from"./confirm-modal-CDDWdlXn.js";var l=82,u=82,d=1.32,f=.28,p=.036,m=.09,h=.2,g=.22,_=160,v=84,y=[`200,130,106`,`122,158,200`,`106,184,122`,`212,149,106`,`160,130,200`,`180,160,106`];function b(e,t,n){return e+(t-e)*n}function x(e,t){let n=Math.abs(e/t-.5)*2;return b(d,f,n*n)}function S(e,t){return b(1,.36,Math.abs(e/t-.5)*2)}async function C(){let f=document.createElement(`div`),{couple_id:C}=e();if(!C)return f;let{data:w,error:T}=await n.from(`memories`).select(`*`).eq(`couple_id`,C).order(`memory_date`,{ascending:!1}),E=w??[],D=await Promise.all(E.map(async e=>({...e,photoUrl:e.photo_path?await s(e.photo_path).catch(()=>null):null})));f.style.cssText=`
    position: relative;
    height: 100dvh;
    overflow: hidden;
    background:
      radial-gradient(ellipse at 18% 50%, rgba(255,200,180,0.45) 0%, transparent 58%),
      radial-gradient(ellipse at 82% 22%, rgba(200,170,220,0.32) 0%, transparent 55%),
      radial-gradient(ellipse at 55% 82%, rgba(255,220,160,0.35) 0%, transparent 55%),
      #fdf4f0;
  `;let O=document.createElement(`div`);if(O.style.cssText=`
    position: absolute; top: 0; left: 0; right: 0;
    z-index: 300;
    padding: env(safe-area-inset-top, 0px) 0 0;
    pointer-events: none;
  `,O.innerHTML=`
    <!-- Gradient fade so cards beneath look natural -->
    <div style="
      padding: 20px 20px 28px;
      display: flex; justify-content: space-between; align-items: flex-end;
      background: linear-gradient(to bottom,
        rgba(253,244,240,1.00)  0%,
        rgba(253,244,240,0.96) 60%,
        rgba(253,244,240,0.00) 100%);
      pointer-events: all;
    ">
      <!-- Left: label + title + count -->
      <div>
        <p style="
          font-size:9.5px;text-transform:uppercase;letter-spacing:.28em;
          color:#c8826a;font-weight:600;margin:0 0 5px">
          Kenangan
        </p>
        <h1 style="
          font-family:'Playfair Display',Georgia,serif;
          font-size:28px;color:#1a1916;line-height:1.1;margin:0 0 5px">
          Timeline
        </h1>
        <p style="font-size:11px;color:#9a9088;margin:0;letter-spacing:.02em">
          ${D.length} momen bersama
        </p>
      </div>

      <!-- Right: Tambah button -->
      <button id="btn-add" style="
        display:flex;align-items:center;gap:6px;
        padding:10px 18px;border-radius:999px;
        background:linear-gradient(135deg,#c8826a,#d4956a);
        color:#fff;font-size:13px;font-weight:600;
        border:none;cursor:pointer;font-family:inherit;
        box-shadow:0 4px 16px rgba(200,130,106,0.38);
        flex-shrink:0;
      ">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2.5" stroke-linecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Tambah
      </button>
    </div>
  `,f.appendChild(O),D.length===0){let e=document.createElement(`div`);return e.style.cssText=`
      position:absolute;inset:0;display:flex;flex-direction:column;
      align-items:center;justify-content:center;text-align:center;padding:32px;
    `,e.innerHTML=`
      <p style="font-size:52px;opacity:.14;margin-bottom:18px">✦</p>
      <p style="font-size:16px;font-weight:600;color:#1a1916;margin-bottom:8px">Belum ada kenangan</p>
      <p style="font-size:13px;color:#9a9088;margin-bottom:24px">Catat momen pertama kalian bersama</p>
      <button id="btn-add-empty" style="
        padding:12px 28px;border-radius:999px;
        background:linear-gradient(135deg,#c8826a,#d4956a);
        color:white;font-size:13px;font-weight:600;
        border:none;cursor:pointer;font-family:inherit;
        box-shadow:0 4px 16px rgba(200,130,106,0.4);
      ">Tambah Kenangan</button>
    `,f.appendChild(e),f.querySelector(`#btn-add`).addEventListener(`click`,()=>t(`/timeline/add`)),f.querySelector(`#btn-add-empty`).addEventListener(`click`,()=>t(`/timeline/add`)),f.appendChild(a()),f}if(T){let e=document.createElement(`p`);e.style.cssText=`position:absolute;top:140px;left:0;right:0;text-align:center;font-size:13px;color:#c87878`,e.textContent=`Gagal memuat kenangan. Coba refresh.`,f.appendChild(e)}let k=document.createElement(`div`);k.style.cssText=`position:absolute;inset:0;overflow:visible;`,f.appendChild(k);let A=document.createElement(`div`);A.style.cssText=`
    position:fixed;inset:0;z-index:10000;
    display:flex;align-items:flex-end;justify-content:center;
    background:rgba(0,0,0,0);pointer-events:none;
    transition:background .28s ease;
  `;let j=document.createElement(`div`);j.style.cssText=`
    position:relative;
    width:100%;max-width:430px;
    background:rgba(255,255,255,0.97);
    backdrop-filter:blur(32px);-webkit-backdrop-filter:blur(32px);
    border-radius:28px 28px 0 0;
    border-top:1px solid rgba(255,255,255,0.85);
    box-shadow:0 -8px 40px rgba(0,0,0,0.15);
    transform:translateY(100%);
    overflow-y:auto;max-height:82vh;
    padding-bottom:env(safe-area-inset-bottom,0px);
  `,A.appendChild(j),document.body.appendChild(A);let M={memory:`Kenangan`,milestone:`Milestone`,photo:`Foto`},N=(e,t)=>{if(A.style.pointerEvents=`all`,e.photoUrl){A.dataset.mode=`lightbox`,A.style.background=`rgba(253,244,240,0.90)`,A.style.backdropFilter=`blur(24px) saturate(1.3)`,A.style.alignItems=`stretch`,j.style.transform=`none`,j.style.maxHeight=`100vh`,j.style.borderRadius=`0`,j.style.background=`transparent`,j.style.boxShadow=`none`,j.style.backdropFilter=`none`,j.style.borderTop=`none`,j.style.display=`flex`,j.style.flexDirection=`column`,j.style.alignItems=`center`,j.style.justifyContent=`flex-start`,j.style.width=`100%`,j.style.maxWidth=`100%`,j.style.height=`100%`,j.style.padding=`0`,j.style.overflowY=`hidden`;let a=D.filter(e=>e.photoUrl),s=a.findIndex(t=>t.id===e.id);s<0&&(s=0);let l=e=>`
        width:38px;height:38px;border-radius:50%;padding:0;cursor:pointer;
        background:rgba(255,255,255,0.75);backdrop-filter:blur(12px);
        border:1px solid ${e?`rgba(200,120,120,0.30)`:`rgba(255,255,255,0.70)`};
        box-shadow:0 2px 8px rgba(0,0,0,0.06),inset 0 1px 0 rgba(255,255,255,0.9);
        color:${e?`#c87878`:`#1a1916`};
        display:flex;align-items:center;justify-content:center
      `,u=a.length>1?`<div id="lb-dots" style="display:flex;align-items:center;justify-content:center;
                                     gap:5px;padding:10px 0 4px;flex-shrink:0">
            ${a.map((e,t)=>`
              <div class="lb-dot" style="
                height:6px;border-radius:99px;transition:all .25s ease;
                width:${t===s?`18px`:`6px`};
                background:${t===s?`#c8826a`:`rgba(26,25,22,0.18)`}">
              </div>`).join(``)}
           </div>`:``;j.innerHTML=`
        <!-- Top bar -->
        <div style="width:100%;display:flex;align-items:center;justify-content:space-between;
                    padding:max(16px,env(safe-area-inset-top,16px)) 20px 12px;flex-shrink:0">
          <button id="btn-delete-memory" style="${l(!0)}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
          <button id="btn-close-lb" style="${l(!1)}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Swipe area -->
        <div id="lb-slide" style="flex:1;display:flex;align-items:center;
                                   padding:0 20px;min-height:0;touch-action:pan-y;overflow:hidden">
          <div id="lb-frame" style="width:100%;
                background:rgba(255,255,255,0.68);
                border:1px solid rgba(255,255,255,0.80);
                box-shadow:0 4px 24px rgba(0,0,0,0.07),inset 0 1px 0 rgba(255,255,255,0.9);
                border-radius:20px;padding:8px;
                transition:transform .25s cubic-bezier(.32,.72,0,1),opacity .2s ease">
            <img id="lb-img" src="${o(a[s].photoUrl)}"
              style="width:100%;max-height:calc(100dvh - 180px);border-radius:13px;
                     object-fit:contain;display:block"
              alt="" />
          </div>
        </div>

        ${u}

        <!-- Date -->
        <div style="padding:10px 24px max(20px,env(safe-area-inset-bottom,20px));
                    flex-shrink:0;text-align:center">
          <time id="lb-date" style="font-size:12px;color:#9a9088;letter-spacing:.06em">
            ${o(r(a[s].memory_date))}
          </time>
        </div>
      `;let d=j.querySelector(`#lb-frame`),f=j.querySelector(`#lb-img`),p=j.querySelector(`#lb-date`),m=j.querySelectorAll(`.lb-dot`),h=(e,t)=>{e<0||e>=a.length||(d.style.transition=`transform .22s ease,opacity .18s ease`,d.style.transform=`translateX(${t<0?`-60px`:`60px`})`,d.style.opacity=`0`,setTimeout(()=>{s=e;let n=a[s];f.src=n.photoUrl,p.textContent=r(n.memory_date),m.forEach((e,t)=>{let n=e;n.style.width=t===s?`18px`:`6px`,n.style.background=t===s?`#c8826a`:`rgba(26,25,22,0.18)`}),d.style.transition=`none`,d.style.transform=`translateX(${t<0?`60px`:`-60px`})`,d.style.opacity=`0`,requestAnimationFrame(()=>{d.style.transition=`transform .22s ease,opacity .18s ease`,d.style.transform=`translateX(0)`,d.style.opacity=`1`})},180))},g=0,_=0,v=!1,y=j.querySelector(`#lb-slide`);y.addEventListener(`touchstart`,e=>{g=e.touches[0].clientX,_=e.touches[0].clientY,v=!0},{passive:!0}),y.addEventListener(`touchmove`,e=>{if(!v)return;let t=e.touches[0].clientX-g,n=e.touches[0].clientY-_;Math.abs(t)>Math.abs(n)&&(d.style.transition=`none`,d.style.transform=`translateX(${t*.35}px)`)},{passive:!0}),y.addEventListener(`touchend`,e=>{if(!v)return;v=!1;let t=e.changedTouches[0].clientX-g,n=e.changedTouches[0].clientY-_;Math.abs(t)>Math.abs(n)&&Math.abs(t)>55?h(s+(t<0?1:-1),t<0?-1:1):(d.style.transition=`transform .2s ease`,d.style.transform=`translateX(0)`)},{passive:!0}),j.querySelector(`#btn-close-lb`).addEventListener(`click`,P),j.querySelector(`#btn-delete-memory`).addEventListener(`click`,()=>{let e=a[s],r=L.find(t=>t.mem.id===e.id)??t;c({title:`Hapus Kenangan?`,message:`"${e.title}" akan dihapus permanen.`,confirmLabel:`Hapus`,danger:!0,onConfirm:async()=>{let{error:t}=await n.from(`memories`).delete().eq(`id`,e.id);if(t)throw t;r.el.remove();let o=L.indexOf(r);o!==-1&&L.splice(o,1),a.splice(s,1),a.length===0?P():(s=Math.min(s,a.length-1),h(s,-1)),i(`Kenangan dihapus`,`success`)}})})}else A.style.background=`rgba(0,0,0,0.48)`,j.style.transform=`translateY(0)`,j.style.maxHeight=`82vh`,j.style.borderRadius=`28px 28px 0 0`,j.style.background=`rgba(255,255,255,0.97)`,j.style.boxShadow=`0 -8px 40px rgba(0,0,0,0.15)`,j.style.backdropFilter=`blur(32px)`,j.style.display=`block`,j.style.width=`100%`,j.style.height=`auto`,j.style.padding=`0`,j.style.flexDirection=``,j.style.alignItems=``,j.style.justifyContent=``,j.innerHTML=`
        <div style="width:40px;height:4px;border-radius:999px;background:rgba(0,0,0,0.12);margin:12px auto 0"></div>
        <div style="height:16px"></div>
        <div style="padding:6px 24px 16px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
            <span style="font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:#c8826a;font-weight:700">
              ${o(M[e.type]??e.type)}
            </span>
            <time style="font-size:11px;color:#9a9088">${o(r(e.memory_date))}</time>
          </div>
          <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:22px;color:#1a1916;
                     line-height:1.25;margin-bottom:${e.description?`10px`:`0`}">
            ${o(e.title)}
          </h2>
          ${e.description?`<p style="font-size:14px;color:#6b6860;line-height:1.7">${o(e.description)}</p>`:``}
        </div>
        <div style="padding:0 24px 32px">
          <button id="btn-delete-memory"
            style="width:100%;padding:12px;border-radius:14px;border:1px solid rgba(200,100,100,0.25);
                   background:rgba(200,100,100,0.06);color:#c87878;font-size:13px;font-weight:600;
                   cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:6px">
            <span>🗑</span> Hapus Kenangan
          </button>
        </div>
      `,j.querySelector(`#btn-delete-memory`).addEventListener(`click`,()=>{c({title:`Hapus Kenangan?`,message:`"${e.title}" akan dihapus permanen.`,confirmLabel:`Hapus`,danger:!0,onConfirm:async()=>{let{error:r}=await n.from(`memories`).delete().eq(`id`,e.id);if(r)throw r;t.el.remove();let a=L.indexOf(t);a!==-1&&L.splice(a,1),P(),i(`Kenangan dihapus`,`success`)}})})},P=()=>{A.dataset.mode=``,A.style.pointerEvents=`none`,A.style.background=`rgba(0,0,0,0)`,A.style.backdropFilter=``,A.style.alignItems=`flex-end`,j.style.transform=`translateY(100%)`,j.style.maxHeight=`82vh`,j.style.maxWidth=`430px`,j.style.borderRadius=`28px 28px 0 0`,j.style.borderTop=`1px solid rgba(255,255,255,0.85)`,j.style.background=`rgba(255,255,255,0.97)`,j.style.boxShadow=`0 -8px 40px rgba(0,0,0,0.15)`,j.style.backdropFilter=`blur(32px)`,j.style.display=`block`,j.style.width=`100%`,j.style.height=`auto`,j.style.overflowY=`auto`,j.style.flexDirection=``,j.style.alignItems=``,j.style.justifyContent=``,j.style.padding=``};A.addEventListener(`click`,e=>{let t=e.target;A.dataset.mode===`lightbox`?!t.closest(`button`)&&!t.closest(`#lb-frame`)&&!t.closest(`#lb-dots`)&&P():e.target===A&&P()});let F=Math.min(window.innerWidth,430),I=window.innerHeight,L=D.map((e,t)=>{let n=Math.random()*(F-l),r=_+Math.random()*Math.max(0,I-_-v-u),i=h+Math.random()*g,a=Math.random()*Math.PI*2,o=document.createElement(`div`);o.style.cssText=`
      position:absolute;top:0;left:0;
      width:${l}px;height:${u}px;
      border-radius:16px;cursor:pointer;
      will-change:transform;transform-origin:center;
    `;let s=document.createElement(`div`);if(s.style.cssText=`
      width:100%;height:100%;border-radius:16px;overflow:hidden;
      background:rgba(255,255,255,0.62);
      border:.5px solid rgba(255,255,255,0.72);
      box-shadow:0 4px 20px rgba(0,0,0,0.07),inset 0 1px 0 rgba(255,255,255,0.9);
      padding:3px;
    `,e.photoUrl){let t=document.createElement(`img`);t.src=e.photoUrl,t.draggable=!1,t.loading=`lazy`,t.style.cssText=`
        width:100%;height:100%;object-fit:cover;
        border-radius:13px;display:block;
        pointer-events:none;user-select:none;
      `,s.appendChild(t)}else{let t=document.createElement(`div`);t.style.cssText=`
        width:100%;height:100%;border-radius:13px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        padding:10px;text-align:center;
        background:linear-gradient(135deg,rgba(200,130,106,0.14),rgba(200,130,106,0.06));
      `;let n=document.createElement(`span`);n.style.cssText=`font-size:18px;margin-bottom:5px;opacity:.7`,n.textContent=`✦`;let r=document.createElement(`span`);r.style.cssText=`font-size:8.5px;font-weight:700;color:#c8826a;text-transform:uppercase;letter-spacing:.09em;line-height:1.35`,r.textContent=e.title.length>18?e.title.slice(0,18)+`…`:e.title,t.appendChild(n),t.appendChild(r),s.appendChild(t)}o.appendChild(s),k.appendChild(o);let c=y[t%y.length],d=x(n+l/2,F),f=(e,t)=>{m.hit=!0;let n=o.getBoundingClientRect(),r=(e-(n.left+n.width/2))/(n.width/2);m.tRX=-((t-(n.top+n.height/2))/(n.height/2))*26,m.tRY=r*26},p=()=>{m.hit=!1,m.tRX=0,m.tRY=0};o.addEventListener(`mousemove`,e=>f(e.clientX,e.clientY)),o.addEventListener(`mouseleave`,p),o.addEventListener(`touchmove`,e=>{e.preventDefault(),f(e.touches[0].clientX,e.touches[0].clientY)},{passive:!1}),o.addEventListener(`touchend`,p),o.addEventListener(`click`,()=>N(e,m));let m={mem:e,el:o,inner:s,rgb:c,x:n,y:r,vx:Math.cos(a)*i,vy:Math.sin(a)*i,curS:d,curO:S(n+l/2,F),rX:0,rY:0,tRX:0,tRY:0,hit:!1};return m}),R=0,z=()=>{let e=Math.min(window.innerWidth,430);for(let t of L){t.hit||(t.x+=t.vx,t.y+=t.vy,t.x<0&&(t.x=0,t.vx=Math.abs(t.vx)),t.x>e-l&&(t.x=e-l,t.vx=-Math.abs(t.vx)),t.y<_&&(t.y=_,t.vy=Math.abs(t.vy)),t.y>I-v-u&&(t.y=I-v-u,t.vy=-Math.abs(t.vy)));let n=t.x+l/2,r=t.hit?d+.16:x(n,e),i=t.hit?1:S(n,e);t.curS=b(t.curS,r,p),t.curO=b(t.curO,i,p),t.rX=b(t.rX,t.tRX,m),t.rY=b(t.rY,t.tRY,m),t.el.style.zIndex=t.hit?`100`:String(Math.round(t.curS*200));let a=t.x-l*(t.curS-1)/2,o=t.y-u*(t.curS-1)/2;if(t.el.style.transform=`translate(${a}px,${o}px) perspective(900px) rotateX(${t.rX}deg) rotateY(${t.rY}deg) scale(${t.curS})`,t.el.style.opacity=String(t.curO),t.hit)t.inner.style.boxShadow=`0 22px 60px rgba(${t.rgb},.52),0 0 44px rgba(${t.rgb},.30),inset 0 1px 0 rgba(255,255,255,.95)`;else{let e=t.curS;t.inner.style.boxShadow=`0 ${(e*5).toFixed(1)}px ${(e*22).toFixed(1)}px rgba(0,0,0,.07),inset 0 1px 0 rgba(255,255,255,.9)`}}R=requestAnimationFrame(z)};R=requestAnimationFrame(z);let B=new MutationObserver(()=>{f.isConnected||(cancelAnimationFrame(R),A.remove(),B.disconnect())});return B.observe(document.body,{childList:!0,subtree:!1}),O.querySelector(`#btn-add`).addEventListener(`click`,()=>t(`/timeline/add`)),f.appendChild(a()),f}export{C as renderTimeline};
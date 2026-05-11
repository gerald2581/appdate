import{i as e,n as t,o as n}from"./router-SnC_tAPp.js";import{n as r,s as i}from"./index-BrHllOKK.js";import{t as a}from"./nav-CjXhJ2mg.js";import{t as o}from"./escape-1QVFIIou.js";import{n as s}from"./storage-j0tHUYzK.js";import{t as c}from"./confirm-modal-CDDWdlXn.js";var l=82,u=82,d=1.2,f=.72,p=.024,m=.048,h=.08,g=42e-5,_=160,v=84,y=7,b=[`200,130,106`,`122,158,200`,`106,184,122`,`212,149,106`,`160,130,200`,`180,160,106`];function x(e,{p0:t,p1:n,p2:r}){let i=1-e;return{x:i*i*t.x+2*i*e*n.x+e*e*r.x,y:i*i*t.y+2*i*e*n.y+e*e*r.y}}function S(e,t){let n=(_+t-v)/2,r=u*.55,i=_+24,a=t-v-24;return[{p0:{x:-l,y:n-r},p1:{x:e*.5,y:i},p2:{x:e+l,y:n-r}},{p0:{x:-l,y:n+r},p1:{x:e*.5,y:a},p2:{x:e+l,y:n+r}}]}function C(e,t,n){return e+(t-e)*n}function w(e,t){if(e.inner.innerHTML=``,t.photoUrl){let n=document.createElement(`img`);n.src=t.photoUrl,n.draggable=!1,n.style.cssText=`
      width:100%;height:100%;object-fit:cover;
      border-radius:13px;display:block;pointer-events:none;user-select:none;
    `,e.inner.appendChild(n)}else{let n=document.createElement(`div`);n.style.cssText=`
      width:100%;height:100%;border-radius:13px;
      display:flex;align-items:center;justify-content:center;
      background: linear-gradient(155deg, rgba(255,255,255,0.70) 0%, rgba(255,238,228,0.48) 50%, rgba(255,220,204,0.32) 100%);
      backdrop-filter: blur(22px) saturate(1.9) brightness(1.04);
      -webkit-backdrop-filter: blur(22px) saturate(1.9) brightness(1.04);
      border: 1px solid rgba(255,255,255,0.80);
      box-shadow:
        0 6px 24px rgba(200,130,106,0.14),
        0 2px 7px rgba(200,130,106,0.08),
        inset 0 1.5px 0 rgba(255,255,255,0.94),
        inset 0 -1px 2px rgba(200,130,106,0.07);
    `,n.innerHTML=`
      <span style="
        font-family:'Playfair Display',Georgia,serif;
        font-size:26px;font-style:italic;font-weight:400;
        color:#c8826a;opacity:0.80;letter-spacing:-.01em;
        line-height:1;
        text-shadow: 0 1px 8px rgba(200,130,106,0.18);
      ">${o(t.title)}</span>`,e.inner.appendChild(n)}}async function T(){let _=document.createElement(`div`),{couple_id:v}=e();if(!v)return _;let{data:T,error:E}=await n.from(`memories`).select(`*`).eq(`couple_id`,v).order(`memory_date`,{ascending:!1}),D=T??[],O=await Promise.all(D.map(async e=>({...e,photoUrl:e.photo_path?await s(e.photo_path).catch(()=>null):null})));_.style.cssText=`
    position: relative;
    height: 100dvh;
    overflow: hidden;
    background:
      radial-gradient(ellipse at 18% 50%, rgba(255,200,180,0.45) 0%, transparent 58%),
      radial-gradient(ellipse at 82% 22%, rgba(200,170,220,0.32) 0%, transparent 55%),
      radial-gradient(ellipse at 55% 82%, rgba(255,220,160,0.35) 0%, transparent 55%),
      #fdf4f0;
  `;let k=document.createElement(`div`);if(k.style.cssText=`
    position: absolute; top: 0; left: 0; right: 0;
    z-index: 300;
    padding: env(safe-area-inset-top, 0px) 0 0;
    pointer-events: none;
  `,k.innerHTML=`
    <div style="
      padding: 20px 20px 28px;
      display: flex; justify-content: space-between; align-items: flex-end;
      background: linear-gradient(to bottom,
        rgba(253,244,240,1.00)  0%,
        rgba(253,244,240,0.96) 60%,
        rgba(253,244,240,0.00) 100%);
      pointer-events: all;
    ">
      <div>
        <p style="font-size:9.5px;text-transform:uppercase;letter-spacing:.28em;
                  color:#c8826a;font-weight:600;margin:0 0 5px">Kenangan</p>
        <h1 style="font-family:'Playfair Display',Georgia,serif;
                   font-size:28px;color:#1a1916;line-height:1.1;margin:0 0 5px">Timeline</h1>
        <p style="font-size:11px;color:#9a9088;margin:0;letter-spacing:.02em">
          ${O.length} momen bersama
        </p>
      </div>
      <button id="btn-add" style="
        display:flex;align-items:center;gap:6px;
        padding:10px 18px;border-radius:999px;
        background:linear-gradient(135deg,#c8826a,#d4956a);
        color:#fff;font-size:13px;font-weight:600;
        border:none;cursor:pointer;font-family:inherit;
        box-shadow:0 4px 16px rgba(200,130,106,0.38);flex-shrink:0;
      ">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2.5" stroke-linecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Tambah
      </button>
    </div>
  `,_.appendChild(k),O.length===0){let e=document.createElement(`div`);return e.style.cssText=`
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
    `,_.appendChild(e),_.querySelector(`#btn-add`).addEventListener(`click`,()=>t(`/timeline/add`)),_.querySelector(`#btn-add-empty`).addEventListener(`click`,()=>t(`/timeline/add`)),_.appendChild(a()),_}if(E){let e=document.createElement(`p`);e.style.cssText=`position:absolute;top:140px;left:0;right:0;text-align:center;font-size:13px;color:#c87878`,e.textContent=`Gagal memuat kenangan. Coba refresh.`,_.appendChild(e)}let A=document.createElement(`div`);A.style.cssText=`position:absolute;inset:0;overflow:visible;`,_.appendChild(A);let j=document.createElement(`div`);j.style.cssText=`
    position:fixed;inset:0;z-index:10000;
    display:flex;align-items:flex-end;justify-content:center;
    background:rgba(0,0,0,0);pointer-events:none;
    transition:background .28s ease;
  `;let M=document.createElement(`div`);M.style.cssText=`
    position:relative;width:100%;max-width:430px;
    background:rgba(255,255,255,0.97);
    backdrop-filter:blur(32px);-webkit-backdrop-filter:blur(32px);
    border-radius:28px 28px 0 0;
    border-top:1px solid rgba(255,255,255,0.85);
    box-shadow:0 -8px 40px rgba(0,0,0,0.15);
    transform:translateY(100%);
    overflow-y:auto;max-height:82vh;
    padding-bottom:env(safe-area-inset-bottom,0px);
  `,j.appendChild(M),document.body.appendChild(j);let N={memory:`Kenangan`,milestone:`Milestone`,photo:`Foto`},P=()=>{j.dataset.mode=``,j.style.pointerEvents=`none`,j.style.background=`rgba(0,0,0,0)`,j.style.backdropFilter=``,j.style.alignItems=`flex-end`,M.style.transform=`translateY(100%)`,M.style.maxHeight=`82vh`,M.style.maxWidth=`430px`,M.style.borderRadius=`28px 28px 0 0`,M.style.borderTop=`1px solid rgba(255,255,255,0.85)`,M.style.background=`rgba(255,255,255,0.97)`,M.style.boxShadow=`0 -8px 40px rgba(0,0,0,0.15)`,M.style.backdropFilter=`blur(32px)`,M.style.display=`block`,M.style.width=`100%`,M.style.height=`auto`,M.style.overflowY=`auto`,M.style.flexDirection=``,M.style.alignItems=``,M.style.justifyContent=``,M.style.padding=``},F=(e,t)=>{if(j.style.pointerEvents=`all`,e.photoUrl){j.dataset.mode=`lightbox`,j.style.background=`rgba(253,244,240,0.90)`,j.style.backdropFilter=`blur(24px) saturate(1.3)`,j.style.alignItems=`stretch`,M.style.transform=`none`,M.style.maxHeight=`100vh`,M.style.borderRadius=`0`,M.style.background=`transparent`,M.style.boxShadow=`none`,M.style.backdropFilter=`none`,M.style.borderTop=`none`,M.style.display=`flex`,M.style.flexDirection=`column`,M.style.alignItems=`center`,M.style.justifyContent=`flex-start`,M.style.width=`100%`,M.style.maxWidth=`100%`,M.style.height=`100%`,M.style.padding=`0`,M.style.overflowY=`hidden`;let a=e=>`
        width:38px;height:38px;border-radius:50%;padding:0;cursor:pointer;
        background:rgba(255,255,255,0.75);backdrop-filter:blur(12px);
        border:1px solid ${e?`rgba(200,120,120,0.30)`:`rgba(255,255,255,0.70)`};
        box-shadow:0 2px 8px rgba(0,0,0,0.06),inset 0 1px 0 rgba(255,255,255,0.9);
        color:${e?`#c87878`:`#1a1916`};
        display:flex;align-items:center;justify-content:center
      `;M.innerHTML=`
        <div style="width:100%;display:flex;align-items:center;justify-content:space-between;
                    padding:max(16px,env(safe-area-inset-top,16px)) 20px 12px;flex-shrink:0">
          <button id="btn-delete-memory" style="${a(!0)}">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
          <button id="btn-close-lb" style="${a(!1)}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2.2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div style="flex:1;display:flex;align-items:center;padding:0 20px;min-height:0;overflow:hidden">
          <div style="width:100%;background:rgba(255,255,255,0.68);
                border:1px solid rgba(255,255,255,0.80);
                box-shadow:0 4px 24px rgba(0,0,0,0.07),inset 0 1px 0 rgba(255,255,255,0.9);
                border-radius:20px;padding:8px">
            <img src="${o(e.photoUrl)}"
              style="width:100%;max-height:calc(100dvh - 180px);border-radius:13px;
                     object-fit:contain;display:block" alt="" />
          </div>
        </div>
        <div style="padding:10px 24px max(20px,env(safe-area-inset-bottom,20px));
                    flex-shrink:0;text-align:center">
          <p style="font-size:13px;font-weight:600;color:#1a1916;margin:0 0 6px">
            ${o(e.title)}
          </p>
          ${e.description?`
          <p style="
            font-family:'Playfair Display',Georgia,serif;
            font-size:12px;font-style:italic;
            color:#c8826a;line-height:1.6;
            margin:0 0 6px;letter-spacing:.01em;
            opacity:0.85;
          ">${o(e.description)}</p>
          `:``}
          <time style="font-size:11px;color:#9a9088;letter-spacing:.06em">
            ${o(r(e.memory_date))}
          </time>
        </div>
      `,M.querySelector(`#btn-close-lb`).addEventListener(`click`,P),M.querySelector(`#btn-delete-memory`).addEventListener(`click`,()=>{c({title:`Hapus Kenangan?`,message:`"${e.title}" akan dihapus permanen.`,confirmLabel:`Hapus`,danger:!0,onConfirm:async()=>{let{error:r}=await n.from(`memories`).delete().eq(`id`,e.id);if(r)throw r;t.remove(),P(),i(`Kenangan dihapus`,`success`)}})})}else j.style.background=`rgba(0,0,0,0.48)`,M.style.transform=`translateY(0)`,M.style.maxHeight=`82vh`,M.style.borderRadius=`28px 28px 0 0`,M.style.background=`rgba(255,255,255,0.97)`,M.style.boxShadow=`0 -8px 40px rgba(0,0,0,0.15)`,M.style.backdropFilter=`blur(32px)`,M.style.display=`block`,M.style.width=`100%`,M.style.height=`auto`,M.style.padding=`0`,M.style.flexDirection=``,M.style.alignItems=``,M.style.justifyContent=``,M.innerHTML=`
        <div style="width:40px;height:4px;border-radius:999px;background:rgba(0,0,0,0.12);margin:12px auto 0"></div>
        <div style="height:16px"></div>
        <div style="padding:6px 24px 16px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
            <span style="font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:#c8826a;font-weight:700">
              ${o(N[e.type]??e.type)}
            </span>
            <time style="font-size:11px;color:#9a9088">${o(r(e.memory_date))}</time>
          </div>
          <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:22px;color:#1a1916;
                     line-height:1.25;margin-bottom:${e.description?`10px`:`0`}">
            ${o(e.title)}
          </h2>
          ${e.description?`
          <p style="
            font-family:'Playfair Display',Georgia,serif;
            font-size:14px;font-style:italic;
            color:#c8826a;line-height:1.75;
            margin-top:8px;opacity:0.9;
            border-left:2px solid rgba(200,130,106,0.25);
            padding-left:12px;
          ">${o(e.description)}</p>
          `:``}
        </div>
        <div style="padding:0 24px 32px">
          <button id="btn-delete-memory"
            style="width:100%;padding:12px;border-radius:14px;border:1px solid rgba(200,100,100,0.25);
                   background:rgba(200,100,100,0.06);color:#c87878;font-size:13px;font-weight:600;
                   cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:6px">
            <span>🗑</span> Hapus Kenangan
          </button>
        </div>
      `,M.querySelector(`#btn-delete-memory`).addEventListener(`click`,()=>{c({title:`Hapus Kenangan?`,message:`"${e.title}" akan dihapus permanen.`,confirmLabel:`Hapus`,danger:!0,onConfirm:async()=>{let{error:r}=await n.from(`memories`).delete().eq(`id`,e.id);if(r)throw r;t.remove(),P(),i(`Kenangan dihapus`,`success`)}})})};j.addEventListener(`click`,e=>{let t=e.target;j.dataset.mode===`lightbox`?!t.closest(`button`)&&!t.closest(`img`)&&P():e.target===j&&P()});let I=Math.min(window.innerWidth,430),L=window.innerHeight,R=S(I,L),z=[[],[]];O.forEach((e,t)=>z[t%2].push(e));let B=[],V=[0,0],H=(e,t,n,r)=>{let i=n>1?t/n:.25,a=x(i,R[r]),o=Math.abs(i-.5)*2,s=C(d,f,o*o),c=C(1,.55,o),p=document.createElement(`div`);p.style.cssText=`
      position:absolute;top:0;left:0;
      width:${l}px;height:${u}px;
      border-radius:16px;cursor:pointer;
      will-change:transform;transform-origin:center;
    `;let m=document.createElement(`div`);m.style.cssText=`
      width:100%;height:100%;border-radius:16px;overflow:hidden;
      background:rgba(255,255,255,0.65);
      border:.5px solid rgba(255,255,255,0.75);
      box-shadow:inset 0 1px 0 rgba(255,255,255,0.9);
      padding:3px;
    `,p.appendChild(m),A.appendChild(p);let h=a.x-l/2-l*(s-1)/2,g=a.y-u/2-u*(s-1)/2;p.style.transform=`translate(${h}px,${g}px) scale(${s})`,p.style.opacity=String(c);let _={el:p,inner:m,lane:r,t:i,curS:s,curO:c,curX:a.x,curY:a.y,rX:0,rY:0,tRX:0,tRY:0,hit:!1,rgb:b[t%b.length],queue:e,qIdx:t,get mem(){return this.queue[this.qIdx]}};w(_,e[t]);let v=(e,t)=>{_.hit=!0;let n=p.getBoundingClientRect(),r=(e-(n.left+n.width/2))/(n.width/2);_.tRX=-((t-(n.top+n.height/2))/(n.height/2))*22,_.tRY=r*22},y=()=>{_.hit=!1,_.tRX=0,_.tRY=0};return p.addEventListener(`mousemove`,e=>v(e.clientX,e.clientY)),p.addEventListener(`mouseleave`,y),p.addEventListener(`touchmove`,e=>{e.preventDefault(),v(e.touches[0].clientX,e.touches[0].clientY)},{passive:!1}),p.addEventListener(`touchend`,y),p.addEventListener(`click`,()=>F(_.mem,p)),_};for(let e=0;e<2;e++){let t=z[e],n=Math.min(y,t.length);V[e]=n;for(let r=0;r<n;r++)B.push(H(t,r,n,e))}let U=0,W=()=>{if(!_.isConnected){cancelAnimationFrame(U),j.remove();return}let e=Math.min(window.innerWidth,430),t=window.innerHeight;R=S(e,t);for(let e of B){let t=e.t+g;if(t>=1){e.queue.length>1&&(e.qIdx=V[e.lane]%e.queue.length,V[e.lane]++,w(e,e.queue[e.qIdx])),e.t=t%1;let n=x(e.t,R[e.lane]);e.curX=n.x,e.curY=n.y}else e.t=t;let n=x(e.t,R[e.lane]),r=Math.abs(e.t-.5)*2;e.hit?(e.curS=C(e.curS,d+.15,p),e.curO=1,e.rX=C(e.rX,e.tRX,h),e.rY=C(e.rY,e.tRY,h)):(e.curS=C(e.curS,C(d,f,r*r),p),e.curO=C(e.curO,C(1,.55,r),p),e.rX=C(e.rX,0,h),e.rY=C(e.rY,0,h),e.curX=C(e.curX,n.x,m),e.curY=C(e.curY,n.y,m)),e.el.style.zIndex=e.hit?`9999`:String(Math.round(e.curS*300));let i=e.curX-l/2-l*(e.curS-1)/2,a=e.curY-u/2-u*(e.curS-1)/2;e.el.style.transform=e.hit?`translate(${i}px,${a}px) perspective(900px) rotateX(${e.rX}deg) rotateY(${e.rY}deg) scale(${e.curS})`:`translate(${i}px,${a}px) scale(${e.curS})`,e.el.style.opacity=String(e.curO),e.inner.style.boxShadow=e.hit?`0 8px 24px rgba(${e.rgb},.38), 0 0 14px rgba(${e.rgb},.18), inset 0 1px 0 rgba(255,255,255,.95)`:`inset 0 1px 0 rgba(255,255,255,.9)`}U=requestAnimationFrame(W)};return U=requestAnimationFrame(W),k.querySelector(`#btn-add`).addEventListener(`click`,()=>t(`/timeline/add`)),_.appendChild(a()),_}export{T as renderTimeline};
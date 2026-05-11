import{n as e}from"./router-SnC_tAPp.js";function t(e,t=22){return`<svg width="${t}" height="${t}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    style="display:block;flex-shrink:0">${e}</svg>`}var n={memories:t(`
    <path d="M12 2C12 7.25 16.75 12 22 12C16.75 12 12 16.75 12 22C12 16.75 7.25 12 2 12C7.25 12 12 7.25 12 2Z"/>
  `),planner:t(`
    <rect x="3" y="4" width="18" height="18" rx="3"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <path d="M9 16l2 2 4-4"/>
  `),chat:t(`
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  `),settings:t(`
    <line x1="4" y1="6" x2="20" y2="6"/>
    <circle cx="14" cy="6" r="2.2"/>
    <line x1="4" y1="12" x2="20" y2="12"/>
    <circle cx="9" cy="12" r="2.2"/>
    <line x1="4" y1="18" x2="20" y2="18"/>
    <circle cx="15" cy="18" r="2.2"/>
  `),heart:(e,t=24)=>`
    <svg width="${t}" height="${t}" viewBox="0 0 24 24" fill="none"
      stroke="${e}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"
      style="display:block">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        fill="${e===`white`?`rgba(255,255,255,0.18)`:`rgba(200,130,106,0.10)`}"/>
    </svg>
  `,location:t(`
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  `),camera:t(`
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  `)},r=[{path:`/timeline`,icon:n.memories,label:`Kenangan`},{path:`/planner`,icon:n.planner,label:`Kencan`}],i=[{path:`/chat`,icon:n.chat,label:`Chat`},{path:`/settings`,icon:n.settings,label:`Atur`}];function a(){let t=window.location.hash.slice(1).split(`?`)[0]||`/`,a=t===`/`,o=document.createElement(`nav`);o.style.cssText=`
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 430px;
    height: 68px;
    padding-bottom: env(safe-area-inset-bottom, 0px);
    display: flex;
    align-items: center;
    overflow: visible;
    z-index: 300;
    background: rgba(253,244,240,0.84);
    backdrop-filter: blur(28px) saturate(1.6);
    -webkit-backdrop-filter: blur(28px) saturate(1.6);
    border-top: 1px solid rgba(255,255,255,0.68);
    box-shadow: 0 -4px 28px rgba(200,130,106,0.08), 0 -1px 0 rgba(255,255,255,0.5);
  `;function s(n,r,i){let a=t===n,o=document.createElement(`button`);return o.style.cssText=`
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 5px;
      padding: 8px 0;
      border: none;
      background: transparent;
      cursor: pointer;
      color: ${a?`#c8826a`:`#b0a099`};
      transition: color 0.2s, opacity 0.15s;
    `,o.innerHTML=`
      <span style="
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border-radius: 14px;
        transition: all 0.26s cubic-bezier(0.34,1.56,0.64,1);
        ${a?`
          background: linear-gradient(145deg, rgba(255,234,224,0.90) 0%, rgba(255,216,198,0.65) 100%);
          backdrop-filter: blur(22px) saturate(2.0) brightness(1.06);
          -webkit-backdrop-filter: blur(22px) saturate(2.0) brightness(1.06);
          border: 1px solid rgba(255,255,255,0.90);
          box-shadow:
            0 6px 22px rgba(200,130,106,0.20),
            0 2px 6px rgba(200,130,106,0.10),
            inset 0 1.5px 0 rgba(255,255,255,0.96),
            inset 0 -1px 2px rgba(200,130,106,0.08);
          transform: scale(1.06) translateY(-1px);
        `:`
          background: linear-gradient(145deg, rgba(255,255,255,0.56) 0%, rgba(255,248,244,0.34) 100%);
          backdrop-filter: blur(14px) saturate(1.5);
          -webkit-backdrop-filter: blur(14px) saturate(1.5);
          border: 1px solid rgba(255,255,255,0.64);
          box-shadow:
            0 2px 8px rgba(200,130,106,0.07),
            inset 0 1px 0 rgba(255,255,255,0.86);
          transform: scale(1);
        `}
      ">${r}</span>
      <span style="
        font-size: 8px;
        font-weight: ${a?`700`:`500`};
        text-transform: uppercase;
        letter-spacing: 0.1em;
        line-height: 1;
      ">${i}</span>
    `,o.addEventListener(`click`,()=>e(n)),o.addEventListener(`touchstart`,()=>{o.style.opacity=`0.7`},{passive:!0}),o.addEventListener(`touchend`,()=>{o.style.opacity=`1`},{passive:!0}),o}r.forEach(e=>o.appendChild(s(e.path,e.icon,e.label)));let c=document.createElement(`div`);c.style.cssText=`
    position: relative;
    flex: 0 0 80px;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
  `;let l=document.createElement(`div`);l.style.cssText=`
    position: absolute;
    top: -26px;
    width: 66px; height: 66px;
    border-radius: 50%;
    background: ${a?`radial-gradient(circle, rgba(200,130,106,0.32) 0%, transparent 68%)`:`radial-gradient(circle, rgba(200,130,106,0.10) 0%, transparent 68%)`};
    pointer-events: none;
    transition: all 0.35s ease;
  `;let u=document.createElement(`button`);u.style.cssText=`
    position: absolute;
    top: -24px;
    width: 60px; height: 60px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    transition: transform 0.26s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.26s;
    ${a?`
      background: linear-gradient(145deg, #e09472 0%, #c8826a 50%, #b36858 100%);
      border: 2px solid rgba(255,255,255,0.90);
      box-shadow:
        0 10px 34px rgba(200,130,106,0.52),
        0 4px 12px rgba(180,110,90,0.28),
        0 1px 3px rgba(0,0,0,0.10),
        inset 0 1.5px 0 rgba(255,255,255,0.30),
        inset 0 -1px 0 rgba(0,0,0,0.07);
    `:`
      background: linear-gradient(145deg, rgba(255,255,255,0.90) 0%, rgba(255,240,232,0.72) 50%, rgba(255,226,212,0.56) 100%);
      backdrop-filter: blur(26px) saturate(1.9) brightness(1.04);
      -webkit-backdrop-filter: blur(26px) saturate(1.9) brightness(1.04);
      border: 1.5px solid rgba(255,255,255,0.92);
      box-shadow:
        0 8px 30px rgba(200,130,106,0.16),
        0 3px 10px rgba(200,130,106,0.09),
        0 1px 3px rgba(0,0,0,0.05),
        inset 0 1.5px 0 rgba(255,255,255,0.96),
        inset 0 -1px 1px rgba(200,130,106,0.07);
    `}
  `;let d=a?`white`:`#c8826a`;return u.innerHTML=`
    ${n.heart(d,26)}
    <span style="
      font-size: 7px; font-weight: 700;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: ${a?`rgba(255,255,255,0.80)`:`#c09080`};
      margin-top: 1px;
    ">Home</span>
  `,u.addEventListener(`click`,()=>e(`/`)),u.addEventListener(`touchstart`,()=>{u.style.transform=`scale(0.91)`},{passive:!0}),u.addEventListener(`touchend`,()=>{u.style.transform=`scale(1)`},{passive:!0}),u.addEventListener(`mouseenter`,()=>{a||(u.style.transform=`scale(1.06) translateY(-1px)`)}),u.addEventListener(`mouseleave`,()=>{u.style.transform=`scale(1) translateY(0)`}),c.appendChild(l),c.appendChild(u),o.appendChild(c),i.forEach(e=>o.appendChild(s(e.path,e.icon,e.label))),o}export{a as t};
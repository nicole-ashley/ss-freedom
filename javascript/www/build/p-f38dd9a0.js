let e,t,n=0,l=!1;const s=window,o=document,r={t:0,l:"",jmp:e=>e(),raf:e=>requestAnimationFrame(e),ael:(e,t,n,l)=>e.addEventListener(t,n,l),rel:(e,t,n,l)=>e.removeEventListener(t,n,l)},c=(()=>!!o.documentElement.attachShadow)(),i=(()=>{try{return new CSSStyleSheet,!0}catch(e){}return!1})(),a=new WeakMap,u=e=>a.get(e),f=(e,t)=>a.set(t.s=e,t),m=(e,t)=>t in e,d=e=>console.error(e),p=new Map,$=new Map,w=[],h=[],y=[],_=(e,t)=>n=>{e.push(n),l||(l=!0,t&&4&r.t?j(g):r.raf(g))},b=(e,t)=>{let n=0,l=0;for(;n<e.length&&(l=performance.now())<t;)try{e[n++](l)}catch(s){d(s)}n===e.length?e.length=0:0!==n&&e.splice(0,n)},g=()=>{n++,(e=>{for(let n=0;n<e.length;n++)try{e[n](performance.now())}catch(t){d(t)}e.length=0})(w);const e=2==(6&r.t)?performance.now()+10*Math.ceil(n*(1/22)):1/0;b(h,e),b(y,e),h.length>0&&(y.push(...h),h.length=0),(l=w.length+h.length+y.length>0)?r.raf(g):n=0},j=e=>Promise.resolve().then(e),S=_(h,!0),v={},M=e=>"object"==(e=typeof e)||"function"===e,U=()=>s.CSS&&s.CSS.supports&&s.CSS.supports("color","var(--c)")?Promise.resolve():__sc_import_ss_freedom("./p-d8631f0b.js").then(()=>{r.o=s.__stencil_cssshim}),L=async()=>{r.o=s.__stencil_cssshim;const e=new RegExp("/ss-freedom(\\.esm)?\\.js($|\\?|#)"),t=Array.from(o.querySelectorAll("script")).find(t=>e.test(t.src)||"ss-freedom"===t.getAttribute("data-stencil-namespace")),n=t["data-opts"];{const e=new URL(".",new URL(t.getAttribute("data-resources-url")||t.src,s.location.href));return R(e.href),window.customElements||await __sc_import_ss_freedom("./p-d0882b30.js"),Object.assign(Object.assign({},n),{resourcesUrl:e.href})}},R=e=>{const t=(()=>`__sc_import_${"ss-freedom".replace(/\s|-/g,"_")}`)();try{s[t]=new Function("w",`return import(w);//${Math.random()}`)}catch(n){const l=new Map;s[t]=n=>{const r=new URL(n,e).href;let c=l.get(r);if(!c){const e=o.createElement("script");e.type="module",e.src=URL.createObjectURL(new Blob([`import * as m from '${r}'; window.${t}.m = m;`],{type:"application/javascript"})),c=new Promise(n=>{e.onload=()=>{n(s[t].m),e.remove()}}),l.set(r,c),o.head.appendChild(e)}return c}}},O=new WeakMap,k=e=>"sc-"+e,P=(e,t,...n)=>{let l=null,s=!1,o=!1,r=[];const c=t=>{for(let n=0;n<t.length;n++)l=t[n],Array.isArray(l)?c(l):null!=l&&"boolean"!=typeof l&&((s="function"!=typeof e&&!M(l))&&(l=String(l)),s&&o?r[r.length-1].i+=l:r.push(s?x(null,l):l),o=s)};c(n);const i=x(e,null);return i.u=t,r.length>0&&(i.p=r),i},x=(e,t)=>({t:0,$:e,i:t,h:null,p:null,u:null}),C={},A=(e,t,n,l,o,c)=>{if(n===l)return;let i=m(e,t),a=t.toLowerCase();if("ref"===t)l&&l(e);else if(i||"o"!==t[0]||"n"!==t[1]){const s=M(l);if((i||s&&null!==l)&&!o)try{if(e.tagName.includes("-"))e[t]=l;else{let s=null==l?"":l;"list"===t?i=!1:null!=n&&e[t]==s||(e[t]=s)}}catch(u){}null==l||!1===l?e.removeAttribute(t):(!i||4&c||o)&&!s&&e.setAttribute(t,l=!0===l?"":l)}else t="-"===t[2]?t.slice(3):m(s,a)?a.slice(2):a[2]+t.slice(3),n&&r.rel(e,t,n,!1),l&&r.ael(e,t,l,!1)},E=(e,t,n,l)=>{const s=11===t.h.nodeType&&t.h.host?t.h.host:t.h,o=e&&e.u||v,r=t.u||v;for(l in o)l in r||A(s,l,o[l],void 0,n,t.t);for(l in r)A(s,l,o[l],r[l],n,t.t)},T=(t,n,l)=>{let s,r,c=n.p[l],i=0;if(null!==c.i)s=c.h=o.createTextNode(c.i);else if(s=c.h=o.createElement(c.$),E(null,c,!1),(e=>null!=e)(e)&&s["s-si"]!==e&&s.classList.add(s["s-si"]=e),c.p)for(i=0;i<c.p.length;++i)(r=T(t,c,i))&&s.appendChild(r);return s},W=(e,n,l,s,o,r)=>{let c,i=e;for(i.shadowRoot&&i.tagName===t&&(i=i.shadowRoot);o<=r;++o)s[o]&&(c=T(null,l,o))&&(s[o].h=c,i.insertBefore(c,n))},D=(e,t,n,l,s)=>{for(;t<=n;++t)(l=e[t])&&(s=l.h,q(l),s.remove())},F=(e,t)=>e.$===t.$,H=(e,t)=>{const n=t.h=e.h,l=e.p,s=t.p;null===t.i?(E(e,t,!1),null!==l&&null!==s?((e,t,n,l)=>{let s,o=0,r=0,c=t.length-1,i=t[0],a=t[c],u=l.length-1,f=l[0],m=l[u];for(;o<=c&&r<=u;)null==i?i=t[++o]:null==a?a=t[--c]:null==f?f=l[++r]:null==m?m=l[--u]:F(i,f)?(H(i,f),i=t[++o],f=l[++r]):F(a,m)?(H(a,m),a=t[--c],m=l[--u]):F(i,m)?(H(i,m),e.insertBefore(i.h,a.h.nextSibling),i=t[++o],m=l[--u]):F(a,f)?(H(a,f),e.insertBefore(a.h,i.h),a=t[--c],f=l[++r]):(s=T(t&&t[r],n,r),f=l[++r],s&&i.h.parentNode.insertBefore(s,i.h));o>c?W(e,null==l[u+1]?null:l[u+1].h,n,l,r,u):r>u&&D(t,o,c)})(n,l,t,s):null!==s?(null!==e.i&&(n.textContent=""),W(n,null,t,s,0,s.length-1)):null!==l&&D(l,0,l.length-1)):e.i!==t.i&&(n.data=t.i)},q=e=>{e.u&&e.u.ref&&e.u.ref(null),e.p&&e.p.forEach(q)},B=(e,t)=>{t&&!e._&&t["s-p"].push(new Promise(t=>e._=t))},N=(e,t,n,l)=>{if(t.t|=16,4&t.t)return void(t.t|=512);const s=t.s,o=()=>V(e,t,n,s,l);let r;return B(t,t.g),l&&(r=I(s,"componentWillLoad")),J(r,()=>S(o))},V=(n,l,s,r,i)=>{const a=n["s-rc"];i&&((e,t)=>{const n=((e,t)=>{let n=k(t.j),l=$.get(n);if(e=11===e.nodeType?e:o,l)if("string"==typeof l){let t,s=O.get(e=e.head||e);s||O.set(e,s=new Set),s.has(n)||((t=o.createElement("style")).innerHTML=l,e.insertBefore(t,e.querySelector("link")),s&&s.add(n))}else e.adoptedStyleSheets.includes(l)||(e.adoptedStyleSheets=[...e.adoptedStyleSheets,l]);return n})(c&&e.shadowRoot?e.shadowRoot:e.getRootNode(),t);10&t.t&&(e["s-sc"]=n,e.classList.add(n+"-h"))})(n,s);try{((n,l,s,o)=>{t=n.tagName;const r=l.S||x(null,null),c=(e=>e&&e.$===C)(o)?o:P(null,null,o);c.$=null,c.t|=4,l.S=c,c.h=r.h=n.shadowRoot||n,e=n["s-sc"],H(r,c)})(n,l,0,r.render())}catch(u){d(u)}l.t&=-17,l.t|=2,a&&(a.forEach(e=>e()),n["s-rc"]=void 0);{const e=n["s-p"],t=()=>z(n,l,s);0===e.length?t():(Promise.all(e).then(t),l.t|=4,e.length=0)}},z=(e,t,n)=>{const l=t.s,s=t.g;64&t.t||(t.t|=64,e.classList.add("hydrated"),I(l,"componentDidLoad"),t.v(e),s||G()),t._&&(t._(),t._=void 0),512&t.t&&j(()=>N(e,t,n,!1)),t.t&=-517},G=()=>{o.documentElement.classList.add("hydrated"),r.t|=2},I=(e,t,n)=>{if(e&&e[t])try{return e[t](n)}catch(l){d(l)}},J=(e,t)=>e&&e.then?e.then(t):t(),K=(e,t,n)=>{if(t.M){const l=Object.entries(t.M),s=e.prototype;l.forEach(([e,[l]])=>{(31&l||2&n&&32&l)&&Object.defineProperty(s,e,{get(){return((e,t)=>u(e).U.get(t))(this,e)},set(n){((e,t,n,l)=>{const s=u(this),o=s.L,r=s.U.get(t),c=s.t,i=s.s;(n=(e=>(null==e||M(e),e))(n))===r||8&c&&void 0!==r||(s.U.set(t,n),i&&2==(18&c)&&N(o,s,l,!1))})(0,e,n,t)},configurable:!0,enumerable:!0})})}return e},Q=(e,t={})=>{const n=[],l=t.exclude||[],f=o.head,m=s.customElements,w=f.querySelector("meta[charset]"),h=o.createElement("style"),y=[];let _,b=!0;Object.assign(r,t),r.l=new URL(t.resourcesUrl||"./",o.baseURI).href,t.syncQueue&&(r.t|=4),e.forEach(e=>e[1].forEach(t=>{const s={t:t[0],j:t[1],M:t[2],R:t[3]};s.M=t[2],!c&&1&s.t&&(s.t|=8);const o=s.j,f=class extends HTMLElement{constructor(e){super(e),(e=>{const t={t:0,L:e,U:new Map};t.O=new Promise(e=>t.v=e),e["s-p"]=[],e["s-rc"]=[],a.set(e,t)})(e=this),1&s.t&&(c?e.attachShadow({mode:"open"}):"shadowRoot"in e||(e.shadowRoot=e))}connectedCallback(){_&&(clearTimeout(_),_=null),b?y.push(this):r.jmp(()=>((e,t)=>{if(0==(1&r.t)){const n=()=>{},l=u(e);if(!(1&l.t)){l.t|=1;{let t=e;for(;t=t.parentNode||t.host;)if(t["s-p"]){B(l,l.g=t);break}}t.M&&Object.entries(t.M).forEach(([t,[n]])=>{if(31&n&&e.hasOwnProperty(t)){const n=e[t];delete e[t],e[t]=n}}),j(()=>(async(e,t,n,l,s)=>{if(0==(32&t.t)){t.t|=32;{if((s=(e=>{const t=e.j.replace(/-/g,"_"),n=e.k,l=p.get(n);return l?l[t]:__sc_import_ss_freedom(`./${n}.entry.js`).then(e=>(p.set(n,e),e[t]),d)})(n)).then){const e=()=>{};s=await s,e()}s.isProxied||(K(s,n,2),s.isProxied=!0);const e=()=>{};t.t|=8;try{new s(t)}catch(c){d(c)}t.t&=-9,e()}const e=k(n.j);if(!$.has(e)&&s.style){const t=()=>{};let l=s.style;8&n.t&&(l=await __sc_import_ss_freedom("./p-affe7c09.js").then(t=>t.scopeCss(l,e,!1))),((e,t,n)=>{let l=$.get(e);i&&n?(l=l||new CSSStyleSheet).replace(t):l=t,$.set(e,l)})(e,l,!!(1&n.t)),t()}}const o=t.g,r=()=>N(e,t,n,!0);o&&o["s-rc"]?o["s-rc"].push(r):r()})(e,l,t))}n()}})(this,s))}disconnectedCallback(){r.jmp(()=>(()=>{0==(1&r.t)&&I(u(this).s,"componentDidUnload")})())}"s-hmr"(e){}forceUpdate(){((e,t)=>{{const n=u(e);2==(18&n.t)&&N(e,n,t,!1)}})(this,s)}componentOnReady(){return u(this).O}};s.k=e[0],l.includes(o)||m.get(o)||(n.push(o),m.define(o,K(f,s,1)))})),h.innerHTML=n+"{visibility:hidden}.hydrated{visibility:inherit}",h.setAttribute("data-styles",""),f.insertBefore(h,w?w.nextSibling:f.firstChild),b=!1,y.length>0?y.forEach(e=>e.connectedCallback()):r.jmp(()=>_=setTimeout(G,30,"timeout"))},X=e=>u(e).L;export{C as H,U as a,Q as b,X as g,P as h,L as p,f as r};
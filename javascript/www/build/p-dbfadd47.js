let e,t,n=0,s=!1;const l=window,o=document,r={t:0,s:"",jmp:e=>e(),raf:e=>requestAnimationFrame(e),ael:(e,t,n,s)=>e.addEventListener(t,n,s),rel:(e,t,n,s)=>e.removeEventListener(t,n,s)},c=(()=>!!o.documentElement.attachShadow)(),i=(()=>{try{return new CSSStyleSheet,!0}catch(e){}return!1})(),a=new WeakMap,u=e=>a.get(e),f=(e,t)=>a.set(t.l=e,t),m=(e,t)=>t in e,d=e=>console.error(e),p=new Map,$=new Map,h=[],w=[],y=[],_=(e,t)=>n=>{e.push(n),s||(s=!0,t&&4&r.t?g(j):r.raf(j))},b=(e,t)=>{let n=0,s=0;for(;n<e.length&&(s=performance.now())<t;)try{e[n++](s)}catch(l){d(l)}n===e.length?e.length=0:0!==n&&e.splice(0,n)},j=()=>{n++,(e=>{for(let n=0;n<e.length;n++)try{e[n](performance.now())}catch(t){d(t)}e.length=0})(h);const e=2==(6&r.t)?performance.now()+10*Math.ceil(n*(1/22)):1/0;b(w,e),b(y,e),w.length>0&&(y.push(...w),w.length=0),(s=h.length+w.length+y.length>0)?r.raf(j):n=0},g=e=>Promise.resolve().then(e),S=_(w,!0),v={},M=e=>"object"==(e=typeof e)||"function"===e,O=()=>l.CSS&&l.CSS.supports&&l.CSS.supports("color","var(--c)")?Promise.resolve():__sc_import_ss_freedom("./p-d8631f0b.js").then(()=>{r.o=l.__stencil_cssshim}),U=async()=>{r.o=l.__stencil_cssshim;const e=new RegExp("/ss-freedom(\\.esm)?\\.js($|\\?|#)"),t=Array.from(o.querySelectorAll("script")).find(t=>e.test(t.src)||"ss-freedom"===t.getAttribute("data-stencil-namespace")),n=t["data-opts"];{const e=new URL(".",new URL(t.getAttribute("data-resources-url")||t.src,l.location.href));return L(e.href),window.customElements||await __sc_import_ss_freedom("./p-d0882b30.js"),Object.assign(Object.assign({},n),{resourcesUrl:e.href})}},L=e=>{const t=(()=>`__sc_import_${"ss-freedom".replace(/\s|-/g,"_")}`)();try{l[t]=new Function("w",`return import(w);//${Math.random()}`)}catch(n){const s=new Map;l[t]=n=>{const r=new URL(n,e).href;let c=s.get(r);if(!c){const e=o.createElement("script");e.type="module",e.src=URL.createObjectURL(new Blob([`import * as m from '${r}'; window.${t}.m = m;`],{type:"application/javascript"})),c=new Promise(n=>{e.onload=()=>{n(l[t].m),e.remove()}}),s.set(r,c),o.head.appendChild(e)}return c}}},R=new WeakMap,P=e=>"sc-"+e,k=(e,t,...n)=>{let s=null,l=!1,o=!1,r=[];const c=t=>{for(let n=0;n<t.length;n++)s=t[n],Array.isArray(s)?c(s):null!=s&&"boolean"!=typeof s&&((l="function"!=typeof e&&!M(s))&&(s=String(s)),l&&o?r[r.length-1].i+=s:r.push(l?x(null,s):s),o=l)};if(c(n),t){const e=t.className||t.class;e&&(t.class="object"!=typeof e?e:Object.keys(e).filter(t=>e[t]).join(" "))}const i=x(e,null);return i.u=t,r.length>0&&(i.p=r),i},x=(e,t)=>({t:0,$:e,i:t,h:null,p:null,u:null}),C={},A=(e,t,n,s,o,c)=>{if(n===s)return;let i=m(e,t),a=t.toLowerCase();if("class"===t){const t=e.classList,l=F(n),o=F(s);t.remove(...l.filter(e=>e&&!o.includes(e))),t.add(...o.filter(e=>e&&!l.includes(e)))}else if("ref"===t)s&&s(e);else if(i||"o"!==t[0]||"n"!==t[1]){const l=M(s);if((i||l&&null!==s)&&!o)try{if(e.tagName.includes("-"))e[t]=s;else{let l=null==s?"":s;"list"===t?i=!1:null!=n&&e[t]==l||(e[t]=l)}}catch(u){}null==s||!1===s?e.removeAttribute(t):(!i||4&c||o)&&!l&&e.setAttribute(t,s=!0===s?"":s)}else t="-"===t[2]?t.slice(3):m(l,a)?a.slice(2):a[2]+t.slice(3),n&&r.rel(e,t,n,!1),s&&r.ael(e,t,s,!1)},E=/\s/,F=e=>e?e.split(E):[],T=(e,t,n,s)=>{const l=11===t.h.nodeType&&t.h.host?t.h.host:t.h,o=e&&e.u||v,r=t.u||v;for(s in o)s in r||A(l,s,o[s],void 0,n,t.t);for(s in r)A(l,s,o[s],r[s],n,t.t)},W=(t,n,s)=>{let l,r,c=n.p[s],i=0;if(null!==c.i)l=c.h=o.createTextNode(c.i);else if(l=c.h=o.createElement(c.$),T(null,c,!1),(e=>null!=e)(e)&&l["s-si"]!==e&&l.classList.add(l["s-si"]=e),c.p)for(i=0;i<c.p.length;++i)(r=W(t,c,i))&&l.appendChild(r);return l},D=(e,n,s,l,o,r)=>{let c,i=e;for(i.shadowRoot&&i.tagName===t&&(i=i.shadowRoot);o<=r;++o)l[o]&&(c=W(null,s,o))&&(l[o].h=c,i.insertBefore(c,n))},H=(e,t,n,s,l)=>{for(;t<=n;++t)(s=e[t])&&(l=s.h,N(s),l.remove())},q=(e,t)=>e.$===t.$,B=(e,t)=>{const n=t.h=e.h,s=e.p,l=t.p;null===t.i?(T(e,t,!1),null!==s&&null!==l?((e,t,n,s)=>{let l,o=0,r=0,c=t.length-1,i=t[0],a=t[c],u=s.length-1,f=s[0],m=s[u];for(;o<=c&&r<=u;)null==i?i=t[++o]:null==a?a=t[--c]:null==f?f=s[++r]:null==m?m=s[--u]:q(i,f)?(B(i,f),i=t[++o],f=s[++r]):q(a,m)?(B(a,m),a=t[--c],m=s[--u]):q(i,m)?(B(i,m),e.insertBefore(i.h,a.h.nextSibling),i=t[++o],m=s[--u]):q(a,f)?(B(a,f),e.insertBefore(a.h,i.h),a=t[--c],f=s[++r]):(l=W(t&&t[r],n,r),f=s[++r],l&&i.h.parentNode.insertBefore(l,i.h));o>c?D(e,null==s[u+1]?null:s[u+1].h,n,s,r,u):r>u&&H(t,o,c)})(n,s,t,l):null!==l?(null!==e.i&&(n.textContent=""),D(n,null,t,l,0,l.length-1)):null!==s&&H(s,0,s.length-1)):e.i!==t.i&&(n.data=t.i)},N=e=>{e.u&&e.u.ref&&e.u.ref(null),e.p&&e.p.forEach(N)},V=(e,t)=>{t&&!e._&&t["s-p"].push(new Promise(t=>e._=t))},z=(e,t,n,s)=>{if(t.t|=16,4&t.t)return void(t.t|=512);const l=t.l,o=()=>G(e,t,n,l,s);let r;return V(t,t.j),s&&(r=K(l,"componentWillLoad")),Q(r,()=>S(o))},G=(n,s,l,r,i)=>{const a=n["s-rc"];i&&((e,t)=>{const n=((e,t)=>{let n=P(t.g),s=$.get(n);if(e=11===e.nodeType?e:o,s)if("string"==typeof s){let t,l=R.get(e=e.head||e);l||R.set(e,l=new Set),l.has(n)||((t=o.createElement("style")).innerHTML=s,e.insertBefore(t,e.querySelector("link")),l&&l.add(n))}else e.adoptedStyleSheets.includes(s)||(e.adoptedStyleSheets=[...e.adoptedStyleSheets,s]);return n})(c&&e.shadowRoot?e.shadowRoot:e.getRootNode(),t);10&t.t&&(e["s-sc"]=n,e.classList.add(n+"-h"))})(n,l);try{((n,s,l,o)=>{t=n.tagName;const r=s.S||x(null,null),c=(e=>e&&e.$===C)(o)?o:k(null,null,o);c.$=null,c.t|=4,s.S=c,c.h=r.h=n.shadowRoot||n,e=n["s-sc"],B(r,c)})(n,s,0,r.render())}catch(u){d(u)}s.t&=-17,s.t|=2,a&&(a.forEach(e=>e()),n["s-rc"]=void 0);{const e=n["s-p"],t=()=>I(n,s,l);0===e.length?t():(Promise.all(e).then(t),s.t|=4,e.length=0)}},I=(e,t,n)=>{const s=t.l,l=t.j;64&t.t||(t.t|=64,e.classList.add("hydrated"),K(s,"componentDidLoad"),t.v(e),l||J()),t.M(e),t._&&(t._(),t._=void 0),512&t.t&&g(()=>z(e,t,n,!1)),t.t&=-517},J=()=>{o.documentElement.classList.add("hydrated"),r.t|=2},K=(e,t,n)=>{if(e&&e[t])try{return e[t](n)}catch(s){d(s)}},Q=(e,t)=>e&&e.then?e.then(t):t(),X=(e,t,n)=>{if(t.O){const s=Object.entries(t.O),l=e.prototype;if(s.forEach(([e,[s]])=>{31&s||2&n&&32&s?Object.defineProperty(l,e,{get(){return((e,t)=>u(e).U.get(t))(this,e)},set(n){((e,t,n,s)=>{const l=u(this),o=l.L,r=l.U.get(t),c=l.t,i=l.l;(n=((e,t)=>null==e||M(e)?e:4&t?"false"!==e&&(""===e||!!e):2&t?parseFloat(e):1&t?String(e):e)(n,s.O[t][0]))===r||8&c&&void 0!==r||(l.U.set(t,n),i&&2==(18&c)&&z(o,l,s,!1))})(0,e,n,t)},configurable:!0,enumerable:!0}):1&n&&64&s&&Object.defineProperty(l,e,{value(...t){const n=u(this);return n.R.then(()=>n.l[e](...t))}})}),1&n){const t=new Map;l.attributeChangedCallback=function(e,n,s){r.jmp(()=>{const n=t.get(e);this[n]=(null!==s||"boolean"!=typeof this[n])&&s})},e.observedAttributes=s.filter(([e,t])=>15&t[0]).map(([e,n])=>{const s=n[1]||e;return t.set(s,e),s})}}return e},Y=(e,t={})=>{const n=[],s=t.exclude||[],f=o.head,m=l.customElements,h=f.querySelector("meta[charset]"),w=o.createElement("style"),y=[];let _,b=!0;Object.assign(r,t),r.s=new URL(t.resourcesUrl||"./",o.baseURI).href,t.syncQueue&&(r.t|=4),e.forEach(e=>e[1].forEach(t=>{const l={t:t[0],g:t[1],O:t[2],P:t[3]};l.O=t[2],!c&&1&l.t&&(l.t|=8);const o=l.g,f=class extends HTMLElement{constructor(e){super(e),(e=>{const t={t:0,L:e,U:new Map};t.R=new Promise(e=>t.M=e),t.k=new Promise(e=>t.v=e),e["s-p"]=[],e["s-rc"]=[],a.set(e,t)})(e=this),1&l.t&&(c?e.attachShadow({mode:"open"}):"shadowRoot"in e||(e.shadowRoot=e))}connectedCallback(){_&&(clearTimeout(_),_=null),b?y.push(this):r.jmp(()=>((e,t)=>{if(0==(1&r.t)){const n=()=>{},s=u(e);if(!(1&s.t)){s.t|=1;{let t=e;for(;t=t.parentNode||t.host;)if(t["s-p"]){V(s,s.j=t);break}}t.O&&Object.entries(t.O).forEach(([t,[n]])=>{if(31&n&&e.hasOwnProperty(t)){const n=e[t];delete e[t],e[t]=n}}),g(()=>(async(e,t,n,s,l)=>{if(0==(32&t.t)){t.t|=32;{if((l=(e=>{const t=e.g.replace(/-/g,"_"),n=e.C,s=p.get(n);return s?s[t]:__sc_import_ss_freedom(`./${n}.entry.js`).then(e=>(p.set(n,e),e[t]),d)})(n)).then){const e=()=>{};l=await l,e()}l.isProxied||(X(l,n,2),l.isProxied=!0);const e=()=>{};t.t|=8;try{new l(t)}catch(c){d(c)}t.t&=-9,e()}const e=P(n.g);if(!$.has(e)&&l.style){const t=()=>{};let s=l.style;8&n.t&&(s=await __sc_import_ss_freedom("./p-affe7c09.js").then(t=>t.scopeCss(s,e,!1))),((e,t,n)=>{let s=$.get(e);i&&n?(s=s||new CSSStyleSheet).replace(t):s=t,$.set(e,s)})(e,s,!!(1&n.t)),t()}}const o=t.j,r=()=>z(e,t,n,!0);o&&o["s-rc"]?o["s-rc"].push(r):r()})(e,s,t))}n()}})(this,l))}disconnectedCallback(){r.jmp(()=>(()=>{0==(1&r.t)&&K(u(this).l,"componentDidUnload")})())}"s-hmr"(e){}forceUpdate(){((e,t)=>{{const n=u(e);2==(18&n.t)&&z(e,n,t,!1)}})(this,l)}componentOnReady(){return u(this).k}};l.C=e[0],s.includes(o)||m.get(o)||(n.push(o),m.define(o,X(f,l,1)))})),w.innerHTML=n+"{visibility:hidden}.hydrated{visibility:inherit}",w.setAttribute("data-styles",""),f.insertBefore(w,h?h.nextSibling:f.firstChild),b=!1,y.length>0?y.forEach(e=>e.connectedCallback()):r.jmp(()=>_=setTimeout(J,30,"timeout"))},Z=e=>u(e).L;export{C as H,O as a,Y as b,Z as g,k as h,U as p,f as r};
import{r as s,h as t}from"./p-dbfadd47.js";import{A as i,T as e,O as n}from"./p-fd92053b.js";const o=class{constructor(t){s(this,t),this.isOpen=!1,this.api=new i}static async RefreshPublishedStatus(){document.querySelectorAll("ss-freedom-admin-widget").forEach(s=>s.refreshPublishedStatus())}componentWillLoad(){"Live"!==this.stage&&((new e).observeDom(),(new n).observeDom())}open(){this.isOpen=!0}close(){this.isOpen=!1}async refreshPublishedStatus(){const{published:s}=await this.api.getObjectInfo(this.pageClassName,this.pageId);this.isPublished=s}changeStage(){const s=this.stageDropdown.value,t=new URL(window.location.toString());"Live"===s?t.searchParams.delete("stage"):t.searchParams.set("stage",s),window.location.replace(t.toString())}async publishPage(s){const t=s.closest("button");t.disabled=!0,t.classList.add("publishing"),await this.api.publishObject(this.pageClassName,this.pageId),window.location.reload()}render(){return t("div",{class:this.isOpen?"open":"closed"},t("form",null,t("label",null,"Stage:",t("select",{ref:s=>this.stageDropdown=s,onChange:()=>this.changeStage()},t("option",{selected:"Stage"===this.stage,value:"Stage"},"Staging"),t("option",{selected:"Live"===this.stage,value:"Live"},"Live"))),this.cmsEditLink&&t("a",{href:this.cmsEditLink},"Edit in CMS"),"Live"!==this.stage&&this.canPublish&&t("button",{type:"button",class:this.isPublished?"published":"publish",onClick:s=>this.publishPage(s.target)},t("ion-icon",{class:"loading",name:"sync"}),t("span",null,this.isPublished?"Published":"Publish")),t("button",{type:"button",class:"close",onClick:()=>this.close()},t("ion-icon",{name:"close"}))),t("button",{class:"silverstripe",onClick:()=>this.open()}))}static get style(){return"*{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif}a{color:#207ab7;-webkit-transition:color .3s;transition:color .3s;text-decoration:none}a:hover{color:#1c6ca1;text-decoration:underline}a:active{color:#185d8c}*{-webkit-box-sizing:border-box;box-sizing:border-box}\@-webkit-keyframes spin-anti{0%{-webkit-transform:rotate(1turn);transform:rotate(1turn)}to{-webkit-transform:rotate(0deg);transform:rotate(0deg)}}\@keyframes spin-anti{0%{-webkit-transform:rotate(1turn);transform:rotate(1turn)}to{-webkit-transform:rotate(0deg);transform:rotate(0deg)}}div{--easing:cubic-bezier(0.165,0.84,0.44,1);position:fixed;z-index:2;bottom:1rem;left:1rem;width:auto;height:auto;-webkit-box-sizing:content-box;box-sizing:content-box;-webkit-box-shadow:0 0 1rem rgba(0,0,0,.1);box-shadow:0 0 1rem rgba(0,0,0,.1);border:1px solid;overflow:hidden;-webkit-transition-property:border-color,border-radius,background-color,padding,max-width,max-height;transition-property:border-color,border-radius,background-color,padding,max-width,max-height;-webkit-transition-duration:.5s;transition-duration:.5s;-webkit-transition-timing-function:var(--easing);transition-timing-function:var(--easing)}div.closed{max-width:4rem;max-height:4rem;border-color:transparent;border-radius:50%;background-color:#004a7a;padding:0}div.closed form{opacity:0;pointer-events:none}div.open{border-color:#d3d3d3;border-radius:3px;background-color:#fff;padding:2rem 1rem .5rem;max-width:8rem;max-height:11rem}div.open button.silverstripe{opacity:0;pointer-events:none}button.silverstripe,form{-webkit-transition:opacity .5s var(--easing);transition:opacity .5s var(--easing)}button.silverstripe{position:absolute;color:#fff;width:4rem;height:4rem;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);font-size:2rem;-webkit-appearance:none;-moz-appearance:none;appearance:none;background:none;border:0;outline:0;padding:0;display:table-cell;vertical-align:middle;text-align:center}button.silverstripe:before{display:block;content:\"M\";font-family:silverstripe;font-style:normal;font-weight:400;font-variant:normal;text-transform:none;speak:none;line-height:1;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}form>*{display:block;margin-bottom:.5rem}form label{color:rgba(34,47,62,.7);font-size:.875rem}form select{border:1px solid #ccc;border-radius:3px;padding:.31rem .29rem;font-size:1rem;display:block}form button.publish,form button.published{position:relative}form button.published ion-icon,form button.publish ion-icon{position:absolute;top:calc(50% - .5em);left:calc(50% - .5em);display:none}form button.publish{-webkit-appearance:none;-moz-appearance:none;appearance:none;border-radius:3px;border:none;padding:.25rem 1rem;font-size:1rem;font-weight:700;line-height:1.5rem;-webkit-transition:background-color .3s;transition:background-color .3s}form button.publish:disabled{color:rgba(0,0,0,.3);background-color:#f0f0f0}form button.publish:not(:disabled){color:#fff;background-color:#207ab7}form button.publish:not(:disabled):hover{background-color:#1c6ca1}form button.publish:not(:disabled):active{background-color:#185d8c}form button.published{-webkit-appearance:none;-moz-appearance:none;appearance:none;border-radius:3px;border:none;padding:.25rem 1rem;font-size:1rem;font-weight:700;line-height:1.5rem;-webkit-transition:background-color .3s;transition:background-color .3s}form button.published:disabled{color:rgba(0,0,0,.3);background-color:#f0f0f0}form button.published:not(:disabled){color:#222f3e;background-color:#f0f0f0}form button.published:not(:disabled):hover{background-color:#e3e3e3}form button.published:not(:disabled):active{background-color:#d6d6d6}form button.publishing span{color:transparent}form button.publishing ion-icon{display:block;-webkit-animation:spin-anti 1s linear infinite;animation:spin-anti 1s linear infinite}form .close,form .settings{position:absolute;top:0;width:2.5rem;height:2.5rem;-webkit-appearance:none;-moz-appearance:none;appearance:none;border:0;background:none}form .settings{right:2.5rem}form .close{right:0}"}};export{o as ss_freedom_admin_widget};
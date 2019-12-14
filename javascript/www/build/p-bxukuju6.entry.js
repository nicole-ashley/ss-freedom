import{r as t,h as s,H as e,g as i}from"./p-f38dd9a0.js";import{A as o,E as n}from"./p-bc63848b.js";import{E as a}from"./p-3414dc59.js";const c=class{constructor(s){t(this,s),this.loading=!0,this.api=new o,this.instantiateOptionsForm()}componentDidLoad(){this.elementFollower=new a(this.element,this.host),this.elementFollower.startFollowing()}componentDidUnload(){this.elementFollower.stopFollowing()}async instantiateOptionsForm(){this.metadata=n.getObjectDataForFieldElement(this.element),this.formHtml=await this.api.getOptionsForm(this.metadata.class,this.metadata.id),this.loading=!1}async saveChanges(){this.loading=!0;const t=Array.from(this.formWrapper.querySelectorAll("[name]")).reduce((t,s)=>(s instanceof HTMLInputElement?t[s.name]="checkbox"===s.type?s.checked:s.value:s instanceof HTMLSelectElement?t[s.name]=s.options[s.selectedIndex].value:s instanceof HTMLTextAreaElement&&(t[s.name]=s.value),t),{}),s=await this.api.updateObject(this.metadata.class,this.metadata.id,t);this.updateObjectHtml(s),this.close()}updateObjectHtml(t){const s=[`[data-ss-freedom-object*='"class":"${this.metadata.class.replace(/\\/g,"\\\\\\\\")}"']`,`[data-ss-freedom-object*='"id":${this.metadata.id}']`];Array.from(document.querySelectorAll(s.join(""))).forEach(s=>s.outerHTML=t),this.removeOptionsButtonForOldObject()}removeOptionsButtonForOldObject(){const t=[`ss-freedom-object-options-button[object-class="${this.metadata.class.replace(/\\/g,"\\\\")}"]`,`[object-id="${this.metadata.id}"]`];Array.from(document.querySelectorAll(t.join(""))).forEach(t=>t.remove())}close(){this.host.remove()}render(){return this.loading?s("ion-icon",{name:"sync"}):s(e,null,s("div",{ref:t=>this.formWrapper=t,innerHTML:this.formHtml}),s("button",{type:"submit",onClick:()=>this.saveChanges()},"Save"),s("button",{onClick:()=>this.close()},"Cancel"))}get host(){return i(this)}static get style(){return"*{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen-Sans,Ubuntu,Cantarell,Helvetica Neue,sans-serif}*,:host{-webkit-box-sizing:border-box;box-sizing:border-box}:host{border:1px solid #d3d3d3;border-radius:3px;border-top-right-radius:0;-webkit-box-shadow:0 0 1rem rgba(0,0,0,.1);box-shadow:0 0 1rem rgba(0,0,0,.1);background-color:#fff;color:#000;padding:.5rem;line-height:0}ion-icon{-webkit-animation:spin 1s linear infinite;animation:spin 1s linear infinite;font-size:1.25rem}form{margin:0;line-height:1}fieldset{border:0;padding:.5rem;margin:0}.field{margin-bottom:.5rem}label{color:rgba(34,47,62,.7);font-size:.875rem}.middleColumn{margin-top:.2rem;margin-bottom:.5rem}input:not([type=checkbox],[type=radio]),select,textarea{min-width:100%;border:1px solid #ccc;border-radius:3px;padding:.31rem .29rem}input[type=checkbox],input[type=radio]{-webkit-transform:translateY(2px);transform:translateY(2px)}button,input,select,textarea{font-size:1rem}button{float:right;margin-right:.5rem;margin-bottom:.5rem}button:not([type=submit]){-webkit-appearance:none;-moz-appearance:none;appearance:none;border-radius:3px;border:none;padding:.25rem 1rem;font-size:.875rem;font-weight:700;line-height:1.5rem;-webkit-transition:background-color .3s;transition:background-color .3s;color:#222f3e;background-color:#f0f0f0}button:not([type=submit]):hover{background-color:#e3e3e3}button:not([type=submit]):active{background-color:#d6d6d6}button[type=submit]{-webkit-appearance:none;-moz-appearance:none;appearance:none;border-radius:3px;border:none;padding:.25rem 1rem;font-size:.875rem;font-weight:700;line-height:1.5rem;-webkit-transition:background-color .3s;transition:background-color .3s;color:#fff;background-color:#207ab7}button[type=submit]:hover{background-color:#1c6ca1}button[type=submit]:active{background-color:#185d8c}\@-webkit-keyframes spin{0%{-webkit-transform:rotate(1turn);transform:rotate(1turn)}to{-webkit-transform:rotate(0deg);transform:rotate(0deg)}}\@keyframes spin{0%{-webkit-transform:rotate(1turn);transform:rotate(1turn)}to{-webkit-transform:rotate(0deg);transform:rotate(0deg)}}"}};export{c as ss_freedom_object_options_panel};
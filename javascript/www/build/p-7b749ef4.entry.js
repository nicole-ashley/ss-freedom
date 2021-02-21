import{r as t,h as e,g as o}from"./p-6096c7c7.js";import{A as i,E as s,a as r}from"./p-cc43f556.js";import"./p-fbc84a9a.js";import{E as n}from"./p-5019ae7a.js";import{E as a}from"./p-64abae57.js";const h=class{constructor(e){t(this,e),this.processing=!1,this.deleteMethod=null,this.api=new i}componentWillLoad(){if(this.metadata=a.getObjectData(this.element),this.metadata.deleteMethod)this.deleteMethod=this.metadata.deleteMethod;else{if(!this.element.parentElement.hasAttribute("ss-freedom-relation"))return void this.host.remove();{const t=a.getDataForClosestRelation(this.element);this.deleteMethod=t.removeMethod}}}componentDidLoad(){const t={top:"0px",right:null};let e=0;this.metadata.hasOptions&&(e+=3),this.metadata.alerts&&(e+=3),t.right=`${e}rem`,this.elementFollower=new n(this.element,this.host,t),this.elementFollower.startFollowing()}disconnectedCallback(){var t;null===(t=this.elementFollower)||void 0===t||t.stopFollowing()}confirmDelete(){this.processing=!0,confirm(this.confirmationMessage)?this.doDelete():this.processing=!1}async doDelete(){const t=a.getObjectData(this.element),e=a.getDataForClosestRelation(this.element),o=await("delete"===this.deleteMethod?this.api.deleteObject(t.class,t.id):this.api.removeItemFromList(e.class,e.id,e.relation,t.id));Array.from(document.querySelectorAll(`[ss-freedom-object="${e.uid}"] [ss-freedom-relation="${e.relation}"]`)).forEach((t=>{s.replaceObjectWithMostLikelyEquivalent(t,o)})),this.host.remove(),r.RefreshPublishedStatus()}get confirmationMessage(){return"delete"===this.deleteMethod?"Are you sure you want to delete this item? This will take immediate effect on the live site and cannot be undone.":"Are you sure you want to remove this item? This will take immediate effect on the live site but will not affect other usages of this object."}get icon(){return this.processing?"refresh":"delete"===this.deleteMethod?"trash":"close"}render(){return e("button",{onClick:()=>this.confirmDelete(),disabled:this.processing},e("ion-icon",{name:this.icon}))}get host(){return o(this)}};h.style='*{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif}a{color:#207ab7;transition:color 300ms;text-decoration:none}a:hover{color:#1c6ca1;text-decoration:underline}a:active{color:#185d8c}*{box-sizing:border-box}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}button{appearance:none;border:solid 1px lightgrey;border-radius:3px;border-top-right-radius:0;box-shadow:0 0 1rem rgba(0, 0, 0, 0.1);background-color:white;padding:0.5rem;line-height:0;transition:background-color 300ms}button:not([disabled]):hover{background-color:lightgrey}button[disabled]{color:black}ion-icon{font-size:1.25rem}:host([processing]) ion-icon{animation:1s infinite linear spin}';export{h as ss_freedom_object_delete_button}
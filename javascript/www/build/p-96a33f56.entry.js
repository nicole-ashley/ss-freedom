import{r as o,h as t,H as i,g as e}from"./p-6096c7c7.js";import{A as s,E as r,a as n}from"./p-cc43f556.js";import"./p-fbc84a9a.js";import{E as a}from"./p-5019ae7a.js";import{E as c}from"./p-64abae57.js";const d=class{constructor(t){o(this,t),this.processing=!1,this.api=new s}componentDidLoad(){this.elementFollower=new a(this.element,this.host,this.offset),this.elementFollower.startFollowing()}disconnectedCallback(){this.elementFollower&&this.elementFollower.stopFollowing()}async addSibling(){this.processing=!0;const o=c.getObjectData(this.element).id,t=this.adjacentSibling&&c.getObjectData(this.adjacentSibling).id,i=c.getDataForClosestRelation(this.element),e=await this.api.addItemToList(i.class,i.id,i.relation,[o,t]);Array.from(document.querySelectorAll(`[ss-freedom-object="${i.uid}"] [ss-freedom-relation="${i.relation}"]`)).forEach((o=>{r.replaceObjectWithMostLikelyEquivalent(o,e)})),this.host.remove(),n.RefreshPublishedStatus()}render(){return t(i,null,t("button",{onClick:()=>this.addSibling(),disabled:this.processing},t("div",null,t("ion-icon",{name:this.processing?"refresh":"add"}))))}get host(){return e(this)}};d.style='*{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif}a{color:#207ab7;transition:color 300ms;text-decoration:none}a:hover{color:#1c6ca1;text-decoration:underline}a:active{color:#185d8c}*{box-sizing:border-box}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}:host{display:flex;min-width:1px;min-height:1px;background:lightgrey}button{position:relative;display:block;flex:1;justify-self:stretch;appearance:none;background:none;border:0;margin:-1rem}button:disabled{color:black}div{border:solid 1px lightgrey;border-radius:3px;border-top-right-radius:0;box-shadow:0 0 1rem rgba(0, 0, 0, 0.1);background-color:white;position:absolute;left:calc(50% - 0.5rem - 1px);top:calc(50% - 0.5rem - 1px);line-height:0;transition:background-color 300ms}button:not([disabled]):hover div{background-color:lightgrey}ion-icon{font-size:1rem}:host([processing]) ion-icon{animation:1s infinite linear spin}';export{d as ss_freedom_add_sibling_button}
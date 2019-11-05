var __awaiter=this&&this.__awaiter||function(t,e,n,r){function i(t){return t instanceof n?t:new n((function(e){e(t)}))}return new(n||(n=Promise))((function(n,o){function a(t){try{c(r.next(t))}catch(e){o(e)}}function s(t){try{c(r["throw"](t))}catch(e){o(e)}}function c(t){t.done?n(t.value):i(t.value).then(a,s)}c((r=r.apply(t,e||[])).next())}))};var __generator=this&&this.__generator||function(t,e){var n={label:0,sent:function(){if(o[0]&1)throw o[1];return o[1]},trys:[],ops:[]},r,i,o,a;return a={next:s(0),throw:s(1),return:s(2)},typeof Symbol==="function"&&(a[Symbol.iterator]=function(){return this}),a;function s(t){return function(e){return c([t,e])}}function c(a){if(r)throw new TypeError("Generator is already executing.");while(n)try{if(r=1,i&&(o=a[0]&2?i["return"]:a[0]?i["throw"]||((o=i["return"])&&o.call(i),0):i.next)&&!(o=o.call(i,a[1])).done)return o;if(i=0,o)a=[a[0]&2,o.value];switch(a[0]){case 0:case 1:o=a;break;case 4:n.label++;return{value:a[1],done:false};case 5:n.label++;i=a[1];a=[0];continue;case 7:a=n.ops.pop();n.trys.pop();continue;default:if(!(o=n.trys,o=o.length>0&&o[o.length-1])&&(a[0]===6||a[0]===2)){n=0;continue}if(a[0]===3&&(!o||a[1]>o[0]&&a[1]<o[3])){n.label=a[1];break}if(a[0]===6&&n.label<o[1]){n.label=o[1];o=a;break}if(o&&n.label<o[2]){n.label=o[2];n.ops.push(a);break}if(o[2])n.ops.pop();n.trys.pop();continue}a=e.call(t,n)}catch(s){a=[6,s];i=0}finally{r=o=0}if(a[0]&5)throw a[1];return{value:a[0]?a[1]:void 0,done:true}}};System.register([],(function(t){"use strict";return{execute:function(){var e="api/ssfreedom";var n=function(){function t(t){if(t===void 0){t=fetch.bind(window)}this.fetch=t}t.prototype.getOptionsForm=function(t,e){return __awaiter(this,void 0,void 0,(function(){var n;return __generator(this,(function(r){switch(r.label){case 0:return[4,this.fetch(this.apiUrlFor("getOptionsForm")+("?class="+t+"&id="+e),{method:"GET",credentials:"include"})];case 1:n=r.sent();return[4,n.text()];case 2:return[2,r.sent()]}}))}))};t.prototype.updateObject=function(t,e,n){return __awaiter(this,void 0,void 0,(function(){var r;return __generator(this,(function(i){switch(i.label){case 0:return[4,this.fetch(this.apiUrlFor("updateObject"),{method:"PATCH",credentials:"include",body:JSON.stringify({class:t,id:e,data:n})})];case 1:r=i.sent();return[4,r.text()];case 2:return[2,i.sent()]}}))}))};t.prototype.getLinkList=function(){return __awaiter(this,void 0,void 0,(function(){var t;return __generator(this,(function(e){switch(e.label){case 0:return[4,this.fetch(this.apiUrlFor("getLinkList"),{method:"GET",credentials:"include"})];case 1:t=e.sent();return[4,t.json()];case 2:return[2,e.sent()]}}))}))};t.prototype.apiUrlFor=function(t){return e+"/"+t};return t}();t("A",n);var r=function(){function t(){}t.getElementConfiguration=function(t){return JSON.parse(t.dataset.ssFreedomField)};t.getObjectDataForFieldElement=function(t){var e=t.closest("[data-ss-freedom-object]");var n=JSON.parse(e.dataset.ssFreedomObject);return{class:n.class,id:n.id}};return t}();t("E",r)}}}));
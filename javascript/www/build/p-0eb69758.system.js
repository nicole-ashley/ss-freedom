System.register([],(function(e){"use strict";return{execute:function(){var t=function(){function e(){}e.getElementConfiguration=function(e){var t=JSON.parse(e.getAttribute("ss-freedom-data"));t["name"]=e.getAttribute("ss-freedom-field");return t};e.getObjectData=function(e){var t=JSON.parse(e.getAttribute("ss-freedom-data"));t["uid"]=e.getAttribute("ss-freedom-object");t["class"]=e.getAttribute("ss-freedom-class");t["id"]=e.getAttribute("ss-freedom-id");return t};e.getObjectForFieldElement=function(e){return e.closest("[ss-freedom-object]")};e.getObjectDataForFieldElement=function(t){var r=e.getObjectForFieldElement(t);var s=e.getObjectData(r);return{uid:s.uid,class:s.class,id:s.id}};return e}();e("E",t)}}}));
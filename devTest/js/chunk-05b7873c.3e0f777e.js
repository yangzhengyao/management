(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-05b7873c"],{"043a":function(t,e,a){},"28a5":function(t,e,a){"use strict";var s=a("aae3"),i=a("cb7c"),l=a("ebd6"),n=a("0390"),r=a("9def"),c=a("5f1b"),o=a("520a"),u=a("79e5"),d=Math.min,p=[].push,m="split",v="length",h="lastIndex",f=4294967295,g=!u(function(){RegExp(f,"y")});a("214f")("split",2,function(t,e,a,u){var C;return C="c"=="abbc"[m](/(b)*/)[1]||4!="test"[m](/(?:)/,-1)[v]||2!="ab"[m](/(?:ab)*/)[v]||4!="."[m](/(.?)(.?)/)[v]||"."[m](/()()/)[v]>1||""[m](/.?/)[v]?function(t,e){var i=String(this);if(void 0===t&&0===e)return[];if(!s(t))return a.call(i,t,e);var l,n,r,c=[],u=(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.unicode?"u":"")+(t.sticky?"y":""),d=0,m=void 0===e?f:e>>>0,g=new RegExp(t.source,u+"g");while(l=o.call(g,i)){if(n=g[h],n>d&&(c.push(i.slice(d,l.index)),l[v]>1&&l.index<i[v]&&p.apply(c,l.slice(1)),r=l[0][v],d=n,c[v]>=m))break;g[h]===l.index&&g[h]++}return d===i[v]?!r&&g.test("")||c.push(""):c.push(i.slice(d)),c[v]>m?c.slice(0,m):c}:"0"[m](void 0,0)[v]?function(t,e){return void 0===t&&0===e?[]:a.call(this,t,e)}:a,[function(a,s){var i=t(this),l=void 0==a?void 0:a[e];return void 0!==l?l.call(a,i,s):C.call(String(i),a,s)},function(t,e){var s=u(C,t,this,e,C!==a);if(s.done)return s.value;var o=i(t),p=String(this),m=l(o,RegExp),v=o.unicode,h=(o.ignoreCase?"i":"")+(o.multiline?"m":"")+(o.unicode?"u":"")+(g?"y":"g"),b=new m(g?o:"^(?:"+o.source+")",h),_=void 0===e?f:e>>>0;if(0===_)return[];if(0===p.length)return null===c(b,p)?[p]:[];var w=0,y=0,x=[];while(y<p.length){b.lastIndex=g?y:0;var k,R=c(b,g?p:p.slice(y));if(null===R||(k=d(r(b.lastIndex+(g?0:y)),p.length))===w)y=n(p,y,v);else{if(x.push(p.slice(w,y)),x.length===_)return x;for(var P=1;P<=R.length-1;P++)if(x.push(R[P]),x.length===_)return x;y=w=k}}return x.push(p.slice(w)),x}]})},9529:function(t,e,a){"use strict";var s=a("043a"),i=a.n(s);i.a},aae3:function(t,e,a){var s=a("d3f4"),i=a("2d95"),l=a("2b4c")("match");t.exports=function(t){var e;return s(t)&&(void 0!==(e=t[l])?!!e:"RegExp"==i(t))}},caa3:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"report"},[a("el-container",[a("el-header",{},[a("div",{staticClass:"header-left"},[a("div",{staticClass:"input1"},[a("span",{},[t._v("标题")]),a("el-input",{attrs:{placeholder:"请输入标题"},nativeOn:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.queryReportList("initPage")}},model:{value:t.title,callback:function(e){t.title=e},expression:"title"}})],1),a("div",{staticClass:"select1"},[a("span",{},[t._v("类别")]),a("el-select",{attrs:{placeholder:"全部"},on:{change:function(e){return t.queryReportList("initPage")}},model:{value:t.stateValue,callback:function(e){t.stateValue=e},expression:"stateValue"}},t._l(t.stateOptions,function(t){return a("el-option",{key:t.value,attrs:{label:t.label,value:t.value}})}),1)],1)]),a("div",[a("div",{staticClass:"header-right globalSearchBtnBg"},[a("p",{staticClass:"search",on:{click:function(e){return t.queryReportList("initPage")}}},[t._v("检索")])]),a("div",{staticClass:"header-right globalSearchBtnBg",staticStyle:{"margin-left":"20px"}},[a("p",{staticClass:"search",on:{click:t.reset}},[t._v("重置")])])])]),a("el-main",[[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{data:t.tableData,stripe:"","max-height":"670",border:""},on:{"row-click":t.showDetail}},[a("el-table-column",{attrs:{label:"举报人信息"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("div",{staticClass:"flex-row"},[a("div",{staticClass:"w50 mr-r1"},[a("div",{staticClass:"small-item"},[a("span",{staticClass:"small-item-label"},[t._v("姓名:")]),a("div",{staticClass:"small-item-desc"},[t._v(t._s(e.row.reportName))])]),a("div",{staticClass:"small-item"},[a("span",{staticClass:"small-item-label"},[t._v("联系方式:")]),a("div",{staticClass:"small-item-desc"},[t._v(t._s(e.row.reportPhone))])]),a("div",{staticClass:"small-item"},[a("span",{staticClass:"small-item-label"},[t._v("现居住地址:")]),a("div",{staticClass:"small-item-desc huan3"},[t._v(t._s(e.row.reportAddress))])])]),a("div",{staticClass:"w50"},[a("div",{staticClass:"small-item"},[a("span",{staticClass:"small-item-label"},[t._v("身份证号:")]),a("div",{staticClass:"small-item-desc"},[t._v(t._s(e.row.reportIdcard))])]),a("div",{staticClass:"small-item"},[a("span",{staticClass:"small-item-label"},[t._v("政治面貌:")]),a("div",{staticClass:"small-item-desc"},[t._v(t._s(e.row.reportIdentity))])]),a("div",{staticClass:"small-item"},[a("span",{staticClass:"small-item-label"},[t._v("级别:")]),a("div",{staticClass:"small-item-desc"},[t._v(t._s(e.row.reportLevel))])])])])]}}])}),a("el-table-column",{attrs:{label:"被举报人信息"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("div",{staticClass:"small-item"},[a("span",{staticClass:"small-item-label"},[t._v("姓名:")]),a("div",{staticClass:"small-item-desc"},[t._v(t._s(e.row.beReportName))])]),a("div",{staticClass:"small-item"},[a("span",{staticClass:"small-item-label"},[t._v("职务:")]),a("div",{staticClass:"small-item-desc"},[t._v(t._s(e.row.beReportPosition))])]),a("div",{staticClass:"small-item"},[a("span",{staticClass:"small-item-label"},[t._v("单位:")]),a("div",{staticClass:"small-item-desc huan2"},[t._v(t._s(e.row.beReportUnit))])]),a("div",{staticClass:"small-item"},[a("span",{staticClass:"small-item-label"},[t._v("级别:")]),a("div",{staticClass:"small-item-desc"},[t._v(t._s(e.row.beReportLevel))])])]}}])}),a("el-table-column",{attrs:{label:"举报正文"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("div",{staticClass:"flex-row"},[a("div",{staticClass:"w50 mr-r1"},[a("div",{staticClass:"small-item"},[a("span",{staticClass:"small-item-label"},[t._v("标题:")]),a("div",{staticClass:"small-item-desc huan1"},[t._v(t._s(e.row.reportTitle))])]),a("div",{staticClass:"small-item"},[a("span",{staticClass:"small-item-label"},[t._v("问题类别:")]),a("div",{staticClass:"small-item-desc huan1"},[t._v(t._s(e.row.reportTypeId))])]),a("div",{staticClass:"small-item"},[a("span",{staticClass:"small-item-label"},[t._v("正文:")]),a("div",{staticClass:"small-item-desc huan3"},[t._v(t._s(e.row.reportContent))])])]),a("div",{staticClass:"w50"},[a("div",{staticClass:"small-item"},[a("span",{staticClass:"small-item-label"},[t._v("问题细类:")]),a("div",{staticClass:"small-item-desc huan1"},[t._v(t._s(e.row.reportTypeDetailId))])]),a("div",{staticClass:"small-item"},[a("span",{staticClass:"small-item-label"},[t._v("附件:")]),a("div",t._l(e.row.file,function(t,e){return a("img",{key:e,staticStyle:{"margin-right":"15px",border:"1px solid #ccc"},attrs:{src:t,alt:"",width:"30",height:"50"}})}),0)])])])]}}])}),a("el-table-column",{attrs:{label:"备注"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("div",{staticClass:"small-item"},[a("span",{staticClass:"small-item-label"},[t._v("举报时间:")]),a("div",{staticClass:"small-item-desc"},[t._v(t._s(e.row.insertTime))])])]}}])})],1)],a("div",[a("paging",{attrs:{total:t.pageTotal,currentPage:t.currentPage,pageSize:t.pageSize},on:{"update:currentPage":function(e){t.currentPage=e},"update:current-page":function(e){t.currentPage=e}}})],1)],2)],1)],1)},i=[],l=(a("28a5"),a("ac6a"),a("96cf"),a("3b8d")),n={name:"report",components:{},data:function(){return{title:"",stateValue:"",stateOptions:[],loading:!1,currentPage:1,pageSize:10,pageTotal:0,tableData:[]}},mounted:function(){this.queryType(),this.queryReportList()},watch:{currentPage:function(t,e){t&&this.queryReportList()}},methods:{stateOptionsChange:function(){this.queryReportList()},editClick:function(){},readClick:function(){},queryType:function(){var t=Object(l["a"])(regeneratorRuntime.mark(function t(){var e,a;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,this.api.queryReportType();case 3:e=t.sent,e.success?(a=[],e.data.forEach(function(t,e){a.push({label:t.content,value:t.id})}),this.stateOptions=[{value:"",label:"全部"}].concat(a)):this.stateOptions=[],t.next=11;break;case 7:t.prev=7,t.t0=t["catch"](0),this.stateOptions=[],console.log(t.t0);case 11:case"end":return t.stop()}},t,this,[[0,7]])}));function e(){return t.apply(this,arguments)}return e}(),reset:function(){this.title="",this.stateValue="",this.queryReportList("initPage")},queryReportList:function(){var t=Object(l["a"])(regeneratorRuntime.mark(function t(e){var a,s;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return"initPage"==e&&(this.currentPage=1),this.loading=!0,t.prev=2,a={pageNo:this.currentPage,pageSize:this.pageSize,reportTitle:this.title},""!==this.stateValue&&(a.reportTypeId=this.stateValue),t.next=7,this.api.queryReport(a);case 7:s=t.sent,this.loading=!1,[],1==s.success?(s.data.forEach(function(t,e){t.file=t.file?t.file.split(","):[]}),this.tableData=s.data,this.pageTotal=s.total):(this.tableData=[],this.pageTotal=0),t.next=17;break;case 13:t.prev=13,t.t0=t["catch"](2),this.tableData=[],console.log(t.t0);case 17:case"end":return t.stop()}},t,this,[[2,13]])}));function e(e){return t.apply(this,arguments)}return e}(),showDetail:function(t,e,a){a.stopPropagation()?a.stopPropagation():a.cancelBubble=!0,t.type=5,this.$emit("show-drawer",t)}}},r=n,c=(a("9529"),a("2877")),o=Object(c["a"])(r,s,i,!1,null,null,null);e["default"]=o.exports}}]);
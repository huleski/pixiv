webpackJsonp([1],{"1eHa":function(t,e){},GHVy:function(t,e){},NHnr:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("7+uW"),i={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{attrs:{id:"app"}},[e("router-view")],1)},staticRenderFns:[]};var r=a("VU/8")({name:"App"},i,!1,function(t){a("hkQD")},null,null).exports,s=a("/ocq"),o=a("//Fk"),c=a.n(o),l=a("mtWM"),u=a.n(l).a.create({baseURL:"https://api.pixivic.com",timeout:1e4});u.interceptors.request.use(function(t){return t,t.headers["Content-Type"]="application/json",t},function(t){c.a.reject(t)}),u.interceptors.response.use(function(t){return t.data},function(t){return c.a.reject(t),!1});var d=u,v=null,p={components:{},data:function(){return{pickerOptions:{disabledDate:function(t){return t.getTime()>Date.now()}},list:[],over:!1,currentDate:"",page:0,selectedCount:0}},created:function(){},mounted:function(){this.init();var t=new Date;t.setDate(t.getDate()-3),this.currentDate=this.dateFormat(t);var e=this;document.getElementById("waterfall").addEventListener("click",function(t){if(t.target.attributes["son-idx"]&&null!==t.target.attributes["son-idx"].nodeValue&&""!==t.target.attributes["son-idx"].nodeValue){var a=parseInt(t.target.attributes["son-idx"].nodeValue);e.showBigAction(a)}else t.target.attributes.class&&-1!=t.target.attributes.class.value.indexOf("description")&&(-1==t.target.attributes.class.value.indexOf("checked")?(t.target.classList.add("checked"),e.selectedCount+=1):(t.target.classList.remove("checked"),e.selectedCount-=1))}),document.getElementById("waterfall").addEventListener("contextmenu",function(t){if(event.preventDefault(),t.target.attributes.class&&"img"==t.target.attributes.class.value){var e=t.target.parentNode;-1==e.attributes.class.value.indexOf("green-bord")?e.classList.add("green-bord"):e.classList.remove("green-bord")}})},methods:{init:function(){console.log("初始化"),console.log(this.over),this.list=[],this.page=1,this.over=!1,document.getElementById("waterfall").innerHTML="";var t=this;(v=new WaterFall({container:"#waterfall",pins:".pin",loader:"#loader",gapHeight:20,gapWidth:20,pinWidth:160,threshold:100})).on("load",function(){t.loadMore()})},loadMore:function(){var t=this;if(console.log("加载数据"),!this.over){var e,a,n=this;(e=n.page,a=n.currentDate,d({url:"/ranks",method:"get",params:{page:e,date:a,mode:"day"}})).then(function(e){var a;if(n.page+=1,e&&e.data&&e.data.data&&!(e.data.data.length<1)){for(var i=e.data.data,r=[],s=function(t){var e=i[t];if("manga"==e.type||e.pageCount>10)return"continue";e.imageUrls.forEach(function(t){var a={};!function(t,e){var e=e||{};for(var a in t)e[a]=t[a]}(e,a),a.src=t,a.src.large=a.src.large.replace("pximg.net","pixiv.cat"),r.push(a)})},o=0;o<i.length;o++)s(o);for(var c=n.list.length,l=[],u=0,d=r.length;u<d;u++){var p=r[u];l.push('<div class="pin"><img son-idx="'+(c+u)+'" src="'+p.src.large+'" class="img" alt="'+p.title+'"> <p class="description">'+p.title+'<i class="el-icon-success"></i></p></div>')}(a=n.list).push.apply(a,r),v.append(l.join(""),".img")}else t.over=!0})}},showBigAction:function(t){var e=[];this.list.forEach(function(t){e.push(t.src.large)}),this.$imagePreview({images:e,index:t})},syncho:function(){for(var t=document.getElementsByClassName("checked"),e=0;e<t.length;e++){var a=t[e].previousElementSibling,n=a.getAttribute("son-idx"),i=this.list[n];h(a.src,i.artistPreView.name+" •「"+i.id+"」")}},today:function(){},toTop:function(){var t=setInterval(function(){var e=document.documentElement.scrollTop||document.body.scrollTop;(e-=100)>0?window.scrollTo(0,e):(window.scrollTo(0,0),clearInterval(t),t=null)},1)},changeDate:function(t){var e=new Date(this.currentDate);e.setDate(e.getDate()+t),this.currentDate=this.dateFormat(e),this.init()},dateFormat:function(t){var e=t.getFullYear(),a=(t.getMonth()+1).toString();a.length<=1&&(a="0"+a);var n=t.getDate().toString();return n.length<=1&&(n="0"+n),e+"-"+a+"-"+n}}};function h(t,e){var a=new Image;a.setAttribute("crossOrigin","anonymous"),a.onload=function(){var t=document.createElement("canvas");t.width=a.width,t.height=a.height,t.getContext("2d").drawImage(a,0,0,a.width,a.height);var n=t.toDataURL("image/png"),i=document.createElement("a"),r=new MouseEvent("click");i.download=e||"photo",i.href=n,i.dispatchEvent(r)},a.src=t}var g={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticStyle:{"margin-top":"20px"}},[a("div",{staticClass:"block"},[a("el-date-picker",{attrs:{type:"date",placeholder:"选择日期","value-format":"yyyy-MM-dd","picker-options":t.pickerOptions},on:{change:t.init},model:{value:t.currentDate,callback:function(e){t.currentDate=e},expression:"currentDate"}})],1),t._v(" "),a("el-badge",{staticClass:"item",attrs:{value:t.selectedCount,type:"success",id:"count"}}),t._v(" "),a("el-button",{attrs:{type:"success",size:"mini",plain:"",id:"syncho"},on:{click:t.syncho}},[t._v("同步")]),t._v(" "),a("el-button",{attrs:{type:"primary",size:"mini",plain:"",id:"today"},on:{click:t.today}},[t._v("今日")]),t._v(" "),a("button",{staticClass:"el-carousel__arrow el-carousel__arrow--left",attrs:{type:"button"},on:{click:function(e){return t.changeDate(-1)}}},[a("i",{staticClass:"el-icon-arrow-left"})]),t._v(" "),a("button",{staticClass:"el-carousel__arrow el-carousel__arrow--right",attrs:{type:"button"},on:{click:function(e){return t.changeDate(1)}}},[a("i",{staticClass:"el-icon-arrow-right"})]),t._v(" "),a("div",{staticClass:"el-backtop",staticStyle:{right:"10px",bottom:"10px"}},[a("i",{staticClass:"el-icon-caret-top",on:{click:t.toTop}})]),t._v(" "),a("div",{attrs:{id:"waterfall"}}),t._v(" "),t._m(0)],1)},staticRenderFns:[function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"loader",attrs:{id:"loader"}},[e("div",{staticClass:"loader-inner line-spin-fade-loader"},[e("div"),this._v(" "),e("div"),this._v(" "),e("div"),this._v(" "),e("div"),this._v(" "),e("div"),this._v(" "),e("div"),this._v(" "),e("div"),this._v(" "),e("div")])])}]};var f=a("VU/8")(p,g,!1,function(t){a("GHVy")},null,null).exports;n.default.use(s.a);var m=new s.a({routes:[{path:"*",redirect:"/"},{path:"/",name:"Home",component:f}]}),w=a("zL8q"),_=a.n(w),b=(a("tvR6"),a("hR+Y")),y=a.n(b);a("1eHa");n.default.use(_.a),n.default.config.productionTip=!1;var D=a("bqTm");n.default.use(D),n.default.use(y.a),new n.default({el:"#app",router:m,components:{App:r},template:"<App/>"})},hkQD:function(t,e){},tvR6:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.406e9b536f99e7c16946.js.map
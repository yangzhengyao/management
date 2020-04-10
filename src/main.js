import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import axios from "axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import '../theme/index.css'
import $ from 'jquery'
import echarts from 'echarts'
import component from "./components";
import api from "./request/api";
import filter from "./filter";
import global_ from './util/public/Global'
import handleCookie from '@/util/handleCookie'
/*图片预览---可缩放和拖拽*/
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
//引入全局css
import './util/public/Global.less'
Vue.prototype.api = api;

Vue.config.productionTip = false;
Vue.prototype.axios = axios;
Vue.use(ElementUI);
Vue.use(component);
Vue.use(filter);
Vue.prototype.$echarts = echarts;
//let trend = this.$echarts.init(document.getElementById('trend'))
Vue.prototype.commonFunc = global_;

Vue.use(Viewer);
//设置默认配置项
Viewer.setDefaults({
  'inline':false,
  'button':true, //右上角按钮
  "navbar": true, //底部缩略图
  "title": false, //当前图片标题
  "toolbar": false, //底部工具栏
  "tooltip": true, //显示缩放百分比
  "movable": true, //是否可以移动
  "zoomable": true, //是否可以缩放
  "rotatable": false, //是否可旋转
  "scalable": false, //是否可翻转
  "transition": true, //使用 CSS3 过度
  "fullscreen": false, //播放时是否全屏
  "keyboard": true, //是否支持键盘
  "url": "src",
  "className":"cls",
  ready: function (e) {
    //console.log(e.type,'组件以初始化');
  },
  show: function (e) {
    //console.log(e.type,'图片显示开始');
  },
  shown: function (e) {
    //console.log(e.type,'图片显示结束');
  },
  hide: function (e) {
    //console.log(e.type,'图片隐藏完成');
  },
  hidden: function (e) {
    //console.log(e.type,'图片隐藏结束');
  },
  view: function (e) {
    //console.log(e.type,'视图开始');
  },
  viewed: function (e) {
    //console.log(e.type,'视图结束');
    // 索引为 1 的图片旋转20度
    /*if(e.detail.index === 1){
      this.viewer.rotate(20);
    }*/
  },
  zoom: function (e) {
    //console.log(e.type,'图片缩放开始');
  },
  zoomed: function (e) {
    //console.log(e.type,'图片缩放结束');
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

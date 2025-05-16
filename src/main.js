import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VConsole from 'vconsole'
const vconsole = new VConsole()

// 全局引入vant插件
import Vant from 'vant'
import 'vant/lib/index.css'
//引入进度条样式
import 'nprogress/nprogress.css'

// 全局引入样式变量以及样式
import './common/styles/var.scss'
import './common/styles/app.scss'
import './common/styles/base.css'
import './common/styles/dialog-class.scss' //自定义 vant  Dialog样式
// import { useIntersectionObserver } from '@v÷ueuse/core';
// Vue.directive('img-lazy', {
//   inserted (el, binding) {
//     const { stop } = useIntersectionObserver(
//       el,
//       ([{ isIntersecting }]) => {
//         // if(isIntersecting){

//         // }
//         console.log('图片懒加载数据', el, binding, isIntersecting);
//         // el.value = binding.value
//       },
//     )

//   }
// })

// 全局状态管理，具体使用参考vuex文档
Vue.prototype.$store = store
Vue.use(Vant)

import commonUtils from '@/common/utils/index.js'
import commonNets from '@/common/nets/index.js'
import commonCaches from '@/common/caches/index.js'
import commonProtocol from '@/common/protocols/index.js'
import appConfig from '@/common/configs/index.js'
import messageAct from '@/common/message-act.js'
import filters from '@/common/filters/index.js'
import methodTools from '@/common/methodTools.js'

/*
// 引入vue-amap
import VueAMap from 'vue-amap';
Vue.use(VueAMap);

// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 高德的key
  key: '6926e56f0527cf3874e3ba79b374f991',
  // a76cff991fa071896f644b1d55f4995c 安卓
  // 插件集合
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch',
    'AMap.Scale', 'AMap.OverView',
    'AMap.ToolBar', 'AMap.MapType',
    'AMap.PolyEditor', 'AMap.CircleEditor',
    'AMap.Geolocation'],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.4',
  uiVersion: "1.0"
});
*/

Vue.prototype.$commonUtils = commonUtils
Vue.prototype.$commonNets = commonNets
Vue.prototype.$commonCaches = commonCaches
Vue.prototype.$commonProtocol = commonProtocol
Vue.prototype.$appConfig = appConfig
Vue.prototype.$messageAct = messageAct

Vue.config.productionTip = false


//初始化APP与H5间的消息通讯
Vue.prototype.$messageAct.setInit(Vue.prototype.$messageAct)

//导入过滤器
Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})
//全局混入
Vue.mixin(methodTools);

let h5App = new Vue({
  router,
  store,// vuex
  render: h => h(App)
}).$mount('#app')

// 因为APP端已禁止 返回键(侧滑返回)， 所以 H5 端 用 plus 处理返回键
let first = null;
function routerBackFn () {
  //webview.close(); //hide,quit
  //plus.runtime.quit();
  //首页返回键处理
  //首页返回键,1.5秒内，连续两次按返回键，则退出应用；

  // 聊天内部返回， 需要监听 是否隐藏导航栏(是否是聊天首页) 变量值作为判断依据
  if (!h5App.$store._modules.root.state.im.tabbarShow) {
    return false;
  }

  if (h5App._routerRoot._route.path === "/common/index") {
    // plus.key.addEventListener('backbutton', function () {
    //首次按键，提示‘再按一次退出应用’
    if (!first) {
      first = new Date().getTime();
      commonUtils.utilCore.showToast("再按一次退出应用");
      setTimeout(function () {
        first = null;
      }, 1500);
    } else {
      if (new Date().getTime() - first < 1500) {
        plus.runtime.quit();
      }
    }
    // }, false);
    return true;
  }
  // 新闻详情返回
  if (h5App._routerRoot._route.path === "/common/web-detail") {
    commonUtils.utilCore.uniGoBack();
  }
}

document.addEventListener('plusready', function () {
  const webview = plus.webview.currentWebview();
  const ua = window.navigator.userAgent;
  plus.key.addEventListener('backbutton', function () {
    webview.canBack(function (e) {
      if (e.canBack) {
        if (!routerBackFn()) {
          webview.back();
        }
      } else {
        routerBackFn();
      }
    })
  });
  // IOS 键盘弹出收起事件
  // Android  默认值为adjustResize 不判断平台也行
  // webview.setStyle({
  //   softinputMode: "adjustResize"
  // });
  let timer = null;
  function handleEventDebounce (fn) {
    clearTimer();
    timer = setTimeout(() => {
      !!fn && fn();
    }, 500);
  }
  // 清除定时器
  function clearTimer () {
    if (timer) clearTimeout(timer);
  }
  // IOS 键盘弹出 可能键盘遮挡 输入框，需处理下
  let scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;

  if (/iPhone|iPod|iPad/i.test(ua)) {
    window.addEventListener('focusin', (ev) => {
      scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
      // 键盘弹出事件处理
      const e = ev || window.event;
      // IOS 底部的 无法滚动需 特殊加 给body 高度
      if ((e.target.nodeName === "INPUT" || e.target.nodeName === "TEXTAREA") && e.target.className === "_iosKeyboardInput") {
        window.scrollTo(0, 0);
        // const clientHeight = document.body.clientHeight;
        // // 判断 元素是否在
        // document.body.style.paddingBottom = clientHeight / 3 + "px";
        clearTimer();
        setTimeout(() => {
          window.scrollTo(0, e.target.offsetHeight + 10);//scrollIntoViewIfNeeded有点懒惰，先特殊处理
          // e.target.scrollIntoViewIfNeeded(true);//当前元素在视窗的可见范围内不可见，元素将尽量滚动到父元素可视区域的中部位置（垂直方向）
        }, 200)
      }
    });

    window.addEventListener('focusout', (ev) => {
      // 键盘收起事件处理
      const e = ev || window.event;
      if ((e.target.nodeName === "INPUT" || e.target.nodeName === "TEXTAREA") && e.target.className === "_iosKeyboardInput") {
        handleEventDebounce(function () {
          window.scrollTo(0, 0);
          // document.body.style.paddingBottom = "0";
        })
      }
    });
  }
});
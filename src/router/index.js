/**
 * 设置系统的合局路由
 */
import Vue from "vue";
import VueRouter from "vue-router";
import commonUtils from "@/common/utils/index.js";
import store from "@/store/index.js";

import NProgress from 'nprogress'

Vue.use(VueRouter);

let routes = [];

//自动加载模块路由
const modules = {}
const req = require.context('./modules', false, /\.js$/)
const requireAll = (requireContext) => requireContext.keys().map(fileName => {
  const component = requireContext(fileName)
  const name = fileName.replace(/^.*\/(.*)\.\w+$/, '$1')
  modules[name] = component.default
  routes = routes.concat(modules[name]);
})
requireAll(req)

//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

//commonUtils.appLog.log("2222222=============>>>", routes)

let routes404 = [
  {//404页面
    path: "/tools/404",
    name: "tools-404", //
    meta: { requiresAuth: false, title: "404" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../views/tools/404.vue"),
  },
  {
    path: "*", // 如果匹配不上的路径，则全跳到404页上去
    redirect: { name: "tools-404" },
  }];

//确保 404页面在最后
routes = routes.concat(routes404);

//commonUtils.appLog.log("=============>>>", routes)

const router = new VueRouter({
  routes,
});

// 进行前至的路由守护，判断用户的登陆情况
router.beforeEach((to, from, next) => {
  //进页面前
  NProgress.start();
  commonUtils.appLog.log("to.path=======>", to.path);
  commonUtils.appLog.log("to.query==========>", to.query)
  commonUtils.appLog.log("from.path==========>", from.path)
  commonUtils.appLog.log("from.query==========>", from.query)

  // 如果有需要跳回APP的地址，则设置
  if (!commonUtils.utilCore.empty(to.query.APPSYSbakUrl)) {
    store.commit("app/setAppBackUrl", to.query.APPSYSbakUrl.toString());
  }

  // 如果有登陆标记，则需要获取用户登陆的信息(这里不需要从APP来传用户的登陆信息了)
  // if (!commonUtils.utilCore.empty(to.query.APPSYSisLogin)) {
  //   let tmpIsLogin = to.query.isLogin == 1;
  //   store.commit("user/setIsLogin", tmpIsLogin);
  // }
  // //如果有登的uid,则需要记录用户登陆的uid
  // if (!commonUtils.utilCore.empty(to.query.APPSYSuid)) {
  //   store.commit("user/setUserId", to.query.APPSYSuid);
  //   commonUtils.appLog.log("用户登陆uid=>", to.query.APPSYSuid);
  // }

  //如果有登的userTokenMd5,则需要记录用户登陆的userTokenMd5
  if (!commonUtils.utilCore.empty(to.query.APPSYSuserTokenMd5)) {
    store.commit("user/setUserTokenMd5", to.query.APPSYSuserTokenMd5);
  }
  //如果有状态栏的情况，则记录
  if (!commonUtils.utilCore.empty(to.query.APPSYSstatusBarHeight)) {
    store.commit("app/setStatusBarHeight", to.query.APPSYSstatusBarHeight)
  }

  //如果有设置测试环境，则记录
  if (!commonUtils.utilCore.empty(to.query.APPSYSAppEnv)) {
    store.commit("common/setAPPSYSAppEnv", to.query.APPSYSAppEnv)
  }

  next();
});
router.afterEach((to, from) => {
  //记录来源页的路由
  router.yuFengFormPage = from;
  //进完页面后
  NProgress.done();
});

NProgress.configure({ ease: 'linear', speed: 500, showSpinner: false });


export default router;

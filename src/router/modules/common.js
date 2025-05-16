/**
 * 这里只放公共的，不需要用户登陆的页面
 */
let commonPage = [
  {
    path: "/im/index",
    name: "im-index", //
    meta: { requiresAuth: false, title: "消息" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/im/index.vue"),
  },
  {
    path: "/common/login",
    name: "common-login", //
    meta: { requiresAuth: false, title: "自动登陆" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/common/login.vue"),
  },
  {
    path: "/common/index",
    name: "common-index", //
    meta: { requiresAuth: false, title: "首页", keepAlive: true, canKeep: false }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/common/index.vue"),
  },
  {
    path: "/common/web-detail",
    name: "common-web-detail", //
    meta: { requiresAuth: false, title: "新闻详情" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/common/web-detail.vue"),
  },
  {
    path: "/user/index",
    name: "user-index", //
    meta: { requiresAuth: false, title: "我的" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/user/index.vue")
  },
  {
    path: "/user/setting",
    name: "user-setting", //
    meta: { requiresAuth: false, title: "设置" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/user/setting.vue"),
  },
  {
    path: "/user/attentionlist",
    name: "user-attentionlist", //
    meta: { requiresAuth: false, title: "我的关注", keepAlive: true, canKeep: false }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/user/attentionlist.vue"),
  },
  {
    path: "/user/signlist",
    name: "user-signlist", //
    meta: { requiresAuth: false, title: "线上签约", keepAlive: true, canKeep: false }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/user/signlist.vue"),
  },
  {
    path: "/user/checkreceipt",
    name: "user-checkreceipt", //
    meta: { requiresAuth: false, title: "查看收据" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/user/checkreceipt.vue"),
  },
];



export default commonPage;
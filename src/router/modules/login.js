/**
 * 登陆的页面
 */
let loginPage = [
  {
    path: "/login/index",
    name: "login-index", //
    meta: { requiresAuth: false, title: "用户登陆" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/login/index.vue"),
  },
  {
    path: "/login/otherPhone",
    name: "login-otherPhone", //
    meta: { requiresAuth: false, title: "其他手机登录" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/login/otherPhone.vue"),
  },
  {
    path: "/login/bindphone",
    name: "login-bindphone", //
    meta: { requiresAuth: false, title: "绑定手机号码" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/login/bindphone.vue"),
  },
  {
    path: "/login/bindphoneApple",
    name: "login-bindphoneApple", //
    meta: { requiresAuth: false, title: "绑定手机号码" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/login/bindphoneApple.vue"),
  },
  {
    path: "/login/wechatLogin",
    name: "login-wechatLogin", //
    meta: { requiresAuth: false, title: "微信登录" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/login/wechatLogin.vue"),
  },
  {
    path: "/login/appleLogin",
    name: "login-appleLogin", //
    meta: { requiresAuth: false, title: "苹果登录" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/login/appleLogin.vue"),
  },
  {
    path: "/login/register",
    name: "login-register", //
    meta: { requiresAuth: false, title: "注册" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/login/register.vue"),
  },
  {
    path: "/login/retrievePassword",
    name: "login-retrievePassword", //
    meta: { requiresAuth: false, title: "找回密码" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/login/retrievePassword.vue"),
  },
  {
    path: "/login/agreement",
    name: "login-agreement", //
    meta: { requiresAuth: false, title: "裕丰地产用户使用协议" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/login/legal/agreement.vue"),
  },
  {
    path: "/login/privacy",
    name: "login-privacy", //
    meta: { requiresAuth: false, title: "裕丰地产隐私政策" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/login/legal/privacy.vue"),
  },
  {
    path: "/login/disclaimer",
    name: "login-disclaimer", //
    meta: { requiresAuth: false, title: "免责声明" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/login/legal/disclaimer.vue"),
  },
];



export default loginPage;
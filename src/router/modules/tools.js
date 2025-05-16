/**
 * 这里只放公共的，不需要用户登陆的页面
 */
let toolsPage = [
  {
    path: "/tools/loanCalculate",
    name: "tools-loanCalculate", //
    meta: { requiresAuth: false, title: "房贷计算器" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/tools/loanCalculate/index.vue"),
  },
  {
    path: "/tools/loanCalculateResult",
    name: "tools-loanCalculateResult", //
    meta: { requiresAuth: false, title: "房贷计算器结果" },
    component: () => import("../../views/tools/loanCalculateResult/index.vue"),
  },
  //下载 显示
  {
    path: "/public/download/download",
    name: "public-download-download", //
    meta: { requiresAuth: false, title: "下载APP" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/public/download/download.vue"),
  },
  {
    path: "/tools/test",
    name: "tools-test", //
    meta: { requiresAuth: false, title: "功能测试页" },
    component: () => import("../../views/tools/test.vue"),
  },
  {
    path: "/tools/previewpdfh5",
    name: "tools-previewpdfh5", //
    meta: { requiresAuth: false, title: "pfd预览" },
    component: () => import("../../views/tools/previewpdfh5.vue"),
  }
];



export default toolsPage;
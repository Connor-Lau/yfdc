/**
 * 首页的页面
 */
let home = [
  {
    path: "/home/index",
    name: "home-index", //
    meta: { requiresAuth: false, title: "首页" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/index.vue"),
  },
  {
    path: "/home/list/secondhouseList",
    name: "/home/list/secondhouseList", //
    meta: { requiresAuth: false, title: "二手房列表", keepAlive: true, canKeep: false }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/list/secondhouseList.vue"),
  },
  {
    path: "/home/list/newhouseList",
    name: "/home/list/newhouseList", //
    meta: { requiresAuth: false, title: "新房列表", keepAlive: true, canKeep: false }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/list/newhouseList.vue"),
  },
  {
    path: "/home/list/renthouseList",
    name: "/home/list/renthouseList", //
    meta: { requiresAuth: false, title: "租房列表", keepAlive: true, canKeep: false }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/list/renthouseList.vue"),
  },
  {
    path: "/home/search",
    name: "home-search", //
    meta: { requiresAuth: false, title: "搜索" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/search.vue"),
  },
  {
    path: "/home/city/index",
    name: "/home/city/index", //
    meta: { requiresAuth: false, title: "城市选择" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/city/index.vue"),
  },
  {
    path: "/home/city/searchcity",
    name: "/home/city/searchcity", //
    meta: { requiresAuth: false, title: "城市搜索" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/city/searchcity.vue"),
  },
  {
    path: "/home/detail/secondhouseDetail",
    name: "home-detail-secondhouseDetail", //
    meta: { requiresAuth: false, title: "二手房楼盘详情", keepAlive: true, canKeep: false }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/detail/secondhouseDetail.vue"),
  },
  {
    path: "/home/detail/newhouseDetail",
    name: "/home/detail/newhouseDetail", //
    meta: { requiresAuth: false, title: "新房楼盘详情", keepAlive: true, canKeep: false }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/detail/newhouseDetail.vue"),
  },
  {
    path: "/home/detail/renthouseDetail",
    name: "/home/detail/renthouseDetail", //
    meta: { requiresAuth: false, title: "租房楼盘详情", keepAlive: true, canKeep: false }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/detail/renthouseDetail.vue"),
  },
  {
    path: "/home/detail/housevillage",
    name: "/home/detail/housevillage", //
    meta: { requiresAuth: false, title: "小区" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/detail/housevillage.vue"),
  },
  {
    path: "/home/thirdparty/thirdparty",
    name: "/home/thirdparty/thirdparty", //
    meta: { requiresAuth: false, title: "VR看房" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/thirdparty/thirdparty.vue"),
  },
  {
    path: "/home/detail/saleInfo",
    name: "/home/detail/saleInfo", //
    meta: { requiresAuth: false, title: "二手房房源信息" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/detail/saleInfo.vue"),
  },
  {
    path: "/home/detail/newsaleInfo",
    name: "/home/detail/newsaleInfo", //
    meta: { requiresAuth: false, title: "新房房源信息" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/detail/newsaleInfo.vue"),
  },
  {
    path: "/home/detail/appointmenthouse",
    name: "/home/detail/appointmenthouse", //
    meta: { requiresAuth: false, title: "预约看房", keepAlive: true }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/detail/appointmenthouse.vue"),
  },
  {
    path: "/home/detail/appointmentbroker",
    name: "/home/detail/appointmentbroker", //
    meta: { requiresAuth: false, title: "选择预约经纪人", keepAlive: true }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/detail/appointmentbroker.vue"),
  },
  {
    path: "/home/list/dealist",
    name: "/home/list/dealist", //
    meta: { requiresAuth: false, title: "查成交", keepAlive: true, canKeep: false }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/list/dealist.vue"),
  },
  // {
  //   path: "/home/list/dealist-demo",
  //   name: "/home/list/dealist-demo", //
  //   meta: { requiresAuth: false, title: "查成交", keepAlive: true, canKeep: false }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
  //   component: () => import("../../views/home/list/dealist-demo.vue"),
  // },
  {
    path: "/home/detail/dealSaleDetail",
    name: "home-detail-dealSaleDetail", //
    meta: { requiresAuth: false, title: "成交详情" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/detail/dealSaleDetail.vue"),
  },
  {
    path: "/home/detail/dealRentDetail",
    name: "home-detail-dealRentDetail", //
    meta: { requiresAuth: false, title: "租房成交详情" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/detail/dealRentDetail.vue"),
  },
  {
    path: "/home/newsearch",
    name: "home-newsearch", //
    meta: { requiresAuth: false, title: "搜索", keepAlive: true, canKeep: false }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/newsearch.vue"),
  },
  {
    path: "/home/detail/searchdeal",
    name: "home-detail-searchdeal", //
    meta: { requiresAuth: false, title: "查成交搜索", keepAlive: true, canKeep: false }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/detail/searchdeal.vue"),
  },
  {
    path: "/home/list/mergelist",
    name: "home-list-mergelist", //
    meta: { requiresAuth: false, title: "搜索合并列表", keepAlive: true, canKeep: false }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/list/mergelist.vue"),
  },
];



export default home;
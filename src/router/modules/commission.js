/**
 * 委托的页面
 */

let commission = [
  {
    path: "/home/commission/index",
    name: "/home/commission/index", //
    meta: { requiresAuth: false, keepAlive: true, title: "我的委托" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/commission/index.vue"),
  },
  {
    path: "/home/commission/releasehouse",
    name: "/home/commission/releasehouse", //
    meta: { requiresAuth: false, title: "发布房源", keepAlive: true, }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/commission/releasehouse.vue"),
  },
  {
    path: "/home/commission/villagechoose",
    name: "/home/commission/villagechoose", //
    meta: { requiresAuth: false, keepAlive: true, title: "小区名称" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/commission/villagechoose.vue"),
  },
  {
    path: "/home/commission/houseaddress",
    name: "/home/commission/houseaddress", //
    meta: { requiresAuth: false, title: "房屋地址" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/commission/houseaddress.vue"),
  },
  {
    path: "/home/commission/roomnumber",
    name: "/home/commission/roomnumber", //
    meta: { requiresAuth: false, title: "房号" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/commission/roomnumber.vue"),
  },
  {
    path: "/home/commission/releaseinformation",
    name: "/home/commission/releaseinformation", //
    meta: { requiresAuth: false, title: "发布的信息" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/commission/releaseinformation.vue"),
  },
  {
    path: "/home/commission/proofupload",
    name: "/home/commission/proofupload", //
    meta: { requiresAuth: false, title: "证明上传" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/commission/proofupload.vue"),
  },
  {
    path: "/home/commission/idcardupload",
    name: "/home/commission/idcardupload", //
    meta: { requiresAuth: false, title: "身份证上传", keepAlive: true }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/commission/idcardupload.vue"),
  },
  {
    path: "/home/commission/estateupload",
    name: "/home/commission/estateupload", //
    meta: { requiresAuth: false, title: "房产证上传", keepAlive: true }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/commission/estateupload.vue"),
  },
  {
    path: "/home/commission/rentalhouse",
    name: "/home/commission/rentalhouse", //
    meta: { requiresAuth: false, title: "我要出租", keepAlive: true, }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/commission/rentalhouse.vue"),
  },
  {
    path: "/home/commission/details",
    name: "/home/commission/details", //
    meta: { requiresAuth: false, title: "委托详情" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/commission/details.vue"),
  },
]

export default commission;
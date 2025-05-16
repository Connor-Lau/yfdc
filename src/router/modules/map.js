/**
 * 地图的页面
 */
let map = [
  {
    path: "/home/map/position",
    name: "/home/map/position", //
    meta: { requiresAuth: false, title: "周边配套及通勤" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/map/position.vue"),
  },
  {
    path: "/home/map/newmap",
    name: "/home/map/newmap", //
    meta: { requiresAuth: false, title: "新周边配套及通勤" }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/home/map/newmap.vue"),
  },
  {
    path: "/maphouse/index",
    name: "maphouse-index", //
    meta: { requiresAuth: false, title: "地图找房", keepAlive: true, canKeep: false }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/maphouse/index.vue"),
  },
  {
    path: "/maphouse/map-search",
    name: "maphouse-mapsearch", //
    meta: { requiresAuth: false, title: "地图搜索", keepAlive: true, canKeep: false }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/maphouse/map-search.vue"),
  },
  {
    path: "/maphouse/drawList",
    name: "maphouse-drawList", //
    meta: { requiresAuth: false, title: "地图画图后的列表", keepAlive: true, canKeep: false }, // 元信息{requiresAuth:是否需要登陆,title:导航页面名称}
    component: () => import("../../views/maphouse/drawList.vue"),
  },
]

export default map;
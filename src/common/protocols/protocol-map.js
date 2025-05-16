/**
 * 地图的请求协议
 */

const map = {
  appFangMapaBubbleSale: { // 地图找房-二手房-列表
    name: 'v1/api.php?m=fang&c=Map&a=bubbleSale',
    url: 'v1/api.php?m=fang&c=Map&a=bubbleSale',
    method: 'GET',
    param: {
      bounds_max_lng: "",//	否	string	最大经度
      bounds_min_lng: "",//	否	string	最小经度
      bounds_max_lat: "",//否	string	最大纬度
      bounds_min_lat: "",//否	string	最小纬度
      zoom: "",//否	string	地图缩放比例
      keyword: "",//否	string	关键字搜索
      areaType: "",//否	string	地区类型 area:地区 metro:地铁 nearby:附近
      district_id: "",//	否	string	一级地区id
      block_ids: "",//否	string	二级地区id 逗号分隔 不限为空
      metro_line_id: "",//否	string	地铁线路 id
      metro_station_ids: "",//否	string	地铁站点 逗号分隔 不限为空
      nearby_distance: "",//否	string	距离 米
      longitude: "",//	否	string	经度(定位)
      latitude: "",//否	string	纬度(定位)
      price_ids: "",//否	string	价格id查询 逗号分隔
      price_min: "",//否	string	最低价格(万)
      price_max: "",//否	string	最高价格(万)
      layout_room_ids: "",//否	string	户型id 逗号分隔
      acreage_ids: "",//否	string	建筑面积id 逗号分隔
      house_type_ids: "",//否	string	物业类型id 逗号分隔
      decoration_ids: "",//否	string	装修类型id 逗号分隔
      uptown_id: "", // 

    },
    header: {},
    res: {},
    checkToken: false
  },
  appFangMapaBubbleRent: { // 地图找房-租房-列表
    name: 'v1/api.php?m=fang&c=Map&a=bubbleRent',
    url: 'v1/api.php?m=fang&c=Map&a=bubbleRent',
    method: 'GET',
    param: {
      bounds_max_lng: "",//	否	string	最大经度
      bounds_min_lng: "",//	否	string	最小经度
      bounds_max_lat: "",//否	string	最大纬度
      bounds_min_lat: "",//否	string	最小纬度
      zoom: "",//否	string	地图缩放比例
      keyword: "",//否	string	关键字搜索
      areaType: "",//否	string	地区类型 area:地区 metro:地铁 nearby:附近
      district_id: "",//	否	string	一级地区id
      block_ids: "",//否	string	二级地区id 逗号分隔 不限为空
      metro_line_id: "",//否	string	地铁线路 id
      metro_station_ids: "",//否	string	地铁站点 逗号分隔 不限为空
      nearby_distance: "",//否	string	距离 米
      longitude: "",//	否	string	经度(定位)
      latitude: "",//否	string	纬度(定位)
      price_ids: "",//否	string	价格id查询 逗号分隔
      price_min: "",//否	string	最低租金 单位：元
      price_max: "",//否	string	最高租金 单位：元
      layout_room_ids: "",//否	string	户型id 逗号分隔
      acreage_ids: "",//否	string	建筑面积id 逗号分隔
      house_type_ids: "",//否	string	物业类型id 逗号分隔
      decoration_ids: "",//否	string	装修类型id 逗号分隔
      // uptown_id: "", //
    },
    header: {},
    res: {},
    checkToken: false
  },
  appFangMapaBubbleHouse: { // 地图找房-新房-列表
    name: 'v1/api.php?m=fang&c=Map&a=bubbleHouse',
    url: 'v1/api.php?m=fang&c=Map&a=bubbleHouse',
    method: 'GET',
    param: {
      bounds_max_lng: "",//	否	string	最大经度
      bounds_min_lng: "",//	否	string	最小经度
      bounds_max_lat: "",//否	string	最大纬度
      bounds_min_lat: "",//否	string	最小纬度
      zoom: "",//否	string	地图缩放比例
      keyword: "",//否	string	关键字搜索
      areaType: "",//否	string	地区类型 area:地区 metro:地铁 nearby:附近
      district_id: "",//	否	string	一级地区id
      block_ids: "",//否	string	二级地区id 逗号分隔 不限为空
      metro_line_id: "",//否	string	地铁线路 id
      metro_station_ids: "",//否	string	地铁站点 逗号分隔 不限为空
      nearby_distance: "",//否	string	距离 米
      longitude: "",//	否	string	经度(定位)
      latitude: "",//否	string	纬度(定位)
      price_ids: "",//否	string	价格id查询 逗号分隔
      price_min: "",//否	string	最低价格(万)
      price_max: "",//否	string	最高价格(万)
      layout_room_ids: "",//否	string	户型id 逗号分隔
      acreage_ids: "",//否	string	建筑面积id 逗号分隔
      property_type_ids: "",//否	string	物业类型id 逗号分隔
      decoration_ids: "",//否	string	装修类型id 逗号分隔
      uptown_id: "", // 
    },
    header: {},
    res: {},
    checkToken: false
  },
  appFangMapaGetPosition: { // 获取板块在售的一个定位
    name: 'v1/api.php?m=fang&c=Map&a=getPosition',
    url: 'v1/api.php?m=fang&c=Map&a=getPosition',
    method: 'GET',
    param: {
      block_id: "",//	是	string	板块id
      type: "",//	是	string	1二手房 2租房
    },
    header: {},
    res: {},
    checkToken: false
  },
}

export default map
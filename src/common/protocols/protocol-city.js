/**
 * 城市，地址相关的请求协议
 */

const city = {
  appFangBaseDataGetCityRows: {// 获取APP最新的菜单
    name: 'v1/api.php?m=Fang&c=BaseData&a=getCityRows',
    url: 'v1/api.php?m=Fang&c=BaseData&a=getCityRows',
    method: 'GET',
    param: {
      site_name: ""//	否	string	搜索名称
    },
    header: {},
    res: {},
    checkToken: false,
    // doCache: true,//打开缓存
    // doCacheTime: 86400,//默认1天
  },

  appFangBaseDataChangeMetro: {// 地铁站点转换
    name: 'api.php?m=Fang&c=BaseData&a=changeMetro',
    url: 'api.php?m=Fang&c=BaseData&a=changeMetro',
    method: 'POST',
    param: {
      metro_line_id: "", // 	是	string	线路id
      metro_station_id: "",//	是	string	站点id
    },
    header: {},
    res: {},
    checkToken: false,
  }
}

export default city

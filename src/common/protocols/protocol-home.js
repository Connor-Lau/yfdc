/**
 * 用户相关的请求协议
 */

const home = {
  appFangIndexGetLastSale: { // 首页推荐二手房列表
    name: 'v1/api.php?m=Fang&c=Index&a=getLastSale',
    url: 'v1/api.php?m=Fang&c=Index&a=getLastSale',
    method: 'GET',
    param: {
      city_id: '', //	否	string	城市id 默认8广州
      page_size: '', //	否	string	每页显示数 默认10 最大20
      page: '', //	否	string	页码 默认1
      update_time: '',	//否	string	上一页最后一条数据的更新时间 此参数存在时page无效
    },
    header: {},
    res: {},
    checkToken: false
  },
  appFangIndexGetLastHouse: { // 首页推荐新房列表
    name: 'v1/api.php?m=Fang&c=Index&a=getLastHouse',
    url: 'v1/api.php?m=Fang&c=Index&a=getLastHouse',
    method: 'GET',
    param: {
      city_id: '', //	否	string	城市id 默认8广州
      page_size: '', //	否	string	每页显示数 默认10 最大20
      page: '', //	否	string	页码 默认1
      update_time: '',	//否	string	上一页最后一条数据的更新时间 此参数存在时page无效
    },
    header: {},
    res: {},
    checkToken: false
  },
  appFangIndexGetLastRent: { // 首页租房推荐列表
    name: 'v1/api.php?m=Fang&c=Index&a=getLastRent',
    url: 'v1/api.php?m=Fang&c=Index&a=getLastRent',
    method: 'GET',
    param: {
      city_id: '', //	否	string	城市id 默认8广州
      page_size: '', //	否	string	每页显示数 默认10 最大20
      page: '', //	否	string	页码 默认1
      update_time: '',	//否	string	上一页最后一条数据的更新时间 此参数存在时page无效
    },
    header: {},
    res: {},
    checkToken: false
  },
  appFangHouseGetNewDetail: { // 新房详情页
    name: 'api.php?m=Fang&c=House&a=detail',
    url: 'api.php?m=Fang&c=House&a=detail',
    method: 'GET',
    param: {
      id: ''
    },
    header: {},
    res: {},
    checkToken: false
  },
  appFangBaseDataGetAreaTree: { // 区域列表
    name: 'api.php?m=Fang&c=BaseData&a=getAreaTree',
    url: 'api.php?m=Fang&c=BaseData&a=getAreaTree',
    method: 'GET',
    param: {
      city_id: '', //	否	string	城市id 默认8广州
    },
    header: {},
    res: {},
    checkToken: false,
    doCache: true,//打开缓存
    doCacheTime: 86400,//默认1天
  },
  appFangBaseDataGetMetroTree: { // 地铁列表
    name: 'api.php?m=Fang&c=BaseData&a=getMetroTree',
    url: 'api.php?m=Fang&c=BaseData&a=getMetroTree',
    method: 'GET',
    param: {
      city_id: '', //	否	string	城市id 默认8广州
    },
    header: {},
    res: {},
    checkToken: false,
    doCache: true,//打开缓存
    doCacheTime: 86400,//默认1天
  },
  appFangBaseDataGetDataBase_shouse_total_price: { // 价格区间列表（新房二手房）
    name: 'api.php?m=Fang&c=BaseData&a=getData&key=base_shouse_total_price',
    url: 'api.php?m=Fang&c=BaseData&a=getData&key=base_shouse_total_price',
    method: 'GET',
    param: {
    },
    header: {},
    res: {},
    checkToken: false,
    doCache: true,//打开缓存
    doCacheTime: 86400,//默认1天
  },
  appFangBaseDataGetDataBase_layout_room: { // 户型列表
    name: 'api.php?m=Fang&c=BaseData&a=getData&key=base_layout_room',
    url: 'api.php?m=Fang&c=BaseData&a=getData&key=base_layout_room',
    method: 'GET',
    param: {
    },
    header: {},
    res: {},
    checkToken: false,
    doCache: true,//打开缓存
    doCacheTime: 86400,//默认1天
  },
  appFangBaseDataGetDataBase_acreage: { // 建筑面积列表
    name: 'api.php?m=Fang&c=BaseData&a=getData&key=base_acreage',
    url: 'api.php?m=Fang&c=BaseData&a=getData&key=base_acreage',
    method: 'GET',
    param: {
    },
    header: {},
    res: {},
    checkToken: false,
    doCache: true,//打开缓存
    doCacheTime: 86400,//默认1天
  },
  appFangBaseDataGetDataBase_loupan_unit_price: { // 单价列表(新房)
    name: 'api.php?m=Fang&c=BaseData&a=getData&key=base_loupan_unit_price',
    url: 'api.php?m=Fang&c=BaseData&a=getData&key=base_loupan_unit_price',
    method: 'GET',
    param: {
    },
    header: {},
    res: {},
    checkToken: false,
    doCache: true,//打开缓存
    doCacheTime: 86400,//默认1天
  },
  appFangBaseDataGetDataBase_rent_price: { // 价格区间列表（租房）
    name: 'api.php?m=Fang&c=BaseData&a=getData&key=base_rent_price',
    url: 'api.php?m=Fang&c=BaseData&a=getData&key=base_rent_price',
    method: 'GET',
    param: {
    },
    header: {},
    res: {},
    checkToken: false,
    doCache: true,//打开缓存
    doCacheTime: 86400,//默认1天
  },
  appFangBaseDataGetDataBase_house_type: { // 物业类型-二手房/租房
    name: 'api.php?m=Fang&c=BaseData&a=getData&key=base_house_type',
    url: 'api.php?m=Fang&c=BaseData&a=getData&key=base_house_type',
    method: 'GET',
    param: {
    },
    header: {},
    res: {},
    checkToken: false,
    doCache: true,//打开缓存
    doCacheTime: 86400,//默认1天
  },
  appFangBaseDataGetDataBase_property_type: { // 物业类型-新房
    name: 'api.php?m=Fang&c=BaseData&a=getData&key=base_property_type',
    url: 'api.php?m=Fang&c=BaseData&a=getData&key=base_property_type',
    method: 'GET',
    param: {
    },
    header: {},
    res: {},
    checkToken: false,
    doCache: true,//打开缓存
    doCacheTime: 86400,//默认1天
  },
  appFangBaseDataGetDataBase_decoration: { // 装修情况列表
    name: 'api.php?m=Fang&c=BaseData&a=getData&key=base_decoration',
    url: 'api.php?m=Fang&c=BaseData&a=getData&key=base_decoration',
    method: 'GET',
    param: {
    },
    header: {},
    res: {},
    checkToken: false,
    // doCache: true,//打开缓存
    // doCacheTime: 86400,//默认1天
  },
  appFangSaleDetail: { // 详情页-二手房
    name: 'v1/api.php?m=Fang&c=Sale&a=detail',
    url: 'v1/api.php?m=Fang&c=Sale&a=detail',
    method: 'GET',
    param: {
    },
    header: {},
    res: {},
    checkToken: false
  },

  appFangRentDetail: { // 详情页-租房
    name: 'v1/api.php?m=Fang&c=Rent&a=detail',
    url: 'v1/api.php?m=Fang&c=Rent&a=detail',
    method: 'GET',
    param: {
    },
    header: {},
    res: {},
    checkToken: false
  },
  appWechatNearbyGetField: { // 周边配套及通勤-标题列表
    name: 'v1/api.php?m=wechat&c=Nearby&a=getField',
    url: 'v1/api.php?m=wechat&c=Nearby&a=getField',
    method: 'POST',
    param: {
    },
    header: {},
    res: {},
    checkToken: false
  },
  appWechatNearbyGetIndex: { // 周边配套及通勤-内容列表
    name: 'v1/api.php?m=wechat&c=Nearby&a=index',
    url: 'v1/api.php?m=wechat&c=Nearby&a=index',
    method: 'POST',
    param: {
    },
    header: {},
    res: {},
    checkToken: false
  },
  appFangToolsUptownSearch: { // 房源小区关键字搜索
    name: 'api.php?m=Fang&c=Tools&a=uptownSearch',
    url: 'api.php?m=Fang&c=Tools&a=uptownSearch',
    method: 'GET',
    param: {
      keyword: "",//	否	string	搜索内容
      type: "",//	是	string	类型 sale 二手房，rent 租房，house新房
      city_id: "",//	否	string	城市id 默认8
      is_deal_search: "",//	否	bool	是否查成交小区 默认 false
    },
    header: {},
    res: {},
    checkToken: false
  },
  appFangSaleLists: { // 列表-二手房
    name: 'api.php?m=Fang&c=sale&a=lists',
    url: 'api.php?m=Fang&c=sale&a=lists',
    method: 'GET',
    param: {
      city_id: "", //	否	string	城市id 默认8
      page: 1, //	否	string	页码 默认1
      page_size: 10, //	否	string	每页显示数 默认10
      keyword: "", //	否	string	关键字搜索
      areaType: "", //	否	string	地区类型 area: 地区 metro: 地铁
      district_id: "", //	否	string	一级地区id
      block_ids: "", //	否	string	二级地区id 逗号分隔 不限为空
      metro_line_id: "", //	否	string	地铁线路 id
      metro_station_ids: "", //	否	string	地铁站点 逗号分隔 不限为空
      price_ids: "", //	否	string	价格id查询 逗号分隔
      price_min: "", //	否	string	最低价格 (万)
      price_max: "", //	否	string	最高价格 (万)
      layout_room_ids: "", //	否	string	户型id 逗号分隔
      acreage_ids: "", //	否	string	建筑面积id 逗号分隔
      house_type_ids: "", //	否	string	物业类型id 逗号分隔
      decoration_ids: "", //	否	string	装修类型id 逗号分隔
      second_tag_ids: "", //	否	string	二级标签搜索id 逗号分隔
      sort: "", //	否	string	排序字段 update_time:最新 price:总价 average_price:单价 acreage_cover:面积
      order: "", //	否	string	正倒序 asc:正序 desc:倒序
      uptown_id: "",//	否	string	小区id
      update_time: '',	//否	string	上一页最后一条数据的更新时间 此参数存在时page无效
    },
    header: {},
    res: {},
    checkToken: false
  },
  appWechatNearbyIndex: { // 周边配套及通勤-内容列表
    name: 'v1/api.php?m=wechat&c=Nearby&a=index',
    url: 'v1/api.php?m=wechat&c=Nearby&a=index',
    method: 'POST',
    param: {
      longitude: "",//	否	string	经度	113.368523
      latitude: "",//	否	string	纬度	23.146245
      type: "",//	是	string	一级类型	教育
      tag: "",// 否	string	二级类型	中学
    },
    header: {},
    res: {},
    checkToken: false
  },
  appWechatNearbyGetField: { // 周边配套及通勤-标题列表
    name: 'v1/api.php?m=wechat&c=Nearby&a=getField',
    url: 'v1/api.php?m=wechat&c=Nearby&a=getField',
    method: 'POST',
    param: {

    },
    header: {},
    res: {},
    checkToken: false
  },
  appFangSalelistRecommend: { // 房源详情-推荐二手房列表
    name: 'v1/api.php?m=Fang&c=Sale&a=listRecommend',
    url: 'v1/api.php?m=Fang&c=Sale&a=listRecommend',
    method: 'GET',
    param: {
      id: "",//	否	string	二手房id
      page_size: "",//	否	string	每页显示数 默认10
    },
    header: {},
    res: {},
    checkToken: false
  },
  appFangHouselistRecommend: { // 房源详情-推荐新房列表
    name: 'v1/api.php?m=Fang&c=House&a=listRecommend',
    url: 'v1/api.php?m=Fang&c=House&a=listRecommend',
    method: 'GET',
    param: {
      id: "",//	否	string	二手房id
      page_size: "",//	否	string	每页显示数 默认10
    },
    header: {},
    res: {},
    checkToken: false
  },
  appFangSaleGetSecondTag: { // 二级标签-二手房
    name: 'api.php?m=Fang&c=sale&a=getSecondTag',
    url: 'api.php?m=Fang&c=sale&a=getSecondTag',
    method: 'GET',
    param: {
    },
    header: {},
    res: {},
    checkToken: false,
    doCache: true,//打开缓存
    doCacheTime: 86400,//默认1天
  },
  appFangHouseGetSecondTag: { // 二级标签-新房
    name: 'api.php?m=Fang&c=house&a=getSecondTag',
    url: 'api.php?m=Fang&c=house&a=getSecondTag',
    method: 'GET',
    param: {
    },
    header: {},
    res: {},
    checkToken: false,
    doCache: true,//打开缓存
    doCacheTime: 86400,//默认1天
  },
  appFangRentGetSecondTag: { // 二级标签-租房
    name: 'api.php?m=Fang&c=rent&a=getSecondTag',
    url: 'api.php?m=Fang&c=rent&a=getSecondTag',
    method: 'GET',
    param: {
    },
    header: {},
    res: {},
    checkToken: false,
    doCache: true,//打开缓存
    doCacheTime: 86400,//默认1天
  },
  appFangFavoriteAdd: { // 关注
    name: 'user.php?m=Fang&c=Favorite&a=add',
    url: 'user.php?m=Fang&c=Favorite&a=add',
    method: 'POST',
    param: {
      resource_type: "",//是	string	资源类型,1:二手房，2：租房，3：新房，4：小区，5：经纪人
      resource_id: "",//	是	string	资源ID
      city_id: "",//	是	string	城市ID
    },
    header: {},
    res: {},
    checkToken: true,
  },
  appFangFavoriteStatus: { // 是否已关注
    name: 'user.php?m=Fang&c=Favorite&a=status',
    url: 'user.php?m=Fang&c=Favorite&a=status',
    method: 'GET',
    param: {
      city_id: "",//	是	string	城市id
      resource_id: "",//	是	string	资源id
      resource_type: "",//	是	string	资源类型id 1:二手房，2：租房，3：新房，4：小区，5：经纪人
    },
    header: {},
    res: {},
    checkToken: true,
  },
  appFangFavoriteCancel: { // 取消关注
    name: 'user.php?m=Fang&c=Favorite&a=cancel',
    url: 'user.php?m=Fang&c=Favorite&a=cancel',
    method: 'GET',
    param: {
      city_id: "",//	是	string	城市id
      resource_id: "",//	是	string	资源id
      resource_type: "",//	是	string	资源类型id 1:二手房，2：租房，3：新房，4：小区，5：经纪人
    },
    header: {},
    res: {},
    checkToken: true,
  },
  appWechatNearbyGetRecommendBroker: { // 推荐经纪人
    name: 'v1/api.php?m=wechat&c=Nearby&a=getRecommendBroker',
    url: 'v1/api.php?m=wechat&c=Nearby&a=getRecommendBroker',
    method: 'POST',
    param: {
      house_type: "",//	否	string	房屋类型 1.租房 2.二手房
      house_id: "",//	否	string	房屋id人
    },
    header: {},
    res: {},
    checkToken: false,
  },
  appFangHouseLists: { // 列表-新房
    name: 'api.php?m=Fang&c=house&a=lists',
    url: 'api.php?m=Fang&c=house&a=lists',
    method: 'GET',
    param: {
      city_id: "", //	否	string	城市id 默认8
      page: 1, //	否	string	页码 默认1
      page_size: 10, //	否	string	每页显示数 默认10
      keyword: "", //	否	string	关键字搜索
      areaType: "", //	否	string	地区类型 area: 地区 metro: 地铁
      district_id: "", //	否	string	一级地区id
      block_ids: "", //	否	string	二级地区id 逗号分隔 不限为空
      metro_line_id: "", //	否	string	地铁线路 id
      metro_station_ids: "", //	否	string	地铁站点 逗号分隔 不限为空
      price_ids: "", //	否	string	价格id查询 逗号分隔
      price_min: "", //	否	string	最低价格 (万)
      price_max: "", //	否	string	最高价格 (万)
      second_tag_ids: "", //	否	string	二级标签搜索id 逗号分隔
      average_price_ids: "", //	否	string	单价id查询 逗号分隔
      average_price_min: "", //	否	string	最低单价 (万)
      average_price_max: "", //	否	string	最高单价 (万)
      layout_room_ids: "", //	否	string	户型id 逗号分隔
      property_type_ids: "", //	否	string	物业类型id 逗号分隔
      acreage_ids: "", //	否	string	建筑面积id 逗号分隔
      sort: "", //	否	string	排序字段 update_time:最新 open_time:开盘 average_price:均价
      order: "", //	否	string	正倒序 asc:正序 desc:倒序
      loupan_ids: "",//  楼盘ID查询  多个逗号分隔
    },
    header: {},
    res: {},
    checkToken: false
  },
  appFangRentLists: { // 列表-租房
    name: 'api.php?m=Fang&c=Rent&a=lists',
    url: 'api.php?m=Fang&c=Rent&a=lists',
    method: 'GET',
    param: {
      city_id: "", //	否	string	城市id 默认8
      page: 1, //	否	string	页码 默认1
      page_size: 10, //	否	string	每页显示数 默认10
      keyword: "", //	否	string	关键字搜索
      areaType: "", //	否	string	地区类型 area: 地区 metro: 地铁
      district_id: "", //	否	string	一级地区id
      block_ids: "", //	否	string	二级地区id 逗号分隔 不限为空
      metro_line_id: "", //	否	string	地铁线路 id
      metro_station_ids: "", //	否	string	地铁站点 逗号分隔 不限为空
      price_ids: "", //	否	string	价格id查询 逗号分隔
      price_min: "", //	否	string	最低价格 (万)
      price_max: "", //	否	string	最高价格 (万)
      second_tag_ids: "", //	否	string	二级标签搜索id 逗号分隔
      layout_room_ids: "", //	否	string	户型id 逗号分隔
      acreage_ids: "", //	否	string	建筑面积id 逗号分隔
      house_type_ids: "", //	否	string	物业类型 逗号分隔
      decoration_ids: "", //	否	string	装修类型id 逗号分隔
      sort: "", //	否	string	排序字段 update_time:最新 rent_time:租金 acreage:面积
      order: "", //	否	string	正倒序 asc:正序 desc:倒序
      uptown_id: "",//	否	string	小区id
      update_time: '',	//否	string	上一页最后一条数据的更新时间 此参数存在时page无效
    },
    header: {},
    res: {},
    checkToken: false
  },

  appFangRentListRecommend: { // 推荐租房列表
    name: 'v1/api.php?m=Fang&c=Rent&a=listRecommend',
    url: 'v1/api.php?m=Fang&c=Rent&a=listRecommend',
    method: 'POST',
    param: {
      page_size: "",//	否	string	每页显示数 默认10
      id: "",//	否	string	租房id
    },
    header: {},
    res: {},
    checkToken: false
  },

  appFangHouseGetDetailInfo: { // 新房-更多楼盘信息
    name: 'api.php?m=Fang&c=House&a=detailInfo',
    url: 'api.php?m=Fang&c=House&a=detailInfo',
    method: 'GET',
    param: {
    },
    header: {},
    res: {},
    checkToken: false
  },

  appFangUptowndetail: { // 楼盘详情-小区详情
    name: 'api.php?m=Fang&c=Uptown&a=detail',
    url: 'api.php?m=Fang&c=Uptown&a=detail',
    method: 'GET',
    param: {
      id: ""
    },
    header: {},
    res: {},
    checkToken: false
  },

  appFangStorenear: { // 小区详情-附近门店
    name: 'api.php?m=Fang&c=Store&a=near',
    url: 'api.php?m=Fang&c=Store&a=near',
    method: 'GET',
    param: {
      longitude: "",
      latitude: ""
    },
    header: {},
    res: {},
    checkToken: false
  },

  appFangBrokerlists: { // 预约看二手房-经纪人列表
    name: 'api.php?m=Fang&c=Broker&a=lists',
    url: 'api.php?m=Fang&c=Broker&a=lists',
    method: 'GET',
    param: {
      city_id: "", //	否	string	城市id 默认8
      page: 1,  //	否	string	页码 默认1
      page_size: 10, //	否	string	每页显示数 默认10
      keyword: "", //	否	string	关键字搜索
      district_id: "", //	否	string	区域id搜索
      tag_ids: "",//	否	string	标签查询逗号分隔
      order: "", //	否	string	排序 asc正序 desc倒序
      sort: "", //	否	string	综合评分:synthesize_score 成交量:trade_num 带看量:see_num
      order_district_id: "",//	否	string	根据某个区域id 倒序
      order_shouse_id: "",//	否	string	根据二手房源激活、独家、VIP、钥匙、维护 经纪人提前
      order_rent_id: "",//	否	string	根据租房源激活、独家、VIP、钥匙、维护 经纪人提前
    },
    header: {},
    res: {},
    checkToken: false
  },

  appAppointSeeHouseDo: { // 预约看二手房-提交数据
    name: 'user.php?m=fang&c=Appointment&a=addAppointSeeHouseDo',
    url: 'user.php?m=fang&c=Appointment&a=addAppointSeeHouseDo',
    method: 'POST',
    param: {
      broker_checked: "",//	是	string	经纪人id
      name: "",//	是	string	称呼
      tel: "",//	是	string	联系方式
      time: "",//	是	string	时间 格式 例子 2022/05/18
      resource_type: "",//	是	string	1:二手房，2：租房
      resource_id: "",//	是	string	二手房id/租房id
      appointment_hour: "",//	否	string	预约时间段 例子 14:00-18:00
    },
    header: {},
    res: {},
    checkToken: false
  },

  appFangDealShouseList: { // 成交列表-二手房
    name: 'v1/api.php?m=Fang&c=deal&a=shouseList',
    url: 'v1/api.php?m=Fang&c=deal&a=shouseList',
    method: 'GET',
    param: {
      city_id: "",//	否	string	城市id 默认8
      page: "",//	否	string	页码 默认1
      page_size: "",//否	string	每页显示数 默认10
      keyword: "",//否	string	关键字搜索
      areaType: "",//	否	string	地区类型 area:地区 metro:地铁
      district_id: "",//否	string	一级地区id
      block_ids: "",//	否	string	二级地区id 逗号分隔 不限为空
      metro_line_id: "",//否	string	地铁线路 id
      metro_station_ids: "",//	否	string	地铁站点 逗号分隔 不限为空
      layout_room_ids: "",//	否	string	户型id 逗号分隔
      layout_hall_id: "",	//否	string	厅型id
      uptown_id: "",//	否	string	小区id搜索
      sign_time: "",//否	string	成交年份 例:2020
    },
    header: {},
    res: {},
    checkToken: false
  },

  appFangDealRentList: { // 成交列表-租房
    name: 'v1/api.php?m=Fang&c=deal&a=rentList',
    url: 'v1/api.php?m=Fang&c=deal&a=rentList',
    method: 'GET',
    param: {
      city_id: "",//	否	string	城市id 默认8
      page: "",//	否	string	页码 默认1
      page_size: "",//否	string	每页显示数 默认10
      keyword: "",//否	string	关键字搜索
      areaType: "",//	否	string	地区类型 area:地区 metro:地铁
      district_id: "",//否	string	一级地区id
      block_ids: "",//	否	string	二级地区id 逗号分隔 不限为空
      metro_line_id: "",//否	string	地铁线路 id
      metro_station_ids: "",//	否	string	地铁站点 逗号分隔 不限为空
      layout_room_ids: "",//	否	string	户型id 逗号分隔
      layout_hall_id: "",	//否	string	厅型id
      uptown_id: "",//	否	string	小区id搜索
      sign_time: "",//否	string	成交年份 例:2020
    },
    header: {},
    res: {},
    checkToken: false
  },

  appFangDealShouseDetail: { // 查成交详情-二手房
    name: 'v1/api.php?m=Fang&c=deal&a=shouseDetail',
    url: 'v1/api.php?m=Fang&c=deal&a=shouseDetail',
    method: 'GET',
    param: {
      shouse_trade_id: "",//	是	string	交易id
    },
    header: {},
    res: {},
    checkToken: false
  },

  appFangDealRentDetail: { // 查成交详情-租房
    name: 'v1/api.php?m=Fang&c=deal&a=rentDetail',
    url: 'v1/api.php?m=Fang&c=deal&a=rentDetail',
    method: 'GET',
    param: {
      rent_trade_id: "",//是	string	租房交易id
    },
    header: {},
    res: {},
    checkToken: false
  },

  appFangToolsAsearch: { // 房源小区/新房（二手房）关键字搜索
    name: 'api.php?m=Fang&c=Tools&a=search',
    url: 'api.php?m=Fang&c=Tools&a=search',
    method: 'GET',
    param: {
      keyword: "",//	否	string	搜索内容
      city_id: "",//	否	string	城市id 默认8
      page: "",//否	string	页码 默认1
      page_size: "",//否	string	每页显示数 默认10
    },
    header: {},
    res: {},
    checkToken: false
  },

  appFangcDealaUptownSearch: { // 成交-小区搜索
    name: 'v1/api.php?m=Fang&c=deal&a=uptownSearch',
    url: 'v1/api.php?m=Fang&c=deal&a=uptownSearch',
    method: 'GET',
    param: {
      type: "",//		否	string	租售类型 1售2租 默认售
      keyword: "",//		否	string	搜索关键字
      page: "",//	否	string	页码 默认1
      page_size: "",//	否	string	每页数 默认10
    },
    header: {},
    res: {},
    checkToken: false
  },

  appFangcDealaUptownPrice: { // 成交-小区成交均价（二手房）
    name: 'v1/api.php?m=Fang&c=deal&a=uptownPrice',
    url: 'v1/api.php?m=Fang&c=deal&a=uptownPrice',
    method: 'GET',
    param: {
      uptown_id: "",//	否	string	小区id
    },
    header: {},
    res: {},
    checkToken: false
  },
  appFangcDealaUptownRentPrice: { // 成交-小区成交均价(租房)
    name: 'v1/api.php?m=Fang&c=deal&a=uptownRentPrice',
    url: 'v1/api.php?m=Fang&c=deal&a=uptownRentPrice',
    method: 'GET',
    param: {
      uptown_id: "",//	否	string	小区id
    },
    header: {},
    res: {},
    checkToken: false
  },

  appWechatcSummaryAdd: { // 拨打电话前调此接口 
    name: 'v1/api.php?m=Wechat&c=Summary&a=add',
    url: 'v1/api.php?m=Wechat&c=Summary&a=add',
    method: 'POST',
    param: {
      broker_id: "",//是	string	经纪人id
      business_type: "702",//是	string	业务类型
      from_type: "7",//是	string	来源
      business_id: "",//	否	string	用户id
      ex1: "",//否	string	房源类型 1二手房 2租房
      ex2: "",//否	string	房源id
    },
    header: {},
    res: {},
    checkToken: false
  },

  appFangcUptownaSearchAll: { // 小区全国搜索
    name: 'v1/api.php?m=Fang&c=uptown&a=searchAll',
    url: 'v1/api.php?m=Fang&c=uptown&a=searchAll',
    method: 'POST',
    param: {
      key: "",//	否	string	关键字
      type: "",//	否	string	类型 1二手房 2租房
    },
    header: {},
    res: {},
    checkToken: false
  },

  appFangcUptownaSearchOther: { // 全国小区模糊关联搜索 -- 切换城市用
    name: 'v1/api.php?m=Fang&c=uptown&a=searchOther',
    url: 'v1/api.php?m=Fang&c=uptown&a=searchOther',
    method: 'GET',
    param: {
      key: "",//	否	string	关键字
    },
    header: {},
    res: {},
    checkToken: false
  },

  wechatNewImGetUnreadNum: { // 获取消息未读数
    name: '/v1/api.php?m=wechat&c=NewIm&a=getUnreadNum',
    url: '/v1/api.php?m=wechat&c=NewIm&a=getUnreadNum',
    method: 'POST',
    param: {
    },
    header: {},
    res: {},
    checkToken: false
  },

  wechatNewImGetDefaultChatCustomer: { // 客服提示
    name: 'v1/api.php?m=wechat&c=NewIm&a=getDefaultChatCustomer',
    url: 'v1/api.php?m=wechat&c=NewIm&a=getDefaultChatCustomer',
    method: 'GET',
    param: {
      city_id: ""
    },
    header: {},
    res: {},
    checkToken: false
  },

}

export default home

/**
 * 委托模块的请求协议
 */

const commission = {
  appEntrustIndex: { // 我的委托-获取我的委托列表
    name: 'v1/apiUser.php?m=wechat&c=Entrust&a=index',
    url: 'v1/apiUser.php?m=wechat&c=Entrust&a=index',
    method: 'POST',
    param: {
    },
    header: {},
    res: {},
    checkToken: false
  },

  appEntrustAdetail: { // 我的委托-获取单个委托 
    name: 'v1/apiUser.php?m=wechat&c=Entrust&a=detail',
    url: 'v1/apiUser.php?m=wechat&c=Entrust&a=detail',
    method: 'POST',
    param: {
      entrust_id: "",//	是	string	委托ID
      entrust_type: "",//	是	string	委托类型[shouse:售,rent:租]
    },
    header: {},
    res: {},
    checkToken: false
  },

  appEntrustAadd: { // 我的委托-发布房源（租售）
    name: 'v1/apiUser.php?m=wechat&c=Entrust&a=add',
    url: 'v1/apiUser.php?m=wechat&c=Entrust&a=add',
    method: 'POST',
    param: {
      entrust_type: "",//	是	string	业务类型[shouse:售,rent:租]
      uptown_name: "",	//是	string	小区名称
      site_id: "",	//是	string	城市ID
      mobile: "",	//是	string	手机号码
      room_no: "",	//是	string	房号
      price: "",	//是	string	价格,若售业务该单位为万元
      acreage: "",	//是	string	面积
      longitude: "", // 是 string 经度
      latitude: "", // 是 string 纬度 
      appellation: "",	//否	string	称呼
      district_id: "",	//否	string	区域ID
      building_id: "",	//否	string	楼栋ID
      building_no: "",	//否	string	楼栋名称
      floor_no: "",	//否	string	楼层
      door_no: "",	//否	string	门牌号
      uptown_id: "",//	否	string	小区ID
      rent_type: "",//	否	string	租赁方式[1:整租,2:合租]
    },
    header: {},
    res: {},
    checkToken: false
  },

  appEntrustSearchErpUptown: { // 我的委托-小区搜索列表
    name: 'v1/apiUser.php?m=wechat&c=ubroker&a=searchErpUptown',
    url: 'v1/apiUser.php?m=wechat&c=ubroker&a=searchErpUptown',
    method: 'POST',
    param: {
      keyword: "",//	是	string	关键字
      city_id: "", // 否	string	城市id
      page: "",//	否	string	页码 默认1
      page_size: "",//	否	string	每页显示数 默认20
    },
    header: {},
    res: {},
    checkToken: false
  },

  // 2023.8.8 新增 广州的才调取此小区列表接口
  appEntrustSearchHouseDictionary: { // 我的委托-小区搜索列表（广州）
    name: 'v1/apiUser.php?m=wechat&c=ubroker&a=searchHouseDictionary',
    url: 'v1/apiUser.php?m=wechat&c=ubroker&a=searchHouseDictionary',
    method: 'POST',
    param: {
      keyword: "",//	是	string	关键字
      city_id: "", // 否	string	城市id
      page: "",//	否	string	页码 默认1
      page_size: "",//	否	string	每页显示数 默认20
    },
    header: {},
    res: {},
    checkToken: false
  },

  appEntrustAupdateStatus: { // 我的委托-更新委托状态(删除|取消)
    name: 'v1/apiUser.php?m=wechat&c=Entrust&a=updateStatus',
    url: 'v1/apiUser.php?m=wechat&c=Entrust&a=updateStatus',
    method: 'POST',
    param: {
      publish_id: "",//	是	string	委托ID
      entrust_type: "",//	是	string	委托类型:shouse，rent
      action: "",//	是	string	执行操作[删除：delete,取消委托：cancel]
    },
    header: {},
    res: {},
    checkToken: false
  },

  appEntrustAupdateIdCard: { // 我的委托-身份证图片提交
    name: 'v1/apiUser.php?m=wechat&c=Entrust&a=updateIdCard',
    url: 'v1/apiUser.php?m=wechat&c=Entrust&a=updateIdCard',
    method: 'POST',
    param: {
      picture_ids: "",//	是	string	图片文件ID；多个逗号分隔
      entrust_id: "",//	是	string	委托ID
      entrust_type: "",//	是	string	租售类型[Shouse,Rent]
    },
    header: {},
    res: {},
    checkToken: false
  },

  appEntrustAupdateHouse: { // 我的委托-房产证图片和资料保存
    name: 'v1/apiUser.php?m=wechat&c=Entrust&a=updateHouse',
    url: 'v1/apiUser.php?m=wechat&c=Entrust&a=updateHouse',
    method: 'POST',
    param: {
      picture_ids: "", //	是	string	图片文件id；多个逗号分隔
      entrust_id: "",//	是	string	委托id
      registration_date: "", //	是	string	注册日期
      acreage_cover: "", //	是	string	建筑面积
      is_common_property: "", //	是	string	是否产权共有0否,1是
      is_only: "", //	是	string	是否唯一0否1是
      entrust_type: "",//	是	string	租售类型[Shouse,Rent]
    },
    header: {},
    res: {},
    checkToken: false
  },

  appEntrustAupload: { // 我的委托-委托图片上传
    name: 'v1/apiUser.php?m=wechat&c=Entrust&a=upload',
    url: 'v1/apiUser.php?m=wechat&c=Entrust&a=upload',
    method: 'POST',
    param: {
      img_str: "",//	是	string	图片内容字符串base64
      picture_type_id: "",//	是	string	图片类型：1:身份证,2:房产证
      entrust_id: "",//	是	string	委托ID
      entrust_type: "",//	是	string	委托类型[shouse:售,rent:租]
      site_id: "",	//否,	string	城市ID
      picture_name: "",//	否	string	图片名字
      broker_id: "",//否	string	经纪人ID
    },
    header: {},
    res: {},
    checkToken: false
  },

  appEntrustAadjustPrice: { // 我的委托-调整价格申请
    name: 'v1/apiUser.php?m=wechat&c=Entrust&a=adjustPrice',
    url: 'v1/apiUser.php?m=wechat&c=Entrust&a=adjustPrice',
    method: 'POST',
    param: {
      entrust_id: "",//	是	string	委托ID
      entrust_type: "",//	是	string	委托类型shouse/rent
      price: "",//	是	string	价格(单位元)
      remark: "",//	是	string	申请说明
    },
    header: {},
    res: {},
    checkToken: false
  },

  appEntrustArePublish: { // 我的委托-重新发布委托
    name: 'v1/apiUser.php?m=wechat&c=Entrust&a=rePublish',
    url: 'v1/apiUser.php?m=wechat&c=Entrust&a=rePublish',
    method: 'POST',
    param: {
      entrust_id: "",//	是	string	委托ID
      entrust_type: "",//	是	string	委托租售类型[shouse、rent]
    },
    header: {},
    res: {},
    checkToken: false
  },
}

export default commission
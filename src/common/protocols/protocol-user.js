/**
 * 用户相关的请求协议
 */

const user = {
  appFangAuthLogin: {// 帐号登录
    name: 'api.php?m=fang&c=Auth&a=login',
    url: 'api.php?m=fang&c=Auth&a=login',
    method: 'POST',
    param: {
      account: "",//	是	string	账号
      password: "",//	是	string	密码
    },
    header: {},
    res: {},
    checkToken: false
  },
  appFangAuthloginByPhone: {//通过手机号一键登录
    name: 's=/Fang/Auth/loginByPhone',
    url: 'api.php?s=/Fang/Auth/loginByPhone',
    method: 'POST',
    param: {
      openid: "",//	是	string	OPENID
      token: ""//	是	string	令牌
    },
    header: {},
    res: {},
    checkToken: false
  },
  appFangAuthsendSmsCode: {// 向手机号码发送短信验证码
    name: 'api.php?s=/Fang/Auth/sendSmsCode',
    url: 'api.php?s=/Fang/Auth/sendSmsCode',
    method: 'POST',
    param: {
      account: "" //	是	string	手机号
    },
    header: {},
    res: {},
    checkToken: false
  },
  appFangAuthloginBySms: {// 手机号码通过短信验证码注册与登录（进行微信与手机号的绑定）
    name: 'api.php?s=/Fang/Auth/loginBySms',
    url: 'api.php?s=/Fang/Auth/loginBySms',
    method: 'POST',
    param: {
      account: "",//	是	string	手机号
      sms_code: "",//	是	string	短信验证码
      union_id: "",//	否	string	微信union_id
      open_id: "",//	否	string	微信open_id
    },
    header: {},
    res: {},
    checkToken: false
  },
  appWechatAuthloginByMpWeiXin: {// 用户union_id登录
    name: 'v1/api.php?m=Wechat&c=Auth&a=loginByMpWeiXin',
    url: 'v1/api.php?m=Wechat&c=Auth&a=loginByMpWeiXin',
    method: 'POST',
    param: {
      user_type: "1",//	是	string	1.用户 2.经纪人
      union_id: "",//	是	string	微信用户union_id
    },
    header: {},
    res: {},
    checkToken: false
  },
  appWechatAuthloginByAppleId: {// 用户苹果open_id登录
    name: 'v1/api.php?m=Wechat&c=Auth&a=loginByAppleId',
    url: 'v1/api.php?m=Wechat&c=Auth&a=loginByAppleId',
    method: 'POST',
    param: {
      // user_type: "1",//	是	string	1.用户 2.经纪人
      apple_open_id: ""// 	是 	string 	苹果open_id
    },
    header: {},
    res: {},
    checkToken: false
  },
  appFangAuthResetPassword: {// 重置密码并登录
    name: 'api.php?m=fang&c=Auth&a=resetPassword',
    url: 'api.php?m=fang&c=Auth&a=resetPassword',
    method: 'POST',
    param: {
      account: "",//	是	string	用户名
      password: "",//	是	string	新密码
      sms_code: "",//	是	string	短信验证码
    },
    header: {},
    res: {},
    checkToken: false
  },
  appFangFavoriteHouse: {// 我关注的新房列表
    name: 'v1/apiUser.php?m=Fang&c=Favorite&a=house',
    url: 'v1/apiUser.php?m=Fang&c=Favorite&a=house',
    method: 'GET',
    param: {
      page: "",//	否	string	页码 默认1
      page_size: "",//	否	string	每页显示数 默认10
    },
    header: {},
    res: {},
    checkToken: true
  },
  appFangFavoriteSale: {// 我关注的二手房列表
    name: 'v1/apiUser.php?m=Fang&c=Favorite&a=sale',
    url: 'v1/apiUser.php?m=Fang&c=Favorite&a=sale',
    method: 'GET',
    param: {
      page: "",//	否	string	页码 默认1
      page_size: "",//	否	string	每页显示数 默认10
    },
    header: {},
    res: {},
    checkToken: true
  },
  // 2022-04-05 接口文档 没看见关注的租房列表 接口；预测接口名 如下
  appFangFavoriteRent: {// 我关注的租房列表
    name: 'v1/apiUser.php?m=Fang&c=Favorite&a=rent',
    url: 'v1/apiUser.php?m=Fang&c=Favorite&a=rent',
    method: 'GET',
    param: {
      page: "",//	否	string	页码 默认1
      page_size: "",//	否	string	每页显示数 默认10
    },
    header: {},
    res: {},
    checkToken: true
  },
  appFangFavoriteNewUptown: {// 我关注的小区列表(新版)
    name: '/v1/apiUser.php?m=fang&c=favorite&a=newUptown',
    url: '/v1/apiUser.php?m=fang&c=favorite&a=newUptown',
    method: 'GET',
    param: {
      page: "",//	否	string	页码 默认1
      page_size: "",//	否	string	每页显示数 默认10
    },
    header: {},
    res: {},
    checkToken: true
  },
  // 登录后更新客户端
  appUpdateClientByLogin: {
    name: 'UpdateClientByLogin',
    url: 'v1/apiUser.php?m=wechat&c=talk&a=UpdateClientByLogin',
    method: 'POST',
    param: {
      client_app_id: "",//	是	string	消息ID
      uuid: ""//	是	string	APP唯一标记，UUID
    },
    header: {},
    res: {},
    checkToken: true
  },
  // 退出登录更新客户端
  appUpdateClientByLogout: {
    name: 'UpdateClientByLogout',
    url: 'v1/api.php?m=wechat&c=NewIm&a=UpdateClientByLogout',
    method: 'POST',
    param: {
      client_app_id: "",//	是	string	用户名
      uuid: ""//	是	string	APP唯一标记，UUID
    },
    header: {},
    res: {},
    checkToken: true
  },
  // 提交举报
  appWechatcFeedbackAcreate: {
    name: '/v1/api.php?m=wechat&c=Feedback&a=create',
    url: '/v1/api.php?m=wechat&c=Feedback&a=create',
    method: 'POST',
    param: {
      tel: "",//	是	string	联系电话
      content: "",//	是	string	投诉内容
      site_id: "",//	是	string	城市id
      from_url: "",//	是	string	反馈提交页面
      from_type: "",//	否	string	反馈系统(默认2)，1:pc网站,2:小程序,3.裕丰经纪app,4.裕丰地产app
    },
    header: {},
    res: {},
    checkToken: false
  },
  // 获取合同列表
  appFangcElectronicAtest: {
    name: '/v1/apiUser.php?m=fang&c=Electronic&a=index',
    url: '/v1/apiUser.php?m=fang&c=Electronic&a=index',
    method: 'POST',
    param: {
      status: "",//	是	string	签约状态 1：未签约 2：已签约
      page: "",//	否	string	页码，默认第一页
    },
    header: {},
    res: {},
    checkToken: false
  },
  // 获取合同预览链接
  appFangcElectronicAgetFlowPreview: {
    name: '/v1/apiUser.php?m=fang&c=Electronic&a=getFlowPreview',
    url: '/v1/apiUser.php?m=fang&c=Electronic&a=getFlowPreview',
    method: 'POST',
    param: {
      flow_id: "",//	是	string	合同id
    },
    header: {},
    res: {},
    checkToken: false
  },
  // 获取合同签署链接
  appFangcElectronicAgetSignLink: {
    name: '/v1/apiUser.php?m=fang&c=Electronic&a=getSignLink',
    url: '/v1/apiUser.php?m=fang&c=Electronic&a=getSignLink',
    method: 'POST',
    param: {
      flow_id: "",//	是	string	合同id
    },
    header: {},
    res: {},
    checkToken: false
  },
  // 获取置顶预览合同
  appFangcElectronicAgetTopFlow: {
    name: '/v1/apiUser.php?m=fang&c=Electronic&a=getTopFlow',
    url: '/v1/apiUser.php?m=fang&c=Electronic&a=getTopFlow',
    method: 'POST',
    param: {
    },
    header: {},
    res: {},
    checkToken: false
  },
  // 合同收据列表
  appFangcElectronicAgetFlowReceipt: {
    name: '/v1/apiUser.php?m=fang&c=Electronic&a=getFlowReceipt',
    url: '/v1/apiUser.php?m=fang&c=Electronic&a=getFlowReceipt',
    method: 'POST',
    param: {
      flow_id: '',//	是	string	合同id
    },
    header: {},
    res: {},
    checkToken: false
  },
  // 查看收据
  appFangcElectronicAgetReceiptView: {
    name: '/v1/apiUser.php?m=fang&c=Electronic&a=getReceiptView',
    url: '/v1/apiUser.php?m=fang&c=Electronic&a=getReceiptView',
    method: 'POST',
    param: {
      flow_receipt_id: '',//	是	string	用户名
    },
    header: {},
    res: {},
    checkToken: false
  },
}

export default user

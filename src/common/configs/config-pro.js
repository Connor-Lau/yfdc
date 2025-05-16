/**
 * 产品环境配置
 */
let md = new Date().valueOf(); // 清除index.html缓存


//正式服的配置(未使用)
const configPro = {
  appDebug: false,
  appWebStaticUrl: process.env.VUE_APP_WEB_STATIC_URL || 'https://appv2.yfdc.net:444/h5ht/static/', // 应用资源地址
  appApiUrl: 'https://mtest.yfdc.net/', // 数据接口地址
  appH5PageUrl: 'https://appv2.yfdc.net:444/h5ht/#/', //'https://m.yfdc.net/appv2/web/#/',// 'https://napp.yfdc.net/h5web/#/', // 本站H5页面的地址
  approvalH5WebUrl: 'https://appv2.yfdc.net:444/approvalh5/#/', // 'https://napp.yfdc.net/approvalh5/#/', //   审批系统H5网站地址
  appH5PageUrlYFJJ: 'https://appv2.yfdc.net:444/h5h/#/', //'https://napp.yfdc.net/h5/#/', // 裕丰经纪 H5页面的地址
  loginTokenKey: 'x59bAcdkKTjHx2UytTMvPJfOcpgXPoCL', // 登陆接口key
  newAppKey: 'app1',//裕丰地产改版区分接口应用
  appKey: 'quB2ljPhBoGl', // 用于区分客户端应用
  encryptKey: 'e35cf7b66449df565f93c607d5a81d09', // 数据解密key
  encryptIV: '456abcdMOBILE901', // 数据解密序号iv
}

// 根据接口地址自动选择聊天的url
if (configPro.appApiUrl === 'https://m.yfdc.net/') {
  configPro.appIMUrl = `https://chat.yfdc.net/app/prod/index.html?v=${md}#`
} else if (configPro.appApiUrl === 'https://mtest.yfdc.net/') {
  configPro.appIMUrl = process.env.VUE_APP_IM_URL || `https://chat.yfdc.net/app/test/index.html?v=${md}#`
} else {
  configPro.appIMUrl = process.env.VUE_APP_IM_URL
}

export default configPro

/**
 * 开发环境配置
 */
let md = new Date().valueOf(); // 清除index.html缓存

const configDev = {
  appDebug: true,
  appWebStaticUrl: process.env.VUE_APP_WEB_STATIC_URL || 'https://appv2.yfdc.net:444/h5ht/static/', // 应用资源地址
  appApiUrl: 'https://mtest.yfdc.net/',//'https://m.yfdc.net/', // 数据接口地址 测试接口：'https://mtest.yfdc.net/'
  appH5PageUrl: 'https://appv2.yfdc.net:444/h5ht/#/', // 本站H5页面的地址
  approvalH5WebUrl: 'https://appv2.yfdc.net:444/approvalh5/#/', //   审批系统H5网站地址
  appH5PageUrlYFJJ: 'https://appv2.yfdc.net:444/h5h/#/', // 裕丰经纪 H5页面的地址
  loginTokenKey: 'x59bAcdkKTjHx2UytTMvPJfOcpgXPoCL', // 登陆接口key
  newAppKey: 'app1',//裕丰地产改版区分接口应用
  appKey: 'quB2ljPhBoGl', // 用于区分客户端应用
  encryptKey: 'e35cf7b66449df565f93c607d5a81d09', // 数据解密key
  encryptIV: '456abcdMOBILE901', // 数据解密序号iv
}

// 根据接口地址自动选择聊天的url
if (configDev.appApiUrl === 'https://m.yfdc.net/') {
  configDev.appIMUrl = `https://chat.yfdc.net/app/prod/index.html?v=${md}#`
} else if (configDev.appApiUrl === 'https://mtest.yfdc.net/') {
  configDev.appIMUrl = process.env.VUE_APP_IM_URL || `https://chat.yfdc.net/app/test/index.html?v=${md}#`
} else {
  configDev.appIMUrl = process.env.VUE_APP_IM_URL
}

export default configDev

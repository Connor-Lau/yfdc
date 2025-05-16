import configDev from '@/common/configs/config-dev.js'
import configPro from '@/common/configs/config-pro.js'
import utilCore from '@/common/utils/util-core.js'

/**
 * 应用配置
 */
const appConfig = {
  appEnv: process.env.NODE_ENV, // 应用环境
  appDebug: true, // 应用调试模式,开发中觉得日志太多可设置为false
  appLogLevel: "log", // 调试日志等级：info,log,warn,error
  cacheUserInfo: "userInfoCache",//用户登陆成功后数据
  cacheExpireTime: 300,//AJAX返回数据的缓存时长（秒），设置为5分钟
  baiduMapAK: 'dDxPGRRTiiKiszzMcy8TTxsYtAM9qtTi', // 百度地图客户端AK
  cacheAppTelInfo: "sysAppTelInfoCache",//手机配置信息缓存(从APP处理获取)
  //8825的key:5435a15f6d89ad31779b1c136ace61fc
  //新哥的key:6e48ea8709e8fd1a861b4b4bb869de14
  //杨哥的key:1192e1782583a37e049ccb2ac8b00f89
  //华哥的key:31ffe6a6062f18cf40861c5568807b88
  //钟康的Key:8d213596d5602560cdd933dba771209f 
  //康健的key:e1f74511d950d40285227df735a70707 
  //锰烁的key:1ca07482e3b73fcc4ec8cbdbcbf55277
  //绮霞的key:abaf1e5ddc665588114b6f8af5fe7990
  //appMapKey: ['abaf1e5ddc665588114b6f8af5fe7990', '1ca07482e3b73fcc4ec8cbdbcbf55277', 'e1f74511d950d40285227df735a70707', '8d213596d5602560cdd933dba771209f', '31ffe6a6062f18cf40861c5568807b88', '5435a15f6d89ad31779b1c136ace61fc', '6e48ea8709e8fd1a861b4b4bb869de14', '1192e1782583a37e049ccb2ac8b00f89'],//H5显示静态地图
  appMapKey: ['6e48ea8709e8fd1a861b4b4bb869de14'],
}
// 设置启用测试环境
// appConfig.appEnv = 'testing'
// 加载合并环境配置
switch (appConfig.appEnv) {
  case 'development':
    utilCore.extend(appConfig, configDev)
    break
  case 'production':
  default:
    utilCore.extend(appConfig, configPro)
}

// 导出模块
export default appConfig

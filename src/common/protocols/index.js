/**
 * 协议集合文件
 */
// 协议定义说明
/**
  协议名称: {
    name: 协议名称,
    url: 协议请求地址,
    method: 请求方式,
    param: 协议请求参数,
    header: 协议请求头,
    res: 协议返回参数,
    checkToken: 协议是否需要检查登陆token
  }
 */
import commonUtils from '@/common/utils/index.js'
import commonCaches from '@/common/caches/index.js'
import commonNets from '@/common/nets/index.js'
import appConfig from '@/common/configs/index.js'
import user from '@/common/protocols/protocol-user.js'
import home from '@/common/protocols/protocol-home.js'
import city from '@/common/protocols/protocol-city.js'
import commission from '@/common/protocols/protocol-commission.js'
import map from '@/common/protocols/protocol-map.js'

import store from "@/store"

const commonProtocol = {
  user,
  home,
  city,
  commission,
  map
}

/**
 * 按协议进行ajax请求
 * @param {Object} protocolName => 协议名称
 * @param {Object} param => 请求参数{data:{},param:{},comFun:null .....}
 */
commonProtocol.request = async function (protocolName, param) {
  // 判断是否存在这个协议
  if (commonUtils.utilCore.empty(protocolName) || !commonUtils.utilCore.isObject(protocolName)) {
    commonUtils.appLog.error('协议不正确:' + protocolName)
    return {}
  }
  // commonUtils.appLog.log('请求的协议：',protocolName)
  // commonUtils.appLog.log('请求的参数：',param)

  // 组合要请求的协议参数
  let _param = {
    ...param
  }
  //_param.data.app_key = appConfig.appKey

  // 获取协议的MD5值
  let cacheKeyVal = ""
  let returnValue = {}
  //判断协议是否有开启缓存(先不开缓存了，有罪！！！)
  if (1 > 2 && protocolName.doCache && protocolName.doCache == true) {
    cacheKeyVal = commonUtils.utilCryptoJS.md5(protocolName.name + JSON.stringify(param))
    returnValue = commonCaches.getKeyCache(cacheKeyVal, {})
    try {
      returnValue = JSON.parse(returnValue)
    } catch (e) {
      commonUtils.appLog.log('不是获取缓存数据', e);
    }
  }

  // 如果缓存有效，则直接返回缓存的数据
  let thisTime = commonUtils.utilDate.time();
  let cacheTimeVal = protocolName.doCacheTime || 0
  if (returnValue && !commonUtils.utilCore.empty(returnValue.time) && returnValue.time >= thisTime - cacheTimeVal) {
    //commonUtils.appLog.log('缓存数据============================>>>>', returnValue.time, thisTime, returnValue);
    return returnValue.data
  } else {

    let tmpUserInfo = commonCaches.getKeyCache(appConfig.cacheUserInfo, "");
    // 04-06: 接口文档标注 user_auth_key_v1 是	用户登录token; 加个判断是否为对象
    if (!commonUtils.utilCore.empty(tmpUserInfo) && !commonUtils.utilCore.isObject(tmpUserInfo)) {
      tmpUserInfo = JSON.parse(tmpUserInfo);
    }
    if (tmpUserInfo && (tmpUserInfo.access_token || tmpUserInfo.user_auth_key_v1)) {
      _param.headers = {// 请求头部
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'app-key': appConfig.newAppKey,
        'user-token': (tmpUserInfo.access_token || tmpUserInfo.user_auth_key_v1)
      }
    } else {//没有登陆信息
      //store.dispatch('user/actLoginOutApp');
    }
    //判断接口是否需要登陆的token,如果需要则自动加上
    if (protocolName.checkToken) {
      if (commonUtils.utilCore.empty(_param.headers) || commonUtils.utilCore.empty(_param.headers['user-token'])) {
        commonUtils.utilCore.showToast("登陆信息出错");
      }
      commonUtils.appLog.log('需要登陆, 请求的协议：', protocolName.url)
    } else {
      commonUtils.appLog.log('不需要登陆的请求，请求的协议：', protocolName.url)
    }
    // 求得提交数据时的sign && 将提交的数据加密
    // if (!commonUtils.utilCore.empty(_param.data)) {
    //   //_param.data.service = protocolName.name // 加入接口服务名称
    //   //const sign = commonUtils.utilCryptoJS.getSign(_param.data)
    //   //_param.data = commonUtils.utilCryptoJS.getCrypto(_param.data)
    //   //_param.data.sign = sign

    // }

    //判断一下接口有了城市ID没有，如果没有就加上：
    if (_param.data && commonUtils.utilCore.empty(_param.data.city_id)) {
      _param.data.city_id = store.state.city.switchCityInfo.city_id || store.state.city.thisCityInfo.city_id
      _param.data.site_id = store.state.city.switchCityInfo.city_id || store.state.city.thisCityInfo.city_id
    }

    commonUtils.appLog.log("===================>>>>>", _param.data)

    let tmpBeginTime = Date.now();
    // 按请求方式进行协议请求
    if (!commonUtils.utilCore.empty(protocolName.method) && protocolName.method.toUpperCase() == 'POST') {
      returnValue.data = await commonNets.netAjax.post(protocolName.url, _param.data, _param)
    } else if (!commonUtils.utilCore.empty(protocolName.method) && protocolName.method.toUpperCase() == 'GET') {
      if (_param.data) {
        _param.params = _param.data;
        delete _param.data;
      }
      returnValue.data = await commonNets.netAjax.get(protocolName.url, _param)
    } else {
      returnValue.data = await commonNets.netAjax.ajax(protocolName.url, _param)
    }
    let tmpEngTime = Date.now();
    commonUtils.appLog.log('AJAX执行时间【' + protocolName.name + '】=====>>>>', tmpEngTime - tmpBeginTime);


    if (!commonUtils.utilCore.empty(returnValue.data) &&
      !commonUtils.utilCore.empty(returnValue.data.status) &&
      returnValue.data.status == 200) {
      // 如果协议有开启缓存，则保存缓存
      if (protocolName.doCache && protocolName.doCache == true) {
        returnValue.time = thisTime * 1 + appConfig.cacheExpireTime;
        commonCaches.setKeyCache(cacheKeyVal, JSON.stringify(returnValue));
      }
      let res = returnValue.data;

      commonUtils.appLog.log('返回的数据=====>>>>', res, 88888888888, _param);

      //如果返回的状态是用户登陆出错，则清除登陆信息，并跳转到登陆页面。
      if (res && res.status && res.status == 200 && res.data && res.data.ret && res.data.ret == 406) {
        store.commit('user/setUserLogout');
        return commonUtils.utilCore.uniGoPage('/pages/common/login/login');
      } else if (res && res.status && res.status != 200) {//如果返回的状态不对，则提示出错
        let tmpMsg = "";
        if (appConfig.appEnv == 'development') {
          tmpMsg = "服务器出错：" + protocolName.name + ":" + res.status;
        } else {
          tmpMsg = "服务器出错：" + res.status;
        }
        commonUtils.utilCore.showToast(tmpMsg);
      }
    } else {
      commonUtils.appLog.log('出错的返回的数据=====>>>>', protocolName.url, returnValue.data);
      commonUtils.utilCore.showToast("服务器出错【" + protocolName.name + "】");
    }
    // 返回数据
    return returnValue.data
  }
}

export default commonProtocol

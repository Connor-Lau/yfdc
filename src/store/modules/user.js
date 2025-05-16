import commonUtils from '@/common/utils/index.js'
import commonCaches from '@/common/caches/index.js'
import commonProtocol from '@/common/protocols/index.js'
import appConfig from '@/common/configs/index.js'

const user = {
  namespaced: true,
  state: {
    isLogin: false, // 用户是否已经登陆
    userToken: "",// 用户登陆成功的令牌
    userTokenMd5: "",// 用户登陆成功的令牌MD5值（用户判断是否重新登陆过）
    userUid: '', // 聊天用户ID
    userId: 0, // 用户ID
    userType: 0, // 1:用户,2:经纪人
    userInfo: '',// 用户信息(登陆时获得的用户信息)
    switchCityId: null,//替换以前城市id
    preLoginWeixinVal: "",//微信预登陆数据
    preLoginAppleVal: "",//苹果预登陆数据
  },
  mutations: {// 使用mutations直接更改state的值
    /**
     * 设置用户登陆令牌的MD5值
     * @param {*} state
     * @param {*} userTokenMd5
     */
    setUserTokenMd5 (state, userTokenMd5) {
      state.userTokenMd5 = userTokenMd5
    },
    /**
     * 替换以前城市id
     * @param {*} state
     * @param {*} switchCityId
     */
    setSwitchCityId (state, switchCityId) {
      state.switchCityId = switchCityId
    },
    /**
     * 设置用户的登陆标记
     * @param {*} state
     * @param {*} isLogin
     */
    setIsLogin (state, isLogin) {
      //确保一定是bool值
      state.isLogin = !!isLogin
    },
    /**
     * 设置登陆用户信息
     * @param {*} state
     * @param {*} userInfo
     */
    setUserInfo (state, userInfo) {
      commonUtils.appLog.log('【H5】【H5】【H5】', userInfo)
      if (commonUtils.utilCore.empty(userInfo)) {
        return
      }
      state.userInfo = userInfo

      // 用户类型
      if (!commonUtils.utilCore.empty(userInfo.user_type)) {
        state.userType = userInfo.user_type
      }

      // 用户帐号ID
      if (!commonUtils.utilCore.empty(userInfo.user_id)) {
        state.userId = userInfo.user_id;
        // 聊天用户ID
        state.userUid = (state.userType === 2 ? 'b_' : 'u_') + userInfo.user_id
      }

      // 用户登陆token && 登陆状态
      if (!commonUtils.utilCore.empty(userInfo.user_auth_key_v1)) {
        state.userToken = userInfo.user_auth_key_v1
        state.isLogin = true
      }

      //获取当前客户端时间
      userInfo.createCacheTime = commonUtils.utilDate.time()
      commonCaches.setKeyCache(appConfig.cacheUserInfo, JSON.stringify(userInfo))
    },
    /**
     * 用户退出登陆
     * @param {*} state
     */
    setUserLogout (state) {
      state.isLogin = false // 用户是否已经登陆
      state.userToken = '' // 用户登陆成功的令牌
      state.userUid = '' // 聊天用户ID
      state.userId = 0 // 用户ID
      state.userType = 0 // 1:用户,2:经纪人
      state.userInfo = ''// 用户信息(登陆时获得的用户信息)
      // 保存用户登陆成功的的数据到缓存中
      commonCaches.delKeyCache(appConfig.cacheUserInfo)
      //清掉所有的缓存
      localStorage.clear();
    },
    //设置微信预登陆数据
    setPreLoginWeixinVal (state, loginWeixinVal) {
      state.preLoginWeixinVal = loginWeixinVal
    },
    //设置苹果预登陆数据
    setPreLoginAppleVal (state, loginAppleVal) {
      state.preLoginAppleVal = loginAppleVal
    }
  },
  actions: {
    /**
     * 检查进行用户自动登陆
     * @param {*} param0
     */
    initLogin: function ({ commit, state }) {
      commonUtils.appLog.log('【H5】【H5】【H5】', "initLogin")
      //如果用户未有登陆标记，则试下缓存里是否有记录用户的登寻信息
      let userInfo = commonCaches.getKeyCache(appConfig.cacheUserInfo)
      // 如果用户还有登陆状态，则设置用户自动登陆
      if (!commonUtils.utilCore.empty(userInfo)) {
        userInfo = JSON.parse(userInfo);
        commit('setUserInfo', userInfo);
        commonUtils.appLog.log('用户自动登陆成功！')
        return userInfo
      } else {
        commonUtils.appLog.log('用户自动登陆失败！')
        return false
      }
    },
    /**
     * 从APP处退出登陆
     * @param {*} param0
     * @param {*} messageAct
     */
    actLoginOutApp: async function ({ commit, dispatch, state }, messageAct) {
      commonUtils.appLog.log('【H5】【H5】【H5】', "actLoginOutApp")

      //登录后更新客户端
      dispatch('user/actAppUpdateClientByLogout', { messageAct }, { root: true });

      return new Promise((resolve, reject) => {
        messageAct.messageProtocols.push({
          "actLoginOutApp": (msg) => {
            if (!commonUtils.utilCore.empty(msg)) {
              commonUtils.appLog.log('【H5】【H5】【H5】resolve', msg)
              commit("setUserLogout")
              resolve(msg)
            } else {
              resolve(msg)
            }
          }
        })
        // 向APP请求用户退出登陆
        let msgData = {
          act: 'actLoginOutApp',
          isAsync: true,
          msg: '请求用户退出APP登陆'
        }
        messageAct.sendMessageToApp(msgData);
      })
    },
    //处理一键登陆
    actLogin: async function ({ commit, state }, messageAct) {
      commonUtils.appLog.log('【H5】【H5】【H5】', "actLogin")
      return new Promise((resolve, reject) => {
        messageAct.messageProtocols.push({
          "actLoginAPP": (msg) => {
            if (
              commonUtils.utilCore.isObject(msg)
              && commonUtils.utilCore.empty(msg.errCode)
              && commonUtils.utilCore.empty(msg.provider)
            ) {
              commonUtils.appLog.log('【H5】【H5】【H5】resolve', msg)
              // commit("setUserInfo", msg)
              resolve(msg)
            } else {
              resolve(msg)
            }
          }
        })
        // 向APP请求用户退出登陆
        let msgData = {
          act: 'actLoginAPP',
          isAsync: true,
          msg: { appLoginFormType: 1, msg: "请求一键登陆" }
        }
        messageAct.sendMessageToApp(msgData);
      })
    },
    //处理微信预登陆
    actLoginWeixin: async function ({ commit, state }, messageAct) {
      commonUtils.appLog.log('【H5】【H5】【H5】', "actLoginWeixin")
      return new Promise((resolve, reject) => {
        messageAct.messageProtocols.push({
          "actLoginAPP": (msg) => {
            if (commonUtils.utilCore.isObject(msg)) {
              commonUtils.appLog.log('【H5】【H5】【H5】resolve', msg)
              commit("setPreLoginWeixinVal", msg.msg)
              resolve(msg)
            } else {
              resolve(msg)
            }
          }
        })
        // 向APP请求用户退出登陆
        let msgData = {
          act: 'actLoginAPP',
          isAsync: true,
          msg: { appLoginFormType: 2, msg: "请求微信预登陆" }
        }
        messageAct.sendMessageToApp(msgData);
      })
    },
    //处理苹果登陆
    actLoginApple: async function ({ commit, state }, messageAct) {
      commonUtils.appLog.log('【H5】【H5】【H5】', "actLoginApple")
      return new Promise((resolve, reject) => {
        messageAct.messageProtocols.push({
          "actLoginAPP": (msg) => {
            if (commonUtils.utilCore.isObject(msg)) {
              commonUtils.appLog.log('【H5】【H5】【H5】resolve apple', msg)
              commit("setPreLoginAppleVal", msg)
              resolve(msg)
            } else {
              resolve(msg)
            }
          }
        })
        // 向APP请求用户退出登陆
        let msgData = {
          act: 'actLoginAPP',
          isAsync: true,
          msg: { appLoginFormType: 5, msg: "请求苹果登陆" }
        }
        messageAct.sendMessageToApp(msgData);
      })
    },
    //通过手机号一键登录
    getAppFangAuthloginByPhone: async function (context, { messageAct, postData }) {
      let optionsRequest = {
        data: {
          openid: postData.authResult.openid,//	是	string	OPENID
          token: postData.authResult.access_token//	是	string	令牌
        }
      }
      // commonUtils.appLog.log("更新前提交的参数", optionsRequest)
      let res = await commonProtocol.request(commonProtocol.user.appFangAuthloginByPhone, optionsRequest)
      // commonUtils.appLog.log('通过手机号一键登录结果====》》》', res)
      if (res && res.data && res.data && res.data.code && res.data.code == 200) {
        res = commonUtils.utilCore.deepClone(res.data.data)
        context.commit('setUserInfo', res)

        //登录后更新客户端
        context.dispatch('user/actAppUpdateClientByLogin', { messageAct }, { root: true });

        //通知APP用户登陆成功
        await context.dispatch('app/setAppStateData', { messageAct: messageAct, jsonData: [{ "mod": "user", "fun": "setUserInfo", "val": res }] }, { root: true });
      } else {
        res = ""
      }
      return res;
    },
    //获取手机短信验证码
    getAppFangAuthsendSmsCode: async function (context, postData) {
      let optionsRequest = {
        data: {
          account: postData.account//	是	string	手机号
        }
      }
      commonUtils.appLog.log("更新前提交的参数", optionsRequest)
      let res = await commonProtocol.request(commonProtocol.user.appFangAuthsendSmsCode, optionsRequest)
      commonUtils.appLog.log('通过手机号发消息结果====》》》', res)
      if (res && res.data && res.data && res.data.code && res.data.code == 200) {
        return true;
      }
      return false;
    },
    //手机号码通过短信验证码注册与登录（以及进行微信与手机号的绑定）
    actAppFangAuthloginBySms: async function (context, { messageAct, postData }) {
      let optionsRequest = {
        data: {
          account: postData.account,//	是	string	手机号
          sms_code: postData.sms_code,//	是	string	短信验证码
          is_register: postData.is_register
        }
      }
      if (!commonUtils.utilCore.empty(postData.union_id)) {
        optionsRequest.data.union_id = postData.union_id //	否	string	微信union_id
      }
      if (!commonUtils.utilCore.empty(postData.open_id)) {
        optionsRequest.data.open_id = postData.open_id //	否	string	微信open_id
      }
      if (!commonUtils.utilCore.empty(postData.apple_open_id)) {
        optionsRequest.data.apple_open_id = postData.apple_open_id //	否	string	苹果open_id
      }

      commonUtils.appLog.log("更新前提交的参数", optionsRequest)
      let res = await commonProtocol.request(commonProtocol.user.appFangAuthloginBySms, optionsRequest)
      commonUtils.appLog.log('===注册或登陆结果====》》》', res)
      if (res && res.data && res.data && res.data.code && res.data.code == 200) {
        res = commonUtils.utilCore.deepClone(res.data.data)
        context.commit('setUserInfo', res)

        //登录后更新客户端
        context.dispatch('user/actAppUpdateClientByLogin', { messageAct }, { root: true });

        await context.dispatch('app/setAppStateData', { messageAct: messageAct, jsonData: [{ "mod": "user", "fun": "setUserInfo", "val": res }] }, { root: true });
        return res;
      } else {
        commonUtils.utilCore.showToast(res.data.msg || "服务器出错");
      }
      return false;
    },
    //用户union_id登录
    actAppWechatAuthloginByMpWeiXin: async function (context, { messageAct, postData }) {
      let optionsRequest = {
        data: {
          union_id: postData.union_id, //	否	string	微信union_id
          user_type: "1", //	是	string	1.用户 2.经纪人
        }
      }
      optionsRequest.data.union_id = postData.union_id;

      commonUtils.appLog.log("提交的参数==>", optionsRequest)
      let res = await commonProtocol.request(commonProtocol.user.appWechatAuthloginByMpWeiXin, optionsRequest)
      commonUtils.appLog.log('用户union_id登录结果====》》》', res)
      if (res && res.data && res.data.code && res.data.code == 200) {
        //如果是新用户，则需要去绑定手机的
        if (res.data.data && res.data.data.is_new) {
          return res.data.data;
        } else if (res.data.data && res.data.data.token) {
          //这里要帮用户完成登陆的标记
          res = commonUtils.utilCore.deepClone(res.data.data)
          //这里需要转换一下登陆的token(因为后端接口使用union登陆的时候返回的数据格式跟其它的不同)
          res.user_auth_key_v1 = res.token;
          if (res.user_data) {
            res.user_row = commonUtils.utilCore.deepClone(res.user_data);
          }
          delete res.token
          delete res.user_data

          context.commit('setUserInfo', res)

          //登录后更新客户端
          context.dispatch('user/actAppUpdateClientByLogin', { messageAct }, { root: true });

          await context.dispatch('app/setAppStateData', { messageAct: messageAct, jsonData: [{ "mod": "user", "fun": "setUserInfo", "val": res }] }, { root: true });
          return res;
        }
      }
      return false;
    },
    //用户苹果open_id登录
    actAppWechatAuthloginByAppleId: async function (context, { messageAct, postData }) {
      let optionsRequest = {
        data: {
          apple_open_id: postData.union_id, //	否	string	苹果open_id
          // user_type: "1", //	是	string	1.用户 2.经纪人
        }
      }
      optionsRequest.data.apple_open_id = postData.union_id;

      commonUtils.appLog.log("提交的参数==>", optionsRequest)
      let res = await commonProtocol.request(commonProtocol.user.appWechatAuthloginByAppleId, optionsRequest)
      commonUtils.appLog.log('用户苹果open_id登录结果====》》》', res)
      if (res && res.data && res.data.code && res.data.code == 200) {
        //如果是新用户，则需要去绑定手机的
        if (res.data.data && res.data.data.is_new) {
          return res.data.data;
        } else if (res.data.data && res.data.data.token) {
          //这里要帮用户完成登陆的标记
          res = commonUtils.utilCore.deepClone(res.data.data)
          //这里需要转换一下登陆的token(因为后端接口使用union登陆的时候返回的数据格式跟其它的不同)
          res.user_auth_key_v1 = res.token;
          if (res.user_data) {
            res.user_row = commonUtils.utilCore.deepClone(res.user_data);
          }
          delete res.token
          delete res.user_data

          context.commit('setUserInfo', res)

          //登录后更新客户端
          context.dispatch('user/actAppUpdateClientByLogin', { messageAct }, { root: true });

          await context.dispatch('app/setAppStateData', { messageAct: messageAct, jsonData: [{ "mod": "user", "fun": "setUserInfo", "val": res }] }, { root: true });
          return res;
        }
      }
      return false;
    },
    //帐号登陆
    actAppFangAuthLogin: async function (context, { messageAct, postData }) {
      let optionsRequest = {
        data: {
          account: postData.account,//	是	string	账号
          password: postData.password,//	是	string	密码
        }
      }

      commonUtils.appLog.log("提交的参数==>", optionsRequest)
      let res = await commonProtocol.request(commonProtocol.user.appFangAuthLogin, optionsRequest)
      commonUtils.appLog.log('用户帐号登录结果====》》》', res)
      if (res && res.data && res.data.code && res.data.code == 200) {
        //如果是新用户，则需要去绑定手机的
        // 经纪人账号身份 登录提示
        if (res.data.data.user_type == 2) {
          commonUtils.utilCore.showToast(" 账号不存在！");
          return false;
        }
        if (res.data.data && res.data.data.user_auth_key_v1) {
          //这里要帮用户完成登陆的标记
          res = commonUtils.utilCore.deepClone(res.data.data)

          //如果是苹果的用户
          if (postData.user_email) {
            res.user_row.extend.nickname = postData.user_email
          }

          context.commit('setUserInfo', res)

          //登录后更新客户端
          context.dispatch('user/actAppUpdateClientByLogin', { messageAct }, { root: true });

          await context.dispatch('app/setAppStateData', { messageAct: messageAct, jsonData: [{ "mod": "user", "fun": "setUserInfo", "val": res }] }, { root: true });
          return res;
        }
      }
      return false;
    },
    //重置密码并登录
    actAppFangAuthResetPassword: async function (context, { messageAct, postData }) {
      let optionsRequest = {
        data: {
          account: postData.account,//	是	string	账号
          password: postData.password,//	是	string	新密码
          sms_code: postData.sms_code,//	是	string	短信验证码
        }
      }

      commonUtils.appLog.log("提交的参数==>", optionsRequest)
      let res = await commonProtocol.request(commonProtocol.user.appFangAuthResetPassword, optionsRequest)
      commonUtils.appLog.log('重置密码登录结果====》》》', res)
      if (res && res.data && res.data.code && res.data.code == 200) {
        //如果是新用户，则需要去绑定手机的
        if (res.data.data && res.data.data.user_auth_key_v1) {
          //这里要帮用户完成登陆的标记
          res = commonUtils.utilCore.deepClone(res.data.data)
          context.commit('setUserInfo', res)

          //登录后更新客户端
          context.dispatch('user/actAppUpdateClientByLogin', { messageAct }, { root: true });

          await context.dispatch('app/setAppStateData', { messageAct: messageAct, jsonData: [{ "mod": "user", "fun": "setUserInfo", "val": res }] }, { root: true });
          return res;
        }
      }
      return res.data;
    },
    /**
    *  我关注的新房列表
    * @param {*} context 
    * @returns 
    */
    getAppFavoriteHouse: async function (context, postData) {
      let optionsRequest = {
        data: postData || {}
      }
      let res = await commonProtocol.request(commonProtocol.user.appFangFavoriteHouse, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
    *  我关注的二手房列表
    * @param {*} context 
    * @returns 
    */
    getAppFavoriteSale: async function (context, postData) {
      let optionsRequest = {
        data: postData || {}
      }
      let res = await commonProtocol.request(commonProtocol.user.appFangFavoriteSale, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
    *  我关注的租房列表
    * @param {*} context 
    * @returns 
    */
    getAppFavoriteRent: async function (context, postData) {
      let optionsRequest = {
        data: postData || {}
      }
      let res = await commonProtocol.request(commonProtocol.user.appFangFavoriteRent, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
   *  我关注的小区列表(新版)
   * @param {*} context 
   * @returns 
   */
    getAppFangFavoriteNewUptown: async function (context, postData) {
      let optionsRequest = {
        data: postData || {}
      }
      let res = await commonProtocol.request(commonProtocol.user.appFangFavoriteNewUptown, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    //登录后更新客户端
    actAppUpdateClientByLogin: async function (context, { messageAct }) {
      if (!context.rootState.user.isLogin) {
        commonUtils.appLog.log("actAppUpdateClientByLogin========>>未登陆，不上报", context.rootState.user.userInfo)
        return;
      }
      //从APP处获取手机的信息(主要是获取 消息ID，手机的UUID)
      let jsonDataInfo = commonCaches.getKeyCache(appConfig.cacheAppTelInfo, "")
      if (commonUtils.utilCore.empty(jsonDataInfo)) {
        let jsonData = [{ "mod": "app", "val": "clientInfo" }, { "mod": "app", "val": "deviceInfo" }]
        jsonDataInfo = await context.dispatch('app/getAppStateData', { messageAct, jsonData }, { root: true });
        commonCaches.setKeyCache(appConfig.cacheAppTelInfo, JSON.stringify(jsonDataInfo))
      } else {
        jsonDataInfo = JSON.parse(jsonDataInfo);
      }
      commonUtils.appLog.log("actAppUpdateClientByLogin========>>这是结果", jsonDataInfo)

      let tmp_client_app_id = "client_app_id";
      let tmp_uuid = "uuid";
      if (jsonDataInfo && jsonDataInfo.app_clientInfo) {
        tmp_client_app_id = jsonDataInfo.app_clientInfo.clientid
      }
      if (jsonDataInfo && jsonDataInfo.app_deviceInfo) {
        tmp_uuid = jsonDataInfo.app_deviceInfo.uuid
      }
      let optionsRequest = {
        data: {
          client_app_id: tmp_client_app_id || 'client_app_id',//	是	string	消息ID
          uuid: tmp_uuid || 'uuid',//	是	string	APP唯一标记，UUID
        }
      }
      commonUtils.appLog.log("提交的参数==>", optionsRequest)
      let res = await commonProtocol.request(commonProtocol.user.appUpdateClientByLogin, optionsRequest)
      commonUtils.appLog.log('登录后更新客户端结果====》》》', res)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return true;
      }
      return false;
    },
    //退出登录更新客户端
    actAppUpdateClientByLogout: async function (context, { messageAct }) {
      if (!context.rootState.user.isLogin) {
        commonUtils.appLog.log("actAppUpdateClientByLogout========>>未登陆，不上报", context.rootState.user.userInfo)
        return;
      }
      //从APP处获取手机的信息(主要是获取 消息ID，手机的UUID)
      let jsonDataInfo = commonCaches.getKeyCache(appConfig.cacheAppTelInfo, "")
      if (commonUtils.utilCore.empty(jsonDataInfo)) {
        let jsonData = [{ "mod": "app", "val": "clientInfo" }, { "mod": "app", "val": "deviceInfo" }]
        jsonDataInfo = await context.dispatch('app/getAppStateData', { messageAct, jsonData }, { root: true });
        commonCaches.setKeyCache(appConfig.cacheAppTelInfo, JSON.stringify(jsonDataInfo))
      } else {
        jsonDataInfo = JSON.parse(jsonDataInfo);
      }
      commonUtils.appLog.log("actAppUpdateClientByLogout========>>这是结果", jsonDataInfo)

      let tmp_client_app_id = "client_app_id";
      let tmp_uuid = "uuid";
      if (jsonDataInfo && jsonDataInfo.app_clientInfo) {
        tmp_client_app_id = jsonDataInfo.app_clientInfo.clientid
      } else {
        return false;
      }
      if (jsonDataInfo && jsonDataInfo.app_deviceInfo) {
        tmp_uuid = jsonDataInfo.app_deviceInfo.uuid
      } else {
        return false;
      }
      let optionsRequest = {
        data: {
          client_app_id: tmp_client_app_id || 'client_app_id',//	是	string	消息ID
          uuid: tmp_uuid || 'uuid'//	是	string	APP唯一标记，UUID
        }
      }
      commonUtils.appLog.log("提交的参数==>", optionsRequest)
      let res = await commonProtocol.request(commonProtocol.user.appUpdateClientByLogout, optionsRequest)
      commonUtils.appLog.log('退出登陆后更新客户端结果====》》》', res)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return true;
      }
      return false;
    },
    /**
  *   -设置 举报提交
  * @param {*} context 
  * @returns 
  */
    getAppWechatcFeedbackAcreate: async function (context, postData) {
      let optionsRequest = {
        data: postData
      }
      let res = await commonProtocol.request(commonProtocol.user.appWechatcFeedbackAcreate, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data;
      }
      return false;
    },
    /**
    *  获取合同列表
    * @param {*} context 
    * @returns 
    */
    getAppFangcElectronicAtest: async function (context, postData) {
      let optionsRequest = {
        data: postData || {}
      }
      let res = await commonProtocol.request(commonProtocol.user.appFangcElectronicAtest, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
    *  获取合同预览链接
    * @param {*} context 
    * @returns 
    */
    getAppFangcElectronicAgetFlowPreview: async function (context, postData) {
      let optionsRequest = {
        data: postData || {}
      }
      let res = await commonProtocol.request(commonProtocol.user.appFangcElectronicAgetFlowPreview, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
    *  获取合同签署链接
    * @param {*} context 
    * @returns 
    */
    getAppFangcElectronicAgetSignLink: async function (context, postData) {
      let optionsRequest = {
        data: postData || {}
      }
      let res = await commonProtocol.request(commonProtocol.user.appFangcElectronicAgetSignLink, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
   *  获取置顶预览合同
   * @param {*} context 
   * @returns 
   */
    getAppFangcElectronicAgetTopFlow: async function (context, postData) {
      let optionsRequest = {
        data: postData || {}
      }
      let res = await commonProtocol.request(commonProtocol.user.appFangcElectronicAgetTopFlow, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
   *  合同收据列表
   * @param {*} context 
   * @returns 
   */
    getAppFangcElectronicAgetFlowReceipt: async function (context, postData) {
      let optionsRequest = {
        data: postData || {}
      }
      let res = await commonProtocol.request(commonProtocol.user.appFangcElectronicAgetFlowReceipt, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
   *  查看收据
   * @param {*} context 
   * @returns 
   */
    getAppFangcElectronicAgetReceiptView: async function (context, postData) {
      let optionsRequest = {
        data: postData || {}
      }
      let res = await commonProtocol.request(commonProtocol.user.appFangcElectronicAgetReceiptView, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
  }
}
export default user

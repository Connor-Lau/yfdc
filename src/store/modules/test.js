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
     * 设置聊天用户ID
     * @param {*} state
     * @param {*} userUid
     */
    setUserUid (state, userUid) {
      state.userUid = userUid
    },
    /**
     * 设置用户ID
     * @param {*} state
     * @param {*} userid
     */
    setUserId (state, userid) {
      state.userId = userid
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
     * 设置用户的登陆token
     * @param {*} state
     * @param {*} userToken
     */
    setUserToken (state, userToken) {
      state.userToken = userToken
    },
    /**
     * 设置用户名
     * @param {*} state
     * @param {*} userToken
     */
    setUserName (state, name) {
      if (!state.userInfo) {
        state.userInfo = {
          user: name
        }
      } else {
        state.userInfo.user = name
      }
    },
    /**
    * 设置用户头像
    * @param {*} state
    * @param {*} userToken
    */
    setUserAvatar (state, avatar) {
      if (!state.userInfo) {
        state.userInfo = {
          photo: avatar,
        }
      } else {
        state.userInfo.photo = avatar
      }
    },
    /**
    * 设置分行
    * @param {*} state
    * @param {*} userToken
    */
    setUserCompany (state, company) {
      if (!state.userInfo) {
        state.userInfo = {
          company,
        }
      } else {
        state.userInfo.company = company
      }
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
      // 用户帐号ID
      if (!commonUtils.utilCore.empty(userInfo.uid)) {
        state.userId = userInfo.uid;
        state.userUid = userInfo.user_type == 1 ? ('u_' + userInfo.uid) : ('b_' + userInfo.uid);
      }
      // 用户登陆token && 登陆状态
      if (!commonUtils.utilCore.empty(userInfo.access_token)) {
        state.userToken = userInfo.access_token
        state.isLogin = true
      }
      // 用户类型
      if (!commonUtils.utilCore.empty(userInfo.user_type)) {
        state.userType = userInfo.user_type == 1 ? 1 : 2
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
    },
  },
  actions: {
    /**
     * 检查进行用户自动登陆
     * @param {*} param0
     */
    initLogin: function ({ context, state }) {
      //如果用户已经登陆，则不需要做任何操作
      if (state.isLogin) {
        return true
      }
      //如果用户未有登陆标记，则试下缓存里是否有记录用户的登寻信息
      let userInfo = commonCaches.getKeyCache(appConfig.cacheUserInfo)
      // 如果用户还有登陆状态，则设置用户自动登陆
      if (!commonUtils.utilCore.empty(userInfo)) {
        context.commit('setUserInfo', JSON.parse(userInfo))
        commonUtils.appLog.log('用户自动登陆成功！')
        return true
      } else {
        commonUtils.appLog.log('用户自动登陆失败！')
        return false
      }
    },
    /**
     * 从APP处获取登陆用户的信息
     * @param {*} param0
     * @param {*} messageAct
     */
    getUserInfo: async function ({ commit, state }, messageAct) {
      commonUtils.appLog.log('【H5】【H5】【H5】', "getUserInfo")
      return new Promise((resolve, reject) => {
        commonUtils.appLog.log('【H5】【H5】【H5】', appConfig.cacheUserInfo)
        //判断缓存里是否已经存在
        let userInfo = commonCaches.getKeyCache(appConfig.cacheUserInfo)
        //登陆令牌的MD5值
        let tmpUserTokenMd5 = ""
        if (userInfo && !commonUtils.utilCore.empty(userInfo)) {
          userInfo = JSON.parse(userInfo)
          //求一下登陆令牌的MD5值
          tmpUserTokenMd5 = commonUtils.utilCryptoJS.md5(userInfo.access_token)

          let isMd5 = true //是否需要对比MD5值
          //如果有传token的MD5值传过来，则对比一个MD5值是否有变化
          if (!commonUtils.utilCore.empty(state.userTokenMd5)) {
            if (tmpUserTokenMd5 == state.userTokenMd5) {
              isMd5 = true
            } else {
              isMd5 = false
            }
          }

          let thisTime = commonUtils.utilDate.time()
          //缓存一天的时间，如果超过，则把缓存删掉
          //if ((userInfo.createCacheTime * 1 + 60 * 60 * 24 > thisTime * 1) && (userInfo.uid == state.userId) && isMd5) {
          if ((userInfo.createCacheTime * 1 + 60 * 60 * 24 > thisTime * 1) && (commonUtils.utilCore.empty(state.userId) || userInfo.uid == state.userId) && isMd5) {
            commonUtils.appLog.log("使用userInfo缓存")
            commit("setUserInfo", userInfo)
            // 初始化腾讯云im
            resolve(userInfo)
            return
          } else {
            commonCaches.delKeyCache(appConfig.cacheUserInfo)
          }
        }
        commonUtils.appLog.log('【H5】【H5】【H5】 -- 过期缓存用户', userInfo)

        messageAct.messageProtocols.push({
          "userInfoAPP": (msg) => {
            if (commonUtils.utilCore.isObject(msg)) {
              commonUtils.appLog.log('【H5】【H5】【H5】resolve', msg)
              commit("setUserInfo", msg)
              resolve(msg)
            } else {
              resolve(msg)
            }
          }
        })
        // 向APP请求用户登陆的信息
        let msgData = {
          act: 'userInfoAPP',
          isAsync: true,
          msg: '请求用户登陆信息'
        }
        messageAct.sendMessageToApp(msgData);
      })
    },
    /**
     * 从APP处退出登陆
     * @param {*} param0
     * @param {*} messageAct
     */
    actLoginOutApp: async function ({ commit, state }, messageAct) {
      commonUtils.appLog.log('【H5】【H5】【H5】', "actLoginOutApp")
      return new Promise((resolve, reject) => {
        messageAct.messageProtocols.push({
          "actLoginOutApp": (msg) => {
            if (commonUtils.utilCore.isObject(msg)) {
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
  }
}
export default user

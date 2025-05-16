/**
 * 应用数据管理
 */

import commonUtils from '@/common/utils/index.js'
import commonCaches from '@/common/caches/index.js'
import commonProtocol from '@/common/protocols/index.js'
import appConfig from '@/common/configs/index.js'

export default {
  namespaced: true,
  state: {
    //APP跳入H5时的页面（用于直接从H5页面跳回APP
    appBackUrl: '/pages/page/index',
    systemInfo: {}, // uni.getSystemInfoSync 会从APP那边获得
    deviceInfo: "",//从APP处获得的
    wgtInfo: "",//从APP处获得的
    clientInfo: "",//从APP处获得客户端信息
    WXInfo: {},//微信分享的数据
    platform: '', // 来源系统，yfjj：裕丰经纪  yfdc：裕丰地产  mp:小程序
    checkAppUpdateVal: {},// 需要更新的新版本信息
  },
  mutations: {
    // 设置来源系统
    setPlatform (state, platform) {
      state.platform = platform
    },
    /**
     * 设置微信分享的数据
     * @param {*} state
     * @param {*} info
     */
    setWXInfo (state, info) {
      commonUtils.appLog.log("setWXInfo")
      if (commonUtils.utilCore.empty(info)) {
        return
      }
      state.WXInfo = info
    },
    /**
     * 设置H5返回APP的页面
     * @param {*} state
     * @param {*} backUrl
     */
    setAppBackUrl (state, backUrl) {
      commonUtils.appLog.log("setAppBackUrl")
      if (commonUtils.utilCore.empty(backUrl)) {
        return
      }
      state.appBackUrl = backUrl
    },
    setSystemInfo: function (state, systemInfo) {
      state.systemInfo = systemInfo
      commonUtils.appLog.log("setSystemInfo")
    },
    setDeviceInfo: function (state, deviceInfo) {
      state.deviceInfo = deviceInfo
      commonUtils.appLog.log("setDeviceInfo")
    },
    setWgtInfo: function (state, wgtInfo) {
      state.wgtInfo = wgtInfo
      commonUtils.appLog.log("setWgtInfo")
    },
    setClientInfo: function (state, clientInfo) {
      state.clientInfo = clientInfo
      commonUtils.appLog.log("setClientInfo")
    },
    setStatusBarHeight: function (state, statusBarHeight) {
      state.systemInfo.statusBarHeight = statusBarHeight;
      commonUtils.appLog.log("setClientInfo")
    },
    setCheckAppUpdateVal: function (state, checkAppUpdateVal) {
      state.checkAppUpdateVal = checkAppUpdateVal
    },
  },
  actions: {
    /**
     * 获取微信分享信息
     * @param {Object} context
     * @param {Object} update =>是否要求重新获取
     * @param {String} strkeyData =>要传给跳传页的参数(例如：strkeyData = 'type=100&uid=200')
     */
    getWXInfo: async function (context, { messageAct, update, strkeyData }) {
      return new Promise((resolve, reject) => {
        if (!commonUtils.utilCore.empty(context.state.WXInfo) && commonUtils.utilCore.empty(update)) {
          commonUtils.appLog.log("已经有了系统数据了！！！")
          resolve(context.state.WXInfo)
          return
        }
        if (commonUtils.utilCore.empty(context.state.WXInfo)) {

          messageAct.messageProtocols.push({
            "getWXInfoAPP": (msg) => {
              if (!commonUtils.utilCore.empty(msg)) {
                context.commit('setWXInfo', msg)
                resolve(msg)
              } else {
                commonUtils.appLog.log(msg)
                resolve(msg)
              }
            }
          })
          let messageData = {
            act: "getWXInfoAPP",
            strkey: strkeyData,
            isAsync: true,
            msg: "获取微信分享信息"
          }
          messageAct.sendMessageToApp(messageData)
        } else {
          resolve(context.state.WXInfo)
        }
      })
    },
    /**
     * 获取系统信息
     * @param {Object} context
     * @param {Object} update =>是否要求重新获取
     */
    getSystemInfo: async function (context, messageAct) {
      return new Promise((resolve, reject) => {
        if (!commonUtils.utilCore.empty(context.state.systemInfo) && !commonUtils.utilCore.empty(context.state.systemInfo.language)) {
          // console.log("已经有了系统数据了！！！")
          resolve(context.state.systemInfo)
          return
        }
        if (commonUtils.utilCore.empty(context.state.systemInfo) || commonUtils.utilCore.empty(context.state.systemInfo.language)) {

          messageAct.messageProtocols.push({
            "systemInfoAPP": (msg) => {
              if (commonUtils.utilCore.isObject(msg) && !commonUtils.utilCore.empty(msg.statusBarHeight)) {
                context.commit('setSystemInfo', msg)
                resolve(msg)
              } else {
                // console.log(msg)
                resolve(msg)
              }
            }
          })
          let messageData = {
            act: "systemInfoAPP",
            isAsync: true,
            msg: "获取手机系统信息"
          }
          messageAct.sendMessageToApp(messageData)
        } else {
          resolve(context.state.systemInfo)
        }
      })
    },
    /**
     * 获取设备信息
     * @param {Object} context
     * @param {Object} update =>是否要求重新获取
     */
    getDeviceInfo: async function (context, messageAct) {
      return new Promise((resolve, reject) => {
        if (!commonUtils.utilCore.empty(context.state.deviceInfo)) {
          // console.log("已经有了系统数据了！！！")
          resolve(context.state.deviceInfo)
          return
        }
        if (commonUtils.utilCore.empty(context.state.deviceInfo)) {

          messageAct.messageProtocols.push({
            "getDeviceInfoAPP": (msg) => {
              if (commonUtils.utilCore.isObject(msg)) {
                context.commit('setDeviceInfo', msg)
                resolve(msg)
              } else {
                // console.log(msg)
                resolve(msg)
              }
            }
          })
          let messageData = {
            act: "getDeviceInfoAPP",
            isAsync: true,
            msg: "获取设备信息"
          }
          messageAct.sendMessageToApp(messageData)
        } else {
          resolve(context.state.deviceInfo)
        }
      })
    },

    /**
     * 获取版本信息
     * @param {Object} context
     * @param {Object} update =>是否要求重新获取
     */
    getWgtInfo: async function (context, messageAct) {
      return new Promise((resolve, reject) => {
        if (!commonUtils.utilCore.empty(context.state.wgtInfo)) {
          // console.log("已经有了系统数据了！！！")
          resolve(context.state.wgtInfo)
          return
        }
        if (commonUtils.utilCore.empty(context.state.wgtInfo)) {

          messageAct.messageProtocols.push({
            "getWgtInfoAPP": (msg) => {
              if (commonUtils.utilCore.isObject(msg)) {
                context.commit('setWgtInfo', msg)
                resolve(msg)
              } else {
                // console.log(msg)
                resolve(msg)
              }
            }
          })
          let messageData = {
            act: "getWgtInfoAPP",
            isAsync: true,
            msg: "获取版本信息"
          }
          messageAct.sendMessageToApp(messageData)
        } else {
          resolve(context.state.wgtInfo)
        }
      })
    },
    /**
    * 获取客户端信息
    * @param {Object} context
    * @param {Object} update =>是否要求重新获取
    */
    getClientInfo: async function (context, messageAct) {
      return new Promise((resolve, reject) => {
        if (!commonUtils.utilCore.empty(context.state.clientInfo)) {
          // console.log("已经有了系统数据了！！！")
          resolve(context.state.clientInfo)
          return
        }
        if (commonUtils.utilCore.empty(context.state.clientInfo)) {

          messageAct.messageProtocols.push({
            "getClientInfoAPP": (msg) => {
              if (commonUtils.utilCore.isObject(msg)) {
                context.commit('setClientInfo', msg)
                resolve(msg)
              } else {
                // console.log(msg)
                resolve(msg)
              }
            }
          })
          let messageData = {
            act: "getClientInfoAPP",
            isAsync: true,
            msg: "获取客户端信息"
          }
          messageAct.sendMessageToApp(messageData)
        } else {
          resolve(context.state.clientInfo)
        }
      })
    },
    /**
     * 获取微信分享信息
     * @param {Object} context
     * @param {Object} jsonData =>要传的分享参数
     */
    getShareApp: async function (context, { messageAct, jsonData }) {
      return new Promise((resolve, reject) => {
        messageAct.messageProtocols.push({
          "actShareAPP": (msg) => {
            if (!commonUtils.utilCore.empty(msg)) {
              commonUtils.appLog.log("OK------------>", msg)
              resolve(msg)
            } else {
              commonUtils.appLog.log("error----------->", msg)
              resolve(msg)
            }
          }
        })
        let messageData = {
          act: "actShareAPP",
          jsonData: jsonData,
          isAsync: true,
          msg: "获取微信分享信息"
        }
        messageAct.sendMessageToApp(messageData)
      })
    },
    /**
     * 获取复制信息
     * @param {Object} context
     * @param {Object} jsonData =>要传的分享参数
     */
    getCopyMessage: async function (context, { messageAct, jsonData }) {
      return new Promise((resolve, reject) => {
        messageAct.messageProtocols.push({
          "actCopyAPP": (msg) => {
            commonUtils.appLog.log("waimina------------>", msg)

            if (!commonUtils.utilCore.empty(msg)) {
              commonUtils.appLog.log("OK------------>", msg)
              resolve(msg)
            } else {
              commonUtils.appLog.log("error----------->", msg)
              resolve(msg)
            }
          }
        })
        let messageData = {
          act: "actCopyAPP",
          message: jsonData,
          isAsync: true,
          msg: "获取复制信息"
        }
        messageAct.sendMessageToApp(messageData)
      })
    },
    /**
     * 获取复制信息
     * @param {Object} context
     */
    getPasteMessage: async function (context, { messageAct }) {
      return new Promise((resolve, reject) => {
        messageAct.messageProtocols.push({
          "actPasteAPP": (msg) => {
            if (!commonUtils.utilCore.empty(msg)) {
              commonUtils.appLog.log("OK------------>", msg)
              resolve(msg)
            } else {
              commonUtils.appLog.log("error----------->", msg)
              resolve(msg)
            }
          }
        })
        let messageData = {
          act: "actPasteAPP",
          isAsync: true,
          msg: "获取粘贴信息"
        }
        messageAct.sendMessageToApp(messageData)
      })
    },
    /**
     * 获取各模块的信息
     * @param {Object} context
     * @param {Object} jsonData:[{"mod":"模块名","val":模块变量名}]
     */
    getAppStateData: async function (context, { messageAct, jsonData }) {
      return new Promise((resolve, reject) => {
        messageAct.messageProtocols.push({
          "getAppStateDataAPP": (msg) => {
            if (!commonUtils.utilCore.empty(msg)) {
              resolve(msg)
            } else {
              resolve(msg)
            }
          }
        })
        let messageData = {
          act: "getAppStateDataAPP",
          stateData: jsonData,
          isAsync: true,
          msg: "获取各模块的信息"
        }
        messageAct.sendMessageToApp(messageData)
      })
    },
    /**
     * 保存各模块的信息
     * @param {Object} context
     * @param {Object} jsonData:[{"mod":"模块名","fun":模块变量值设置函数,"val":模块变量名}]
     */
    setAppStateData: async function (context, { messageAct, jsonData }) {
      return new Promise((resolve, reject) => {
        messageAct.messageProtocols.push({
          "setAppStateDataAPP": (msg) => {
            if (!commonUtils.utilCore.empty(msg)) {
              resolve(msg)
            } else {
              resolve(msg)
            }
          }
        })
        let messageData = {
          act: "setAppStateDataAPP",
          stateData: jsonData,
          isAsync: true,
          msg: "保存各模块的信息"
        }
        messageAct.sendMessageToApp(messageData)
      })
    },
    /**
     * 保存图片
     * @param {Object} context
     * @param {Object} jsonData:{"imgUrl":"图片地址(网络地址)"]
     */
    actAppImgSave: async function (context, { messageAct, jsonData }) {
      return new Promise((resolve, reject) => {
        messageAct.messageProtocols.push({
          "actAppImgSaveAPP": (msg) => {
            if (!commonUtils.utilCore.empty(msg)) {
              resolve(msg)
            } else {
              resolve(msg)
            }
          }
        })
        let messageData = {
          act: "actAppImgSaveAPP",
          stateData: jsonData,
          isAsync: true,
          msg: "保存图片"
        }
        messageAct.sendMessageToApp(messageData)
      })
    },
    /**
     * 检查APP的版本情况
     * @param {*} param0 
     * @param {*} param1 
     * @returns 
     */
    getCheckAppUpdateVal: async function ({ commit, state }, { messageAct, isUpdate }) {
      //如果不需要更新，则直接拿缓存的
      if (state && !commonUtils.utilCore.empty(state.checkAppUpdateVal) && !isUpdate) {
        return state.checkAppUpdateVal
      }
      return new Promise((resolve, reject) => {
        messageAct.messageProtocols.push({
          "getAppUpdateValAPP": (msg) => {
            if (!commonUtils.utilCore.empty(msg)) {
              commit('setCheckAppUpdateVal', msg)
              resolve(msg)
            } else {
              resolve(msg)
            }
          }
        })
        let messageData = {
          act: "getAppUpdateValAPP",
          isAsync: true,
          msg: "获取APP的版本情况"
        }
        messageAct.sendMessageToApp(messageData)
      })
    },
    /**
     * 执行APP各模块的函数
     * @param {Object} context
     * @param {Object} jsonData=>{"mod":"模块名","fun":"要执行的函数","val":"函数的参数"}
     */
    actModFun: async function (context, { messageAct, jsonData }) {
      return new Promise((resolve, reject) => {
        messageAct.messageProtocols.push({
          "actStoreModAPP": (msg) => {
            if (!commonUtils.utilCore.empty(msg)) {
              resolve(msg)
            } else {
              resolve(msg)
            }
          }
        })
        let messageData = {
          act: "actStoreModAPP",
          stateData: jsonData,
          isAsync: true,
          msg: "执行APP各模块的函数"
        }
        messageAct.sendMessageToApp(messageData)
      })
    },

  }
}

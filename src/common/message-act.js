/**
 * 处理与APP之间的消息通讯
 */

import commonUtils from '@/common/utils/index.js'

const messageAct = {

  // 处理消息的协议
  messageProtocols: [],

  imMessageHandler: null, // 聊天模块处理回调的方法

  setImMessageHandler (func = null) { // 设置聊天的方法
    messageAct.imMessageHandler = func
  },

  /**
   * 获取消息回调
   * @param {*} act =>要查找的操作
   */
  getMessageProtocol (act) {
    for (var i = 0; i < messageAct.messageProtocols.length; i++) {
      if (!commonUtils.utilCore.empty(messageAct.messageProtocols[i][act])) {
        let proto = messageAct.messageProtocols.splice(i, 1);
        return proto[0]
      }
    }
    return ""
  },
  /**
   * 处理APP发过来的消息
   * @param {Object} msg=》{act:要执行的协议,data:数据,isAsync:是否同步执行(默认不是)}
   * @param {Object} isH5=》是否H5方式的调用
   */
  getAppMessage (msg, isH5) {
    try {
      // 如果是聊天的，交给聊天的方法处理
      if (msg.data.channel === 'im') { // 聊天的交给聊天处理
        if (messageAct.imMessageHandler) {
          return messageAct.imMessageHandler(msg)
        }
        return false
      };
    } catch (e) { }

    // commonUtils.appLog.log('【H5】【H5】【H5】【H5】','接收到APP的消息-------->||'+JSON.stringify(msg)+"|"+isH5)
    // 如果是H5的消息监听
    if (isH5 != 'undefined' && isH5) {
      msg = msg.data
    }

    commonUtils.appLog.log('【H5】【H5】【H5】【H5】', '接收到APP的消息=========>||', messageAct.messageProtocols.length, JSON.stringify(msg))
    if (typeof (msg) === 'object' && !commonUtils.utilCore.empty(msg.act)) {

      // commonUtils.appLog.log(messageAct.messageProtocols.length)
      //查找对应的协议
      let proto = messageAct.getMessageProtocol(msg.act)
      // commonUtils.appLog.log(proto)
      if (!commonUtils.utilCore.empty(proto) && proto[msg.act]) {

        // commonUtils.appLog.log('【H5】【H5】【H5】【H5】','执行了回调处理=>'+msg.act)
        proto[msg.act](msg.msg)

      } else {
        // commonUtils.appLog.log(msg.act)
        commonUtils.appLog.log('【H5】【H5】【H5】【H5】', '没有可执行的回调=>', messageAct.messageProtocols.length, proto, JSON.stringify(msg))
        // commonUtils.appLog.log(messageAct.messageProtocols.length)
      }
    } else {
      commonUtils.appLog.log('【H5】【H5】【H5】【H5】', '回传的数据不正确=>' + JSON.stringify(msg))
    }
    // commonUtils.appLog.log('消息通知方式=>'+(isH5 ? 'H5' : 'APP')+JSON.stringify(msg))
  },

  uniAppJSBridgeReady () {
    return new Promise(resolve => {
      document.addEventListener('UniAppJSBridgeReady', () => {
        resolve()
      })
    })
  },
  /**
   * 发送消息给APP
   * @param {*} messageData
   */
  sendMessageToApp (messageData) {
    if (commonUtils.utilCore.empty(messageData)) {
      commonUtils.appLog.log('【H5】【H5】【H5】【H5】', "消息不能为空")
      return
    }
    if (commonUtils.utilCore.empty(messageData.act) || commonUtils.utilCore.empty(messageData.msg)) {
      commonUtils.appLog.log('【H5】【H5】【H5】【H5】', "消息格式不正确")
      return
    }
    //commonUtils.appLog.log(JSON.stringify(messageData))
    if (uni && uni.hasOwnProperty('postMessage')) {
      // commonUtils.appLog.log('【H5】【H5】【H5】【H5】', "马上执行了" + JSON.stringify(uni))
      uni.postMessage({
        data: messageData
      })
    } else {
      // commonUtils.appLog.log('【H5】【H5】【H5】【H5】', "等一会再执行！")
      this.uniAppJSBridgeReady().then(() => {
        uni.postMessage({
          data: messageData
        })
      })
    }
  },
  /**
   * 初始化监听
   */
  setInit (tmpAct) {
    //不要重复监听消息
    if (window && typeof (window.isSetEventMessage) == "undefined" && !window.isSetEventMessage) {
      // commonUtils.appLog.log('【H5】【H5】【H5】【H5】', "初始化APP与H5间的消息通讯", window.isSetEventMessage)

      window.isSetEventMessage = true
      // 如果主调是H5的页面，则需要监听H5的消息通知
      window.addEventListener('message', function (event) {
        // commonUtils.appLog.log('【H5】【H5】【H5】【H5】回调有了=========》》》》》》', event.data)

        if (typeof (event.data) === 'string') { // 执行js
          try {
            eval(event.data)
          } catch (e) {
            commonUtils.appLog.log('【H5】【H5】【H5】【H5】回调有出错哦====>', event.data)
          }
        } else {
          // 此处执行事件
          tmpAct.getAppMessage(event, true)
        }
      }, false);

      // 如果主调是APP的页面，则需要把函数曝露给window让APP主动调用，以把消息从APP传过来
      window.getAppMessage = tmpAct.getAppMessage;

    }
  }
}

export default messageAct

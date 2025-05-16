import TIM from 'tim-js-sdk/tim-js-friendship.js';
import config from '@/common/configs/index'
import store from '@/store/index.js'

let options = {
  SDKAppID: config.timAppId // 接入时需要将 0 替换为您的云通信应用的 SDKAppID，类型为 Number
};
let tim;

function install (Vue) {

  /**
 * ┏────────────────────────────────────────────────────────────────────────────────────────────────┓
 * ┠                                                                                                ┫
 * ┠       由于SDK大部分方法都要等待ready之后才能用  所有不得不代理所有方法  加入等待ready的判断          ┫
 * ┠                                                                                                ┫
 * ┗────────────────────────────────────────────────────────────────────────────────────────────────┛
 */
  // 
  const extendTim = {

    // 新增一些变量，比如记录sdk状态码
    sdk_ready: false, // 当前sdk状态
    readyCallback: [], // sdk ready之后，是否需要回调一些特殊的函数
    unReadyCallback: [], // 同readyCallback
    netStatus: 'none', // ok：网络ok， connecting： 网络连接中， none： 无网络
    listeners: {}, // 一堆自定义的监听函数
    status: 'none', // sdk状态机，none： 还没初始化；initing： 初始化中；inited: 初始化完成；ready： 就绪，即已登录了。 每个状态只能从上一个状态改变到下一个状态，当sdk unready触发时，恢复none状态

    /**
     * 等待tim初始化，如果10秒内无法初始化完成，则会返回失败提示，不然页面会一直loading
     */
    async waitForReady () {
      return Promise.race([new Promise((resolve, reject) => {
        if (extendTim.sdk_ready) {
          resolve()
        }

        extendTim.readyCallback.push(resolve);
        extendTim.unReadyCallback.push(reject);
      }), new Promise((resolve, reject) => {
        setTimeout(() => reject({ message: '聊天网络超时，请稍后再试.' }), 30000)
      })])
    },

    // 初始化方法，该方法包含了登录，还有等待sdk 初始化
    async init (userID) {
      if (extendTim.sdk_ready || extendTim.status === 'initing') return true; // 初始化中和初始化完成，直接返回
      if (!userID) throw new Error('userID undefined.')
      // 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
      tim = TIM.create(options); // SDK 实例通常用 tim 表示
      // 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
      tim.setLogLevel(process.env.NODE_ENV === 'production' ? 1 : 0); // 0: 普通级别，日志量较多，开发用， 1：release级别，仅输出关键信息，生产环境用
      setCb(tim)

      if (extendTim.status === 'none') extendTim.status = 'initing'
      await store.dispatch('user/mpLogin')
      let userSig = await store.dispatch('im/getSig')
      await tim.login({ userID, userSig })
      if (!extendTim.sdk_ready) {
        await extendTim.waitForReady()
      }
      if (extendTim.status === 'initing') extendTim.status = 'inited'
    },

    // 拦截所有请求
    async proxy (obj) {
      if (!obj) return true
      let { func, args } = obj
      if (!extendTim.sdk_ready) {
        await extendTim.waitForReady()
      }
      return await tim[func](...args)
    },

    // 监听
    addEventListener (name, func) {
      extendTim.listeners[name] = func
    },

    // 移除监听
    removeEventListener (name) {
      if (extendTim.listeners[name]) extendTim.listeners[name] = null
    },


    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv    以下是tim的一些回调函数    vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

    // 收到离线消息和会话列表同步完毕 之后，SDK才算ready，在此之前不能调用任何需要登录的接口，坑爹！！！
    ready (event) {
      if (event && event.name === TIM.EVENT.SDK_READY) { // 坑死了。。。居然还有可能回调的时候，name为空，以后不要相信腾讯
        extendTim.sdk_ready = true
        while (extendTim.readyCallback.length) { // 多线程编程的坑，接手的人一定要先沟通一下，否则可能出现奇奇怪怪的问题
          let cb = extendTim.readyCallback.shift()
          cb()
        }

        if (extendTim.status === 'inited') extendTim.status = 'ready'
      }
    },

    // 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
    // event.name - TIM.EVENT.SDK_NOT_READY
    block (data) {
      extendTim.sdk_ready = false
      while (extendTim.unReadyCallback.length) {
        let cb = extendTim.unReadyCallback.shift()
        cb()
      }

      extendTim.status = 'none'
    },

    // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event 获取消息列表数据并渲染到页面
    // event.name - TIM.EVENT.MESSAGE_RECEIVED
    // event.data - 存储 Message 对象的数组 - [Message]
    message_received (event) {
      let message = event.data.filter(msg => {
        if (msg.from.startsWith('s_')) { // 系统消息有固定的方法处理
          if (extendTim.listeners.system_message_received) {
            extendTim.listeners.system_message_received(msg); // 如果设置了回调，就用回调， 否则用默认
          } else {
            store.dispatch('im/dealSystemMessage', msg);
          }
        } else {
          return msg
        }
      })
      if (extendTim.listeners.message_received) extendTim.listeners.message_received(message);
    },

    // 收到消息被第三方回调修改的通知，消息发送方可通过遍历 event 获取消息列表数据并更新页面上同 ID 消息的内容（v2.12.1起支持）
    // event.name - TIM.EVENT.MESSAGE_MODIFIED
    // event.data - 存储被第三方回调修改过的 Message 对象的数组 - [Message]
    message_modified (event) {
      console.log('rrrrrr---message_modified', event)
      if (extendTim.listeners.message_modified) extendTim.listeners.message_modified(event.data)
    },

    // 收到消息被撤回的通知。使用前需要将SDK版本升级至v2.4.0或更高版本
    // event.name - TIM.EVENT.MESSAGE_REVOKED
    // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isRevoked 属性值为 true
    message_revoked (event) {
      console.log('rrrrrr---message_revoked', event)
      if (extendTim.listeners.message_revoked) extendTim.listeners.message_revoked(event.data)
    },

    // SDK 收到对端已读消息的通知，即已读回执。使用前需要将SDK版本升级至v2.7.0或更高版本。仅支持单聊会话
    // event.name - TIM.EVENT.MESSAGE_READ_BY_PEER
    // event.data - event - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isPeerRead 属性值为 true
    message_read_by_peer (event) {
      console.log('rrrrrr---message_read_by_peer', event)
      if (extendTim.listeners.message_read_by_peer) extendTim.listeners.message_read_by_peer(event.data)
    },


    // 收到会话列表更新通知，可通过遍历 event 获取会话列表数据并渲染到页面
    // event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
    // event.data - 存储 Conversation 对象的数组 - [Conversation]
    conversation_list_updated (event) {
      // console.log('rrrrrr---conversation_list_updated', event)
      if (extendTim.listeners.conversation_list_updated) extendTim.listeners.conversation_list_updated(event.data)
    },



    // 收到群组列表更新通知，可通过遍历 event 获取群组列表数据并渲染到页面
    // event.name - TIM.EVENT.GROUP_LIST_UPDATED
    // event.data - 存储 Group 对象的数组 - [Group]
    group_list_updated (event) {
      // console.log('rrrrrr---group_list_updated', event)
      if (extendTim.listeners.group_list_updated) extendTim.listeners.group_list_updated(event.data)
    },

    // 收到自己或好友的资料变更通知
    // event.name - TIM.EVENT.PROFILE_UPDATED
    // event.data - 存储 Profile 对象的数组 - [Profile]
    profile_updated (event) {
      console.log('rrrrrr---profile_updated', event)
      if (extendTim.listeners.profile_updated) extendTim.listeners.profile_updated(event.data)
    },

    // 收到黑名单列表更新通知
    // event.name - TIM.EVENT.BLACKLIST_UPDATED
    // event.data - 存储 userID 的数组 - [userID]
    blacklist_updated (event) {
      console.log('rrrrrr---blacklist_updated', event)
      if (extendTim.listeners.blacklist_updated) extendTim.listeners.blacklist_updated(event.data)
    },

    // 收到 SDK 发生错误通知，可以获取错误码和错误信息
    // event.name - TIM.EVENT.ERROR
    // event.code - 错误码
    // event.message - 错误信息
    error (event) {
      console.log('rrrrrr---error', event)
      if (extendTim.listeners.error) extendTim.listeners.error(event.message)
    },


    // 收到被踢下线通知
    // event.name - TIM.EVENT.KICKED_OUT
    // event.type - 被踢下线的原因，例如 :
    //   - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
    //   - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
    //   - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢（v2.4.0起支持）。
    kicked_out (event) {
      console.log('rrrrrr---kicked_out', event)
      if (extendTim.listeners.kicked_out) extendTim.listeners.kicked_out(event.type)
    },

    // 网络状态发生改变（v2.5.0 起支持）
    // event.name - TIM.EVENT.NET_STATE_CHANGE
    // event.state 当前网络状态，枚举值及说明如下：
    //   - TIM.TYPES.NET_STATE_CONNECTED - 已接入网络
    //   - TIM.TYPES.NET_STATE_CONNECTING - 连接中。很可能遇到网络抖动，SDK 在重试。接入侧可根据此状态提示“当前网络不稳定”或“连接中”
    //   - TIM.TYPES.NET_STATE_DISCONNECTED - 未接入网络。接入侧可根据此状态提示“当前网络不可用”。SDK 仍会继续重试，若用户网络恢复，SDK 会自动同步消息
    net_state_change (event) {
      console.log('rrrrrr---net_state_change', event)
      extendTim.netStatus = event.state
      if (extendTim.listeners.net_state_change) extendTim.listeners.net_state_change(event.state)
    },

    // 收到好友列表更新通知（v2.13.0起支持）
    // event.name - TIM.EVENT.FRIEND_LIST_UPDATED
    // event - 存储 Friend 对象的数组 - [Friend]
    friend_list_updated (event) {
      console.log('rrrrrr---friend_list_updated', event)
      if (extendTim.listeners.friend_list_updated) extendTim.listeners.friend_list_updated(event.data)
    },

    // 收到好友申请列表更新通知（v2.13.0起支持）
    // event.name - TIM.EVENT.FRIEND_APPLICATION_LIST_UPDATED
    // friendApplicationList - 好友申请列表 - [FriendApplication]
    // unreadCount - 好友申请的未读数
    // const { friendApplicationList, unreadCount } = event;
    // 发送给我的好友申请（即别人申请加我为好友）
    // const applicationSentToMe = friendApplicationList.filter((friendApplication) => friendApplication.type === TIM.TYPES.SNS_APPLICATION_SENT_TO_ME);
    // 我发送出去的好友申请（即我申请加别人为好友）
    // const applicationSentByMe = friendApplicationList.filter((friendApplication) => friendApplication.type === TIM.TYPES.SNS_APPLICATION_SENT_BY_ME);
    friend_application_list_updated (event) {
      console.log('rrrrrr---friend_application_list_updated', event)
      if (extendTim.listeners.friend_application_list_updated) extendTim.listeners.friend_application_list_updated(event.data)
    },

    // 收到好友分组列表更新通知（v2.13.0起支持）
    // event.name - TIM.EVENT.FRIEND_GROUP_LIST_UPDATED
    // event - 存储 FriendGroup 对象的数组 - [FriendGroup]
    friend_group_list_updated (event) {
      console.log('rrrrrr---friend_group_list_updated', event)
      if (extendTim.listeners.friend_group_list_updated) extendTim.listeners.friend_group_list_updated(event.data)
    },

    // 长时间断网后重新接入网络或者小程序长时间切后台又切回前台，SDK 为了和 IM 服务器进行状态及消息同步，需要重载，此时 SDK 会自动登录。
    // 如果重载前加入了直播群（AVChatRoom），重载成功后 SDK 会重新加入直播群。
    //一般情况下接入侧不需要监听处理此事件，当接入侧想要拉回断网或者小程序切后台期间的消息时，可以监听处理此事件，并使用 getMessageList 接口主动拉取历史消息。
    sdk_reload (event) {

    }
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^    以上是tim的一些回调函数    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  }


  function setCb (tim) {
    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆     以下都是一些监听函数    ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
    tim.on(TIM.EVENT.SDK_READY, extendTim.ready);
    tim.on(TIM.EVENT.SDK_NOT_READY, extendTim.block);
    tim.on(TIM.EVENT.MESSAGE_RECEIVED, extendTim.message_received);
    tim.on(TIM.EVENT.MESSAGE_MODIFIED, extendTim.message_modified);
    tim.on(TIM.EVENT.MESSAGE_REVOKED, extendTim.message_revoked);
    tim.on(TIM.EVENT.MESSAGE_READ_BY_PEER, extendTim.message_read_by_peer);
    tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, extendTim.conversation_list_updated);
    tim.on(TIM.EVENT.GROUP_LIST_UPDATED, extendTim.group_list_updated);
    tim.on(TIM.EVENT.PROFILE_UPDATED, extendTim.profile_updated);
    tim.on(TIM.EVENT.BLACKLIST_UPDATED, extendTim.blacklist_updated);
    tim.on(TIM.EVENT.ERROR, extendTim.error);
    tim.on(TIM.EVENT.KICKED_OUT, extendTim.kicked_out);
    tim.on(TIM.EVENT.NET_STATE_CHANGE, extendTim.net_state_change);
    tim.on(TIM.EVENT.FRIEND_LIST_UPDATED, extendTim.friend_list_updated);
    tim.on(TIM.EVENT.FRIEND_APPLICATION_LIST_UPDATED, extendTim.friend_application_list_updated);
    tim.on(TIM.EVENT.FRIEND_GROUP_LIST_UPDATED, extendTim.friend_group_list_updated);
    tim.on(TIM.EVENT.SDK_RELOAD, extendTim.sdk_reload);
    // ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆     以上都是一些监听函数    ◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆◆
  }


  try {
    if (window.Proxy) {
      // proxy 的用法可以百度一下，或者看看vue的computed
      Vue.prototype.$tim = new Proxy(extendTim, {
        // 拦截获取属性
        get (obj, prop) {
          if (obj.hasOwnProperty(prop)) {
            return obj[prop]
          } else {
            if (tim && Object.prototype.hasOwnProperty.call(tim, prop)) {
              if (typeof tim[prop] === 'function') {
                return new Proxy(function () { }, {
                  apply (target, ctx, args) {
                    return Reflect.apply(extendTim.proxy, extendTim, [{ func: prop, args }])
                  }
                })
              } else {
                return tim[prop]
              }
            } else {
              return function () { }; // 需要返回一个空函数，否则会报错
            }
          }
        },
        // 拦截设置属性
        set (obj, prop, value) {
          if (obj.hasOwnProperty(prop)) {
            obj[prop] = value
          } else {
            tim[prop] = value
          }
          return true
        }
      })
    }
  } catch (e) { }
}


export default {
  install
}
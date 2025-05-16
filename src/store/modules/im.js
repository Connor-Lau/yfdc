import router from '@/router'
import commonProtocol from '@/common/protocols/index.js'
import utilCore from '@/common/utils/util-core'

const user = {
  namespaced: true,
  state: {
    houseInfo: null,
    unread: 0,
    unreadTimer: 0, // 定时器
    tabbarShow: true, // 是否显示导航栏 ，用于监听返回
    tximGoBack: '', // 返回到txim的哪个页面
  },
  mutations: {
    setUnread (state, unread) {
      // 20230208 统一处理，保证数据为整型
      unread = Number(unread || 0);
      state.unread = unread;
    },
    setHouseInfo (state, info) {
      state.houseInfo = info
    },
    setUnreadTimer (state, timer) {
      state.unreadTimer = timer
    },
    setTabbarShow (state, bool) {
      state.tabbarShow = bool
    },
    setTximGoBack (state, url) {
      state.tximGoBack = url
    },
  },
  actions: {
    // 设置房源消息
    setHouseInfo (context, info) {
      context.commit('setHouseInfo', info)
    },
    // 轮询未读数
    async getUnread (context) {
      // if (context.state.unreadTimer) {
      //   clearInterval(context.state.unreadTimer)
      //   context.commit('setUnreadTimer', 0);
      // } else {
      //   context.dispatch('_getUnread')
      //   let timer = setInterval(() => {
      //     context.dispatch('_getUnread')
      //   }, 10000);
      //   context.commit('setUnreadTimer', timer)
      // }
      await context.dispatch('_getUnread');
    },
    // 获取未读数
    async _getUnread (context) {
      try {
        let optionsRequest = {
          data: {
            user_type: context.rootState.user.userType || '1',
            user_id: context.rootState.user.userId,
          }
        }
        let res = await commonProtocol.request(commonProtocol.home.wechatNewImGetUnreadNum, optionsRequest)
        if (res && res.data && res.data.code && res.data.code == 200) {
          console.log("==========>>>消息未读数--->>" + JSON.stringify(res.data.data))
          let num = res.data.data.unread_num; // 未读数
          context.commit('setUnread', num);
          return num
        } else if (res.data.code == 302) { // 令牌无效，暂停轮询, 否则会一直报错
          // if (context.state.unreadTimer) {
          //   clearInterval(context.state.unreadTimer)
          // }
          // context.commit('setUnreadTimer', 0)
        }
      } catch (e) {
        console.log('消息未读数轮询出错: ', e)
      } finally {

      }
    },

    /**
   * 跳转对话页面
   * @param {*} to 对方的腾讯云uid，例如：b_54311 u_943
   * @param {*} houseInfo 需要带上的房源信息，参考消息相关文档说明，一般是二手房、新房、租房
   */
    async goChat (context, { to, houseInfo = null }) {
      // 由于坑爹的环境问题，可能uid格式是乱七八糟的，这里必须判断下
      utilCore.checkUid(to)
      context.commit('setHouseInfo', houseInfo);
      router.push({
        name: 'common-index', query: {
          url: '/im/chat/' + to,
          path: '/im/index',
        }
      });
    },

    /**
     * 跳转到房源分享页面
     * @param {*} houseInfo 房源信息,必填，否则分享个der
     */
    async goChatShare (context, houseInfo) {
      if (houseInfo) {
        context.commit('setHouseInfo', houseInfo);
        router.push({
          name: 'common-index', query: {
            url: '/im/yfdc/share',
            path: '/im/index'
          }
        });
      }
    },

    // 跳转聊天首页
    async goIm (context) {
      router.push({
        name: 'common-index', query: {
          url: '/im/index',
          path: '/im/index'
        }
      });
    },

    // 更新桌面未读数
    async setDeskBadge (context, {messageAct, num}) {
      let unread = parseInt(num);
      unread = isNaN(unread) ? 0 : unread;
      // 20230208： 设置消息未读数，以后有需求改变再改，目前需求，未读数 = 消息未读数，这里保证一致
      context.commit('setUnread', unread);

      let jsonData = { "mod": "app", "fun": "actSetDeskBadge", "val": unread }
      console.log('设置桌面角标数-=》: ' + JSON.stringify(jsonData))
      context.dispatch("app/actModFun", { messageAct: messageAct, jsonData: jsonData }, { root: true })
    }
  }
}
export default user

<template>
  <div class="page" :style="{height: tabbarShow ? 'calc(100vh - ' + tabbarHeight +'px )' : '100vh'}">
    <gni-nav-bar :isShowNav="false"></gni-nav-bar>
    <iframe v-if="imIndexUrl && !updating" :src="imIndexUrl" id="imIframe"></iframe>
    <gniTabbar v-if="tabbarShow && isPage" curP="/im/index" ref="tabbar"></gniTabbar>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import gniTabbar from "@/components/gni/gni-tabbar.vue";

export default {
  components: {
    gniNavBar,
    gniTabbar
  },
  props: {
    isUpDate: {
      type: Boolean,
      default: false
    },
    isPage: {
      type: Boolean,
      default: true
    },
    tabbarHeight: {
      type: [Number, String],
      default: 0,
    },
  },
  mounted () {
    this.init();
    this.$messageAct.setImMessageHandler(this.onPostMessage.bind(this))
  },
  data () {
    return {
      tabbarShow: true,
      updating: false, // 是否更新中
      imIndexUrl: '', // 聊天url
    }
  },
  computed: {
    ...mapState('user', ['userUid', 'userToken', 'userInfo', 'isLogin']),
    ...mapState('im', ['houseInfo', 'tximGoBack']),
  },

  watch: {
    '$route.query.url' (v) {
      this.getUrl()
    }
  },

  methods: {
    ...mapMutations('im', ['setHouseInfo', 'setUnread', 'setTabbarShow', 'setTximGoBack']),

    async init () {
      //如果用户没有登陆，则进行自动登陆
      if (this.$commonUtils.utilCore.empty(this.userToken)) {
        //判断一下用户登陆了没有
        let tmp_info = this.$store.dispatch('user/initLogin');
        //如果用户没有登陆，则清掉登陆相关的信息
        if (!tmp_info) {
          //如果数据为空，则清掉登陆的信息
          await this.$store.dispatch('user/actLoginOutApp');
          this.goLogin()
        }
      }

      this.getUrl();
    },
    // 获取聊天的baseURL
    baseUrl () {
      let md = new Date().valueOf();
      let env = localStorage.getItem('yfdc_txim_env');
      // 如果有指定的，用指定的环境
      if (env === 'test') {
        return `https://chat.yfdc.net/app/test/index.html?v=${md}#`
      } else if (env === 'prod') {
        return `https://chat.yfdc.net/app/prod/index.html?v=${md}#`
      }
      // 如果没有，就用配置的
      return this.$appConfig.appIMUrl
    },

    getUrl () {
      try {
        let base = '/im/index'
        if (this.$route.query.url) {
          base = this.$route.query.url;
          this.setTximGoBack('')
        } else {
          if (this.tximGoBack && this.tximGoBack.startsWith('/im/chat/')) {  // 从房源详情返回，且有记录 txim的goback url，则认为是从对话页面跳转详情，再返回
            let uid = (this.isLogin && this.userToken && this.userUid) ? this.userUid : 'noLogin';
            if (uid === 'noLogin') {
              return this.imIndexUrl = this.baseUrl() + '/im/index?userUid=' + uid + '&platform=yfdc';
            } else {
              return this.imIndexUrl = this.baseUrl() + this.tximGoBack + '?userUid=' + uid + '&platform=yfdc&back=im-index';
            }
          } else {
            this.setTximGoBack('')
          }
        }
        let uid = (this.isLogin && this.userToken && this.userUid) ? this.userUid : 'noLogin';
        this.imIndexUrl = this.baseUrl() + base + '?userUid=' + uid + '&platform=yfdc';
      } catch (e) {
        this.imIndexUrl = this.baseUrl() + '/im/index?userUid=noLogin&platform=yfdc'
      }
    },
    async changeEnv (env) {
      this.updating = true;
      if (env) {
        localStorage.setItem('yfdc_txim_env', env);
      } else {
        localStorage.removeItem('yfdc_txim_env');
      }
      await this.$commonUtils.utilCore.sleep(10);
      this.getUrl();
      this.updating = false;
    },

    // 控制下方tabbar是否显示
    showTabbar (show = false) {
      this.tabbarShow = show
      this.setTabbarShow(this.tabbarShow);
      this.$emit("handleTabbarShow", this.tabbarShow); // views/common/index.vue 里将 该页面 作为组件里用到
    },

    // 更新未读数
    async updateUnread (num) {
      this.setUnread(num);
      this.$refs.tabbar && this.$refs.tabbar.setUnreadNum(1, num);
      this.$emit("setUnreadNum", num); // views/common/index.vue 里将 该页面 作为组件里用到

      // 更新桌面角标
      await this.$store.dispatch('im/setDeskBadge',{messageAct: this.$messageAct, num});
    },

    // 被动接收消息
    async onPostMessage (event) {
      if (!event.data) return;
      try {
        /**
         * func: 调用方法名
         * arg: 参数
         * type: 类型，call | send | callback 三种
         * callback: 回调方法名
         * channel: 通道名，聊天固定是 im
         */
        let { func, arg, type, callback, channel } = event.data;
        if (channel !== 'im') return false;
        if (type === 'callback') { // 回调
          this.handlecallback(func, arg)
        } else if (type === 'call') { // 需要返回
          let result = await this[func](arg);
          return this.postMessage(callback, result, 'callback'); // 回调时，调用传的callback就是回调的方法名，type为callback
        } else if (type === 'send') { // 不需要返回
          this[func](arg);
        }
      } catch (e) {
        console.log('jjjjjjjjeeee---: ', event.data);
      }
    },

    // 处理rpc回调
    handlecallback (func, arg) {
      // 暂时没有父级iframe需要从子iframe获取数据的情况，有再处理
    },

    // 主动发送消息
    postMessage (func, arg = {}, type = 'send', callback = '') {
      document.getElementById("imIframe").contentWindow.postMessage({
        func,
        arg,
        type, // 这里可能是send，也可能是callback，call的需求暂时没有
        callback,
        channel: 'im',
      }, '*')
    },

    // 跳转登录页
    goLogin () {
      this.$emit("goLogin");
      // this.$router.push({ path: '/common/index', query: { fromCommission: true, pageName: 'msg', path: '/user/index' } }); // 20220830需求：点击登录优先跳转一键登录页面
    },

    // 跳转其他页面
    jump (path = '') {
      if (!path) {
        path = '/common/index'; // 默认去首页
      }
      this.$router.push({ path })
    },

    // 获取房源信息
    getHouseInfo () {
      if (this.houseInfo) {
        let data = JSON.parse(JSON.stringify(this.houseInfo));
        this.setHouseInfo(null);
        return data
      }
    },

    // 跳转房源详情
    goHouseDetail (houseInfo) {
      // 记录从那个地方跳转出去，goback的时候需要用到这里
      if (houseInfo.gobackurl && houseInfo.gobackurl.startsWith('/im/chat/')) { // 从对话页面，其他情况根据需要再加
        this.setTximGoBack(houseInfo.gobackurl);
      } else {
        this.setTximGoBack('');
      }
      if (houseInfo.shouse_id) { // 二手房
        let tmp_query = {
          id: houseInfo.shouse_id,//	是	string	二手房id
          broker_id: houseInfo.broker_id || 0,//	否	string	经纪人id： 当前聊天的经纪人id
          share_broker_id: houseInfo.share_broker_id//	否	string	分享者经纪人id： 房源消息中自带的分享id
        }
        this.toolsGoPageView({
          path: '/home/detail/secondhouseDetail',
          query: tmp_query
        })
      } else if (houseInfo.rent_id) { // 租房
        let tmp_query = {
          id: houseInfo.rent_id,//	是	string	租房id
          broker_id: houseInfo.broker_id || 0,//	否	string	经纪人id
          share_broker_id: houseInfo.share_broker_id || ''//	否	string	分享者经纪人id
        }
        this.toolsGoPageView({
          path: '/home/detail/renthouseDetail',
          query: tmp_query
        })
      } else if (houseInfo.houseId) { // erp房源
        this.$toast.fail('此房源暂不能查看！')
      } else if (houseInfo.loupan_id) { // 新房
        let tmp_query = {
          loupan_id: houseInfo.loupan_id
        }
        this.toolsGoPageView({
          path: '/home/detail/newhouseDetail',
          query: tmp_query
        })
      }
    },

    // 跳转查成交【二手房】
    goCheckDeal (houseInfo) {
      // 记录从那个地方跳转出去，goback的时候需要用到这里
      if (houseInfo.gobackurl && houseInfo.gobackurl.startsWith('/im/chat/')) { // 从对话页面，其他情况根据需要再加
        this.setTximGoBack(houseInfo.gobackurl);
      } else {
        this.setTximGoBack('');
      }
      let tmp_query = {
        shouse_trade_id: houseInfo.shouse_id,//	是	string	二手房id
        broker_id: houseInfo.broker_id || 0,//	否	string	经纪人id： 当前聊天的经纪人id
        share_broker_id: houseInfo.share_broker_id, //	否	string	分享者经纪人id： 房源消息中自带的分享id
        city_id: houseInfo.city_id || '', // 城市id
      }
      this.toolsGoPageView({
        path: '/home/detail/dealSaleDetail',
        query: tmp_query
      })
    },

    // 跳转查成交【租房】
    goCheckDealRent (houseInfo) {
      // 记录从那个地方跳转出去，goback的时候需要用到这里
      if (houseInfo.gobackurl && houseInfo.gobackurl.startsWith('/im/chat/')) { // 从对话页面，其他情况根据需要再加
        this.setTximGoBack(houseInfo.gobackurl);
      } else {
        this.setTximGoBack('');
      }
      let tmp_query = {
        rent_trade_id: houseInfo.rent_id,//	是	string	二手房id
        broker_id: houseInfo.broker_id || 0,//	否	string	经纪人id： 当前聊天的经纪人id
        share_broker_id: houseInfo.share_broker_id, //	否	string	分享者经纪人id： 房源消息中自带的分享id
        city_id: houseInfo.city_id || '', // 城市id
      }
      this.toolsGoPageView({
        path: '/home/detail/dealRentDetail',
        query: tmp_query
      })
    },
  },
  activated () {
    console.log('ddddddd  activated  activated  activated', this.imIndexUrl)
    console.log('ddddddd  activated2  activated2  activated2', this.$route)
    if (this.tximGoBack) {
      this.getUrl()
    } else {
      this.setTximGoBack('')
    }
  },
  beforeMount () {
    console.log('ddddddd  beforeMount  beforeMount  beforeMount', this.imIndexUrl)
    console.log('ddddddd  beforeMount2  beforeMount2  beforeMount2', this.$route)
  },
  beforeDestroy () {
    this.$messageAct.setImMessageHandler()
  },
}
</script>
<style scoped>
.page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
iframe {
  flex: 1;
  border: 0;
  box-shadow: none;
}
</style>>


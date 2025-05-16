<template>
  <div style="min-height: 100vh;">
    <!-- <gni-nav-bar :pageTitle="headTitle" @onClickLeft="onClickBack" :hideRight="false"></gni-nav-bar>
    <div>
      这是首页<br>
      <div @click="toolsGoPageView({path:'/login/index'})">去登陆</div><br><br>
      <div @click="toolsGoPageView({path:'/common/login'})">去一键登陆</div>
      <div>
        <br><br><br>
        {{thisDateTime|filterDateTimeDate}}

      </div>
    </div>
    <div @click="toolsGoPageView({path:'/tools/test'})">去测试页</div> -->
    <homeIndex v-show="curPage === '/home/index'" :isUpDate="isUpDate" :isPage="false" :tabbarHeight="tabbarHeight" @goLogin="actLogin"></homeIndex>
    <!-- 聊天是 iframe， v-show 可能会导致样式错乱， 所以v-if -->
    <imIndex v-if="curPage === '/im/index'" :isUpDate="isUpDate" :isPage="false" :tabbarHeight="tabbarHeight" @goLogin="actLogin"></imIndex>
    <userIndex v-show="curPage === '/user/index'" :isUpDate="isUpDate" :isPage="false" :tabbarHeight="tabbarHeight"></userIndex>
    <gniTabbar :curP="curPage" :isPush="false" ref="tabbar" @changePage="handleChange" v-show="tabbarShow" :tabCss="curPage === '/user/index' ? 'background: #f5f5f5;' : ''"></gniTabbar>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import homeIndex from "../home/index.vue";
import imIndex from "../im/index.vue";
import userIndex from "../user/index.vue";
import gniTabbar from "@/components/gni/gni-tabbar.vue";

export default {
  components: {
    gniNavBar,
    homeIndex,
    imIndex,
    userIndex,
    gniTabbar,
  },
  data () {
    return {
      // headTitle: "首页",
      // thisDateTime: "2022-03-14 16:31:50",
      curPage: "/home/index",
      isUpDate: false,//是否驱动内部组件更新
      tabbarHeight: 0,
      isTabCity: false,
      isBcak: false,
    }
  },
  computed: {
    ...mapState('im', ['houseInfo', 'tabbarShow']),
    ...mapState('common', ['indexPage', 'testConfigValue']),
    ...mapState("user", ['userUid', "userToken", "userInfo", "isLogin"]),
    ...mapState("city", ["geoPosition", "thisCityInfo", "switchCityInfo", "cityInfoRows"]), //城市的信息
  },
  watch: {
    isLogin (val) {
      // 登录成功后 再次获取新数据
      if (val && this.isBcak) {
        this.isUpDate = true;
        setTimeout(() => {
          this.isUpDate = false;
        })
      }
    },
    switchCityInfo: {
      handler () {
        this.isTabCity = true;
      },
      deep: true,
      immediate: false,
    }
  },
  // 兼容电脑端反复跳登录页
  beforeRouteEnter (to, from, next) {
    if (to.query.fromCommission && (from.meta.title == '首页' || from.path == '/home/detail/secondhouseDetail' || from.path == '/home/detail/renthouseDetail' || from.path == '/home/detail/newhouseDetail' || from.path == '/home/detail/housevillage' || from.path == '/home/list/secondhouseList' || from.path == '/home/list/renthouseList' || from.path == '/home/list/newhouseList' || from.path == '/home/map/newmap' || to.query.pageName == 'msg' || to.query.pageName == 'error') && location._fromCommission == 1) {
      location._fromCommission = 0;
      next(e => {
        e.actLogin()
      })
    }
    next()
  },
  mounted () {
    this.initPage();
  },
  activated () {
    this.setTabbarShow(true);
    if (this.isTabCity && this.isBcak) {
      this.setUpDateData();
    }
    // 第一次进来时，要延时一下
    if (!this.isBcak) {
      setTimeout(async () => {
        if (this.switchCityInfo == "") {
          await this.initPosition();
        }
        if ((this.isTabCity && this.isBcak) || (this.switchCityInfo && this.isBcak)) {
          this.setUpDateData();
        }
      }, 500);
    }
    this.initPage();
    setTimeout(() => {
      this.tabbarHeight = this.$refs.tabbar.getTabbarHeight();
    })
    this.isBcak = true;
  },
  methods: {
    ...mapMutations('im', ['setTabbarShow']),
    ...mapMutations('common', ['setIndexPage', 'setTestConfigValue', 'setTestConfigValueSYS']),
    initPage () {

      //判断一下目前的环境选择
      let tmp_info = this.$commonCaches.getKeyCache("TestConfigValueSYS", "");
      console.log("============加载测试环境======》》》》》", tmp_info)

      if (!this.$commonUtils.utilCore.empty(tmp_info)) {
        tmp_info = JSON.parse(tmp_info)
        this.setTestConfigValue(tmp_info.TestConfig.val.testConfigValue)
        this.setTestConfigValueSYS(tmp_info.TestConfig.val)
      }
      /*else{
        this.setTestConfigValueSYS({testConfigID:1,testConfigValue:"没有选择",appDebug: true,appEnv:"development"})
        this.setTestConfigValue("没有选择")
      }*/

      // 处理聊天通过聊天首页跳转聊天详情
      if (this.$route.query.path === "/im/index" && this.$route.query.url) {
        this.curPage = this.$route.query.path;
        return
      }
      if (this.indexPage) {
        this.curPage = this.indexPage;
        return
      };
      this.curPage = this.$route.query.path || this.$route.query.page || "/home/index";
      this.setIndexPage(this.curPage);
    },
    //获取用户当前地址
    async initPosition () {
      await this.$store.dispatch('city/getGeoPosition', { messageAct: this.$messageAct, isUpdate: false });
      //当前时间
      let thisTime = this.$commonUtils.utilDate.time();
      //判断一下城市的缓存时间过期了没有,如果过期了需要重新获取
      if (this.$commonUtils.utilCore.empty(this.geoPosition.createTime) || this.geoPosition.createTime < thisTime - 86164) {
        await this.$store.dispatch('city/getGeoPosition', { messageAct: this.$messageAct, isUpdate: true });
      }
      //判断一下记录的城市是否有值，获取的定位城市与记录的城市是否同一个
      if (
        this.$commonUtils.utilCore.empty(this.thisCityInfo.city_info)
        || this.$commonUtils.utilCore.empty(this.thisCityInfo.city_name)
        || this.thisCityInfo.city_name != this.geoPosition.cityName.replace("市", "")
      ) {
        //去获取城市名称对应的城市Id
        if (!this.$commonUtils.utilCore.empty(this.geoPosition)) {
          let postData = {
            site_name: this.geoPosition.cityName.replace("市", "")
          }
          let res = await this.$store.dispatch('city/getAppFangBaseDataGetCityRows', { messageAct: this.$messageAct, postData: postData });
          //如果有搜索到对应的城市
          if (!this.$commonUtils.utilCore.empty(res)) {
            this.$store.commit('city/setThisCityInfo', res)
            await this.$store.dispatch('app/setAppStateData', { messageAct: this.$messageAct, jsonData: [{ "mod": "city", "fun": "setThisCityInfo", "val": res }] }, { root: true });
          }
        }
      }
      //如果执行到这里还是没有城市的数据，则获取城市位置出错了
      if (this.$commonUtils.utilCore.empty(this.thisCityInfo.city_info)) {
        this.$commonUtils.utilCore.showToast("请开启定位")
        this.setUpDateData()
      }
    },
    // 设置更新数据状态
    setUpDateData () {
      this.isTabCity = false;
      this.isUpDate = true;
      setTimeout(() => {
        this.isUpDate = false;
      })
    },
    handleChange (obj) {
      this.curPage = obj.pagePath;
      this.setIndexPage(this.curPage);//用Vuex存储代替 replace跳转
      // 防止 聊天 切换首页 导航 未登录点击楼盘详情返回 导致 还是选中聊天
      if (this.$route.query.path === "/im/index" && this.$route.query.url) {
        this.toolsGoPageView({ path: '/common/index', query: { path: obj.pagePath } }, "replace")
      }
      setTimeout(() => {
        this.tabbarHeight = this.$refs.tabbar.getTabbarHeight();
      })
      // this.toolsGoPageView({ path: '/common/index', query: { path: obj.pagePath } }, "replace")//暂不用一直跳转方法
    },
    setUnreadNum (num) {
      this.$refs.tabbar.setUnreadNum(1, (num || 0));
    },
    /**
     * 本机一键登录
     */
    async actLogin () {
      if (!this.$commonUtils.utilCore.empty(this.userToken)) {
        // this.$commonUtils.utilCore.showToast("您已经登陆了")
        // return;
      }
      this.curPage = "/user/index";
      this.setIndexPage(this.curPage);
      this.$commonUtils.utilCore.showLoading("", { overlay: true });
      let tmp_time = 300;
      try {
        let tmp_info = await this.$store.dispatch('user/actLogin', this.$messageAct);
        this.$commonUtils.appLog.log("登陆结果返回", tmp_info)
        if (!tmp_info) {
          this.$commonUtils.appLog.log("要跳到微信登陆")
          // 如果没有一键登陆成功，则跳到微信登陆
          return this.toolsGoPageView({ path: '/login/wechatLogin' })

        } else if (tmp_info.authResult && tmp_info.appLoginFormType && tmp_info.appLoginFormType == 1) {//如果是一键登陆
          tmp_info = await this.$store.dispatch('user/getAppFangAuthloginByPhone', { messageAct: this.$messageAct, postData: tmp_info });
          if (tmp_info) {
            //如果登陆成功，
            return this.toolsGoPageView({ path: '/common/index', query: { path: '/user/index' } })
          } else {
            this.$commonUtils.utilCore.showToast("登录出错！")
          }
        } else if (!this.$commonUtils.utilCore.empty(tmp_info.provider)) {
          //如果需要进行其它的登陆方式则
          if (tmp_info.provider == "weixin") {//微信
            return this.toolsGoPageView({ path: '/login/wechatLogin' })
          } else if (tmp_info.provider == "appleLogin") {//苹果登陆
            this.$commonUtils.appLog.log("登陆的信息", tmp_info)
            return this.toolsGoPageView({ path: '/login/appleLogin' })
          } else if (tmp_info.provider == "telLogin") {//其它手机
            return this.toolsGoPageView({ path: '/login/otherPhone' })
          } else {//注册
            return this.toolsGoPageView({ path: '/login/register' })
          }
        } else {
          //如果点击 其他登录方式 则跳到微信登陆
          if (tmp_info && tmp_info.code && tmp_info.code == 30002) {
            return this.toolsGoPageView({ path: '/login/wechatLogin' })
          }
          //如果不是取消一键登陆的，则需要提示出错，并跳到微信登陆
          if (tmp_info && tmp_info.code && tmp_info.code != 30003) {
            //如果想一键登陆，但失败，则提示再跳转
            this.$commonUtils.utilCore.showToast(tmp_info.errMsg || "登录出错！")
            tmp_time = 3000;
            setTimeout(() => {
              this.toolsGoPageView({ path: '/login/wechatLogin' })
            }, 2000)
          }
        }
      } catch (err) {
        this.$commonUtils.appLog.log("登陆有出错信息", err)
      } finally {
        this.$commonUtils.utilCore.closeLoading(tmp_time)
      }
    },
    onClickBack () {
      this.$router.go(-1);
    }
  }
}
</script>
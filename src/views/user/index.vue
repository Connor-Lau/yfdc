<template>
  <div class="user">
    <div v-if="token" class="user-container">
      <gni-nav-bar :isShowNav="false"></gni-nav-bar>
      <div class="header">
        <div class="header-nav">
          <div class="img-share" @click="isShare=true">
            <img :src="$appConfig.appWebStaticUrl + '/user/icon_share.png'" alt="">
          </div>
          <div class="img-setting" @click="toolsGoPageView({path:'/user/setting'})">
            <img :src="$appConfig.appWebStaticUrl + '/user/icon_setting.png'" alt="">
          </div>
        </div>
        <div class="header-userdata">
          <img :src="user_avatar" alt="">
          <div class="userphone" @click="actLogin()" v-if="!isLogin">登录/注册</div>
          <div class="userphone" v-else>{{userInfo.user_row.extend.nickname}}</div>
        </div>
      </div>
      <div class="wrapper">
        <div class="diagram">
          <img :src="$appConfig.appWebStaticUrl + '/user/support_basemap01.png'" alt="" v-if="isSixnine">
          <img :src="$appConfig.appWebStaticUrl + '/user/support_basemap02.png'" alt="" v-else>
        </div>
        <div class="attention-container">
          <div class="title">我的关注</div>
          <div class="attention-options">
            <div class="attention-item" v-for="(item,index) in attention" :key="index" @click="goPageCheck(item.id)">
              <img :src="item.img" alt="">
              <div class="item-title">{{item.title}}</div>
            </div>
          </div>
        </div>
        <div class="attention-container">
          <div class="title">房源委托</div>
          <div class="attention-options">
            <div class="attention-item" v-for="(item,index) in commission" :key="index" @click="goCommission(item.id)">
              <img :src="item.img" alt="">
              <div class="item-title">{{item.title}}</div>
            </div>
          </div>
        </div>
        <div class="attention-container">
          <div class="title">我的交易</div>
          <div class="attention-options">
            <div class="attention-item" v-for="(item,index) in sign" :key="index" @click="goSign(item.id)">
              <img :src="item.img" alt="">
              <div class="item-title">{{item.title}}</div>
            </div>
          </div>
        </div>
        <div class="attention-container">
          <div class="title">房产工具</div>
          <div class="attention-options">
            <div class="attention-item" v-for="(item,index) in houseTools" :key="index" @click="index==0?toolsGoPageView({ path: '/tools/loanCalculate' }):''">
              <img :src="item.img" alt="">
              <div class="item-title">{{item.title}}</div>
            </div>
          </div>
        </div>
        <div class="attention-container">
          <div class="title">其它</div>
          <div class="attention-options">
            <div class="attention-item" v-for="(item,index) in otherOptions" :key="index" @click="goOther(item.id)">
              <img :src="item.img" alt="">
              <div class="item-title">{{item.title}}</div>
            </div>
          </div>
        </div>
        <div class="bannar-broker" @click="goOther('1')">
          <img :src="$appConfig.appWebStaticUrl + '/user/bannar_broker.png'" alt="">
        </div>
        <!-- 这是为了 选择测试环境 ---->
        <div v-if="aPPSYSAppEnv == 'development' && 1 > 2" class="attention-container">
          <div class="title">测试环境选择(<span style="color:red">目前还不能用！！！</span>)：
            <van-field
              readonly
              clickable
              label="选择环境"
              :value="testConfigValue"
              placeholder="选择环境"
              @click="TestConfigShowPicker = true" />
          </div>
          <div class="title">
            选择环境:{{testConfigValueSYS.testConfigValue}}<br>
            <!--
          appDebug:{{testConfigValueSYS.appDebug}}<br>
          appEnv:{{testConfigValueSYS.appEnv}}<br>
          appWebStaticUrl:{{testConfigValueSYS.appWebStaticUrl}}<br>
          h5WebStaticUrl:{{testConfigValueSYS.h5WebStaticUrl}}<br>
          appAdminApiUrl:{{testConfigValueSYS.appAdminApiUrl}}<br>
          -->
            appApiUrl:{{testConfigValueSYS.appApiUrl}}<br>
            h5WebUrl:{{testConfigValueSYS.h5WebUrl}}<br>
            <!---
          h5WebUrlYFJJ:{{testConfigValueSYS.h5WebUrlYFJJ}}<br>
          approvalH5WebUrl:{{testConfigValueSYS.approvalH5WebUrl}}
          -->
            <br><br>
          </div>
          <div class="title"></div>
        </div>

        <van-popup v-model="TestConfigShowPicker" round position="bottom">
          <van-picker
            show-toolbar
            :columns="TestConfigColumns"
            @cancel="TestConfigShowPicker = false"
            @confirm="onConfirmTest" />
        </van-popup>

        <!-- <div class="my-house">
          <div class="title">我的房子</div>
          <div class="subtitle">轻松在线委托 卖房、出租更省心</div>
          <div class="house-options">
            <img :src="$appConfig.appWebStaticUrl + '/user/banner01.png'" alt="">
            <img :src="$appConfig.appWebStaticUrl + '/user/banner02.png'" alt="">
          </div>
        </div> -->
      </div>
      <!-- <gniTabbar curP="/user/index" ref="tabbarView" v-if="isPage"></gniTabbar> -->
      <van-popup v-model="isShare" position="bottom" :round="true" teleport="body">
        <div class="share-pop">
          <div class="title">分享APP</div>
          <div class="content">
            <div class="wechat" @click="shareWeixin">
              <img :src="$appConfig.appWebStaticUrl + '/common/icon_wechat.png'" alt="">
              <span>微信</span>
            </div>
            <div class="wechat" @click="shareTimeLine">
              <img :src="$appConfig.appWebStaticUrl + '/common/icon_wechatmoments.png'" alt="">
              <span>朋友圈</span>
            </div>
          </div>
          <div class="cancel" @click="isShare=false">取消</div>
        </div>
      </van-popup>
    </div>
    <loginIndex v-else></loginIndex>
  </div>
</template>

<script>
import loginIndex from "@/views/login/index.vue";
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import gniTabbar from "@/components/gni/gni-tabbar.vue";

import { mapState, mapActions, mapMutations } from "vuex";

export default {
  components: {
    loginIndex,
    gniNavBar,
    gniTabbar,
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
  data () {
    return {
      token: true,
      tokens: true,
      isShare: false, // 分享弹窗
      attention: [
        {
          id: 0,
          img: this.$appConfig.appWebStaticUrl + '/user/icon_second_house.png',
          title: '二手房'
        },
        {
          id: 1,
          img: this.$appConfig.appWebStaticUrl + '/user/icon_rent ahouse.png',
          title: '租房'
        },
        {
          id: 2,
          img: this.$appConfig.appWebStaticUrl + '/user/icon_newhouse.png',
          title: '新房'
        },
        {
          id: 3,
          img: this.$appConfig.appWebStaticUrl + '/user/icon_neighbourhoods.png',
          title: '小区'
        }
      ],
      commission: [
        {
          id: 0,
          img: this.$appConfig.appWebStaticUrl + '/commission/icon_mycommission.png',
          title: '我的委托'
        },
        {
          id: 1,
          img: this.$appConfig.appWebStaticUrl + '/commission/icon_sellhouse.png',
          title: '我要卖房'
        },
        {
          id: 2,
          img: this.$appConfig.appWebStaticUrl + '/commission/iocn_key.png',
          title: '我要出租'
        }
      ],
      sign: [
        {
          id: 0,
          img: this.$appConfig.appWebStaticUrl + '/user/icon_onlinesign.png',
          title: '线上签约'
        },
      ],
      houseTools: [
        {
          id: 0,
          img: this.$appConfig.appWebStaticUrl + '/user/icon_mortgage_calc.png',
          title: '房贷计算'
        },
      ],
      otherOptions: [
        {
          id: 0,
          img: this.$appConfig.appWebStaticUrl + '/user/icon_setting_red.png',
          title: '设置'
        },
        {
          id: 1,
          img: this.$appConfig.appWebStaticUrl + '/user/icon_national_ broker.png',
          title: '全民经纪'
        },
      ],
      TestConfigShowPicker: false, //这是为选择测试环境
      TestConfigColumns: [//可以选择的环境
        {
          id: 1, text: "没有选择", val: {
            testConfigID: 1,
            testConfigValue: "没有选择",
            appDebug: true,
            appEnv: "development",//设置为测试环境
          }
        },
        {
          id: 2, text: "预发布", val: {
            testConfigID: 2,
            testConfigValue: "预发布",
            appDebug: true,
            appEnv: "development",//设置为测试环境
            appWebStaticUrl: 'https://appv2.yfdc.net:444/app2/static/',  //   APP应用的Web资源地址
            h5WebStaticUrl: 'https://appv2.yfdc.net:444/h5ht/static/',  //   H5页面Web资源地址
            appAdminApiUrl: 'https://m.yfdc.net/appv2/home/', //app 管理后台api接口地址
            appApiUrl: 'https://mtest.yfdc.net/',//数据接口地址
            h5WebUrl: 'https://appv2.yfdc.net:444/h5ht/#/', //  H5网站地址(新裕丰地产H5)
            h5WebUrlYFJJ: 'https://appv2.yfdc.net:444/h5h/#/', //  H5网站地址(裕丰经纪H5)
            approvalH5WebUrl: 'https://appv2.yfdc.net:444/approvalh5/#/', //  审批系统H5网站地址
            loginTokenKey: 'x59bAcdkKTjHx2UytTMvPJfOcpgXPoCL', // 登陆接口key
            newAppKey: 'app1',//裕丰地产改版区分接口应用
            appKey: 'quB2ljPhBoGl', // 用于区分客户端应用
            encryptKey: 'e35cf7b66449df565f93c607d5a81d09', // 数据解密key
            encryptIV: '456abcdMOBILE901',// 数据解密序号iv
            timAppId: 1400587388,//1400595013,// 腾讯云im APP id
          }
        },
        {
          id: 3, text: "正式服", val: {
            testConfigID: 3,
            testConfigValue: "正式服",
            appDebug: false,
            appEnv: "development",//设置为测试环境
            appWebStaticUrl: 'https://m.yfdc.net/appv2/appweb/static/',  //APP应用的Web资源地址
            h5WebStaticUrl: 'https://m.yfdc.net/appv2/web/static/',  //H5页面Web资源地址
            appAdminApiUrl: 'https://m.yfdc.net/appv2/home/', // app 管理后台api接口地址
            appApiUrl: 'https://m.yfdc.net/',//数据接口地址
            h5WebUrl: 'https://m.yfdc.net/appv2/web/#/', //  H5网站地址(新裕丰地产H5)
            h5WebUrlYFJJ: 'https://napp.yfdc.net/h5/#/',//  H5网站地址(裕丰经纪H5)
            approvalH5WebUrl: 'https://napp.yfdc.net/approvalh5/#/', //  审批系统H5网站地址
            loginTokenKey: 'x59bAcdkKTjHx2UytTMvPJfOcpgXPoCL', // 登陆接口key
            newAppKey: 'app1',//裕丰地产改版区分接口应用
            appKey: 'quB2ljPhBoGl', // 用于区分客户端应用
            encryptKey: 'e35cf7b66449df565f93c607d5a81d09', // 数据解密key
            encryptIV: '456abcdMOBILE901',// 数据解密序号iv
            timAppId: 1400587388,// 腾讯云im APP id
          }
        },
      ],
    }
  },
  computed: {
    ...mapState("user", ["userToken", "userInfo", "isLogin"]), //用户Token,用户登陆信息
    ...mapState("city", ["switchCityInfo", "thisCityInfo"]), //城市的信息
    ...mapState('common', ['testConfigValue', 'testConfigValueSYS', 'aPPSYSAppEnv']),//选择的测试环境
    user_avatar () {
      if (this.isLogin && this.userInfo && this.userInfo.user_row && this.userInfo.user_row.extend && this.userInfo.user_row.extend.avatar && this.userInfo.user_row.extend.avatar != "") {
        return this.userInfo.user_row.extend.avatar;
      } else {
        return this.$appConfig.appWebStaticUrl + '/user/user_head.png';
      }
    },
    isSixnine () {
      if (!this.$commonUtils.utilCore.empty(this.switchCityInfo)) {
        return this.switchCityInfo.is_69
      } else {
        return this.thisCityInfo.is_69
      }
    }
  },
  watch: {
    async isUpDate (val) {
      if (val) {
        await this.init();
      }
    }
  },
  async mounted () {
    //初始化登陆的状态
    await this.init();
    this.getHtmlPlus();
  },
  // 兼容电脑端反复跳登录页
  beforeRouteEnter (to, from, next) {
    console.log(to, from);
    if (to.query.fromCommission && (from.meta.title == '首页' || from.path == '/home/detail/secondhouseDetail' || from.path == '/home/detail/renthouseDetail' || from.path == '/home/detail/newhouseDetail' || from.path == '/home/detail/housevillage' || from.path == '/home/list/secondhouseList' || from.path == '/home/list/renthouseList' || from.path == '/home/list/newhouseList' || from.path == '/home/map/newmap' || to.query.pageName == 'msg' || to.query.pageName == 'error')) {
      next(e => {
        e.actLogin()
      })
    }
    next()
  },
  methods: {
    ...mapActions('app', ['getShareApp']),
    ...mapMutations('common', ['setTestConfigValue', 'setTestConfigValueSYS']),
    async init () {
      //如果用户没有登陆，则进行自动登陆
      if (this.$commonUtils.utilCore.empty(this.userToken) || !this.isLogin) {
        //判断一下用户登陆了没有
        let tmp_info = this.$store.dispatch('user/initLogin');
        //如果用户没有登陆，则清掉登陆相关的信息
        if (!tmp_info) {
          //如果数据为空，则清掉登陆的信息
          await this.$store.dispatch('user/actLoginOutApp');
        }
      }
    },
    /**
     * 本机一键登录
     */
    async actLogin () {
      if (!this.$commonUtils.utilCore.empty(this.userToken)) {
        // this.$commonUtils.utilCore.showToast("您已经登陆了")
        // return;
      }
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
    // 分享到微信
    async shareWeixin () {
      let jsonData = {
        provider: 'weixin',
        scene: 'WXSceneSession',
        type: 0,
        href: this.$appConfig.appH5PageUrl.replace('/#/', '/index.html#') + '/public/download/download',
        summary: "集买卖二手房新房，租赁商铺写字楼功能于一体的应用软件。",//描述语暂时不知写什么
        imageUrl: this.$appConfig.appWebStaticUrl + 'share_logo.png',
        title: '裕丰地产'
      }
      let systemInfo = await this.getShareApp({ messageAct: this.$messageAct, jsonData: jsonData })
      this.$commonUtils.appLog.log("分享结果的信息为：", JSON.stringify(systemInfo))
    },
    // 分享朋友圈
    async shareTimeLine () {
      let jsonData = {
        provider: "weixin",
        scene: "WXSenceTimeline",
        type: 0,
        href: this.$appConfig.appH5PageUrl.replace('/#/', '/index.html#') + '/public/download/download',
        summary: "集买卖二手房新房，租赁商铺写字楼功能于一体的应用软件。",//描述语暂时不知写什么
        imageUrl: this.$appConfig.appWebStaticUrl + 'share_logo.png',
        title: '裕丰地产'
      }
      let systemInfo = await this.getShareApp({ messageAct: this.$messageAct, jsonData: jsonData })
      this.$commonUtils.appLog.log("分享结果的信息为：", systemInfo)
    },
    goPageCheck (index) {
      //判断是否有登陆
      if (this.isLogin) {
        this.toolsGoPageView({ path: '/user/attentionlist', query: { typeIndex: index } })
      } else {
        // this.$commonUtils.utilCore.showToast("请先登陆")
        this.actLogin()
      }
    },
    // 跳转委托
    goCommission (index) {
      //判断是否有登陆
      if (this.isLogin) {
        if (index == 0) {
          this.toolsGoPageView({ path: '/home/commission/index' })
        } else if (index == 1) {
          this.toolsGoPageView({ path: '/home/commission/releasehouse' })
        } else {
          this.toolsGoPageView({ path: '/home/commission/rentalhouse' })
        }
      } else {
        // this.$commonUtils.utilCore.showToast("请先登陆")
        this.actLogin()
      }
    },
    // 我的交易跳转
    goSign (index) {
      //判断是否有登陆
      if (this.isLogin) {
        if (index == 0) {
          this.toolsGoPageView({ path: '/user/signlist' })
        }
      } else {
        // this.$commonUtils.utilCore.showToast("请先登陆")
        this.actLogin()
      }
    },
    goOther (index) {
      if (index == 0) {
        this.toolsGoPageView({ path: '/user/setting' })
      } else if (index == 1) {
        // 调用微信小程序
        this.sweixin.launchMiniProgram(
          {
            id: "gh_cbb5c9d6827f", // 要跳转小程序的原始ID
            path: 'pages/user/user-broker/activity-illustrate'
          },
          (res) => {
          },
          (err) => {
          }
        );
      }
    },
    // 加载plus.share.getServices事件
    getHtmlPlus () {
      if (!this.isAppPlus()) return;
      if (window.plus) {
        this.getServices();
      } else {
        // 兼容老版本的plusready事件
        document.addEventListener(
          "plusready",
          () => {
            this.getServices();
          },
          false
        );
      }
    },
    /**
     *判断是否是app环境
     */
    isAppPlus () {
      const ua = navigator.userAgent.toLowerCase();
      if (ua.match(/html5plus/i) == "html5plus") {
        return true;
      }
      return false;
    },
    // 获取plus服务上的微信标识
    getServices () {
      plus.share.getServices(
        (s) => {
          for (let i = 0; i < s.length; i++) {
            const item = s[i];
            if (item.id === "weixin") {
              this.sweixin = item;
            }
          }
        },
        function (e) { }
      );
    },
    //选择测试环境
    async onConfirmTest (value) {

      //要求在APP下才能切换
      if (!this.$commonUtils.utilCore.isAppPlus()) {
        this.$commonUtils.utilCore.showToast("在APP下才能切换")
        return;
      }

      //保存配置到APP那边
      let tmp_info = { "mod": "app", "fun": "actChengConfigSave", "val": value.val };
      let tmp_info_res = await this.$store.dispatch('app/actModFun', { messageAct: this.$messageAct, jsonData: tmp_info });

      //判断是否设置成功,testConfigID:2,  testConfigValue:"预发布",
      if (tmp_info_res && tmp_info_res.testConfigID) {
        value.val = { ...tmp_info_res };
        this.setTestConfigValue(value.text);
        this.setTestConfigValueSYS(value.val);
        this.$commonUtils.utilCore.showToast("切换【" + value.text + "】环境成功！")
      } else {
        this.$commonUtils.utilCore.showToast("切换【" + value.text + "】环境出错了！")
      }
      this.TestConfigShowPicker = false;
      //不管怎么样，切换了环境就需要重新登陆
      await this.$store.dispatch('user/actLoginOutApp', this.$messageAct);

      console.log("==========结果返回=====>>>", tmp_info_res)
      //设置选择的环境
      if (tmp_info_res && tmp_info_res.testConfigID) {
        this.$commonCaches.setKeyCache("TestConfigValueSYS", JSON.stringify({ TestConfig: value }));
      }
      // let tmp_info2 = this.$commonCaches.getKeyCache("TestConfigValueSYS","");
      // console.log("============加载测试环境======》》》》》",tmp_info2)

      setTimeout(() => {
        plus.runtime.restart()
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
.user {
  .user-container {
    height: 100%;
    background: #f5f5f5;
    .header {
      background-color: #fff;
      padding: 0.2rem 0.34rem 0.28rem 0.66rem;
      .header-nav {
        padding-bottom: 0.22rem;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .img-share {
          padding-right: 0.5rem;
          img {
            width: 0.36rem;
            height: 0.36rem;
            display: block;
          }
        }
        .img-setting {
          img {
            width: 0.4rem;
            height: 0.38rem;
            display: block;
          }
        }
      }
      .header-userdata {
        display: flex;
        align-items: center;
        img {
          width: 0.82rem;
          height: 0.82rem;
        }
        .userphone {
          font-size: 0.48rem;
          font-weight: bold;
          color: #4c4c4c;
          padding-left: 0.14rem;
        }
      }
    }
    .wrapper {
      padding: 0.32rem 0.34rem 0.6rem 0.36rem;
      .diagram {
        margin-bottom: 0.3rem;
        img {
          width: 6.8rem;
          height: 1.36rem;
        }
      }
      .attention-container {
        background: #ffffff;
        border-radius: 0.16rem;
        padding: 0.4rem 0;
        margin-bottom: 0.3rem;
        .title {
          font-size: 0.28rem;
          font-weight: bold;
          color: #4c4c4c;
          padding-bottom: 0.3rem;
          padding-left: 0.42rem;
        }
        .attention-options {
          display: flex;
          align-items: center;
          padding-left: 0.25rem;
          .attention-item {
            width: 20%;
            display: flex;
            flex-direction: column;
            align-items: center;
            img {
              width: 0.4rem;
              height: 0.4rem;
              display: block;
            }
            .item-title {
              font-size: 0.22rem;
              font-weight: 400;
              color: #000000;
              padding-top: 0.12rem;
            }
          }
        }
      }
      .bannar-broker {
        img {
          width: 6.8rem;
          height: 2.08rem;
        }
      }
      // .my-house {
      //   background: #ffffff;
      //   border-radius: 0.16rem;
      //   padding: 0.4rem 0.46rem 0.4rem 0.42rem;
      //   margin-top: 0.3rem;
      //   .title {
      //     font-size: 0.28rem;
      //     font-weight: bold;
      //     color: #4c4c4c;
      //     padding-bottom: 0.12rem;
      //   }
      //   .subtitle {
      //     font-size: 0.24rem;
      //     font-weight: 400;
      //     color: #5b5b5b;
      //   }
      //   .house-options {
      //     padding-top: 0.2rem;
      //     display: flex;
      //     justify-content: space-between;
      //     img {
      //       width: 2.8rem;
      //       height: 1.2rem;
      //       background: rgba(0, 0, 0, 0.2);
      //       border-radius: 0.1rem;
      //     }
      //   }
      // }
    }
    .share-pop {
      .title {
        font-size: 0.32rem;
        font-weight: bold;
        color: #303030;
        padding-top: 0.46rem;
        padding-bottom: 0.24rem;
        margin: 0 0.4rem;
        border-bottom: 0.02rem solid#F0F0F0;
      }
      .content {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0.4rem 0;
        border-bottom: 0.02rem solid#F0F0F0;
        .wechat {
          display: flex;
          flex-direction: column;
          align-items: center;
          img {
            width: 0.96rem;
            height: 0.96rem;
          }
          span {
            font-size: 0.24rem;
            font-weight: 500;
            color: #696969;
            padding-top: 0.18rem;
          }
        }
      }
      .cancel {
        font-size: 0.32rem;
        font-weight: bold;
        color: #303030;
        text-align: center;
        padding: 0.4rem;
      }
    }
  }
  .house-head {
    background-color: #fff; // 头部组件背景为白色
  }
}
</style>
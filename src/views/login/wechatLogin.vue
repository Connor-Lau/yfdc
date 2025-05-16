<template>
  <div class="wechatLogin">
    <gni-nav-bar @onClickLeft="onClickBack" :hideRight="false" :rightText="'注册'" @onClickRight="toolsGoPageView({path:'/login/register'})"></gni-nav-bar>
    <div class="title">微信登录</div>
    <div class="wechat-logo">
      <img :src="$appConfig.appWebStaticUrl + 'login/icon_otherbtn03.png'" alt="">
    </div>
    <!-- <div class="login-btn" @click="toolsGoPageView({path:'/login/bindphone'})">立即登录</div> -->
    <div class="login-btn" @click="actLoginWeixin">立即登录</div>
    <div class="tips"><van-checkbox v-model="is_check_box">注册/登录即代表同意</van-checkbox><span @click="toolsGoPageView({path:'/login/agreement'})">《裕丰地产用户使用协议》</span>和<span @click="toolsGoPageView({path:'/login/privacy'})">《裕丰地产私隐政策》</span>
    </div>
    <footerLogin @actOneClick="actLogin" @actAppleLogin="actAppleLogin" :appleLogin="appleLogin" :wechatLogin="false"></footerLogin>
  </div>
</template>

<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import footerLogin from "./components/footer.vue";

import { mapState, mapActions, mapMutations } from "vuex";

export default {
  components: {
    gniNavBar,
    footerLogin
  },
  data () {
    return {
      is_check_box:false, //选择同意
      appleLogin:false,//不开始苹果登陆
    }
  },
  computed: {
    ...mapState("user", ["userToken", "userInfo", "isLogin", "preLoginWeixinVal"]), //用户Token,用户登陆信息
    ...mapState("app", ["checkAppUpdateVal"]),
  },
  async mounted () {
    //初始化登陆的状态
    await this.init();
    //为了苹果登陆
    //判断是否苹果手机
    if(this.$commonUtils.utilCore.getSys() == "IOS"){
      if (!this.checkAppUpdateVal || !this.checkAppUpdateVal.info) {
        try {
          await this.actCheckAppUpdate(false);
        } catch (err) {

        }
      }
      if(
        this.checkAppUpdateVal && this.checkAppUpdateVal.info
        && this.checkAppUpdateVal.info.$app_common_config.CheckAppleLogin 
        && this.checkAppUpdateVal.info.$app_common_config.CheckAppleLogin == 1
      ){
        //要求APP的版本号大于5.1.5才能用苹果登陆
        if( 
          !this.$commonUtils.utilCore.empty(this.checkAppUpdateVal.info.this_varsion) 
          && this.$commonUtils.utilCore.versionCompare("5.1.0",this.checkAppUpdateVal.info.this_varsion)
        ){
          this.appleLogin = true;
        }
      }
    }
  },
  methods: {
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
      //如果用户可以完成自动登陆，则跳到 我的 页面
      if (!this.$commonUtils.utilCore.empty(this.userToken)) {
        this.toolsGoPageView({ path: '/common/index', query: { path: '/user/index' } })
      }
    },
    //处理微信预登陆问题
    async actLoginWeixin () {
      if(!this.is_check_box){
        this.$commonUtils.utilCore.showToast("请选择同意《隐私政策》");
        return;
      }
      this.$commonUtils.utilCore.showLoading("", { overlay: true });
      let isErrorTime = 300;//如果有出错，刚弹出的提示信息需要延时
      try {
        //进行微信预登陆处理，去APP那边获取用户的微信unionid
        let tmp_info = await this.$store.dispatch('user/actLoginWeixin', this.$messageAct);
        this.$commonUtils.appLog.log("登陆结果返回------->>>>>>>", tmp_info)
        if (tmp_info && tmp_info.isOk && tmp_info.isOk == 2) {
          //这里要判断一下用户是否已经绑定过手机号
          let postData = {
            union_id: tmp_info.msg.unionid
          }
          //通过微信unionid去后端获到用户是否已经有绑定过手机号
          let tmp_info_login = await this.$store.dispatch('user/actAppWechatAuthloginByMpWeiXin', { messageAct: this.$messageAct, postData: postData });
          if (tmp_info_login && tmp_info_login.is_new) {
            //如果是新用户（即未绑定手机号）
            return this.toolsGoPageView({ path: '/login/bindphone' })
          } else if (tmp_info_login && tmp_info_login.user_auth_key_v1) {
            //如果是已经绑定的用户是登陆成功的
            return this.toolsGoPageView({ path: '/common/index', query: { path: '/user/index' } })
            // const url = encodeURIComponent('/common/index')
            // return this.$commonUtils.utilCore.uniGoPage('/pages/page/index', { url, path: '/user/index' }, 'reLaunch');
          } else {
            this.$commonUtils.utilCore.showToast("微信登录出错！！")
            isErrorTime = 3000
          }
        } else {
          this.$commonUtils.utilCore.showToast(tmp_info.errMsg || "微信登录出错！")
          isErrorTime = 3000
          setTimeout(() => {
            this.toolsGoPageView({ path: '/login/otherPhone' })
          }, 2000)
        }
      } catch (err) {
        this.$commonUtils.appLog.log("登陆有出错信息", err)
      } finally {
        this.$commonUtils.utilCore.closeLoading(isErrorTime)
      }
    },
    /**
     * 本机一键登录
     */
    async actLogin () {
      this.$commonUtils.utilCore.showLoading("", { overlay: true });
      try {
        let tmp_info = await this.$store.dispatch('user/actLogin', this.$messageAct);
        this.$commonUtils.appLog.log("登陆结果返回", tmp_info)
        if (!tmp_info) {
          this.$commonUtils.appLog.log("要跳到微信登陆")
          //如果没有一键登陆成功，则跳到微信登陆
          return this.toolsGoPageView({ path: '/login/wechatLogin' })

        } else if (tmp_info.authResult && tmp_info.appLoginFormType && tmp_info.appLoginFormType == 1) {//如果是一键登陆
          tmp_info = await this.$store.dispatch('user/getAppFangAuthloginByPhone', { messageAct: this.$messageAct, postData: tmp_info });
          if (tmp_info) {
            //如果登陆成功
            return this.toolsGoPageView({ path: '/common/index', query: { path: '/user/index' } })
            // const url = encodeURIComponent('/common/index')
            // return this.$commonUtils.utilCore.uniGoPage('/pages/page/index', { url, path: '/user/index' }, 'reLaunch');
          } else {
            this.$commonUtils.utilCore.showToast("登录出错！")
          }
        } else if (!this.$commonUtils.utilCore.empty(tmp_info.provider)) {
          //如果需要进行其它的登陆方式则
          if (tmp_info.provider == "weixin") {//微信
            return this.toolsGoPageView({ path: '/login/wechatLogin' })
          } else if (tmp_info.provider == "telLogin") {//其它手机
            return this.toolsGoPageView({ path: '/login/otherPhone' })
          } else {//注册
            return this.toolsGoPageView({ path: '/login/register' })
          }
        }
      } catch (err) {
        this.$commonUtils.appLog.log("登陆有出错信息", err)
      } finally {
        this.$commonUtils.utilCore.closeLoading()
      }
    },
    //获取最新的版本信息
    async actCheckAppUpdate (isUpdate) {
      this.$commonUtils.utilCore.showLoading();
      try {
        let tmpInfo = await this.$store.dispatch('app/getCheckAppUpdateVal', { messageAct: this.$messageAct, isUpdate: isUpdate });
        if (tmpInfo && tmpInfo.status && tmpInfo.status == 2) {
          uni.navigateTo({
            url: "/pages/popup/update"
          })
        }
        this.$commonUtils.appLog.log("返回的版本信息==>>", tmpInfo)
      } catch (err) {
        this.$commonUtils.appLog.log("出错信息==>>", err)
      } finally {
        this.$commonUtils.utilCore.closeLoading()
      }

    },
    //苹果登陆
    async actAppleLogin(){
      return this.toolsGoPageView({ path: '/login/appleLogin' })
    },
    onClickBack () {
      //this.$router.go(-1);
      //为了处理因为一键登陆失败后再点返回上一页时出现的死循环
      this.toolsGoPageView({ path: '/common/index', query: { path: '/user/index' } })
    },
  }
}
</script>

<style lang="scss" scoped>
.wechatLogin {
  .title {
    font-size: 0.4rem;
    font-weight: 500;
    color: #060606;
    padding: 1.12rem 0 1.04rem 0.76rem;
  }
  .wechat-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 1.4rem;
      height: 1.4rem;
    }
  }
  .login-btn {
    width: 6rem;
    height: 1rem;
    font-size: 0.32rem;
    font-weight: 500;
    color: #000000;
    line-height: 1rem;
    text-align: center;
    background: #ffce09;
    border-radius: 0.1rem;
    margin: 0.9rem 0.74rem 0.4rem 0.76rem;
  }
  .tips {
    font-size: 0.24rem;
    font-weight: 400;
    color: #a4a4a4;
    padding: 0 1rem 3rem 0.86rem;
    line-height: 0.4rem;
    span {
      text-decoration: underline;
    }
  }
  /deep/ .footer .otherBtn {
    justify-content: space-around;
  }
}
</style>
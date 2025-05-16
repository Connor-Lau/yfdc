<template>
  <div class="login">
    <gni-nav-bar @onClickLeft="onClickBack" :hideRight="false"></gni-nav-bar>
    <div class="title">账号密码登录</div>
    <div class="content">
      <input v-model="account" type="text" placeholder="请输入帐号" maxlength="15">
      <input v-model="password" type="password" placeholder="请输入登录密码" v-if="isPassword" maxlength="20">
      <input v-model="password" type="text" placeholder="请输入登录密码" oninput="this.value = this.value.replace(/[\u4e00-\u9fa5]/g, '')" v-else maxlength="20">
      <div @click="hiddenPass()" class="img-eye">
        <img :src="$appConfig.appWebStaticUrl + '/login/eye.png'" alt="">
      </div>
    </div>
    <div class="tips">
      <van-checkbox v-model="is_check_box">注册/登录即代表同意</van-checkbox><span @click="toolsGoPageView({path:'/login/agreement'})">《裕丰地产用户使用协议》</span>和<span @click="toolsGoPageView({path:'/login/privacy'})">《裕丰地产私隐政策》</span>
    </div>
    <div :class="{ 'active': account && password }" @click="actLoginAuthLogin()" class="login-btn">立即登录</div>
    <div class="forget" @click="toolsGoPageView({path:'/login/retrievePassword'})">忘记密码</div>
    <footerLogin @actOneClick="actLogin"></footerLogin>
  </div>
</template>

<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import gniTabbar from "@/components/gni/gni-tabbar.vue";
import footerLogin from "./components/footer.vue";

import { mapState, mapActions, mapMutations } from "vuex";

export default {
  components: {
    gniNavBar,
    gniTabbar,
    footerLogin
  },
  data () {
    return {
      account: '',
      password: '',
      isPassword: true,
      // goBackUrl: '',//登陆后要求跳回的地址
      is_check_box: false, //选择同意
    }
  },
  computed: {
    ...mapState("user", ["userToken", "userInfo", "isLogin"]), //用户Token,用户登陆信息
  },
  async mounted () {
    //初始化登陆的状态
    await this.init();
    //接收一下要回跳的地址
    // if (!this.$commonUtils.utilCore.empty(this.$route.query.goBackUrl)) {
    //   this.goBackUrl = this.$route.query.goBackUrl
    // }
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
        return this.toolsGoPageView({ path: '/common/index', query: { path: '/user/index' } })
      }
    },
    onClickBack () {
      this.$router.go(-1);
    },
    hiddenPass () {
      this.isPassword = !this.isPassword
      console.log('1111');
    },
    /**
     * 帐号密码登陆
     */
    async actLoginAuthLogin () {

      //如果手机号不正确
      if (this.$commonUtils.utilCore.empty(this.account) || this.account.length < 3 || this.account.length > 32) {
        this.$commonUtils.utilCore.showToast("请输入3~32位的帐号！");
        return;
      }
      //如果没有输入密码
      if (this.$commonUtils.utilCore.empty(this.password) || this.password.length < 6) {
        this.$commonUtils.utilCore.showToast("请输入密码（最少6位，数字+字母）！");
        return;
      }
      //如果密码长度过长
      // if (this.$commonUtils.utilCore.empty(this.password) || this.password.length < 6 || this.password.length > 20) {
      //   this.$commonUtils.utilCore.showToast("密码长度在6-20位");
      //   return;
      // }

      if (!this.is_check_box) {
        this.$commonUtils.utilCore.showToast("请选择同意《隐私政策》");
        return;
      }

      this.$commonUtils.utilCore.showLoading("", { overlay: true });
      let tmp_info = null;
      try {
        let postData = {
          account: this.account,
          password: this.password
        }
        tmp_info = await this.$store.dispatch('user/actAppFangAuthLogin', { messageAct: this.$messageAct, postData: postData });
        if (tmp_info) {
          //如果登陆成功
          return this.toolsGoPageView({ path: '/common/index', query: { path: '/user/index' } })
          // const url = encodeURIComponent('/common/index')
          // return this.$commonUtils.utilCore.uniGoPage('/pages/page/index', { url, path: '/user/index' }, 'reLaunch');
        } else {
          this.$commonUtils.utilCore.showToast(tmp_info.msg)
        }
      } catch (err) {
        this.$commonUtils.appLog.log("登陆有出错信息", err)
      } finally {
        // 防止提示 闪一下就没了
        if (!tmp_info) {
          setTimeout(() => {
            this.$commonUtils.utilCore.closeLoading()
          }, 1500)
          return
        }
        this.$commonUtils.utilCore.closeLoading()
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
  }
}

</script>
<style lang="scss" scoped>
.login {
  .title {
    font-size: 0.4rem;
    font-weight: 500;
    color: #060606;
    padding: 1.18rem 0 1.14rem 0.86rem;
  }
  .content {
    position: relative;
    padding: 0 0.86rem;
    input {
      width: 100%;
      font-size: 0.32rem;
      border: none;
      border-bottom: 0.01rem solid #eeeeee;
      line-height: 1rem;
      padding: 0;
    }
    .img-eye {
      position: absolute;
      bottom: 0.45rem;
      right: 1rem;
      img {
        width: 0.4rem;
        height: 0.29rem;
        display: block;
      }
    }
  }
  .tips {
    font-size: 0.24rem;
    font-weight: 400;
    color: #a4a4a4;
    padding: 0.38rem 1rem 0.54rem 0.86rem;
    line-height: 0.4rem;
    span {
      text-decoration: underline;
    }
  }
  .login-btn {
    width: 6rem;
    height: 1rem;
    font-size: 0.32rem;
    font-weight: 500;
    color: #9b9b9b;
    line-height: 1rem;
    text-align: center;
    background: #fff3c3;
    border-radius: 0.1rem;
    margin: 0 0.74rem 0.4rem 0.76rem;
  }
  .forget {
    font-size: 0.24rem;
    font-weight: 500;
    color: #9b9b9b;
    text-align: right;
    padding-right: 0.74rem;
    padding-bottom: 2rem;
  }
  .active {
    background: #ffce09;
    color: #000000;
  }
}
</style>
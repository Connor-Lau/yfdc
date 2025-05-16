<template>
  <div class="bindphone">
    <gni-nav-bar @onClickLeft="onClickBack" :hideRight="false"></gni-nav-bar>
    <div class="title">
      <div class="bigTips">绑定手机号</div>
      <div class="smalltips">绑定手机号，可同步第三方账号与手机号信息。</div>
    </div>
    <div class="content">
      <div class="header-content">
        <div class="title-content">手机号：</div>
        <gniPhoneInput :phone="phoneNum" :showFooter="false" @change="userMobileChange">
        </gniPhoneInput>
      </div>
      <div class="footer-content">
        <div class="title-content">短信验证码：</div>
        <div class="code-container">
          <gniPhoneInput :boxLength="6" :showFooter="false" :phone="codeNum" @change="userCodeChange"></gniPhoneInput>
          <div class="send-code" :class="phoneNum.length==11 && !isCode?'active':''" @click="sendCode">发送验证码</div>
        </div>

      </div>
    </div>
    <div class="tips">注册/登录即代表同意<span @click="toolsGoPageView({path:'/login/agreement'})">《裕丰地产用户使用协议》</span>和<span @click="toolsGoPageView({path:'/login/privacy'})">《裕丰地产私隐政策》</span>
    </div>
    <div :class="{ 'btnactive': phoneNum.length==11 && codeNum.length==6 }" @click="actBindphone()" class="bindphone-btn">绑定手机号</div>
  </div>
</template>

<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import gniPhoneInput from "@/components/gni/gni-phone-input.vue";

import { mapState, mapActions, mapMutations } from "vuex";

export default {
  components: {
    gniNavBar,
    gniPhoneInput
  },
  data () {
    return {
      isCode: false,
      phoneNum: '', // 手机号码
      codeNum: '', // 验证码
      timeoutCodeNum: false,//是否设置短信发送定时器
      isSetTimeOut: false,//是否开启了定时器
    }
  },
  computed: {
    ...mapState("user", ["userToken", "userInfo", "isLogin", "preLoginWeixinVal"]), //用户Token,用户登陆信息
  },
  async mounted () {
    //如果没有微信预登陆的数据，则跳回微信登陆页
    if (this.$commonUtils.utilCore.empty(this.preLoginWeixinVal)) {
      return this.toolsGoPageView({ path: '/login/wechatLogin' })
    }
    //初始化登陆的状态
    await this.init();
  },
  beforeDestroy () {
    if (this.isSetTimeOut) {
      clearInterval(this.isSetTimeOut);
    }
  },
  methods: {
    async init () {
      //如果用户没有登陆，则进行自动登陆
      if (this.$commonUtils.utilCore.empty(this.userToken)) {
        //判断一下用户登陆了没有
        let tmp_info = this.$store.dispatch('user/initLogin');
        //如果用户没有登陆，则清掉登陆相关的信息
        if (!tmp_info) {
          //如果数据为空，则清掉登陆的信息
          await this.$store.dispatch('user/actLoginOutApp');
        }
      }
    },
    //检查是否已经复制了验证码
    checkCopyInit () {
      if (this.isSetTimeOut) {
        clearInterval(this.isSetTimeOut);
      }
      this.isSetTimeOut = setInterval(async () => {
        //如果手机号不正确
        if (!this.$commonUtils.utilCore.isPhone(this.phoneNum)) {
          return;
        }
        let tmp_info = await this.$store.dispatch('app/getPasteMessage', { messageAct: this.$messageAct });
        if (tmp_info && tmp_info.length == 6 && this.$commonUtils.utilCore.checkIsNumber(tmp_info)) {
          this.codeNum = tmp_info

          // if (this.isSetTimeOut) {
          //   clearInterval(this.isSetTimeOut);
          // }
        }
      }, 1000)
    },
    onClickBack () {
      this.$router.go(-1);
    },
    //接收手机号
    userMobileChange (v) {
      this.phoneNum = v
    },
    //接收短信验证码
    userCodeChange (v) {
      this.codeNum = v
    },
    //进行手机号与微信的绑定操作
    async actBindphone () {
      //如果没有进行微信预登陆，则报错
      if (
        this.$commonUtils.utilCore.empty(this.preLoginWeixinVal)
        || this.$commonUtils.utilCore.empty(this.preLoginWeixinVal.openid)
        || this.$commonUtils.utilCore.empty(this.preLoginWeixinVal.unionid)
      ) {

        this.$commonUtils.appLog.log("登陆有出错信息", this.preLoginWeixinVal)

        this.$commonUtils.utilCore.showToast("微信登录出错！");
        setTimeout(() => {
          this.toolsGoPageView({ path: '/login/wechatLogin' })
        }, 3000)
        return
      }
      //如果手机号不正确
      if (!this.$commonUtils.utilCore.isPhone(this.phoneNum)) {
        this.$commonUtils.utilCore.showToast("手机号不正确！");
        return;
      }
      //如果没有输入短信验证码
      if (this.$commonUtils.utilCore.empty(this.codeNum) || this.codeNum.length != 6) {
        this.$commonUtils.utilCore.showToast("请输入正确的短信验证码！");
        return;
      }

      this.$commonUtils.utilCore.showLoading();
      //这里进行手机的绑定咯
      try {
        let postData = {
          account: this.phoneNum,
          sms_code: this.codeNum,
          union_id: this.preLoginWeixinVal.unionid,
          open_id: this.preLoginWeixinVal.openid
        }
        this.$commonUtils.appLog.log("绑定参数情况===========》》》", postData)
        let tmp_info = await this.$store.dispatch('user/actAppFangAuthloginBySms', { messageAct: this.$messageAct, postData: postData });
        if (tmp_info) {//登陆成功，跳到我的页面
          return this.toolsGoPageView({ path: '/common/index', query: { path: '/user/index' } })
          // const url = encodeURIComponent('/common/index')
          // return this.$commonUtils.utilCore.uniGoPage('/pages/page/index', { url, path: '/user/index' }, 'reLaunch');
        } else {
          this.$commonUtils.utilCore.showToast("微信绑定手机号出错");
        }
      } catch (err) {
        this.$commonUtils.appLog.log("登陆有出错信息", err)
      } finally {
        this.$commonUtils.utilCore.closeLoading()
      }

    },
    //获取手机短信验证码
    async sendCode () {
      //如果手机号不正确
      if (!this.$commonUtils.utilCore.isPhone(this.phoneNum)) {
        this.$commonUtils.utilCore.showToast("手机号不正确！");
        return;
      }
      if (this.isCode) {
        if (this.timeoutCodeNum) {
          clearTimeout(this.timeoutCodeNum);
        }
        //设置60秒之后又可以再发短信
        this.timeoutCodeNum = setTimeout(() => {
          this.isCode = false
        }, 60000)
        this.$commonUtils.utilCore.showToast("验证码已发送");
        return;
      }
      this.$commonUtils.utilCore.showLoading();
      try {
        this.isCode = true
        let postData = {
          account: this.phoneNum
        }
        this.$commonUtils.appLog.log("短信发送情况===========》》》", postData)
        let tmp_info = await this.$store.dispatch('user/getAppFangAuthsendSmsCode', postData);
        this.$commonUtils.appLog.log("短信发送情况", tmp_info)
        if (tmp_info) {
          //检查是否复制了验证码
          this.checkCopyInit();
          this.$commonUtils.utilCore.showToast("验证码发送成功");
        } else {
          this.$commonUtils.utilCore.showToast("验证码发送失败");
        }
      } catch (err) {
        this.$commonUtils.appLog.log("登陆有出错信息", err)
      } finally {
        this.$commonUtils.utilCore.closeLoading()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bindphone {
  .title {
    padding: 0.98rem 0 0.74rem 0.58rem;
    .bigTips {
      font-size: 0.4rem;
      font-weight: 500;
      color: #060606;
      padding-bottom: 0.08rem;
    }
    .smalltips {
      font-size: 0.24rem;
      color: #858585;
    }
  }
  .content {
    padding: 0 0.52rem 1.22rem 0.58rem;
    .title-content {
      font-size: 0.32rem;
      font-weight: 400;
      color: #040404;
      padding-bottom: 0.1rem;
    }
    .footer-content {
      padding-top: 0.8rem;
      .code-container {
        display: flex;
        align-items: center;
        .send-code {
          font-size: 0.28rem;
          font-weight: 400;
          color: #a2a2a2;
          padding-left: 1.56rem;
        }
      }
    }
  }
  .tips {
    font-size: 0.24rem;
    font-weight: 400;
    color: #a4a4a4;
    padding: 0 0.86rem 0.62rem;
    line-height: 0.35rem;
    span {
      text-decoration: underline;
    }
  }
  .bindphone-btn {
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
  /deep/ .container .field-box {
    border: none;
  }
  .active {
    color: #016cff !important;
  }
  .btnactive {
    background: #ffce09;
    color: #000000;
  }
}
</style>
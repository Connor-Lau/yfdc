<template>
  <div class="otherPhone">
    <gni-nav-bar @onClickLeft="onClickBack" :hideRight="false" :rightText="'注册'" @onClickRight="toolsGoPageView({path:'/login/register'})"></gni-nav-bar>
    <div class="title">
      <div class="bigTips">手机快捷登录</div>
      <div class="smalltips">未注册过的手机号码将自动创建账号</div>
    </div>
    <div class="content">
      <div class="header-content">
        <div class="title-content">请输入手机号：</div>
        <gniPhoneInput :phone="phoneNum" @change="userMobileChange">
          <template slot="tipsRight">
            <div class="send-code" :class="phoneNum.length==11 && !isCode?'active':''" @click="sendCode">发送验证码</div>
          </template>
        </gniPhoneInput>
      </div>
      <div class="footer-content">
        <div class="title-content">请输入短信验证码：</div>
        <gniPhoneInput :boxLength="6" :showFooter="false" :phone="codeNum" @change="userCodeChange"></gniPhoneInput>
      </div>
    </div>
    <div class="tips"><van-checkbox v-model="is_check_box">注册/登录即代表同意</van-checkbox><span @click="toolsGoPageView({path:'/login/agreement'})">《裕丰地产用户使用协议》</span>和<span @click="toolsGoPageView({path:'/login/privacy'})">《裕丰地产私隐政策》</span>
    </div>
    <div :class="{ 'btnactive': phoneNum.length==11 && codeNum.length==6 }" @click="actPhoneLogin()" class="login-btn">立即登录</div>
    <div class="accPassLogin" @click="toolsGoPageView({path:'/login/index'})">账号密码登录</div>
    <footerLogin @actOneClick="actLogin" :otherMobile="false"></footerLogin>
  </div>
</template>

<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import gniPhoneInput from "@/components/gni/gni-phone-input.vue";
import footerLogin from "./components/footer.vue";

import { mapState, mapActions, mapMutations } from "vuex";

export default {
  components: {
    gniNavBar,
    gniPhoneInput,
    footerLogin
  },
  data () {
    return {
      isCode: false,
      phoneNum: '', // 手机号码
      codeNum: '', // 验证码
      timeoutCodeNum: false,//是否设置短信发送定时器
      isSetTimeOut: false,//是否开启了定时器
      is_check_box:false, //选择同意
    }
  },
  computed: {
    ...mapState("user", ["userToken", "userInfo", "isLogin"]), //用户Token,用户登陆信息
  },
  async mounted () {
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
      if (this.$commonUtils.utilCore.empty(this.userToken) || !this.isLogin) {
        //判断一下用户登陆了没有
        let tmp_info = this.$store.dispatch('user/initLogin');
        //如果用户没有登陆，则清掉登陆相关的信息
        if (!tmp_info) {
          //如果数据为空，则清掉登陆的信息
          await this.$store.dispatch('user/actLoginOutApp');
        }
      }

      //获取一下输入的手机号
      let tmpBeginTime = Date.now();
      let tmp_info = this.$commonCaches.getKeyCache("loginPhoneNum","")
      if(!this.$commonUtils.utilCore.empty(tmp_info)){
        tmp_info = JSON.parse(tmp_info);//{phoneNum:this.phoneNum,d:tmpBeginTime})
        if(!this.$commonUtils.utilCore.empty(tmp_info) && tmp_info.phoneNum &&  tmp_info.d){
          //如果是 5分钟内就显示，
          // if(tmpBeginTime - tmp_info.d < 300 * 1000){
          //   this.phoneNum = tmp_info.phoneNum;
          // }
          this.phoneNum = tmp_info.phoneNum;

          //获取5分钟内记录的手机验证码
          tmp_info = this.$commonCaches.getKeyCache("loginCodeNum","")
          if(!this.$commonUtils.utilCore.empty(tmp_info)){
            tmp_info = JSON.parse(tmp_info);//{loginCodeNum:this.codeNum,d:tmpBeginTime})
            if(!this.$commonUtils.utilCore.empty(tmp_info) && tmp_info.loginCodeNum &&  tmp_info.d){
              //如果是 5分钟内就显示，
              if(tmpBeginTime - tmp_info.d < 300 * 1000){
                this.codeNum = tmp_info.loginCodeNum;
              }
            }
          }
        }
      }

      //如果用户可以完成自动登陆，则跳到 我的 页面
      if (!this.$commonUtils.utilCore.empty(this.userToken)) {
        return this.toolsGoPageView({ path: '/common/index', query: { path: '/user/index' } })
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
    onClickBack () {
      this.$router.go(-1);
    },
    userMobileChange (v) {
      this.phoneNum = v
      //记录一下当前输入的手机号
      let tmpBeginTime = Date.now();
      this.$commonCaches.setKeyCache("loginPhoneNum",JSON.stringify({phoneNum:this.phoneNum,d:tmpBeginTime}))
    },
    userCodeChange (v) {
      this.codeNum = v
      //记录一下当前输入的验证码
      let tmpBeginTime = Date.now();
      this.$commonCaches.setKeyCache("loginCodeNum",JSON.stringify({loginCodeNum:this.codeNum,d:tmpBeginTime}))
    },
    //进行手机号通过短信登陆
    async actPhoneLogin () {
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
      if(!this.is_check_box){
        this.$commonUtils.utilCore.showToast("请选择同意《隐私政策》");
        return;
      }
      this.$commonUtils.utilCore.showLoading("", { overlay: true });
      //这里进行手机的绑定咯
      try {
        //删除记录的手机验证码
        this.$commonCaches.delKeyCache("loginCodeNum");

        let postData = {
          account: this.phoneNum,
          sms_code: this.codeNum
        }
        let tmp_info = await this.$store.dispatch('user/actAppFangAuthloginBySms', { messageAct: this.$messageAct, postData: postData });
        if (tmp_info) {//登陆成功，跳到我的页面
          return this.toolsGoPageView({ path: '/common/index', query: { path: '/user/index' } })
          // const url = encodeURIComponent('/common/index')
          // return this.$commonUtils.utilCore.uniGoPage('/pages/page/index', { url, path: '/user/index' }, 'reLaunch');
        } else {
          //this.$commonUtils.utilCore.showToast("登陆出错");
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
          //如果发送验证码成功，则记录一下当前输入的手机号
          let tmpBeginTime = Date.now();
          this.$commonCaches.setKeyCache("loginPhoneNum",JSON.stringify({phoneNum:this.phoneNum,d:tmpBeginTime}))
        } else {
          this.$commonUtils.utilCore.showToast("验证码发送失败");
        }
      } catch (err) {
        this.$commonUtils.appLog.log("短信发送有出错信息", err)
      } finally {
        this.$commonUtils.utilCore.closeLoading(3000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.otherPhone {
  .title {
    padding: 0.18rem 0 0.74rem 0.58rem;
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
    padding: 0 0.52rem 0.86rem 0.58rem;
    .title-content {
      font-size: 0.32rem;
      font-weight: 400;
      color: #040404;
      padding-bottom: 0.1rem;
    }
    .header-content {
      .send-code {
        font-size: 0.28rem;
        font-weight: 400;
        color: #9b9b9b;
      }
    }
    .footer-content {
      padding-top: 0.54rem;
      display: flex;
      align-items: center;
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
  .accPassLogin {
    font-size: 0.24rem;
    font-weight: 500;
    color: #9b9b9b;
    text-align: right;
    padding-right: 0.74rem;
    padding-bottom: 2rem;
  }
  /deep/ .container .tip {
    justify-content: space-between;
  }
  /deep/ .footer-content .container .field-box {
    border: none;
  }
  /deep/ .footer .otherBtn {
    justify-content: space-around;
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
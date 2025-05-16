<template>
  <div class="register">
    <gni-nav-bar @onClickLeft="onClickBack" :hideRight="false"></gni-nav-bar>
    <div class="title">注册账号</div>
    <div class="content">
      <div class="header-content">
        <div class="title-content">手机号：</div>
        <gniPhoneInput :phone="phoneNum" @change="userMobileChange">
          <template slot="tipsRight">
            <div class="send-code" :class="phoneNum.length==11 && !isCode?'active':''" @click="sendCode">发送验证码</div>
          </template>
        </gniPhoneInput>
      </div>
      <div class="footer-content">
        <div class="title-content">短信验证码：</div>
        <gniPhoneInput :boxLength="6" :showFooter="false" :phone="codeNum" @change="userCodeChange"></gniPhoneInput>
      </div>
    </div>
    <!-- 注册的时候是不需要密码了 -->
    <div v-if="1>2" class="new-pssword">
      <div class="new-title">新密码：</div>
      <input v-model="newPassword" type="password" placeholder="请输入（最少6位，数字+字母）" v-if="isPassword">
      <input v-model="newPassword" type="text" placeholder="请输入（最少6位，数字+字母）" oninput="this.value = this.value.replace(/[\u4e00-\u9fa5d]/g, '')" v-else>
      <div @click="isPassword = !isPassword" class="img-eye">
        <img :src="$appConfig.appWebStaticUrl + '/login/eye.png'" alt="">
      </div>
    </div>
    <div class="tips"><van-checkbox v-model="is_check_box">注册/登录即代表同意</van-checkbox><span @click="toolsGoPageView({path:'/login/agreement'})">《裕丰地产用户使用协议》</span>和<span @click="toolsGoPageView({path:'/login/privacy'})">《裕丰地产私隐政策》</span>
    </div>
    <div :class="{ 'btnactive': phoneNum.length==11 && codeNum.length==6}" @click="actPhoneLogin()" class="submit">注册</div>
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
      newPassword: '', // 新密码
      isPassword: true, // 显示隐藏密码
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
    onClickBack () {
      this.$router.go(-1);
    },
    userMobileChange (v) {
      this.phoneNum = v
    },
    userCodeChange (v) {
      this.codeNum = v
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
      //这里进行手机的绑定咯（注册）
      try {
        let postData = {
          account: this.phoneNum,
          sms_code: this.codeNum,
          is_register: true,
        }
        console.log(postData);
        let tmp_info = await this.$store.dispatch('user/actAppFangAuthloginBySms', { messageAct: this.$messageAct, postData: postData });
        if (tmp_info) {//登陆成功，跳到我的页面
          return this.toolsGoPageView({ path: '/common/index', query: { path: '/user/index' } })
          // const url = encodeURIComponent('/common/index')
          // return this.$commonUtils.utilCore.uniGoPage('/pages/page/index', { url, path: '/user/index' }, 'reLaunch');
        }
        // else {
        //   this.$commonUtils.utilCore.showToast("登陆出错");
        // }
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
        this.$commonUtils.utilCore.closeLoading(3000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.register {
  .title {
    font-size: 0.4rem;
    font-weight: bold;
    color: #060606;
    padding: 1.18rem 0 1.14rem 0.58rem;
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
  .new-pssword {
    display: flex;
    align-items: center;
    padding: 0 0.52rem 0 0.58rem;
    position: relative;
    .new-title {
      font-size: 0.32rem;
      font-weight: 400;
      color: #040404;
    }
    input {
      width: 4.56rem;
      font-size: 0.24rem;
      border: none;
      border-bottom: 0.01rem solid #eeeeee;
      line-height: 0.8rem;
    }
    .img-eye {
      position: absolute;
      bottom: 0.4rem;
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
    padding: 0.38rem 1rem 0 0.86rem;
    line-height: 0.4rem;
    span {
      text-decoration: underline;
    }
  }
  .submit {
    width: 6rem;
    height: 1rem;
    font-size: 0.32rem;
    font-weight: 500;
    color: #9b9b9b;
    line-height: 1rem;
    text-align: center;
    background: #fff3c3;
    border-radius: 0.1rem;
    margin: 0.62rem 0.74rem 0.4rem 0.76rem;
  }
  /deep/ .container .tip {
    justify-content: space-between;
  }
  /deep/ .footer-content .container .field-box {
    width: 3.36rem;
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
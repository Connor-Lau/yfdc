<template>
  <div class="wechatLogin">
    <gni-nav-bar @onClickLeft="onClickBack" :hideRight="false" :rightText="'注册'" @onClickRight="toolsGoPageView({path:'/login/register'})"></gni-nav-bar>
    <div class="title">苹果登录</div>
    <div class="wechat-logo">
      <img :src="$appConfig.appWebStaticUrl + 'login/icon_apple.png'" alt="">
    </div>
    <div class="login-btn" @click="actAppleLogin">立即登录</div>
    <div class="tips"><van-checkbox v-model="is_check_box">注册/登录即代表同意</van-checkbox><span @click="toolsGoPageView({path:'/login/agreement'})">《裕丰地产用户使用协议》</span>和<span @click="toolsGoPageView({path:'/login/privacy'})">《裕丰地产私隐政策》</span>
    </div>
  </div>
</template>

<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";

import { mapState, mapActions, mapMutations } from "vuex";

export default {
  components: {
    gniNavBar
  },
  data () {
    return {
      is_check_box:false, //选择同意
    }
  },
  computed: {
    ...mapState("user", ["userToken", "userInfo", "isLogin", "preLoginWeixinVal"]), //用户Token,用户登陆信息
  },
  async mounted () {
    //初始化登陆的状态
    await this.init();
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
    //苹果登陆
    async actAppleLogin(){

        if(!this.is_check_box){
          this.$commonUtils.utilCore.showToast("请选择同意《隐私政策》");
          return;
        }
        let tmp_info = await this.$store.dispatch('user/actLoginApple', this.$messageAct);
        this.$commonUtils.appLog.log("登陆结果返回", tmp_info)
        if(tmp_info && tmp_info.userInfo && tmp_info.userInfo.openId){
          //进行苹果默认用户的登陆
          this.$commonUtils.utilCore.showLoading("", { overlay: true });
          try {
            //这里要判断一下用户是否已经绑定过手机号
            let postData = {
              union_id: tmp_info.userInfo.openId
            }
            //通过苹果open_id去后端获到用户是否已经有绑定过手机号
            let tmp_info_login = await this.$store.dispatch('user/actAppWechatAuthloginByAppleId', { messageAct: this.$messageAct, postData: postData });
            if (tmp_info_login && tmp_info_login.user_auth_key_v1) {
              //如果是已经绑定的用户是登陆成功的
              return this.toolsGoPageView({ path: '/common/index', query: { path: '/user/index' } })
            }else{
              //如果是新用户（即未绑定手机号）
              return this.toolsGoPageView({ path: '/login/bindphoneApple' })
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
        }

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
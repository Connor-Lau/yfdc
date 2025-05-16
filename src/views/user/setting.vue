<template>
  <div class="setting">
    <gni-nav-bar @onClickLeft="onClickBack" :hideRight="false" :pageTitle="'系统设置'"></gni-nav-bar>
    <div class="wrapper">
      <div class="cell" @click="toolsGoPageView({path:'/login/privacy'})">
        <div class="left">隐私政策</div>
        <div class="right">
          <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
        </div>
      </div>
      <div class="cell" @click="toolsGoPageView({path:'/login/disclaimer'})">
        <div class="left">免责声明</div>
        <div class="right">
          <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
        </div>
      </div>
      <div class="cell">
        <div class="left">
          当前版本
          <img v-if="isAppUpdateNew" :src="$appConfig.appWebStaticUrl + '/common/icon_newedition.png'" alt="">
        </div>
        <div v-if="checkAppUpdateVal" @click="actCheckAppUpdate(true)" class="right">
          <span class="edition">{{userId?userId:""}} {{isAppUpdateNewInfo}}</span>
          <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
        </div>
      </div>
      <div class="cell" @click="isShare=true">
        <div class="left">分享APP</div>
      </div>
      <div v-if="1<2" class="cell" @click="showPopup=true">
        <div class="left">在线举报</div>
        <div class="right">
          <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
        </div>
      </div>
      <div v-if="1>2 && isLogin" class="cell" @click="notAcceptPush()">
        <div class="left">停止推送接收</div>
        <div class="right">
          <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
        </div>
      </div>
      <div v-if="1>2 && isLogin" class="cell" @click="showPopupUser=true">
        <div class="left">注销帐号申请</div>
        <div class="right">
          <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
        </div>
      </div>
    </div>
    <div v-if="isLogin" class="footer">
      <div class="btn-return" @click="onLoginOut">退出登录</div>
    </div>
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
    <van-popup v-model="showPopup" :round="true" :close-on-click-overlay="false">
      <div class="report-container">
        <div class="title">
          <div class="title-name">举报</div>
          <div class="close-img" @click="showPopup=false">
            <img :src="$appConfig.appWebStaticUrl + '/commission/icon_popclose.png'" alt="">
          </div>
        </div>
        <div class="container">
          <div class="container-title">举报描述</div>
          <textarea name="" id="" cols="30" rows="10" v-model="reportDescribe"></textarea>
        </div>
        <div class="container">
          <div class="container-title">联系方式</div>
          <input type="tel" v-model="reportPhone">
        </div>
        <div class="submit" @click="submit">提交信息</div>
      </div>
    </van-popup>
    <van-popup v-model="showPopupUser" :round="true" :close-on-click-overlay="false">
      <div class="report-container">
        <div class="title">
          <div class="title-name">注销帐号申请</div>
          <div class="close-img" @click="showPopupUser=false">
            <img :src="$appConfig.appWebStaticUrl + '/commission/icon_popclose.png'" alt="">
          </div>
        </div>
        <div class="container">
          <div class="container-title">请填写注销原因</div>
          <textarea name="" id="" cols="30" rows="10" v-model="reportDescribe"></textarea>
        </div>
        <div class="submit" @click="submitUser">提交申请</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import gniPopupUi from "@/components/gni/gni-popup-ui.vue";

import { mapState, mapActions, mapMutations } from "vuex";

export default {
  components: {
    gniNavBar,
    gniPopupUi
  },
  data () {
    return {
      isShare: false, // 分享弹窗
      showPopup: false, // 举报弹窗
      showPopupUser:false,//注解帐号申请
      reportDescribe: '', // 举报描述
      reportPhone: '', // 举报联系方式
    }
  },
  computed: {
    ...mapState("user", ["userToken", "userInfo","userId", "isLogin"]), //用户Token,用户登陆信息 
    ...mapState("app", ["checkAppUpdateVal"]),
    ...mapState("city", ["thisCityInfo", "switchCityInfo"]), //城市的信息
    isAppUpdateNew () {
      //如果是需要更新的，则显示要 新的标记
      if (this.checkAppUpdateVal && this.checkAppUpdateVal.status == 2) {
        return true;
      }
      return false;
    },
    isAppUpdateNewInfo () {
      if (this.checkAppUpdateVal && this.checkAppUpdateVal.status == 2) {
        return this.checkAppUpdateVal.info.this_varsion + '(最新版' + this.checkAppUpdateVal.info.version + ')';
      } else if (this.checkAppUpdateVal && this.checkAppUpdateVal.info) {
        return this.checkAppUpdateVal.info.this_varsion;
      } else {
        return "...";
      }
    }
  },
  async mounted () {
    console.log(this.$route);
    //初始化登陆的状态
    await this.init();
    if (!this.checkAppUpdateVal || !this.checkAppUpdateVal.info) {
      try {
        await this.actCheckAppUpdate(false);
      } catch (err) {

      }
    }
  },
  methods: {
    ...mapActions('app', ['getShareApp']),
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
    //返回上一页
    onClickBack () {
      this.$router.go(-1);
    },
    //退出登陆
    async onLoginOut () {
      try {
        await this.$store.dispatch('user/actLoginOutApp', this.$messageAct);
      } catch (err) {
        this.$commonUtils.appLog.log("onLoginOut,退出登陆出错了！", err)
      } finally {
        this.onClickBack();
      }
    },
    //停止接收推送信息
    async notAcceptPush () {
      try {
        await this.$store.dispatch('user/actAppUpdateClientByLogout', this.$messageAct);
        this.$commonUtils.utilCore.showToast("已停止推送信息的接收")
      } catch (err) {
        this.$commonUtils.appLog.log("停止接收推送信息出错了！", err)
      } finally {
        this.onClickBack();
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
    // 分享到微信
    async shareWeixin () {
      let jsonData = {
        provider: 'weixin',
        scene: 'WXSceneSession',
        type: 0,
        href: this.$appConfig.appH5PageUrl.replace('/#/', '/index.html#') + '/public/download/download',
        summary: "集买卖二手房新房，租赁商铺写字楼功能与一体的应用软件。",//描述语暂时不知写什么
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
        summary: "集买卖二手房新房，租赁商铺写字楼功能与一体的应用软件。",//描述语暂时不知写什么
        imageUrl: this.$appConfig.appWebStaticUrl + 'share_logo.png',
        title: '裕丰地产'
      }
      let systemInfo = await this.getShareApp({ messageAct: this.$messageAct, jsonData: jsonData })
      this.$commonUtils.appLog.log("分享结果的信息为：", systemInfo)
    },
    // 举报提交
    async submit () {
      this.$commonUtils.utilCore.showLoading("", { overlay: true });
      const postData = {
        tel: this.reportPhone || '',//	是	string	联系电话
        content: this.reportDescribe || '',//	是	string	投诉内容
        site_id: this.switchCityInfo.city_id || '',//	是	string	城市id
        from_url: this.$route.path || '',//	是	string	反馈提交页面
        from_type: "4",//	否	string	反馈系统(默认2)，1:pc网站,2:小程序,3.裕丰经纪app,4.裕丰地产app
      }
      const res = await this.$store.dispatch('user/getAppWechatcFeedbackAcreate', postData);
      if (res.code == 200) {
        this.$commonUtils.utilCore.closeLoading()
        this.$commonUtils.utilCore.showToast("提交成功")
        setTimeout(() => {
          this.reportPhone = ''
          this.reportDescribe = ''
          this.showPopup = false
        }, 1000);
      }
    },
    // 注销帐号提交
    async submitUser () {
      if(this.$commonUtils.utilCore.empty(this.reportDescribe)){
        this.$commonUtils.utilCore.showToast("请填写注销原因")
        return;
      }
      this.$commonUtils.utilCore.showLoading("", { overlay: true });
      const postData = {
        tel: this.reportPhone || '13800138000',//	是	string	联系电话
        content: this.reportDescribe || '',//	是	string	投诉内容
        site_id: this.switchCityInfo.city_id || '',//	是	string	城市id
        from_url: this.$route.path || '',//	是	string	反馈提交页面
        from_type: "4",//	否	string	反馈系统(默认2)，1:pc网站,2:小程序,3.裕丰经纪app,4.裕丰地产app
      }

      postData.content = "用户的user_id【"+ this.userId + "】"+ postData.content
      const res = await this.$store.dispatch('user/getAppWechatcFeedbackAcreate', postData);
      this.$commonUtils.utilCore.closeLoading()
      if (res.code == 200) {
        this.$commonUtils.utilCore.showDialog({message:"注销帐号申请已提交<br>将于2个工作日内处理"})
      }
      setTimeout(() => {
        this.reportPhone = ''
        this.reportDescribe = ''
        this.showPopupUser = false
      }, 1000);
    },
  }
}
</script>

<style lang="scss" scoped>
.setting {
  height: 100vh;
  .wrapper {
    .cell {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.38rem 0.28rem 0.32rem 0;
      margin-left: 0.44rem;
      border-bottom: 0.01rem solid #e5e5e5;
      .left {
        font-size: 0.28rem;
        font-weight: 400;
        color: #545454;
        display: flex;
        align-items: center;
        img {
          width: 0.88rem;
          height: 0.34rem;
          display: block;
          padding-left: 0.28rem;
        }
      }
      .right {
        display: flex;
        align-items: center;
        img {
          width: 0.4rem;
          height: 0.4rem;
          display: block;
        }
        .edition {
          font-size: 0.28rem;
          font-weight: 400;
          color: #9b9b9b;
        }
      }
    }
  }
  .footer {
    width: 100%;
    position: fixed;
    bottom: 0;
    background: #ffffff;
    box-shadow: 0rem -0.04rem 0.08rem 0rem rgba(0, 0, 0, 0.08);
    padding: 0.26rem 0;
    .btn-return {
      width: 6rem;
      height: 0.8rem;
      margin: 0 auto;
      text-align: center;
      line-height: 0.8rem;
      font-size: 0.32rem;
      font-weight: 400;
      color: #000000;
      background: #ffce09;
      border-radius: 0.1rem;
    }
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
  .report-container {
    // width: 6.68rem;
    .title {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      padding: 0.2rem 0;
      .title-name {
        font-size: 0.3rem;
      }
      .close-img {
        position: absolute;
        right: 0.2rem;
        img {
          width: 0.28rem;
          height: 0.28rem;
          display: block;
        }
      }
    }
    .container {
      padding: 0 0.3rem 0.2rem;
      .container-title {
        font-size: 0.28rem;
        padding-bottom: 0.1rem;
      }
      textarea {
        width: 5.2rem;
        height: 3rem;
        border: 0.02rem solid #d1d1d1;
        border-radius: 0;
        font-size: 0.28rem;
        padding: 0.2rem;
      }
      input {
        width: 5.2rem;
        // height: 1rem;
        font-size: 0.28rem;
        display: block;
        border: 0.02rem solid #d1d1d1;
        border-radius: 0;
        padding: 0.1rem 0.2rem;
      }
    }
    .submit {
      width: 3rem;
      height: 0.8rem;
      font-size: 0.32rem;
      font-weight: 400;
      color: #ffffff;
      text-align: center;
      line-height: 0.8rem;
      background: #52a3ff;
      border-radius: 0.08rem;
      margin: 0.2rem auto 0.5rem;
    }
  }
  .van-popup--center.van-popup--round {
    border-radius: 0.1rem;
  }
}
</style>
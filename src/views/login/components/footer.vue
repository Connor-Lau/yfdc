<template>
  <div class="footer" :style="{position: ishow ? 'fixed' : 'relative'}">
    <div class="footer-top">
      <div class="line"></div>
      <span>其他登录方式</span>
      <div class="line"></div>
    </div>
    <div class="otherBtn">
      <div v-if="oneClick" @click="actOneClick">
        <img :src="$appConfig.appWebStaticUrl + 'login/icon_otherbtn01.png'" alt="">
        <span>本机一键登录</span>
      </div>
      <div v-if="appleLogin" @click="actAppleLogin">
        <img :src="$appConfig.appWebStaticUrl + 'login/icon_apple.png'" alt="">
        <span>苹果登录</span>
      </div>
      <div v-if="otherMobile" @click="toolsGoPageView({path:'/login/otherPhone'})">
        <img :src="$appConfig.appWebStaticUrl + 'login/icon_otherbtn02.png'" alt="">
        <span>其他手机登录</span>
      </div>
      <div v-if="wechatLogin" @click="toolsGoPageView({path:'/login/wechatLogin'})">
        <img :src="$appConfig.appWebStaticUrl + 'login/icon_otherbtn03.png'" alt="">
        <span>微信登录</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      iconText: [
        {
          url: '',
          text: ''
        }
      ],
      ishow: true,
      innerHeight: 0,
    }
  },
  props: {
    oneClick: {
      type: Boolean,
      default: true,
    },
    otherMobile: {
      type: Boolean,
      default: true,
    },
    wechatLogin: {
      type: Boolean,
      default: true,
    },
    appleLogin: {
      type: Boolean,
      default: false,
    },
  },
  created () {
    this.innerHeight = window.innerHeight;
    this.handleShowFooter()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize);  //移除事件
  },
  methods: {
    iosAndroid () {
      const ua = window.navigator.userAgent;
      let phoneType = ""
      if (/iPhone|iPod|iPad/i.test(ua)) {
        phoneType = "ios"
      }
      if (/Android/i.test(ua)) {
        phoneType = "Android"
      }
      return phoneType;
    },
    handleResize () {
      const newInnerHeight = window.innerHeight;
      if (this.innerHeight > newInnerHeight) {
        // 键盘弹出事件处理
        this.ishow = false;
      } else {
        // 键盘收起事件处理
        this.ishow = true;
      }
    },
    handleShowFooter () {
      const type = this.iosAndroid();
      if (type === "Android") {
        window.addEventListener('resize', this.handleResize);
      } else if (type === "ios") {
        // window.addEventListener('focusin', () => {
        //   // 键盘弹出事件处理
        //   // alert("iphone 键盘弹出事件处理")
        //   this.ishow = false;
        // });
        // window.addEventListener('focusout', () => {
        //   // 键盘收起事件处理
        //   this.ishow = true;
        // });
      }
    },
    /**
     * 本机一键登录
     */
    actOneClick: function () {
      this.$emit("actOneClick");
    },
    /**
    苹果登陆
    */
    actAppleLogin:function(){
      this.$emit("actAppleLogin");
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  position: fixed;
  bottom: 0;
  font-size: 1rem;
  .footer-top {
    display: flex;
    align-items: center;
    padding: 0 0.56rem 0 0.6rem;
    .line {
      width: 2rem;
      height: 0.02rem;
      background: #333333;
      opacity: 0.1;
    }
    span {
      font-size: 0.24rem;
      font-weight: 500;
      color: #383838;
      padding: 0 0.36rem 0 0.38rem;
    }
  }
  .otherBtn {
    display: flex;
    justify-content: space-between;
    padding: 0.4rem 1.26rem 0.92rem 1.06rem;
    div {
      display: flex;
      align-items: center;
      flex-direction: column;
      img {
        width: 0.6rem;
        height: 0.6rem;
      }
      span {
        font-size: 0.2rem;
        font-weight: 500;
        color: #737373;
        padding-top: 0.22rem;
      }
    }
  }
}
</style>
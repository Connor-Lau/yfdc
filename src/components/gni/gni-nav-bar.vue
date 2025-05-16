<template>
  <div :class="{ 'no-background': noBackground }" class="house-head">
    <div
      :style="{
        'padding-top': tmpStatusBarHeight + 'px',
        background: background,
        ...styleCss,
      }"
      v-if="!isShowNav"></div>
    <van-nav-bar
      :style="{
        'padding-top': tmpStatusBarHeight + 'px',
        background: background,
        height: '0.92rem',
        ...styleCss,
      }"
      fixed
      safe-area-inset-top
      @click-left="onClickLeft"
      @click-right="onClickRight"
      v-if="isShowNav">
      <template #title>
        <div class="head-nav-title" :style="{ color: color }" @click="onClickTitle">
          <span class="page-title font-encode" v-html="pageTitle">{{ pageTitle }}</span>
        </div>
      </template>
      <template #left>
        <div v-if="hideLeft">
          <van-icon name="arrow-left" class="house-head-left" v-if="color" :color="color" />
          <div class="head-nav-icon icon-back" v-else></div>
        </div>
        <slot name="slot-left" />
      </template>

      <template #right>
        <div v-show="hideRight && !soleApply" class="head-nav-icon" :class="rightIcon"></div>
        <div v-show="hideRight && soleApply" class="head-nav-icon" :class="rightWhiteIcon"></div>
        <div class="header-right-btn" v-if="rightButton">{{ rightBtnText }}</div>
        <div class="header-right-radius-btn" v-if="rightRadiusButton">
          {{ rightRadiusBtnText }}
        </div>
        <div class="header-right-text" v-if="rightText">{{rightText}}</div>
        <div class="header-right-text trans-info-right" v-if="transBool" @click.stop="onTransRight">
          <van-icon name="search" />
          {{transInfo}}
        </div>
        <slot name="slot-right" />
      </template>
    </van-nav-bar>
    <div class="perch" :style="perchStyle" v-if="isShowNav"></div>
  </div>
</template>

<script>
export default {
  props: {
    //标题名称
    pageTitle: {
      type: String,
      default: "",
    },
    //左按钮
    hideLeft: {
      type: Boolean,
      default: true,
    },
    hideRight: {
      type: Boolean,
      default: true,
    },
    noBackground: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "",
    },
    activeApply: {
      type: Boolean,
      default: false,
    },
    soleApply: {
      type: Boolean,
      default: false,
    },
    rightButton: {
      type: Boolean,
      default: false,
    },
    rightBtnText: {
      type: String,
      default: "",
    },
    rightIcon: {
      type: String,
      default: "icon-more",
    },
    rightWhiteIcon: {
      type: String,
      default: "icon-more-white",
    },

    rightText: {
      type: String,
      default: "",
    },
    statusBarHeight: {
      type: [String, Number],
      default: 0,
    },
    // 右边圆角按钮
    rightRadiusButton: {
      type: Boolean,
      default: false,
    },
    // 右边圆角按钮文案
    rightRadiusBtnText: {
      type: String,
      default: "",
    },
    // 自定义style样式
    styleCss: {
      type: Object,
      default () {
        return {}
      },
    },
    // 是否显示导航栏内容
    isShowNav: {
      type: Boolean,
      default: true,
    },
    // 是否是交易信息页面
    transBool: {
      type: Boolean,
      default: false,
    },
    // 交易信息右上角信息
    transInfo: {
      type: String,
      default: "",
    },
  },
  data () {
    return {
      background: this.$appConfig.appWebStaticUrl + "/house/icon/form_bg.png",
      //获取的状态栏高度
      tmpStatusBarHeight: 0,
    };
  },
  computed: {
    perchStyle () {
      return {
        height: `calc(${this.tmpStatusBarHeight}px + 0.92rem)`,
        width: "100vw",
        minHeight: '0.92rem'
      };
    },
  },
  mounted () {
    if (this.$store.state.app.systemInfo.statusBarHeight) {
      window.localStorage._statusBarHeight = this.$store.state.app.systemInfo.statusBarHeight; //为了处理 支付go() 返回 statusBarHeight 丢失 导致 导航栏与 状态栏文字重叠
    }
    if (this.$store.state.app.systemInfo.statusBarHeight) {
      this.tmpStatusBarHeight = this.$store.state.app.systemInfo.statusBarHeight;
    }
    if (this.$store.state.app.systemInfo.statusBarHeight === undefined) {
      this.tmpStatusBarHeight = window.localStorage._statusBarHeight || 0; //支付go() 返回 
    }
    //如果有传入状态栏值，则使用传入的
    if (this.statusBarHeight > 0) {
      this.tmpStatusBarHeight = this.statusBarHeight;
    }
    this.$commonUtils.appLog.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%555555", this.$store.state.app.systemInfo.statusBarHeight, this.tmpStatusBarHeight, this.$store.state.app.systemInfo);
    this.activeApply ? this.listenerFunction() : "";
  },
  created () {
    this.activeApply ? this.listenerFunction() : "";
  },
  beforeDestroy () {
    document.removeEventListener("scroll", this.listenerFunction);
  },
  methods: {
    onClickTitle: function () {
      this.$emit("onClickTitle");
    },
    onClickLeft: function () {
      this.$emit("onClickLeft");
    },
    onClickRight: function () {
      this.$emit("onClickRight");
    },
    onTransRight: function () {
      this.$emit("onTransRight");
    },

    listenerFunction (e) {
      document.addEventListener("scroll", this.handleScroll, true);
    },
    handleScroll () {
      if (this.activeApply && window.pageYOffset > 16) {
        this.background =
          "url(" + this.$appConfig.appWebStaticUrl + "/house/icon/form_bg.png" + ")";
      } else if (this.activeApply) {
        this.background = "";
      }
    },
    getNavHeight () {
      const navHeight = document.querySelector(".house-head");
      return navHeight.offsetHeight || 0;
    },
    // 外部获取刘海高度
    getTmpStatusBarHeight () {
      return this.tmpStatusBarHeight || 0;
    }
  },
};
</script>

<style lang="scss" scoped>
::v-deep .van-nav-bar__content {
  // background: #f8f8f8;
  height: 0.92rem;
  line-height: 0.92rem;
}
/deep/ .van-nav-bar__title {
  max-width: 80%;
}
.no-background {
  background: transparent;
  // background: #f8f8f8;
  height: 0;
  .van-nav-bar {
    background: transparent;
    &::after {
      border: 0;
    }
  }
}
.house-head {
  z-index: 1000;
  position: relative;
}
.house-head-left {
  color: #ffffff;
  font-size: 0.34rem;
  margin: 0 auto;
  display: block;
}
.header-right-btn {
  padding: 0.5px 5px;
  background-color: #3b97ff;
  font-size: 10px;
  color: #fff;
  margin-right: 4px;
  border-radius: 1px;
  line-height: 1.6;
}
.header-right-text {
  color: #111111;
  font-size: 13px;
}
.header-right-radius-btn {
  width: 1.26rem;
  height: 0.44rem;
  font-size: 0.24rem;
  font-family: SourceHanSansCN-Normal, SourceHanSansCN;
  font-weight: 400;
  color: #207fef;
  line-height: 0.44rem;
  background: #e7eff7;
  border-radius: 0.28rem;
  border: 0.02rem solid #207fef;
}
.trans-info-right {
  color: #032a98;
  font-size: 0.28rem;
  display: flex;
  align-items: center;
  .van-icon {
    margin-right: 0.08rem;
    font-weight: bold;
    color: #032a98;
  }
}
</style>

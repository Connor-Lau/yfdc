<template>
  <div>
    <!-- <gni-nav-bar :pageTitle="headTitle" :hideRight="false" :hideLeft="false"></gni-nav-bar> -->
    <div class="bg-box"></div>
    <div :style="{backgroundImage:'url('+$appConfig.appWebStaticUrl + ('common/download/bg.jpg')+')'}" class="download-bg">
      <!-- <div class="flex flex-col justify-center items-center w-full absolute bottom-0 mb-8">
        <div
          class="text-white text-center flex flex-col justify-center items-center mb-2"
          @click="doDownloadAndroidClick">
          <van-image class="item-download-btn" :src="$appConfig.appWebStaticUrl+'common/download/android.png'" />
          <span class="text-sm">安卓最新版本：{{ appVersion.version }}</span>
        </div>
        <div
          class="text-white text-center flex flex-col justify-center items-center mb-2"
          @click="doDownloadIosClick">
          <van-image class="item-download-btn" :src="$appConfig.appWebStaticUrl+'common/download/ios.png'" />
          <span class="text-sm">苹果最新版本：{{ appVersion.version }}</span>
        </div>
      </div> -->
      <div class="download-btns">
        <div class="item-btn" @click="doDownloadIosClick">
          <van-image :src="$appConfig.appWebStaticUrl+'common/download/download-ios.png'" />
        </div>
        <div class="item-btn" @click="doDownloadAndroidClick">
          <van-image :src="$appConfig.appWebStaticUrl+'common/download/download-android.png'" />
        </div>
      </div>
    </div>
    <van-overlay z-index="1001" class-name="download-overlay" background-color="rgba(0, 0, 0, 0.1)" :show.sync="popupTipShow" @click="popupTipShow = false" :able-mask-close="true" :able-close="false" theme="none" type="top">
      <div
        :style="{backgroundImage:'url('+$appConfig.appWebStaticUrl+('common/download/tip.png')+')',width:'7.5rem',height:'5rem'}"
        class="w-full bg-no-repeat bg-cover"
        @click="doPopupTipClose">
        <div class="text-white flex flex-col px-16 py-12 text-right tips">
          <span>链接跳转被限制了</span>
          <span>请点击右上角</span>
          <span>选择在浏览器打开</span>
          <span>继续下载</span>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import gniNavBar from '@/components/gni/gni-nav-bar.vue'
import { mapState, mapActions } from "vuex";
export default {
  components: { gniNavBar },
  data () {
    return {
      headTitle: "下载APP",
      popupTipShow: false,
      appVersion: {},
      //iosUrl: "https://apps.apple.com/cn/app/裕丰地产/id1555197906",
      //androidUrl: "https://siulum.lanzoui.com/iGh4irdcpli",
      iosUrl: "https://apps.apple.com/cn/app/%E8%A3%95%E4%B8%B0%E5%9C%B0%E4%BA%A7-%E4%BA%8C%E6%89%8B%E6%88%BF%E7%A7%9F%E6%88%BF%E6%96%B0%E6%88%BF%E5%95%86%E9%93%BA/id1374749022",
      androidUrl: "https://server.m.pp.cn/download/apk?appId=7746152&custom=0&ch_src=pp_dev&ch=default"
    }
  },
  computed: {
    platform () {
      return this.$app.utilEnv.getPlatform()
    }
  },
  methods: {
    ...mapActions('app', ['getWgtInfo']),
    //获取版本信息
    async doGetWgtInfo () {
      let dataInfo = await this.getWgtInfo(this.$messageAct)
      console.log("得到信息为：")
      console.log(JSON.stringify(dataInfo))
      this.appVersion = dataInfo;
    },
    /**
     * 是否微信浏览器
     */
    isH5WeChat: function () {
      let result = false
      result = /MicroMessenger/i.test(window.navigator.userAgent)
      return result
    },
    doDownloadAndroidClick () {
      if (this.isH5WeChat()) {
        this.popupTipShow = true
        return false
      }
      window.open(this.androidUrl)
    },
    doDownloadIosClick () {
      if (this.isH5WeChat()) {
        this.popupTipShow = true
        return false
      }
      window.open(this.iosUrl)
    },
    doPopupTipClose () {
      this.popupTipShow = false
    }
  }
}
</script>

<style lang="scss">
// 房源项目全局样式
@import "~@/common/styles/base";
.bg-box {
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-image: linear-gradient(to right, #febc1c 50%, #feaf17 150%);
  z-index: 1;
}
.download-bg {
  position: fixed;
  width: 100%;
  height: 100%;
  background-size: 100%;
  display: flex;
  flex-direction: column;
  background-repeat: no-repeat;
  z-index: 2;
  .text-sm {
    line-height: 1.6;
  }
}
.item-download-btn {
  width: 2.7rem;
  height: 0.65rem;
}
.tips {
  font-size: 0.22rem;
  padding: 1.2rem 1.6rem;
  line-height: 1.6;
}
.download-overlay {
  background-color: rgba(0, 0, 0, 0.5);
}
.download-btns {
  position: fixed;
  bottom: 1.7rem;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  .item-btn {
    margin-top: 0.4rem;
    // width: 3.18rem;
    // height: 0.66rem;
    // background: #005BE8;
    // border-radius: 0.14rem;
    font-size: 0.3rem;
    font-family: SourceHanSansCN-Medium, SourceHanSansCN;
    font-weight: 500;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    // line-height: 0.46rem;

    width: 4rem;
    height: 0.8rem;
    .van-image {
      width: 100%;
      display: block;
    }
  }
}
</style>
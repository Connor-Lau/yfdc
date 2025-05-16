<template>
  <div class="house-details">
    <gni-nav-bar
      :pageTitle="headTitle"
      @onClickLeft="onClickBack"
      :hideRight="false"></gni-nav-bar>
    <!-- scrolling=“no”表示不显示滚动条 -->
    <iframe :src="url" id="modifineIframe" frameborder="0" style="position: absolute; top: 0; left: 0; box-sizing: border-box;" :style="{'padding-top':topHeight,}"></iframe>
  </div>
</template>
<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
export default {
  components: {
    gniNavBar
  },
  data () {
    return {
      topHeight: 0,
      tmpStatusBarHeight: 0,
      headTitle: "",
      url: ""
    }
  },
  computed: {

  },
  async beforeMount () {
    this.headTitle = this.$route.query.headTitle;
    this.url = this.$route.query.url;
  },
  async mounted () {
    let sysName = this.$commonUtils.utilCore.getSys();
    if (this.$store.state.app.systemInfo.statusBarHeight && sysName == "Android") {
      this.tmpStatusBarHeight = this.$store.state.app.systemInfo.statusBarHeight;
    }
    // iframe 宽高自适应
    this.changeModifineIframe();
    let that = this;
    window.onresize = function () {
      that.changeModifineIframe()
    }
  },
  methods: {
    // iframe 宽高自适应
    changeModifineIframe () {
      // 导航条高度
      this.topHeight = `calc(${this.tmpStatusBarHeight}px + 0.93rem)`;
      const modifineIframe = document.getElementById("modifineIframe");
      const deviceWidth = document.body.clientWidth
      const deviceHeight = document.body.clientHeight
      modifineIframe.style.width = (Number(deviceWidth)) + 'px';
      modifineIframe.style.height = `100vh`
      // modifineIframe.style.height = `100%`
      // modifineIframe.style.height = `300px`
    },
    onClickBack () {
      this.$router.go(-1)
    },
  }
}
</script>
<style lang="scss">
</style>
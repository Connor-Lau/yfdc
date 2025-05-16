<template>
  <div class="home">
    <gni-nav-bar :pageTitle="pageTitle" @onClickLeft="onClickLeft" :hideRight="false"></gni-nav-bar>
    <gniPreviewpdfH5 ref="previewPdfh5"></gniPreviewpdfH5>
    <!-- <page-bottom-button @confirm="onSubmitClick" @close="showClose" :is-page="true" leftText="关闭"></page-bottom-button> -->
  </div>
</template>

<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import gniPreviewpdfH5 from '@/components/gni/gni-previewpdf-h5.vue'
import pageBottomButton from "@/components/yni/page-bottom-button.vue";
export default {
  components: {
    gniNavBar,
    gniPreviewpdfH5,
    pageBottomButton,
  },
  data () {
    return {
      pageTitle: "查看PDF",
    }
  },
  mounted () {
    //this.$refs.previewPdfh5.openPdf('https://celiang.oss-cn-hangzhou.aliyuncs.com/measurement/2022-01/18/75it6phpocqYFV1642488558220118.pdf')
    //this.$refs.previewPdfh5.openPdf('https://appv2.yfdc.net:444/testF.php')
    this.$refs.previewPdfh5.openPdf(this.$route.query.url)
  },
  methods: {
    onSubmitClick () {
      this.$commonUtils.appLog.log('onSubmitClick');
    },
    showClose () {
      this.$commonUtils.appLog.log('showClose');
      this.onClickLeft();
    },
    //返回上一层
    onClickLeft () {
      this.$router.go(-1); //返回上一层
    },
  }
}
</script>

<style lang='scss' scoped>
/deep/ ._bottom-button-box {
  z-index: 99;
}
</style>
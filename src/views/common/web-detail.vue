<template>
  <div>

  </div>
</template>

<script>
// 用于跳转新闻详情
export default {
  data () {
    return {
    }
  },
  beforeCreate () {
    const url = this.$route.query.url;
    const title = this.$route.query.title;
    if (this.$route.query.appPath) {
      this.$commonUtils.utilCore.uniGoPage(this.$route.query.appPath + "&title=" + title);
    } else {
      let toUrl = '/pages/common/web-view-show/web-detail?hideNav=no&url=' + url + "&title=" + title;
      this.$commonUtils.appLog.log("mmmmmmmmmmm=========>>>", toUrl)
      this.$commonUtils.utilCore.uniGoPage(toUrl);
    }
  },
  methods: {

  }
}
</script>
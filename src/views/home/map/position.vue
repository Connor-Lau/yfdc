<template>
  <div>
    <gni-nav-bar :pageTitle="pageTitle" @onClickLeft="onClickLeft" :hideRight="false" ref="navBar"></gni-nav-bar>
    <div class="house-main">
      <iframe
        style="border:none"
        :style="{height: searchTableHeight + 'px',width: searchTableWidth + 'px'}"
        :src="mapLink">
      </iframe>
    </div>
  </div>
</template>

<script>
import gniNavBar from '@/components/gni/gni-nav-bar.vue'

export default {
  components: { gniNavBar },
  data () {
    return {
      pageTitle: "周边配套及通勤",
      mapLink: "",
      searchTableHeight: 0,
      searchTableWidth: 0,
    };
  },
  mounted () {
    window.onresize = () => {
      this.widthHeight(); // 自适应高宽度
    };
    this.$nextTick(() => {
      this.widthHeight();
    })
    this.init()
  },
  methods: {
    widthHeight () {
      this.searchTableWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || '100%';
      this.searchTableHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - (this.$refs.navBar.getNavHeight());
    },
    init () {
      const param = {
        longitude: this.$route.query.longitude,
        latitude: this.$route.query.latitude,
        address: this.$route.query.address,
        label: this.$route.query.label,
        key: this.$route.query.label,
        tag: this.$route.query.tag,
        hideNavBar: 1
      }
      this.mapLink = this.$commonUtils.utilCore.url('https://mapp.yfdc.net/v1/index.php?m=Fang&c=Map&a=position2', param);
    },
    onClickLeft () {
      this.$router.go(-1);//返回上一层
    },
  }
}
</script>

<style lang="scss" scoped>
.map-route-detail-wrap {
  margin: 0 !important;
}
.house-main {
  position: relative;
}
</style>

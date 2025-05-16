<template>
  <div class="activation-apply">
    <gni-nav-bar :pageTitle="headTitle" :noBackground="true" color="#303030" @onClickLeft="onClickBack" :hideRight="false"></gni-nav-bar>
    <div>
      这是功能测试页<br>
      <div @click="toolsGoPageView({path:'/common/index'})">去首页</div>
      <div @click="clickTest()">去测试页</div>
    </div>
    <gniTabbar curP="/common/login" ref="tabbarView"></gniTabbar>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import gniTabbar from "@/components/gni/gni-tabbar.vue";

export default {
  components: {
    gniNavBar,
    gniTabbar,
  },
  data () {
    return {
      headTitle: "功能测试页面"
    }
  },
  mounted () {

  },
  methods: {
    onClickBack () {
      this.$router.go(-1);
    },
    clickTest () {
      console.log("UUUUUUUUUUUUUUUUUUUUUUUUUUUU");
      window.parent.handleRightColumn();
    }
  }
}

</script>

<style lang="scss" scoped>
// 蓝色背景 头部导航
.activation-apply {
  background: #ededed url("~@/assets/form_bg.png") no-repeat;
  background-size: 100%;
  min-height: 100vh;

  .van-nav-bar {
    background: transparent;

    .house-head-title,
    .house-head-left {
      color: #ffffff;
    }
  }

  [class*="van-hairline"]::after {
    border: none;
  }
}
::v-deep .no-background {
  height: auto !important;
}
</style>
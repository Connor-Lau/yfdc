<template>
  <div>
    <gni-nav-bar :isShowNav="false" :pageTitle="headTitle" @onClickLeft="onClickBack" :hideRight="false"></gni-nav-bar>
    <div>
      这是登陆页<br>
      <div @click="toolsGoPageView({path:'/common/index'})">去首页</div><br><br><br>
      <div @click="toolsGoPageView({path:'/tools/test'})">去测试页</div><br><br><br>
      <div @click="actLogin()">一键登陆</div>
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
      headTitle: "用户登陆"
    }
  },
  mounted () {
  },
  methods: {
    onClickBack () {
      this.$router.go(-1);
    },
    async actLogin () {
      await this.$store.dispatch('test/uniGetProvider', this.$messageAct);
    }
  }
}

</script>
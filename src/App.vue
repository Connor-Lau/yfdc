<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"> </router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data () {
    return {
      sysUnreadTimeOutTime: false, //定时器
    };
  },
  computed: {
    ...mapState("user", ["isLogin"]),
    ...mapState("im", ["unread"]),
  },
  watch: {
    isLogin (val) {
      if (val) {
        this.getUnreadTimeOut();
      } else {
        this.$store.commit('im/setUnread', 0);
      }
      return val
    },
  },
  mounted () {
    //开启消息数检查
    // this.getUnreadTimeOut();
  },
  methods: {
    //获取消息未读数
    async getUnreadTimeOut () {
      let num = 0;
      if (this.isLogin) {
        num = await this.$store.dispatch('im/_getUnread');
        console.log('ddddd===>首次加载，消息未读数', num)
      } else {
        this.$store.commit('im/setUnread', num);
      }

      // 统一调用方法
      console.log('ddddd===>首次设置桌面角标', num)
      await this.$store.dispatch('im/setDeskBadge', { messageAct: this.$messageAct, num });
      // let jsonData = { "mod": "app", "fun":"actSetDeskBadge","val": tmp_num }
      // console.log('设置桌面角标数-=》: ' + JSON.stringify(jsonData))
      // this.$store.dispatch("app/actModFun",{ messageAct: this.$messageAct, jsonData: jsonData })

      //防止定时器重复
      if (this.sysUnreadTimeOutTime) {
        clearTimeout(this.sysUnreadTimeOutTime);
      }
      //每10秒检查一次消息数
      this.sysUnreadTimeOutTime = setTimeout(() => {
        this.getUnreadTimeOut()
      }, 10000)
    }
  },
};
</script>
<style lang="scss">
// 重定义加载进度条的样式
#nprogress .bar {
  background: red !important;
}

.van-icon__image {
  vertical-align: baseline;
}
img {
  vertical-align: middle;
}
// 隐藏 input [type=search] 的默认边框和删除按钮
input[type="search"] {
  -webkit-appearance: textfield;
  -webkit-box-sizing: content-box;
  font-family: inherit;
  font-size: 100%;
}
input::-webkit-search-decoration,
input::-webkit-search-cancel-button {
  display: none;
}
.slide-left-enter {
  opacity: 0;
  -webkit-transform: translate(30px, 0);
  transform: translate(30px, 0);
}
.slide-left-enter-active {
  transition: all 0.5s ease;
}
.slide-left-leave-to {
  opacity: 0;
  -webkit-transform: translate(-30px, 0);
  transform: translate(-30px, 0);
}
.slide-left-leave-active {
  transition: all 0.5s ease;
}
</style>


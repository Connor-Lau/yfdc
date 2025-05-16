<template>
  <div :style="tabCss">
    <div class="_tabbar-box flex fixed items-center content-center" :class="bgClass">
      <div v-for="(item,index) in list" :key="index" class="action relative" :style="[{ height:  (height ? ( height+ 'px') : tabHeight)}]" @click="handleChange(item)">
        <img :src="pageCur === item.pagePath ? item.selectedIconPath : item.iconPath " />
        <div class="text-h" :class="[pageCur === item.pagePath ? 'selectedColor' : 'color' ]">{{ item.text }}</div>
        <template v-if="item.pagePath === '/im/index'">
          <div class="absolute line-none inline-block radius-full text-x z-10 transformt-50 absolute-div" v-if="unread > 0">
            {{ unread > 99 ? "99+" : unread }}
          </div>
        </template>
        <template v-else>
          <div class="absolute line-none inline-block radius-full text-x z-10 transformt-50 absolute-div" v-if="item.unreadNum > 0">
            {{ item.unreadNum > 99 ? "99+" : item.unreadNum }}
          </div>
        </template>
      </div>
    </div>
    <div class="w-full top-bottom" :class="hBgClass" :style="[{ height:  (height ? ( height+ 'px') : tabHeight)}]"></div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
/*
用法：
 import gniTabbar from "@/components/gni/gni-tabbar.vue";
 1.用默认 导航栏数据： <gniTabbar></gniTabbar>
 2.不用默认 导航栏数据：
 <gniTabbar :menus="[]"></gniTabbar>
*/
/* [
  {
    text: '楼盘', //导航栏标题
    pagePath: '', // 页面路径 $router
    iconPath: '',// 未选择icon
    selectedIconPath: '', // 已选择icon
    query: {}, // 跳转页面参数
    unreadNum: 0, // 右边标红数量
    isApp: false, // 是否跳转APP页面
  }
] */
export default {
  name: "gni-tabbar",
  props: {
    // 导航栏数据
    menus: {
      type: Array,
      default () {
        return [
          {
            text: '首页', //导航栏标题
            pagePath: '/home/index', // 页面路径 $router
            iconPath: this.$appConfig.appWebStaticUrl + 'common/tabbar/icon_index.png',// 未选择icon
            selectedIconPath: this.$appConfig.appWebStaticUrl + 'common/tabbar/icon_index_yes.png', // 已选择icon
            query: {}, // 跳转页面参数
            unreadNum: 0, // 右边标红数量
            isApp: false, // 是否跳转APP页面
          },
          {
            text: '消息', //导航栏标题
            pagePath: '/im/index', // 页面路径 $router
            iconPath: this.$appConfig.appWebStaticUrl + 'common/tabbar/icon_im.png',// 未选择icon
            selectedIconPath: this.$appConfig.appWebStaticUrl + 'common/tabbar/icon_im_yes.png', // 已选择icon
            query: {}, // 跳转页面参数
            unreadNum: 0, // 右边标红数量
            isApp: false, // 是否跳转APP页面
          },
          {
            text: '我的', //导航栏标题
            pagePath: '/user/index', // 页面路径 $router
            iconPath: this.$appConfig.appWebStaticUrl + 'common/tabbar/icon_user.png',// 未选择icon
            selectedIconPath: this.$appConfig.appWebStaticUrl + 'common/tabbar/icon_user_yes.png', // 已选择icon
            query: {}, // 跳转页面参数
            unreadNum: 0, // 右边标红数量
            isApp: false, // 是否跳转APP页面
          },
        ]
      }
    },
    //是否$router.push 兼容线上
    isPush: {
      type: Boolean,
      default: true
    },
    // 默认选中
    curP: {
      type: String,
      default: '/custom/list'
    },
    // 背景色class ~@/common/styles/base
    bgClass: {
      type: String,
      default: 'bg-white'
    },
    hBgClass: {
      type: String,
      default: ''
    },
    // 可传导航栏 高度
    height: {
      type: [Number],
      default: 0
    },
    tabCss: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      pageCur: '', // 控制选中
      tabHeight: "1rem", // 默认导航栏高度
      list: [],
    }
  },
  computed: {
    ...mapState('im', ['unread']),
  },
  watch: {
    curP: {
      immediate: true,
      handler (newVal) {
        this.pageCur = newVal;
      }
    },
    menus: {
      immediate: true,
      handler (newVal) {
        this.list = newVal;
      }
    }
  },
  mounted () {

  },
  methods: {
    handleChange (e) {
      const pageCur = e.pagePath;
      if (pageCur == this.pageCur) return;
      // this.pageCur = pageCur;
      // 跳转APP页面
      if (e.isApp) {
        this.$commonUtils.utilCore.uniGoPage(pageCur);
      } else {
        // 跳转H5页面
        if (this.isPush) this.$router.push({ path: pageCur, query: { ...e.query } });
      }
      this.$emit('changePage', e); //切换tab 暴露给外面 事件
    },
    // 可供外面 通过 $refs 改变 右边标红数量，或者其他key
    setUnreadNum (index, val, key = "unreadNum") {
      this.list[index][key] = val;
    },
    // 获取底部导航栏高度， 方便外部获取
    getTabbarHeight () {
      const navHeight = document.querySelector("._tabbar-box");
      return navHeight.offsetHeight || 0;
    },
  }
}
</script>

<style lang="scss" scoped>
@import "~@/common/styles/base";
._tabbar-box {
  width: 100%;
  bottom: 0;
  left: 0;
  flex-direction: row;
  justify-content: space-between;
  font-size: 0.24rem;
  // border-top: 0.02rem solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  z-index: 2;
  box-shadow: 0rem 0rem 0.04rem 0.04rem #ececec;
  border-radius: 0.52rem 0.52rem 0rem 0rem;

  .transformt-50 {
    transform: translateX(-50%);
  }

  img {
    width: 0.36rem;
    height: 0.36rem;
    margin-top: 0.14rem;
  }

  .action {
    text-align: center;
    flex: 1;
    // 底部安全区域样式
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    box-sizing: content-box;
  }

  .text-h {
    height: 0.28rem;
    padding-top: 0.06rem;
    font-size: 0.2rem;
  }

  .color {
    color: #979797;
  }

  .selectedColor {
    font-weight: 500;
    color: #000000;
  }

  .absolute-div {
    left: 60%;
    top: 0.04rem;
    border-radius: 0.13rem;
    background: #ff0000;
    color: #fff;
    font-size: 0.24rem;
    min-width: 0.24rem;
    height: 0.28rem;
    line-height: 0.28rem;
    padding: 0 0.04rem;
    text-align: center;
    font-weight: 400;
  }
}
.top-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
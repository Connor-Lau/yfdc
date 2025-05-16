<template>
  <div class="goTop">
    <div class="icons" v-show="visiable==1" @click="handleScrollTop">
      <img :src="$appConfig.appWebStaticUrl + '/user/icon_gotopbg.png'" alt="">
      <div class="text">回到顶部</div>
    </div>
    <div class="icons-end" v-show="visiable==2" @click="visiable=1">
      <img :src="$appConfig.appWebStaticUrl + '/user/icon_arrowLeft01.png'" alt="">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    scrollHeight: {
      typeof: Number,
      default: '1000',
    }
  },
  data () {
    return {
      scrollStart: null, //初始化scrollTop
      scrollEnd: null,  // 滚动结束 记录上一次滚动结束后的滚动距离
      visiable: 0, //默认0不显示 1显示顶部 2显示展开icon
      // scrollHeight: '1000'
    }
  },
  watch: {
    // 监听滚动结束
    scrollStart (newValue, oldValue) {
      setTimeout(() => {
        if (newValue == window.scrollY) {
          // console.log('滚动结束', this.scrollHeight);
          this.scrollEnd = newValue; //每次滚动结束后都要给scrollEnd赋值
          if (this.scrollEnd < this.scrollHeight) {
            this.visiable = 0
          } else {
            this.visiable = 2
          }
        };
      }, 200);
    },
  },
  methods: {
    handleScroll () {
      this.scrollStart = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (this.scrollStart > this.scrollHeight) {
        this.visiable = 1
      } else {
        this.visiable = 0
      }
    },
    handleScrollTop () {
      let top = document.documentElement.scrollTop || document.body.scrollTop;
      this.timer = setInterval(() => {
        document.body.scrollTop = document.documentElement.scrollTop = top -= 50;
        if (top <= 0) {
          clearInterval(this.timer);
        }
      }, 5);
    },
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
 
<style lang="scss" scoped>
.icons {
  position: fixed;
  right: -0.05rem;
  bottom: 30%;
  img {
    width: 1.4rem;
    height: 0.8rem;
    display: block;
  }
  .text {
    font-size: 0.2rem;
    font-weight: 400;
    color: #000000;
    position: absolute;
    top: 0.3rem;
    right: 0.12rem;
  }
}
.icons-end {
  position: fixed;
  right: 0rem;
  bottom: 30%;
  img {
    width: 0.6rem;
    height: 0.8rem;
    display: block;
  }
}
</style>

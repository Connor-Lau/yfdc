<template>
  <div class="houseaddress">
    <gni-nav-bar :pageTitle="headTitle" @onClickLeft="onClickBack" :hideRight="false" :hideLeft="false">
      <template slot="slot-left">
        <div class="nav-left">
          <img :src="$appConfig.appWebStaticUrl + '/commission/icon_return.png'" alt="">
        </div>
      </template>
      <template slot="slot-right">
        <div class="nav-right" @click="onClickBack">
          完成
        </div>
      </template>
    </gni-nav-bar>
    <div class="wrapper" :style="isTips?'filter: blur(5px)':''">
      <input type="text" placeholder="请输入楼栋号">
      <div class="cell">
        <input type="text" placeholder="请输入单元号">
        <div class="cell-right">
          <div class="right-select" @click="nothingNum = !nothingNum">
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_select.png'" alt="" v-if="nothingNum == true">
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_unselect.png'" alt="" v-else>
          </div>
          <span>无单元号</span>
          <div class="right-tips" @click="isTips = true">
            <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_tips.png'" alt="">
          </div>
        </div>
      </div>
      <div class="cell">
        <input type="text" placeholder="请输入门牌号">
        <div class="cell-right">
          <div class="right-select" @click="nothingbrand = !nothingbrand">
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_select.png'" alt="" v-if="nothingbrand == true">
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_unselect.png'" alt="" v-else>
          </div>
          <span>无单元号</span>
          <div class="right-tips" @click="isTips = true">
            <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_tips.png'" alt="">
          </div>
        </div>
      </div>
    </div>
    <!-- 提示遮罩层 -->
    <van-overlay :show="isTips" :z-index="1001" class-name="tips-overlay">
      <div class="block">
        <div class="oly-title">无单元号</div>
        <div class="oly-line"></div>
        <div class="oly-text">什么是单元号
        </div>
        <div class="oly-text">楼栋没有划分具体单位，或者特殊的房屋(别墅、四合院、平房阁楼)没有单元号，请选择“无单元号”
        </div>
        <div class="oly-close" @click="isTips=false">
          <img :src="$appConfig.appWebStaticUrl + '/commission/icon_transparentclose.png'" alt="">
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import gniNavBar from '@/components/gni/gni-nav-bar.vue'
export default {
  components: { gniNavBar },
  data () {
    return {
      headTitle: '输入房屋地址', //标题文字
      isTips: false, // 提示遮罩层
      nothingNum: false, // 无单元号
      nothingbrand: false, // 无单元号（门牌号）
    }
  },
  methods: {
    //返回上一层
    onClickBack () {
      this.toolsGoPageBack();
    },
  }
}
</script>

<style lang="scss" scoped>
.houseaddress {
  height: 100vh;
  .nav-left {
    img {
      width: 0.4rem;
      height: 0.36rem;
      display: block;
    }
  }
  .nav-right {
    font-size: 0.28rem;
    font-weight: 400;
    color: #000000;
  }
  .wrapper {
    margin: 0 0.4rem;
    input {
      width: 100%;
      height: 1.08rem;
      font-size: 0.32rem;
      font-weight: 400;
      box-sizing: border-box;
      border: none;
      border-bottom: 0.02rem solid #f7f7f7;
      display: block;
    }
    .cell {
      position: relative;
      .cell-right {
        display: flex;
        align-items: center;
        position: absolute;
        top: 0.38rem;
        right: 0;
        .right-select {
          img {
            width: 0.3rem;
            height: 0.3rem;
            display: block;
          }
        }
        span {
          font-size: 0.3rem;
          font-weight: 400;
          color: #000000;
          padding-right: 0.2rem;
          padding-left: 0.1rem;
        }
        .right-tips {
          img {
            width: 0.28rem;
            height: 0.28rem;
            display: block;
          }
        }
      }
    }
  }
  .tips-overlay {
    background: rgba(0, 0, 0, 0.82);
    .block {
      color: #ffffff;
      padding-top: 2.5rem;
      .oly-title {
        font-size: 0.34rem;
        font-weight: bold;
        padding-bottom: 0.38rem;
        text-align: center;
      }
      .oly-line {
        width: 5.46rem;
        height: 0.02rem;
        background: #f7f7f7;
        margin-left: 1.02rem;
        margin-bottom: 0.78rem;
      }
      .oly-text {
        font-size: 0.28rem;
        font-weight: 400;
        text-align: justify;
        padding: 0 1.16rem 0.72rem;
        line-height: 0.4rem;
      }
      .oly-close {
        margin-top: 7rem;
        img {
          width: 0.72rem;
          height: 0.72rem;
          display: block;
          margin: 0 auto;
        }
      }
    }
  }
}
</style>
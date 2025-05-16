<template>
  <div class="_bottom-button-box" :style="boxStyle">
    <div class="flex text-center bg-white _bottom-button">
      <van-button class="cancel-btn" plain block type="info" @click="handleBack" v-if="leftText" :class="cancelClass">{{
        leftText
      }}</van-button>
      <p class="center-line" v-if="leftText && rightText"></p>
      <van-button class="submit-btn" block type="info" @click="handleConfirm" v-if="rightText" :class="submitClass">{{
        rightText
      }}</van-button>
    </div>
  </div>
</template>

<script>
// 页面底部退出、确定按钮UI组件,可用于页面以及弹窗
// 外部应用参考： <page-bottom-button @confirm="confirm"></page-bottom-button>
export default {
  name: "PageBottomButton",
  props: {
    boxStyle: {
      type: String,
      default: "",
    },
    // 是否是页面，false：可用弹窗
    isPage: {
      type: Boolean,
      default: true,
    },
    // 左边按钮文案，为空不显示
    leftText: {
      type: String,
      default: "退出",
    },
    // 右边按钮文案，为空不显示
    rightText: {
      type: String,
      default: "确定",
    },
    cancelClass: {
      type: String,
      default: "",
    },
    submitClass: {
      type: String,
      default: "",
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    //   关闭按钮事件
    handleBack() {
      this.isPage ? this.$router.go(-1) : this.$emit("close");
    },
    // 确定事件
    handleConfirm() {
      this.$emit("confirm");
    },
  },
};
</script>

<style lang="scss" scoped>
._bottom-button-box {
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  box-shadow: 0 -2px 4px 0 rgba(44, 44, 44, 0.1);
  background: #fff;
  ._bottom-button {
    position: relative;
    align-items: center;
    .center-line {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 0.04rem;
      height: 0.46rem;
      background: #f2f2f2;
      margin: 0;
    }
  }
  .flex {
    display: flex;
  }
  .text-center {
    text-align: center;
  }
  .bg-white {
    background: #fff;
  }
  .cancel-btn {
    margin: 0.26rem 0.4rem;
    border-radius: 4px;
    padding: 0;
    height: 0.8rem;
    font-size: 0.32rem;
    background-color: #fff;
    border-radius: 0.08rem;
    border: 0.04rem solid #2D2D2D;
    color: #2D2D2D;
  }
  .submit-btn {
    margin: 0.26rem 0.4rem;
    font-size: 0.32rem;
    border-radius: 0.08rem;
    background-color: #FECD08;
    border: 0.04rem solid #FECD08;
    color: #000;
    padding: 0;
    height: 0.8rem;
  }
  .cancel-btn-min {
    width: 2rem;
    margin: 0.2rem 0.4rem;
    height: 0.7rem;
    line-height: 0.7rem;
  }
  .submit-btn-min {
    width: 2rem;
    margin: 0.2rem 0.4rem;
    height: 0.7rem;
    line-height: 0.7rem;
    background-color: #FECD08;
    border: 0.04rem solid #FECD08;
    color: #000;
  }
}
</style>

<template>
  <van-popup v-model="isChangecity" :round="true" :close-on-click-overlay="false">
    <div class="pop-box">
      <div class="pop-title">提示</div>
      <div class="pop-content">该站点属于{{popCityname}}市，是否切换到【{{popCityname}}】查看房源？</div>
      <div class="btn-box">
        <div class="cancel" @click.stop="cancel">取消</div>
        <div class="confirm" @click="changeCity">确定</div>
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  props: {
    // 是否显示
    isChangecity: {
      type: Boolean,
      default: false,
    },
    // 城市名字
    popCityname: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
    }
  },
  methods: {
    changeCity () {
      this.$emit("confirm");
    },
    cancel () {
      this.$emit("cancel");
    }
  },
}
</script>
 
<style lang="scss" scoped>
// 切换城市弹窗
.pop-box {
  width: 6rem;
  .pop-title {
    font-size: 0.32rem;
    font-weight: 400;
    color: #111111;
    text-align: center;
    border-bottom: 0.01rem solid #cccccc;
    padding-top: 0.34rem;
    padding-bottom: 0.22rem;
  }
  .pop-content {
    font-size: 0.32rem;
    font-weight: 400;
    color: #111111;
    line-height: 0.48rem;
    padding: 0.64rem 0.76rem 0.66rem;
  }
  .btn-box {
    height: 0.86rem;
    display: flex;
    border-top: 0.02rem solid #f1f1f1;
    .cancel {
      width: 3rem;
      height: 100%;
      font-size: 0.28rem;
      line-height: 0.86rem;
      font-weight: 400;
      color: #111111;
      text-align: center;
      border-right: 0.02rem solid #f1f1f1;
    }
    .confirm {
      width: 3rem;
      height: 100%;
      font-size: 0.28rem;
      line-height: 0.86rem;
      font-weight: bold;
      text-align: center;
      color: #f7d447;
    }
  }
}
.van-popup--center.van-popup--round {
  border-radius: 0.12rem;
}
</style>

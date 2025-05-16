<template>
  <van-overlay :show="value">
    <div class="wrapper">
      <div class="block">
        <div class="title">{{title}}</div>
        <div class="main">
          <slot v-if="$slots.default"></slot>
          <div v-else>{{message}}</div>
        </div>
        <div class="footer">
          <div class="button" @click="confirm">{{buttonName}}</div>
        </div>
      </div>
    </div>
  </van-overlay>
</template>
<script>
export default {
  name: 'gni-popup-confirm',
  data () {
    return {

    }
  },
  props: {
    value: {
      default: false,
      type: Boolean,
      required: true,
    },
    title: {
      default: '提醒',
      type: String,
    },
    message: {
      default: '',
      type: String,
    },
    buttonName: {
      default: '确定',
      type: String,
    }
  },
  methods: {
    confirm () {
      this.$emit('input', false);
      this.$emit('confirm');
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  .block {
    width: 5.2rem;
    height: 3.6rem;
    border-radius: 6px;
    background-color: #fff;
    overflow: hidden;
    .title {
      width: 100%;
      height: 45px;
      border-bottom: 1px solid #cccccc;
      font-size: 18px;
      font-weight: 400;
      color: #494949;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .main {
      width: 100%;
      height: 1.78rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
    }
    .footer {
      .button {
        width: 3rem;
        margin: 0 auto;
        height: 0.68rem;
        background: #52a3ff;
        border-radius: 6px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        position: relative;
        font-weight: bold;
        &:active {
          top: 1px;
          background: #288cff;
        }
      }
    }
  }
}
</style>

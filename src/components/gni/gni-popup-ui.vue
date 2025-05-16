<--
   使用方法：
     简易使用：
     <popup-ui v-model="showPopup" :message="message"></popup-ui>
     自定义内容（slot）：
     <popup-ui v-model="showPopup">
        <div>这里是自定义内容，自己发挥吧</div>
     </popup-ui>

     参数说明：
        v-model  Boolean 控制是否显示
        message  String  提示语，仅当没有slot时生效
        title    String  标题，默认为“提示”
-->
<template>
  <van-popup v-model="showPop" :close-on-click-overlay="closeOverlay" :overlay-style="overlayStyle" :class="overlayClass" style="border-radius: 6px;" @close="$emit('input', false)">
    <div class="wrapper">
      <div class="block" :style="widthStyle">
        <template v-if="title">
          <div class="flex items-center relative">
            <div class="title" :class="closeIcon?'pl-5':''" v-html="title"></div>
            <slot name="subtitle"></slot>
            <div v-if="closeIcon" class="icon-cross" @click="iconClose">
              <van-icon name="cross" />
            </div>
            <div v-if="rightTitle" class="item-title-right">
              {{rightTitle}}
            </div>
          </div>
        </template>
        <div class="main" :style="mainStyle">
          <slot v-if="$slots.default"></slot>
          <div v-else class="msg">
            <div class="icon-box" v-if="icon">
              <van-icon :name="icon" :color="iconColor" :size="iconSize" />
            </div>
            <p class="message-text">{{ message }}</p>
            <p class="desc-text" v-if="desc">{{ desc }}</p>
          </div>
        </div>
        <div class="flex footer-box" v-if="btnType === '1'">
          <div v-if="confirmText" class="footer footerBt">
            <div class="button" @click="confirm">{{ confirmText }}</div>
          </div>
          <div class="line-box" v-if="confirmText && cancelText"></div>
          <div v-if="cancelText" class="footer footerBt">
            <div class="close" @click="cancel">{{ cancelText }}</div>
          </div>
        </div>
        <div class="flex footer-box" v-else>
          <div v-if="cancelText" class="footer footerBt">
            <div class="close" :style="cancelStyle" @click="cancel">{{ cancelText }}</div>
          </div>
          <div class="line-box" v-if="confirmText && cancelText && isClose"></div>
          <div v-if="confirmText && isClose" class="footer footerBt">
            <div class="button" @click="confirm">{{ confirmText }}</div>
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>
<script>
export default {
  name: "gni-popup-ui",
  data () {
    return {
      showPop: false,
    };
  },
  props: {
    value: {
      default: false,
      type: Boolean,
      required: true,
    },
    title: {
      default: "提示",
      type: String,
    },
    message: {
      default: "",
      type: String,
    },
    desc: {
      default: "",
      type: String,
    },
    //   确认文案
    confirmText: {
      default: "确定",
      type: String,
    },
    isClose: {
      default: true,
      type: Boolean,
    },
    // 关闭文案
    cancelText: {
      default: "取消",
      type: String,
    },
    // 弹罩层自定义样式
    overlayStyle: {
      default () {
        return { backgroundColor: "rgba(0, 0, 0, 0.5)" };
      },
      type: [Object],
    },
    icon: {
      default: "warning-o",
      type: String,
    },
    iconColor: {
      default: "#FF1E01",
      type: String,
    },
    iconSize: {
      default: "0.56rem",
      type: String,
    },
    btnType: {
      default: "1",
      type: String,
    },
    mainStyle: {
      default: "",
      type: String,
    },
    widthStyle: {
      default: "",
      type: String,
    },
    cancelStyle: {
      default: "",
      type: String,
    },
    overlayClass: {
      default: "",
      type: String,
    },
    closeOverlay: {
      default: true,
      type: Boolean,
    },
    closeIcon: {
      default: false,
      type: Boolean,
    },
    rightTitle: {
      default: '',
      type: String,
    },
  },
  watch: {
    value (val) {
      this.showPop = val;
    },
  },
  methods: {
    confirm () {
      this.$emit("input", false);
      this.$emit("confirm");
    },
    cancel () {
      this.$emit("input", false);
      this.$emit("cancel");
    },
    iconClose () {
      // this.$emit("input", false);
      this.$emit("iconClose");
    },
  },
};
</script>
<style lang="scss" scoped>
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.relative {
  position: relative;
}
.pl-5 {
  padding-left: 0.5rem;
}
.icon-cross {
  width: 0.8rem;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(246, 246, 246, 0.76);
}
.icon-box {
  text-align: center;
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  // height: 100vh;
  // width: 100vw;
  .block {
    width: 6rem;
    border-radius: 6px;
    background-color: #fff;
    overflow: hidden;
    .title {
      width: 100%;
      height: 45px;
      border-bottom: 1px solid #f5f5f5;
      font-size: 0.32rem;
      font-weight: 400;
      color: #494949;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(246, 246, 246, 0.76);
    }
    .main {
      width: 100%;
      min-height: 2.98rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.3rem;
      .msg {
        padding: 0 0.2rem;
        text-align: center;
        .message-text {
          text-align: left;
          display: inline-block;
          line-height: 0.48rem;
          font-size: 0.32rem;
          color: #111111;
          padding-top: 0.12rem;
        }
        .desc-text {
          padding-top: 0.2rem;
          font-size: 0.26rem;
          color: #111111;
        }
      }
    }
    .footerBt {
      border-top: 0.02rem solid #f5f5f5;
    }
    .footer-box {
      position: relative;
      .line-box {
        position: absolute;
        width: 0.02rem;
        height: 0.86rem;
        top: 0;
        left: 50%;
        transform: translate(-50%, 0%);
        background: #f1f1f1;
      }
    }
    .footer {
      flex: 1;
      .button {
        width: 100%;
        margin: 0 auto;
        padding: 4px 0;
        height: 0.68rem;
        background: #fff;
        border-radius: 6px;
        color: #2087fb;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.28rem;
        position: relative;
      }
      .close {
        width: 100%;
        margin: 4px auto;
        height: 0.68rem;
        background: #fff;
        border-radius: 6px;
        color: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.28rem;
      }
    }
  }
}
.item-title-right {
  position: absolute;
  right: 0.4rem;
  height: 45px;
  top: 0;
  font-size: 0.24rem;
  color: #ff2914;
  display: flex;
  align-items: center;
}
</style>

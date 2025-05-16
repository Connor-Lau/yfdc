<template>
  <div class="_search-box" :style="searchBoxStyle" @click="allClick">
    <slot name="typeSelect"></slot>
    <slot name="reportSelect"></slot>
    <template v-if="isInput">
      <div :style="reportSearchStyle">
        <form
          action="javascript:;"
          @submit="$refs.refSearchFocus.blur();onSearch();"
          style="display: flex">
          <input
            :style="inputStyle"
            type="search"
            :value="value"
            :placeholder="placeholder"
            @input="onInput"
            @focus="onFocus"
            @blur="onBlur"
            :readonly="readonly"
            ref="refSearchFocus" />
        </form>
        <van-icon
          name="clear"
          class="btn-close"
          color="#B2B2B2"
          @click="onClear"
          v-show="clear && value" />
      </div>
    </template>
    <template v-else>
      <div class="inputValue">
        <span v-if="value">{{value}}</span>
        <span v-else class="list-value-gray">{{placeholder}}</span>
      </div>
    </template>
    <van-button round type="info" class="search-btn" @click="onSearch" v-if="showBtn">{{ btnText }}</van-button>
  </div>
</template>

<script>
// 搜索新UI组件
// 外部change事件具有防抖功能，外部别用input事件
// 外部应用参考： <gni-search v-model="name" placeholder="请输入待查询的店长名" @click="onRefresh" @change="onRefresh"></gni-search>
export default {
  name: "gni-search",
  props: {
    // v-model语法糖
    value: String,
    // 提示描述
    placeholder: String,
    // 搜索外层自定义样式
    searchBoxStyle: {
      type: String,
      default: "",
    },
    // 输入框自定义样式
    inputStyle: {
      type: String,
      default: "",
    },
    // 输入框最大的框自定义样式
    reportSearchStyle: {
      type: String,
      default: "",
    },

    // 外部change事件防抖时间,默认1000ms
    waitTime: {
      type: Number,
      default: 1000,
    },
    // 显示清除按钮
    clear: {
      type: Boolean,
      default: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    isInput: {
      type: Boolean,
      default: true,
    },
    // 显示搜索按钮
    showBtn: {
      type: Boolean,
      default: true,
    },
    btnText: {
      type: String,
      default: "搜索",
    },
  },
  data () {
    return {
      timer: null,
    };
  },
  methods: {
    // 搜索按钮事件
    onSearch () {
      this.clearTimeout();
      this.$emit("click");
    },
    allClick () {
      this.clearTimeout();
      this.$emit("allClick");
    },
    // input事件
    onInput ({ target: { value } }) {
      this.$emit("input", value); // v-model
      this.handleEventDebounce(() => {
        this.$emit("change"); //外部change事件具有防抖功能，外部别用input事件
      });
    },
    // 获取焦点事件
    onFocus () {
      this.$emit("focus", {});
    },
    // 失焦事件
    onBlur () {
      this.$emit("blur", {});
    },
    // 防抖
    handleEventDebounce (fn) {
      this.clearTimeout();
      this.timer = setTimeout(() => {
        !!fn && fn();
      }, this.waitTime);
    },
    // 清除事件
    onClear () {
      this.clearTimeout();
      this.$emit("input", "");
      this.$emit("change");
      this.$emit("clear");
    },
    // 清除定时器
    clearTimeout () {
      if (this.timer) clearTimeout(this.timer);
    },
    focus () {
      this.$refs.refSearchFocus.focus();
    },
  },
};
</script>

<style lang="scss" scoped>
input:disabled,
input[disabled] {
  background: #ffffff !important;
  opacity: 1;
}
input {
  background: #ffffff;
}
._search-box {
  margin: 0.24rem 0.38rem;
  position: relative;
  // width: 100%;
  input,
  .inputValue {
    display: block;
    width: 100%;
    height: 0.57rem;
    box-sizing: border-box;
    border: 1px solid #d1d1d1;
    border-radius: 0.57rem;
    padding: 0 1.8rem 0 0.28rem;
    font-size: 0.24rem;
    color: #0075fb;
    appearance: none;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .inputValue {
    align-items: center;
    display: flex;
  }

  .btn-close {
    position: absolute;
    font-size: 0.42rem;
    right: 1.2rem;
    top: 0;
    padding: 0.07rem;
  }

  .search-btn {
    position: absolute;
    right: 0;
    top: 0;
    height: 0.57rem;
    width: 1.12rem;
    font-size: 0.26rem;
    padding: 0;
    background-color: #fecd08;
    border: 0.02rem solid #fecd08;
    color: #000000;
  }

  // 如果左侧有类型选择------Start
  .typeSelect {
    font-size: 0.22rem;
    position: absolute;
    z-index: 2;
    color: #333;
    line-height: 0.59rem;
    padding-left: 0.2rem;
    font-size: 0.24rem;
    .van-icon-play {
      margin: 0.02rem 2px;
      transform: rotate(90deg);
      vertical-align: text-top;
    }
    .dividingLine {
      width: 0.02rem;
      height: 0.28rem;
      background: #dbdee3;
      margin-left: 0.08rem;
      display: inline-block;
      vertical-align: text-top;
    }
  }
  // 弹出下拉选择菜单
  .dropBox {
    padding: 2px 5px;
    font-size: 0.24rem;
    color: #111111;
    position: absolute;
    z-index: 2;
    top: 0.6rem;
    background: white;
    text-align: center;
    border: 0.02rem solid #eeeeee;
    left: 0;
    .item {
      line-height: 0.64rem;
    }
    .item.active {
      color: #52a3ff;
    }
  }
  // 如果左侧有类型选择------End
}
//修改placeholder的默认颜色：
input::-webkit-input-placeholder {
  color: #999999;
}
input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #999999;
}
input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #999999;
}
input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #999999;
}

.list-value-gray {
  color: #a2a2a2;
}

.reportSelect {
  display: flex;
  align-items: center;
  border-radius: 0.06rem;
  margin-right: 0.26rem;
  background: #f5f5f5;
  padding: 0 0.16rem;
  height: 0.44rem;
  position: relative;
  .van-icon-play {
    margin: 0.02rem 2px;
    transform: rotate(90deg);
    vertical-align: text-top;
  }
  .report-p {
    font-size: 0.24rem;
  }
}
.reportSelect-out {
  .report-drop,
  /deep/ .report-drop {
    width: 1.6rem;
    background: #ffffff;
    box-shadow: 0rem 0.04rem 0.12rem 0rem rgba(129, 129, 129, 0.3);
    border-radius: 0.04rem;
    position: absolute;
    top: 0.64rem;
    left: 50%;
    transform: translateX(-50%);

    &:after {
      content: "";
      z-index: 0;
      position: absolute;
      top: -0.2rem;
      left: 50%;
      border: 0.1rem solid transparent;
      border-bottom-color: #fff;
      transform: translateX(-50%);
    }
    &.report-first-active:after {
      border-bottom-color: #ffce09;
    }

    font-size: 0.28rem;
    color: #000000;
    .item {
      height: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 0.02rem solid #f7f7f7;
      &.active {
        background: #ffce09;
      }
    }
  }
}
</style>

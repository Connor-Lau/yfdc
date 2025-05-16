<!-- 手机号输入框 -->
<!-- 使用方法：
     <phone-input :phont="phone" @change="phoneInput"></phone-input>

     参数说明：
        phone        String   [非必填]    默认手机号，如果没有默认值，就不传
        title        Boolean  [非必填]    标题
        showTitle    Boolean  [非必填]    是否显示标题
        showFooter   Boolean  [非必填]    是否显示下方的提示

     slot：
        header： 标题区域
        footer： 底部区域

     方法：
        change  参数： 手机号(去掉中间的空位)
          注意，这里会返回去掉所有中间空格的手机号，使用的时候注意判断
-->

<template>
  <div class="container">
    <slot name="header" v-if="$slots.header"></slot>
    <div class="label" v-else-if="showTitle">{{ title }}</div>
    <div class="field-box">
      <div class="field">
        <template v-for="v in boxLength">
          <input
            class="box"
            :ref="`box${v}`"
            type="number"
            pattern="[0-9]*"
            :readonly="readonly"
            placeholder=""
            maxlength="1"
            :value="valueNum[v - 1]"
            @input="handlerInput($event, v)"
            @click="handlerClick($event)"
            @keyup="handlerKeyUp($event, v)"
            :key="'10'+v+'0001'"
            :class="{ filled: Number.isInteger(parseInt(valueNum[v - 1])) }" />
          <div class="separator" v-if="separatorPosition.includes(v)" :key="v"></div>
        </template>
      </div>
    </div>

    <slot name="footer" v-if="$slots.footer"></slot>
    <div class="tip" v-else-if="showFooter">
      <div class="tip-left">
        已输入<span class="phoneNumber">{{ valueLength }}</span>位数
      </div>
      <slot name="tipsRight"></slot>
    </div>
  </div>
</template>
<script>
// 备注： 12.03 凤华需求： 删除、输入之后光标要停留在原来的格子上
export default {
  name: "phone-input",
  props: {
    title: {
      // 标题
      type: String,
      default: "联系方式",
    },
    showTitle: {
      // 是否显示标题， 如果传入header slot，则此属性无效
      type: Boolean,
      default: false,
    },
    showFooter: {
      // 是否显示下方的数量提示框，如果传入 footer slot，则此属性无效
      type: Boolean,
      default: true,
    },
    phone: {
      // 传入默认值
      type: String,
      default: "",
    },
    readonly: {
      // 是否只读
      type: Boolean,
      default: false,
    },
    boxLength: {
      type: Number,
      default: 11
    }
  },
  computed: {
    valueLength () {
      return this.valueNum.replace(/\s*/g, "").length;
    },
    separatorPosition () {
      if (this.boxLength === 8) {
        return [4]
      } else if (this.boxLength === 6) {
        return [0]
      } else {
        return [3, 7]
      }
    },
  },
  watch: {
    phone (val) {
      this.valueNum = val;
    },
    valueLength () {
      this.$emit("change", this.valueNum.replace(/\s*/g, ""));
    }
  },
  data () {
    return {
      valueNum: this.phone.padEnd(11, " "),
      lastKeyCode: "", // 上一次输入的按键

      numberBeforeDelete: "", // 删除前的数字是什么， 用于删除按钮的keyup判断
      inputIndex: 0, // 输入下标，用于设置失焦等等
    };
  },
  methods: {
    // 检测输入
    handlerInput (e, index) {

      // this.$commonUtils.appLog.log("============wwww======>>>>>>", e.target.value)
      if (this.$commonUtils.utilCore.checkIsNumber(e.target.value) && e.target.value.length == 7) {
        this.valueNum = e.target.value.substr(1, 6).toString()
        e.target.value = this.valueNum[index - 1]
        // this.$commonUtils.appLog.log("===========777777777======>>>>>>", e.target.value, this.valueNum, index)
        return;
      }
      if (this.$commonUtils.utilCore.checkIsNumber(e.target.value) && e.target.value.length == 6) {
        this.valueNum = e.target.value.toString()
        e.target.value = this.valueNum[index - 1]
        // this.$commonUtils.appLog.log("============66666666666======>>>>>>", e.target.value)
        return;
      }
      this.inputIndex = index;
      //特别判断一下小数点，以及非删除键非数字的情况
      if (e.data == "." || (e.data != "" && e.keyCode != 8 && !this.$commonUtils.utilCore.checkIsNumber(e.target.value))) {
        e.target.value = ""
        this.$nextTick(() => {
          this.$refs[`box${index}`][0].value = ""
        });
      }
      if (e.target.value.length === 0) {
        // 被删除了
        let v = this.valueNum.split("");
        v[index - 1] = " ";
        this.valueNum = v.join("");
      } else if (e.target.value.length === 1) {
        // 输入
        let str = parseInt(e.target.value);
        // 只能输入数字
        if (Number.isInteger(str)) {
          // 替换手机号里的字符串
          let v = this.valueNum.split("");
          v[index - 1] = e.target.value;
          this.valueNum = v.join("");
          // 跳转到下一个框
          if (index < this.boxLength) {
            // 删除、输入之后光标要停留在原来的格子上， 所以 这里不做 跳转到下一个框
            // this.$nextTick(() => this.$refs[`box${index + 1}`][0].focus());
            // // this.$refs[`box${index + 1}`][0].focus();
            // this.cursorPositionLast(this.$refs[`box${index + 1}`][0]);
          } else if (index == this.boxLength - 1) {
            // 最后一个框有点奇怪，不知道为啥光标老是跳到数字前面，这里延迟执行一下
            setTimeout(() => {
              this.cursorPositionLast(e.target);
            }, 10);
          }
        } else {
          e.target.value = "";
        }
      } else {
        // 方框里面已经有数字，输入新的数字，直接覆盖重写
        let str = parseInt(e.target.value.substr(-1, e.target.value.length));
        if (Number.isInteger(str)) {
          e.target.value = str;
          // 替换手机号里的字符串
          let v = this.valueNum.split("");
          // 删除、输入之后光标要停留在原来的格子上，避免最后一位再向前跳一位
          if (index === this.boxLength) {
            v[index - 1] = e.target.value;
          } else {
            v[index] = e.target.value;
          }
          this.valueNum = v.join("");
          // 跳转到下一个框
          if (index < this.boxLength) {
            // this.$refs[`box${index + 1}`][0].focus();
            this.$nextTick(() => {
              this.$refs[`box${index + 1}`][0].focus()
            });
            this.cursorPositionLast(this.$refs[`box${index + 1}`][0]);
          } else if (index == this.boxLength - 1) {
            // 最后一个框有点奇怪，不知道为啥光标老是跳到数字前面，这里延迟执行一下
            setTimeout(() => {
              this.cursorPositionLast(e.target);
            }, 10);
          }
        } else {
          e.target.value = e.target.value.substr(0, 1) || "";
        }
      }

      // this.$emit("change", this.value.replace(/\s*/g, ""));
    },
    // keydown的时候记录下方框里面原来的情况，仅删除的时候需要记录，其他操作不需要
    handlerKeyDown (e, index) {
      this.inputIndex = index;
      if (e.keyCode === 8) {
        this.numberBeforeDelete = this.valueNum[index - 1];
      } else {
        this.numberBeforeDelete = "";
      }
    },
    // 处理删除操作，如果是删除当前的，不会跳转到上一个空格，如果是连续两次都点击了删除按钮，就会删除并跳转到上一个空格
    handlerKeyUp (e, index) {
      this.inputIndex = index;
      // 1. 当前空格为空，点击删除，直接跳转到上一个空格
      if (this.numberBeforeDelete == undefined || this.numberBeforeDelete == " " || this.numberBeforeDelete == "") {
        if (e.keyCode === 8) {
          if (index > 1) {
            // this.$refs[`box${index - 1}`][0].focus();
            this.$nextTick(() => this.$refs[`box${index - 1}`][0].focus());
            this.cursorPositionLast(this.$refs[`box${index - 1}`][0]);
          }
        }
      } else {
        // 2. 当前空格不为空
        if (e.keyCode === 8 && this.lastKeyCode === 8) {
          if (index > 1) {
            // this.$refs[`box${index - 1}`][0].focus();
            this.$nextTick(() => this.$refs[`box${index - 1}`][0].focus());
            this.cursorPositionLast(this.$refs[`box${index - 1}`][0]);
          }
        }
      }

      this.lastKeyCode = e.keyCode;
    },
    handlerClick () {
      this.lastKeyCode = "";
      // 如果手机号没有输入，默认跳转到第一位开始输入
      if (this.valueNum.replace(/\s*/g, "").length === 0) {
        this.$refs.box1[0].focus()
      }
    },
    handlerFocus (e) {
      // 这里应该处理一下，让弹出的键盘为数字类型，但是暂时找不到方法
      this.cursorPositionLast(e.target);
    },
    cursorPositionLast (obj) {
      if (window.getSelection) {
        //ie11 10 9 ff safari
        // obj.focus(); //解决ff不获取焦点无法定位问题
        this.$nextTick(() => obj.focus());
        let range = window.getSelection(); //创建range
        range.selectAllChildren(obj); //range 选择obj下所有子内容
        range.collapseToEnd(); //光标移至最后
      } else if (document.selection) {
        //ie10 9 8 7 6 5
        let range = document.selection.createRange(); //创建选择对象
        range.moveToElementText(obj); //range定位到obj
        range.collapse(false); //光标移至最后
        range.select();
      }
    },
    // 设置失焦，供外部$refs调用
    setBlur () {
      this.$refs[`box${this.inputIndex}`][0].blur();
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  flex: 1;
  background-color: white;
  .label {
    height: 1rem;
    display: flex;
    align-items: center;
    font-size: 0.32rem;
    color: #737373;
    margin: 0 0.4rem;
  }
  .field-box {
    border-bottom: 0.02rem solid #f7f7f7;
    padding-bottom: 0.1rem;
  }
  .field {
    height: 0.76rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.32rem;
    // margin: 0 0.4rem;
    position: relative;

    .box {
      width: 0.44rem;
      height: 0.48rem;
      background: #f4f4f4;
      border-radius: 0.08rem;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 0.32rem;
      line-height: 0.48rem;
      color: #546ff5;
      border: 0;
      padding: 0;
      margin: 0;
      box-shadow: 0px 0.04rem 0.08rem 0px rgba(195, 195, 195, 0.5);
      // background: #546ff5;

      &[contenteditable]:focus {
        font-size: 0.24rem;
        outline: none;
        background-color: white;
        box-shadow: 0px 0.04rem 0.08rem 0px rgba(195, 195, 195, 0.5);
        caret-color: #546ff5;
      }
      &.filled {
        color: #fff;
        background: #546ff5;
        &[contenteditable]:focus {
          font-size: 0.32rem;
          background-color: #546ff5;
          box-shadow: 0px 0.04rem 0.08rem 0px rgba(195, 195, 195, 0.5);
          caret-color: white;
        }
      }
      @supports (-webkit-mask: none) and (not (cater-color: #546ff5)) {
        .box::first-line {
          color: #333;
        }
      }
    }
    .separator {
      width: 0.16rem;
      height: 0.04rem;
      background: #c5c5c5;
    }
  }
  .tip {
    height: 0.66rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 0.24rem;
    color: #111111;
    .phoneNumber {
      margin: 0 0.1rem;
      color: #52a3ff;
    }
  }
}

/*谷歌*/
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
/*火狐*/
input[type="number"] {
  -moz-appearance: textfield;
}
</style>

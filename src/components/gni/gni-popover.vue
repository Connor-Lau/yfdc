<template>
  <div>
    <van-popover
      v-model="showPopover"
      :offset="offsetPopover"
      @select="onSelect"
      :trigger="trigger">
      <div class="menubox overflow-y-scroll">
        <div class="menuitem"
          :class="{'active': item.className == 'active'}"
          v-for="(item,i) in actions"
          :key="i"
          @click="onSelect(item)">
          {{item.name}}
        </div>
      </div>
      <template #reference>
        <!-- 插槽 -->
        <slot />
      </template>
    </van-popover>
  </div>
</template>

<script>
export default {
  name: 'gni-popover-select',
  props: {
    // 触发方式
    trigger: {
      type: String,
      default: ''
    },
    actions: {
      type: [Object, Array],
      default: []
    },
  },
  data () {
    return {
      showPopover: false,
      offsetPopover: [0, 1],//出现位置的偏移量
      // actions: [{ text: '选项一' }, { text: '选项二', className: 'active' }, { text: '选项一' }],// 通过 actions 属性来定义菜单选项
    }
  },
  methods: {
    onSelect (item) {
      if (!this.$commonUtils.utilCore.empty(item)) {
        this.actions.forEach(element => {
          element.className = ''
        })
        item.className = 'active'
      }
      this.$emit('popupIndex', item.value)
      this.showPopover = false
    },
  }
}
</script>
<style lang="scss">
// 全局样式
@import "~@/common/styles/base";

.van-popover__content {
  border-radius: 0;
}
.van-popover__arrow {
  border-width: 0;
}
.menubox {
  width: 4.8rem;
  max-height: 6.4rem;
  -webkit-overflow-scrolling: touch;
  .menuitem {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    height: 44px;
    padding: 0 16px;
    font-size: 14px;
    line-height: 20px;
    cursor: pointer;
  }
  .active {
    background-color: #ffce09;
  }
}
.menubox::-webkit-scrollbar-track-piece {
  background-color: rgba(0, 0, 0, 0);
  border-left: 0.013333rem solid rgba(0, 0, 0, 0);
}
.menubox::-webkit-scrollbar {
  width: 0.04rem;
  height: 0.173333rem;
  -webkit-border-radius: 0.066667rem;
  -moz-border-radius: 0.066667rem;
  border-radius: 0.066667rem;
}
.menubox::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.5);
  background-clip: padding-box;
  -webkit-border-radius: 0.066667rem;
  -moz-border-radius: 0.066667rem;
  border-radius: 0.066667rem;
  min-height: 0.373333rem;
}
.menubox::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-border-radius: 0.066667rem;
  -moz-border-radius: 0.066667rem;
  border-radius: 0.066667rem;
}
</style>

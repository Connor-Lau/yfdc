<template>
  <van-popup :value="value" @input="openclose" position="bottom">
    <van-picker
      show-toolbar
      :title="title"
      :value-key="customRelevance.label"
      :default-index="defaultSelect"
      :columns="list"
      @cancel="openclose"
      @confirm="handleConfirm"
    />
  </van-popup>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    title: [String],
    value: [Boolean],
    defaultSelect: 0,
    activate: {
      type: Object,
      default: () => ({}),
    },
    // 自定义传入列表获取的对象key-value
    customRelevance: {
      type: Object,
      default: () => ({
        label: "label",
        value: "value",
      }),
    },
  },
  data() {
    return {};
  },
  methods: {
    // 开关
    openclose() {
      this.$emit("input", false);
    },
    // 确定按钮事件上传
    handleConfirm(value) {
      // this.$commonUtils.appLog.log(value);
      this.openclose();
      //兼容没有选择项值时关闭选择框
      if (!this.$commonUtils.utilCore.empty(value)) {
        this.$emit('update:activate', value);
      }
      this.$emit("confirm", value);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
<template>
  <div class="vant-table">
    <table cellspacing="0" :style="bgcolor" style="width: 100%" class="table">
      <tr>
        <template v-if="option.serial">
          <th class="th">{{ option.serialtext || "序号" }}</th>
        </template>
        <th class="th" v-for="(item, index) in option.column" :key="index">
          {{ item.label }}
        </th>
      </tr>
      <template v-if="maxDataLine<1">
        <tr class="list-tr">
          <td class="td" :colspan="maxDataCol">
            暂无数据
          </td>
        </tr>
      </template>
      <template v-else>
        <tr v-for="(item, index) in tableData" :key="index" class="list-tr">
          <template v-if="option.serial">
            <td class="td" :class="option.serialclass" :style="option.serialstyle">
              {{ index + 1 }}
            </td>
          </template>
          <td v-for="(context, i) in option.column" :key="i" class="td" @click="handleclick(context, item, item[context.prop], index)" :class="
            (context.selectable ? 'selectd ' : ' ') +
            (context.customClass || '')
          " :style="context.customStyle || ''">
            {{ item[context.prop] || option.default || "" }}
            <template v-if="context.selectable">
              <van-icon name="play" color="#8D8D8D" size="0.28rem" class="td-select" />
            </template>
          </td>
        </tr>
      </template>
      <slot></slot>
    </table>
  </div>
</template>
<script>
export default {
  name: "customtable",
  props: {
    bgcolor: Object,
    tableData: Array,
    option: Object,
  },
  data() {
    return {
      maxDataLine: 0,//判断数据的行数
      maxDataCol: 0,//判断数据的列数
    }
  },
  watch: {
    option: {//判断表头有变化，则需要重新加载数据
      deep: true,
      handler() {
        this.init();
      }
    },
    tableData: {//判断数据有变化，则需要重新加载数据
      deep: true,
      handler() {
        this.init();
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.maxDataLine = 0;
      this.maxDataCol = 0;
      if (this.tableData && this.tableData.length > 0) {
        this.maxDataLine = this.tableData.length;
      }
      if (this.option && this.option.column && this.option.column.length > 0) {
        this.maxDataCol = this.option.column.length;
        if (this.option.serial) {
          this.maxDataCol += 1;
        }
      }
    },
    handleclick(context, item, val, key) {
      this.$emit('click', {
        context,
        item,
        val,
        key
      })
    }
  }
};
</script>

<style lang="less" scoped>
.vant-table {
  .table {
    font-size: 0.28rem;
    color: #353535;
    .th {
      height: 0.96rem;
      line-height: 0.96rem;
      background-color: #f9f9f9;
      text-align: center;
      font-weight: normal;
      box-sizing: border-box;
      border-top: 0.01rem solid rgba(204, 204, 204, 0.5);
      border-bottom: 0.01rem solid rgba(204, 204, 204, 0.5);
    }
    .td {
      box-sizing: border-box;
      border-bottom: 0.01rem solid rgba(204, 204, 204, 0.5);
    }
    .selectd {
      color: #8d8d8d;
    }
    .list-tr {
      height: 1rem;
      // line-height: 1rem;
      background-color: #fff;
      text-align: center;
    }

    .list-tr:nth-child(2n -1) {
      background-color: #f9f9f9;
    }

    .td-select {
      transform: rotate(90deg);
    }
  }
}
</style>
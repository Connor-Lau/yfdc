<template>
  <div class="recommendsecond">
    <div class="recommendsecond-item" @click="goDetail(item.shouse_id,item.block_id)" v-for="(item,index) in list" :key="index">
      <div class="itme-img">
        <img :src="item.picture" alt="" @error="toolsGetErrorHouseImage($event)">
      </div>
      <div class="item-container">
        <div class="item-title">{{item.shouse_title}}</div>
        <div class="item-subtitle">{{item.layout_short_name}} {{item.layout_toilet_id}}卫/{{item.acreage_cover_name}}</div>
        <div class="item-unitprice">
          <div class="lt" v-if="item.price_limit == 0">{{item.price_name}}</div>
          <div class="lt" v-else v-html="setPrice(item.price_name)"></div>
          <div class="rh">{{item.average_price_name}}</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      typeof: Array,
      default: () => [],
    },
  },
  methods: {
    goDetail: function (id) {
      this.$emit("goDetail", id);
    },
    setPrice (price) {
      let priceName = price
      priceName = price.replace('参考价：', "<span style='font-size: 0.2rem;'>" + '参考价：' + "</span>")
      return priceName
    }
  }
}
</script>

<style lang="scss" scoped>
.recommendsecond {
  display: flex;
  overflow: auto;
  .recommendsecond-item {
    width: 3.14rem;
    margin-right: 0.12rem;
    .itme-img {
      width: 3rem;
      height: 1.92rem;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 0.08rem;
      }
    }
    .item-container {
      padding: 0 0.05rem;
      .item-title {
        font-size: 0.26rem;
        font-weight: bold;
        color: #111111;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-top: 0.22rem;
      }
      .item-subtitle {
        font-size: 0.24rem;
        font-weight: 400;
        color: #303030;
        padding: 0.05rem 0;
      }
      .item-unitprice {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 0.05rem;
        white-space: nowrap;
        .lt {
          font-size: 0.24rem;
          font-weight: bold;
          color: #ff3100;
          padding-right: 0.06rem;
        }
        .rh {
          font-size: 0.22rem;
          font-weight: 400;
          color: #9b9b9b;
        }
      }
    }
    &:nth-last-of-type(1) {
      margin-right: 0;
    }
  }
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
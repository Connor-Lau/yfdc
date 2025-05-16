<template>
  <div>
    <div class="list-item" v-for="(item,index) in list" :key="index" @click="goDetail(item.loupan_id)">
      <div class="item-left">
        <img :src="toolsGetWebStaticUrl(item.picture)" @error="toolsGetErrorHouseImage($event)" alt="">
      </div>
      <div class="item-right">
        <div class="title">{{item.loupan_name}}</div>
        <div class="label-container">
          <div class="label-data">{{item.sell_status_name}}</div>
          <div class="label-item" v-for="(item2,index2) in item.tags" :key="index2">{{item2.tag_name}}</div>
        </div>
        <div class="subtitle">{{item.district_name}}/{{item.property_type_name}}/{{item.acreage_name}}</div>
        <div class="price">
          <div class="left">
            <span>{{item.average_price_name}}</span>
            <!-- <span class="unit">万</span> -->
          </div>
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
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    goDetail: function (id) {
      this.$emit("goDetail", id);
    },
  }
}
</script>

<style lang="scss" scoped>
.list-item {
  padding: 0.38rem 0.3rem 0.4rem;
  display: flex;
  .item-left {
    width: 2.2rem;
    height: 1.68rem;
    img {
      width: 100%;
      height: 100%;
      border-radius: 0.08rem;
    }
  }
  .item-right {
    width: 3.84rem;
    padding-left: 0.34rem;
    padding-top: 0.02rem;
    display: flex;
    flex-direction: column;
    .title {
      font-size: 0.3rem;
      font-weight: bold;
      color: #111111;
      line-height: 0.4rem;
      padding-bottom: 0.1rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .subtitle {
      font-size: 0.22rem;
      font-weight: 400;
      color: #000000;
      padding-bottom: 0.1rem;
    }
    .label-container {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      padding-bottom: 0.1rem;
      .label-data {
        width: 0.6rem;
        height: 0.3rem;
        font-size: 0.22rem;
        font-weight: 400;
        color: #000000;
        line-height: 0.3rem;
        text-align: center;
        border-radius: 0.04rem;
        border: 0.01rem solid #000000;
        margin-right: 0.12rem;
      }
      .label-item {
        font-size: 0.2rem;
        font-weight: 400;
        color: #617f9d;
        padding: 0.06rem;
        background: #f6f6f6;
        margin-right: 0.1rem;
      }
    }
    .price {
      display: flex;
      align-items: baseline;
      .left {
        font-size: 0.3rem;
        font-weight: bold;
        color: #ff3100;
        padding-right: 0.1rem;
        .unit {
          font-size: 0.2rem;
        }
      }
    }
  }
}
.attention-pop {
  width: 6rem;
  .header {
    font-size: 0.36rem;
    font-weight: 400;
    color: #000000;
    text-align: center;
    padding: 0.26rem 0;
    border-bottom: 0.02rem solid#e6e6e6;
  }
  .content {
    font-size: 0.3rem;
    font-weight: 400;
    color: #000000;
    text-align: center;
    font-family: SourceHanSansCN-Norma;
    padding: 0.8rem 0.4rem;
    span {
      font-weight: bold;
    }
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.28rem 0.28rem;
    .cancel {
      width: 2.6rem;
      height: 0.82rem;
      font-size: 0.32rem;
      font-weight: 400;
      color: #000000;
      line-height: 0.82rem;
      background: #ffffff;
      border-radius: 0.08rem;
      text-align: center;
      border: 0.02rem solid #ededed;
    }
    .define {
      background: #f7d447;
    }
  }
}
</style>
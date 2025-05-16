<template>
  <div>
    <div class="list-item" v-for="(item,index) in list" :key="index" @click="goDetail(item)">
      <div class="item-left relative">
        <img :src="toolsGetWebStaticUrl(item.picture)" @error="toolsGetErrorHouseImage($event)" alt="">
        <div class="absolute icon-vr-box flex items-center justify-center" v-if="item.vr_url">
          <img :src="$appConfig.appWebStaticUrl + 'common/icon-vr.png'" alt="">
        </div>
      </div>
      <div class="item-right">
        <div class="title">{{item.title || item.shouse_title || item.loupan_name || item.rent_title }}</div>
        <div class="area" v-if="isDetail">{{item.district_name}}</div>
        <div class="subtitle" v-else>{{item.subtitle || setSubtitle([item.district_name ,item.layout_short_name,item.acreage_cover_name || item.acreage_name,item.house_orientation_name])}}</div>
        <div class="label-container">
          <div class="label-data" v-if="isDetail">{{item.sell_status_name}}</div>
          <div class="label-item" v-for="(item2,index2) in item.tags" :key="index2">{{item2.text || item2.tag_name}}</div>
        </div>
        <div class="price">
          <div class="left">
            <span v-if="setPrice(item.price_name) || item.average_price_name">{{setPrice(item.price_name) || item.average_price_name }}</span>
            <span v-else>{{item.rent_price || item.rent_price_name }}</span>
            <span class="unit" v-if="setPrice(item.price_name) || item.average_price_name">万</span>
            <span class="unit" v-else>元/月</span>
          </div>
          <div v-if="isRent">
            <div class="right" v-if="isDetail">建面 {{item.acreage_name}}</div>
            <div class="right" v-else>{{item.average_price_name}}</div>
          </div>
          <!-- 小区的是否关注 -->
          <div class="vallage-attention" v-if="isVallage" @click.stop="handleAttention(item,index)">
            <img :src="$appConfig.appWebStaticUrl + '/user/icon_noattention.png'" alt="" v-if="item.is_favorite">
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_collection.png'" alt="" v-else>
            <div class="text" v-if="item.is_favorite">取消关注</div>
            <div class="text" v-else>关注</div>
          </div>
        </div>
      </div>
      <div class="click-attention" v-if="isShowattention" @click="isAttention = true">
        <img :src="$appConfig.appWebStaticUrl + '/user/icon_noattention.png'" alt="">
        <div class="text">取消关注</div>
      </div>
    </div>
    <van-popup v-model="isAttention" :round=true :close-on-click-overlay=false>
      <div class="attention-pop">
        <div class="header">提示</div>
        <div class="content">
          您确认不再关注
          <span>珠江国际丽江花园三期华林居 301</span>
          房源？
        </div>
        <div class="footer">
          <div class="cancel" @click="isAttention = false">取消</div>
          <div class="cancel define">确定</div>
        </div>
      </div>
    </van-popup>
  </div>

</template>

<script>
export default {
  props: {
    list: {
      typeof: Array,
      default: () => [],
    },
    isShowattention: {
      typeof: Boolean,
      default: false,
    },
    // 楼盘详情页的结构是不一样的
    isDetail: {
      typeof: Boolean,
      default: false,
    },
    // 租房列表的结构不一样
    isRent: {
      typeof: Boolean,
      default: true,
    },
    // 小区的关注房源
    isVallage: {
      typeof: Boolean,
      default: false,
    },
  },
  data () {
    return {
      isAttention: false,
    }
  },
  mounted () {
    console.log('接收的数据', this.list);
  },
  methods: {
    // 设置副标题
    setSubtitle (arr = []) {
      const arrRes = [];
      arr.map(item => {
        if (!this.$commonUtils.utilCore.empty(item)) {
          arrRes.push(item);
        }
      })
      return arrRes.join("/");
    },
    setPrice (val) {
      // const value = Number(val);
      // let price = Number((value / 10000).toFixed(2));
      if (val) {
        let price = val.replace('万', '')
        return price;
      } else {
        return ''
      }
    },
    goDetail: function (item) {
      this.$emit("goDetail", item);
    },
    handleAttention: function (item, index) {
      this.$emit("handleAttention", item, index);
    }
  }
}
</script>

<style lang="scss" scoped>
.list-item {
  padding: 0.38rem 0 0.4rem 0;
  margin: 0 0.54rem 0 0.48rem;
  display: flex;
  border-bottom: 0.02rem solid #f0f0f0;
  position: relative;
  .item-left {
    width: 2.2rem;
    height: 1.68rem;
    border-radius: 0.08rem;
    background-color: #f7f7f7;
    img {
      width: 2.2rem;
      height: 1.68rem;
      border-radius: 0.08rem;
      object-fit: cover;
      background-color: #f7f7f7;
    }
    .icon-vr-box {
      width: 0.4rem;
      height: 0.4rem;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 50%;
      left: 0.12rem;
      bottom: 0.12rem;
      img {
        width: 0.32rem;
        height: 0.2rem;
        background: rgba(0, 0, 0, 0);
      }
    }
  }
  .item-right {
    padding-left: 0.34rem;
    padding-top: 0.02rem;
    display: flex;
    flex-direction: column;
    .title {
      width: calc(7.5rem - 2.2rem - 0.34rem - 0.54rem - 0.48rem);
      font-size: 0.3rem;
      font-weight: bold;
      color: #111111;
      line-height: 0.4rem;
      max-height: 0.74rem;
      padding-bottom: 0.1rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .subtitle {
      font-size: 0.22rem;
      font-weight: 400;
      color: #000000;
      padding-bottom: 0.1rem;
    }
    .area {
      font-size: 0.22rem;
      font-weight: 400;
      color: #999999;
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
        color: #333333;
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
      .right {
        font-size: 0.22rem;
        font-weight: 400;
        color: #999999;
      }
      .vallage-attention {
        display: flex;
        align-items: center;
        position: absolute;
        right: 0;
        bottom: 0.7rem;
        img {
          width: 0.22rem;
          height: 0.22rem;
        }
        .text {
          font-size: 0.22rem;
          font-weight: 400;
          color: #000000;
          padding-left: 0.04rem;
        }
      }
    }
  }
  .click-attention {
    position: absolute;
    right: 0;
    top: 1.14rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 99;
    img {
      width: 0.28rem;
      height: 0.28rem;
    }
    .text {
      font-size: 0.22rem;
      font-weight: 400;
      color: #000000;
      padding-top: 0.08rem;
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
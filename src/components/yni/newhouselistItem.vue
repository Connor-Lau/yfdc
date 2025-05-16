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
        <div class="title" v-if="isNewHouse">{{item.title || item.shouse_title || item.loupan_name || item.rent_title }}</div>
        <div class="title2" v-else>{{item.title || item.shouse_title || item.loupan_name || item.rent_title }}</div>
        <div class="price" v-if="isNewHouse">
          <span>{{item.average_price_name}}</span>
        </div>
        <div class="subtitle" v-if="!isNewHouse">{{item.subtitle || setSubtitle([(!isRent? item.district_name : ''),item.layout_short_name,(!isRent ? item.acreage_cover_name : item.acreage_name),item.house_orientation_name])}}</div>
        <div class="subtitle" v-else>{{item.district_name}} {{setSubtitle([item.property_type_name,(item.acreage_name ? '建面 ' + item.acreage_name : '')])}}</div>
        <div class="label-container">
          <div class="label-data" v-if="isNewHouse">{{item.sell_status_name}}</div>
          <div class="label-item" v-for="(item2,index2) in (item.tags)" :key="index2">{{item2.tag_name}}</div>
        </div>
        <div class="price flex items-end" v-if="!isNewHouse">
          <div class="left">
            <span v-if="item.price_name" v-html="setPrice(item.price_name)"></span>
            <span v-else>{{item.rent_price || setPrice(item.price_name) || item.average_price_name }}</span>
            <span class="unit" v-if="!isNewHouse && !isRent">万</span>
            <span class="unit" v-if="isRent">元/月</span>
          </div>
          <div style="font-size: 0.22rem; font-weight: 400;color: #999999;" class="ml-1" v-if="!isRent">{{item.average_price_name}}</div>
        </div>
      </div>
      <div class="click-attention" v-if="isShowattention" @click.stop="attentionInfo = item;attentionIndex = index;isAttention = true;">
        <img :src="$appConfig.appWebStaticUrl + '/user/icon_noattention.png'" class="ml-2" alt="">
        <div class="text ml-2">取消关注</div>
      </div>
    </div>
    <van-popup v-model="isAttention" :round=true :close-on-click-overlay=false overlay-class="overlay-style">
      <div class="attention-pop">
        <div class="header">提示</div>
        <div class="content">
          您确认不再关注
          <span>{{attentionInfo.title || attentionInfo.shouse_title || attentionInfo.loupan_name || attentionInfo.rent_title}}</span>
          房源？
        </div>
        <div class="footer">
          <div class="cancel" @click="isAttention = false">取消</div>
          <div class="cancel define" @click="handleConfirm">确定</div>
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
    // 是否是新房，新房排版有些不同
    isNewHouse: {
      typeof: Boolean,
      default: false,
    },
    // 是否是租房，租房价格排版不同
    isRent: {
      typeof: Boolean,
      default: false,
    },
    // 允许外部控制关注弹窗
    showPopup: {
      typeof: Boolean,
      default: false,
    }
  },
  watch: {
    showPopup (val) {
      this.isAttention = val;
    }
  },
  data () {
    return {
      isAttention: false,
      attentionInfo: {},
      attentionIndex: 0,
    }
  },
  mounted () {
    console.log('11', this.list);
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
        let lastPrice = price.replace('参考价：', "<span style='font-size: 0.2rem;'>" + '参考价：' + "</span>")
        return lastPrice;
      } else {
        return ''
      }
    },
    handleConfirm () {
      this.$emit("confirm", this.attentionInfo, this.attentionIndex);
    },
    goDetail: function (item) {
      this.$emit("goDetail", item);
    },
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
    img {
      width: 2.2rem;
      height: 1.68rem;
      object-fit: cover;
      border-radius: 0.08rem;
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
      width: calc(7.5rem - 2.2rem - 1.5rem);
      font-size: 0.3rem;
      font-weight: bold;
      color: #111111;
      line-height: 0.4rem;
      padding-bottom: 0.1rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .title2 {
      width: calc(7.5rem - 2.2rem - 1rem);
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
      font-size: 0.3rem;
      font-weight: bold;
      color: #ff3100;
      padding-bottom: 0.1rem;
      .unit {
        font-size: 0.2rem;
      }
    }
  }
  .click-attention {
    position: absolute;
    right: 0;
    bottom: 0.7rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 99;
    border-left: 0.02rem solid #f0f0f0;
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
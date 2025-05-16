<template>
  <div>
    <div class="list-item" v-for="(item,index) in list" :key="index">
      <div class="list-container">
        <div class="item-top" @click="goUptownDetail(item)">
          <div class="top-left">
            <div class="title">{{item.uptown_data?item.uptown_data.uptown_name:''}}</div>
            <div class="price">{{item.uptown_data?item.uptown_data.average_price:''}}元/㎡</div>
            <div class="subtitle">{{item.uptown_data?item.uptown_data.district_name:''}} {{item.uptown_data?item.uptown_data.house_type_name:''}}/建面 {{item.uptown_data?item.uptown_data.small_acreage:''}}-{{item.uptown_data?item.uptown_data.big_acreage:''}}㎡</div>
          </div>
          <div class="top-right" v-show="isShowattention" @click.stop="attentionInfo = item;attentionIndex = index;isAttention = true;">
            <img :src="$appConfig.appWebStaticUrl + '/user/icon_noattention.png'" alt="">
            <div class="text">取消关注</div>
          </div>
        </div>
        <div class="item-bottom">
          <div class="choose-box">
            <div class="choose-tab">
              <div class="tab-item" :class="item.typeIndex==0?'active':''" style="padding-right: 0.5rem;" @click="handleTab(0,index)">在售{{item.shouse_count}}套
                <img :src="$appConfig.appWebStaticUrl + '/home/icon_line.png'" alt="" v-show="item.typeIndex==0">
              </div>
              <div class="tab-item" :class="item.typeIndex==1?'active':''" @click="handleTab(1,index)">在租{{item.rent_count}}套
                <img :src="$appConfig.appWebStaticUrl + '/home/icon_line.png'" alt="" v-show="item.typeIndex==1">
              </div>
            </div>
            <div class="choose-more" @click="goUptownList(item)" v-show="item.typeIndex==0 && item.shouse_count !='0' || item.typeIndex==1 && item.rent_count != '0'">
              全部
              <img :src="$appConfig.appWebStaticUrl + '/user/icon_arrowRight.png'" alt="">
            </div>
          </div>
          <div class="item-content" v-show="item.typeIndex==0">
            <div class="item-house" v-for="(item_house,index_house) in item.shouse_list" :key="index_house" @click="goHouseDetail(item,item_house)">
              <img :src="item_house.shouse_picture_url" @error="toolsGetErrorHouseImage($event)" alt="">
              <div class="house-title">{{item_house.layout_room_id}}室{{item_house.layout_hall_id}}厅 {{item_house.acreage_cover}}㎡</div>
            </div>
          </div>
          <div class="item-content" v-show="item.typeIndex==1">
            <div class="item-house" v-for="(item_rent,index_rent) in item.rent_list" :key="index_rent" @click="goHouseDetail(item,item_rent)">
              <img :src="item_rent.rent_picture_url" @error="toolsGetErrorHouseImage($event)" alt="">
              <div class="house-title">{{item_rent.layout_room_id}}室{{item_rent.layout_hall_id}}厅 {{item_rent.acreage}}㎡</div>
            </div>
          </div>
        </div>
      </div>
      <div class="line"></div>
    </div>

    <van-popup v-model="isAttention" :round=true :close-on-click-overlay=false overlay-class="overlay-style">
      <div class="attention-pop">
        <div class="header">提示</div>
        <div class="content">
          您确认不再关注
          <span>{{attentionInfo.uptown_data? attentionInfo.uptown_data.uptown_name:""}}</span>
          小区？
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
      default: true,
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
    // 在租在售切换
    handleTab (num, index) {
      if (num == this.list[index].typeIndex) {
        return
      } else {
        if (num == 0) {
          this.list[index].typeIndex = 0
        } else {
          this.list[index].typeIndex = 1
        }
      }
    },
    handleConfirm () {
      this.$emit("confirm", this.attentionInfo, this.attentionIndex);
    },
    // 房源详情
    goHouseDetail: function (item, item_house) {
      this.$emit("goHouseDetail", item, item_house);
    },
    goUptownList: function (item) {
      this.$emit("goUptownList", item);
    },
    // 跳转小区详情1
    goUptownDetail: function (item) {
      this.$emit("goUptownDetail", item);
    },
  }
}
</script>

<style lang="scss" scoped>
.list-item {
  .list-container {
    padding: 0.44rem 0.22rem 0.4rem 0.54rem;
    position: relative;
    .item-top {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding-bottom: 0.4rem;
      border-bottom: 0.02rem solid #f0f0f0;
      .top-left {
        .title {
          font-size: 0.36rem;
          font-weight: bold;
          color: #303030;
          padding-bottom: 0.14rem;
        }
        .price {
          font-size: 0.3rem;
          font-weight: bold;
          color: #ff3100;
          padding-bottom: 0.14rem;
        }
        .subtitle {
          font-size: 0.22rem;
          font-weight: 400;
          color: #000000;
        }
      }
      .top-right {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        padding-right: 0.16rem;
        img {
          width: 0.28rem;
          height: 0.28rem;
          display: block;
        }
        .text {
          font-size: 0.2rem;
          font-weight: 400;
          color: #000000;
          padding-top: 0.08rem;
        }
        &::after {
          content: "";
          display: block;
          width: 0.02rem;
          height: 0.3rem;
          background: #f0f0f0;
          position: absolute;
          top: 0.14rem;
          left: -0.2rem;
        }
      }
    }
    .item-bottom {
      padding-top: 0.26rem;
      // padding-right: 0.22rem;
      .choose-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .choose-tab {
          display: flex;
          align-items: center;
          .tab-item {
            font-size: 0.28rem;
            font-weight: 400;
            color: #737373;
            position: relative;
            img {
              width: 0.52rem;
              height: 0.16rem;
              display: block;
              position: absolute;
              bottom: -0.13rem;
              left: 0.38rem;
            }
            &:nth-child(1):after {
              content: "";
              display: block;
              width: 0.02rem;
              height: 0.3rem;
              background: #f0f0f0;
              position: absolute;
              right: 0.24rem;
              top: 0.02rem;
            }
          }
        }
        .choose-more {
          display: flex;
          align-items: center;
          font-size: 0.22rem;
          font-weight: 400;
          color: #737373;
          padding-right: 0.16rem;
          img {
            width: 0.1rem;
            height: 0.18rem;
            padding-left: 0.1rem;
          }
        }
      }
      .item-content {
        padding-top: 0.38rem;
        display: flex;
        align-items: center;
        overflow: auto;
        .item-house {
          width: 2.22rem;
          margin-right: 0.18rem;
          img {
            width: 2.12rem;
            height: 1.6rem;
            border-radius: 0.08rem;
            background-color: #999999;
          }
          .house-title {
            font-size: 0.24rem;
            font-weight: 400;
            color: #000000;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 0.12rem 0.14rem 0;
          }
          &:nth-last-of-type(1) {
            margin-right: 0;
          }
        }

        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
  }

  .line {
    width: 100%;
    height: 0.24rem;
    background: #f9f9f9;
  }
  .active {
    color: #000000 !important;
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
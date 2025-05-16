<template>
  <div class="commission-index">
    <gni-nav-bar @onClickLeft="onClickBack" :pageTitle="headTitle" :hideRight="false" :hideLeft="false">
      <template slot="slot-left">
        <div class="nav-left">
          <img :src="$appConfig.appWebStaticUrl + '/commission/icon_return.png'" alt="">
        </div>
      </template>
    </gni-nav-bar>
    <div class="wrapper" v-if="pageData.finished">
      <div class="container" v-if="houseCommission.length!=0">
        <van-list @load="onLoad"
          v-model="pageData.loading"
          :finished="pageData.finished"
          finished-text="没有更多了">
          <div class="list-container">
            <div class="list-item" v-for="(item,index) in houseCommission" :key="index" @click="goDetail(item)">
              <div class="list-left">
                <img :src="toolsGetWebStaticUrl(item.cover)" alt="" @error="toolsGetErrorHouseImage($event)">
              </div>
              <div class="list-right">
                <div class="name">{{item.uptown_name}}{{item.building_no?'-'+item.building_no:''}}{{item.floor_no+(item.floor_no=='全栋'?'':'楼')}}{{item.room_no+(item.room_no=='全层'?'':'房')}}</div>
                <div class="time" v-if="item.publish_time==0 && item.verify_status!=3">提交时间：{{getCreatTime(item.create_time)}}</div>
                <div class="time" v-if="item.publish_time!=0 && item.verify_status!=3">挂牌时间：{{getCreatTime(item.publish_time)}}</div>
                <div class="time" v-if="item.verify_status==3">拒绝原因：{{item.reason || "其他"}}</div>
                <div v-if="item.is_cancel==0">
                  <div class="tag">
                    <div v-show="item.entrust_type=='shouse'">售</div>
                    <div v-show="item.entrust_type=='rent'">租</div>
                    <div v-if="isShowYf(item)">裕丰地产平台展示</div>
                    <div v-if="item.verify_status==1">审核中</div>
                    <div v-if="item.verify_status==3">不通过</div>
                  </div>
                  <div class="price">
                    <div class="num">{{item.entrust_type=='shouse'?setPrice(item.price):item.price}}</div>
                    <span class="unit">{{item.entrust_type=='shouse'?'万':'元'}}</span>
                    <div class="sub-price" v-if="item.entrust_type=='shouse'">{{item.unit_price}}元/㎡</div>
                  </div>
                </div>
                <div class="is-cancel" v-else>已取消委托</div>
              </div>
            </div>
          </div>
        </van-list>
        <div class="commission-footer">
          <div class="btn-sell" @click="toolsGoPageView({path:'/home/commission/releasehouse'})">我要卖房</div>
          <div class="btn-line"></div>
          <div class="btn-rent" @click="toolsGoPageView({path:'/home/commission/rentalhouse'})">我要出租</div>
        </div>
        <div class="box-footer"></div>

      </div>
      <div class="container-nothing" v-else>
        <div class="bannar">
          <img :src="$appConfig.appWebStaticUrl + '/commission/bannar-nothing.png'" alt="">
        </div>
        <div class="nothing-text">暂无房源</div>
        <div class="nothing-subtitle">您还没有在裕丰地产网委托房源哦</div>
        <div class="nothing-btn">
          <div class="btn" @click="toolsGoPageView({path:'/home/commission/releasehouse'})">我要卖房</div>
          <div class="btn" @click="toolsGoPageView({path:'/home/commission/rentalhouse'})">我要出租</div>
        </div>
        <div class="nothing-footer">
          <div class="footer-title">
            <div class="title-line"></div>
            <div class="title-text">房源发布流程</div>
            <div class="title-line"></div>
          </div>
          <div class="footer-content">
            <div class="content-item">
              <img :src="$appConfig.appWebStaticUrl + '/commission/icon_online.png'" alt="">
              线上发布
              <van-icon name="down" />
            </div>
            <div class="content-item">
              <img :src="$appConfig.appWebStaticUrl + '/commission/icon_verify.png'" alt="">
              核实房源
              <van-icon name="down" />
            </div>
            <div class="content-item">
              <img :src="$appConfig.appWebStaticUrl + '/commission/icon_grounding.png'" alt="">
              房源上架
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  components: {
    gniNavBar,
  },
  data () {
    return {
      headTitle: '我的委托',
      isNothing: true,
      houseCommission: [],
      pageData: {
        loading: false,//是否加载中
        finished: false,//是否已经加载完
      },
    }
  },
  async mounted () {
    this.$commonUtils.utilCore.showLoading();
    setTimeout(async () => {
      //初始化登陆的状态
      await this.init();
      await this.onLoad()
      this.$commonUtils.utilCore.closeLoading()
    }, 500)
  },
  computed: {
    ...mapState("user", ["userToken", "userInfo", "isLogin"]), //用户Token,用户登陆信息
    // 取平均
    // averagePrice () {
    //   return function (price, acreage) {
    //     let average = parseInt(price / acreage)
    //     return average || '0'
    //   }
    // }
  },
  activated () {
    this.getList()
  },
  methods: {
    async init () {
      //如果用户没有登陆，则进行自动登陆
      if (this.$commonUtils.utilCore.empty(this.userToken)) {
        //判断一下用户登陆了没有
        let tmp_info = this.$store.dispatch('user/initLogin');
        //如果用户没有登陆，则清掉登陆相关的信息
        if (!tmp_info) {
          //如果数据为空，则清掉登陆的信息
          await this.$store.dispatch('user/actLoginOutApp');
        }
      }
    },
    // 触底函数
    async onLoad () {
      this.getList()
    },
    // 获取列表数据
    async getList () {
      const postData = {
      }
      const res = await this.$store.dispatch('commission/getAppEntrustIndex', postData);
      if (res) {
        this.houseCommission = res
        this.pageData.finished = true;
      }
    },
    setPrice (val) {
      const value = Number(val);
      let price = Number((value / 10000).toFixed(2));
      return price
    },
    isShowYf (i) {
      if (i.is_cancel == 0 && i.is_delete == 0 && i.follow_status == 70) {
        return true
      } else {
        return false
      }
    },
    goDetail (item) {
      this.toolsGoPageView({ path: '/home/commission/details', query: { id: item.publish_id, entrust_type: item.entrust_type } })
      console.log('111', item);
    },
    getCreatTime (time) {
      let creatime = this.$commonUtils.utilDate.date('Y-m-d', time)
      return creatime
    },
    onClickBack () {
      // this.toolsGoPageBack();
      this.toolsGoPageView({ path: '/common/index' });
    },
  }
}
</script>

<style lang='scss' scoped>
.commission-index {
  height: 100vh;
  .nav-left {
    img {
      width: 0.4rem;
      height: 0.36rem;
      display: block;
    }
  }
  .container {
    .list-container {
      margin: 0 0.54rem;
      .list-item {
        display: flex;
        align-items: flex-start;
        padding: 0.4rem 0;
        border-bottom: 0.02rem solid#F0F0F0;
        .list-left {
          padding-right: 0.32rem;
          img {
            width: 2.12rem;
            height: 1.6rem;
            display: block;
            object-fit: cover;
          }
        }
        .list-right {
          .name {
            font-size: 0.3rem;
            font-weight: bold;
            color: #303030;
            padding-bottom: 0.1rem;
          }
          .time {
            font-size: 0.22rem;
            font-weight: 400;
            color: #000000;
            padding-bottom: 0.1rem;
          }
          .tag {
            display: flex;
            align-items: center;
            padding-bottom: 0.1rem;
            div {
              font-size: 0.2rem;
              font-weight: 400;
              color: #617f9d;
              padding: 0.06rem;
              background: #f6f6f6;
              margin-right: 0.08rem;
              &:nth-last-child(1) {
                margin-right: 0;
              }
            }
          }
          .price {
            display: flex;
            align-items: baseline;
            .num {
              font-size: 0.3rem;
              font-weight: bold;
              color: #ff3100;
            }
            .unit {
              font-size: 0.2rem;
              font-weight: bold;
              color: #ff3100;
            }
            .sub-price {
              font-size: 0.22rem;
              font-weight: 400;
              color: #999999;
              padding-left: 0.1rem;
            }
          }
          .is-cancel {
            font-size: 0.28rem;
            font-weight: 400;
            color: #999999;
            padding-top: 0.48rem;
          }
        }
      }
    }
    .commission-footer {
      width: 100%;
      height: 1.5rem;
      box-shadow: 0rem -0.04rem 0.08rem 0rem rgba(0, 0, 0, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: fixed;
      bottom: 0;
      padding: 0 0.6rem;
      background: #ffffff;
      box-sizing: border-box;
      .btn-sell {
        width: 2.6rem;
        height: 0.72rem;
        font-size: 0.32rem;
        font-weight: 400;
        color: #000000;
        text-align: center;
        line-height: 0.72rem;
        background: #fef6d6;
        border-radius: 0.08rem;
        border: 0.04rem solid #ffce09;
      }
      .btn-line {
        width: 0.02rem;
        height: 0.46rem;
        background-color: #f2f2f2;
      }
      .btn-rent {
        width: 2.6rem;
        height: 0.76rem;
        font-size: 0.32rem;
        font-weight: 400;
        color: #000000;
        text-align: center;
        line-height: 0.76rem;
        background: #ffce09;
        border-radius: 0.08rem;
      }
    }
    .box-footer {
      width: 100%;
      height: 1.5rem;
    }
  }
  .container-nothing {
    .bannar {
      padding-top: 2rem;
      padding-bottom: 0.64rem;
      img {
        width: 1.62 * 2rem;
        height: 1.46 * 2rem;
        display: block;
        margin: 0 auto;
      }
    }
    .nothing-text {
      font-size: 0.36rem;
      font-weight: 400;
      color: #000000;
      text-align: center;
      padding-bottom: 0.28rem;
    }
    .nothing-subtitle {
      font-size: 0.24rem;
      font-weight: 400;
      text-align: center;
      color: #737373;
    }
    .nothing-btn {
      padding: 0.8rem 1.16rem 0;
      display: flex;
      justify-content: space-between;
      .btn {
        width: 2.4rem;
        height: 0.76rem;
        font-size: 0.28rem;
        font-weight: 400;
        color: #000000;
        text-align: center;
        line-height: 0.76rem;
        background: #fef6d6;
        border: 0.02rem solid #ffce09;
        margin-right: 0.4rem;
        &:nth-last-child(1) {
          margin-right: 0;
        }
      }
    }
    .nothing-footer {
      width: 100%;
      position: fixed;
      right: 0;
      bottom: 1rem;
      .footer-title {
        padding: 0 0.4rem 0.4rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title-line {
          width: 2.4rem;
          height: 0.02rem;
          background: #f7f7f7;
        }
        .title-text {
          font-size: 0.28rem;
          font-weight: 400;
          color: #737373;
          text-align: center;
        }
      }
      .footer-content {
        padding: 0 0.88rem;
        display: flex;
        justify-content: space-between;
        .content-item {
          font-size: 0.26rem;
          font-weight: bold;
          color: #c2c2c2;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          img {
            width: 0.76rem;
            height: 0.76rem;
            margin-bottom: 0.08rem;
          }
          .van-icon {
            color: #e2e2e2;
            font-size: 0.2rem;
            font-weight: bold;
            transform: rotate(-90deg);
            position: absolute;
            top: 0.4rem;
            right: -0.65rem;
          }
        }
      }
    }
  }
}
</style>
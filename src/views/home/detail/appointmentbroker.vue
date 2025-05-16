<template>
  <div class="appointmentbroker">
    <gni-nav-bar @onClickLeft="onClickBack" :pageTitle="headTitle" :hideRight="false">
    </gni-nav-bar>
    <div class="wrapper">
      <div class="ipt-container">
        <input v-model="pageData.keyword" type="text" placeholder="请输入经纪人的姓名或电话" @focus="broker = [],isTips=false" @blur="handleBlur">
        <div class="search-btn" @click="searchBroker(false)">搜索</div>
        <div class="empty" @click="searchBroker(true)" v-show="pageData.keyword">
          <img :src="$appConfig.appWebStaticUrl + '/home/icon_close.png'" alt="">
        </div>
      </div>
      <div class="search-tips" v-show="isTips">已为你匹配房源附近的精英经纪人</div>
      <div class="list-broker">
        <van-list @load="onLoad"
          v-model="pageData.loading"
          :finished="pageData.finished"
          finished-text="没有更多了">
          <div class="broker-item" v-for="(item,index) in broker" :key="index" @click="chooseBroker(item,index)">
            <div class="broker-container">
              <div class="broker-header">
                <img :src="item.avatar" @error="toolsGetErroAvatarImage($event)" alt="" class="header-img">
                <img :src="$appConfig.appWebStaticUrl + '/home/icon_broker_logo.png'" alt="" class="icon-logo">
              </div>
              <div class="broker-content">
                <div class="content-name">
                  <div class="name">{{item.broker_real_name}}</div>
                  <div class="grader">{{item.synthesize_score}}</div>
                  <div class="evaluations-num">{{item.evaluate_num_name}}</div>
                </div>
                <div class="content-region" style="padding:0.1rem 0">区域：{{item.district_name}}
                </div>
                <div class="content-region">门店：{{item.store_name}}</div>
              </div>
            </div>
            <div class="broker-btn">
              <img :src="$appConfig.appWebStaticUrl + '/home/icon_select.png'" alt="" v-if="appointmentbroker.broker_id == item.broker_id">
              <!-- 未选 -->
              <img :src="$appConfig.appWebStaticUrl + '/home/icon_unselect.png'" alt="" v-else>
            </div>
          </div>
        </van-list>
      </div>
    </div>
    <!-- 2022/9/1 小林说可以取消确定按钮 -->
    <!-- <div class="footer">
      <div class="btn-return" @click="confirm">确定</div>
    </div>
    <div class="footer-box"></div> -->
  </div>
</template>

<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import { mapState, mapActions, mapMutations } from "vuex";


export default {
  components: {
    gniNavBar
  },
  computed: {
    ...mapState("home", ["appointmentbroker"]),
    ...mapState("city", ["thisCityInfo", "switchCityInfo"]),
    ...mapState("user", ["userToken", "userInfo", "isLogin"]), //用户Token,用户登陆信息
  },
  data () {
    return {
      headTitle: '选择预约经纪人',
      inputData: '', // 搜索
      broker: [], // 经纪人列表数据
      brokerId: '', // 选择的经纪人ID
      pageData: {
        cityId: '',
        loading: false,//是否加载中
        finished: false,//是否已经加载完
        page: 0,
        page_size: 10,
        keyword: '', // 关键字搜索
      },
      isTips: true,
      district_id: '', // 区域id
      houseId: '', // 房源id
      resourceType: '', //1:二手房，2：租房
    }
  },
  watch: {
    houseId: {
      handler (newVal, oldVal) {
        if (!this.$commonUtils.utilCore.empty(oldVal)) {
          console.log('区域id已变');
          this.searchBroker(true)
        }
      },
      deep: true,
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   if (to.query.isBroker == "true") {
  //     to.meta.keepAlive = true
  //   } else {
  //     to.meta.keepAlive = false
  //   }
  //   next()
  // },
  // 离开的时候执行
  // beforeRouteLeave (to, from, next) {
  //   console.log(to, from);
  //   next()
  // },
  activated () {
    this.pageData.cityId = this.$route.query.city_id
    this.district_id = this.$route.query.district_id
    this.houseId = this.$route.query.houseId
    this.resourceType = this.$route.query.resourceType //1:二手房，2：租房
  },
  async mounted () {
    setTimeout(async () => {
      //初始化登陆的状态
      await this.init();
    }, 500)
  },
  methods: {
    ...mapMutations('home', ['setAppointmentbroker']),
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
      this.getBrokerList()
    },
    // 获取列表数据
    async getBrokerList () {
      this.pageData.finished = false;
      this.pageData.loading = true;
      this.pageData.page++;
      const postData = {
        city_id: this.pageData.cityId || this.switchCityInfo.city_id,
        page: this.pageData.page,
        page_size: this.pageData.page_size,
        keyword: this.pageData.keyword,
        order_district_id: this.district_id,
        district_id: this.district_id,
        order_shouse_id: this.resourceType == 1 ? this.houseId : "",//	否	string	根据二手房源激活、独家、VIP、钥匙、维护 经纪人提前
        order_rent_id: this.resourceType == 2 ? this.houseId : "",//	否	string	根据租房源激活、独家、VIP、钥匙、维护 经纪人提前
      }
      const res = await this.$store.dispatch('home/getAppFangBrokerlists', postData);
      if (res) {
        res.rows.forEach(item => {
          this.broker.push(item)
        });
        if (res.rows.length <= 1) {
          // 搜索完成
          this.pageData.finished = true;
        }
        this.pageData.loading = false;
      }
    },
    // 选择经纪人存入vuex
    chooseBroker (item, index) {
      this.setAppointmentbroker(item)
      console.log('看看', this.appointmentbroker);
      this.toolsGoPageBack();
    },
    // 搜索函数
    searchBroker (empty = false) {
      if (empty) {
        this.pageData.keyword = ''
      }
      // 清空数据
      this.broker = []
      this.pageData.page = 0
      this.pageData.page_size = 10
      this.onLoad()
    },
    handleBlur () {
      if (this.$commonUtils.utilCore.empty(this.pageData.keyword)) {
        this.searchBroker(true)
      }
    },
    // // 确定按钮
    // confirm () {
    //   this.toolsGoPageBack();
    // },
    // 返回
    onClickBack () {
      this.toolsGoPageBack();
    },
  }
}
</script>

<style lang="scss" scoped>
.appointmentbroker {
  height: 100vh;
  .wrapper {
    .ipt-container {
      width: 6.74rem;
      height: 0.68rem;
      box-shadow: 0rem 0.06rem 0.08rem 0rem rgba(223, 223, 223, 0.5);
      border-radius: 0.33rem;
      position: relative;
      margin: 0.24rem 0.38rem 0;
      input {
        width: 100%;
        height: 100%;
        font-size: 0.28rem;
        color: #0a3cc7;
        font-weight: 400;
        text-shadow: 0px 0px 0px rgba(223, 223, 223, 0.5);
        border-radius: 0.33rem;
        border: 0.01rem solid #999999;
        display: block;
        box-sizing: border-box;
        padding-left: 0.28rem;
        padding-right: 1.72rem;
      }

      .search-btn {
        width: 1.12rem;
        font-size: 0.28rem;
        font-weight: 400;
        color: #000000;
        line-height: 0.68rem;
        text-align: center;
        text-shadow: 0px 0px 0px rgba(223, 223, 223, 0.5);
        background: #ffce09;
        box-shadow: 0rem 0.06rem 0.08rem 0rem rgba(223, 223, 223, 0.5),
          -0.04rem 0rem 0.02rem 0rem rgba(192, 192, 192, 0.5);
        border-radius: 0.33rem;
        position: absolute;
        right: 0;
        top: 0;
      }
      .empty {
        position: absolute;
        top: 0.18rem;
        right: 1.4rem;
        z-index: 1;
        img {
          width: 0.32rem;
          height: 0.32rem;
          display: block;
        }
      }
    }
    .search-tips {
      width: 7.5rem;
      height: 0.68rem;
      font-size: 0.24rem;
      font-weight: 400;
      color: #000000;
      line-height: 0.68rem;
      text-align: center;
      background: #fffbe7;
      margin-top: 0.28rem;
    }
    .list-broker {
      margin-left: 0.34rem;
      .broker-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.22rem 0.48rem 0.24rem 0.14rem;
        font-family: SourceHanSansCN-Normal, SourceHanSansCN;
        border-bottom: 0.01rem solid #e5e5e5;
        .broker-container {
          display: flex;
          align-items: center;
          .broker-header {
            width: 1rem;
            height: 1.26rem;
            position: relative;
            .header-img {
              width: 100%;
              height: 100%;
              display: block;
              border-radius: 0.12rem;
              object-fit: cover;
            }
            .icon-logo {
              width: 0.28rem;
              height: 0.28rem;
              position: absolute;
              bottom: 0;
              right: 0;
            }
          }
          .broker-content {
            display: flex;
            flex-direction: column;
            padding-left: 0.24rem;
            .content-name {
              display: flex;
              align-items: center;
              font-weight: 400;
              .name {
                font-size: 0.3rem;
                color: #111111;
              }
              .grader {
                font-size: 0.24rem;
                color: #0a3cc7;
                padding: 0 0.2rem;
              }
              .evaluations-num {
                font-size: 0.24rem;
                color: #737373;
              }
            }
            .content-region {
              font-size: 0.24rem;
              color: #111111;
            }
          }
        }
        .broker-btn {
          img {
            width: 0.3rem;
            height: 0.3rem;
            display: block;
          }
        }
      }
    }
  }
  // .footer {
  //   width: 100%;
  //   // height: 1rem;
  //   position: fixed;
  //   bottom: 0;
  //   background: #ffffff;
  //   box-shadow: 0rem -0.04rem 0.08rem 0rem rgba(0, 0, 0, 0.08);
  //   padding: 0.26rem 0;
  //   .btn-return {
  //     width: 6.54rem;
  //     height: 1rem;
  //     margin: 0 auto;
  //     text-align: center;
  //     line-height: 1rem;
  //     font-size: 0.32rem;
  //     font-weight: 400;
  //     color: #000000;
  //     background: #ffce09;
  //     border-radius: 0.12rem;
  //   }
  // }
  // .footer-box {
  //   width: 100%;
  //   height: 1.5rem;
  // }
}
</style>
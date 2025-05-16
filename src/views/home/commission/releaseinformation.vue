<template>
  <div class="releaseinformation">
    <gni-nav-bar :pageTitle="headTitle" @onClickLeft="onClickBack" :hideRight="false" :hideLeft="false">
      <template slot="slot-left">
        <div class="nav-left">
          <img :src="$appConfig.appWebStaticUrl + '/commission/icon_return.png'" alt="">
        </div>
      </template>
      <template slot="slot-right">
        <div class="nav-right" @click="toolsGoPageView({path:'/home/commission/index'})">
          我的委托
        </div>
      </template>
    </gni-nav-bar>
    <div class="wrapper" v-show="entrustdata">
      <div class="bannar-nav">
        <div class="title">{{commissionData.village.mix_name}}{{entrustdata.floor_no=='全栋'?entrustdata.floor_no:(entrustdata.floor_no+'楼')}}{{entrustdata.room_no=='全层'?entrustdata.room_no:(entrustdata.room_no+'房')}}</div>
        <div class="info">
          <div class="info-title">{{entrust_type=='shouse'?'期望售价':'期望租金'}}：</div>
          <div class="info-data">{{entrustdata.price>0?entrust_type=='shouse'?(setPrice(entrustdata.price)+'万'):(entrustdata.price+'元'):'暂无数据'}}</div>
          <!-- <div class="info-data">{{commissionData.detail.price>0?commissionData.detail.price+(commissionData.detail.entrust_type=='shouse'?'万':'元'):'暂无数据'}}</div> -->
        </div>
        <div class="info">
          <div class="info-title">建筑面积：</div>
          <div class="info-data">{{entrustdata.acreage !=0?entrustdata.acreage	+'㎡':'暂无数据'}}</div>
          <!-- <div class="info-data">{{commissionData.detail.acreage>0?commissionData.detail.acreage+'㎡':'暂无数据'}}</div> -->
        </div>
        <div class="info">
          <div class="info-title">提交时间：</div>
          <div class="info-data">{{commissionData.detail.submitTime}}</div>
        </div>
      </div>
      <div class="process-container">
        <div class="process-item">
          <div class="top">
            <div class="subtitle">发布房源</div>
            <div class="state">
              <img :src="$appConfig.appWebStaticUrl + '/home/icon_select.png'" alt="">
              <div class="finish">已完成</div>
            </div>
          </div>
          <div class="bottom">填写基础信息，发布房源</div>
          <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_process.png'" alt="" class="icon-process">
        </div>
        <div class="process-item">
          <div class="top">
            <div class="subtitle">分配经纪人</div>
            <div class="state">
              <img :src="$appConfig.appWebStaticUrl + '/home/icon_select.png'" alt="" v-if="isDistribution==1">
              <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_cancel.png'" alt="" v-if="isDistribution==3">
              <div class="finish" :class="isDistribution==3?'cancel':''">{{isDistribution==1?'已完成':isDistribution==2?'待完成':'已取消'}}</div>
            </div>
          </div>
          <div class="bottom">分配房源所在小区优秀经纪人</div>
          <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_process.png'" alt="" class="icon-process" v-if="isDistribution==1 || isDistribution==3">
          <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_completed.png'" alt="" class="icon-process" v-else>
        </div>
        <div class="process-item" v-if="isDistribution!=3">
          <div class="upload-box">
            <div class="upload-left">真房源认证，上传两证，加速房源出售/出租</div>
            <div class="upload-btn" @click="toolsGoPageView({path:'/home/commission/proofupload'})">立即上传</div>
          </div>
        </div>
        <div class="process-item">
          <div class="top">
            <div class="subtitle">房源上架</div>
            <div class="state">
              <img :src="$appConfig.appWebStaticUrl + '/home/icon_select.png'" alt="" v-if="isShelf==1">
              <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_cancel.png'" alt="" v-if="isShelf==3">
              <div class="finish" :class="isShelf==3?'cancel':''">{{isShelf==1?'已完成':isShelf==2?'待完成':'已取消'}}</div>
            </div>
          </div>
          <div class="bottom">房源裕丰网展示</div>
          <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_process.png'" alt="" class="icon-process" v-if="isShelf==1 || isShelf==3">
          <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_completed.png'" alt="" class="icon-process" v-else>
        </div>
        <div class="process-line-short"></div>
        <div class="process-line-long" :style="isDistribution==3?'height:1.45rem':''"></div>
      </div>
      <div class="footer" v-if="!isSubmit">
        <div class="delete-btn" @click="deleteHouse">删除房源</div>
        <div class="confirm-btn" @click="reSubmit">重新提交委托</div>
      </div>
      <div class="footer-return" v-else>
        <div class="btn-return" @click="cancelHouse">取消发布</div>
      </div>
    </div>

    <van-popup v-model="showEntrust" :round="true" :close-on-click-overlay="false">
      <div class="entrust-container">
        <div class="entrust-title">
          <img :src="$appConfig.appWebStaticUrl + '/home/icon_select.png'" alt="">
          <div class="text">委托成功</div>
        </div>
        <div class="entrust-subtitle">上传房源委托必备证件，更多客源，减少沟通时间</div>
        <div class="entrust-btn">
          <div class="upload-now" @click="toolsGoPageView({path:'/home/commission/proofupload'})">立即上传</div>
          <div class="dont-upload" @click="showEntrust= false">暂不上传</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import gniNavBar from '@/components/gni/gni-nav-bar.vue'
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  components: { gniNavBar },
  data () {
    return {
      headTitle: '', //标题文字
      showEntrust: false,  // 委托成功弹窗
      isDistribution: 2, // 是否分配（1已完成2待完成3已取消）
      isShelf: 2, // 是否上架（1已完成2待完成3已取消）
      isSubmit: true,  // 按钮
      publish_id: '', // 委托ID
      entrust_type: '', // 委托类型[shouse:售,rent:租]
      entrustdata: '',  //委托的数据
      toBecompleted: true, // 待完成
      cancelled: false,// 已取消
    }
  },
  beforeRouteEnter (to, from, next) {
    next((e) => {
      if (from.path == "/home/commission/releasehouse" || from.path == "/home/commission/rentalhouse") {
        e.showEntrust = true
      }
    })
  },
  // 离开的时候执行
  beforeRouteLeave (to, from, next) {
    if (to.path != '/home/commission/proofupload') {
      this.setCommissionData({})
    }
    next()
  },
  // activated () {
  //   this.getDetail()
  // },
  async mounted () {
    this.$commonUtils.utilCore.showLoading();
    this.headTitle = this.commissionData.village.uptown_name
    this.publish_id = this.commissionData.detail.entrust_id
    this.entrust_type = this.commissionData.detail.entrust_type
    setTimeout(async () => {
      //初始化登陆的状态
      await this.init();
      await this.getDetail();
      this.$commonUtils.utilCore.closeLoading()
    }, 500)
  },
  computed: {
    ...mapState("commission", ["commissionData"]), //我的委托的信息
  },
  methods: {
    ...mapMutations('commission', ['setCommissionData']),
    async init () {
      console.log('数据', this.commissionData);
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
    // 获取委托详情
    async getDetail () {
      const postData = {
        entrust_id: this.publish_id || '',
        entrust_type: this.entrust_type || ''
      }
      const res = await this.$store.dispatch('commission/getAppEntrustAdetail', postData);
      if (res) {
        this.entrustdata = res
        if (this.entrustdata.broker_id != 0 && this.entrustdata.follow_status > 30) {
          this.isDistribution = 1
        } else {
          this.isDistribution = 2
        }
        if (this.entrustdata.shouse_id) {
          if (this.entrustdata.shouse_id != 0) {
            this.isShelf = 1
          } else {
            this.isShelf = 2
          }
        } else if (this.entrustdata.rent_id) {
          if (this.entrustdata.rent_id != 0) {
            this.isShelf = 1
          } else {
            this.isShelf = 2
          }
        }
        // if (this.entrustdata.is_cancel == 1) {
        //   this.isSubmit = false
        // } else {
        //   this.isSubmit = true
        // }
      }
    },
    // 删除房源
    async deleteHouse () {
      this.$commonUtils.utilCore.showLoading();
      const postData = {
        publish_id: this.publish_id || '',
        entrust_type: this.entrust_type || '',
        action: 'delete',
      }
      const res = await this.$store.dispatch('commission/getAppEntrustAupdateStatus', postData);
      if (res) {
        this.$commonUtils.utilCore.closeLoading()
        if (res.code == 200) {
          this.$commonUtils.utilCore.showToast("删除成功")
          this.toolsGoPageView({ path: '/home/commission/releasehouse' })
        }
      }
    },
    // 取消委托
    async cancelHouse () {
      this.$commonUtils.utilCore.showLoading();
      const postData = {
        publish_id: this.publish_id || '',
        entrust_type: this.entrust_type || '',
        action: 'cancel',
      }
      const res = await this.$store.dispatch('commission/getAppEntrustAupdateStatus', postData);
      if (res) {
        this.$commonUtils.utilCore.closeLoading()
        if (res.code == 200) {
          this.$commonUtils.utilCore.showToast("取消委托成功")
          this.isDistribution = 3
          this.isShelf = 3
          this.isSubmit = false
        }
      }

    },
    setPrice (val) {
      const value = Number(val);
      let price = Number((value / 10000).toFixed(2));
      return price
    },
    // 重新提交委托
    async reSubmit () {
      this.$commonUtils.utilCore.showLoading();
      const postData = {
        entrust_id: this.publish_id || '',//	是	string	委托ID
        entrust_type: this.commissionData.detail.entrust_type,//	是	string	委托租售类型[shouse、rent]
      }
      const res = await this.$store.dispatch('commission/getAppEntrustArePublish', postData);
      if (res) {
        this.$commonUtils.utilCore.closeLoading()
        if (res.code == 200) {
          this.$commonUtils.utilCore.showToast("重新提交成功")
          this.getDetail()
          this.showEntrust = true
          this.isSubmit = true
        }
      }
    },
    //返回上一层
    onClickBack () {
      this.toolsGoPageBack();
    },
  },
}
</script>

<style lang="scss" scoped>
.releaseinformation {
  height: 100vh;
  .nav-left {
    img {
      width: 0.4rem;
      height: 0.36rem;
      display: block;
    }
  }
  .nav-right {
    font-size: 0.28rem;
    font-weight: 400;
    color: #000000;
  }
  .wrapper {
    .bannar-nav {
      padding: 0.46rem 0 0.28rem 0.4rem;
      background: url("~@/assets/commission/iconSell/sell_bg.png") no-repeat;
      background-size: cover;
      .title {
        font-size: 0.36rem;
        font-weight: bold;
        color: #000000;
        padding-bottom: 0.24rem;
      }
      .info {
        display: flex;
        align-items: center;
        padding-bottom: 0.16rem;
        .info-title {
          font-size: 0.26rem;
          font-weight: 400;
          color: #4a4a4a;
        }
        .info-data {
          font-size: 0.26rem;
          font-weight: 400;
          color: #000000;
        }
      }
    }
    .process-container {
      padding-top: 0.2rem;
      margin-right: 0.4rem;
      margin-left: 0.8rem;
      position: relative;
      .process-item {
        padding: 0.4rem 0;
        border-bottom: 0.02rem solid #f7f7f7;
        position: relative;
        .top {
          padding-bottom: 0.18rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .subtitle {
            font-size: 0.3rem;
            font-weight: bold;
            color: #000000;
          }
          .state {
            display: flex;
            align-items: center;
            img {
              width: 0.26rem;
              height: 0.26rem;
            }
            .finish {
              font-size: 0.26rem;
              font-weight: 400;
              color: #000000;
              padding-left: 0.1rem;
            }
            .cancel {
              font-size: 0.26rem;
              font-weight: 400;
              color: #ff0000;
              padding-left: 0.05rem;
            }
          }
        }
        .bottom {
          font-size: 0.26rem;
          font-weight: 400;
          color: #737373;
        }
        .upload-box {
          width: 6.3rem;
          height: 1.12rem;
          background: #ffffff;
          box-shadow: 0rem 0.04rem 0.08rem 0rem rgba(0, 0, 0, 0.1);
          border: 0.02rem solid #d1d1d1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 0.28rem;
          box-sizing: border-box;
          .upload-left {
            width: 3.85rem;
            font-size: 0.28rem;
            font-weight: 400;
            color: #000000;
            line-height: 0.36rem;
          }
          .upload-btn {
            width: 1.28rem;
            height: 0.52rem;
            font-size: 0.28rem;
            font-weight: 400;
            color: #000000;
            text-align: center;
            line-height: 0.52rem;
            background: #fef6d6;
            border: 0.02rem solid #ffce09;
          }
        }
        .icon-process {
          width: 0.26rem;
          height: 0.26rem;
          position: absolute;
          top: 0.45rem;
          left: -0.4rem;
        }
      }
      .process-line-short {
        width: 0.02rem;
        height: 1.5rem;
        background-color: #d1d1d1;
        position: absolute;
        top: 0.88rem;
        left: -0.28rem;
      }
      .process-line-long {
        width: 0.02rem;
        height: 3.4rem;
        background-color: #d1d1d1;
        position: absolute;
        top: 2.6rem;
        left: -0.28rem;
      }
    }
  }
  .footer {
    width: 100%;
    background: #ffffff;
    box-shadow: 0rem -0.04rem 0.08rem 0rem rgba(0, 0, 0, 0.08);
    padding: 0.3rem 0.6rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    .delete-btn {
      width: 2.6rem;
      height: 0.72rem;
      font-size: 0.32rem;
      font-weight: 400;
      color: #000000;
      text-align: center;
      line-height: 0.72rem;
      border-radius: 0.08rem;
      border: 0.04rem solid #000000;
    }
    .confirm-btn {
      width: 2.64rem;
      height: 0.8rem;
      font-size: 0.32rem;
      font-weight: 400;
      color: #000000;
      text-align: center;
      line-height: 0.8rem;
      background: #ffce09;
      border-radius: 0.08rem;
    }
  }
  .footer-return {
    width: 100%;
    position: fixed;
    bottom: 0;
    background: #f9f9f9;
    padding: 0.26rem 0;
    .btn-return {
      width: 6rem;
      height: 0.8rem;
      margin: 0 auto;
      text-align: center;
      line-height: 0.8rem;
      font-size: 0.32rem;
      font-weight: 400;
      color: #000000;
      border-radius: 0.08rem;
      border: 0.02rem solid #cacaca;
    }
  }
  .entrust-container {
    width: 6.68rem;
    text-align: center;
    padding-top: 0.76rem;
    .entrust-title {
      padding-bottom: 0.68rem;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 0.48rem;
        height: 0.48rem;
      }
      .text {
        font-size: 0.44rem;
        font-weight: bold;
        color: #303030;
        padding-left: 0.1rem;
      }
    }
    .entrust-subtitle {
      font-size: 0.28rem;
      font-weight: 400;
      color: #303030;
      padding-bottom: 0.68rem;
    }
    .entrust-btn {
      .upload-now {
        width: 5.12rem;
        height: 0.8rem;
        font-size: 0.32rem;
        font-weight: 400;
        color: #000000;
        text-align: center;
        line-height: 0.8rem;
        background: #ffce09;
        border-radius: 0.1rem;
        margin: 0 auto;
      }
      .dont-upload {
        font-size: 0.28rem;
        font-weight: 400;
        color: #000000;
        padding: 0.4rem 0;
      }
    }
  }
  .van-popup--center.van-popup--round {
    border-radius: 0.1rem;
  }
}
</style>
<template>
  <div class="releasehouse">
    <gni-nav-bar @onClickLeft="onClickBack" :pageTitle="headTitle" :hideRight="false" :hideLeft="false">
      <template slot="slot-left">
        <div class="nav-left">
          <img :src="$appConfig.appWebStaticUrl + '/commission/icon_return.png'" alt="">
        </div>
      </template>
    </gni-nav-bar>
    <div class="wrapper" v-show="entrustdata">
      <div class="information-container">
        <div class="cell-container">
          <div class="cell">
            <div class="left-title">城市：</div>
            <div class="right-content">
              {{entrustdata.city_name}}
            </div>
          </div>
          <div class="cell">
            <div class="left-title">小区/路名：</div>
            <div class="right-content">
              {{entrustdata.uptown_name}}{{entrustdata.building_no?'-'+entrustdata.building_no:''}}
            </div>
          </div>
          <div class="cell">
            <div class="left-title">房号：</div>
            <div class="right-content">
              {{entrustdata.floor_no+(entrustdata.floor_no=='全栋'?'':'楼')}}{{entrustdata.room_no+(entrustdata.room_no=='全层'?'':'房')}}
            </div>
          </div>
          <div class="cell" style="justify-content: space-between;">
            <div class="content">
              <div class="left-title">{{entrust_type=='shouse'?'期望售价':'期望租金'}}：</div>
              <div class="right-content">
                {{entrust_type=='shouse'?setPrice(entrustdata.price):entrustdata.price}}
                <span>{{entrust_type=='shouse'?'万':'元'}}</span>
              </div>
            </div>
            <!-- 已取消的不显示 -->
            <!-- 2022/6/21 stella说先隐藏 -->
            <!-- <div class="modifybtn" @click="showModifybtn = true" v-if="entrustdata.is_cancel==0">调整价格</div> -->
          </div>
          <div class="cell">
            <div class="left-title">建筑面积：</div>
            <div class="right-content">
              {{entrustdata.acreage}}
              <span>㎡</span>
            </div>
          </div>
          <div class="line"></div>
          <div class="cell" v-if="entrust_type=='rent'">
            <div class="left-title">出租方式：</div>
            <div class="right-content">
              {{entrustdata.rent_type==0?'无':entrustdata.rent_type==1?'整租':'合租'}}
            </div>
          </div>
          <div class="cell">
            <div class="left-title">称呼：</div>
            <div class="right-content">
              {{entrustdata.appellation}}
            </div>
          </div>
          <div class="cell">
            <div class="left-title">联系方式：</div>
            <div class="right-content">
              {{entrustdata.mobile}}
            </div>
          </div>
          <div class="line"></div>
        </div>
      </div>
      <div class="house-flow">
        <div class="flow-title">房源发布流程</div>
        <div class="flow-sort">
          <div class="sort-item">
            <img :src="$appConfig.appWebStaticUrl + `commission/iconSell/icon_online0${entrustdata.process>=0?'2':'1'}.png`" alt="">
            <div class="item-name" :class="entrustdata.process>=0?'':'item-grey'">线上发布</div>
            <van-icon name="down" />
          </div>
          <div class="sort-item">
            <img :src="$appConfig.appWebStaticUrl + `/commission/iconSell/icon_verify0${entrustdata.process>=1?'1':'2'}.png`" alt="">
            <div class="item-name" :class="entrustdata.process>=1?'':'item-grey'">核实房源</div>
            <van-icon name="down" />
          </div>
          <div class="sort-item">
            <img :src="$appConfig.appWebStaticUrl + `/commission/iconSell/icon_grounding0${entrustdata.process>=2?'1':'2'}.png`" alt="">
            <div class="item-name" :class="entrustdata.process>=2?'':'item-grey'">房源上架</div>
            <van-icon name="down" />
          </div>
          <div class="sort-item">
            <img :src="$appConfig.appWebStaticUrl + `/commission/iconSell/icon_deal0${entrustdata.process>=3?'1':'2'}.png`" alt="">
            <div class="item-name" :class="entrustdata.process>=3?'':'item-grey'">签约成交</div>
          </div>
        </div>
      </div>
      <div class="footer-container">
        <div class="footer" v-if="entrustdata.is_cancel==0 && entrustdata.verify_status != 3">
          <div class="btn-cancel" @click="cancelHouse">取消委托</div>
          <div class="btn-line"></div>
          <div class="btn-return" @click="onClickBack">返回</div>
        </div>
        <div class="footer" v-else>
          <div class="btn-delete" @click="deleteHouse">删除房源</div>
          <div class="btn-line"></div>
          <div class="btn-resubmit" @click="reSubmit">重新提交委托</div>
        </div>
      </div>
    </div>

    <div class="box-footer"></div>
    <van-popup v-model="showModifybtn" :round="true" :close-on-click-overlay="false">
      <div class="modifybtn-container">
        <div class="close" @click="showModifybtn = false">
          <img :src="$appConfig.appWebStaticUrl + '/commission/icon_popclose.png'" alt="">
        </div>
        <div class="input-box">
          <div class="title">将价格调整为：</div>
          <div class="ipt-container">
            <input type="number" placeholder="请输入" v-model="modifyprice" @input="changemodifyPrice">
            <div class="price-change-box">
              <div class="price-change" v-show="modifyprice_change">{{modifyprice_change}}</div>
            </div>
          </div>
          <span>{{entrust_type=='shouse'?'万':'元'}}</span>
        </div>
        <div class="text-content">
          <textarea name="" id="" cols="30" rows="10" placeholder="可以告诉我们调整价格的原因么？" v-model="reason"></textarea>
        </div>
        <div class="line"></div>
        <div class="house-flow">
          <div class="flow-title price-title">调价流程</div>
          <div class="flow-sort">
            <div class="sort-item">
              <img :src="$appConfig.appWebStaticUrl + '/commission/icon_applicationprice.png'" alt="">
              <div class="item-name">申请调价</div>
              <van-icon name="down" />
            </div>
            <div class="sort-item">
              <img :src="$appConfig.appWebStaticUrl + '/commission/icon_verifyprice.png'" alt="">
              <div class="item-name">核实价格</div>
              <van-icon name="down" />
            </div>
            <div class="sort-item">
              <img :src="$appConfig.appWebStaticUrl + '/commission/icon_takeffect.png'" alt="">
              <div class="item-name">正式生效</div>
            </div>
          </div>
        </div>
        <div class="submit" @click="submit">提交</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  components: {
    gniNavBar,
  },
  computed: {
    ...mapState("user", ["userToken", "userInfo", "isLogin"]), //用户Token,用户登陆信息
    ...mapState("commission", ["commissionData"]), //城市的信息
  },
  data () {
    return {
      headTitle: '',
      publish_id: '', // 委托ID
      entrust_type: '', // 委托类型[shouse:售,rent:租]
      entrustdata: '',  //委托的数据
      showModifybtn: false, // 修改价格弹窗
      modifyprice: '', // 修改的价格
      modifyprice_change: '',// 转换后金额
      reason: '', //修改的原因
      lock: false,
    }
  },
  async mounted () {
    this.$commonUtils.utilCore.showLoading();
    this.publish_id = this.$route.query.id
    this.entrust_type = this.$route.query.entrust_type
    setTimeout(async () => {
      //初始化登陆的状态
      await this.init();
      await this.getDetail();
      this.$commonUtils.utilCore.closeLoading()
    }, 500)
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
    setPrice (val) {
      const value = Number(val);
      let price = Number((value / 10000).toFixed(2));
      return price
    },
    // 获取委托详情
    async getDetail (type) {
      const postData = {
        entrust_id: this.publish_id || '',
        entrust_type: this.entrust_type || ''
      }
      const res = await this.$store.dispatch('commission/getAppEntrustAdetail', postData);
      if (res) {
        this.entrustdata = res
        this.headTitle = this.entrustdata.address
        if (type == 'cancel') {
          this.$commonUtils.utilCore.showToast("取消委托成功")
        } else if (type == 'reSubmit') {
          this.$commonUtils.utilCore.showToast("重新提交成功")
        }
      }
    },
    // 修改金额
    changemodifyPrice () {
      this.modifyprice = this.modifyprice.toString().replace(/^[0]+[0-9]*$/gi, "");
      if (this.modifyprice && this.modifyprice != 0) {
        if (parseInt(this.modifyprice) > 10000000000) {
          this.modifyprice = this.modifyprice
            .toString()
            .substr(0, this.modifyprice.toString().length - 1);
        }
        // this.rentPriceTip = true;
        this.modifyprice_change = this.$commonUtils.utilCore.getConvertCurrency(
          this.modifyprice, (this.entrust_type == 'shouse' ? true : false),
        );
      } else {
        // this.rentPriceTip = false;
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
        if (res.code == 200) {
          this.getDetail('cancel')
        }
      }
    },
    // 删除房源
    async deleteHouse () {
      if (this.lock) return
      this.$commonUtils.utilCore.showLoading();
      const postData = {
        publish_id: this.publish_id || '',
        entrust_type: this.entrust_type || '',
        action: 'delete',
      }
      const res = await this.$store.dispatch('commission/getAppEntrustAupdateStatus', postData);
      if (res) {
        this.lock = true
        this.$commonUtils.utilCore.closeLoading()
        if (res.code == 200) {
          this.$commonUtils.utilCore.showToast("删除成功")
          setTimeout(() => {
            this.toolsGoPageBack();
            this.lock = false
          }, 300);
        }
      }
    },
    // 重新提交委托
    async reSubmit () {
      this.$commonUtils.utilCore.showLoading();
      const postData = {
        entrust_id: this.entrustdata.publish_id,//	是	string	委托ID
        entrust_type: this.entrust_type,//	是	string	委托租售类型[shouse、rent]
      }
      const res = await this.$store.dispatch('commission/getAppEntrustArePublish', postData);
      if (res) {
        if (res.code == 200) {
          // 修改委托id
          // this.publish_id = res.data.publish_id
          this.getDetail('reSubmit')
        }
      }
    },
    //  修改价格
    async submit () {
      const postData = {
        entrust_id: this.publish_id || '',//	是	string	委托ID
        entrust_type: this.entrust_type || '',//	是	string	委托类型shouse/rent
        price: this.modifyprice || "",//	是	string	价格(单位元)
        remark: this.reason || "",//	是	string	申请说明
      }
      const res = await this.$store.dispatch('commission/getAppEntrustAadjustPrice', postData);
      if (res) {
        this.$commonUtils.utilCore.showToast("提交成功，请等待审核")
        this.showModifybtn = false
        this.getDetail()
      }
    },
    onClickBack () {
      this.toolsGoPageBack();
    },
  }
}
</script>

<style lang='scss' scoped>
.releasehouse {
  padding-bottom: 1rem;
  .nav-left {
    display: flex;
    align-items: center;
    img {
      width: 0.4rem;
      height: 0.36rem;
      display: block;
    }
  }
  .wrapper {
    .information-container {
      .cell-container {
        .cell {
          padding: 0.38rem 0;
          margin: 0 0.4rem;
          display: flex;
          align-items: center;
          border-bottom: 0.02rem solid #f7f7f7;
          .content {
            display: flex;
            align-items: center;
          }
          .left-title {
            width: 1.7rem;
            font-size: 0.32rem;
            font-weight: 400;
            color: #737373;
            white-space: nowrap;
          }
          .right-content {
            font-size: 0.3rem;
            font-weight: bold;
            color: #000000;
            display: flex;
            align-items: center;
            span {
              font-weight: 300;
              padding-left: 0.1rem;
            }
          }
          .modifybtn {
            width: 1.6rem;
            height: 0.52rem;
            font-size: 0.28rem;
            font-weight: 400;
            color: #000000;
            line-height: 0.52rem;
            text-align: center;
            background: #fef6d6;
            border: 0.02rem solid #ffce09;
            position: relative;
            &::before {
              content: "";
              display: block;
              width: 0.02rem;
              height: 0.32rem;
              background: #d8d8d8;
              position: absolute;
              left: -0.4rem;
              top: 0.1rem;
            }
          }
        }
      }
    }
    .house-flow {
      padding: 0.34rem 0.48rem 0.3rem;
      .flow-title {
        font-size: 0.4rem;
        font-weight: bold;
        color: #000000;
        padding-bottom: 0.6rem;
      }
      .flow-sort {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .sort-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          img {
            width: 0.4rem;
            height: 0.4rem;
          }
          .item-name {
            font-size: 0.26rem;
            font-weight: bold;
            color: #303030;
            padding-top: 0.26rem;
          }
          .item-grey {
            color: #c2c2c2;
          }
          .van-icon {
            color: #9b9b9b;
            font-size: 0.2rem;
            font-weight: bold;
            transform: rotate(-90deg);
            position: absolute;
            top: 0.3rem;
            right: -0.55rem;
          }
        }
      }
    }
    .line {
      width: 100%;
      height: 0.2rem;
      background: #f8f8f8;
    }
  }
  .footer-container {
    width: 100%;
    height: 1.5rem;
    position: fixed;
    bottom: 0;
    background: #ffffff;
    box-shadow: 0rem -0.04rem 0.08rem 0rem rgba(0, 0, 0, 0.08);
    .footer {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 0 0.6rem;
      .btn-line {
        width: 0.02rem;
        height: 0.46rem;
        background-color: #f2f2f2;
      }
      .btn-cancel {
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
      .btn-return {
        width: 2.64rem;
        height: 0.76rem;
        font-size: 0.32rem;
        font-weight: 400;
        color: #000000;
        text-align: center;
        line-height: 0.72rem;
        background: #ffce09;
        border-radius: 0.08rem;
      }
      .btn-delete {
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
      .btn-resubmit {
        width: 2.64rem;
        height: 0.76rem;
        font-size: 0.32rem;
        font-weight: 400;
        color: #000000;
        text-align: center;
        line-height: 0.72rem;
        background: #ffce09;
        border-radius: 0.08rem;
      }
    }
  }
  .house-flow {
    padding: 0.34rem 0.48rem 0.3rem;
    .flow-title {
      font-size: 0.4rem;
      font-weight: bold;
      color: #000000;
      padding-bottom: 0.6rem;
    }
    .price-title {
      font-size: 0.32rem;
      padding-bottom: 0.24rem;
      border-bottom: 0.02rem solid #f7f7f7;
      margin-bottom: 0.2rem;
    }
    .flow-sort {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .sort-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        img {
          width: 0.4rem;
          height: 0.4rem;
        }
        .item-name {
          font-size: 0.26rem;
          font-weight: bold;
          color: #303030;
          padding-top: 0.26rem;
        }
        .van-icon {
          color: #9b9b9b;
          font-size: 0.2rem;
          font-weight: bold;
          transform: rotate(-90deg);
          position: absolute;
          top: 0.3rem;
          right: -0.55rem;
        }
      }
    }
  }
  .box-footer {
    width: 100%;
    height: 1.5rem;
  }
  .modifybtn-container {
    background: #ffffff;
    overflow: hidden;
    .close {
      display: flex;
      justify-content: flex-end;
      padding: 0.26rem 0.2rem 0.42rem 0;
      img {
        width: 0.28rem;
        height: 0.28rem;
        display: block;
      }
    }
    .input-box {
      display: flex;
      align-items: center;
      padding: 0 0.4rem 0.38rem;
      white-space: nowrap;
      .title {
        font-size: 0.36rem;
        font-weight: bold;
        color: #000000;
      }
      .ipt-container {
        input {
          width: 2.8rem;
          font-size: 0.36rem;
          font-size: 0.36rem;
          font-weight: bold;
          color: #000000;
          text-align: right;
          border: none;
          border-radius: 0;
          border-bottom: 0.02rem solid#D1D1D1;
          display: block;
        }
        .price-change-box {
          position: absolute;
          top: 0.1rem;
          right: 0.6rem;
          display: flex;
          justify-content: flex-end;
          .price-change {
            font-size: 0.28rem;
            font-weight: 400;
            color: #111111;
            background: #d7e8fd;
            border-radius: 0.04rem;
            padding: 0.16rem;
            margin-bottom: 0.1rem;
            position: relative;
            right: 0;
            display: inline-block;
            &::after {
              content: "";
              z-index: 1;
              position: absolute;
              bottom: -0.19rem;
              left: 50%;
              border: 0.1rem solid transparent;
              border-top-color: #d7e8fd;
              transform: translateX(-50%);
            }
          }
        }
      }

      span {
        font-size: 0.36rem;
        font-weight: 300;
        color: #111111;
      }
    }
    .text-content {
      padding-bottom: 0.34rem;
      textarea {
        width: 6.1rem;
        height: 2.8rem;
        background: #ffffff;
        font-size: 0.26rem;
        border: 0.02rem solid #d1d1d1;
        border-radius: 0;
        box-sizing: border-box;
        padding: 0.2rem;
        line-height: 0.36rem;
        display: block;
        margin: 0 auto;
      }
    }
    .line {
      width: 100%;
      height: 0.2rem;
      background: #f8f8f8;
    }
    .submit {
      width: 5.52rem;
      height: 0.8rem;
      font-size: 0.32rem;
      font-weight: 400;
      color: #000000;
      line-height: 0.8rem;
      text-align: center;
      background: #ffce09;
      border-radius: 0.1rem;
      margin: 0.28rem auto 0.4rem;
    }
  }
  .van-popup--center.van-popup--round {
    border-radius: 0.1rem;
  }
  /deep/ .van-nav-bar__title {
    max-width: 70%;
  }
  /deep/ .head-nav-title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
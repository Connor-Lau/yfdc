<template>
  <div class="checkreceipt">
    <gni-nav-bar @onClickLeft="onClickBack" :pageTitle="headTitle" :hideRight="false" ref="navBar">
    </gni-nav-bar>
    <div class="wrapper">
      <div class="wrapper-preview" ref="previewBar">
        <span>成交地址：</span> {{addressName}}
      </div>
      <div :style="{height:previewHeight+'px'}"></div>
      <div class="content" v-if="!$commonUtils.utilCore.empty(receiptArr) && !loading">
        <div class="receipt-box" v-for="(item,index) in receiptArr" :key="index+1">
          <div class="receipt-left">
            <div class="receipt-cell">
              <span>收据金额：</span> {{item.amount}}元
            </div>
            <div class="receipt-cell"><span>开具日期：</span>{{item.update_time}}</div>
          </div>
          <div class="receipt-btn" @click="goCheck(item)">查看收据</div>
        </div>
      </div>
      <div class="nothing" v-if="$commonUtils.utilCore.empty(receiptArr) && !loading">暂无收据</div>
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
      headTitle: '查看收据',
      previewHeight: '',
      flowId: '', // 合同id
      receiptArr: [], // 数据
      addressName: '', // 成交地址
      loading: true,
    }
  },
  async mounted () {
    this.flowId = this.$route.query.flowId
    this.addressName = this.$route.query.address
    setTimeout(async () => {
      //初始化登陆的状态
      await this.init();
      await this.getFlowReceipt();
    }, 500)
    this.$nextTick(() => {
      this.previewHeight = this.$refs.previewBar.offsetHeight
    })
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
    async getFlowReceipt () {
      this.loading = true
      this.$commonUtils.utilCore.showLoading();
      const postData = {
        flow_id: this.flowId, //	是	string	合同id
      }
      const res = await this.$store.dispatch('user/getAppFangcElectronicAgetFlowReceipt', postData);
      if (res) {
        this.receiptArr = res
        this.$commonUtils.utilCore.closeLoading()
        this.loading = false
      }
    },
    // 查看收据
    async goCheck (i) {
      this.$commonUtils.utilCore.showLoading();
      const postData = {
        flow_receipt_id: i.flow_receipt_id || '',//	是	string	用户名
      }
      const res = await this.$store.dispatch('user/getAppFangcElectronicAgetReceiptView', postData);
      if (res) {
        this.$commonUtils.utilCore.closeLoading()
        this.$router.push({
          path: '/tools/previewpdfh5',
          query: {
            url: res,
          }
        })
      }
    },
    onClickBack () {
      this.toolsGoPageBack();
    },
  }
}
</script>

<style lang="scss" scoped>
.checkreceipt {
  .wrapper {
    .wrapper-preview {
      width: 100%;
      display: flex;
      background: #e0efff;
      padding: 0.18rem 0.34rem 0.18rem 0.4rem;
      box-sizing: border-box;
      font-size: 0.26rem;
      font-weight: 400;
      color: #000000;
      line-height: 0.4rem;
      position: fixed;
      span {
        white-space: nowrap;
      }
    }
    .content {
      .receipt-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.46rem 0.2rem 0.44rem 0.36rem;
        border-bottom: 0.02rem solid #efefef;
        .receipt-left {
          width: 70%;
          .receipt-cell {
            font-size: 0.28rem;
            font-weight: 400;
            color: #000000;
            line-height: 0.42rem;
            padding-bottom: 0.2rem;
            display: flex;
            span {
              white-space: nowrap;
            }
            &:nth-last-child(1) {
              padding-bottom: 0;
            }
          }
        }
        .receipt-btn {
          width: 1.66rem;
          height: 0.44rem;
          font-size: 0.26rem;
          font-weight: 400;
          color: #000000;
          line-height: 0.45rem;
          text-align: center;
          background: #fef6d6;
          border-radius: 0.06rem;
          border: 0.02rem solid #ffce09;
        }
      }
    }
    .nothing {
      font-size: 0.32rem;
      font-weight: 400;
      color: #737373;
      text-align: center;
      padding-top: 0.2rem;
    }
  }
}
</style>
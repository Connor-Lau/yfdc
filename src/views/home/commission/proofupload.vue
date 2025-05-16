<template>
  <div class="proofupload">
    <gni-nav-bar :pageTitle="headTitle" @onClickLeft="onClickBack" :hideRight="false" :hideLeft="false">
      <template slot="slot-left">
        <div class="nav-left">
          <img :src="$appConfig.appWebStaticUrl + '/commission/icon_return.png'" alt="">
        </div>
      </template>
    </gni-nav-bar>
    <div class="wrapper">
      <div class="title">真房源认证</div>
      <div class="subtitle">两证认证，更多客源，自助上传。</div>
      <div class="box">
        <div class="box-title">业主身份证明</div>
        <div class="box-subtitle">有效期内产权人身份证</div>
        <div class="box-btn" @click="toolsGoPageView({path:'/home/commission/idcardupload'})">立即上传</div>
        <div class="untriangle" :class="entrustdata.is_upload_identify_img==1?'triangle':''"></div>
        <div class="untriangle-text" :class="entrustdata.is_upload_identify_img==1?'triangle-text':''">{{entrustdata.is_upload_identify_img==1?'已上传':'未上传'}}</div>
      </div>
      <div class="box">
        <div class="box-title">房屋权属证明</div>
        <div class="box-subtitle">国家认可的房屋权属证明，例如房产证、不动产权等有效证明</div>
        <div class="box-btn" @click="toolsGoPageView({path:'/home/commission/estateupload'})">立即上传</div>
        <div class="untriangle" :class="entrustdata.is_upload_property_img==1?'triangle':''"></div>
        <div class="untriangle-text" :class="entrustdata.is_upload_property_img==1?'triangle-text':''">{{entrustdata.is_upload_property_img==1?'已上传':'未上传'}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import gniNavBar from '@/components/gni/gni-nav-bar.vue'
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  components: { gniNavBar },
  data () {
    return {
      headTitle: '证明上传', //标题文字
      entrustdata: '',  //委托的数据
    }
  },
  computed: {
    ...mapState("commission", ["commissionData"]), //我的委托的信息
  },
  async mounted () {
    this.$commonUtils.utilCore.showLoading();
    setTimeout(async () => {
      //初始化登陆的状态
      await this.init();
      await this.getDetail();
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
    // 获取委托详情
    async getDetail () {

      const postData = {
        entrust_id: this.commissionData.detail.entrust_id || '',
        entrust_type: this.commissionData.detail.entrust_type || ''
      }
      const res = await this.$store.dispatch('commission/getAppEntrustAdetail', postData);
      if (res) {
        this.entrustdata = res
        this.$commonUtils.utilCore.closeLoading()
      }
    },
    //返回上一层
    onClickBack () {
      this.toolsGoPageBack();
    },
  }
}
</script>

<style lang="scss" scoped>
.proofupload {
  .nav-left {
    img {
      width: 0.4rem;
      height: 0.36rem;
      display: block;
    }
  }
  .wrapper {
    padding: 0.34rem 0.4rem 0;
    .title {
      font-size: 0.4rem;
      font-weight: bold;
      color: #000000;
      padding-bottom: 0.34rem;
    }
    .subtitle {
      font-size: 0.28rem;
      font-weight: 400;
      color: #737373;
      padding-bottom: 0.84rem;
    }
    .box {
      width: 6.7rem;
      background: #ffffff;
      box-shadow: 0rem 0rem 0.08rem 0.04rem rgba(0, 0, 0, 0.1);
      border-radius: 0.12rem;
      position: relative;
      margin-bottom: 0.6rem;
      .box-title {
        font-size: 0.38rem;
        font-weight: bold;
        color: #000000;
        padding: 0.42rem 0 0.1rem 0.48rem;
      }
      .box-subtitle {
        font-size: 0.26rem;
        font-weight: 400;
        color: #737373;
        padding: 0 0.7rem 0.92rem 0.48rem;
        line-height: 0.4rem;
      }
      .box-btn {
        width: 100%;
        height: 0.88rem;
        font-size: 0.3rem;
        font-weight: bold;
        color: #f7d447;
        text-align: center;
        line-height: 0.88rem;
        background: #ffffff;
        border-top: 0.02rem solid #f7f7f7;
      }
      .triangle {
        border-color: #ffce09 #ffce09 transparent transparent !important;
      }
      .untriangle {
        width: 0;
        height: 0;
        border-width: 0.55rem;
        border-style: solid;
        border-color: #d8d8d8 #d8d8d8 transparent transparent;
        position: absolute;
        top: 0;
        right: 0;
      }
      .triangle-text {
        color: #000000 !important;
      }
      .untriangle-text {
        font-size: 0.24rem;
        font-weight: bold;
        color: #ffffff;
        position: absolute;
        top: 0.25rem;
        right: 0rem;
        transform: rotate(45deg);
      }
    }
  }
}
</style>
<template>
  <div class="signlist">
    <gni-nav-bar @onClickLeft="onClickBack" :pageTitle="headTitle" :hideRight="false" ref="navBar">
    </gni-nav-bar>
    <div class="wrapper">
      <div class="wrapper-preview" v-show="!$commonUtils.utilCore.empty(topflowData)">
        <div class="preview-address">地址：{{topflowData.property_address}}</div>
        <div class="preview-btn" @click="checkContract(topflowData)">
          <span>预览</span>
          <img :src="$appConfig.appWebStaticUrl + '/user/icon_signeye.png'" alt="">
        </div>
      </div>
      <div class="wrapper-tab">
        <van-tabs v-model="tabActive" :title-active-color="'#000000'" :title-inactive-color="'#888888'" :line-width="'0'" :border="true" :animated="true" @click="handleTab" :offset-top="heightall" sticky>
          <van-tab title-class="tab-after">
            <template #title>
              <div class="tab-title">
                <img :src="$appConfig.appWebStaticUrl + '/user/icon_tobesign.png'" alt="" v-if="tabActive==0">
                <img :src="$appConfig.appWebStaticUrl + '/user/icon_tobesigning.png'" alt="" v-else>
                <span>待签约</span>
              </div>
            </template>
            <van-list @load="onLoad"
              v-model="pageData.loading"
              :finished="pageData.finished"
              :finished-text="finishedText">
              <div class="besign-box" v-for="(item,index) in datalist" :key="index+1">
                <div class="besign-title">
                  {{item.property_address}}
                  <span>{{calcLabel(item)}}</span>
                </div>
                <div class="besign-content">
                  <div class="besign-people" v-for="(itemsign,indexsign) in item.sign_arr" :key="indexsign+1">
                    <div class="besign-info" v-show="(!item.isShow && indexsign<2) || item.isShow">
                      <div class="info-left">{{itemsign.name}}</div>
                      <!-- 2023.7.8 取消手机号码展示 -->
                      <!-- <div class="info-right">（{{itemsign.phone}}）</div> -->
                      <div class="besign-label" :class="{'besigning':itemsign.status==0}">{{itemsign.status==0?'签署中':itemsign.status==1?'已签':itemsign.status==2?'拒签':'过期'}}</div>
                    </div>
                    <div class="besign-more" v-show="(!item.isShow && item.sign_arr.length>2 && indexsign==1) || (item.isShow && indexsign==item.sign_arr.length-1)" @click="checkMore(item)">
                      {{!item.isShow?'更多':'收起'}}
                      <img :src="$appConfig.appWebStaticUrl + '/user/icon_signbottom.png'" alt="" v-if="!item.isShow">
                      <img :src="$appConfig.appWebStaticUrl + '/user/icon_signtop.png'" alt="" v-else>
                    </div>
                  </div>
                </div>
                <div class="besign-time">
                  签署限期：
                  <span>{{$commonUtils.utilDate.dateChinese("",item.deadline)}}</span>
                </div>
                <div class="besign-btn">
                  <div class="besign-funbtn" @click="checkContract(item)">查看合同</div>
                  <div class="besign-funbtn" @click="toSign(item)">去签约</div>
                </div>
              </div>
            </van-list>
          </van-tab>
          <van-tab title="已签约">
            <template #title>
              <div class="tab-title">
                <img :src="$appConfig.appWebStaticUrl + '/user/icon_signed.png'" alt="" v-if="tabActive==1">
                <img :src="$appConfig.appWebStaticUrl + '/user/icon_signeding.png'" alt="" v-else>
                <span>已签约</span>
              </div>
            </template>
            <van-list @load="onLoad"
              v-model="pageData.loading"
              :finished="pageData.finished"
              :finished-text="finishedText">
              <div class="besign-box" v-for="(item,index) in datalist" :key="index+1">
                <div class="besign-title">
                  {{item.property_address}}
                  <span>{{calcLabel(item)}}</span>
                </div>
                <div class="besign-content">
                  <div class="besign-people" v-for="(itemsign,indexsign) in item.sign_arr" :key="indexsign+1">
                    <div class="besign-info" v-show="(!item.isShow && indexsign<2) || item.isShow">
                      <div class="info-left">{{itemsign.name}}</div>
                      <!-- 2023.7.8 取消手机号码展示 -->
                      <!-- <div class="info-right">（{{itemsign.phone}}）</div> -->
                      <div class="besign-label">{{itemsign.status==0?'签署中':itemsign.status==1?'已签':itemsign.status==2?'拒签':'过期'}}</div>
                    </div>
                    <div class="besign-more" v-show="(!item.isShow && item.sign_arr.length>2 && indexsign==1) || (item.isShow && indexsign==item.sign_arr.length-1)" @click="checkMore(item)">
                      {{!item.isShow?'更多':'收起'}}
                      <img :src="$appConfig.appWebStaticUrl + '/user/icon_signbottom.png'" alt="" v-if="!item.isShow">
                      <img :src="$appConfig.appWebStaticUrl + '/user/icon_signtop.png'" alt="" v-else>
                    </div>
                  </div>
                </div>
                <div class="besign-time">
                  签署时间：
                  <span>{{$commonUtils.utilDate.dateChinese("",item.finished_time)}}</span>
                </div>
                <div class="besign-btn">
                  <div class="besign-funbtn" @click="checkContract(item)">查看合同</div>
                  <div class="besign-funbtn" @click="checkReceipt(item)" v-show="item.status==2 && item.has_receipt==1">查看收据</div>
                </div>
              </div>
            </van-list>
          </van-tab>
        </van-tabs>
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
      headTitle: '线上签约',
      tabActive: 0, // tab index
      isMore: false,
      datalist: [], // 数据
      pageData: {
        loading: false,//是否加载中
        finished: false,//是否已经加载完
        page: 0,
      },
      heightall: 0,
      finishedText: '暂无线上签约信息',
      topflowData: {}
    }
  },
  computed: {
    ...mapState("user", ["userToken", "userInfo", "isLogin"]), //用户Token,用户登陆信息
  },
  beforeRouteEnter (to, from, next) {
    if (
      from.path == "/tools/previewpdfh5"
    ) {
      to.meta.canKeep = true;
    } else {
      to.meta.canKeep = false;
    }
    next();
  },
  activated () {
    // console.log('个人信息', this.userInfo);
    if (!this.$route.meta.canKeep) {
      this.initPage()
      this.onLoad();
    }
  },
  async mounted () {
    setTimeout(async () => {
      //初始化登陆的状态
      await this.init();
      await this.getTopFlow();
    }, 500)
    this.$nextTick(() => {
      this.heightall = this.$refs.navBar.getNavHeight()
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
    // 重置数据
    initPage () {
      this.pageData = {
        loading: false,//是否加载中
        finished: false,//是否已经加载完
        page: 0,
      }
      this.datalist = []
    },
    async onLoad () {
      this.getSignList()
    },
    async getTopFlow () {
      const postData = {
      }
      const res = await this.$store.dispatch('user/getAppFangcElectronicAgetTopFlow', postData);
      if (res) {
        this.topflowData = res
      }
    },
    // 获取合同列表
    async getSignList () {
      this.pageData.finished = false
      this.pageData.loading = true
      this.pageData.page++
      const postData = {
        status: this.tabActive == 0 ? '1' : '2',//	是	string	签约状态 1：未签约 2：已签约
        page: this.pageData.page,//	否	string	页码，默认第一页
      }
      const res = await this.$store.dispatch('user/getAppFangcElectronicAtest', postData);
      if (res.length > 0) {
        this.finishedText = '没有更多了'
        this.datalist.push(...res)
        this.datalist.forEach(item => {
          // 大于2条的标识
          item.isShow = false
        })
        // 后端写死10条
        if (res.length < 10) {
          this.pageData.finished = true
        }
      } else {
        this.finishedText = '暂无线上签约信息'
        this.pageData.finished = true
      }
      this.pageData.loading = false;
    },
    // 查看合同
    async checkContract (item) {
      this.$commonUtils.utilCore.showLoading();
      console.log(item);
      const postData = {
        flow_id: item.flow_id || ''//	是	string	合同id
      }
      const res = await this.$store.dispatch('user/getAppFangcElectronicAgetFlowPreview', postData);
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
    // 去签约
    async toSign (item) {
      this.$commonUtils.utilCore.showLoading();
      const postData = {
        flow_id: item.flow_id || ''//	是	string	合同id
      }
      const res = await this.$store.dispatch('user/getAppFangcElectronicAgetSignLink', postData);
      if (res) {
        this.$commonUtils.utilCore.closeLoading()
        // window.location.href = res
        this.toolsGoPageView({
          path: '/common/web-detail',
          query: { url: encodeURIComponent(res), title: '签约' },
        });
      }
    },
    // 查看收据
    checkReceipt (i) {
      this.toolsGoPageView({ path: '/user/checkreceipt', query: { flowId: i.flow_id, address: i.property_address } })
    },
    calcLabel (item) {
      if (item.report_type == 0) {
        return '诚意金'
      } else if (item.report_type == 1) {
        return '定金'
      } else if (item.report_type == 2) {
        if (item.business_type == 1) {
          return '成交买卖'
        } else {
          return '成交租赁'
        }
      }
    },
    // 更多按钮
    checkMore (v, i) {
      console.log(v, i);
      v.isShow = !v.isShow
      this.$forceUpdate()
      console.log(this.datalist);
    },
    handleTab (v) {
      this.pageData.page = 0
      this.datalist = []
      this.getSignList()
    },
    onClickBack () {
      this.toolsGoPageBack();
    },
  },

}
</script>

<style lang="scss" scoped>
.signlist {
  .wrapper {
    .wrapper-preview {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #e0efff;
      padding: 0.18rem 0.2rem 0.18rem 0.4rem;
      box-sizing: border-box;
      .preview-address {
        width: 85%;
        font-size: 0.26rem;
        font-weight: 400;
        color: #000000;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .preview-btn {
        display: flex;
        align-items: center;
        white-space: nowrap;
        span {
          font-size: 0.28rem;
          font-weight: 400;
          color: #032a98;
        }
        img {
          width: 0.25rem;
          height: 0.25rem;
        }
      }
    }
    .wrapper-tab {
      .tab-title {
        display: flex;
        // align-items: center;
        img {
          width: 0.36rem;
          height: 0.36rem;
          padding-right: 0.06rem;
        }
        span {
          font-size: 0.32rem;
        }
      }
      .besign-box {
        padding: 0.28rem 0.22rem 0.24rem 0.36rem;
        border-bottom: 0.02rem solid #dbdbdb;
        .besign-title {
          font-size: 0.32rem;
          font-weight: 500;
          color: #111111;
          padding-bottom: 0.16rem;
          line-height: 0.48rem;
          span {
            font-size: 0.24rem;
            font-weight: 400;
            color: #135ea9;
            padding: 0 0.1rem;
            background: #f6f6f6;
            margin-left: 0.08rem;
            display: inline-block;
          }
        }
        .besign-content {
          .besign-people {
            // padding-bottom: 0.16rem;
            line-height: 0.5rem;
            display: flex;
            align-items: center;
            .besign-info {
              font-size: 0.26rem;
              font-weight: 400;
              color: #000000;
              display: flex;
              align-items: center;
              .besign-label {
                font-size: 0.24rem;
                font-weight: 400;
                color: #000000;
                line-height: 0.27rem;
                text-align: center;
                background: #f6f6f6;
                white-space: nowrap;
                padding: 0.02rem 0.05rem;
                margin-left: 0.1rem;
                &.besigning {
                  color: #ff0000 !important;
                }
              }
            }

            .besign-more {
              font-size: 0.24rem;
              font-weight: 400;
              color: #0a0fc5;
              display: flex;
              align-items: center;
              margin-left: 1rem;
              img {
                width: 0.2rem;
                height: 0.2rem;
              }
            }
          }
        }
        .besign-time {
          font-size: 0.26rem;
          font-weight: 400;
          color: #000000;
          padding-bottom: 0.4rem;
          padding-top: 0.1rem;
          display: flex;
          align-items: center;
        }
        .besign-btn {
          display: flex;
          align-items: center;
          .besign-funbtn {
            width: 2rem;
            height: 0.52rem;
            background: #fef6d6;
            border-radius: 0.06rem;
            border: 0.02rem solid #ffce09;
            font-size: 0.28rem;
            font-weight: 400;
            color: #000000;
            line-height: 0.52rem;
            text-align: center;
            &:nth-child(1) {
              margin-right: 0.4rem;
            }
          }
        }
      }
      /deep/ .van-tab {
        &:nth-child(1):after {
          content: "";
          display: block;
          width: 0.02rem;
          height: 0.4rem;
          background: #f7f7f7;
          position: absolute;
          right: 0;
        }
      }
    }
  }
}
</style>
<template>
  <div class="detail">
    <gni-nav-bar @onClickLeft="onClickBack" :pageTitle="headTitle" :hideRight="false">
      <template slot="slot-right">
        <div class="nav-right">
          <div class="icon-chat" @click="goIm()">
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_chat01.png'" alt="">
            <div :class="unread>9?'tips-chat':'tips-chat-single'" v-if="unread">{{unread > 99 ? '99+' : unread}}</div>
          </div>
          <div class="icon-share" @click="isShare=true">
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_share03.png'" alt="">
          </div>
        </div>
      </template>
    </gni-nav-bar>
    <div class="wrapper" v-show="isInit">
      <div class="swipe">
        <van-swipe style="height: 5.2rem;" @change="changSwipe" :initial-swipe="swiperActive">
          <template v-if="swiperList.length">
            <van-swipe-item v-for="(item,index) in swiperList" :key="index" @click="handleShowPreview(swiperList,'swiperActive')">
              <img :src="toolsGetWebStaticUrl(item)" alt="" class="object-cover">
            </van-swipe-item>
          </template>
          <template v-if="!swiperList.length">
            <van-swipe-item>
              <img :src="$appConfig.appWebStaticUrl + 'common/house-shooting.png'" alt="" class="object-cover">
            </van-swipe-item>
          </template>
          <template #indicator>
            <div class="custom-indicator" v-show="swiperList.length">{{swiperList.length?(swiperActive+1):swiperActive}}/{{swiperList.length}}</div>
          </template>
        </van-swipe>
      </div>
      <div class="house-container">
        <div class="house-detail">
          <div class="house-information">
            <div class="title-price">
              <div class="title-top">{{headTitle}}</div>
              <div class="title-bottom">
                <div class="title-middle">{{detailList.sell_status_name}}</div>
                <div class="right-collection" :class="{'collectioned':isCollection}" @click="handleCollection">{{!isCollection?'关注':'已关注'}}</div>
              </div>
            </div>
            <div class="title-information">
              <div class="title-item">
                <div class="item-top item-top-price">{{detailList.average_price_name}}</div>
                <div class="item-bottom">参考均价</div>
              </div>
              <div class="title-item">
                <div class="item-top">{{detailList.price_name}}</div>
                <div class="item-bottom">参考总价</div>
              </div>
              <div class="title-item">
                <div class="item-top">{{detailList.acreage_name}}</div>
                <div class="item-bottom">面积</div>
              </div>
            </div>
            <div class="specific-information">
              <div class="specific-cell">
                <div class="cell-left">
                  开盘时间：<span>{{detailList.open_time_name}}</span>
                </div>
              </div>
              <div class="specific-cell">
                <div class="cell-left">
                  用途：<span>{{detailList.property_type_name}}</span>
                </div>
                <div class="cell-right">
                  产权：<span>{{extendList.property_year_name}}</span>
                </div>
              </div>
              <div class="specific-cell">
                <div class="cell-left">
                  户型：<span>{{detailList.layout_rooms_name}}</span>
                </div>
                <div class="cell-right">
                  类型：<span>{{detailList.building_type_name}}</span>
                </div>
              </div>
              <div class="specific-cell">
                <div class="cell-left">
                  区域：<span>{{detailList.district_name}}</span>
                </div>
              </div>
              <div class="specific-cell">
                <div class="cell-address" @click="goNewMapPosition">
                  地址：<span>{{extendList.loupan_address}}</span>
                  <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
                </div>
              </div>
            </div>
            <div class="more-information">
              <div class="info-inlineblock" @click="toolsGoPageView({path:'/home/detail/newsaleInfo'})">
                <span>更多楼盘信息</span>

                <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
              </div>

            </div>
          </div>
          <div class="house-card">
            <div class="card-title">楼盘详情</div>
            <div class="detail-icon">
              <div class="icon-item">
                <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_nonblank.png'" alt="" style="width:0.56rem">
                <span>非毛坯</span>
              </div>
              <div class="icon-item">
                <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_water.png'" alt="" style="width:0.6rem">
                <span>民水</span>
              </div>
              <div class="icon-item">
                <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_electricity.png'" alt="">
                <span>民电</span>
              </div>
            </div>
            <div class="card-detail">
              <div class="card-detail-cell">
                <div class="cell-one">绿化率：<span>{{extendList.green_rate_name}}</span></div>
                <div class="cell-one">容积率：<span>{{extendList.plot_rate_name}}</span></div>
                <div class="cell-one">车位比：<span>{{extendList.car_place_rate}}</span></div>
              </div>
              <div class="card-detail-cell">
                <div class="cell-one">开发商：<span>{{detailList.developer_name}}</span></div>
              </div>
              <div class="card-detail-cell">
                <div class="cell-one">物业公司：<span>{{extendList.property_company_name}}</span></div>
              </div>
              <div class="card-detail-cell">
                <div class="cell-one">物业费用：<span>{{extendList.property_fee_name}}</span></div>
              </div>
            </div>
          </div>
          <div class="recommended-house" v-if="newRecommend.length > 0">
            <div class="recommended-title">你可能还喜欢</div>
            <houselistItem :list="newRecommend" @goDetail="goNewRecommend"></houselistItem>
          </div>
          <div class="recommended-secondhouse">
            <div class="recommended-secondhouse-title">
              <div class="title-left">
                推荐二手房
              </div>
              <div class="title-right" @click="toolsGoPageView({path:'/home/list/secondhouseList', query: {isUpdate: 1}})">
                更多二手房
                <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
              </div>
            </div>
            <recommendsecond :list="secondRecommend" @goDetail="(shouse_id,block_id) => toolsGoPageView({path:'/home/detail/secondhouseDetail',query:{ id: shouse_id, block_id: block_id}})"></recommendsecond>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-broker">
      <div class="footer-left">
        <img :src="brokerList.avatar" @error="toolsGetErroAvatarImage($event,2)" alt="">
        <div>
          <div class="footer-name">
            <div class="name">{{brokerList.broker_name}}</div>
            <div class="label">经纪人</div>
          </div>
        </div>
      </div>
      <div class="footer-right">
        <div class="btn-question" @click="goChat(brokerList)">在线问</div>
        <div class="btn-phone" @click="callPhone(brokerList)" v-show="brokerList.telephone">打电话</div>
      </div>
    </div>
    <van-popup v-model="isShare" position="bottom" :round="true" teleport="body">
      <div class="share-pop">
        <div class="title">分享房源</div>
        <div class="content">
          <div class="content-item" @click="handleShare()">
            <img :src="$appConfig.appWebStaticUrl + '/common/icon_wechat.png'" alt="">
            <span>微信</span>
          </div>
          <div class="content-item" @click="handleShare(1)">
            <img :src="$appConfig.appWebStaticUrl + '/common/icon_wechatmoments.png'" alt="">
            <span>朋友圈</span>
          </div>
          <div class="content-item" @click="goShareChat">
            <img :src="$appConfig.appWebStaticUrl + '/common/icon_broker.png'" alt="">
            <span>经纪人</span>
          </div>
        </div>
        <div class="cancel" @click="isShare=false">取消</div>
      </div>
    </van-popup>
    <div
      class="image-preview">
      <van-image-preview
        v-model="showPreview"
        :images="previewImages"
        :loop="true"
        :closeable="true"
        :startPosition="bigIndexImg"
        @close="handleClosePreview()"
        @change="hanldImgChange">
        <template v-slot:index>{{ bigIndexImg + 1 }} / {{ previewImages.length }}</template>
      </van-image-preview>
    </div>
  </div>
</template>

<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import houselistItem from "./components/housedetailitem.vue"
import recommendsecond from "./components/recommendsecond.vue"

import { mapState, mapActions, mapMutations } from "vuex";

export default {
  components: {
    gniNavBar,
    houselistItem,
    recommendsecond,
  },
  data () {
    return {
      newhouseId: "",  // 楼盘id
      headTitle: '',
      isShare: false, // 分享弹窗
      isCollection: false, // 收藏
      detailList: {},  // 详情所有数据
      extendList: {}, // 详情所有数据
      swiperList: [], // 轮播图
      brokerList: {}, // 经纪人数据
      swiperActive: 0, //轮播图的移动下标
      newRecommend: [], // 猜你喜欢（新房推荐）
      secondRecommend: [], // 二手房推荐
      brokerId: '', // 经纪人id
      shareBrokerId: '', // 分享经纪人id

      // 图片预览
      showPreview: false,
      previewImages: [],
      bigIndexImg: 0, //大图展示下标
      previewKey: "",
      cityId: "",
      isBack: false,
      isInit: true,
    }
  },
  computed: {
    ...mapState("user", ["userToken", "userInfo", "isLogin"]), //用户Token,用户登陆信息
    ...mapState("city", ["thisCityInfo", "switchCityInfo"]), //城市的信息
    ...mapState('im', ['unread']),
  },
  watch: {
    $route: {
      async handler (val) {
        // 本详情跳本详情
        if (this.isBack && val.name === "/home/detail/newhouseDetail" && this.$route.meta.canKeep) {
          window.removeEventListener("popstate", this.handleClosePreview, false);
          this.$route.meta.canKeep = true;
          window.scroll(0, 0);
          this.initDataState();
          this.brokerId = this.$route.query.broker_id || "";
          this.shareBrokerId = this.$route.query.share_broker_id || "";
          this.cityId = this.$route.query.city_id || "";
          await this.init();
        }
      },
      deep: true,
      immediate: false,
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === "/home/detail/newhouseDetail") {
      to.meta.canKeep = true;
    } else {
      to.meta.canKeep = false;
    }
    next();
  },
  async mounted () {
    this.cityId = this.$route.query.city_id || "";
    this.newhouseId = this.$route.query.loupan_id || this.$route.query.id;  // 楼盘id
    await this.init();
  },
  async activated () {
    window.removeEventListener("popstate", this.handleClosePreview, false);
    if (this.isBack) {
      this.initDataState();
      window.scroll(0, 0);
      setTimeout(() => {
        window.scroll(0, 1);
      }, 100);
      this.cityId = this.$route.query.city_id || "";
      await this.init();
    }
    this.isBack = true;
  },
  destroyed () {
    window.removeEventListener("popstate", this.handleClosePreview, false);
  },
  methods: {
    ...mapMutations("home", ["changeNewsaleInfo"]),
    ...mapActions('app', ['getShareApp']),
    //初始化用户登录的情况
    async init () {
      // this.$commonUtils.utilCore.showLoading("", { overlay: true });
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
      this.getDetail()
      this.getNewRecommend()
      this.getSecondRecommend()
      this.getAttention()
      this.getNewsaleInfo()
      // this.$commonUtils.utilCore.closeLoading()
    },
    initDataState () {
      this.newhouseId = this.$route.query.loupan_id || this.$route.query.id;  // 楼盘id
      this.headTitle = '';
      this.isShare = false; // 分享弹窗
      this.isCollection = false; // 收藏
      this.detailList = {};  // 详情所有数据
      this.extendList = {}; // 详情所有数据
      this.swiperList = []; // 轮播图
      this.brokerList = {}; // 经纪人数据
      this.swiperActive = 0; //轮播图的移动下标
      this.newRecommend = []; // 猜你喜欢（新房推荐）
      this.secondRecommend = []; // 二手房推荐

      // 图片预览
      this.showPreview = false;
      this.previewImages = [];
      this.bigIndexImg = 0; //大图展示下标
      this.previewKey = "";
      this.cityId = "";
    },
    // 获取楼盘详情
    async getDetail () {
      this.isInit = false
      this.$commonUtils.utilCore.showLoading();
      let postData = {
        id: this.newhouseId
      }
      let res = await this.$store.dispatch('home/getAppFangHouseGetNewDetail', postData);
      if (res) {
        this.detailList = res.data
        this.extendList = res.extend
        this.brokerList = res.broker
        this.swiperList = res.pictures
        this.headTitle = this.detailList.loupan_name
        this.isInit = true
        this.$commonUtils.utilCore.closeLoading()
      }
    },
    // 猜你喜欢（新房推荐）
    async getNewRecommend () {
      let postData = {
        page_size: 6
      }
      let res = await this.$store.dispatch('home/getAppFangHouselistRecommend', postData);
      if (res.rows) {
        this.newRecommend = res.rows
      }
    },
    // 二手房推荐
    async getSecondRecommend () {
      let postData = {
        page_size: 6
      }
      let res = await this.$store.dispatch('home/getAppFangSalelistRecommend', postData);
      if (res.rows) {
        this.secondRecommend = res.rows
      }
    },
    async getAttention () {
      if (!this.isLogin) return;
      let postData = {
        city_id: this.cityId || this.switchCityInfo.city_id || this.thisCityInfo.city_id,
        resource_id: this.newhouseId,
        resource_type: "3"
      }
      let res = await this.$store.dispatch('home/getAppFangFavoriteStatus', postData);
      if (res) {
        this.isCollection = true
      } else {
        this.isCollection = false
      }
    },
    // 关注房源
    async addFangFavorite () {
      if (!this.isLogin) return location._fromCommission = 1, this.toolsGoPageView({ path: '/common/index', query: { fromCommission: true, path: '/user/index' } });
      const postData = {
        city_id: this.cityId || this.switchCityInfo.city_id || this.thisCityInfo.city_id,
        resource_id: this.newhouseId,
        resource_type: "3",
      }
      const res = await this.$store.dispatch('home/addAppFangFavorite', postData);
      if (res) {
        this.isCollection = true;
      }
    },
    // 取消关注
    async cancelFangFavorite () {
      if (!this.isLogin) return location._fromCommission = 1, this.toolsGoPageView({ path: '/common/index', query: { fromCommission: true, path: '/user/index' } });
      const postData = {
        city_id: this.cityId || this.switchCityInfo.city_id || this.thisCityInfo.city_id,
        resource_id: this.newhouseId,
        resource_type: "3",
      }
      const res = await this.$store.dispatch('home/cancelAppFangFavorite', postData);
      if (res) {
        this.isCollection = false;
      }
    },
    // 获取更多楼盘信息
    async getNewsaleInfo () {
      const postData = {
        id: this.newhouseId,
        // id: "59140"
      }
      const res = await this.$store.dispatch('home/getAppFangHouseGetDetailInfo', postData);
      if (res) {
        this.changeNewsaleInfo(res)
      }
    },
    // 关注房源事件
    handleCollection () {
      if (this.isCollection) {
        this.cancelFangFavorite();
      } else {
        this.addFangFavorite();
      }
    },
    onClickBack () {
      this.$router.go(-1);
    },
    changSwipe (v) {
      this.swiperActive = v
    },
    goNewRecommend (id) {
      // this.swiperList = [];  //清空轮播图数据
      // this.swiperActive = 0;
      // this.bigIndexImg = 0;
      // this.newhouseId = id;
      // this.init();
      this.$route.meta.canKeep = true;
      this.toolsGoPageView({ path: '/home/detail/newhouseDetail', query: { loupan_id: id } });
    },
    // 关闭预览图片事件
    handleClosePreview () {
      if (!window.history.state) {
        this.onClickBack();
      }
      window.removeEventListener("popstate", this.handleClosePreview, false);
    },
    handleShowPreview (arr, indexName) {
      this.previewImages = arr;
      this.previewKey = indexName;
      this.bigIndexImg = this[indexName];
      this.showPreview = true;
      window.history.pushState(null, null, null); // 添加一行，组织后退按钮跳转页面
      window.addEventListener("popstate", this.handleClosePreview, false);
    },
    // 改变大图图片的下标
    hanldImgChange (index) {
      this.bigIndexImg = index;
      if (!this.previewKey) return;
      this[this.previewKey] = index;
    },
    // 跳转聊天
    goChat (brokerInfo) {
      let houseInfo = {
        // 这里写 房源消息的内容
        loupan_id: this.newhouseId,//-> 楼盘id
        loupan_name: this.headTitle,//->  楼盘名字
        average_price: this.detailList.average_price_name, // 均价
        acreage_min: this.detailList.acreage_min, // 最小面积
        acreage_max: this.detailList.acreage_max, // 最大面积
        preview_url: this.detailList.picture || (this.$appConfig.appWebStaticUrl + 'common/house.png'),//->  图片地址
        loupan_address: this.extendList.loupan_address, // 楼盘地址
        share_broker_id: this.brokerList.erp_broker_id || 0,//-> 分享经纪人， 传当前经纪人：brokerInfo.erp_broker_id， 没有就传 0
      }

      this.$store.dispatch('im/goChat', {
        to: 'b_' + brokerInfo.erp_broker_id,
        houseInfo
      })
    },

    // 跳转房源分享
    goShareChat () {
      let houseInfo = {
        // 这里写 房源消息的内容
        loupan_id: this.newhouseId,//-> 楼盘id
        loupan_name: this.headTitle,//->  楼盘名字
        average_price: this.detailList.average_price_name, // 均价
        acreage_min: this.detailList.acreage_min, // 最小面积
        acreage_max: this.detailList.acreage_max, // 最大面积
        preview_url: this.detailList.picture || (this.$appConfig.appWebStaticUrl + 'common/house.png'),//->  图片地址
        loupan_address: this.extendList.loupan_address, // 楼盘地址
        share_broker_id: this.brokerList.erp_broker_id || 0,//-> 分享经纪人， 传当前经纪人：brokerInfo.erp_broker_id， 没有就传 0
      }
      this.$store.dispatch('im/goChatShare', houseInfo)
    },


    // 分享给朋友、朋友圈; type=0 分享到聊天界面
    async handleShare (type = 0) {
      // const href = this.detailList.share_url + "/" + (this.brokerList.brokerId || this.brokerList.erp_broker_id);

      const href = this.detailList.share_url;

      let shareInfo = {
        type: 0,
        summary: "[新房]",
        imageUrl: this.toolsGetWebStaticUrl(this.detailList.picture),
        href,
      };
      if (type === 0) {
        const { user_type = 1, user_id = "", user_row = { extend: { nickname: "" } } } = this.userInfo;
        const url = `/pages/card/house/detail`;
        const path = this.$commonUtils.utilCore.url(url, {
          id: this.newhouseId,
          broker_id: this.brokerId,//this.userInfo.uid,
          isBrokerShare: 0,
          share_broker_id: this.shareBrokerId,//this.userInfo.uid

          share_user_type: user_type,// 分享来源用户类型(1:用户,2:经纪人)  
          share_user_id: user_id,// 分享来源用户ID 
          share_username: user_row.extend.nickname,// 分享来源用户名 

          share_resource_type: '3',//  分享资源类型(1:二手房,2:租房,3:新房,4:小区,5:经纪人,6:动态,7:官网,8:获客文章,10:小程序,11:个人海报,12:房源海报,13:配图海报,14:获客文章海报,15:微信分享,16:微信朋友圈) 
          share_resource_id: this.newhouseId,// 分享资源ID  
          share_resource_name: this.headTitle,// 分享资源名称 
        });
        shareInfo = {
          type: 5,
          imageUrl: this.toolsGetWebStaticUrl(this.detailList.picture),
          miniProgram: {
            id: 'gh_cbb5c9d6827f',
            path: path,
            type: 0,
            webUrl: 'https://napp.yfdc.net'
          }
        }
      }
      const shareData = await this.getShareApp({
        messageAct: this.$messageAct,
        jsonData: {
          provider: "weixin",
          title: `${this.detailList.loupan_name} ${this.detailList.property_type_name}类 均价${this.detailList.average_price_name} （新房）`,
          scene: type === 0 ? "WXSceneSession" : "WXSceneTimeline",//WXSceneSession	分享到聊天界面;WXSceneTimeline	分享到朋友圈
          ...shareInfo,
        },
      });
    },

    // 地图定位
    goMapPosition () {
      const param = {};
      param.longitude = this.detailList.longitude;
      param.latitude = this.detailList.latitude;
      param.address = this.headTitle;
      param.label = '交通';
      param.tag = '地铁';
      this.toolsGoPageView({ path: "/home/map/position", query: param });
    },
    // 2022/10/11 新地图函数
    goNewMapPosition () {
      const param = {}
      param.longitude = this.detailList.longitude;
      param.latitude = this.detailList.latitude;
      param.userId = this.isLogin ? this.userInfo.user_uid : '0';
      param.houseId = this.newhouseId;
      param.houseType = 3;
      param.cityId = this.detailList.site_id
      param.isLogin = this.isLogin ? '1' : '0';
      param.isBroker = '0';
      param.address = this.headTitle;
      param.receiverUid = this.brokerList.erp_broker_id;
      param.brokerPhone = this.brokerList.telephone;
      param.platform = 'uapp';
      param.label = '交通';
      param.tag = '地铁';
      //地图分享该房源所需的参数
      param.share_url = this.detailList.share_url;
      param.brokerId = this.brokerList.broker_id;
      param.picture = this.detailList.picture;
      param.shareBrokerId = this.shareBrokerId
      param.district_name = this.detailList.district_name
      param.block_name = this.detailList.block_name
      param.price_name = this.detailList.price_name
      // 跳转经纪人聊天所需参数
      param.average_price_name = this.detailList.average_price_name
      param.acreage_min = this.detailList.acreage_min
      param.acreage_max = this.detailList.acreage_max
      param.loupan_address = this.extendList.loupan_address
      param.property_type_name = this.detailList.property_type_name
      console.log('参数', param);
      this.toolsGoPageView({ path: "/home/map/newmap", query: param });
    },
    goIm () {
      if (!this.isLogin) return location._fromCommission = 1, this.toolsGoPageView({ path: '/common/index', query: { fromCommission: true, path: '/user/index' } });
      this.$store.dispatch('im/goIm')
    },
    // 2023/2/09 拨打电话前调接口记录信息
    async callPhone (val) {
      try {
        const postData = {
          broker_id: val.broker_id || "",//是	string	经纪人id
          business_type: "702",//是	string	业务类型
          from_type: "7",//是	string	来源
          business_id: this.isLogin ? this.userInfo.user_id : '',//	否	string	用户id
          ex1: "",//否	string	房源类型 1二手房 2租房
          ex2: this.newhouseId || "",//否	string	房源id
        }
        await this.$store.dispatch('home/getAppWechatcSummaryAdd', postData);
      } catch (err) {
        console.log('出错啦', err);
      } finally {
        this.toolsGoPageTel(val.telephone)
        return
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.detail {
  padding-bottom: 1.3rem;
  .nav-right {
    display: flex;
    align-items: center;
    .icon-chat {
      padding-right: 0.42rem;
      position: relative;
      img {
        width: 0.4rem;
        height: 0.4rem;
        display: block;
      }
      .tips-chat {
        width: 0.52rem;
        height: 0.28rem;
        background: #f95640;
        border-radius: 0.14rem;
        font-size: 0.22rem;
        font-weight: 400;
        color: #ffffff;
        line-height: 0.28rem;
        text-align: center;
        position: absolute;
        top: -0.1rem;
        right: 0.2rem;
      }
      .tips-chat-single {
        width: 0.35rem;
        height: 0.35rem;
        background: #f95640;
        border-radius: 50%;
        font-size: 0.22rem;
        font-weight: 400;
        color: #ffffff;
        text-align: center;
        line-height: 0.35rem;
        position: absolute;
        top: -0.15rem;
        right: 0.3rem;
      }
    }
    .icon-share {
      img {
        width: 0.4rem;
        height: 0.4rem;
        display: block;
      }
    }
  }
  .wrapper {
    .swipe {
      position: relative;
      .custom-indicator {
        font-size: 0.26rem;
        font-weight: 400;
        color: #ffffff;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 0.3rem;
        position: absolute;
        left: 3.26rem;
        bottom: 1rem;
        padding: 0.08rem 0.26rem;
      }
      /deep/ .van-swipe-item {
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .house-container {
      box-sizing: border-box;
      background: #f8f8f9;
      .house-detail {
        padding-left: 0.2rem;
        padding-right: 0.18rem;
        box-sizing: border-box;
        position: relative;
        top: -0.74rem;
        right: 0;
        .house-information {
          background: #ffffff;
          border-radius: 0.18rem;

          .title-price {
            padding: 0.28rem 0.2rem 0.38rem 0.28rem;
            .title-top {
              font-size: 0.4rem;
              font-weight: bold;
              color: #303030;
              line-height: 0.6rem;
              padding-right: 0.2rem;
            }
            .title-bottom {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding-top: 0.2rem;
              .title-middle {
                width: 0.68rem;
                height: 0.46rem;
                font-size: 0.22rem;
                font-family: SourceHanSansCN-Normal, SourceHanSansCN;
                font-weight: 400;
                color: #000000;
                text-align: center;
                line-height: 0.46rem;
                background: #f7f7f7;
                // margin-right: 0.6rem;
              }
              .right-collection {
                width: 1rem;
                height: 0.48rem;
                font-size: 0.26rem;
                font-weight: bold;
                color: #ffffff;
                line-height: 0.48rem;
                text-align: center;
                background: linear-gradient(270deg, #ff5708 0%, #ff9700 100%);
                border-radius: 1rem;
                &.collectioned {
                  font-weight: 400 !important;
                  color: #646464 !important;
                  background: #e2e2e2 !important;
                }
              }
            }
          }
          .title-information {
            padding: 0 0.32rem 0.6rem 0.28rem;
            display: flex;
            justify-content: space-between;
            .title-item {
              .item-top {
                font-size: 0.32rem;
                font-weight: bold;
                color: #303030;
                padding-bottom: 0.05rem;
              }
              .item-top-price {
                color: #ff3100;
              }
              .item-bottom {
                font-size: 0.22rem;
                font-weight: 400;
                color: #999999;
              }
            }
          }
          .specific-information {
            padding: 0 0.68rem 0 0.28rem;
            .specific-cell {
              display: flex;
              align-items: center;
              padding-bottom: 0.32rem;
              .cell-left {
                width: 55%;
                font-size: 0.28rem;
                font-weight: 400;
                color: #999999;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                span {
                  color: #000000;
                }
              }
              .cell-right {
                font-size: 0.28rem;
                font-weight: 400;
                color: #999999;
                span {
                  color: #000000;
                }
              }
              .cell-address {
                font-size: 0.28rem;
                font-weight: 400;
                color: #999999;
                display: flex;
                align-items: center;
                white-space: nowrap;
                span {
                  width: 5.3rem;
                  color: #000000;
                  display: inline-block;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                img {
                  width: 0.4rem;
                  height: 0.4rem;
                }
              }
              &:nth-last-of-type(1) {
                padding-bottom: 0;
              }
            }
          }
          .more-information {
            font-size: 0.28rem;
            font-weight: 400;
            color: #8d8d8d;
            // display: flex;
            // align-items: center;
            // justify-content: center;
            padding-top: 0.6rem;
            padding-bottom: 0.4rem;
            text-align: center;
            span {
              vertical-align: middle;
            }
            .info-inlineblock {
              display: inline-block;
            }
            img {
              width: 0.4rem;
              height: 0.4rem;
            }
          }
        }
        .house-card {
          margin-top: 0.4rem;
          padding: 0.4rem 0;
          background-color: #fff;
          border-radius: 0.18rem;
          .card-title {
            font-size: 0.36rem;
            font-family: SourceHanSansCN-Bold, SourceHanSansCN;
            font-weight: bold;
            color: #000000;
            padding-left: 0.3rem;
          }
          .detail-icon {
            margin: 0.54rem 0.36rem 0.4rem 0.34rem;
            border-bottom: 0.02rem solid #f0f0f0;
            display: flex;
            justify-content: space-around;
            padding-bottom: 0.38rem;
            .icon-item {
              display: flex;
              flex-direction: column;
              align-items: center;
              img {
                width: 0.51rem;
                height: 0.56rem;
              }
              span {
                font-size: 0.24rem;
                font-weight: 400;
                color: #000000;
                padding-top: 0.14rem;
              }
            }
          }
          .card-detail {
            padding: 0 0.64rem 0 0.3rem;
            .card-detail-cell {
              display: flex;
              justify-content: space-between;
              padding-bottom: 0.24rem;
              .cell-one {
                font-size: 0.28rem;
                font-weight: 400;
                color: #999999;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                span {
                  color: #000000;
                }
              }
              &:nth-last-of-type(1) {
                padding-bottom: 0;
              }
            }
          }
        }
        .recommended-house {
          margin-top: 0.4rem;
          background: #ffffff;
          border-radius: 0.18rem;
          .recommended-title {
            font-size: 0.36rem;
            font-family: SourceHanSansCN-Bold, SourceHanSansCN;
            font-weight: bold;
            color: #000000;
            padding: 0.4rem 0 0 0.3rem;
          }
        }

        .recommended-secondhouse {
          margin-top: 0.4rem;
          background: #ffffff;
          border-radius: 0.18rem;
          padding: 0 0.18rem 0.4rem 0.3rem;
          .recommended-secondhouse-title {
            padding: 0.4rem 0.02rem 0.38rem 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .title-left {
              font-size: 0.36rem;
              font-family: SourceHanSansCN-Bold, SourceHanSansCN;
              font-weight: bold;
              color: #000000;
            }
            .title-right {
              font-size: 0.26rem;
              font-weight: 400;
              color: #8d8d8d;
              display: flex;
              align-items: center;
              img {
                width: 0.4rem;
                height: 0.4rem;
              }
            }
          }
        }
      }
    }
  }
  .footer-broker {
    width: 100%;
    height: 1.58rem;
    background: #ffffff;
    box-shadow: 0rem 0.04rem 0.08rem 0rem rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    right: 0;
    .footer-left {
      display: flex;
      padding-left: 0.4rem;
      img {
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 50%;
      }
      .footer-name {
        padding-left: 0.18rem;
        .name {
          font-size: 0.32rem;
          font-weight: bold;
          color: #000000;
          font-family: SourceHanSansCN-Bold, SourceHanSansCN;
        }
        .label {
          font-size: 0.24rem;
          font-weight: 400;
          color: #000000;
          font-family: SourceHanSansCN-Normal, SourceHanSansCN;
        }
      }
    }
    .footer-right {
      display: flex;
      padding-right: 0.38rem;
      .btn-question {
        width: 1.68rem;
        height: 0.8rem;
        font-size: 0.32rem;
        font-weight: bold;
        color: #000000;
        line-height: 0.8rem;
        text-align: center;
        border-radius: 0.08rem;
        border: 0.02rem solid #919191;
      }
      .btn-phone {
        width: 1.68rem;
        height: 0.8rem;
        font-size: 0.32rem;
        font-weight: bold;
        color: #000000;
        line-height: 0.8rem;
        text-align: center;
        background: #ffce09;
        border-radius: 0.08rem;
        // margin-right: 0.38rem;
        margin-left: 0.18rem;
      }
    }
  }
  .share-pop {
    .title {
      font-size: 0.32rem;
      font-weight: bold;
      color: #303030;
      padding-top: 0.46rem;
      padding-bottom: 0.24rem;
      margin: 0 0.4rem;
      border-bottom: 0.02rem solid#F0F0F0;
    }
    .content {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 0.4rem 0;
      border-bottom: 0.02rem solid#F0F0F0;
      .content-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          width: 0.96rem;
          height: 0.96rem;
        }
        span {
          font-size: 0.24rem;
          font-weight: 500;
          color: #696969;
          padding-top: 0.18rem;
        }
      }
    }
    .cancel {
      font-size: 0.32rem;
      font-weight: bold;
      color: #303030;
      text-align: center;
      padding: 0.4rem;
    }
  }
  .swipe-active {
    background: #ffce09 !important;
  }
  .around-active {
    font-weight: bold !important;
    color: #303030 !important;
  }
  .vehicle-active {
    border: 0.02rem solid #ffce09;
    background-color: #fff !important;
  }
  /deep/ .van-nav-bar__content .van-nav-bar__title {
    width: 3.5rem;
    .head-nav-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
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
    <div class="wrapper">
      <div class="house-detail">
        <div class="title">{{headTitle}}</div>
        <div class="title-price">
          <div class="price-top">成交价格</div>
          <div class="price-bottom">{{houseInfo.trade_amount}} 元/月</div>
        </div>
        <div class="house-label" v-show="houseLabel.length">
          <div class="label-item" v-for="(item,index) in houseLabel" :key="index">{{item.tag_name}}</div>
        </div>
        <div class="specific-information">
          <div class="specific-box">
            <div class="box-item box-item-left">
              成交：<span>{{$commonUtils.utilDate.date("Y.m",houseInfo.sign_time)}}</span>
            </div>
            <div class="box-item">
              装修：<span>{{houseInfo.decoration_name}}</span>
            </div>
          </div>
          <div class="specific-box">
            <div class="box-item box-item-left">
              楼层：<span>{{houseInfo.floor_name}}</span>
            </div>
            <div class="box-item">
              朝向：<span>{{houseInfo.house_orientation_name}}</span>
            </div>
          </div>
          <div class="specific-box">
            <div class="box-item box-item-left">
              电梯：<span>{{houseInfo.lift_status_name}}</span>
            </div>
            <div class="box-item">
              <div class="box-title">小区：</div>
              <span>{{houseInfo.uptown_name}}</span>
            </div>
          </div>
        </div>
        <div class="periphery-map">
          <div class="map-container relative" @click="goNewMapPosition">
            <div class="addressRadius absolute"></div>
            <div class="addressBox text-center px-5 py-1 absolute" v-if="setTextStr([houseInfo.site_name,houseInfo.uptown_name])">
              <div class="max-w-48 ellipsis" style="lineHeight:0.73rem">
                {{ setTextStr([houseInfo.district_name?houseInfo.district_name:houseInfo.site_name,houseInfo.uptown_name]) }}
              </div>
              <div class="addressInner absolute"></div>
            </div>
            <img :src="mapImage" v-if="mapImage">
          </div>
        </div>
        <div class="split-line"></div>
        <!-- 2023/1/9 小区成交 -->
        <div class="village-deal" v-show="villageDealList.length">
          <div class="deal-title" @click="goDealist()">
            <span>同小区同户型成交（{{villageDealTotal}}）</span>
            <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
          </div>
          <div class="deal-content">
            <div class="deal-item" v-for="(item,index) in villageDealList" :key="index+1">
              <div class="deal-item-left">
                <div class="left-icon">
                  <div class="icon-circular"></div>
                  <div class="icon-line"></div>
                </div>
                <div class="left-content">
                  <div class="left-info">{{item.layout_name}}/{{item.acreage_cover_name}}/{{item.house_orientation_name}}</div>
                  <div class="left-info-label">
                    {{$commonUtils.utilDate.date("Y.m",item.sign_time)}} 成交
                  </div>
                </div>
              </div>
              <div class="deal-item-right">{{item.trade_amount}}元/月</div>
            </div>
          </div>
        </div>
        <div class="split-line"></div>
        <div class="recommended-house" v-if="recommendList.length && !deaLock">
          <div class="recommended-title">推荐租房</div>
          <houselistItem :list="recommendList" @goDetail="goRentRecommend"></houselistItem>
          <div class="morehouse-btn" @click="toolsGoPageView({path:'/home/list/renthouseList', query: {isUpdate: 1,uptown_id:houseInfo.uptown_id}})">更多租房</div>
        </div>
        <div class="split-line"></div>
        <div class="recommend" v-if="!$commonUtils.utilCore.empty(broker) && !deaLock">
          <div class="recommend-title">小区置业顾问</div>
          <div class="recommend-broker">
            <div class="borker-container">
              <div class="broker-name">
                <div class="name">{{broker.broker_name}}</div>
                <div class="name-label">房源熟悉度:</div>
              </div>
              <div class="broker-progress">
                <van-progress :percentage="getFamiliarity(broker.familiarity_percent)" stroke-width="0.2rem" :track-color="'#EFEFEF'" v-if="broker.familiarity_percent" />
              </div>
              <div class="contact-btn">
                <div class="btn-chat" @click="goChat(broker)">
                  <img :src="$appConfig.appWebStaticUrl + '/home/icon_chating.png'" alt="">
                </div>
                <div class="btn-chat" @click="callPhone(broker)" v-show="broker.telephone">
                  <img :src="$appConfig.appWebStaticUrl + '/home/icon_phoneing.png'" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-broker" v-show="!$commonUtils.utilCore.empty(broker)">
      <div class="footer-left">
        <img :src="broker.avatar? broker.avatar : ($appConfig.appWebStaticUrl + '/common/icon_broker.png')" @error="toolsGetErroAvatarImage($event,2)" alt="">
        <div>
          <div class="footer-name">
            <div class="name">{{broker.broker_name}}</div>
            <div class="label">经纪人</div>
          </div>
        </div>
      </div>
      <div class="footer-right">
        <div class="btn-question" @click="goChat(broker)">在线问</div>
        <div class="btn-phone" @click="callPhone(broker)" v-show="broker.telephone">打电话</div>
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
          <!-- 2023/1/6 杨哥说不要分享朋友圈了 -->
          <!-- <div class="content-item" @click="handleShare(1)">
            <img :src="$appConfig.appWebStaticUrl + '/common/icon_wechatmoments.png'" alt="">
            <span>朋友圈</span>
          </div> -->
          <div class="content-item" @click="goShareChat">
            <img :src="$appConfig.appWebStaticUrl + '/common/icon_broker.png'" alt="">
            <span>经纪人</span>
          </div>
        </div>
        <div class="cancel" @click="isShare=false">取消</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import houselistItem from "@/components/yni/houselistItem.vue"

export default {
  components: {
    gniNavBar,
    houselistItem,
  },
  data () {
    return {
      longitude: '',// 房源经度
      latitude: '',// 房源纬度
      broker: {}, // 获取该楼盘的经纪人信息
      houseInfo: {},//楼盘信息
      headTitle: '',
      isShare: false, // 分享弹窗
      houseLabel: [],// 楼盘标签
      brokerId: '', // 经纪人id
      cityId: "",
      isBack: false,
      rentTradeId: '', // 租房成交详情id
      shareBrokerId: '',
      postGetData: { //小区列表
        houseType: "sale",//房源类型（sale 二手房，house 新房，rent 租房）
        searchUptownId: "",// 小区id
        setHuxing: [], // 户型
        setLayouthall: "",
        inputKeyWord: "",
        leaseSaleIndex: '2',
        city_id: 8,//	否	string	城市id 默认8
        page: 1,//	否	string	页码 默认1
        page_size: 3,//	否	string	每页显示数 默认10
      },
      villageDealList: [], //小区成交数据
      villageDealTotal: 0, // 小区成交总数
      recommendList: [], //推荐租房
      deaLock: true,
    }
  },
  computed: {
    ...mapState('im', ['unread']),
    ...mapState("user", ["userToken", "userInfo", "isLogin"]), //用户Token,用户登陆信息
    ...mapState("city", ["geoPosition", "thisCityInfo", "switchCityInfo", "cityInfoRows"]), //城市的信息 可能用到
    // 地图图片
    mapImage () {
      if (!this.longitude || !this.latitude) {
        return
      }
      const center = this.$commonUtils.utilCore.bd_decrypt(this.longitude, this.latitude); // 百度转高德
      return "https://restapi.amap.com/v3/staticmap?&zoom=15&location=" + center.longitude + "," + center.latitude + "&key=" + this.$appConfig.appMapKey[Math.floor(Math.random() * this.$appConfig.appMapKey.length)] + "&size=335*164";
    },
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === "/home/detail/renthouseDetail") {
      to.meta.canKeep = true;
    } else {
      to.meta.canKeep = false;
    }
    next();
  },
  async mounted () {
    window.scroll(0, 0);
    setTimeout(async () => {
      this.rentTradeId = this.$route.query.rent_trade_id || ''
      //初始化登陆的状态
      await this.init();
      this.getVillageDeal()
      this.getRecommendList()
    }, 500)
  },
  async activated () {
    if (this.isBack) {
      window.scroll(0, 0);
      this.initDataState();
      this.rentTradeId = this.$route.query.rent_trade_id || ''
      //初始化登陆的状态
      await this.init();
      this.getVillageDeal()
      this.getRecommendList()
    }
    this.isBack = true;
  },
  destroyed () {
  },
  methods: {
    ...mapActions('app', ['getShareApp']),
    // 初始化
    async init () {
      await this.getDetail();// 获取详情
    },
    // 初始化data变量
    initDataState () {
      this.longitude = '';// 房源经度
      this.latitude = '';// 房源纬度
      this.broker = {}; // 获取该楼盘的经纪人信息
      this.houseInfo = {};//楼盘信息
      this.headTitle = '';
      this.isShare = false; // 分享弹窗
      this.houseLabel = [];// 楼盘标签
    },
    // 获取详情
    async getDetail () {
      const postData = {
        rent_trade_id: this.rentTradeId || ''
      }
      let res = await this.$store.dispatch("home/getAppFangDealRentDetail", postData);
      if (res) {
        this.headTitle = res.data.shouse_title;
        this.houseInfo = res.data;
        this.longitude = this.houseInfo.longitude;
        this.latitude = this.houseInfo.latitude;
        this.broker = res.broker;
        for (let i in this.houseInfo.tags) {
          this.houseLabel.push(this.houseInfo.tags[i])
        }
      }
    },

    // 设置文字 带，
    setTextStr (arr = []) {
      const arrRes = [];
      arr.map(item => {
        if (!this.$commonUtils.utilCore.empty(item)) {
          arrRes.push(item);
        }
      })
      return arrRes.join("，");
    },
    // 2022/10/11 新地图函数
    goNewMapPosition () {
      const param = {}
      param.longitude = this.longitude;
      param.latitude = this.latitude;
      param.userId = this.isLogin ? this.userInfo.user_uid : '0';
      param.houseId = this.houseInfo.rent_id;
      param.houseType = 5;
      param.cityId = this.houseInfo.site_id
      param.isLogin = this.isLogin ? '1' : '0';
      param.isBroker = '0';
      param.address = this.houseInfo.uptown_name;
      param.receiverUid = this.broker.erp_broker_id;
      param.brokerPhone = this.broker.telephone;
      param.platform = 'uapp';
      param.label = '交通'; // 默认
      param.tag = '公交';// 默认
      //地图分享该房源所需的参数
      param.share_url = this.houseInfo.share_url || '';
      param.brokerId = this.broker.broker_id;
      param.picture = this.houseInfo.pictures[0] || '';
      param.shareBrokerId = this.shareBrokerId || ''
      param.district_name = this.houseInfo.district_name
      param.block_name = this.houseInfo.block_name
      param.price_name = this.houseInfo.trade_amount + '元/月'
      // 跳转经纪人聊天所需参数
      param.layout_short_name = this.houseInfo.layout_short_name
      param.house_orientation_name = this.houseInfo.house_orientation_name
      param.decoration_name = this.houseInfo.decoration_name
      param.acreage_cover = this.houseInfo.acreage_cover_name
      param.rent_trade_id = this.rentTradeId // 成交详情id
      this.toolsGoPageView({ path: "/home/map/newmap", query: param });
    },
    // 跳转聊天
    goChat (brokerInfo, type) {
      if (!this.isLogin) return location._fromCommission = 1, this.toolsGoPageView({ path: '/common/index', query: { fromCommission: true, path: '/user/index' } });
      if (JSON.stringify(brokerInfo) === "{}") return this.$commonUtils.utilCore.showToast("数据初始化中，请稍后再试");
      let houseInfo = {
        rent_id: this.rentTradeId,//->  租房id, 应该是pc的房源id
        rent_title: this.headTitle,//->  标题
        rent_price: this.houseInfo.trade_amount, // 价格
        layout_dname: this.houseInfo.layout_short_name,//->  房型室
        house_orientation_name: this.houseInfo.house_orientation_name,//->  房屋朝向
        decoration_name: this.houseInfo.decoration_name,//->  装修类型
        acreage: this.houseInfo.acreage_cover,//->  建筑面积
        preview_url: this.houseInfo.pictures[0] || this.$appConfig.appWebStaticUrl + 'common/house.png',//->  图片地址
        share_broker_id: this.shareBrokerId || 0,//-> 分享经纪人， 传当前经纪人：broker.erp_broker_id， 没有就传 0
        type: 'checkDealRent',
      }

      this.$store.dispatch('im/goChat', {
        to: 'b_' + (!type ? brokerInfo.erp_broker_id : brokerInfo.user_id),
        houseInfo
      })
    },

    // 跳转房源分享
    goShareChat () {
      let houseInfo = {
        rent_id: this.rentTradeId,//->  租房id
        rent_title: this.headTitle,//->  标题
        rent_price: this.houseInfo.trade_amount, // 价格
        layout_dname: this.houseInfo.layout_short_name,//->  房型室
        house_orientation_name: this.houseInfo.house_orientation_name,//->  房屋朝向
        decoration_name: this.houseInfo.decoration_name,//->  装修类型
        acreage: this.houseInfo.acreage_cover,//->  建筑面积
        preview_url: this.houseInfo.pictures[0] || this.$appConfig.appWebStaticUrl + 'common/house.png',//->  图片地址
        share_broker_id: this.shareBrokerId || 0,//-> 分享经纪人， 传当前经纪人：broker.erp_broker_id， 没有就传 0
        type: 'checkDealRent',
      }
      this.$store.dispatch('im/goChatShare', houseInfo)
    },

    // 分享给朋友、朋友圈; type=0 分享到聊天界面
    async handleShare (type = 0) {
      // share_url 是要分享朋友圈的
      // const href = this.houseDetail.share_url + "/" + (this.brokerId || this.brokerInfo.broker_id);
      let shareInfo = {
        type: 0,
        summary: "[成交租房]",
        imageUrl: this.toolsGetWebStaticUrl(this.houseInfo.pictures[0]),
        // href,
      };
      if (type === 0) {
        const url = `/pages/home/transaction-history/rent-detail`;
        const path = this.$commonUtils.utilCore.url(url, {
          id: this.rentTradeId,
        });
        console.log('地址', path);
        shareInfo = {
          type: 5,
          imageUrl: this.toolsGetWebStaticUrl(this.houseInfo.pictures[0]),
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
          title: `【${this.houseInfo.district_name}${this.houseInfo.block_name}】${this.headTitle} ${this.houseInfo.trade_amount + '元/月'}`,
          scene: type === 0 ? "WXSceneSession" : "WXSceneTimeline",//WXSceneSession	分享到聊天界面;WXSceneTimeline	分享到朋友圈
          ...shareInfo,
        },
      });
      this.$commonUtils.appLog.log("shareData", JSON.stringify(shareData));
    },
    goIm () {
      if (!this.isLogin) return location._fromCommission = 1, this.toolsGoPageView({ path: '/common/index', query: { fromCommission: true, path: '/user/index' } });
      this.$store.dispatch('im/goIm')
    },
    // 获取小区成交数据
    async getVillageDeal () {
      this.deaLock = true
      this.postGetData.city_id = this.houseInfo.site_id || 8
      this.postGetData.searchUptownId = this.houseInfo.uptown_id
      this.postGetData.setHuxing = [{
        id: this.houseInfo.layout_room_id
      }]
      this.postGetData.setLayouthall = this.houseInfo.layout_hall_id
      this.postGetData.inputKeyWord = this.houseInfo.uptown_name
      let res = await this.$store.dispatch("home/actAppFangDealRentList", this.postGetData);
      if (res) {
        this.villageDealList = res.rows
        this.villageDealTotal = res.total
        this.deaLock = false
      }
    },
    // 推荐租房列表
    async getRecommendList () {
      const postData = {
        id: this.houseInfo.rent_id,//	否	string	租房id
        page_size: 4,//	否	string	每页显示数 默认10
      }
      const res = await this.$store.dispatch('home/appFangRentListRecommend', postData);
      if (res) {
        res.rows.forEach(item => {
          item.subtitle = this.showTitle(item, 0).toString()
        });
        this.recommendList = res.rows || [];
      }
    },
    /**
     * 显示户型等内容
     * item=>数据
     * type=>数据类型
     */
    showTitle (item, type) {
      let strTitle = "";
      if (type == 0) {//二手房
        if (!this.$commonUtils.utilCore.empty(item.district_name)) {
          strTitle += item.district_name + "/"
        }
        if (!this.$commonUtils.utilCore.empty(item.layout_short_name)) {
          strTitle += item.layout_short_name + "/"
        }
        if (!this.$commonUtils.utilCore.empty(item.acreage_cover_name)) {
          strTitle += item.acreage_cover_name + "/"
        }
        if (!this.$commonUtils.utilCore.empty(item.house_orientation_name)) {
          if (item.house_orientation_name != '保留') {
            strTitle += item.house_orientation_name + "/"
          }
        }
        if (!this.$commonUtils.utilCore.empty(item.floor_name)) {
          strTitle += item.floor_name + "/"
        }
        //去掉未尾的 /
        strTitle = strTitle.substr(-1) == "/" ? strTitle.substr(0, strTitle.length - 1) : strTitle

      } else if (type == 1) {//新房
        if (!this.$commonUtils.utilCore.empty(item.district_name)) {
          strTitle += item.district_name + "/"
        }
        if (!this.$commonUtils.utilCore.empty(item.property_type_name)) {
          strTitle += item.property_type_name + "/"
        }
        if (!this.$commonUtils.utilCore.empty(item.acreage_name)) {
          strTitle += item.acreage_name + "/"
        }
        if (!this.$commonUtils.utilCore.empty(item.sell_status_name)) {
          strTitle += item.sell_status_name + "/"
        }
        //去掉未尾的 /
        strTitle = strTitle.substr(-1) == "/" ? strTitle.substr(0, strTitle.length - 1) : strTitle
      } else if (type == 2) {//租房
        if (!this.$commonUtils.utilCore.empty(item.district_name)) {
          strTitle += item.district_name + "/"
        }
        if (!this.$commonUtils.utilCore.empty(item.floor_name)) {
          strTitle += item.floor_name + "/"
        }
        if (!this.$commonUtils.utilCore.empty(item.house_orientation_name)) {
          strTitle += item.house_orientation_name + "/"
        }
        //去掉未尾的 /
        strTitle = strTitle.substr(-1) == "/" ? strTitle.substr(0, strTitle.length - 1) : strTitle
      } else {
        strTitle = "数据不正确"
      }
      //海珠区/2室1厅/80㎡/朝南北/中楼层
      return strTitle;
    },
    // 跳转租房详情
    async goRentRecommend (v) {
      window.scroll(0, 0);
      this.$route.meta.canKeep = true;
      this.toolsGoPageView({ path: '/home/detail/renthouseDetail', query: { id: v.rent_id, block_id: v.block_id } });
    },
    // 获取熟悉度数字
    getFamiliarity (text) {
      return Number(text) || 0;
    },
    // 跳转同小区同户型
    goDealist () {
      //把数据存在vuex里去
      this.$store.commit('home/setSearchPostGetData', this.postGetData);
      this.toolsGoPageView({ path: '/home/list/dealist', query: { isUpdate: 1 } })
    },
    // 2023/2/09 拨打电话前调接口记录信息
    async callPhone (val) {
      try {
        const postData = {
          broker_id: val.broker_id || "",//是	string	经纪人id
          business_type: "702",//是	string	业务类型
          from_type: "7",//是	string	来源
          business_id: this.isLogin ? this.userInfo.user_id : '',//	否	string	用户id
          ex1: "2",//否	string	房源类型 1二手房 2租房
          ex2: this.houseInfo.rent_id || "",//否	string	房源id
        }
        await this.$store.dispatch('home/getAppWechatcSummaryAdd', postData);
      } catch (err) {
        console.log('出错啦', err);
      } finally {
        this.toolsGoPageTel(val.telephone)
        return
      }
    },
    // 返回
    onClickBack () {
      this.$router.go(-1);
    }
  }
}
</script>

<style lang="scss" scoped>
.detail {
  padding-bottom: 1.58rem;
  .icon-vr {
    width: 1.36rem !important;
    height: 0.78rem !important;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
  }
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
    // .swipe {
    //   position: relative;
    //   .custom-indicator {
    //     font-size: 0.26rem;
    //     font-weight: 400;
    //     color: #ffffff;
    //     background: rgba(0, 0, 0, 0.5);
    //     border-radius: 0.3rem;
    //     position: absolute;
    //     right: 0.26rem;
    //     bottom: 0.36rem;
    //     padding: 0.05rem 0.26rem;
    //   }
    //   .swipe-tab {
    //     height: 0.44rem;
    //     font-size: 0.22rem;
    //     font-weight: 500;
    //     line-height: 0.44rem;
    //     color: #000000;
    //     background: #ffffff;
    //     border-radius: 0.22rem;
    //     position: absolute;
    //     bottom: 0.36rem;
    //     // left: 2.36rem;
    //     left: 50%;
    //     display: flex;
    //     justify-content: space-between;
    //     transform: translate(-50%, 0);
    //     span {
    //       width: 0.76rem;
    //       height: 100%;
    //       opacity: 0.7;
    //       text-align: center;
    //       border-radius: 0.22rem;
    //       margin-right: 0.2rem;
    //       &:nth-last-child(1) {
    //         margin-right: 0;
    //       }
    //     }
    //   }
    //   /deep/ .van-swipe-item {
    //     img {
    //       width: 100%;
    //       height: 100%;
    //     }
    //   }
    // }
    .house-detail {
      .title {
        font-size: 0.44rem;
        font-weight: bold;
        color: #303030;
        line-height: 0.56rem;
        padding: 0.4rem 0.46rem 0.36rem;
      }
      .title-price {
        padding: 0 0 0.44rem 0.5rem;
        .price-top {
          font-size: 0.26rem;
          font-weight: 400;
          color: #999999;
          padding-bottom: 0.1rem;
        }
        .price-bottom {
          font-size: 0.36rem;
          font-weight: bold;
          color: #ff3100;
        }
      }
      .house-label {
        padding: 0 0.48rem 0.4rem 0.5rem;
        display: flex;
        flex-wrap: wrap;
        .label-item {
          width: 1.2rem;
          height: 0.64rem;
          font-size: 0.26rem;
          font-weight: 400;
          color: #000000;
          line-height: 0.64rem;
          text-align: center;
          background: #f8f8f8;
          margin-right: 0.2rem;
          &:nth-child(4n) {
            margin-right: 0;
          }
        }
      }
      .address-navigation {
        padding: 0.4rem 0.48rem;
        display: flex;
        .address-item {
          background: #ffffff;
          box-shadow: 0rem 0rem 0.08rem 0rem #dadada;
          border-radius: 0.08rem;
          padding: 0.2rem 0.16rem 0.2rem 0.24rem;
          font-size: 0.24rem;
          font-family: SourceHanSansCN-Normal, SourceHanSansCN;
          font-weight: 400;
          color: #000000;
          line-height: 0.4rem;
          position: relative;
          margin-right: 0.42rem;
          .address-item-title {
            // white-space: nowrap;
            span {
              font-size: 0.26rem;
              font-weight: bold;
              color: #000000;
            }
          }
          img {
            width: 0.8rem;
            height: 0.8rem;
            position: absolute;
            // top: 0.54rem;
            // right: -0.3rem;
            bottom: 0;
            right: -0.15rem;
          }
          &:nth-last-of-type(1) {
            margin-right: 0;
          }
        }
      }
      .specific-information {
        padding: 0 0.3rem 0.02rem 0.5rem;
        .specific-box {
          display: flex;
          padding-bottom: 0.4rem;
          .box-item-left {
            width: 55% !important;
          }
          .box-item {
            width: 50%;
            font-size: 0.32rem;
            font-weight: 400;
            color: #999999;
            display: flex;
            .box-title {
              white-space: nowrap;
            }
            span {
              color: #000000;
            }
          }
        }
      }
      .appointment-key {
        padding: 0.36rem 0.52rem 0.36rem 0.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .appointment-key-left {
          display: flex;
          align-items: center;
          img {
            width: 0.72rem;
            height: 0.48rem;
          }
          span {
            font-size: 0.28rem;
            font-weight: 400;
            color: #000000;
            padding-left: 0.08rem;
          }
        }
        img {
          width: 0.4rem;
          height: 0.4rem;
        }
      }
      .periphery-map {
        padding-bottom: 0.4rem;
        .map-container {
          height: 3.28rem;
          overflow: hidden;
          background: #f5f3f0;
          .addressRadius {
            width: 0.34rem;
            height: 0.34rem;
            background: #fff3c3;
            border: 0.02rem solid #ffce09;
            border-radius: 50%;
            z-index: 1;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          .addressBox {
            height: 0.7rem;
            box-shadow: 0rem 0rem 0.08rem 0rem rgba(0, 0, 0, 0.5);
            top: calc(50% - 0.34rem - 0.2rem);
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 0.3rem;
            font-weight: bold;
            background: #ffffff;
            z-index: 2;
            line-height: 0.46rem;
            border-radius: 0.1rem;
            .addressInner {
              border-width: 0.18rem;
              border-style: solid;
              border-color: #fff transparent transparent;
              padding: 0;
              width: 0;
              height: 0;
              left: 50%;
              bottom: -0.3rem;
              transform: translate(-50%, 0);
              z-index: 2;
            }
            .distanceText {
              font-size: 0.24rem;
              font-weight: 400;
              color: #8a8a8a;
              line-height: 0.36rem;
              margin: 0;
              padding: 0;
            }
          }
          img {
            width: 100%;
          }
        }
      }
      .village-deal {
        padding: 0.48rem 0.46rem 0.32rem 0.46rem;
        .deal-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.4rem;
          span {
            font-size: 0.32rem;
            font-weight: bold;
            color: #303030;
          }
          img {
            width: 0.4rem;
            height: 0.4rem;
          }
        }
        .deal-content {
          .deal-item {
            display: flex;
            justify-content: space-between;
            padding-bottom: 0.14rem;
            .deal-item-left {
              display: flex;
              .left-icon {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-right: 0.22rem;
                .icon-circular {
                  width: 0.2rem;
                  height: 0.2rem;
                  background: #e5e5e5;
                  border-radius: 50%;
                }
                .icon-line {
                  width: 0.02rem;
                  height: 1.04rem;
                  background: #e5e5e5;
                  margin-top: 0.04rem;
                }
              }
              .left-content {
                .left-info {
                  font-size: 0.32rem;
                  font-weight: 400;
                  color: #000000;
                  padding-bottom: 0.2rem;
                }
                .left-info-label {
                  font-size: 0.26rem;
                  font-weight: 400;
                  color: #999999;
                  display: flex;
                  align-items: center;
                  span {
                    width: 0.01rem;
                    height: 0.2rem;
                    display: block;
                    background-color: #cacaca;
                    margin: 0 0.14rem;
                  }
                }
              }
            }
            .deal-item-right {
              font-size: 0.3rem;
              font-weight: bold;
              color: #ff3100;
            }
            &:nth-last-child(1) {
              .icon-line {
                height: 0.7rem !important;
              }
            }
          }
        }
      }
      .recommended-house {
        .recommended-title {
          padding-top: 0.4rem;
          padding-left: 0.5rem;
          font-size: 0.32rem;
          font-weight: 400;
          color: #000000;
        }
        .morehouse-btn {
          width: 6.5rem;
          height: 0.96rem;
          font-size: 0.28rem;
          font-weight: 400;
          color: #000000;
          line-height: 0.96rem;
          text-align: center;
          background: #fffbe7;
          border-radius: 0.08rem;
          margin: 0.4rem 0.5rem 0.6rem;
        }
      }
      .recommend {
        padding: 0.4rem 0.5rem 0.3rem;
        .recommend-title {
          font-size: 0.4rem;
          font-weight: bold;
          color: #303030;
          padding-bottom: 0.5rem;
        }
        .recommend-broker {
          .borker-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 0.4rem;
            .broker-name {
              white-space: nowrap;
              .name {
                font-size: 0.32rem;
                font-weight: bold;
                color: #303030;
              }
              .name-label {
                font-size: 0.22rem;
                font-weight: 400;
                color: #888888;
              }
            }
            .broker-progress {
              width: 2.44rem;
              /deep/ .van-progress__portion {
                background: linear-gradient(90deg, #fdd20c 0%, #ff621d 100%);
                .van-progress__pivot {
                  width: 0.56rem;
                  height: 0.56rem;
                  font-size: 0.2rem;
                  font-weight: 400;
                  color: #000000;
                  text-align: center;
                  line-height: 0.56rem;
                  background: #ffffff;
                  border: 0.02rem solid #ff611b;
                  border-radius: 50%;
                  box-sizing: content-box;
                  min-width: 0;
                  padding: 0;
                }
              }
            }
            .contact-btn {
              display: flex;
              .btn-chat {
                padding-right: 0.42rem;
                img {
                  width: 0.78rem;
                  height: 0.76rem;
                  display: block;
                }
                &:nth-last-of-type(1) {
                  padding: 0;
                }
              }
            }
          }
        }
      }
    }
  }
  .footer-broker {
    z-index: 999;
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
        object-fit: cover;
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
  .split-line {
    height: 0.24rem;
    background: #f9f9f9;
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
.swipe-active {
  background: #ffce09 !important;
  opacity: 1 !important;
}
.slot-image {
  width: 100%;
  position: fixed;
  top: 1rem;
  right: 0;
  z-index: 2020;
  .image-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding-bottom: 0.48rem;
    .nav-return {
      position: absolute;
      left: 0.28rem;
      img {
        width: 0.28rem;
        height: 0.28rem;
        display: block;
      }
    }
    .image-title {
      font-size: 0.3rem;
      font-weight: 400;
      color: #ffffff;
      text-align: center;
    }
  }
  .img-type {
    .img-type-list {
      display: flex;
      flex-wrap: nowrap;
      overflow: auto;
      .item-img-type {
        flex: 1 0 auto;
        font-size: 0.28rem;
        font-weight: 400;
        color: #737373;
        margin: 0 0.32rem;
        &.active {
          color: #fff;
        }
      }
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
/deep/ .van-image-preview .van-image-preview__index {
  bottom: 2rem;
}
.no-empty {
  font-size: 0.28rem;
  text-align: center;
  padding-bottom: 0.3rem;
  color: #999;
}
</style>
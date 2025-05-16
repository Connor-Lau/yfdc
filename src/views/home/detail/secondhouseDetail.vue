<template>
  <div class="detail">
    <gni-nav-bar @onClickLeft="onClickBack" :pageTitle="headTitle" :hideRight="false">
      <template slot="slot-right">
        <div class="nav-right">
          <div class="icon-chat" @click="goIm()">
            <img :src="$appConfig.appWebStaticUrl + 'home/icon_chat01.png'" alt="">
            <div :class="unread>9?'tips-chat':'tips-chat-single'" v-if="unread">{{unread > 99 ? '99+' : unread}}</div>
          </div>
          <div class="icon-share" @click="isShare=true">
            <img :src="$appConfig.appWebStaticUrl + 'home/icon_share03.png'" alt="">
          </div>
        </div>
      </template>
    </gni-nav-bar>
    <div class="wrapper" v-show="isInit">
      <div class="swipe">
        <!-- VR -->
        <van-swipe style="height: 5.2rem;" v-if="swiperIndex === 0" class="relative">
          <van-swipe-item v-for="(item, index) in vrImg" :key="index" @click="toolsGoPageView({
            path: '/home/thirdparty/thirdparty',
            query: { url: toolsUrlConversion(item.url), headTitle: 'VR看房' },
            })">
            <img :src="toolsGetWebStaticUrl(item.img)" @error="toolsGetErrorHouseImage($event,1)" alt="" class="object-cover">
            <img :src="$appConfig.appWebStaticUrl + 'home/icon_VR.png'" alt="" class="absolute icon-vr">
          </van-swipe-item>
          <template #indicator>
            <div class="custom-indicator">1/{{vrImg.length}}</div>
          </template>
        </van-swipe>
        <!-- 图片 -->
        <van-swipe style="height: 5.2rem;" v-if="swiperIndex === 1" @change="handleSwipeChange($event, 'picturesIndex')" :initial-swipe="picturesIndex">
          <template v-if="picturesInfo.length">
            <van-swipe-item v-for="(item, index) in picturesInfo" :key="index" @click="handleShowPreview(picturesInfo,'picturesIndex')">
              <img :src="toolsGetWebStaticUrl(item)" @error="toolsGetErrorHouseImage($event, 2, picturesInfo, index)" alt="" class="object-cover">
            </van-swipe-item>
          </template>
          <template v-if="!picturesInfo.length">
            <van-swipe-item>
              <img :src="$appConfig.appWebStaticUrl + 'common/house-shooting.png'" alt="" class="object-cover">
            </van-swipe-item>
          </template>
          <template #indicator>
            <div class="custom-indicator" v-show="picturesInfo.length">{{ picturesInfo.length ? (picturesIndex + 1) : picturesIndex}}/{{picturesInfo.length}}</div>
          </template>
        </van-swipe>
        <!-- 户型 -->
        <van-swipe style="height: 5.2rem;" v-if="swiperIndex === 2" @change="handleSwipeChange($event, 'houseTypeIndex')" :initial-swipe="houseTypeIndex">
          <van-swipe-item v-for="(item, index) in houseTypeImg" :key="index" @click="handleShowPreview(houseTypeImg,'houseTypeIndex')">
            <img :src="toolsGetWebStaticUrl(item)" @error="toolsGetErrorHouseImage($event, 1, houseTypeImg, index)" alt="" class="object-cover">
          </van-swipe-item>
          <template #indicator>
            <div class="custom-indicator">{{houseTypeIndex + 1}}/{{houseTypeImg.length}}</div>
          </template>
        </van-swipe>
        <div class="swipe-tab">
          <span v-for="(item,index) in swiperTab" :key="index" @click="swiperIndex = item.index" :class="swiperIndex == item.index ? 'swipe-active' : ''">{{item.text}}</span>
        </div>
      </div>
      <div class="house-detail">
        <div class="label">
          <div class="label-left">
            <span v-for="(item) in tags" :key="item.tag_id">{{ item.tag_name }}</span>
          </div>
          <div class="label-right" @click="handleCollection">
            <div class="right-collection" :class="{'collectioned':isCollection}">{{!isCollection?'关注':'已关注'}}</div>
          </div>
        </div>
        <div class="title">{{ headTitle }}</div>
        <div class="title-information">
          <div class="title-item title-line">
            <div class="item-top" v-if="!$commonUtils.utilCore.empty(dataInfo.price_limit)">暂无数据</div>
            <div class="item-top" v-else>{{ dataInfo.price_name || "--" }}</div>
            <div class="item-bottom">售价</div>
          </div>
          <div class="title-item title-line">
            <div class="item-top">{{ dataInfo.layout_short_name || "--" }}</div>
            <div class="item-bottom">房型</div>
          </div>
          <div class="title-item">
            <div class="item-top">{{ dataInfo.acreage_cover_name || "--" }}</div>
            <div class="item-bottom">建筑面积</div>
          </div>
        </div>
        <!-- 2022/8/2 杨哥需求 -->
        <!-- <div class="tips-box" v-if="(chatCustomerInfo.sale_remark || chatCustomerInfo.user_id) && dataInfo.is_69">
          <div class="tips-text" v-html="chatCustomerInfo.sale_remark"></div>
          <div class="contact-btn" @click="goChat(chatCustomerInfo, 1)" v-if="chatCustomerInfo.user_id">联系客服</div>
        </div> -->
        <div class="reference" v-if="!$commonUtils.utilCore.empty(dataInfo.price_limit)">
          <div class="reference-item" style="paddingBottom:0.26rem">
            本套房源的参考总价：<span>{{dataInfo.price_amount || '--'}}万</span>
          </div>
          <div class="reference-item">
            本小区政府参考单价：<span>{{ dataInfo.price_limit ? (dataInfo.price_limit + '元/㎡') : '--' }}</span>
            <span class="check-detail" @click="openPriceLimitUrl(dataInfo.price_limit_url)">（查看详情）</span>
          </div>
          <img :src="$appConfig.appWebStaticUrl + '/home/price_bg.png'" alt="">
        </div>
        <div class="specific-information">
          <div class="specific-box">
            <div class="box-item box-item-left">
              单价：<span>{{ dataInfo.average_price_name || "--" }}</span>
            </div>
            <div class="box-item">
              朝向：<span>{{ dataInfo.house_orientation_name || "--"}}</span>
            </div>
          </div>
          <div class="specific-box">
            <div class="box-item box-item-left">
              楼层：<span>{{ dataInfo.floor_name || "--"}}</span>
            </div>
            <div class="box-item">
              电梯：<span>{{ dataInfo.lift_status_name || "--"}}</span>
            </div>
          </div>
          <div class="specific-box">
            <div class="box-item box-item-left">
              梯户：<span>{{ dataInfo.lift_house_rate_name || "--"}}</span>
            </div>
            <div class="box-item">
              装修：<span>{{ dataInfo.decoration_name || "--"}}</span>
            </div>
          </div>
          <div class="specific-box">
            <div class="box-item box-item-left">
              楼型：<span>{{ dataInfo.building_type_name || "--"}}</span>
            </div>
            <div class="box-item">
              产权：<span>{{ dataInfo.property_year_name || "--"}}</span>
            </div>
          </div>
          <div class="specific-cell">
            <div class="cell-left">
              小区：<span @click="toolsGoPageView({path: '/home/detail/housevillage',query:{id:dataInfo.uptown_id,housetype:'0', longitude,latitude,cityId:dataInfo.site_id}})">{{ uptownInfo.uptown_name }}</span>
            </div>
            <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
          </div>
          <!-- 2023.6.17小林需求，政策加入更多楼盘信息中 -->
          <!-- <div class="specific-cell" @click="openPriceLimitUrl('http://zfcj.gz.gov.cn/xysj/xzzx/qtl/')" v-if="houseCity == '8'">
            <div class="cell-left">
              政策：<span>广州市房屋交易政策指引告知书</span>
            </div>
            <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
          </div> -->
          <!-- 2022/8/2 杨哥需求 -->
          <!-- <div class="specific-cell" v-if="isSixnine" @click="handleToRate">
            <div class="cell-left">
              费率：<span>查看服务收费标准</span>
            </div>
            <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
          </div> -->
          <div class="more-information" @click="handleToSalaInfo">
            更多楼盘信息
            <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
          </div>
        </div>
        <div class="split-line" v-show="dataInfo.have_key"></div>
        <!-- 预约看房页面暂无UI，不展示功能 -->
        <div class="appointment-key" @click="goAppointment" v-if="dataInfo.have_key">
          <div class="appointment-key-left">
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_appointment.png'" alt="">
            <span>钥匙房源 随时看房</span>
          </div>
          <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
        </div>
        <div class="split-line" v-show="villageDealList.length"></div>
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
                    单价 {{item.average_price}}元/平
                    <span></span>
                    {{$commonUtils.utilDate.date("Y.m",item.sign_time)}} 成交
                  </div>
                </div>
              </div>
              <div class="deal-item-right">{{item.trade_amount_w}}万</div>
            </div>
          </div>
        </div>
        <div class="split-line" v-if="brokerRecommend.length"></div>
        <div class="recommend" v-if="brokerRecommend.length">
          <div class="recommend-title">推荐经纪人</div>
          <div class="recommend-broker">
            <div class="borker-container" v-for="item in brokerRecommend" :key="item.broker_id">
              <div class="broker-header">
                <img :src="toolsGetWebStaticUrl(item.avatar)" alt="">
              </div>
              <div class="broker-name">
                <div class="name">{{ item.broker_name }}</div>
                <div class="name-label">房源熟悉度:</div>
              </div>
              <div class="broker-progress">
                <van-progress :percentage="getFamiliarity(item.familiarity_percent)" stroke-width="0.2rem" :track-color="'#EFEFEF'" />
              </div>
              <div class="contact-btn">
                <div class="btn-chat" @click="goChat(item)">
                  <img :src="$appConfig.appWebStaticUrl + '/home/icon_chating.png'" alt="">
                </div>
                <div class="btn-chat" @click="callPhone(item)" v-show="item.telephone">
                  <img :src="$appConfig.appWebStaticUrl + '/home/icon_phoneing.png'" alt="">
                </div>
              </div>
            </div>
            <!-- 04-06: 跟据需求文档  《裕丰地产APP重构界面（第一期-1）.docx》 【找房卡】可以后面再上，可以先隐藏-->
            <!-- <div class="room-card">
              <div class="card-title">
                <div class="card-title-left">
                  <div class="left-title">我的找房卡</div>
                  <div class="left-like">猜您喜欢：越秀区·4室·200~300万</div>
                </div>
                <div class="card-title-right">
                  一键生成
                  <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow02.png'" alt="">
                </div>
              </div>
              <div class="card-label">
                <div class="card-label-item">
                  <img :src="$appConfig.appWebStaticUrl + '/home/icon_service.png'" alt="">
                  <div class="label-item-text">
                    <div class="top">在线高效咨询</div>
                    <div class="bottom">找房条件一键发送</div>
                  </div>
                </div>
                <div class="card-label-item card-label-item-second">
                  <img :src="$appConfig.appWebStaticUrl + '/home/icon_notice.png'" alt="">
                  <div class="label-item-text">
                    <div class="top">新上房源提醒</div>
                    <div class="bottom">新消息及时通知</div>
                  </div>
                </div>
              </div>
            </div> -->
          </div>
        </div>
        <div class="split-line" v-if="saleRecommend.length"></div>
        <div class="periphery-map">
          <div class="title">
            <div class="left">周边配套及通勤</div>
            <div class="right" @click="goNewMapPosition">
              <span>查看更多</span>
              <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
            </div>
          </div>
          <div @click="goChat(brokerInfo)" class="school-information">
            学校信息：<span>咨询经纪人中小学情况</span>
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_consulting.png'" alt="">
          </div>
          <div class="map-container relative" @click="goNewMapPosition">
            <div class="addressRadius absolute"></div>
            <div class="addressBox text-center px-2 py-1 absolute" v-if="setTextStr([dataInfo.site_name,uptownInfo.uptown_name])">
              <div class="max-w-48 ellipsis">
                {{ setTextStr([dataInfo.site_name,uptownInfo.uptown_name]) }}
              </div>
              <p class="distanceText max-w-48 ellipsis" v-if="peripheryDetail.length">距{{peripheryDetail[0].name}}{{peripheryDetail[0].distance}}米</p>
              <div class="addressInner absolute"></div>
            </div>
            <img :src="mapImage" alt="地图" v-if="mapImage">
          </div>
          <div class="periphery-around">
            <div class="periphery-title">
              <div class="periphery-title-item" v-for="(item,key) in around" :key="key" @click="handleTabAround(key)" :class="aroundIndex == key ? 'around-active' : ''">
                {{key}}
                <img :src="$appConfig.appWebStaticUrl + '/home/icon_line.png'" alt="" v-show="aroundIndex == key">
              </div>
            </div>
            <div class="periphery-in">
              <div class="periphery-in-item" v-for="(item,index) in vehicle" :key="index" @click="vehicleIndex = index;handleTabAround(item,1);" :class="vehicleIndex == index?'vehicle-active':''">{{item}}</div>
            </div>
            <div class="periphery-in-detail">
              <template v-if="!isLoading">
                <div class="detail-item" v-for="(item,index) in peripheryDetail" :key="index" @click="goNewMapPosition">
                  <img :src=" $appConfig.appWebStaticUrl + '/home/icon_education.png'" alt="" v-if="aroundIndex=='教育'">
                  <img :src=" $appConfig.appWebStaticUrl + '/home/icon_hospital.png'" alt="" v-if="aroundIndex=='医院'">
                  <img :src=" $appConfig.appWebStaticUrl + '/home/icon_subway.png'" alt="" v-if="aroundIndex=='交通' && vehicleIndex== 0">
                  <img :src="$appConfig.appWebStaticUrl + '/home/icon_bus.png'" alt="" v-if="aroundIndex=='交通' && vehicleIndex== 1">
                  <img :src=" $appConfig.appWebStaticUrl + '/home/icon_life.png'" alt="" v-if="aroundIndex=='生活'">
                  <img :src=" $appConfig.appWebStaticUrl + '/home/icon_arder.png'" alt="" v-if="aroundIndex=='休闲'">
                  <div class=" address">{{item.name}}
                  </div>
                  <div class="distance">直线 {{getDistance(item.distance)}}km</div>
                </div>
                <div class="no-empty" v-show="!peripheryDetail.length">
                  暂无数据
                </div>
              </template>
              <div class="flex justify-center pb-3" v-else>
                <van-loading size="0.28rem">加载中...</van-loading>
              </div>
            </div>
          </div>
          <div class="more-information pb-3" @click="goNewMapPosition" v-show="peripheryDetail.length && !isLoading">
            更多
            <!-- <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt=""> -->
            <van-icon name="arrow-down" style="paddingLeft:0.05rem" />
          </div>
        </div>
        <div class="split-line"></div>
        <div class="recommended-house" v-if="saleRecommend.length">
          <div class="recommended-title">推荐二手房</div>
          <houselistItem :list="saleRecommend" @goDetail="goSecondRecommend"></houselistItem>
          <div class="morehouse-btn" @click="toolsGoPageView({path:'/home/list/secondhouseList', query: {isUpdate: 1,uptown_id:dataInfo.uptown_id}})">更多二手房</div>
        </div>
        <div class="split-line" v-if="houseRecommend.length"></div>
        <div class="recommended-house" v-if="houseRecommend.length">
          <div class="recommended-title">推荐新房</div>
          <houselistItem :list="houseRecommend" :isDetail="true" @goDetail="e => toolsGoPageView({path:'/home/detail/newhouseDetail',query:{ id: e.loupan_id, block_id: e.block_id}})"></houselistItem>
          <div class="morehouse-btn" @click="toolsGoPageView({path:'/home/list/newhouseList', query: {isUpdate: 1}})">更多新房</div>
        </div>
      </div>
    </div>

    <div class="footer-broker" v-if="JSON.stringify(brokerInfo) !== '{}'">
      <div class="footer-left">
        <img :src="brokerInfo.avatar ? brokerInfo.avatar : ($appConfig.appWebStaticUrl + '/common/icon_broker.png')" @error="toolsGetErroAvatarImage($event,2)" alt="">
        <div>
          <div class="footer-name">
            <div class="name">{{ brokerInfo.broker_name }}</div>
            <div class="label">经纪人</div>
          </div>
        </div>
      </div>
      <div class="footer-right">
        <div class="btn-question" @click="goChat(brokerInfo)">在线问</div>
        <div class="btn-phone" @click="callPhone(brokerInfo)" v-show="brokerInfo.telephone">打电话</div>
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
        :startPosition="bigIndexImg"
        :overlay-style="{background:'rgba(0,0,0,1)'}"
        @close="handleClosePreview()"
        @change="hanldImgChange">
        <template v-slot:index>{{ bigIndexImg + 1 }} / {{ previewImages.length }}</template>
        <template v-slot:cover>
          <div class="slot-image" v-if="showPreview && swiperIndex === 1">
            <!-- 导航栏标题 -->
            <div class="image-nav">
              <div class="nav-return" @click="showPreview=false">
                <img :src="$appConfig.appWebStaticUrl + '/common/icon_arrowRight.png'" alt="">
              </div>
              <div class="image-title">{{previewTitle}}</div>
            </div>
            <!-- 图片类型标题 -->
            <div class="img-type">
              <ul class="img-type-list">
                <li class="item-img-type"
                  v-for="(item, index) in pictureInfoList"
                  :key="index" :class="pictureInfoListIndex==index?'active':''" @click="chooseInfo(item,index)">
                  {{ item.name }}（{{ item.number }}）
                </li>
              </ul>
            </div>
          </div>
        </template>
      </van-image-preview>
    </div>
    <div class="image-return" v-if="showPreview">
      <div class="return-btn" @click="showPreview=false">返回</div>
    </div>
  </div>
</template>

<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import houselistItem from "@/components/yni/houselistItem.vue"

import { mapState, mapActions, mapMutations } from "vuex";
export default {
  components: {
    gniNavBar,
    houselistItem,
  },
  data () {
    return {
      headTitle: '',
      isShare: false, // 分享弹窗
      isCollection: false, // 收藏
      swiperTab: [],
      swiperIndex: 1, // 轮播图的类型切换 VR等等
      around: {}, // 周边地方
      vehicle: [],  // 交通工具
      peripheryDetail: [],
      aroundIndex: "", // 周边下标
      vehicleIndex: 0, //交通下标

      houseId: "",//房源id
      brokerId: "",//经纪人id
      shareBrokerId: "", //享者经纪人id
      isFromShare: false,//是否来源分享

      brokerInfo: {}, //经纪人信息
      dataInfo: {}, //房源基本信息
      extendInfo: {}, //拓展信息
      picturesInfo: [], //图片信息
      picturesIndex: 0,
      pictureInfoList: [], // 图片具体的信息(客厅)
      pictureInfoListIndex: 0,
      vrImg: [],//vr图片
      houseTypeImg: [],//户型图片
      houseTypeIndex: 0,
      uptownInfo: {},//小区信息
      tags: {}, //标签

      saleRecommend: [], //推荐二手房
      houseRecommend: [], //推荐新房
      brokerRecommend: [],// 推荐经纪人
      longitude: "",//经度
      latitude: "",//纬度

      // 图片预览
      showPreview: false,
      previewImages: [],
      bigIndexImg: 0, //大图展示下标
      previewKey: "",
      chatCustomerInfo: {}, //客服信息
      houseCity: "",
      previewTitle: '', // 大图标题（客厅等等）
      cityId: "",
      isLoading: false,
      isBack: false,
      postGetData: { //小区列表
        houseType: "sale",//房源类型（sale 二手房，house 新房，rent 租房）
        searchUptownId: "",//
        setHuxing: "",//
        setLayouthall: "",//
        inputKeyWord: "",
        city_id: 8,//	否	string	城市id 默认8
        page: 1,//	否	string	页码 默认1
        page_size: 3,//	否	string	每页显示数 默认10
      },
      villageDealList: [], //小区成交数据
      villageDealTotal: 0, // 小区成交总数
      isInit: false,
    }
  },
  computed: {
    ...mapState("user", ["userToken", "userInfo", "isLogin"]), //用户Token,用户登陆信息
    ...mapState("city", ["geoPosition", "thisCityInfo", "switchCityInfo", "cityInfoRows"]), //城市的信息 可能用到
    ...mapState('im', ['unread']),

    // 地图图片
    mapImage () {
      if (!this.longitude || !this.latitude) {
        return
      }

      const center = this.$commonUtils.utilCore.bd_decrypt(this.longitude, this.latitude); // 百度转高德
      return "https://restapi.amap.com/v3/staticmap?&zoom=15&location=" + center.longitude + "," + center.latitude + "&key=" + this.$appConfig.appMapKey[Math.floor(Math.random() * this.$appConfig.appMapKey.length)] + "&size=335*164";
    },
    // 是否是0.69城市
    isSixnine () {
      if (!this.$commonUtils.utilCore.empty(this.switchCityInfo)) {
        return this.switchCityInfo.is_69
      } else {
        return this.thisCityInfo.is_69
      }
    }
  },
  watch: {
    isLogin (val) {
      if (val) {
        this.getFavoriteStatus();
      }
    },
    $route: {
      async handler (val) {
        // 本详情跳本详情
        if (this.isBack && val.name === "home-detail-secondhouseDetail" && this.$route.meta.canKeep) {
          window.removeEventListener("popstate", this.handleClosePreview, false);
          this.$route.meta.canKeep = true;
          this.initDataState();
          window.scroll(0, 0);
          setTimeout(() => {
            window.scroll(0, 1);
          }, 100);
          this.$store.commit('home/setSaleDeatialInfo', {});
          this.houseId = this.$route.query.id || "";
          this.brokerId = this.$route.query.broker_id || "";
          this.shareBrokerId = this.$route.query.share_broker_id || "";
          this.isFromShare = this.$route.query.fromShare ? true : false; //是否来源分享
          this.cityId = this.$route.query.city_id || "";
          if (!this.$commonUtils.utilCore.empty(this.houseId)) {
            this.getAppFangSalelistRecommend();
            this.getAppFangHouselistRecommend();
            this.getFavoriteStatus();
          }
          await this.getDetail();
          this.getChatCustomer();
          this.getAppWechatNearbyGetField();
          this.getVillageDeal()
        }
      },
      deep: true,
      immediate: false,
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === "home-detail-secondhouseDetail") {
      to.meta.canKeep = true;
    } else {
      to.meta.canKeep = false;
    }
    next();
  },
  created () {
    window.scroll(0, 0);
    this.$store.commit('home/setSaleDeatialInfo', {});
    this.houseId = this.$route.query.id || "";
    this.brokerId = this.$route.query.broker_id || "";
    this.shareBrokerId = this.$route.query.share_broker_id || "";
    this.isFromShare = this.$route.query.fromShare ? true : false; //是否来源分享
    this.cityId = this.$route.query.city_id || "";
    if (!this.$commonUtils.utilCore.empty(this.houseId)) {
      this.getAppFangSalelistRecommend();
      this.getAppFangHouselistRecommend();
      this.getFavoriteStatus();
    }
  },
  async mounted () {
    // 分享进来
    if (this.isFromShare) {
      setTimeout(async () => {
        //初始化登陆的状态
        await this.init();
        //初始化地址的状态
        //await this.initPosition();
        await this.getDetail();
        this.getChatCustomer();
        this.getAppWechatNearbyGetField();
        this.getVillageDeal()
      }, 500)
    } else {
      // 非分享进来
      await this.getDetail();
      this.getChatCustomer();
      this.getAppWechatNearbyGetField();
      this.getVillageDeal()
    }
  },
  async activated () {
    window.removeEventListener("popstate", this.handleClosePreview, false);
    if (this.isBack) {
      this.initDataState();
      window.scroll(0, 0);
      setTimeout(() => {
        window.scroll(0, 1);
      }, 100);
      this.$store.commit('home/setSaleDeatialInfo', {});
      this.houseId = this.$route.query.id || "";
      this.brokerId = this.$route.query.broker_id || "";
      this.shareBrokerId = this.$route.query.share_broker_id || "";
      this.isFromShare = this.$route.query.fromShare ? true : false; //是否来源分享
      this.cityId = this.$route.query.city_id || "";
      if (!this.$commonUtils.utilCore.empty(this.houseId)) {
        this.getAppFangSalelistRecommend();
        this.getAppFangHouselistRecommend();
        this.getFavoriteStatus();
      }
      await this.getDetail();
      this.getChatCustomer();
      this.getAppWechatNearbyGetField();
      this.getVillageDeal()
    }
    this.isBack = true;
  },
  destroyed () {
    window.removeEventListener("popstate", this.handleClosePreview, false);
  },
  methods: {
    ...mapActions('app', ['getShareApp']),
    //初始化用户登录的情况
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
    // 初始化data变量
    initDataState () {
      this.headTitle = '';
      this.isShare = false; // 分享弹窗
      this.isCollection = false; // 收藏
      this.swiperTab = [];
      this.swiperIndex = 1; // 轮播图的类型切换 VR等等
      this.around = {}; // 周边地方
      this.vehicle = [];  // 交通工具
      this.peripheryDetail = [];
      this.aroundIndex = ""; // 周边下标
      this.vehicleIndex = 0; //交通下标

      this.houseId = "";//房源id
      this.brokerId = "";//经纪人id
      this.shareBrokerId = ""; //享者经纪人id
      this.isFromShare = false;//是否来源分享

      this.brokerInfo = {}; //经纪人信息
      this.dataInfo = {}; //房源基本信息
      this.extendInfo = {}; //拓展信息
      this.picturesInfo = []; //图片信息
      this.picturesIndex = 0;
      this.pictureInfoList = []; // 图片具体的信息(客厅)
      this.pictureInfoListIndex = 0;
      this.vrImg = [];//vr图片
      this.houseTypeImg = [];//户型图片
      this.houseTypeIndex = 0;
      this.uptownInfo = {};//小区信息
      this.tags = {}; //标签

      this.saleRecommend = []; //推荐二手房
      this.houseRecommend = []; //推荐新房
      this.brokerRecommend = [];// 推荐经纪人
      this.longitude = "";//经度
      this.latitude = "";//纬度

      // 图片预览
      this.showPreview = false;
      this.previewImages = [];
      this.bigIndexImg = 0; //大图展示下标
      this.previewKey = "";
      this.chatCustomerInfo = {}; //客服信息
      this.houseCity = "";
      this.previewTitle = ''; // 大图标题（客厅等等）
      this.cityId = "";
      this.isLoading = false;
    },
    // 获取房源详情
    async getDetail () {
      this.isInit = false
      this.$commonUtils.utilCore.showLoading();
      this.picturesInfo = [] // 重置图片
      const postData = {
        city_id: this.cityId || this.switchCityInfo.city_id || this.thisCityInfo.city_id,
        id: this.houseId,
        // broker_id: this.brokerId,
        share_broker_id: this.shareBrokerId,
      }
      const res = await this.$store.dispatch('home/getAppSaleDetail', postData);
      if (res) {
        this.swiperTab = [];
        this.vrImg = [];
        const { broker, data = {}, extend = {}, pictures, uptown, picture_info } = res;
        this.headTitle = data.shouse_title;
        this.brokerInfo = broker || {}; //经纪人信息
        this.dataInfo = data || {}; //房源基本信息
        this.extendInfo = extend || {}; //拓展信息
        // this.picturesInfo = pictures || []; //图片信息
        this.pictureInfoList = picture_info || []
        this.previewTitle = this.pictureInfoList.length > 0 ? this.pictureInfoList[0].name : ''
        this.uptownInfo = uptown || {};//小区信息
        this.tags = data.tags || {};
        this.houseTypeImg = (data.huxing_picture ? [data.huxing_picture] : []);
        this.longitude = data.longitude;//经度
        this.latitude = data.latitude;//纬度
        this.houseCity = data.site_id;
        this.brokerRecommend = data.brokers || []; // 推荐经纪人 2023.7.13 推荐经纪人放在详情接口里，不单独调取接口获取
        picture_info.forEach((item, index) => {
          item.url.forEach((item, index) => {
            this.picturesInfo.push(item)
          })
        })
        const imgIds = [];
        if (extend.vr_url) {
          this.swiperTab.push({
            text: 'VR',
            index: 0,
          });
          imgIds.push(0);
          this.vrImg.push({
            img: data.picture,
            url: extend.vr_url,
          });
        }
        if (this.picturesInfo.length) {
          this.swiperTab.push({
            text: '图片', index: 1
          });
          imgIds.push(1);
        }
        if (this.houseTypeImg.length) {
          this.swiperTab.push({
            text: '户型', index: 2
          })
          imgIds.push(2);
        }
        if (imgIds.includes(0)) {
          this.swiperIndex = 0;
        } else if (imgIds.includes(1)) {
          this.swiperIndex = 1;
        } else if (imgIds.includes(2)) {
          this.swiperIndex = 2;
        }
        this.isInit = true
        this.$commonUtils.utilCore.closeLoading()
      }
    },
    // 周边配套及通勤-内容列表
    async getAppWechatNearbyIndex () {
      const postData = {
        longitude: this.longitude,//	否	string	经度	113.368523
        latitude: this.latitude,//	否	string	纬度	23.146245
        type: this.aroundIndex,//	是	string	一级类型	教育
        tag: this.vehicle[this.vehicleIndex],// 否	string	二级类型	中学
      }
      this.isLoading = true;
      const res = await this.$store.dispatch('home/getAppWechatNearbyIndex', postData);
      this.isLoading = false;
      if (res) {
        this.peripheryDetail = res;
      } else {
        this.peripheryDetail = [];
      }
    },
    // 周边配套及通勤-标题列表
    async getAppWechatNearbyGetField () {
      const res = await this.$store.dispatch('home/getAppWechatNearbyGetField', {});
      if (res) {
        this.around = res;
        const arrKey = Object.keys(res);
        // const middleNum = parseInt((arrKey.length + 1) / 2) - 1; //获取中位数
        this.aroundIndex = arrKey[0];
        this.vehicle = this.around[this.aroundIndex];
        this.vehicleIndex = 0;
        this.getAppWechatNearbyIndex();
      }
    },
    // 推荐二手房列表
    async getAppFangSalelistRecommend () {
      const postData = {
        id: this.houseId,//	否	string	二手房id
        page_size: 4,//	否	string	每页显示数 默认10
      }
      const res = await this.$store.dispatch('home/getAppFangSalelistRecommend', postData);
      if (res) {
        this.saleRecommend = res.rows || [];
      }
    },
    // 房源详情-推荐新房列表
    async getAppFangHouselistRecommend () {
      const postData = {
        id: this.houseId,//	否	string	二手房id
        page_size: 4,//	否	string	每页显示数 默认10
      }
      const res = await this.$store.dispatch('home/getAppFangHouselistRecommend', postData);
      if (res) {
        this.houseRecommend = res.rows || [];
      }
    },
    // 切换周边数据
    handleTabAround (key, type = 0) {
      if (this.isLoading) return;
      if (!type) {
        this.aroundIndex = key
        this.vehicle = this.around[key]
        this.vehicleIndex = 0
      }
      this.getAppWechatNearbyIndex();
    },
    // 计算 本套房源的参考总价
    getPrcieLimitTotal (val1, val2) {
      let totalText = "";
      const total = Number(val1) * Number(val2);
      if (total >= 10000) {
        totalText = Number((total / 10000).toFixed(2)) + "万"
      } else {
        totalText = Number(total.toFixed(2)) + "元"
      }
      return (!isNaN(totalText) && totalText ? totalText : "--");
    },
    // 计算周边配套及通勤 距离字段
    getDistance (val) {
      const value = (Number(val) / 1000).toFixed(1);
      return value || 0;
    },
    // 轮播图滑动下标
    handleSwipeChange (e, dataKey) {
      this[dataKey] = e;
    },
    // 地图定位
    goMapPosition () {
      const param = {};
      param.longitude = this.longitude;
      param.latitude = this.latitude;
      param.address = this.headTitle;
      param.label = this.aroundIndex || "";
      param.tag = this.vehicle[this.vehicleIndex];
      this.toolsGoPageView({ path: "/home/map/position", query: param });
    },
    // 2022/10/11 新地图函数
    goNewMapPosition () {
      const param = {}
      param.longitude = this.longitude;
      param.latitude = this.latitude;
      param.userId = this.isLogin ? this.userInfo.user_uid : '0';
      param.houseId = this.houseId;
      param.houseType = 1;
      param.cityId = this.dataInfo.site_id
      param.isLogin = this.isLogin ? '1' : '0';
      param.isBroker = '0';
      param.address = this.uptownInfo.uptown_name;
      param.receiverUid = this.brokerInfo.erp_broker_id;
      param.brokerPhone = this.brokerInfo.telephone;
      param.platform = 'uapp';
      param.label = this.aroundIndex || "";
      param.tag = this.vehicle[this.vehicleIndex];
      //地图分享该房源所需的参数
      param.share_url = this.dataInfo.share_url;
      param.brokerId = this.brokerInfo.broker_id;
      param.picture = this.dataInfo.picture;
      param.shareBrokerId = this.shareBrokerId
      param.district_name = this.dataInfo.district_name
      param.block_name = this.dataInfo.block_name
      param.price_name = this.dataInfo.price_name
      // 跳转经纪人聊天所需参数
      param.layout_short_name = this.dataInfo.layout_short_name
      param.house_orientation_name = this.dataInfo.house_orientation_name
      param.decoration_name = this.dataInfo.decoration_name
      param.average_price_name = this.dataInfo.average_price_name
      param.price = this.dataInfo.price
      param.acreage_cover = this.dataInfo.acreage_cover
      console.log('参数', param);
      this.toolsGoPageView({ path: "/home/map/newmap", query: param });
    },
    // 获取熟悉度数字
    getFamiliarity (text) {
      if (text && text.includes("%")) {
        text = text.replace("%", "");
      }
      return Number(text) || 0;
    },
    // 获取是否关注
    async getFavoriteStatus () {
      if (!this.isLogin) return;
      const postData = {
        city_id: this.cityId || this.switchCityInfo.city_id || this.thisCityInfo.city_id,//	是	string	城市id
        resource_id: this.houseId,//	是	string	资源id
        resource_type: "1",//	是	string	资源类型id 1:二手房，2：租房，3：新房，4：小区，5：经纪人
      }
      const res = await this.$store.dispatch('home/getAppFangFavoriteStatus', postData);
      if (res) {
        this.isCollection = true;
      }
    },
    // 新增关注
    async addFangFavorite () {
      if (!this.isLogin) return location._fromCommission = 1, this.toolsGoPageView({ path: '/common/index', query: { fromCommission: true, path: '/user/index' } });
      const postData = {
        city_id: this.cityId || this.switchCityInfo.city_id || this.thisCityInfo.city_id,//	是	string	城市id
        resource_id: this.houseId,//	是	string	资源id
        resource_type: "1",//	是	string	资源类型id 1:二手房，2：租房，3：新房，4：小区，5：经纪人
      }
      const res = await this.$store.dispatch('home/addAppFangFavorite', postData);
      if (res) {
        this.isCollection = true;
      }
    },
    // 取消关注
    async cancelFangFavorite () {
      if (!this.isLogin) return this.$commonUtils.utilCore.showToast("请登录");
      const postData = {
        city_id: this.cityId || this.switchCityInfo.city_id || this.thisCityInfo.city_id,//	是	string	城市id
        resource_id: this.houseId,//	是	string	资源id
        resource_type: "1",//	是	string	资源类型id 1:二手房，2：租房，3：新房，4：小区，5：经纪人
      }
      const res = await this.$store.dispatch('home/cancelAppFangFavorite', postData);
      if (res) {
        this.isCollection = false;
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
    // 打开政府指导价格链接
    openPriceLimitUrl (url) {
      if (!url) return this.$commonUtils.utilCore.showToast("链接不存在");
      if (this.$commonUtils.utilCore.isAppPlus()) {
        plus.runtime.openURL(url);
      } else {
        window.open(url);
      }
    },
    // 分享给朋友、朋友圈; type=0 分享到聊天界面
    async handleShare (type = 0) {
      // const href = this.$commonUtils.utilCore.url(this.$appConfig.appH5PageUrl, {
      //   id: this.houseId, fromShare: 1, city_id: (this.switchCityInfo.city_id || this.thisCityInfo.city_id), broker_id: this.brokerId, share_broker_id: this.shareBrokerId
      // })
      console.log(this.dataInfo.picture);
      const href = this.dataInfo.share_url + "/" + (this.brokerId || this.brokerInfo.broker_id);
      let shareInfo = {
        type: 0,
        summary: "[二手房]",
        imageUrl: this.toolsGetWebStaticUrl(this.dataInfo.picture),
        href,
      };
      if (type === 0) {
        const { user_type = 1, user_id = "", user_row = { extend: { nickname: "" } } } = this.userInfo;
        const url = `/pages/card/sale/detail`;
        const path = this.$commonUtils.utilCore.url(url, {
          id: this.houseId,
          broker_id: this.brokerId,//this.userInfo.uid,
          isBrokerShare: 0,
          share_broker_id: this.shareBrokerId,//this.userInfo.uid

          share_user_type: user_type,// 分享来源用户类型(1:用户,2:经纪人)  
          share_user_id: user_id,// 分享来源用户ID 
          share_username: user_row.extend.nickname,// 分享来源用户名 

          share_resource_type: '1',//  分享资源类型(1:二手房,2:租房,3:新房,4:小区,5:经纪人,6:动态,7:官网,8:获客文章,10:小程序,11:个人海报,12:房源海报,13:配图海报,14:获客文章海报,15:微信分享,16:微信朋友圈) 
          share_resource_id: this.houseId,// 分享资源ID  this.dataInfo
          share_resource_name: this.headTitle,// 分享资源名称 
        });
        shareInfo = {
          type: 5,
          imageUrl: this.toolsGetWebStaticUrl(this.dataInfo.picture),
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
          title: `【${this.dataInfo.district_name}${this.dataInfo.block_name}】${this.headTitle} ${this.dataInfo.price_name}`,
          scene: type === 0 ? "WXSceneSession" : "WXSceneTimeline",//WXSceneSession	分享到聊天界面;WXSceneTimeline	分享到朋友圈
          ...shareInfo,
        },
      });
      // this.$commonUtils.appLog.log("shareData", JSON.stringify(shareData));
    },
    // 跳转 服务收费标准
    handleToRate () {
      const url = encodeURIComponent('https://mp.weixin.qq.com/s?__biz=MzA5MDIyOTg1Nw==&mid=2652844512&idx=1&sn=fc8252370003ea68ed407ac6651f8f28')
      this.toolsGoPageView({
        path: "/common/web-detail", query: {
          url, title: "服务收费标准"
        }
      });
      // this.$commonUtils.utilCore.uniGoPage('/pages/common/web-view-show/web-detail?url=' + url + '&title=服务收费标准');
    },
    // 跳转 更多楼盘信息
    handleToSalaInfo () {
      this.$store.commit('home/setSaleDeatialInfo', this.dataInfo);
      this.toolsGoPageView({ path: "/home/detail/saleInfo" });
    },
    // 改变大图图片的下标
    hanldImgChange (index) {
      this.bigIndexImg = index;
      if (!this.previewKey) return;
      this[this.previewKey] = index;
      this.pictureInfoList.forEach((item, i) => {
        item.url.forEach((itemurl, indexurl) => {
          if (this.picturesInfo[index] == itemurl) {
            this.pictureInfoListIndex = i
            this.previewTitle = item.name
            this.setScrollLeft();
            return
          }
        })
      })
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
      setTimeout(() => {
        this.setScrollLeft();
      }, 300);//300ms动画时间
      window.history.pushState(null, null, null); // 添加一行，阻止后退按钮跳转页面
      window.addEventListener("popstate", this.handleClosePreview, false);
    },
    // 滑动预览图片type tab 位置
    setScrollLeft () {
      const typeListNode = document.querySelector(".img-type-list");
      if (typeListNode) {
        const imgTypeNode = document.querySelectorAll(".item-img-type")[this.pictureInfoListIndex];
        const { width } = imgTypeNode.getBoundingClientRect();
        const offsetLeft = imgTypeNode.offsetLeft;
        const half = document.body.clientWidth / 2;
        if (offsetLeft <= half) {
          setTimeout(() => {
            typeListNode.scrollTo(0, 0);
          })
        }
        if (offsetLeft > half) {
          setTimeout(() => {
            typeListNode.scrollTo(offsetLeft - half - width / 2, 0);
          })
        }
      }
    },
    onClickBack () {
      this.$router.go(-1);
      // this.toolsGoPageBack();
    },
    // 跳转聊天
    goChat (brokerInfo, type) {
      if (!this.isLogin) return location._fromCommission = 1, this.toolsGoPageView({ path: '/common/index', query: { fromCommission: true, path: '/user/index' } });
      if (JSON.stringify(brokerInfo) === "{}") return this.$commonUtils.utilCore.showToast("数据初始化中，请稍后再试");
      let houseInfo = {
        // 这里写 房源消息的内容
        shouse_id: this.houseId,//->  二手房id, 应该是pc的房源id
        shouse_title: this.headTitle,//->  标题
        preview_url: this.dataInfo.picture || (this.$appConfig.appWebStaticUrl + 'common/house.png'),//->  图片地址
        layout_dname: this.dataInfo.layout_short_name,//->  房型室
        house_orientation_name: this.dataInfo.house_orientation_name,//->  房屋朝向
        decoration_name: this.dataInfo.decoration_name,//->  装修类型
        unit_price: this.dataInfo.average_price_name,//->  单价
        price: this.dataInfo.price,//->  售价
        acreage_cover: this.dataInfo.acreage_cover,//->  建筑面积
        share_broker_id: this.shareBrokerId || 0,//-> 分享经纪人， 传当前经纪人：brokerInfo.erp_broker_id， 没有就传 0
      }
      // let houseInfo = null;

      this.$store.dispatch('im/goChat', {
        to: 'b_' + (!type ? brokerInfo.erp_broker_id : brokerInfo.user_id),
        houseInfo
      })
    },

    // 跳转房源分享
    goShareChat () {
      let houseInfo = {
        // 这里写 房源消息的内容
        shouse_id: this.houseId,//->  二手房id, 应该是pc的房源id
        shouse_title: this.headTitle,//->  标题
        preview_url: this.dataInfo.picture || (this.$appConfig.appWebStaticUrl + 'common/house.png'),//->  图片地址
        layout_dname: this.dataInfo.layout_short_name,//->  房型室
        house_orientation_name: this.dataInfo.house_orientation_name,//->  房屋朝向
        decoration_name: this.dataInfo.decoration_name,//->  装修类型
        unit_price: this.dataInfo.average_price_name,//->  单价
        price: this.dataInfo.price,//->  售价
        acreage_cover: this.dataInfo.acreage_cover,//->  建筑面积
        share_broker_id: this.shareBrokerId || 0,//-> 分享经纪人， 传当前经纪人：brokerInfo.erp_broker_id， 没有就传 0
      }
      this.$store.dispatch('im/goChatShare', houseInfo)
    },
    async goSecondRecommend (v) {
      // this.houseId = v.shouse_id
      // this.brokerId = v.broker_id
      // this.bigIndexImg = 0
      // this.picturesIndex = 0
      // this.isCollection = false;
      // this.pictureInfoListIndex = 0;
      // this.isLoading = false;
      // await this.getDetail()
      // this.getFavoriteStatus()
      // this.getChatCustomer();
      // this.getAppWechatNearbyGetField();
      this.$route.meta.canKeep = true;
      this.toolsGoPageView({ path: '/home/detail/secondhouseDetail', query: { id: v.shouse_id, block_id: v.block_id } });
    },
    // 获取客服
    async getChatCustomer () {
      const postData = {
        city_id: this.dataInfo.share_broker_site_id || this.houseCity || this.switchCityInfo.city_id || this.thisCityInfo.city_id,//	是	string	城市id
      }
      const res = await this.$store.dispatch('home/getAppGetDefaultChatCustomer', postData);
      if (res) {
        this.chatCustomerInfo = res;
      }
    },
    // 跳转预约看房页
    goAppointment () {
      if (!this.isLogin) return location._fromCommission = 1, this.toolsGoPageView({ path: '/common/index', query: { fromCommission: true, path: '/user/index' } });
      this.toolsGoPageView(
        {
          path: '/home/detail/appointmenthouse',
          query: {
            resourceType: 1,
            houseId: this.houseId,
            district_id: this.dataInfo.district_id,
            city_id: this.cityId
          }
        }
      )
    },
    // 切换大图标签
    chooseInfo (item, index) {
      this.previewTitle = item.name
      this.pictureInfoListIndex = index
      let chooseIndex = -1
      let pictureData = item.url.find((item, index) => this.picturesInfo.includes(item))
      chooseIndex = this.picturesInfo.indexOf(pictureData)
      this.hanldImgChange(chooseIndex)
    },
    goIm () {
      if (!this.isLogin) return location._fromCommission = 1, this.toolsGoPageView({ path: '/common/index', query: { fromCommission: true, path: '/user/index' } });
      this.$store.dispatch('im/goIm')
    },
    // 获取小区成交数据
    async getVillageDeal () {
      this.postGetData.city_id = this.$route.query.city_id || this.switchCityInfo.city_id || 8
      this.postGetData.searchUptownId = this.dataInfo.uptown_id
      this.postGetData.setHuxing = [{
        id: this.dataInfo.layout_room_id
      }]
      this.postGetData.setLayouthall = this.dataInfo.layout_hall_id
      this.postGetData.inputKeyWord = this.uptownInfo.uptown_name
      let res = await this.$store.dispatch("home/actAppFangDealShouseList", this.postGetData);
      if (res) {
        this.villageDealList = res.rows
        this.villageDealTotal = res.total
      }
    },
    // 跳转同小区同户型
    goDealist () {
      this.postGetData.leaseSaleIndex = '1'
      //把数据存在vuex里去
      this.$store.commit('home/setSearchPostGetData', this.postGetData);
      this.toolsGoPageView({ path: '/home/list/dealist' })
    },
    // 2023/2/09 拨打电话前调接口记录信息
    async callPhone (val) {
      try {
        const postData = {
          broker_id: val.broker_id || "",//是	string	经纪人id
          business_type: "702",//是	string	业务类型
          from_type: "7",//是	string	来源
          business_id: this.isLogin ? this.userInfo.user_id : '',//	否	string	用户id
          ex1: "1",//否	string	房源类型 1二手房 2租房
          ex2: this.houseId || "",//否	string	房源id
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
    .swipe {
      position: relative;
      .custom-indicator {
        font-size: 0.26rem;
        font-weight: 400;
        color: #ffffff;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 0.3rem;
        position: absolute;
        right: 0.26rem;
        bottom: 0.36rem;
        padding: 0.05rem 0.26rem;
      }
      .swipe-tab {
        height: 0.44rem;
        font-size: 0.22rem;
        font-weight: 500;
        line-height: 0.44rem;
        color: #000000;
        background: #ffffff;
        border-radius: 0.22rem;
        position: absolute;
        bottom: 0.36rem;
        // left: 2.36rem;
        left: 50%;
        display: flex;
        justify-content: space-between;
        transform: translate(-50%, 0);
        span {
          width: 0.76rem;
          height: 100%;
          opacity: 0.7;
          text-align: center;
          border-radius: 0.22rem;
          margin-right: 0.2rem;
          &:nth-last-child(1) {
            margin-right: 0;
          }
        }
      }
      /deep/ .van-swipe-item {
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .house-detail {
      .label {
        padding: 0.3rem 0.42rem 0.2rem 0.48rem;
        display: flex;
        justify-content: space-between;
        .label-left {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          span {
            font-size: 0.2rem;
            font-weight: 400;
            color: #333333;
            background: #f6f6f6;
            padding: 0.06rem 0.1rem;
            margin-right: 0.1rem;
            white-space: nowrap;
          }
        }
        .label-right {
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
      .title {
        font-size: 0.4rem;
        font-weight: bold;
        color: #303030;
        line-height: 0.52rem;
        padding: 0 1.3rem 0.4rem 0.46rem;
      }
      .title-information {
        padding: 0 0.56rem 0.44rem 0.5rem;
        display: flex;
        justify-content: space-between;
        .title-item {
          position: relative;
          .item-top {
            font-size: 0.36rem;
            font-weight: bold;
            color: #ff3100;
            padding-bottom: 0.12rem;
          }
          .item-bottom {
            font-size: 0.24rem;
            font-weight: 400;
            color: #999999;
          }
        }
        .title-line {
          &::after {
            content: "";
            display: block;
            width: 0.02rem;
            height: 0.7rem;
            background: #f0f0f0;
            position: absolute;
            top: 0.06rem;
            right: -0.92rem;
          }
        }
      }
      // .tips-box {
      //   padding: 0 0.42rem 0.24rem 0.4rem;
      //   .tips-text {
      //     font-size: 0.24rem;
      //     font-weight: 400;
      //     color: #ff1000;
      //     line-height: 0.36rem;
      //     padding-bottom: 0.12rem;
      //   }
      //   .contact-btn {
      //     font-size: 0.24rem;
      //     font-weight: 400;
      //     color: #2087fb;
      //   }
      // }
      .reference {
        background: #fffbe7;
        border-radius: 0.12rem;
        padding: 0.34rem 0 0.32rem 0.18rem;
        margin: 0 0.3rem 0.46rem 0.3rem;
        position: relative;
        .reference-item {
          font-size: 0.24rem;
          font-weight: 400;
          color: #000000;
          span {
            font-size: 0.24rem;
            font-weight: bold;
            color: #ff3100;
          }
          .check-detail {
            font-size: 0.24rem;
            font-weight: 400;
            color: #016cff;
          }
        }
        img {
          width: 1.4rem;
          height: 1.3rem;
          position: absolute;
          right: 0;
          top: 0.2rem;
        }
      }
      .specific-information {
        padding: 0 0.3rem 0.4rem 0.5rem;
        .specific-box {
          display: flex;
          padding-bottom: 0.3rem;
          .box-item-left {
            width: 55% !important;
          }
          .box-item {
            width: 50%;
            font-size: 0.28rem;
            font-weight: 400;
            color: #999999;
            span {
              color: #000000;
            }
          }
        }
        .specific-cell {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.3rem;
          .cell-left {
            font-size: 0.28rem;
            font-weight: 400;
            color: #999999;
            span {
              color: #016cff;
            }
          }
          img {
            width: 0.4rem;
            height: 0.4rem;
          }
        }
      }
      .more-information {
        font-size: 0.28rem;
        font-weight: 400;
        color: #8d8d8d;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 0.24rem;
        img {
          width: 0.4rem;
          height: 0.4rem;
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
        .title {
          padding: 0.4rem 0.5rem 0.46rem 0.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .left {
            font-size: 0.4rem;
            font-weight: bold;
            color: #303030;
          }
          .right {
            span {
              font-size: 0.26rem;
              font-weight: 400;
              color: #8d8d8d;
              vertical-align: middle;
            }
            img {
              width: 0.4rem;
              height: 0.4rem;
            }
          }
        }
        .school-information {
          font-size: 0.28rem;
          font-weight: 400;
          color: #999999;
          padding-left: 0.5rem;
          padding-bottom: 0.4rem;
          display: flex;
          align-items: center;
          span {
            color: #016cff;
            padding-right: 0.1rem;
          }
          img {
            width: 0.32rem;
            height: 0.32rem;
          }
        }
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
            height: 0.8rem;
            box-shadow: 0 0 0.08rem 0 rgba(0, 0, 0, 0.5);
            top: calc(50% - 0.34rem - 0.2rem);
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 0.3rem;
            font-weight: bold;
            background: #ffffff;
            z-index: 2;
            line-height: 0.46rem;
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
        .periphery-around {
          .periphery-title {
            padding: 0.4rem 0.8rem 0.44rem 0.82rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .periphery-title-item {
              font-size: 0.32rem;
              font-family: SourceHanSansCN-Normal, SourceHanSansCN;
              font-weight: 400;
              color: #000000;
              position: relative;
              img {
                width: 0.52rem;
                height: 0.15rem;
                position: absolute;
                bottom: -0.1rem;
                left: 0.04rem;
              }
            }
          }
          .periphery-in {
            padding: 0 0 0.4rem 0.64rem;
            display: flex;
            align-items: center;
            .periphery-in-item {
              font-size: 0.24rem;
              font-weight: 400;
              color: #000000;
              background: #ebebeb;
              border-radius: 0.3rem;
              padding: 0.1rem 0.26rem;
              margin-right: 0.4rem;
            }
          }
          .periphery-in-detail {
            padding: 0 0.46rem 0rem 0.48rem;
            .detail-item {
              padding-bottom: 0.28rem;
              display: flex;
              align-items: center;
              img {
                width: 0.24rem;
                height: 0.27rem;
              }
              .address {
                width: 4.24rem;
                font-size: 0.28rem;
                font-weight: 400;
                color: #000000;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding-right: 0.32rem;
                padding-left: 0.12rem;
              }
              .distance {
                font-size: 0.28rem;
                font-weight: 400;
                color: #888888;
              }
            }
          }
        }
      }
      .recommend {
        padding: 0.6rem 0.5rem;
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
            padding-bottom: 0.4rem;
            .broker-header {
              padding-right: 0.26rem;
              img {
                width: 0.8rem;
                height: 0.8rem;
                display: block;
                border-radius: 50%;
                object-fit: cover;
              }
            }
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
              padding-right: 0.44rem;
              padding-left: 0.14rem;
              width: 1.5rem;
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
        .room-card {
          background: linear-gradient(360deg, #fffaef 0%, #ffffff 100%);
          box-shadow: 0rem 0rem 0.12rem 0rem rgba(213, 213, 213, 0.5);
          border-radius: 0.08rem;
          padding-top: 0.44rem;
          padding-bottom: 0.5rem;
          margin-top: 0.3rem;
          .card-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 0.3rem 0.66rem 0.5rem;
            .card-title-left {
              .left-title {
                font-size: 0.36rem;
                font-weight: bold;
                color: #303030;
                padding-bottom: 0.16rem;
              }
              .left-like {
                font-size: 0.24rem;
                font-weight: 400;
                color: #000000;
              }
            }
            .card-title-right {
              font-size: 0.26rem;
              font-weight: bold;
              color: #016cff;
              display: flex;
              align-items: center;
              img {
                width: 0.15rem;
                height: 0.2rem;
                padding-left: 0.1rem;
              }
            }
          }
          .card-label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-left: 0.52rem;
            padding-right: 0.6rem;
            .card-label-item {
              display: flex;
              align-items: center;
              img {
                width: 0.52rem;
                height: 0.52rem;
              }
              .label-item-text {
                padding-left: 0.22rem;
                .top {
                  font-size: 0.24rem;
                  font-weight: bold;
                  color: #000000;
                  font-family: SourceHanSansCN-Bold, SourceHanSansCN;
                }
                .bottom {
                  font-size: 0.22rem;
                  font-weight: 400;
                  color: #9fa0a5;
                  font-family: SourceHanSansCN-Normal, SourceHanSansCN;
                }
              }
            }
            .card-label-item-second {
              img {
                width: 0.56rem;
                height: 0.52rem;
              }
            }
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
    z-index: 3;
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
    width: 100%;
    height: 0.24rem;
    background: #f9f9f9;
  }
  .swipe-active {
    background: #ffce09 !important;
    opacity: 1 !important;
  }
  .around-active {
    font-weight: bold !important;
    color: #303030 !important;
  }
  .vehicle-active {
    border: 0.02rem solid #ffce09;
    background-color: #fef6d6 !important;
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
.no-empty {
  font-size: 0.28rem;
  text-align: center;
  padding-bottom: 0.3rem;
  color: #999;
}
/deep/ .van-image-preview {
  .van-image-preview__index {
    top: auto;
    bottom: 1.5rem;
    padding: 0 0.32rem;
    line-height: 1.5;
    font-size: 0.26rem;
    background: #7d7d7d;
    border-radius: 9px;
    font-weight: 500;
    color: #fff;
    text-shadow: 0 0 0 #fff;
  }
  .van-image-preview__close-icon--top-right {
    right: auto;
    top: 0.92rem;
    left: 0.24rem;
    color: #fff;
    font-size: 34px;
  }
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

.image-return {
  width: 100%;
  height: 1.32rem;
  background: #ffffff;
  box-shadow: 0rem -0.04rem 0.08rem 0rem rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  position: fixed;
  bottom: 0;
  right: 0;
  .return-btn {
    width: 5.2rem;
    height: 0.8rem;
    font-size: 0.32rem;
    font-weight: 400;
    color: #000000;
    line-height: 0.8rem;
    text-align: center;
    background: #ffce09;
    border-radius: 0.1rem;
  }
}
/deep/ .van-image-preview .van-image-preview__index {
  bottom: 2rem;
}
</style>
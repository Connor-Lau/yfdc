<template>
  <div class="housevillage">
    <gni-nav-bar @onClickLeft="onClickBack" :pageTitle="headTitle" :hideRight="false" :hideLeft="pageFrom=='maphouse'?true:false">
      <template slot="slot-left" v-if="pageFrom!='maphouse'">
        <div class="nav-left">
          <img :src="$appConfig.appWebStaticUrl + '/commission/icon_return.png'" alt="">
        </div>
      </template>
      <template slot="slot-right">
        <div class="nav-right">
          <div class="icon-chat" @click="$store.dispatch('im/goIm')">
            <img :src="$appConfig.appWebStaticUrl + 'home/icon_chat01.png'" alt="">
          </div>
          <div class="icon-share" @click="isShare=true">
            <img :src="$appConfig.appWebStaticUrl + 'home/icon_share03.png'" alt="">
          </div>
        </div>
        <!-- <div class="nav-right" v-else>
          <div class="icon-chat" @click="$store.dispatch('im/goIm')">
            <img :src="$appConfig.appWebStaticUrl + 'home/icon_chating02.png'" alt="">
          </div>
          <div class="icon-share" @click="isShare=true">
            <img :src="$appConfig.appWebStaticUrl + 'home/icon_share02.png'" alt="">
          </div>
        </div> -->
      </template>
    </gni-nav-bar>
    <div class="wrapper" v-show="isInit">
      <div class="swipe">
        <!-- 图片 -->
        <van-swipe style="height: 5.2rem;" @change="handleSwipeChange($event, 'picturesIndex')" :initial-swipe="picturesIndex">
          <template v-if="picturesInfo.length">
            <van-swipe-item v-for="(item, index) in picturesInfo" :key="index" @click="handleShowPreview(picturesInfo,'picturesIndex')">
              <img :src="toolsGetWebStaticUrl(item)" @error="toolsGetErrorHouseImage($event, 1, picturesInfo, index)" alt="">
            </van-swipe-item>
          </template>
          <template v-if="!picturesInfo.length">
            <van-swipe-item>
              <img :src="$appConfig.appWebStaticUrl + 'common/house-shooting.png'" alt="">
            </van-swipe-item>
          </template>
          <template #indicator>
            <div class="custom-indicator" v-show="picturesInfo.length">{{ picturesInfo.length ? (picturesIndex + 1) : picturesIndex}}/{{picturesInfo.length}}</div>
          </template>
        </van-swipe>
        <div class="swipe-tab" v-show="picturesInfo.length">
          <span>图片</span>
        </div>
      </div>
      <div class="housevillage-title">
        <div class="title-left">
          <div class="house-title">{{headTitle}}</div>
          <div class="address">{{dataInfo.district_name}}</div>
        </div>
        <div class="title-right" @click="handleCollection">
          <img :src="$appConfig.appWebStaticUrl + '/home/icon_collection02.png'" alt="" v-if="!isCollection">
          <img :src="$appConfig.appWebStaticUrl + '/user/icon_noattention.png'" alt="" v-else>
          <span v-if="!isCollection">关注</span>
          <span v-else>取消关注</span>
        </div>
      </div>
      <div class="split-line"></div>
      <div class="periphery-map">
        <div class="title">
          <div class="left">周边配套及通勤</div>
          <div class="right" @click="goNewMapPosition">
            <span>查看更多</span>
            <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
          </div>
        </div>
        <div class="map-container relative" @click="goNewMapPosition">
          <div class="addressRadius absolute"></div>
          <div class="addressBox text-center px-2 py-1 absolute" v-if="setTextStr([dataInfo.district_name])">
            <div class="max-w-48 ellipsis">
              {{ setTextStr([dataInfo.district_name,headTitle]) }}
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
          <div class="more-information pb-3" @click="goNewMapPosition" v-show="peripheryDetail.length && !isLoading">
            更多
            <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
          </div>
        </div>
      </div>
      <div class="split-line"></div>
      <div class="commission-bannar" @click="goCommission">
        <img :src=" $appConfig.appWebStaticUrl + '/home/village_bg.png'" alt="">
      </div>
      <div class="split-line"></div>
      <div class="tab-house">
        <div class="tab-title" v-if="houseType == 0">
          <div class="tab-item" @click="tabIndex = 0" v-show="!$commonUtils.utilCore.empty(secondHouselist)">
            <div class="text" :class="tabIndex == 0?'tab-active':''">在售房源</div>
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_line.png'" alt="" v-show="tabIndex == 0">
          </div>
          <div class="tab-item" @click="tabIndex = 1" v-show="!$commonUtils.utilCore.empty(rentHouselist)">
            <div class="text" :class="tabIndex == 1?'tab-active':''">在租房源</div>
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_line.png'" alt="" v-show="tabIndex == 1">
          </div>
        </div>
        <div class="tab-title" v-if="houseType == 1">
          <div class="tab-item" @click="tabIndex = 1" v-show="!$commonUtils.utilCore.empty(rentHouselist)">
            <div class="text" :class="tabIndex == 1?'tab-active':''">在租房源</div>
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_line.png'" alt="" v-show="tabIndex == 1">
          </div>
          <div class="tab-item" @click="tabIndex = 0" v-show="!$commonUtils.utilCore.empty(secondHouselist)">
            <div class="text" :class="tabIndex == 0?'tab-active':''">在售房源</div>
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_line.png'" alt="" v-show="tabIndex == 0">
          </div>
        </div>
        <div class="list">
          <template v-if="tabIndex == 0">
            <houselistItem :list="secondHouselist" @goDetail="goDetail">
            </houselistItem>
          </template>
          <template v-if="tabIndex == 1">
            <houselistItem :list="rentHouselist" :isRent="false" @goDetail="goDetail"></houselistItem>
          </template>
        </div>
        <div class="morehouse-btn" @click="tabIndex==0?toolsGoPageView({path:'/home/list/secondhouseList',query:{isUpdate:1,uptown_id:uptownId,city_id:cityId}}):toolsGoPageView({path:'/home/list/renthouseList',query:{isUpdate:1,uptown_id:uptownId,city_id:cityId}})">查看更多</div>
        <div class="nearby-stores">
          <div class="nearby-title">
            <div class="left">附近门店</div>
            <div class="right">
              <span>更多</span>
              <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
            </div>
          </div>
          <div class="nearby-item" v-for="(item,index) in storeNearData" :key="index">
            <div class="item-left">
              <div class="left-top">
                <span class="storename">{{item.store_name}}</span>
                <span class="distance">{{item.distance}}m</span>
              </div>
              <div class="left-bottom">{{item.total_fang}}套在售/在租房源</div>
            </div>
            <div class="item-right">
              <div class="btn" @click.stop="keyNav(item.latitude,item.longitude,item.store_name)">
                <img :src="$appConfig.appWebStaticUrl + '/home/village_dw.png'" alt="">
              </div>
              <div class="btn" @click="toolsGoPageTel(item.telephone)" v-show="item.telephone">
                <img :src="$appConfig.appWebStaticUrl + '/home/vallage_poe.png'" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="village-tips">
        <ol type="1">
          <li>小区介绍中的周边配套、在建设施、规划设施、地铁信息等信息为通过物业介绍、房产证、实勘、政府官网等渠道获取，因时间、政策会发生变化，与实际情况可能略有偏差，小区介绍仅供参考。</li>
          <li>小区介绍中与距离相关的数据均来源于百度地图。</li>
        </ol>
      </div>
    </div>
    <!-- <div class="footer-broker" v-if="JSON.stringify(brokerInfo) !== '{}'">
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
    </div> -->
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
    <van-popup v-model="isShare" position="bottom" :round="true" teleport="body">
      <div class="share-pop">
        <div class="title">分享小区</div>
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
  </div>
</template>

<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import houselistItem from "@/components/yni/houselistItem.vue"
import newhouselistItem from "@/components/yni/newhouselistItem.vue"
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  components: {
    gniNavBar,
    houselistItem,
    newhouselistItem
  },
  data () {
    return {
      headTitle: '',
      uptownId: '', // 小区id
      isCollection: false, // 收藏
      picturesIndex: 0,
      picturesInfo: [], //图片信息
      dataInfo: {}, //房源基本信息
      around: {}, // 周边地方
      aroundIndex: "", // 周边下标
      vehicle: [],  // 交通工具
      vehicleIndex: 0, //交通下标
      storeNearData: [],  // 附近门店
      secondHouselist: [], // 在售房源
      rentHouselist: [], // 在租房源
      resourceType: '', //关注的类型
      resourceid: '', // 关注的id
      isShare: false, // 分享弹窗
      houseType: 0, // 从二手房还是租房进来？ 0二手房，1租房

      peripheryDetail: [],
      tabIndex: 0, // 房源tab切换
      longitude: "",//经度
      latitude: "",//纬度
      // 图片预览
      showPreview: false,
      previewImages: [],
      bigIndexImg: 0, //大图展示下标
      previewKey: "",
      isLoading: false,
      isInit: false,
      appVersion: {},
      cityId: '', // 城市id
      pageFrom: '', // 从哪里进来的
    }
  },
  computed: {
    ...mapState("city", ["thisCityInfo", "switchCityInfo"]),
    ...mapState("user", ["userToken", "userInfo", "isLogin"]), //用户Token,用户登陆信息
    ...mapState("app", ["wgtInfo", "checkAppUpdateVal"]),
    // 地图图片
    mapImage () {
      if (!this.longitude || !this.latitude) {
        return
      }
      const center = this.$commonUtils.utilCore.bd_decrypt(this.longitude, this.latitude); // 百度转高德
      return "https://restapi.amap.com/v3/staticmap?&zoom=15&location=" + center.longitude + "," + center.latitude + "&key=" + this.$appConfig.appMapKey[Math.floor(Math.random() * this.$appConfig.appMapKey.length)] + "&size=335*164";
    },
  },
  created () {
    window.scroll(0, 0)
    this.uptownId = this.$route.query.id || ""
    // 很少有小区图片数据，先写死小区id,方便测试
    // this.uptownId = 5388
    this.houseType = this.$route.query.housetype || ""
    this.tabIndex = this.$route.query.housetype || ""
    this.cityId = this.$route.query.cityId || this.switchCityInfo.city_id || this.thisCityInfo.city_id
    this.pageFrom = this.$route.query.pageFrom || ''
    this.doGetWgtInfo();
  },
  async mounted () {
    this.isInit = false
    this.$commonUtils.utilCore.showLoading();
    setTimeout(async () => {
      //初始化登陆的状态
      await this.init();
      //初始化地址的状态
      //await this.initPosition();
      await this.getDetail();
      // await this.getHouseDetail();
      await this.getStorenear();
      await this.getSecondhouse();
      await this.getRenthouse();
      await this.getAttention();
      this.getAppWechatNearbyGetField();
      this.$commonUtils.utilCore.closeLoading()
      this.isInit = true
    }, 500)
  },
  methods: {
    ...mapActions('app', ['getShareApp', 'getWgtInfo']),
    //获取版本信息
    async doGetWgtInfo () {
      let dataInfo = await this.getWgtInfo(this.$messageAct)
      console.log(JSON.stringify(dataInfo))
      this.appVersion = dataInfo;
    },
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
    async getDetail () {
      const postData = {
        id: this.uptownId,
        city_id: this.cityId,
      }
      const res = await this.$store.dispatch('home/getAppFangUptowndetail', postData);
      if (res) {
        const { data = {}, stat = {}, pictures } = res
        this.dataInfo = data || {}
        this.picturesInfo = pictures || []
        this.headTitle = data.uptown_name
        if (!Number(data.longitude)) {
          this.longitude = this.$route.query.longitude;//经度
        } else {
          this.longitude = data.longitude;//经度
        }
        if (!Number(data.latitude)) {
          this.latitude = this.$route.query.latitude;//经度
        } else {
          this.latitude = data.latitude;//
        }
      }
    },
    // async getHouseDetail () {
    //   const postData = {
    //     city_id: this.cityId || this.switchCityInfo.city_id || this.thisCityInfo.city_id,
    //     id: this.houseId,
    //   }
    // },
    // 获取附近门店
    async getStorenear () {
      const postData = {
        longitude: this.longitude,
        latitude: this.latitude,
        city_id: this.cityId,
      }
      const res = await this.$store.dispatch('home/getAppFangStorenear', postData);
      if (res) {
        this.storeNearData = res
      }
    },
    // 附近门店导航
    async keyNav (key_lat, key_lng, store_name) {
      let isMapVivw = false;
      if (this.appVersion) {
        isMapVivw = this.toolsVersionCompare(this.appVersion.version, "5.1.1");
      }
      const center = this.$commonUtils.utilCore.bd_decrypt(key_lng, key_lat); // 百度转高德
      let url = "https://uri.amap.com/marker?position=" + center.longitude + "," + center.latitude + "&name=" + store_name;
      if (isMapVivw) {
        this.toolsGoPageView({
          path: '/common/web-detail',
          query: { url: encodeURIComponent(url), title: store_name },
        });
      } else {
        this.toolsGoPageView({
          path: '/common/web-detail',
          query: { url: encodeURIComponent(url), title: store_name, appPath: ('/pages/common/web-view-show/map-view?url=' + encodeURIComponent(url) + "&hideNav=yes&fromUrl=" + this.$route.path) },
        });
      }
      // this.$commonUtils.utilCore.uniGoPage('/pages/common/web-view-show/map-view?url=' + encodeURIComponent(url) + "&hideNav=yes&fromUrl=" + this.$route.path);
    },
    // 获取在售房源
    async getSecondhouse () {
      const postData = {
        page: 1,
        page_size: 3,
        searchUptownId: this.uptownId,
        city_id: this.cityId,
      }
      let res = await this.$store.dispatch("home/actAppFangSaleLists", postData);
      if (res) {
        this.secondHouselist = res.rows
      }
    },
    // 获取在租房源 
    async getRenthouse () {
      const postData = {
        page: 1,
        page_size: 3,
        searchUptownId: this.uptownId,
        city_id: this.cityId,
      }
      let res = await this.$store.dispatch("home/actAppFangRentLists", postData);
      if (res) {
        this.rentHouselist = res.rows
      }
    },
    // 是否关注了小区
    async getAttention () {
      if (!this.isLogin) return;
      let postData = {
        city_id: this.cityId,
        resource_id: this.uptownId,
        resource_type: "4"
      }
      let res = await this.$store.dispatch('home/getAppFangFavoriteStatus', postData);
      if (res) {
        this.isCollection = true
      } else {
        this.isCollection = false
      }
    },
    // 关注小区
    async addFangFavorite () {
      if (!this.isLogin) return this.$commonUtils.utilCore.showToast("请登录");
      const postData = {
        city_id: this.cityId,
        resource_id: this.resourceid,
        resource_type: this.resourceType,
      }
      const res = await this.$store.dispatch('home/addAppFangFavorite', postData);
      if (res) {
        this.isCollection = true;
        this.$commonUtils.utilCore.showToast("关注成功");
      }
    },
    // 取消关注（小区）
    async cancelFangFavorite () {
      if (!this.isLogin) return this.$commonUtils.utilCore.showToast("请登录");
      const postData = {
        city_id: this.cityId,
        resource_id: this.resourceid,
        resource_type: this.resourceType,
      }
      const res = await this.$store.dispatch('home/cancelAppFangFavorite', postData);
      if (res) {
        this.isCollection = false;
        this.$commonUtils.utilCore.showToast("已取消关注");
      }
    },
    // 关注小区事件
    handleCollection () {
      this.resourceType = '4'
      this.resourceid = this.uptownId
      if (this.isCollection) {
        this.cancelFangFavorite();
      } else {
        this.addFangFavorite();
      }
    },
    // 房源关注 2022/5/10取消在小区可关注楼盘功能
    // handleAttention (item, index) {
    //   if (!this.isLogin) return this.$commonUtils.utilCore.showToast("请登录");
    //   if (this.tabIndex == 0) {
    //     this.resourceType = '1'
    //     this.resourceid = item.shouse_id
    //     if (item.is_favorite) {
    //       this.secondHouselist[index].is_favorite = false
    //       this.cancelFangFavorite();
    //     } else {
    //       this.secondHouselist[index].is_favorite = true
    //       this.addFangFavorite();
    //     }
    //   } else {
    //     this.resourceType = '2'
    //     this.resourceid = item.rent_id
    //     if (item.is_favorite) {
    //       this.rentHouselist[index].is_favorite = false
    //       this.cancelFangFavorite();
    //     } else {
    //       this.rentHouselist[index].is_favorite = true
    //       this.addFangFavorite();
    //     }
    //   }
    // },
    goDetail (item) {
      if (this.tabIndex == 0) {
        let tmp_query = {
          id: item.shouse_id,//	是	string	二手房id
          broker_id: item.broker_id,//	否	string	经纪人id
          share_broker_id: ""//	否	string	分享者经纪人id
        }
        this.toolsGoPageView({
          path: '/home/detail/secondhouseDetail',
          query: tmp_query
        })
      } else {
        let tmp_query = {
          id: item.rent_id,//	是	string	租房id
          broker_id: item.broker_id,//	否	string	经纪人id
          share_broker_id: item.share_broker_id || ''//	否	string	分享者经纪人id
        }
        this.toolsGoPageView({
          path: '/home/detail/renthouseDetail',
          query: tmp_query
        })
      }
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
    // 2023/5/26 调整为新地图 新增参数隐藏地图右边导航栏
    goNewMapPosition () {
      const param = {};
      param.longitude = this.longitude;
      param.latitude = this.latitude;
      param.address = this.headTitle;
      param.label = this.aroundIndex || "";
      param.tag = this.vehicle[this.vehicleIndex];
      param.platform = 'uapp';
      param.isLogin = this.isLogin ? '1' : '0';
      param.nav_display = 'none';
      this.toolsGoPageView({ path: "/home/map/newmap", query: param });
    },
    // 周边配套及通勤-内容列表
    async getAppWechatNearbyIndex () {
      const postData = {
        longitude: this.longitude,//	否	string	经度	113.368523
        latitude: this.latitude,//	否	string	纬度	23.146245
        type: this.aroundIndex,//	是	string	一级类型	教育
        tag: this.vehicle[this.vehicleIndex],// 否	string	二级类型	中学
        city_id: this.cityId,
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
        const middleNum = parseInt((arrKey.length + 1) / 2) - 1; //获取中位数
        this.aroundIndex = arrKey[middleNum];
        this.vehicle = this.around[this.aroundIndex];
        this.vehicleIndex = 0;
        this.getAppWechatNearbyIndex();
      }
    },
    // 切换周边数据
    handleTabAround (key, type = 0) {
      if (this.isLoading) return;
      if (!type) {
        this.aroundIndex = key; this.vehicle = this.around[key]; this.vehicleIndex = 0;
      }
      this.getAppWechatNearbyIndex();
    },
    // 计算周边配套及通勤 距离字段
    getDistance (val) {
      const value = (Number(val) / 1000).toFixed(1);
      return value || 0;
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
    // 轮播图滑动下标
    handleSwipeChange (e, dataKey) {
      this[dataKey] = e;
    },
    // 改变大图图片的下标
    hanldImgChange (index) {
      this.bigIndexImg = index;
      if (!this.previewKey) return;
      this[this.previewKey] = index;
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
      window.history.pushState(null, null, null); // 添加一行，阻止后退按钮跳转页面
      window.addEventListener("popstate", this.handleClosePreview, false);
    },
    // 分享给朋友、朋友圈; type=0 分享到聊天界面
    async handleShare (type = 0) {
      const href = this.dataInfo.share_url;
      const shareData = await this.getShareApp({
        messageAct: this.$messageAct,
        jsonData: {
          provider: "weixin",
          title: this.headTitle,
          scene: type === 0 ? "WXSceneSession" : "WXSceneTimeline",//WXSceneSession	分享到聊天界面;WXSceneTimeline	分享到朋友圈
          type: 0,
          summary: "[小区]",
          imageUrl: this.toolsGetWebStaticUrl(this.dataInfo.picture),
          href
        },
      });
      // this.$commonUtils.appLog.log("shareData", JSON.stringify(shareData));
    },
    // 跳转委托
    goCommission () {
      if (!this.isLogin) return location._fromCommission = 1, this.toolsGoPageView({ path: '/common/index', query: { fromCommission: true, path: '/user/index' } });
      this.toolsGoPageView({ path: '/home/commission/index' })
    },
    goShareChat () {

    },
    onClickBack () {
      this.toolsGoPageBack();
    },
  }
}
</script>

<style lang="scss" scoped>
.housevillage {
  .nav-left {
    img {
      width: 0.35rem;
      height: 0.35rem;
      display: block;
    }
  }
  .nav-right {
    display: flex;
    align-items: center;
    .icon-chat {
      padding-right: 0.42rem;
      position: relative;
      img {
        width: 0.44rem;
        height: 0.44rem;
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
      position: absolute;
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
          text-align: center;
          border-radius: 0.22rem;
          background: #ffce09;
        }
      }
      /deep/ .van-swipe-item {
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .housevillage-title {
      padding: 0.5rem 0.42rem 0.6rem 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title-left {
        .house-title {
          font-size: 0.4rem;
          color: #000000;
        }
        .address {
          font-size: 0.24rem;
          font-weight: 400;
          color: #3e3e3e;
          padding-top: 0.1rem;
          padding-left: 0.03rem;
        }
      }
      .title-right {
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          width: 0.28rem;
          height: 0.28rem;
        }
        span {
          font-size: 0.2rem;
          font-weight: bold;
          color: #4a4a4a;
          padding-top: 0.06rem;
        }
      }
    }
    .periphery-map {
      .title {
        padding: 0.6rem 0.5rem 0.4rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          font-size: 0.32rem;
          color: #000000;
        }
        .right {
          display: flex;
          align-items: center;
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
          padding: 0 0.46rem 0.32rem 0.48rem;
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
    .commission-bannar {
      padding: 0.6rem 0.5rem;
      img {
        width: 100%;
        height: 2.4rem;
      }
    }
    .tab-house {
      .tab-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.6rem 1.54rem 0.16rem;
        .tab-item {
          padding-right: 0.4rem;
          position: relative;
          .text {
            font-size: 0.32rem;
            font-weight: 400;
            color: #5f5f5f;
          }
          img {
            width: 0.52rem;
            height: 0.16rem;
            display: block;
            position: absolute;
            bottom: -0.2rem;
            left: 0.38rem;
          }
        }
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
        margin: 0.4rem 0.5rem;
      }
      .nearby-stores {
        padding: 0.6rem 0.5rem 0.28rem;
        .nearby-title {
          padding-bottom: 0.38rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .left {
            font-size: 0.36rem;
            font-weight: 400;
            color: #000000;
          }
          .right {
            display: flex;
            align-items: center;
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
        .nearby-item {
          display: flex;
          align-items: center;
          padding-bottom: 0.46rem;
          .item-left {
            width: 4.5rem;
            .left-top {
              display: flex;
              align-items: center;
              padding-bottom: 0.2rem;
              .storename {
                font-size: 0.32rem;
                font-weight: 400;
                color: #000000;
                padding-right: 0.2rem;
              }
              .distance {
                font-size: 0.24rem;
                font-weight: 400;
                color: #949494;
              }
            }
            .left-bottom {
              font-size: 0.22rem;
              font-weight: 400;
              color: #949494;
            }
          }
          .item-right {
            display: flex;
            .btn {
              padding-right: 0.42rem;
              img {
                width: 0.78rem;
                height: 0.76rem;
                display: block;
              }
              &:nth-last-child(1) {
                padding-right: 0;
              }
            }
          }
        }
      }
    }
    .village-tips {
      font-size: 0.24rem;
      font-weight: 400;
      color: #9b9b9b;
      text-align: justify;
      line-height: 0.4rem;
      background: #efefef;
      padding: 0.5rem 0.5rem 0.5rem 0.7rem;
      ol {
        list-style: decimal;
      }
    }
  }
  // .footer-broker {
  //   width: 100%;
  //   height: 1.58rem;
  //   background: #ffffff;
  //   box-shadow: 0rem 0.04rem 0.08rem 0rem rgba(0, 0, 0, 0.5);
  //   display: flex;
  //   align-items: center;
  //   justify-content: space-between;
  //   position: fixed;
  //   bottom: 0;
  //   z-index: 3;
  //   right: 0;
  //   .footer-left {
  //     display: flex;
  //     padding-left: 0.4rem;
  //     img {
  //       width: 0.8rem;
  //       height: 0.8rem;
  //       border-radius: 50%;
  //       object-fit: cover;
  //     }
  //     .footer-name {
  //       padding-left: 0.18rem;
  //       .name {
  //         font-size: 0.32rem;
  //         font-weight: bold;
  //         color: #000000;
  //         font-family: SourceHanSansCN-Bold, SourceHanSansCN;
  //       }
  //       .label {
  //         font-size: 0.24rem;
  //         font-weight: 400;
  //         color: #000000;
  //         font-family: SourceHanSansCN-Normal, SourceHanSansCN;
  //       }
  //     }
  //   }
  //   .footer-right {
  //     display: flex;
  //     padding-right: 0.38rem;
  //     .btn-question {
  //       width: 1.68rem;
  //       height: 0.8rem;
  //       font-size: 0.32rem;
  //       font-weight: bold;
  //       color: #000000;
  //       line-height: 0.8rem;
  //       text-align: center;
  //       border-radius: 0.08rem;
  //       border: 0.02rem solid #919191;
  //     }
  //     .btn-phone {
  //       width: 1.68rem;
  //       height: 0.8rem;
  //       font-size: 0.32rem;
  //       font-weight: bold;
  //       color: #000000;
  //       line-height: 0.8rem;
  //       text-align: center;
  //       background: #ffce09;
  //       border-radius: 0.08rem;
  //       // margin-right: 0.38rem;
  //       margin-left: 0.18rem;
  //     }
  //   }
  // }
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
  .tab-active {
    font-weight: bold !important;
    color: #000000 !important;
  }
  .vehicle-active {
    border: 0.02rem solid #ffce09;
    background-color: #ffffff !important;
  }
  .around-active {
    font-weight: bold !important;
    color: #303030 !important;
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
  .no-empty {
    font-size: 0.28rem;
    text-align: center;
    padding-bottom: 0.3rem;
    color: #999;
  }
}
</style>
<template>
  <div>
    <gni-nav-bar :pageTitle="pageTitle" @onClickLeft="onClickLeft" :hideRight="false" ref="navBar"></gni-nav-bar>
    <!-- <div @click="keyNav">导航</div> -->
    <!-- <div @click="keyNav('https://map.baidu.com/?l=&s=nav%26sn%3D1%24%24%24%2412625685.33%2C2630176.71%24%24%E8%B5%B7%E7%82%B9%24%24%24%24%24%24%26en%3D1%24%24%24%2412614785.92%2C2632244.63%24%24%E7%BB%88%E7%82%B9%24%24%24%24%24%24%26sc%3D131%26ec%3D131')">导航</div> -->
    <div class="house-main">
      <iframe
        style="border:none"
        :style="{height: searchTableHeight + 'px',width: searchTableWidth + 'px'}"
        :src="mapLink">
      </iframe>
    </div>
    <van-popup v-model="isShare" position="bottom" :round="true" teleport="body">
      <div class="share-pop">
        <div class="title">分享房源</div>
        <div class="content">
          <div class="content-item" @click="handleShare()">
            <img :src="$appConfig.appWebStaticUrl + '/common/icon_wechat.png'" alt="">
            <span>微信</span>
          </div>
          <!-- 成交详情进来的不要朋友圈 -->
          <div class="content-item" @click="handleShare(1)" v-show="houseType<4">
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
import gniNavBar from '@/components/gni/gni-nav-bar.vue'
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  components: { gniNavBar },
  data () {
    return {
      pageTitle: "周边配套及通勤",
      mapLink: "",
      searchTableHeight: 0,
      searchTableWidth: 0,
      isShare: false, // 分享弹窗
      houseType: '',// 页面来源
    };
  },
  computed: {
    ...mapState("user", ["userToken", "userInfo", "isLogin"]), //用户Token,用户登陆信息
    ...mapState("city", ["geoPosition", "thisCityInfo", "switchCityInfo", "cityInfoRows"]), //城市的信息 
  },
  mounted () {
    //暴露一个方法给window外面调用vue里的方法
    window.handleRightColumn = (type = 'collect', url) => {
      if (type == 'collect') {
        console.log("调用了地产app的收藏handleRightColumn===========11111111111111111======>>>>");
        if (!this.isLogin) return location._fromCommission = 1, this.toolsGoPageView({ path: '/common/index', query: { fromCommission: true, path: '/user/index' } });
      } else if (type == 'share') {
        console.log("调用了地产app的分享handleRightColumn===========11111111111111111======>>>>");
        this.isShare = true;
      } else if (type == 'chat') {
        console.log("调用了地产app的咨询handleRightColumn===========11111111111111111======>>>>");
        if (!this.isLogin) return location._fromCommission = 1, this.toolsGoPageView({ path: '/common/index', query: { fromCommission: true, path: '/user/index' } });
        this.goChat()
      } else if (type == 'keyNav') {
        console.log("调用了地产app的导航handleRightColumn===========11111111111111111======>>>>");
        this.keyNav(url)
      }
    };
    window.onresize = () => {
      this.widthHeight(); // 自适应高宽度
    };
    this.$nextTick(() => {
      this.widthHeight();
    })
    this.init()
  },
  methods: {
    ...mapActions('app', ['getShareApp']),
    //暴露一个方法给window外面调用vue里的方法
    slzk (type) {
      if (!this.isLogin) return this.toolsGoPageView({ path: '/user/index', query: { fromCommission: true } });
      if (type == 'share') {
        console.log("调用了地产app的分享handleRightColumn===========11111111111111111======>>>>");
        this.isShare = true;
      } else if ('chat') {
        console.log("调用了地产app的咨询handleRightColumn===========11111111111111111======>>>>");
        this.goChat()
      }
    },
    csshare () {
      this.slzk('share')
    },
    widthHeight () {
      this.searchTableWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || '100%';
      this.searchTableHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) - (this.$refs.navBar.getNavHeight());
    },
    init () {
      const { longitude, latitude, userId, houseId, houseType, cityId, isLogin, isBroker, address, receiverUid, brokerPhone, platform, label, tag, nav_display } = this.$route.query
      // 2022/10/10 新地图
      const param = {
        longitude: longitude,
        latitude: latitude,
        userId: userId,
        houseId: houseId,
        houseType: houseType == 4 ? '1' : houseType == 5 ? '2' : houseType,  // 1 sale二手房 2rent租房 3house新房  4二手房成交详情进来的
        cityId: cityId,
        isLogin: isLogin,
        isBroker: isBroker,
        address: address,
        receiverUid: receiverUid,
        brokerPhone: brokerPhone,
        platform: platform,
        label: label,
        key: label,
        tag: tag,
        hideNavBar: 1,
        nav_display: nav_display || "", // 2023/5/26 新增参数隐藏地图右边导航栏
      }
      this.houseType = houseType
      this.mapLink = this.$commonUtils.utilCore.url('https://m.yfdc.net/v1/index.php?m=Fang&c=Map&a=newMap', param);
    },
    // 分享给朋友、朋友圈; type=0 分享到聊天界面
    async handleShare (type = 0) {
      const { share_url, brokerId, picture, shareBrokerId, district_name, block_name, price_name, houseId, houseType, address, property_type_name, average_price_name, shouse_trade_id } = this.$route.query
      const href = share_url + "/" + brokerId;
      let shareInfo = {
        type: 0,
        summary: houseType == 1 || houseType == 4 ? '[二手房]' : houseType == 2 || houseType == 5 ? '[租房]' : '[新房]',
        imageUrl: this.toolsGetWebStaticUrl(picture),
        href,
      };
      if (houseType == 4) {
        if (type === 0) {
          const url = `/pages/home/transaction-history/sale-detail`;
          const path = this.$commonUtils.utilCore.url(url, {
            id: shouse_trade_id,
          });
          shareInfo = {
            type: 5,
            imageUrl: this.toolsGetWebStaticUrl(picture),
            miniProgram: {
              id: 'gh_cbb5c9d6827f',
              path: path,
              type: 0,
              webUrl: 'https://napp.yfdc.net'
            }
          }
        }

      } else if (houseType == 5) {
        if (type === 0) {
          const url = `/pages/home/transaction-history/rent-detail`;
          const path = this.$commonUtils.utilCore.url(url, {
            id: shouse_trade_id,
          });
          shareInfo = {
            type: 5,
            imageUrl: this.toolsGetWebStaticUrl(picture),
            miniProgram: {
              id: 'gh_cbb5c9d6827f',
              path: path,
              type: 0,
              webUrl: 'https://napp.yfdc.net'
            }
          }
        }
      } else {
        if (type === 0) {
          const { user_type = 1, user_id = "", user_row = { extend: { nickname: "" } } } = this.userInfo;
          const url = `/pages/card/${houseType == 1 ? 'sale' : houseType == 2 ? 'rent' : 'house'}/detail`;
          const path = this.$commonUtils.utilCore.url(url, {
            id: houseId,
            broker_id: brokerId,//this.userInfo.uid,
            isBrokerShare: 0,
            share_broker_id: shareBrokerId,//this.userInfo.uid

            share_user_type: user_type,// 分享来源用户类型(1:用户,2:经纪人)  
            share_user_id: user_id,// 分享来源用户ID 
            share_username: user_row.extend.nickname,// 分享来源用户名

            share_resource_type: houseType,//  分享资源类型(1:二手房,2:租房,3:新房,4:小区,5:经纪人,6:动态,7:官网,8:获客文章,10:小程序,11:个人海报,12:房源海报,13:配图海报,14:获客文章海报,15:微信分享,16:微信朋友圈) 
            share_resource_id: houseId,// 分享资源ID  this.dataInfo
            share_resource_name: address,// 分享资源名称 
          });
          shareInfo = {
            type: 5,
            imageUrl: this.toolsGetWebStaticUrl(picture),
            miniProgram: {
              id: 'gh_cbb5c9d6827f',
              path: path,
              type: 0,
              webUrl: 'https://napp.yfdc.net'
            }
          }
        }
      }

      const shareData = await this.getShareApp({
        messageAct: this.$messageAct,
        jsonData: {
          provider: "weixin",
          title: houseType == 1 || houseType == 2 || houseType == 4 || houseType == 5 ? `【${district_name}${block_name}】${address} ${price_name}` : `${address} ${property_type_name}类 均价${average_price_name} （新房）`,
          scene: type === 0 ? "WXSceneSession" : "WXSceneTimeline",//WXSceneSession	分享到聊天界面;WXSceneTimeline	分享到朋友圈
          ...shareInfo,
        },
      });
      // this.$commonUtils.appLog.log("shareData", JSON.stringify(shareData));
    },
    // 跳转房源分享弹窗--经纪人
    goShareChat () {
      const { picture, shareBrokerId, houseId, address, layout_short_name, house_orientation_name, decoration_name, average_price_name, price, acreage_cover, houseType, price_name, acreage_min, acreage_max, loupan_address, receiverUid, shouse_trade_id, rent_trade_id } = this.$route.query
      let houseInfo = {}
      if (houseType == 1) {
        // 二手房
        houseInfo = {
          // 这里写 房源消息的内容
          shouse_id: houseId,//->  二手房id, 应该是pc的房源id
          shouse_title: address,//->  标题
          preview_url: picture || (this.$appConfig.appWebStaticUrl + 'common/house.png'),//->  图片地址
          layout_dname: layout_short_name,//->  房型室
          house_orientation_name: house_orientation_name,//->  房屋朝向
          decoration_name: decoration_name,//->  装修类型
          unit_price: average_price_name,//->  单价
          price: price,//->  售价
          acreage_cover: acreage_cover,//->  建筑面积
          share_broker_id: shareBrokerId || 0,//-> 分享经纪人， 传当前经纪人：brokerInfo.erp_broker_id， 没有就传 0
        }
      } else if (houseType == 2) {
        houseInfo = {
          // 这里写 房源消息的内容
          rent_id: houseId,//->  二手房id, 应该是pc的房源id
          rent_title: address,//->  标题
          rent_price: price_name, // 价格
          layout_dname: layout_short_name,//->  房型室
          house_orientation_name: house_orientation_name,//->  房屋朝向
          decoration_name: decoration_name,//->  装修类型
          acreage: acreage_cover,//->  建筑面积
          preview_url: picture || (this.$appConfig.appWebStaticUrl + 'common/house.png'),//->  图片地址
          share_broker_id: shareBrokerId || 0,//-> 分享经纪人， 传当前经纪人：broker.erp_broker_id， 没有就传 0
        }
        // 租房
      } else if (houseType == 3) {
        houseInfo = {
          // 这里写 房源消息的内容
          loupan_id: houseId,//-> 楼盘id
          loupan_name: address,//->  楼盘名字
          average_price: average_price_name, // 均价
          acreage_min: acreage_min, // 最小面积
          acreage_max: acreage_max, // 最大面积
          preview_url: picture || (this.$appConfig.appWebStaticUrl + 'common/house.png'),//->  图片地址
          loupan_address: loupan_address, // 楼盘地址
          share_broker_id: receiverUid || 0,//-> 分享经纪人， 传当前经纪人：brokerInfo.erp_broker_id， 没有就传 0
        }
      } else if (houseType == 4) {
        // 二手房成交详情
        houseInfo = {
          // 这里写 房源消息的内容
          shouse_id: shouse_trade_id,//->  
          shouse_title: address,//->  标题
          preview_url: picture || (this.$appConfig.appWebStaticUrl + 'common/house.png'),//->  图片地址
          layout_dname: layout_short_name,//->  房型室
          house_orientation_name: house_orientation_name,//->  房屋朝向
          decoration_name: decoration_name,//->  装修类型
          unit_price: average_price_name,//->  单价
          price: price,//->  售价
          acreage_cover: acreage_cover,//->  建筑面积
          share_broker_id: shareBrokerId || 0,//-> 分享经纪人， 传当前经纪人：brokerInfo.erp_broker_id， 没有就传 0
          type: 'checkDeal',
        }
      } else {
        // 租房成交详情
        houseInfo = {
          rent_id: rent_trade_id,//->  租房id
          rent_title: address,//->  标题
          rent_price: price_name, // 价格
          layout_dname: layout_short_name,//->  房型室
          house_orientation_name: house_orientation_name,//->  房屋朝向
          decoration_name: decoration_name,//->  装修类型
          acreage: acreage_cover,//->  建筑面积
          preview_url: picture || this.$appConfig.appWebStaticUrl + 'common/house.png',//->  图片地址
          share_broker_id: shareBrokerId || 0,//-> 分享经纪人， 传当前经纪人：broker.erp_broker_id， 没有就传 0
          type: 'checkDealRent',
        }
      }
      this.$store.dispatch('im/goChatShare', houseInfo)
    },
    // 跳转聊天--咨询
    goChat (brokerInfo) {
      const { brokerId, picture, shareBrokerId, houseId, address, receiverUid, layout_short_name, house_orientation_name, decoration_name, average_price_name, price, acreage_cover, houseType, price_name, acreage_min, acreage_max, loupan_address, shouse_trade_id, rent_trade_id } = this.$route.query
      let houseInfo = {}
      if (houseType == 1) {
        // 二手房
        houseInfo = {
          // 这里写 房源消息的内容
          shouse_id: houseId,//->  二手房id, 应该是pc的房源id
          shouse_title: address,//->  标题
          preview_url: picture || (this.$appConfig.appWebStaticUrl + 'common/house.png'),//->  图片地址
          layout_dname: layout_short_name,//->  房型室
          house_orientation_name: house_orientation_name,//->  房屋朝向
          decoration_name: decoration_name,//->  装修类型
          unit_price: average_price_name,//->  单价
          price: price,//->  售价
          acreage_cover: acreage_cover,//->  建筑面积
          share_broker_id: shareBrokerId || 0,//-> 分享经纪人， 传当前经纪人：brokerInfo.erp_broker_id， 没有就传 0
        }
      } else if (houseType == 2) {
        // 租房
        houseInfo = {
          // 这里写 房源消息的内容
          rent_id: houseId,//->  租房id, 应该是pc的房源id
          rent_title: address,//->  标题
          rent_price: price_name, // 价格
          layout_dname: layout_short_name,//->  房型室
          house_orientation_name: house_orientation_name,//->  房屋朝向
          decoration_name: decoration_name,//->  装修类型
          acreage: acreage_cover,//->  建筑面积
          preview_url: picture || (this.$appConfig.appWebStaticUrl + 'common/house.png'),//->  图片地址
          share_broker_id: shareBrokerId || 0,//-> 分享经纪人， 传当前经纪人：broker.erp_broker_id， 没有就传 0
        }
      } else if (houseType == 3) {
        houseInfo = {
          // 这里写 房源消息的内容
          loupan_id: houseId,//-> 楼盘id
          loupan_name: address,//->  楼盘名字
          average_price: average_price_name, // 均价
          acreage_min: acreage_min, // 最小面积
          acreage_max: acreage_max, // 最大面积
          preview_url: picture || (this.$appConfig.appWebStaticUrl + 'common/house.png'),//->  图片地址
          loupan_address: loupan_address, // 楼盘地址
          share_broker_id: receiverUid || 0,//-> 分享经纪人， 传当前经纪人：brokerInfo.erp_broker_id， 没有就传 0
        }
      } else if (houseType == 4) {
        // 二手房成交详情
        houseInfo = {
          // 这里写 房源消息的内容
          shouse_id: shouse_trade_id,//->  二手房id, 应该是pc的房源id
          shouse_title: address,//->  标题
          preview_url: picture || (this.$appConfig.appWebStaticUrl + 'common/house.png'),//->  图片地址
          layout_dname: layout_short_name,//->  房型室
          house_orientation_name: house_orientation_name,//->  房屋朝向
          decoration_name: decoration_name,//->  装修类型
          unit_price: average_price_name,//->  单价
          price: price,//->  售价
          acreage_cover: acreage_cover,//->  建筑面积
          share_broker_id: shareBrokerId || 0,//-> 分享经纪人， 传当前经纪人：brokerInfo.erp_broker_id， 没有就传 0
          type: 'checkDeal',
        }
      } else {
        // 租房成交详情
        houseInfo = {
          rent_id: rent_trade_id,//->  租房id, 应该是pc的房源id
          rent_title: address,//->  标题
          rent_price: price_name, // 价格
          layout_dname: layout_short_name,//->  房型室
          house_orientation_name: house_orientation_name,//->  房屋朝向
          decoration_name: decoration_name,//->  装修类型
          acreage: acreage_cover,//->  建筑面积
          preview_url: picture || this.$appConfig.appWebStaticUrl + 'common/house.png',//->  图片地址
          share_broker_id: shareBrokerId || 0,//-> 分享经纪人， 传当前经纪人：broker.erp_broker_id， 没有就传 0
          type: 'checkDealRent',
        }
      }
      this.$store.dispatch('im/goChat', {
        to: 'b_' + (receiverUid || brokerId),
        houseInfo
      })
    },
    async keyNav (url) {
      // 是否开启定位拦截
      let tmp_info = { "mod": "app", "fun": "actCheckPermission", "val": { "pid": "location" } };
      if (this.$commonUtils.utilCore.getSys() != 'IOS') {//如果是安卓
        tmp_info.val.pid = 'android.permission.ACCESS_FINE_LOCATION';
        // tmp_info.val.pid = 'android.permission.ACCESS_MOCK_LOCATION';
      }
      let tmp_info_res = await this.$store.dispatch('app/actModFun', { messageAct: this.$messageAct, jsonData: tmp_info });
      if (tmp_info_res != 1) {
        this.$commonUtils.utilCore.showToast("请开启定位")
        return
      }
      // window.location.href = (url)
      this.toolsGoPageView({
        path: '/common/web-detail',
        query: { url: encodeURIComponent(url), title: this.$route.query.address },
      });
    },
    onClickLeft () {
      this.$router.go(-1);//返回上一层
    },
  }
}
</script>

<style lang="scss" scoped>
.map-route-detail-wrap {
  margin: 0 !important;
}
.house-main {
  position: relative;
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
</style>

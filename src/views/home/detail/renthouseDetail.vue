<template>
  <div class="detail">
    <gni-nav-bar @onClickLeft="onClickBack" :pageTitle="headTitle" :hideRight="false">
      <template slot="slot-right">
        <div class="nav-right">
          <div class="icon-chat" @click="goIm()">
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_chat01.png'" alt="">
            <div :class="unread>9?'tips-chat':'tips-chat-single'" v-if="unread">{{unread > 99 ? '99+' : unread}}</div>
            <!-- 消息数暂时没有对接 -->
          </div>
          <div class="icon-share" @click="isShare=true">
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_share03.png'" alt="">
          </div>
        </div>
      </template>
    </gni-nav-bar>
    <div class="wrapper" v-show="isInit">
      <div class="swipe">
        <!-- VR -->
        <van-swipe style="height: 5.2rem;" v-if="swiperIndex === 0">
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
          <van-swipe-item v-for="(item, index) in picturesList" :key="index" @click="handleShowPreview(picturesList,'picturesIndex')">
            <!-- <img :src="item.picture" alt=""> -->
            <img :src="toolsGetWebStaticUrl(item)" @error="toolsGetErrorHouseImage($event,1)" alt="" class="object-cover">
          </van-swipe-item>
          <template v-if="!picturesList.length">
            <van-swipe-item>
              <img :src="$appConfig.appWebStaticUrl + 'common/house-shooting.png'" alt="" class="object-cover">
            </van-swipe-item>
          </template>
          <template #indicator>
            <div class="custom-indicator" v-show="picturesList.length">{{picturesList.length ? (picturesIndex + 1) : picturesIndex}}/{{picturesList.length}}</div>
          </template>
        </van-swipe>
        <!-- 户型 -->
        <van-swipe autoplay="5000" style="height: 5.2rem;" v-if="swiperIndex === 2" @change="handleSwipeChange($event, 'houseTypeIndex')" :initial-swipe="houseTypeIndex">
          <van-swipe-item v-for="(item, index) in houseTypeImg" :key="index" @click="handleShowPreview(houseTypeImg,'houseTypeIndex')">
            <img :src="toolsGetWebStaticUrl(item)" @error="toolsGetErrorHouseImage($event,1)" alt="" class="object-cover">
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
        <div class="title-price">
          <div class="title-left">
            <div class="left-price">{{rent_price_name}}</div>
            <div>元/月</div>
          </div>
          <div class="title-right" @click="handleCollection">
            <div class="right-collection" :class="{'collectioned':isCollection}">{{!isCollection?'关注':'已关注'}}</div>
          </div>
        </div>
        <div class="title">{{headTitle}}</div>
        <div class="title-information">
          <div class="title-item" style="width:1.1rem;">
            <div class="item-top">{{houseInfo.house_orientation_name}}</div>
            <div class="item-bottom">朝向</div>
          </div>
          <div class="title-item" style="width:2rem;">
            <div class="item-top">{{houseInfo.acreage_name || '0m²'}}</div>
            <div class="item-bottom">面积</div>
          </div>
          <div class="title-item" style="width:1.5rem;">
            <div class="item-top">{{houseInfo.floor_name}}</div>
            <div class="item-bottom">楼层</div>
          </div>
          <div class="title-item flex-1">
            <div class="item-top">{{extend.rent_live_name}}</div>
            <div class="item-bottom">入住</div>
          </div>
        </div>
        <!-- 2022/8/2 杨哥需求 -->
        <!-- <div class="tips-box" v-if="(chatCustomerInfo.rent_remark || chatCustomerInfo.user_id) && houseInfo.is_69">
          <div class="tips-text">
            <span v-html="chatCustomerInfo.rent_remark"></span>
            <span class="contact-btn" @click="goChat(chatCustomerInfo, 1)" v-if="chatCustomerInfo.user_id">联系客服</span>
          </div>
        </div> -->
        <div class="house-label">
          <div class="label-item" v-for="(item,index) in houseLabel" :key="index">{{item.tag_name}}</div>
        </div>
        <!-- <div class="address-navigation">
          <div class="address-item">
            <div class="address-item-title">
              <span>位于{{uptown.uptown_address}}</span>
            </div>
            <div>距离{{defaultAddress}}地铁站{{defaultDistance}}米</div>
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_distance01.png'" alt="">
          </div>
          <div class="address-item">
            <div class="address-item-title">
              <span>设置地址</span>
            </div>
            <div>设置工作/常用地址查看交通路线</div>
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_setaddress02.png'" alt="">
          </div>
        </div> -->
        <div class="specific-information">
          <div class="specific-cell" @click="toolsGoPageView({path: '/home/detail/housevillage',query:{id:houseInfo.uptown_id,housetype:'1', longitude, latitude,cityId:houseInfo.site_id}})">
            <div class="cell-left">
              小区：<span>{{uptown.uptown_name}}</span>
            </div>
            <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
          </div>
          <div class="specific-cell">
            <div class="cell-left">
              租期：<span>{{extend.rent_time_name}}</span>
            </div>
            <div class="cell-right" @click="goChat(broker)">
              咨询租期
              <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
            </div>
          </div>
          <div class="specific-cell">
            <div class="cell-left">
              看房：<span>{{extend.house_see_name }}</span>
            </div>
            <!-- 杨哥说暂时先跳转聊天，本来得跳转预约页面的，这版先不上 toolsGoPageView({path:'/home/detail/appointmenthouse'}) -->
            <div class="cell-right" @click="goAppointment">
              预约看房
              <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
            </div>
          </div>
          <div class="specific-cell">
            <div class="cell-left">
              维护时间：<span>{{houseInfo.maintenance_time_name}}</span>
            </div>
          </div>
        </div>
        <!-- 房源简介1电视2冰箱3洗衣机4空调5热水器6床7暖气8宽带9衣柜10天然气 -->
        <!-- 2023.6.16 小林需求（租房的家私家电不显示） -->
        <!-- <div class="house-introduction">
          <div class="introduction-title">房源简介</div>
          <div class="introduction-container">
            <div class="introduction-item" v-if="getEquipment(4) == 1">
              <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_air01.png'" alt="">
              <div class="item-num">空调 ({{getEquipment(4)}})</div>
            </div>
            <div class="introduction-item" v-else>
              <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_air02.png'" alt="">
              <div class="item-num item-null">空调 ({{getEquipment(4)}})</div>
            </div>
            <div class="introduction-item" v-if="getEquipment(1) == 1">
              <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_tv01.png'" alt="">
              <div class="item-num">电视 ({{getEquipment(1)}})</div>
            </div>
            <div class="introduction-item" v-else>
              <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_tv02.png'" alt="">
              <div class="item-num item-null">电视 ({{getEquipment(1)}})</div>
            </div>
            <div class="introduction-item" v-if="getEquipment(2) == 1">
              <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_refrigerator01.png'" alt="">
              <div class="item-num">冰箱 ({{getEquipment(2)}})</div>
            </div>
            <div class="introduction-item" v-else>
              <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_refrigerator02.png'" alt="">
              <div class="item-num item-null">冰箱 ({{getEquipment(2)}})</div>
            </div>
            <div class="introduction-item" v-if="getEquipment(5) == 1">
              <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_heater01.png'" alt="">
              <div class="item-num">热水器 ({{getEquipment(5)}})</div>
            </div>
            <div class="introduction-item" v-else>
              <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_heater02.png'" alt="">
              <div class="item-num item-null">热水器 ({{getEquipment(5)}})</div>
            </div>
            <div class="introduction-item" v-if="getEquipment(3) == 1">
              <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_washing01.png'" alt="">
              <div class="item-num">洗衣机 ({{getEquipment(3)}})</div>
            </div>
            <div class="introduction-item" v-else>
              <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_washing02.png'" alt="">
              <div class="item-num item-null">洗衣机 ({{getEquipment(3)}})</div>
            </div>
            <div class="introduction-item introduction-item-second" v-if="getEquipment(10) == 1">
              <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_gas01.png'" alt="">
              <div class="item-num">天然气 ({{getEquipment(10)}})</div>
            </div>
            <div class="introduction-item introduction-item-second" v-else>
              <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_gas02.png'" alt="">
              <div class="item-num item-null">天然气 ({{getEquipment(10)}})</div>
            </div>
            <div class="introduction-item" v-if="getEquipment(6) == 1">
              <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_bed01.png'" alt="">
              <div class="item-num">床 ({{getEquipment(6)}})</div>
            </div>
            <div class="introduction-item" v-else>
              <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_bed02.png'" alt="">
              <div class="item-num item-null">床 ({{getEquipment(6)}})</div>
            </div>
            <div class="introduction-item" v-if="getEquipment(9) == 1">
              <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_wardrobe01.png'" alt="">
              <div class="item-num">衣柜 ({{getEquipment(9)}})</div>
            </div>
            <div class="introduction-item" v-else>
              <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_wardrobe02.png'" alt="">
              <div class="item-num item-null">衣柜 ({{getEquipment(9)}})</div>
            </div>
            <div class="introduction-item" v-if="getEquipment(8) == 1">
              <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_wifi01.png'" alt="">
              <div class="item-num">WIFI ({{getEquipment(8)}})</div>
            </div>
            <div class="introduction-item" v-else>
              <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_wifi02.png'" alt="">
              <div class="item-num item-null">WIFI ({{getEquipment(8)}})</div>
            </div>
          </div>
        </div> -->
        <!-- <div class="split-line"></div> -->
        <!-- <div class="appointment-key">
          <div class="appointment-key-left">
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_appointment.png'" alt="">
            <span>钥匙房源 随时看房</span>
          </div>
          <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
        </div> -->
        <!-- <div class="split-line" v-show="villageDealList.length"></div>
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
              <div class="deal-item-right">{{item.trade_amount}}元</div>
            </div>
          </div>
        </div> -->
        <div class="split-line"></div>
        <div class="periphery-map">
          <div class="title">
            <div class="left">周边配套及通勤</div>
            <div class="right" @click="goNewMapPosition">
              <span>查看更多</span>
              <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
            </div>
          </div>
          <div @click="goChat(broker)" class="school-information">
            学校信息：<span>咨询经纪人中小学情况</span>
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_consulting.png'" alt="">
          </div>
          <div class="map-container relative" @click="goNewMapPosition">
            <div class="addressRadius absolute"></div>
            <div class="addressBox text-center px-2 py-1 absolute" v-if="setTextStr([houseInfo.site_name,uptown.uptown_name])">
              <div class="max-w-48 ellipsis">
                {{ setTextStr([houseInfo.site_name,uptown.uptown_name]) }}
              </div>
              <p class="distanceText max-w-48 ellipsis" v-if="surroundingPositionData.length">距{{surroundingPositionData[0].name}}{{surroundingPositionData[0].distance}}米</p>
              <div class="addressInner absolute"></div>
            </div>
            <img :src="mapImage" v-if="mapImage">
          </div>
          <div class="periphery-around">
            <div class="periphery-title">
              <div class="periphery-title-item" v-for="(item,index) in nearbyAround" :key="index" @click="clickSurroundingPosition(item, index)" :class="nearbyTypeIndex == index ? 'around-active' : ''">
                {{item}}
                <img :src="$appConfig.appWebStaticUrl + '/home/icon_line.png'" alt="" v-show="nearbyTypeIndex == index">
              </div>
            </div>
            <div class="periphery-in">
              <div class="periphery-in-item" v-for="(item,index) in nearbyTabTags[nearbyType]" :key="index" :class="item == nearbyTabText?'vehicle-active':''" @click="handleSelectTag(item)">{{item}}</div>
            </div>

            <!-- <div
                v-for="(val, key) in tabTags[type]"
                :key="key"
                :class="val === tabText ? 'active2' : ''"
                class="tabs-col"
                @click="handleSelectTag(val)">
                <div :class="val === tabText ? 'text_207FEF' : 'text-black'">
                  {{ val }}
                </div>
              </div> -->

            <div class="periphery-in-detail">
              <template v-if="!isLoading">
                <div class="detail-item" v-for="(item,index) in surroundingPositionData" :key="index">
                  <img :src=" $appConfig.appWebStaticUrl + '/home/icon_education.png'" alt="" v-if="nearbyTypeIndex==0">
                  <img :src=" $appConfig.appWebStaticUrl + '/home/icon_hospital.png'" alt="" v-if="nearbyTypeIndex==1">
                  <img :src=" $appConfig.appWebStaticUrl + '/home/icon_subway.png'" alt="" v-if="nearbyTypeIndex==2 && nearbyTabText== '地铁'">
                  <img :src="$appConfig.appWebStaticUrl + '/home/icon_bus.png'" alt="" v-if="nearbyTypeIndex==2 && nearbyTabText== '公交'">
                  <img :src=" $appConfig.appWebStaticUrl + '/home/icon_life.png'" alt="" v-if="nearbyTypeIndex==3">
                  <img :src=" $appConfig.appWebStaticUrl + '/home/icon_arder.png'" alt="" v-if="nearbyTypeIndex==4">
                  <div class="address">{{item.name}}</div>
                  <div class="distance">直线 {{getDistance(item.distance)}}km</div>
                </div>
                <div class="no-empty" v-show="!surroundingPositionData.length">
                  暂无数据
                </div>
              </template>
              <div class="flex justify-center pb-3" v-else>
                <van-loading size="0.28rem">加载中...</van-loading>
              </div>
            </div>
          </div>
          <div class="more-information pb-3" v-show="surroundingPositionData.length" @click="goNewMapPosition">
            更多
            <!-- <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt=""> -->
            <van-icon name="arrow-down" style="paddingLeft:0.05rem" />
          </div>
        </div>
        <div class="split-line" v-show="brokerList.length"></div>
        <div class="recommend" v-show="brokerList.length">
          <div class="recommend-title">推荐经纪人</div>
          <div class="recommend-broker">
            <div class="borker-container" v-for="(item, index) in brokerList" :key="index">
              <div class="broker-header">
                <img :src="item.avatar?item.avatar:$appConfig.appWebStaticUrl + '/common/icon_avatar.png'" alt="">
              </div>
              <div class="broker-name">
                <div class="name">{{item.broker_name}}</div>
                <div class="name-label">房源熟悉度:</div>
              </div>
              <div class="broker-progress">
                <van-progress :percentage="item.familiarity_percent && item.familiarity_percent.substr(0,item.familiarity_percent.length-1)" stroke-width="0.2rem" :track-color="'#EFEFEF'" />
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
          </div>
        </div>
        <div class="split-line"></div>
        <div class="recommended-house" v-show="recommendList.length>0">
          <div class="recommended-title">猜您喜欢</div>
          <div class="recommended-subtitle">推荐租房</div>
          <houselistItem :list="recommendList" @goDetail="goRentRecommend"></houselistItem>
          <div class="morehouse-btn" @click="toolsGoPageView({path:'/home/list/renthouseList', query: {isUpdate: 1,uptown_id:houseInfo.uptown_id}})">查看更多</div>
        </div>
      </div>
    </div>
    <div class="footer-broker" v-show="isInit">
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
      <div class="image-return" v-if="showPreview">
        <div class="return-btn" @click="showPreview=false">返回</div>
      </div>
    </div>
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
      brokerList: [],// 经纪人列表
      recommendList: [], // 推荐租房列表
      defaultDistance: '', // 默认距离
      defaultAddress: '', // 默认地址
      // mapImage: '',//地图图片
      nearbyAround: ["教育", "医院", "交通", "生活", "休闲"], // 周边地方
      nearbyType: "教育",
      nearbyTypeIndex: 2, // 周边索引
      surroundingPositionData: [], // 周边距离列表
      nearbyTabText: "幼儿园",
      nearbyTabTags: {
        教育: ["幼儿园", "小学", "中学"],
        医院: ["医院"],
        交通: ["地铁线路", "公交车站"],
        生活: ["购物", "银行"],
        休闲: ["旅游景点", "休闲娱乐", "运动健身"],
      },
      uptown: {},// 小区信息
      extend: {},// 楼盘拓展
      pictures_detail: [],// 图片(有具体信息，拍摄日期以及拍摄者)
      picturesList: [],  // 单纯轮播图的图片
      houseInfo: {},//楼盘信息
      headTitle: '',
      isShare: false, // 分享弹窗
      isCollection: false, // 收藏
      // swiperTab: [
      //   {
      //     text: 'VR'
      //   },
      //   {
      //     text: '图片'
      //   },
      //   {
      //     text: '户型'
      //   }
      // ],
      around: ["教育", "医院", "交通", "生活", "休闲"], // 周边地方
      // vehicle: ["地铁", "公交"],  // 交通工具
      vehicle: [],  // 交通工具
      peripheryDetail: [
        // {
        //   address: '公园前西门口总站（26路；12路）',
        //   distance: '0.2'
        // },
      ],
      vehicleIndex: 0, //交通下标
      houselist: [
        {
          id: 1,
          title: '丽江花丽江花园华林居 3室1厅',
          subtitle: '越秀区/3室1厅/105.11㎡/西北',
          label: [
            {
              text: '精装修',
            },
            {
              text: '期房在售',
            }
          ],
          left: '228',
        },
      ],
      houseLabel: [],// 楼盘标签
      houseId: '', // 房源id
      brokerId: '', // 经纪人id
      shareBrokerId: '', // 经纪人id

      picturesIndex: 0,
      pictureInfoList: [], // 图片具体的信息(客厅)
      pictureInfoListIndex: 0,
      vrImg: [],//vr图片
      houseTypeImg: [],//户型图片
      houseTypeIndex: 0,// 户型图片索引
      swiperTab: [],// 图片类型切换
      swiperIndex: 1, // 轮播图的类型切换 VR等等

      // 图片预览
      showPreview: false,
      previewImages: [],
      bigIndexImg: 0, //大图展示下标
      previewKey: "",
      chatCustomerInfo: {}, //客服信息
      houseCity: "", //房源城市id
      previewTitle: '', // 大图标题（客厅等等）
      cityId: "",
      isLoading: false,
      isBack: false,
      villageDealList: [], //小区成交数据
      villageDealTotal: 0, // 小区成交总数
      postGetData: { //小区列表
        houseType: "rent",//房源类型（sale 二手房，house 新房，rent 租房）
        searchUptownId: "",//
        setHuxing: "",//
        setLayouthall: "",//
        inputKeyWord: "",
        city_id: 8,//	否	string	城市id 默认8
        page: 1,//	否	string	页码 默认1
        page_size: 3,//	否	string	每页显示数 默认10
      },
      isInit: false,
    }
  },
  // 监听
  watch: {
    isLogin (val) {
      if (val) {
        this.getFavoriteStatus();
      }
    },
    $route: {
      async handler (val) {
        // 本详情跳本详情
        if (this.isBack && val.name === "/home/detail/renthouseDetail" && this.$route.meta.canKeep) {
          window.removeEventListener("popstate", this.handleClosePreview, false);
          this.$route.meta.canKeep = true;
          window.scroll(0, 0);
          setTimeout(() => {
            window.scroll(0, 1);
          }, 100);
          this.initDataState();
          this.houseId = this.$route.query.id || "";
          this.brokerId = this.$route.query.broker_id || "";
          this.shareBrokerId = this.$route.query.share_broker_id || "";
          this.cityId = this.$route.query.city_id || "";
          //初始化登陆的状态
          await this.init();
        }
      },
      deep: true,
      immediate: false,
    }
  },
  computed: {
    ...mapState('im', ['unread']),
    ...mapState("user", ["userToken", "userInfo", "isLogin"]), //用户Token,用户登陆信息
    ...mapState("city", ["geoPosition", "thisCityInfo", "switchCityInfo", "cityInfoRows"]), //城市的信息 可能用到
    rent_price_name () {
      if (this.houseInfo.rent_price_name && this.houseInfo.rent_price_name.indexOf('元/月') != -1) {
        return this.houseInfo.rent_price_name.substr(0, this.houseInfo.rent_price_name.length - 3)
      }
      return '';
    },
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
      this.houseId = this.$route.query.id || "";
      // this.houseId = "81331";
      this.brokerId = this.$route.query.broker_id || "";
      this.shareBrokerId = this.$route.query.share_broker_id || "";
      this.cityId = this.$route.query.city_id || "";
      //初始化登陆的状态
      await this.init();
    }, 500)
  },
  async activated () {
    window.removeEventListener("popstate", this.handleClosePreview, false);
    if (this.isBack) {
      window.scroll(0, 0);
      setTimeout(() => {
        window.scroll(0, 1);
      }, 100);
      this.initDataState();
      this.houseId = this.$route.query.id || "";
      this.brokerId = this.$route.query.broker_id || "";
      this.shareBrokerId = this.$route.query.share_broker_id || "";
      this.cityId = this.$route.query.city_id || "";
      //初始化登陆的状态
      await this.init();
    }
    this.isBack = true;
  },
  destroyed () {
    window.removeEventListener("popstate", this.handleClosePreview, false);
  },
  methods: {
    ...mapActions('app', ['getShareApp']),
    ...mapActions("home", ["rentDetail", "", "nearbyGetField", "nearbyGetIndex", "appFangRentListRecommend", "getAppWechatNearbyGetRecommendBroker"]),
    // 初始化
    async init () {
      if (!this.$commonUtils.utilCore.empty(this.houseId)) {
        if (this.isLogin) {
          this.getFavoriteStatus();
        }
      }
      await this.getDetail();// 获取详情
      this.getChatCustomer();
      await this.getDefaultDistance();//
      // await this.getMap();// 获取地图图片
      await this.getAmbitusField();// 获取周边标题列表
      await this.clickSurroundingPosition(); //  获取周边内容列表
      await this.getRecommendList(); // 获取推荐租房列表
      // await this.getVillageDeal(); // 获取同小区成交数据
    },
    // 初始化data变量
    initDataState () {
      this.longitude = '';// 房源经度
      this.latitude = '';// 房源纬度
      this.broker = {}; // 获取该楼盘的经纪人信息
      this.brokerList = [];// 经纪人列表
      this.recommendList = []; // 推荐租房列表
      this.defaultDistance = ''; // 默认距离
      this.defaultAddress = ''; // 默认地址
      this.nearbyAround = ["教育", "医院", "交通", "生活", "休闲"]; // 周边地方
      this.nearbyType = "教育";
      this.nearbyTypeIndex = 2; // 周边索引
      this.surroundingPositionData = []; // 周边距离列表
      this.nearbyTabText = "幼儿园";
      this.nearbyTabTags = {
        教育: ["幼儿园", "小学", "中学"],
        医院: ["医院"],
        交通: ["地铁线路", "公交车站"],
        生活: ["购物", "银行"],
        休闲: ["旅游景点", "休闲娱乐", "运动健身"],
      };
      this.uptown = {};// 小区信息
      this.extend = {};// 楼盘拓展
      this.pictures_detail = [];// 图片(有具体信息，拍摄日期以及拍摄者)
      this.picturesList = [];  // 单纯轮播图的图片
      this.houseInfo = {};//楼盘信息
      this.headTitle = '';
      this.isShare = false; // 分享弹窗
      this.isCollection = false; // 收藏
      this.around = ["教育", "医院", "交通", "生活", "休闲"];// 周边地方
      this.vehicle = []; // 交通工具
      this.peripheryDetail = [];
      this.vehicleIndex = 0; //交通下标
      this.houselist = [
        {
          id: 1,
          title: '丽江花丽江花园华林居 3室1厅',
          subtitle: '越秀区/3室1厅/105.11㎡/西北',
          label: [
            {
              text: '精装修',
            },
            {
              text: '期房在售',
            }
          ],
          left: '228',
        },
      ];
      this.houseLabel = [];// 楼盘标签
      this.houseId = ''; // 房源id
      this.brokerId = ''; // 经纪人id
      this.shareBrokerId = ''; // 经纪人id

      this.picturesIndex = 0;
      this.pictureInfoList = []; // 图片具体的信息(客厅)
      this.pictureInfoListIndex = 0;
      this.vrImg = [];//vr图片
      this.houseTypeImg = [];//户型图片
      this.houseTypeIndex = 0;// 户型图片索引
      this.swiperTab = [];// 图片类型切换
      this.swiperIndex = 1; // 轮播图的类型切换 VR等等

      // 图片预览
      this.showPreview = false;
      this.previewImages = [];
      this.bigIndexImg = 0; //大图展示下标
      this.previewKey = "";
      this.chatCustomerInfo = {}; //客服信息
      this.houseCity = ""; //房源城市id
      this.previewTitle = ''; // 大图标题（客厅等等）
      this.cityId = "";
      this.isLoading = false;
    },
    // 获取房源简介的数量
    getEquipment (type) {
      if (this.extend.equipment_ids && this.extend.equipment_ids.split(",") && this.extend.equipment_ids.split(",").includes(type.toString())) {
        return 1;
      } else {
        return 0;
      }
    },
    // 获取详情
    async getDetail () {
      this.isInit = false
      this.$commonUtils.utilCore.showLoading();
      this.picturesList = []
      this.pictureInfoList = []
      this.swiperTab = [];
      this.vrImg = [];
      let res = await this.rentDetail({ id: this.houseId, share_broker_id: this.shareBrokerId });
      if (res) {
        this.headTitle = res.data && res.data.rent_title;
        this.pictures_detail = res.pictures_detail;
        // this.picturesList = res.pictures
        this.houseInfo = res.data;
        this.longitude = this.houseInfo.longitude;
        this.latitude = this.houseInfo.latitude;
        this.extend = res.extend;
        this.uptown = res.uptown;
        this.broker = res.broker;
        this.pictureInfoList = res.picture_info || []
        this.previewTitle = this.pictureInfoList.length > 0 ? this.pictureInfoList[0].name : ''
        this.houseLabel = [];
        this.houseTypeImg = [this.houseInfo.huxing_picture] || [];
        this.brokerList = res.data.brokers || []; // 推荐经纪人 2023.7.13 推荐经纪人放在详情接口里，不单独调取接口获取
        this.houseCity = res.data.site_id;
        this.pictureInfoList.forEach((item, index) => {
          item.url.forEach((item, index) => {
            this.picturesList.push(item)
          })
        })
        for (let i in this.houseInfo.tags) {
          this.houseLabel.push(this.houseInfo.tags[i])
        }
        const imgIds = [];
        if (this.extend.vr_url) {
          this.swiperTab.push({
            text: 'VR',
            index: 0,
          });
          imgIds.push(0);
          this.vrImg.push({
            img: this.houseInfo.picture,
            url: this.extend.vr_url,
          });
        }
        // 图片
        if (this.picturesList.length) {
          this.swiperTab.push({
            text: '图片', index: 1
          });
          imgIds.push(1);
        }
        if (this.houseInfo.huxing_picture.length) {
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
    // 地图定位
    goMapPosition () {
      const param = {};
      param.longitude = this.longitude;
      param.latitude = this.latitude;
      param.address = this.headTitle;
      param.label = this.nearbyType;
      param.tag = this.nearbyTabText;

      this.toolsGoPageView({ path: "/home/map/position", query: param });
    },
    // 2022/10/11 新地图函数
    goNewMapPosition () {
      const param = {}
      param.longitude = this.longitude;
      param.latitude = this.latitude;
      param.userId = this.isLogin ? this.userInfo.user_uid : '0';
      param.houseId = this.houseId;
      param.houseType = 2;
      param.cityId = this.houseInfo.site_id
      param.isLogin = this.isLogin ? '1' : '0';
      param.isBroker = '0';
      param.address = this.uptown.uptown_name;
      param.receiverUid = this.broker.erp_broker_id;
      param.brokerPhone = this.broker.telephone;
      param.platform = 'uapp';
      param.label = this.nearbyType || "";
      param.tag = this.nearbyTabText;
      //地图分享该房源所需的参数
      param.share_url = this.houseInfo.share_url;
      param.brokerId = this.broker.broker_id;
      param.picture = this.houseInfo.picture;
      param.shareBrokerId = this.shareBrokerId
      param.district_name = this.houseInfo.district_name
      param.block_name = this.houseInfo.block_name
      param.price_name = this.houseInfo.rent_price_name
      // 跳转经纪人聊天所需参数
      param.layout_short_name = this.houseInfo.layout_short_name
      param.house_orientation_name = this.houseInfo.house_orientation_name
      param.decoration_name = this.houseInfo.decoration_name
      param.acreage_cover = this.houseInfo.acreage_name
      console.log('参数', param);
      this.toolsGoPageView({ path: "/home/map/newmap", query: param });
    },
    // 轮播图滑动下标
    handleSwipeChange (e, dataKey) {
      this[dataKey] = e;
    },
    // 获取是否关注
    async getFavoriteStatus () {
      if (!this.isLogin) return;
      const postData = {
        city_id: this.cityId || this.switchCityInfo.city_id || this.thisCityInfo.city_id,//	是	string	城市id
        resource_id: this.houseId,//	是	string	资源id
        resource_type: "2",//	是	string	资源类型id 1:二手房，2：租房，3：新房，4：小区，5：经纪人
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
        resource_type: "2",//	是	string	资源类型id 1:二手房，2：租房，3：新房，4：小区，5：经纪人
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
        resource_type: "2",//	是	string	资源类型id 1:二手房，2：租房，3：新房，4：小区，5：经纪人
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
    // 获取地图图片
    getMap () {
      // const center = this.$commonUtils.utilCore.bd_decrypt(this.houseInfo.longitude, this.houseInfo.latitude); // 百度转高德
      // this.mapImage =
      //   "https://restapi.amap.com/v3/staticmap?&zoom=15&location=" +
      //   center.longitude +
      //   "," +
      //   center.latitude +
      //   "&key=5435a15f6d89ad31779b1c136ace61fc";
    },
    // 获取租房列表
    async getRecommendList () {
      let param = {
        page_size: 10,
        id: this.houseId
      }
      const res = await this.appFangRentListRecommend(param);
      if (res) {
        this.recommendList = res && res.rows || [];
      }
    },
    // 获取当前房源的默认第一个的距离地铁站的距离
    async getDefaultDistance () {
      let param = {
        longitude: this.houseInfo.longitude,
        latitude: this.houseInfo.latitude,
        type: '交通',
        tag: '地铁',
      }
      const res = await this.nearbyGetIndex(param);
      if (!this.$commonUtils.utilCore.empty(res)) {
        this.defaultDistance = res[0].distance;
        this.defaultAddress = res[0].name;
        this.peripheryDetail = res;
      }
    },
    // 获取周边位置 大类
    async getAmbitusField () {
      const res = await this.nearbyGetField({});
      this.nearbyAround = this.nearbyTabTags = [];
      this.nearbyTypeIndex = 2;
      if (res) {
        this.$nextTick(() => {
          for (let key in res) {
            this.nearbyAround.push(key);
          }
          this.nearbyType = this.nearbyAround[this.nearbyTypeIndex];
          this.nearbyTabTags = res;
          this.nearbyTabText = this.nearbyTabTags[this.nearbyType][0];

          // const arrKey = Object.keys(res);
          // const middleNum = parseInt((arrKey.length + 1) / 2) - 1; //获取中位数
          // // this.aroundIndex = arrKey[middleNum];
          // this.vehicle = res[arrKey[middleNum]];
          // this.vehicleIndex = 0;
        });
      }
    },
    // 获取周边位置信息
    async clickSurroundingPosition (type, index = 2, isTab = false) {
      if (this.isLoading) return;
      this.surroundingPositionData = [];
      const param = {};
      this.nearbyType = type || this.nearbyType;
      if (!isTab) {
        this.nearbyTabText = (this.nearbyTabTags[type] || this.nearbyTabTags[this.nearbyType])[0];
      }
      this.nearbyTypeIndex = index;
      param.longitude = this.houseInfo.longitude;
      param.latitude = this.houseInfo.latitude;
      param.type = this.nearbyType;
      param.tag = this.nearbyTabText;
      this.isLoading = true;
      const res = await this.nearbyGetIndex(param);
      this.isLoading = false;
      if (res) {
        this.surroundingPositionData = (res || []).map((item) => {
          return {
            ...item,
            distanceNum: Math.ceil(item.distance / 100) / 10,
          };
        });
      }
    },
    // 位置及周边的tag点击
    handleSelectTag (val) {
      if (this.isLoading) return;
      this.nearbyTabText = val;
      this.clickSurroundingPosition(this.nearbyType, this.nearbyTypeIndex, true);
    },
    // 跳转聊天
    goChat (broker, type) {
      if (!this.isLogin) return location._fromCommission = 1, this.toolsGoPageView({ path: '/common/index', query: { fromCommission: true, path: '/user/index' } });
      if (JSON.stringify(broker) === "{}") return this.$commonUtils.utilCore.showToast("数据初始化中，请稍后再试");
      let houseInfo = {
        // 这里写 房源消息的内容
        rent_id: this.houseId,//->  二手房id, 应该是pc的房源id
        rent_title: this.headTitle,//->  标题
        rent_price: this.rent_price_name, // 价格
        layout_dname: this.houseInfo.layout_short_name,//->  房型室
        house_orientation_name: this.houseInfo.house_orientation_name,//->  房屋朝向
        decoration_name: this.houseInfo.decoration_name,//->  装修类型
        acreage: this.houseInfo.acreage_cover,//->  建筑面积
        preview_url: this.houseInfo.picture || (this.$appConfig.appWebStaticUrl + 'common/house.png'),//->  图片地址
        share_broker_id: this.shareBrokerId || 0,//-> 分享经纪人， 传当前经纪人：broker.erp_broker_id， 没有就传 0
      }
      // let houseInfo = null;

      this.$store.dispatch('im/goChat', {
        to: 'b_' + (!type ? broker.erp_broker_id : broker.user_id),
        houseInfo
      })
    },

    // 跳转房源分享
    goShareChat () {
      let houseInfo = {
        // 这里写 房源消息的内容
        rent_id: this.houseId,//->  二手房id, 应该是pc的房源id
        rent_title: this.headTitle,//->  标题
        rent_price: this.rent_price_name, // 价格
        layout_dname: this.houseInfo.layout_short_name,//->  房型室
        house_orientation_name: this.houseInfo.house_orientation_name,//->  房屋朝向
        decoration_name: this.houseInfo.decoration_name,//->  装修类型
        acreage: this.houseInfo.acreage_cover,//->  建筑面积
        preview_url: this.houseInfo.picture || (this.$appConfig.appWebStaticUrl + 'common/house.png'),//->  图片地址
        share_broker_id: this.shareBrokerId || 0,//-> 分享经纪人， 传当前经纪人：broker.erp_broker_id， 没有就传 0
      }
      this.$store.dispatch('im/goChatShare', houseInfo)
    },

    // 分享给朋友、朋友圈; type=0 分享到聊天界面
    async handleShare (type = 0) {
      // const href = this.$commonUtils.utilCore.url(this.houseInfo.share_url, {
      //   id: this.houseId, fromShare: 1, city_id: (this.switchCityInfo.city_id || this.thisCityInfo.city_id), broker_id: this.brokerId, share_broker_id: this.shareBrokerId
      // })
      const href = this.houseInfo.share_url + "/" + (this.brokerId || this.shareBrokerId);
      let shareInfo = {
        type: 0,
        summary: "[租房]",
        imageUrl: this.toolsGetWebStaticUrl(this.houseInfo.picture),
        href,
      };
      if (type === 0) {
        const { user_type = 1, user_id = "", user_row = { extend: { nickname: "" } } } = this.userInfo;
        const url = `/pages/card/rent/detail`;
        const path = this.$commonUtils.utilCore.url(url, {
          id: this.houseId,
          broker_id: this.brokerId,//this.userInfo.uid,
          isBrokerShare: 0,
          share_broker_id: this.shareBrokerId,//this.userInfo.uid

          share_user_type: user_type,// 分享来源用户类型(1:用户,2:经纪人)  
          share_user_id: user_id,// 分享来源用户ID 
          share_username: user_row.extend.nickname,// 分享来源用户名 

          share_resource_type: '2',//  分享资源类型(1:二手房,2:租房,3:新房,4:小区,5:经纪人,6:动态,7:官网,8:获客文章,10:小程序,11:个人海报,12:房源海报,13:配图海报,14:获客文章海报,15:微信分享,16:微信朋友圈) 
          share_resource_id: this.houseId,// 分享资源ID  
          share_resource_name: this.headTitle,// 分享资源名称 
        });
        shareInfo = {
          type: 5,
          imageUrl: this.toolsGetWebStaticUrl(this.houseInfo.picture),
          miniProgram: {
            id: 'gh_cbb5c9d6827f',
            path,
            type: 0,
            webUrl: 'https://napp.yfdc.net'
          }
        }
      }
      const shareData = await this.getShareApp({
        messageAct: this.$messageAct,
        jsonData: {
          provider: "weixin",
          title: `【${this.houseInfo.district_name}${this.houseInfo.block_name}】${this.headTitle} ${this.houseInfo.rent_price_name}`,
          scene: type === 0 ? "WXSceneSession" : "WXSceneTimeline",//WXSceneSession	分享到聊天界面;WXSceneTimeline	分享到朋友圈
          ...shareInfo,
        },
      });
    },
    // 关闭预览图片事件
    handleClosePreview () {
      if (!window.history.state) {
        this.onClickBack();
      }
      window.removeEventListener("popstate", this.handleClosePreview, false);
    },
    // 改变大图图片的下标
    hanldImgChange (index) {
      this.bigIndexImg = index;
      if (!this.previewKey) return;
      this[this.previewKey] = index;
      this.pictureInfoList.forEach((item, i) => {
        item.url.forEach((itemurl, indexurl) => {
          if (this.picturesList[index] == itemurl) {
            this.pictureInfoListIndex = i
            this.previewTitle = item.name
            this.setScrollLeft();
            return
          }
        })
      })
    },
    handleShowPreview (arr, indexName) {
      this.previewImages = arr;
      this.previewKey = indexName;
      this.bigIndexImg = this[indexName];
      this.showPreview = true;
      setTimeout(() => {
        this.setScrollLeft();
      }, 300);//300ms动画时间
      window.history.pushState(null, null, null); // 添加一行，组织后退按钮跳转页面
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
    // 推荐租房
    goRentRecommend (v) {
      // this.houseId = v.rent_id
      // this.brokerId = v.broker_id
      // this.bigIndexImg = 0
      // this.picturesIndex = 0
      // this.pictureInfoListIndex = 0
      // this.init()
      this.$route.meta.canKeep = true;
      this.toolsGoPageView({ path: '/home/detail/renthouseDetail', query: { id: v.rent_id, block_id: v.broker_id } });
    },
    // 获取客服
    async getChatCustomer () {
      const postData = {
        city_id: this.houseInfo.share_broker_site_id || this.houseCity || this.switchCityInfo.city_id || this.thisCityInfo.city_id,//	是	string	城市id
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
            resourceType: 2,
            houseId: this.houseId,
            district_id: this.houseInfo.district_id,
            city_id: this.houseInfo.site_id
          }
        }
      )
    },
    // 切换大图标签
    chooseInfo (item, index) {
      this.previewTitle = item.name
      this.pictureInfoListIndex = index
      let chooseIndex = -1
      let pictureData = item.url.find((item, index) => this.picturesList.includes(item))
      chooseIndex = this.picturesList.indexOf(pictureData)
      this.hanldImgChange(chooseIndex)
    },
    // 计算周边配套及通勤 距离字段
    getDistance (val) {
      const value = (Number(val) / 1000).toFixed(1);
      return value || 0;
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
          ex1: "2",//否	string	房源类型 1二手房 2租房
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
    // 获取小区成交数据
    async getVillageDeal () {
      this.postGetData.city_id = this.$route.query.city_id || this.switchCityInfo.city_id || 8
      this.postGetData.searchUptownId = this.houseInfo.uptown_id
      this.postGetData.setHuxing = [{
        id: this.houseInfo.layout_room_id
      }]
      this.postGetData.setLayouthall = this.houseInfo.layout_hall_id
      this.postGetData.inputKeyWord = this.uptown.uptown_name
      let res = await this.$store.dispatch("home/actAppFangDealRentList", this.postGetData);
      if (res) {
        this.villageDealList = res.rows
        this.villageDealTotal = res.total
      }
    },
    // 跳转同小区同户型
    goDealist () {
      this.postGetData.leaseSaleIndex = '2'
      //把数据存在vuex里去
      this.$store.commit('home/setSearchPostGetData', this.postGetData);
      this.toolsGoPageView({ path: '/home/list/dealist' })
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
        display: flex;
        justify-content: space-between;
        left: 50%;
        transform: translateX(-50%);
        span {
          width: 0.76rem;
          height: 100%;
          text-align: center;
          opacity: 0.7;
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
      .title-price {
        padding: 0.3rem 0.26rem 0.15rem 0.48rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title-left {
          font-size: 0.32rem;
          font-weight: bold;
          color: #ff3100;
          display: flex;
          align-items: baseline;
          .left-price {
            font-size: 0.48rem;
          }
        }
        .title-right {
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
        color: #000000;
        padding: 0 0.48rem 0.4rem;
      }
      .title-information {
        margin: 0 0.56rem 0.4rem 0.5rem;
        padding-bottom: 0.32rem;
        display: flex;
        border-bottom: 0.02rem solid #f1f1f1;
        .title-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          .item-top {
            font-size: 0.32rem;
            font-weight: bold;
            color: #ff3100;
            padding-bottom: 0.1rem;
          }
          .item-bottom {
            font-size: 0.24rem;
            font-weight: 400;
            color: #737373;
          }
          &:not(:last-child)::after {
            content: "";
            display: block;
            width: 0.02rem;
            height: 0.7rem;
            background: #f0f0f0;
            position: absolute;
            top: 0.08rem;
            right: 0;
          }
        }
      }
      // .tips-box {
      //   padding: 0 0.42rem 0.4rem 0.4rem;
      //   .tips-text {
      //     font-size: 0.24rem;
      //     font-weight: 400;
      //     color: #ff1000;
      //     line-height: 0.36rem;
      //     padding-bottom: 0.12rem;
      //     .contact-btn {
      //       font-size: 0.24rem;
      //       font-weight: 400;
      //       color: #2087fb;
      //       padding-left: 0.44rem;
      //     }
      //   }
      // }
      .house-label {
        padding: 0 0.48rem 0.4rem 0.5rem;
        display: flex;
        flex-wrap: wrap;
        .label-item {
          width: 1.4rem;
          height: 0.64rem;
          font-size: 0.26rem;
          font-weight: 400;
          color: #000000;
          line-height: 0.64rem;
          text-align: center;
          background: #f8f8f8;
          margin-right: 0.3rem;
          margin-bottom: 0.2rem;
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
        padding: 0 0.52rem 0.62rem 0.5rem;
        .specific-cell {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.32rem;
          .cell-left {
            font-size: 0.32rem;
            font-weight: 400;
            color: #999999;
            span {
              color: #000000;
            }
          }
          .cell-right {
            font-size: 0.32rem;
            font-family: SourceHanSansCN-Normal, SourceHanSansCN;
            font-weight: 400;
            color: #016cff;
            display: flex;
            align-items: center;
          }
          img {
            width: 0.4rem;
            height: 0.4rem;
          }
          &:nth-last-of-type(1) {
            padding-bottom: 0;
          }
        }
      }
      .house-introduction {
        padding: 0 0.24rem 0.02rem 0.48rem;
        .introduction-title {
          font-size: 0.4rem;
          font-family: SourceHanSansCN-Bold, SourceHanSansCN;
          font-weight: bold;
          color: #000000;
          padding-bottom: 0.4rem;
        }
        .introduction-container {
          display: flex;
          flex-wrap: wrap;
          .introduction-item {
            width: 25%;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-bottom: 0.56rem;
            img {
              width: 0.32rem;
              height: 0.34rem;
            }
            .item-num {
              font-size: 0.28rem;
              font-family: SourceHanSansCN-Normal, SourceHanSansCN;
              font-weight: 400;
              color: #111111;
            }
            .item-null {
              color: #737373;
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
        .title {
          padding: 0.4rem 0.3rem 0.46rem 0.5rem;
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
                margin-top: 0.05rem;
                .icon-circular {
                  width: 0.2rem;
                  height: 0.2rem;
                  background: #e5e5e5;
                  border-radius: 50%;
                }
                .icon-line {
                  width: 0.02rem;
                  height: 1rem;
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
      .recommend {
        padding: 0.5rem 0.6rem 0.3rem;
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
      }
      .recommended-house {
        .recommended-title {
          font-size: 0.4rem;
          font-family: SourceHanSansCN-Bold, SourceHanSansCN;
          font-weight: bold;
          color: #000000;
          padding: 0.4rem 0 0.54rem 0.5rem;
        }
        .recommended-subtitle {
          font-size: 0.32rem;
          font-family: SourceHanSansCN-Normal, SourceHanSansCN;
          font-weight: 400;
          color: #000000;
          padding-left: 0.5rem;
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
  .swipe-active {
    background: #ffce09 !important;
    opacity: 1 !important;
  }
  .nearbyAround-active {
    font-weight: bold !important;
    color: #303030 !important;
  }
  .vehicle-active {
    border: 0.02rem solid #ffce09;
    background-color: #fef6d6 !important;
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
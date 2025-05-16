<template>
  <div class="list">
    <div class="fixed-container">
      <div class="header">
        <gni-nav-bar @onClickLeft="onClickBack" :pageTitle="`共找到${houseNum}套房源`" :hideRight="false" :hideLeft="false">
          <template slot="slot-left">
            <div class="icon-return">
              <img :src="$appConfig.appWebStaticUrl + '/maphouse/icon_arrowLeft.png'" alt="">
            </div>
          </template>
        </gni-nav-bar>
      </div>
      <div class="search-condition">
        <van-dropdown-menu active-color="#000000" :close-on-click-outside="false">
          <!-- <van-dropdown-item title="区域" ref="district" :title-class="districtClass" @opened="handleDropdownClone(1)" @close="handleDropdownClone()">
            <div class="house-region">
              <div class="region-content">
                <div class="region-left">
                  <ul>
                    <li @click="selectTabArea(0,'district')" :class="tabAreaIndex == 0 ? 'more-active':''">区域</li>
                    <li @click="selectTabArea(1,'district')" :class="tabAreaIndex == 1 ? 'more-active':''" v-if="districtMetro.length>1">地铁</li>
                  </ul>
                </div>
                <template v-if="tabAreaIndex == 0">
                  <div class="region-middle">
                    <ul>
                      <li v-for="(item,index) in district" :key="index" :class="postGetData.setDistrict && postGetData.setDistrict.hasOwnProperty('id') && postGetData.setDistrict.id== item.id  ? 'more-active':''" @click="chooseDistrict(item,'district')">{{item.name}}</li>
                    </ul>
                  </div>
                  <div class="region-right" ref="scrollRight">
                    <ul>
                      <li v-for="(item,index) in addresslist" :key="index" @click="chooseDistrictAddress(item,'district')">
                        <span :class="checkArrayValue(postGetData.setDistrictList,'id',item.id)==-1?'':'more-active'">{{item.name}}</span>
                        <img :src="$appConfig.appWebStaticUrl + '/home/icon_unselect01.png'" alt="" v-if="checkArrayValue(postGetData.setDistrictList,'id',item.id)==-1">
                        <img :src="$appConfig.appWebStaticUrl + '/home/icon_select01.png'" alt="" v-else>
                      </li>
                    </ul>
                  </div>
                </template>
                <template v-if="tabAreaIndex == 1">
                  <div class="region-middle">
                    <ul>
                      <li v-for="(item,index) in districtMetro" :key="index" :class="postGetData.setDistrictMetro && postGetData.setDistrictMetro.hasOwnProperty('id') && postGetData.setDistrictMetro.id== item.id  ? 'more-active':''" @click="chooseDistrict(item,'district')">{{item.name}}</li>
                    </ul>
                  </div>
                  <div class="region-right" ref="scrollRight">
                    <ul>
                      <li v-for="(item,index) in addresslistMetro" :key="index" @click="chooseDistrictAddress(item,'district')">
                        <span :class="checkArrayValue(postGetData.setDresslistMetro,'id',item.id)==-1?'':'more-active'">{{item.name}}</span>
                        <img :src="$appConfig.appWebStaticUrl + '/home/icon_unselect01.png'" alt="" v-if="checkArrayValue(postGetData.setDresslistMetro,'id',item.id)==-1">
                        <img :src="$appConfig.appWebStaticUrl + '/home/icon_select01.png'" alt="" v-else>
                      </li>
                    </ul>
                  </div>
                </template>

              </div>
              <div class="reset-btn">
                <div class="btn-box">
                  <div class="left" @click="resetFunciton('district')">
                    <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                    <div class="text">重置</div>
                  </div>
                  <div @click="closeDropdownMenu('district')" class="right">确定</div>
                </div>
              </div>
            </div>
          </van-dropdown-item> -->
          <van-dropdown-item :title="optionsIndex==2?'租金':'价格'" ref="priceTab" :title-class="priceTabClass" @opened="handleDropdownClone(1)" @close="handleDropdownClone()">
            <div class="house-price house-type">
              <div class="price-tab">
                <div class="tab-first" @click="selectTabArea(0,'priceTab')" :class="tabPriceIndex == 0?'price-tab-active':''">总价 (万/套)</div>
                <div class="tab-second" @click="selectTabArea(1,'priceTab')" :class="tabPriceIndex == 1?'price-tab-active':''" v-show="optionsIndex != 2">单价 (万/㎡)</div>
              </div>
              <template v-if="tabPriceIndex == 0">
                <div class="type-content price-content">
                  <div class="type-item" v-for="(item,index) in priceTabFirst" :key="index" @click="chooseDistrictAddress(item,'priceTab')" :class="checkArrayValue(postGetData.setPriceTabFirst,'id',item.id) != -1?'type-active':''" v-show="optionsIndex!=2">{{item.name}}</div>
                  <div class="type-price" v-for="(item,index) in priceTabFirst" :key="index" @click="chooseDistrictAddress(item,'priceTab')" :class="checkArrayValue(postGetData.setPriceTabFirst,'id',item.id) != -1?'type-active-price':''" v-show="optionsIndex==2">{{item.name}}</div>
                </div>
                <div class="price-ipt">
                  <input type="number" class="_iosKeyboardInput" v-model="postGetData.setPriceFirstVal[0]" placeholder="最低总价(万)" @keyup="checkPriceInput(0)">
                  <span>至</span>
                  <input type="number" class="_iosKeyboardInput" v-model="postGetData.setPriceFirstVal[1]" placeholder="最高总价(万)" @keyup="checkPriceInput(1)">
                </div>
              </template>
              <template v-if="tabPriceIndex == 1 && optionsIndex != 2">
                <div class="type-content price-content">
                  <div class="type-item" v-for="(item,index) in priceTabSecond" :key="index" @click="chooseDistrictAddress(item,'priceTab')" :class="checkArrayValue(postGetData.setPriceTabSecond,'id',item.id) != -1?'type-active':''">{{item.name}}</div>
                </div>
                <div class="price-ipt">
                  <input type="number" class="_iosKeyboardInput" v-model="postGetData.setPriceSecondVal[0]" placeholder="最低单价(万)" @keyup="checkPriceInput(0)">
                  <span>至</span>
                  <input type="number" class="_iosKeyboardInput" v-model="postGetData.setPriceSecondVal[1]" placeholder="最高单价(万)" @keyup="checkPriceInput(1)">
                </div>
              </template>
              <div class="reset-btn">
                <div class="btn-box">
                  <div class="left">
                    <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                    <div @click="resetFunciton('priceTab')" class="text">重置</div>
                  </div>
                  <div @click="closeDropdownMenu('priceTab')" class="right">确定</div>
                </div>
              </div>
            </div>
          </van-dropdown-item>
          <van-dropdown-item title="户型" ref="huxing" :title-class="huxingClass" @opened="handleDropdownClone(1)" @close="handleDropdownClone()">
            <div class="house-type">
              <div class="type-content">
                <div class="type-item" v-for="(item,index) in huxing" :key="index" @click="chooseDistrictAddress(item,'huxing')" :class="checkArrayValue(postGetData.setHuxing,'id',item.id) != -1?'type-active':''">{{item.name}}</div>
              </div>
              <div class="reset-btn">
                <div class="btn-box">
                  <div class="left" @click="resetFunciton('huxing')">
                    <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                    <div class="text">重置</div>
                  </div>
                  <div @click="closeDropdownMenu('huxing')" class="right">确定</div>
                </div>
              </div>
            </div>
          </van-dropdown-item>
          <van-dropdown-item title="面积" ref="area" :title-class="areaClass" @opened="handleDropdownClone(1)"
            @close="handleDropdownClone()">
            <div class="house-type">
              <div class="type-content">
                <div class="type-item" v-for="(item,index) in moreArea" :key="index"
                  @click="chooseDistrictAddress(item,'area')"
                  :class="checkArrayValue(postGetData.setMoreArea,'id',item.id) != -1?'type-active':''">{{item.name}}</div>
              </div>
              <div class="reset-btn">
                <div class="btn-box">
                  <div class="left" @click="resetFunciton('area')">
                    <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                    <div class="text">重置</div>
                  </div>
                  <div @click="closeDropdownMenu('area')" class="right">确定</div>
                </div>
              </div>
            </div>
          </van-dropdown-item>
          <van-dropdown-item title="更多" ref="moreTitle" :title-class="moreTitleClass" @opened="handleDropdownClone(1)" @close="handleDropdownClone()">
            <div class="house-more">
              <div class="more-content">
                <div class="more-left">
                  <ul>
                    <li @click="selectTabArea(0,'moreTitle')" :class="moreTitle == 0 ? 'more-active':''">物业类型</li>
                    <li @click="selectTabArea(1,'moreTitle')" :class="moreTitle == 1 ? 'more-active':''">装修情况</li>
                  </ul>
                </div>
                <div class="more-right" v-if="moreTitle == 0">
                  <div class="more-item" v-for="(item,index) in morePropertyType" :key="index" @click="chooseDistrictAddress(item,'moreTitle')" :class="checkArrayValue(postGetData.setMorePropertyType,'id',item.id) != -1?'type-active':''">
                    {{item.name}}
                  </div>
                </div>
                <div class="more-right" v-if="moreTitle == 1">
                  <div class="more-item" v-for="(item,index) in moreRenovation" :key="index" @click="chooseDistrictAddress(item,'moreTitle')" :class="checkArrayValue(postGetData.setMoreRenovation,'id',item.id) != -1?'type-active':''">
                    {{item.name}}
                  </div>
                </div>
              </div>
              <div class="reset-btn">
                <div class="selected-big-container" v-show="!$commonUtils.utilCore.empty(selectedMore)">
                  <div class="selected-container selected-moreTitle" :style="isShowmore?'max-height:100%':''">
                    <div class="selected-title">已选：</div>
                    <div class="selected-content">
                      <div class="selected-box" v-for="(item,index) in selectedMore" :key="index+1">
                        {{item.name}}
                        <div class="selected-close" @click="deleteSelectedMore(item,index)">
                          <img :src="$appConfig.appWebStaticUrl + '/common/icon_close.png'" alt="">
                        </div>
                      </div>
                    </div>
                    <div class="selected-more" v-show="selectedMore.length>3 && !isShowmore" @click="handleMore('more')" style="bottom: 0.3rem">
                      更多
                      <img :src="$appConfig.appWebStaticUrl + '/home/icon_more.png'" alt="">
                    </div>
                    <div class="selected-more" v-show="selectedMore.length>3 && isShowmore" @click="handleMore('more')" style="bottom: 0.7rem">
                      收起
                      <img :src="$appConfig.appWebStaticUrl + '/home/icon_stow.png'" alt="">
                    </div>
                  </div>
                </div>
                <div class="btn-box">
                  <div class="left" @click="resetFunciton('moreTitle')">
                    <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_reset.png'" alt="">
                    <div class="text">重置</div>
                  </div>
                  <div @click="closeDropdownMenu('moreTitle')" class="right">确定</div>
                </div>
              </div>
            </div>
          </van-dropdown-item>
        </van-dropdown-menu>
      </div>
      <div class="disk-source-type">
        <div class="disk-item" v-for="(item,index) in diskSourceType" :key="index" @click="chooseDistrictAddress(item,'diskSourceType')" :class="checkArrayValue(postGetData.setDiskIndex,'id',item.id) != -1?'active':''">
          {{item.name}}
        </div>
      </div>
      <div class="selected-big-container" v-show="!$commonUtils.utilCore.empty(postGetData.setSelected)">
        <div class="selected-container" :style="isShow?'max-height:100%':''">
          <div class="selected-title">已选：</div>
          <div class="selected-content">
            <div class="selected-box" v-for="(item,index) in postGetData.setSelected" :key="index+1">
              {{item.name}}
              <div class="selected-close" @click="deleteSelected(item)">
                <img :src="$appConfig.appWebStaticUrl + '/common/icon_close.png'" alt="">
              </div>
            </div>
          </div>
          <div class="selected-more" v-show="selectedLength>3 && !isShow" @click="handleMore('select')">
            更多
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_more.png'" alt="">
          </div>
          <div class="selected-more" v-show="selectedLength>3 && isShow" @click="handleMore('select')">
            收起
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_stow.png'" alt="">
          </div>
        </div>
        <div class="fixed-line"></div>
      </div>
    </div>
    <div class="content-header" :style="{'padding-top':navheight+'px'}">
      <van-list @load="actOnLoad"
        v-model="postGetData.loading"
        :finished="postGetData.finished"
        :immediate-check="false"
        finished-text="没有更多了">
        <houselistItem :list="houselist" @goDetail="goDetail" v-show="optionsIndex!=1"></houselistItem>
        <newhouselistItem :list="houselist" @goDetail="goDetail" :isNewHouse="true" v-show="optionsIndex==1"></newhouselistItem>
      </van-list>
    </div>
    <!-- 回到顶部 -->
    <scrollTop></scrollTop>
  </div>
</template>

<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import houselistItem from "@/components/yni/houselistItem.vue"
import newhouselistItem from "@/components/yni/newhouselistItem.vue"
import scrollTop from "@/components/yni/scrolltop.vue"

import { mapState, mapMutations } from "vuex";

export default {
  components: {
    gniNavBar,
    houselistItem,
    scrollTop,
    newhouselistItem
  },
  data () {
    return {
      navheight: 0, // 导航高度
      diskSourceType: [],//标签列表
      houselist: [],
      priceTabFirst: [],//价格区间列表（新房二手房）
      priceTabSecond: [],//单价列表(新房)
      huxing: [],//户型
      moreArea: [],//建筑面积列表
      morePropertyType: [],//物业类型
      moreRenovation: [],//装修情况
      // 区域
      district: [],
      //区域地址
      addresslist: [],
      // 地铁区域(线路)
      districtMetro: [],
      //地铁区域地址(站点)
      addresslistMetro: [],
      tabPriceIndex: 0, // 价格tab切换
      tabAreaIndex: 0,//区域tab切换
      moreTitle: 0, // “更多”导航的标题选项
      postGetData: { //搜索选择的条件
        tabAreaIndex: 0,//区域tab切换 总是 等于 this.tabAreaIndex
        setDiskIndex: [],//当前选择的标签
        setDistrict: {},//区域，
        setDistrictList: [],//区域地址
        setDistrictMetro: {},//地铁线
        setDresslistMetro: [],//地铁站
        setPriceTabFirst: [],//价格区间列表（新房二手房）
        setPriceTabSecond: [],//单价列表(新房)
        setPriceFirstVal: ["", ""],//输入的总价
        setPriceSecondVal: ["", ""],//输入的单价
        setHuxing: [],//户型
        setMoreArea: [],//建筑面积列表
        setMorePropertyType: [],//物业类型
        setMoreRenovation: [],//装修类型
        setSelected: [],// 已选中的
        setSelectedMore: [],// 已选中的
        houseType: "sale",//房源类型（sale 二手房，house 新房，rent 租房）
        searchKeyWord: "",//搜索关键字
        city_id: 8,//	否	string	城市id 默认8
        page: 0,//	否	string	页码 默认1
        page_size: 10,//	否	string	每页显示数 默认10
        searchUptownId: '', // 小区id
        searchLoupanIds: '', // 新房小区id，用逗号隔开 2023/3/23新增
        update_time: '', //2023/3/21新增
        loading: false,//列表数据加载中
        finished: false,//列表数据已经加载完毕
      },
      pageFrom: "",//页面来源路径
      cloneObject: {}, //深拷贝筛选点击确定后的数据
      isClosed: false,
      selectedLength: '', // 已选中的长度，避免报错
      isShow: false,
      isShowmore: false,
      selectedMore: [], // “更多”已选中的数据
      houseNum: 0,
      optionsIndex: 0,
    }
  },
  computed: {
    ...mapState("user", ["userToken", "userInfo", "isLogin"]), //用户Token,用户登陆信息
    ...mapState("city", ["switchCityInfo",]), //城市的信息
    ...mapState("map", ["searchDrawListGetData", "drawIdArr"]), //房源的信息
    ...mapState('im', ['unread']),

    districtClass () {//是否有选择区域里的条件
      if (!this.$commonUtils.utilCore.empty(this.postGetData.setDistrict) || !this.$commonUtils.utilCore.empty(this.postGetData.setDistrictMetro)) {
        return "choose-active"
      }
      if (!this.$commonUtils.utilCore.empty(this.postGetData.setDistrictList) || !this.$commonUtils.utilCore.empty(this.postGetData.setDresslistMetro)) {
        return "choose-active"
      }
      return ""
    },
    priceTabClass () {//是否有选择价格里的条件
      if (!this.$commonUtils.utilCore.empty(this.postGetData.setPriceTabFirst) || !this.$commonUtils.utilCore.empty(this.postGetData.setPriceTabSecond)) {
        return "choose-active"
      }
      if (!this.$commonUtils.utilCore.empty(this.postGetData.setPriceFirstVal[0]) || !this.$commonUtils.utilCore.empty(this.postGetData.setPriceFirstVal[1])) {
        return "choose-active"
      }
      if (!this.$commonUtils.utilCore.empty(this.postGetData.setPriceSecondVal[0]) || !this.$commonUtils.utilCore.empty(this.postGetData.setPriceSecondVal[1])) {
        return "choose-active"
      }
      return ""
    },
    huxingClass () {//是否有选择户型里的条件
      if (!this.$commonUtils.utilCore.empty(this.postGetData.setHuxing)) {
        return "choose-active"
      }
      return ""
    },
    areaClass () {//是否有选择户型里的条件
      if (!this.$commonUtils.utilCore.empty(this.postGetData.setMoreArea)) {
        return "choose-active"
      }
      return ""
    },
    moreTitleClass () {//是否有选择更多里的条件
      if (!this.$commonUtils.utilCore.empty(this.postGetData.setMorePropertyType)) {
        return "choose-active"
      }
      if (!this.$commonUtils.utilCore.empty(this.postGetData.setMoreRenovation)) {
        return "choose-active"
      }
      return ""
    },
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === "home-detail-secondhouseDetail" || from.name === "/home/detail/newhouseDetail" || from.name === "/home/detail/renthouseDetail") {
      to.meta.canKeep = true;
    } else {
      to.meta.canKeep = false;
    }
    next(vm => {
      vm.pageFrom = from.name;
    });
  },
  // async mounted () {
  //   this.houseNum = this.$route.query.houseNum
  //   this.optionsIndex = this.$route.query.optionsIndex
  //   await this.getListConfigInit();
  // },
  async activated () {
    this.houseNum = this.$route.query.houseNum
    this.optionsIndex = this.$route.query.optionsIndex
    if (!this.$route.meta.canKeep) {
      await this.getListConfigInit();
    }
  },
  methods: {
    ...mapMutations('city', ['setRecentCity', 'setSwitchCityInfo']),
    async actOnLoad () {
      setTimeout(() => {
        this.computedHeight()
      }, 1);
      this.$commonUtils.appLog.log("=========+++++++++++++==============》》》actOnLoad", this.postGetData)
      if (this.postGetData.finished == true) {
        this.postGetData.loading = false;
        return;
      }
      this.postGetData.page++;

      if (this.postGetData.page == 1) {
        this.postGetData.update_time = ''
      }
      this.postGetData.city_id = this.$route.query.city_id || this.switchCityInfo.city_id
      this.postGetData.loading = true;
      let res = await this.$store.dispatch(`home/${this.optionsIndex == 0 ? 'actAppFangSaleLists' : this.optionsIndex == 1 ? 'actAppFangHouseLists' : 'actAppFangRentLists'}`, this.postGetData);
      this.postGetData.loading = false;
      if (res && res.rows) {
        //如果返回的条数小于每页的条数，则加载完了
        if (res.rows.length < this.postGetData.page_size) {
          this.postGetData.finished = true;
        }
        // if (!this.$commonUtils.utilCore.empty(res.rows)) {
        //   this.postGetData.update_time = res.rows[res.rows.length - 1].update_time
        // }
        if (this.optionsIndex == 0) {
          res.rows.forEach((item) => {
            let tmp_item = {
              id: item.shouse_id,
              title: item.shouse_title,
              subtitle: this.showTitle(item, 0).toString(),
              left: item.price_name ? item.price_name.replace('万', '') : "",
              right: item.average_price_name,
              ...item
            }
            tmp_item.label = []
            if (item.tags && this.$commonUtils.utilCore.empty(item.tags)) {
              item.tags.forEach((val) => {
                let tmp_val = {
                  text: val.tag_name,
                  ...val
                }
                tmp_item.label.push(val)
              })
            }
            if (item.price_name.replace('万', '') != 0) {
              this.houselist.push(tmp_item)
            }
          })
        } else if (this.optionsIndex == 1) {
          res.rows.forEach((item) => {
            let tmp_item = {
              id: item.loupan_id,
              title: item.loupan_name,
              subtitle: this.showTitle(item, 1).toString(),
              right: item.average_price_name,
              ...item
            }
            tmp_item.label = []
            if (item.tags && this.$commonUtils.utilCore.empty(item.tags)) {
              item.tags.forEach((val) => {
                let tmp_val = {
                  text: val.tag_name,
                  ...val
                }
                tmp_item.label.push(val)
              })
            }
            this.houselist.push(tmp_item)
          })
        } else {
          res.rows.forEach((item) => {
            let tmp_item = {
              id: item.rent_id,
              title: item.rent_title,
              subtitle: this.showTitle(item, 0).toString(),
              left: item.price_name ? item.price_name.replace('万', '') : "",
              right: item.rent_price_name,
              ...item
            }
            tmp_item.label = []
            if (item.tags && this.$commonUtils.utilCore.empty(item.tags)) {
              item.tags.forEach((val) => {
                let tmp_val = {
                  text: val.tag_name,
                  ...val
                }
                tmp_item.label.push(val)
              })
            }
            if (item.rent_price != 0) {
              this.houselist.push(tmp_item)
            }
          })
        }
      } else {
        this.postGetData.finished = true;
        this.$commonUtils.appLog.log("加载列表数据不正确", res)
      }
      // setTimeout(() => {
      //   this.computedHeight()
      // }, 100);
      // console.log('看看已选中', this.searchDrawListGetData);
    },
    //初始化搜索选项
    async getListConfigInit () {
      this.houselist = [];
      // keepalive需要初始化的值
      this.diskSourceType = [];//标签列表
      this.priceTabFirst = [];//价格区间列表（新房二手房）
      this.priceTabSecond = [];//单价列表(新房)
      this.huxing = [];//户型
      this.moreArea = [];//建筑面积列表
      this.morePropertyType = [];//物业类型
      this.moreRenovation = [];//装修情况
      // 区域
      this.district = [];
      //区域地址
      this.addresslist = [];
      // 地铁区域(线路)
      this.districtMetro = [];
      //地铁区域地址(站点)
      this.addresslistMetro = [];
      this.tabPriceIndex = 0; // 价格tab切换
      this.tabAreaIndex = 0;//区域tab切换
      this.moreTitle = 0; // “更多”导航的标题选项
      this.postGetData = { //搜索选择的条件
        tabAreaIndex: 0,//区域tab切换 总是 等于 this.tabAreaIndex
        setDiskIndex: [],//当前选择的标签
        setDistrict: {},//区域，
        setDistrictList: [],//区域地址
        setDistrictMetro: {},//地铁线
        setDresslistMetro: [],//地铁站
        setPriceTabFirst: [],//价格区间列表（新房二手房）
        setPriceTabSecond: [],//单价列表(新房)
        setPriceFirstVal: ["", ""],//输入的总价
        setPriceSecondVal: ["", ""],//输入的单价
        setHuxing: [],//户型
        setMoreArea: [],//建筑面积列表
        setMorePropertyType: [],//物业类型
        setMoreRenovation: [],//装修类型
        searchUptownId: '', // 小区id
        update_time: '', //2023/3/21新增
        houseType: "sale",//房源类型（sale 二手房，house 新房，rent 租房）
        searchKeyWord: "",//搜索关键字
        city_id: this.$route.query.city_id || 8,//	否	string	城市id 默认8
        page: 0,//	否	string	页码 默认1
        page_size: 10,//	否	string	每页显示数 默认10
        loading: false,//列表数据加载中
        finished: false,//列表数据已经加载完毕
      };
      this.cloneObject = {};
      await this.$store.commit('map/setSearchDrawListGetData', {
        tabAreaIndex: 0,//区域tab切换 总是 等于 this.tabAreaIndex
        setDiskIndex: [],//当前选择的标签
        setDistrict: {},//区域，
        setDistrictList: [],//区域地址
        setDistrictMetro: {},//地铁线
        setDresslistMetro: [],//地铁站
        setPriceTabFirst: [],//价格区间列表（新房二手房）
        setPriceTabSecond: [],//单价列表(新房)
        setPriceFirstVal: ["", ""],//输入的总价
        setPriceSecondVal: ["", ""],//输入的单价
        setHuxing: [],//户型
        setMoreArea: [],//建筑面积列表
        setMorePropertyType: [],//物业类型
        setMoreRenovation: [],//装修类型
        searchUptownId: this.$route.query.uptown_id || '', // 小区id
        update_time: '', //2023/3/21新增
        houseType: "sale",//房源类型（sale 二手房，house 新房，rent 租房）
        searchKeyWord: "",//搜索关键字
        city_id: this.$route.query.city_id || 8,//	否	string	城市id 默认8
        page: 0,//	否	string	页码 默认1
        page_size: 10,//	否	string	每页显示数 默认10
        loading: false,//列表数据加载中
        finished: false,//列表数据已经加载完毕
      });
      //是从搜索页过来，则把搜索条件加上
      if (!this.$commonUtils.utilCore.empty(this.searchDrawListGetData)) {
        //如果当前的搜索件条是同一种房源的，则加载起来
        if (this.searchDrawListGetData.houseType == this.postGetData.houseType) {
          let tmp_info = this.$commonUtils.utilCore.deepClone(this.searchDrawListGetData)
          this.postGetData = this.$commonUtils.utilCore.deepMerge(this.postGetData, tmp_info)
          //区域默认选择值
          this.tabAreaIndex = this.postGetData.tabAreaIndex || 0
        }
      }
      this.postGetData.loading = true;
      this.postGetData.finished = false;
      if (this.optionsIndex == 1) {
        this.postGetData.searchLoupanIds = this.drawIdArr
      } else {
        this.postGetData.searchUptownId = this.drawIdArr
      }
      this.actOnLoad();//keepalive二次进来请求新数据

      let res = "";
      //区域列表
      let postData = {
        city_id: this.$route.query.city_id || this.switchCityInfo.city_id || 8
      }
      res = await this.$store.dispatch('home/getAppGetAreaTree', postData);
      if (res && res[postData.city_id]) {
        // this.$commonUtils.appLog.log("返回结果", res)
        this.district = []
        //增加 不限 的选项 
        this.district.push({
          id: "",
          name: "不限",
          sort: 0,
          children: []
        })
        for (let key in res[postData.city_id]) {
          let tmp_item = res[postData.city_id][key];
          let item = {
            "id": tmp_item.area_id,
            "name": tmp_item.area_name,
            "parent_id": tmp_item.parent_id,
            "first_letter": tmp_item.first_letter,
            "longitude": tmp_item.longitude,
            "latitude": tmp_item.latitude,
            "site_id": tmp_item.site_id,
            "site_id_real": tmp_item.site_id_real,
            "online_status": tmp_item.online_status,
            "online_time": tmp_item.online_time,
            "erp_id": tmp_item.erp_id,
            "sort": tmp_item.sort,
            "children": [],
          }
          item.children.push({
            id: "0",
            name: "不限",
            sort: 0,
          })
          for (let key2 in res[postData.city_id][key].children) {
            tmp_item = res[postData.city_id][key].children[key2];
            let item2 = {
              "id": tmp_item.area_id,
              "name": tmp_item.area_name,
              "parent_id": tmp_item.parent_id,
              "first_letter": tmp_item.first_letter,
              "longitude": tmp_item.longitude,
              "latitude": tmp_item.latitude,
              "site_id": tmp_item.site_id,
              "site_id_real": tmp_item.site_id_real,
              "online_status": tmp_item.online_status,
              "online_time": tmp_item.online_time,
              "erp_id": tmp_item.erp_id,
              "sort": tmp_item.sort
            }
            item.children.push(item2)
          }
          this.district.push(item)
          delete res[postData.city_id][key];

          //记录默认选择的地址
          if (this.postGetData.setDistrict && this.postGetData.setDistrict.hasOwnProperty('id') && this.postGetData.setDistrict.id == item.id) {
            this.addresslist = item.children;
          }
        }
        res = ""
      } else {
        this.$commonUtils.utilCore.showToast("初始化区域列表出错")
      }

      //地铁列表
      postData = {
        city_id: this.$route.query.city_id || this.switchCityInfo.city_id || 8
      }
      res = await this.$store.dispatch('home/getAppGetMetroTree', postData);
      if (res) {
        // this.$commonUtils.appLog.log("返回结果", res)
        this.districtMetro = []
        this.districtMetro.push({
          id: "",
          name: "不限",
          sort: 0,
          children: []
        })
        for (let key in res[postData.city_id]) {
          let tmp_item = res[postData.city_id][key];
          let item = {
            "id": tmp_item.metro_line_id,
            "name": tmp_item.metro_line_name,
            "metro_line_search_name": tmp_item.metro_line_search_name,
            "line_uid": tmp_item.line_uid,
            "metro_station_ids": tmp_item.metro_station_ids,
            "site_id": tmp_item.site_id,
            "sort": tmp_item.sort,
            "children": []
          }
          item.children.push({
            id: "0",
            name: "不限",
            sort: 0,
          })
          // 地铁
          // for (let key2 in res[postData.city_id][key].children) {
          //   tmp_item = res[postData.city_id][key].children[key2];

          let metro_station_ids = res[postData.city_id][key].metro_station_ids && res[postData.city_id][key].metro_station_ids.split(',') || []
          let children = res[postData.city_id][key].children
          for (let key2 in metro_station_ids) {
            for (let key3 in children) {
              if (children[key3].metro_station_id == metro_station_ids[key2]) {
                tmp_item = children[key3];
                let item2 = {
                  "id": tmp_item.metro_station_id,
                  "name": tmp_item.metro_station_name,
                  "metro_line_ids": tmp_item.metro_line_ids,
                  "longitude": tmp_item.longitude,
                  "latitude": tmp_item.latitude,
                  "site_id": tmp_item.site_id,
                  "sort": tmp_item.sort,
                  "back_city_id": tmp_item.back_city_id
                }
                item.children.push(item2)
                break;
              }
            }
          }
          this.districtMetro.push(item)
          delete res[postData.city_id][key];
          //记录默认的选择线路站点
          if (this.postGetData.setDistrictMetro && this.postGetData.setDistrictMetro.hasOwnProperty('id') && this.postGetData.setDistrictMetro.id == item.id) {
            this.addresslistMetro = item.children;
          }
        }
      } else {
        this.$commonUtils.utilCore.showToast("初始化地铁列表出错")
      }
      //价格区间列表（新房二手房）
      res = await this.$store.dispatch(`home/${this.optionsIndex == 2 ? 'getAppBase_rent_price' : 'getAppBase_shouse_total_price'}`);
      if (res) {
        this.priceTabFirst = []
        if (this.optionsIndex == 2) {
          for (let key in res) {
            let item = res[key];
            let tmp_item = {
              id: item.rent_price_id,
              name: item.rent_price_name,
              min: item.rent_price_min,
              max: item.rent_price_max,
              site_id: item.site_id,
              sort: item.sort,
            }
            //转换一下数据的key,方便要求多选
            this.priceTabFirst.push(tmp_item);
          }
        } else {
          for (let key in res) {
            let item = res[key];
            let tmp_item = {
              id: item.shouse_total_price_id,
              name: item.shouse_total_price_name,
              min: item.shouse_total_price_min,
              max: item.shouse_total_price_max,
              site_id: item.site_id,
              sort: item.sort,
            }
            //转换一下数据的key,方便要求多选
            this.priceTabFirst.push(tmp_item);
          }
        }
      } else {
        this.$commonUtils.utilCore.showToast("初始化价格区间列表出错")
      }


      //户型列表
      res = await this.$store.dispatch('home/getAppBase_layout_room');
      if (res) {
        // this.$commonUtils.appLog.log("返回结果", res)
        this.huxing = []
        //增加 不限 的选项 
        this.huxing.push({
          id: "",
          name: "不限",
          dname: "不限",
          bname: "不限",
          fname: "不限",
          sort: 0,
        })
        for (let key in res) {
          let item = res[key];
          let tmp_item = {
            id: item.layout_room_id,
            name: item.layout_room_cname,
            dname: item.layout_room_dname,
            bname: item.layout_room_bname,
            fname: item.layout_room_fname,
            sort: item.sort,
          }
          //转换一下数据的key,方便要求多选
          this.huxing.push(tmp_item);
        }
      } else {
        this.$commonUtils.utilCore.showToast("初始化户型列表出错")
      }
      //建筑面积列表
      res = await this.$store.dispatch('home/getAppBase_acreage');
      if (res) {
        //this.$commonUtils.appLog.log("返回结果", res)
        this.moreArea = []
        // this.moreArea.push({
        //   id: "",
        //   name: "不限",
        //   sort: 0,
        // })
        for (let key in res) {
          let item = res[key];
          let tmp_item = {
            id: item.acreage_id,
            name: item.acreage_name,
            min: item.acreage_min,
            max: item.acreage_max,
            sort: item.sort,
          }
          //转换一下数据的key,方便要求多选
          this.moreArea.push(tmp_item);
        }
      } else {
        this.$commonUtils.utilCore.showToast("初始化建筑面积列表出错")
      }
      //单价列表(新房)
      res = await this.$store.dispatch('home/getAppBase_loupan_unit_price');
      if (res) {
        this.priceTabSecond = []
        for (let key in res) {
          let item = res[key];
          let tmp_item = {
            id: item.loupan_unit_price_id,
            name: item.loupan_unit_price_name,
            min: item.loupan_unit_price_min,
            max: item.loupan_unit_price_max,
            site_id: item.site_id,
            sort: item.sort,
          }
          //转换一下数据的key,方便要求多选
          this.priceTabSecond.push(tmp_item);
        }
      } else {
        this.$commonUtils.utilCore.showToast("初始化单价列表出错")
      }
      //二级标签
      res = await this.$store.dispatch(`home/${this.optionsIndex == 0 ? 'getAppFangSaleGetSecondTag' : this.optionsIndex == 1 ? 'getAppFangHouseGetSecondTag' : 'getAppFangRentGetSecondTag'}`);
      if (res) {
        this.diskSourceType = []
        let tmp_item = {}
        for (let key in res) {
          let item = res[key];
          if (this.optionsIndex == 1) {
            tmp_item = {
              id: item.id,
              name: item.name,
              val: item.id
            }
          } else {
            tmp_item = {
              id: item.second_tag_id,
              name: item.name,
              val: item.second_tag_id
            }
          }
          //转换一下数据的key,方便要求多选
          this.diskSourceType.push(tmp_item);
        }
      } else {
        this.$commonUtils.utilCore.showToast("初始化单价列表出错")
      }
      //物业类型-二手房/租房
      res = await this.$store.dispatch('home/getAppBase_house_type');
      if (res) {
        this.morePropertyType = []
        for (let key in res) {
          let item = res[key];
          let tmp_item = {
            id: item.house_type_id,
            name: item.house_type_name,
            val: item.house_type_id
          }
          //转换一下数据的key,方便要求多选
          this.morePropertyType.push(tmp_item);
        }
      } else {
        this.$commonUtils.utilCore.showToast("初始化单价列表出错")
      }
      //装修情况列表
      res = await this.$store.dispatch('home/getAppBase_decoration');
      if (res) {
        this.moreRenovation = []
        for (let key in res) {
          let item = res[key];
          let tmp_item = {
            id: item.decoration_id,
            name: item.decoration_name,
            val: item.decoration_id
          }
          //转换一下数据的key,方便要求多选
          this.moreRenovation.push(tmp_item);
        }
      } else {
        this.$commonUtils.utilCore.showToast("初始化单价列表出错")
      }

      //是从搜索页过来，则把搜索条件加上
      if (
        !this.$commonUtils.utilCore.empty(this.searchDrawListGetData)
      ) {
        //如果当前的搜索件条是同一种房源的，则加载起来
        if (this.searchDrawListGetData.houseType == this.postGetData.houseType) {
          //区域默认选择值
          this.tabAreaIndex = this.postGetData.tabAreaIndex || 0
        }
      }
      this.isClosed = false;
      this.handleDropdownClone(1);//初始化深拷贝
      this.computedHeight()
    },
    onClickBack () {
      this.$router.go(-1);
    },
    //跳转到详情页
    goDetail (item) {
      let tmp_query = {}
      if (this.optionsIndex == 0) {
        tmp_query = {
          id: item.shouse_id,//	是	string	二手房id
          broker_id: item.broker_id,//	否	string	经纪人id
          share_broker_id: ""//	否	string	分享者经纪人id
        }
        this.toolsGoPageView({
          path: '/home/detail/secondhouseDetail',
          query: tmp_query
        })
      } else if (this.optionsIndex == 1) {
        tmp_query = {
          loupan_id: item.loupan_id
        }
        this.toolsGoPageView({
          path: '/home/detail/newhouseDetail',
          query: tmp_query
        })
      } else {
        tmp_query = {
          id: item.rent_id,//	是	string	二手房id
          broker_id: item.broker_id,//	否	string	经纪人id
          share_broker_id: ""//	否	string	分享者经纪人id
        }
        this.toolsGoPageView({
          path: '/home/detail/renthouseDetail',
          query: tmp_query
        })
      }
    },
    //标签选择 + 搜索
    async handleType () {
      //进行手动搜索
      this.postGetData.page = 0;
      this.postGetData.page_size = 10
      this.postGetData.loading = false;
      this.postGetData.finished = false;
      this.postGetData.city_id = this.$route.query.city_id || this.switchCityInfo.city_id
      //把数据存在vuex里去
      await this.$store.commit('map/setSearchDrawListGetData', this.postGetData);
      //清除当前列表数据
      this.houselist = []
      await this.actOnLoad();
    },
    //检查是否有输入完两个自定义值(输入完返回true,没有输入完返回false)
    checkInputTwoVal (type) {
      //如果是输入了自定义的总价
      if (type == 'priceTab' &&
        (this.postGetData.setPriceFirstVal[1] == '0' || this.postGetData.setPriceFirstVal[0] == '0' || !this.$commonUtils.utilCore.empty(this.postGetData.setPriceFirstVal[0]) || !this.$commonUtils.utilCore.empty(this.postGetData.setPriceFirstVal[1]))
      ) {

        if (this.$commonUtils.utilCore.empty(this.postGetData.setPriceFirstVal[0]) && this.postGetData.setPriceFirstVal[0] != '0') {
          this.$commonUtils.utilCore.showToast("请输入最低总价！")
          return false;
        }
        if (this.$commonUtils.utilCore.empty(this.postGetData.setPriceFirstVal[1]) && this.postGetData.setPriceFirstVal[1] != '0') {
          this.$commonUtils.utilCore.showToast("请输入最高总价!")
          return false;
        }
        if (this.postGetData.setPriceFirstVal[0] > this.postGetData.setPriceFirstVal[1] || this.postGetData.setPriceFirstVal[1] == '0') {
          this.$commonUtils.utilCore.showToast("请输入正确的总价区间!")
          return false;
        }
      }
      //如果是输入了自定义的单价
      if (type == 'priceTab' &&
        (this.postGetData.setPriceSecondVal[1] == '0' || this.postGetData.setPriceSecondVal[0] == '0' || !this.$commonUtils.utilCore.empty(this.postGetData.setPriceSecondVal[0]) || !this.$commonUtils.utilCore.empty(this.postGetData.setPriceSecondVal[1]))
      ) {

        if (this.$commonUtils.utilCore.empty(this.postGetData.setPriceSecondVal[0]) && this.postGetData.setPriceSecondVal[0] != '0') {
          this.$commonUtils.utilCore.showToast("请输入最低单价！")
          return false;
        }
        if (this.$commonUtils.utilCore.empty(this.postGetData.setPriceSecondVal[1]) && this.postGetData.setPriceSecondVal[1] != '0') {
          this.$commonUtils.utilCore.showToast("请输入最高单价!")
          return false;
        }
        if (this.postGetData.setPriceSecondVal[0] > this.postGetData.setPriceSecondVal[1] || this.postGetData.setPriceSecondVal[1] == '0') {
          this.$commonUtils.utilCore.showToast("请输入正确的单价区间!")
          return false;
        }
      }
      return true;
    },
    //点击关闭按钮
    async closeDropdownMenu (type, isClose = true) {
      //判断两个值的输入是否完成
      if (!this.checkInputTwoVal(type)) {
        return;
      }
      if (this.postGetData.loading) return
      //进行手动搜索
      this.postGetData.page = 0;
      this.postGetData.page_size = 10
      this.postGetData.loading = false;
      this.postGetData.finished = false;
      this.postGetData.city_id = this.$route.query.city_id || this.switchCityInfo.city_id
      this.handleLoop()
      if (this.postGetData.setSelected.length > 10) {
        this.$commonUtils.utilCore.showToast("最多只能选择10个选项。")
        return
      }
      // 切换需要重新搜索列表 下拉列表不收回
      if (isClose) {
        this.$refs[type].toggle();
      }
      this.handleDropdownClone(1);//上面改变了postGetData的key值，避免loading不出现, 所以再深拷贝一次
      this.handleDropdownClone(0);
      //把数据存在vuex里去
      this.$store.commit('map/setSearchDrawListGetData', this.postGetData);
      //清除当前列表数据
      this.houselist = []
      await this.actOnLoad();

      // console.log('看看已选中', this.postGetData.setSelected);
      // console.log('看看已选中的更多', this.selectedMore);
    },
    // 重置函数
    resetFunciton (type) {
      if (type == 'district') {//区域
        this.postGetData.setDistrict = ""
        this.postGetData.setDistrictMetro = ""
        this.postGetData.setDistrictList = []
        this.postGetData.setDresslistMetro = []
      } else if (type == "priceTab") {//价格
        this.postGetData.setPriceTabFirst = []
        this.postGetData.setPriceTabSecond = []
        this.postGetData.setPriceFirstVal = ["", ""]
        this.postGetData.setPriceSecondVal = ["", ""]
      } else if (type == "huxing") {//户型
        this.postGetData.setHuxing = []
      } else if (type == "area") {//户型
        this.postGetData.setMoreArea = []
      }
      else if (type == "moreTitle") {//更多
        this.postGetData.setMorePropertyType = []
        this.postGetData.setMoreRenovation = []
        this.selectedMore = []
      }
      //this.$commonUtils.utilCore.showToast("已重置选项")
    },
    // 选择区
    chooseDistrict (itemVal, type) {
      this.$refs.scrollRight.scrollTo(0, 0)
      let item = this.$commonUtils.utilCore.deepClone(itemVal);
      if (type == 'district') {//如果选择的是区域
        if (this.tabAreaIndex == 0) {
          this.addresslist = item.children;
          delete item.children
          this.postGetData.setDistrict = item
          //清掉已选的内容
          this.postGetData.setDistrictList = []
          this.cloneObject.addresslist = this.$commonUtils.utilCore.deepClone(this.addresslist);
          this.cloneObject.postGetData.setDistrict = this.$commonUtils.utilCore.deepClone(item);
          this.cloneObject.postGetData.setDistrictList = [];
        } else if (this.tabAreaIndex == 1) {
          this.addresslistMetro = item.children;
          delete item.children
          this.postGetData.setDistrictMetro = item
          //清掉已选的内容
          this.postGetData.setDresslistMetro = []
          this.cloneObject.addresslistMetro = this.$commonUtils.utilCore.deepClone(this.addresslistMetro);
          this.cloneObject.postGetData.setDistrictMetro = this.$commonUtils.utilCore.deepClone(item);
          this.cloneObject.postGetData.setDresslistMetro = [];
        }
      }
    },
    // 多选
    chooseDistrictAddress (item, type, isPop = true, isdelete = false) {
      if (type == 'district') {//如果选择的是 区域 或 地铁
        if (this.tabAreaIndex == 0) {
          let isAll = this.checkArrayValue(this.postGetData.setDistrictList, 'id', "0");
          //如果选择的是 不限
          if (item.id == "0") {
            if (isAll != -1) {
              this.postGetData.setDistrictList.splice(isAll, 1);
              return
            }
            this.postGetData.setDistrictList = [];
          } else {//如果不是 不限，则需要把 不限去掉了
            if (isAll != -1) {
              this.postGetData.setDistrictList.splice(isAll, 1);
            }
          }

          //判断是否已经有选择过，如果已经选择过则取消
          let isHave = this.checkArrayValue(this.postGetData.setDistrictList, 'id', item.id);
          if (isHave != -1) {
            this.postGetData.setDistrictList.splice(isHave, 1);
          } else {
            this.postGetData.setDistrictList.push(item)
          }
        } else if (this.tabAreaIndex == 1) {
          let isAll = this.checkArrayValue(this.postGetData.setDresslistMetro, 'id', "0");
          //如果选择的是 不限
          if (item.id == "0") {
            if (isAll != -1) {
              this.postGetData.setDresslistMetro.splice(isAll, 1);
              return
            }
            this.postGetData.setDresslistMetro = [];
          } else {//如果不是 不限，则需要把 不限去掉了
            if (isAll != -1) {
              this.postGetData.setDresslistMetro.splice(isAll, 1);
            }
          }
          //判断是否已经有选择过，如果已经选择过则取消
          let isHave = this.checkArrayValue(this.postGetData.setDresslistMetro, 'id', item.id);
          if (isHave != -1) {
            this.postGetData.setDresslistMetro.splice(isHave, 1);
          } else {
            this.postGetData.setDresslistMetro.push(item)

          }
        }
      } else if (type == 'priceTab') {//如果选择的是 总价 或 单价
        if (isdelete) {
          if (item.tabPriceIndex == 0) {
            this.tabPriceIndex = 0
          } else {
            this.tabPriceIndex = 1
          }
        } else {
          item.type = 'priceTab'
        }
        if (this.tabPriceIndex == 0) {
          //判断是否已经有选择过，如果已经选择过则取消
          let isHave = this.checkArrayValue(this.postGetData.setPriceTabFirst, 'id', item.id);
          if (isHave != -1) {
            this.postGetData.setPriceTabFirst.splice(isHave, 1);
          } else {
            item.tabPriceIndex = '0'
            this.postGetData.setPriceTabFirst.push(item)
          }
          this.postGetData.setPriceFirstVal = ["", ""]//输入的总价

        } else {//单价
          //判断是否已经有选择过，如果已经选择过则取消
          let isHave = this.checkArrayValue(this.postGetData.setPriceTabSecond, 'id', item.id);
          if (isHave != -1) {
            this.postGetData.setPriceTabSecond.splice(isHave, 1);
          } else {
            item.tabPriceIndex = '1'
            this.postGetData.setPriceTabSecond.push(item)
          }
          this.postGetData.setPriceSecondVal = ["", ""]//输入的单价

        }
      } else if (type == "huxing") {//如果选择的是 户型
        //如果选择的是不限，则需要把所有已经选的户型都去掉
        if (item.id === "") {
          this.resetFunciton('huxing')
        } else {//如果有选择项的时候要把 不限 去掉
          let isHave = this.checkArrayValue(this.postGetData.setHuxing, 'id', "");
          if (isHave != -1) {
            this.postGetData.setHuxing.splice(isHave, 1);
          }
        }
        //判断是否已经有选择过，如果已经选择过则取消
        let isHave = this.checkArrayValue(this.postGetData.setHuxing, 'id', item.id);
        if (isHave != -1) {
          this.postGetData.setHuxing.splice(isHave, 1);
        } else {
          item.type = 'huxing'
          this.postGetData.setHuxing.push(item)
        }
      } else if (type == "area") {
        //如果选择的是不限，则需要把所有已经选的户型都去掉
        if (item.id === "") {
          this.resetFunciton('area')
        } else {//如果有选择项的时候要把 不限 去掉
          let isHave = this.checkArrayValue(this.postGetData.setMoreArea, 'id', "");
          if (isHave != -1) {
            this.postGetData.setMoreArea.splice(isHave, 1);
          }
        }
        //判断是否已经有选择过，如果已经选择过则取消
        let isHave = this.checkArrayValue(this.postGetData.setMoreArea, 'id', item.id);
        if (isHave != -1) {
          this.postGetData.setMoreArea.splice(isHave, 1);
        } else {
          item.type = 'area'
          this.postGetData.setMoreArea.push(item)
        }
      } else if (type == "moreTitle") {//如果选择的是 更多
        item.type = 'moreTitle'
        if (isdelete) {
          if (item.moreTitle == 0) {
            this.moreTitle = 0
          } else if (item.moreTitle == 1) {
            this.moreTitle = 1
          }
        }
        // 已选的情况下点击执行的（更多选项）
        if (!this.$commonUtils.utilCore.empty(this.selectedMore)) {
          this.selectedMore.forEach((itemMore, indexMore) => {
            if (itemMore.type == item.type && itemMore.moreTitle == item.moreTitle && itemMore.id == item.id) {
              this.selectedMore.splice(indexMore, 1)
            }
          })
        }
        if (this.moreTitle == 0) {
          //判断是否已经有选择过，如果已经选择过则取消
          let isHave = this.checkArrayValue(this.postGetData.setMorePropertyType, 'id', item.id);
          if (isHave != -1) {
            this.postGetData.setMorePropertyType.splice(isHave, 1);
          } else {
            item.moreTitle = '0'
            this.postGetData.setMorePropertyType.push(item)
            this.selectedMore.push(item)
          }
        } else if (this.moreTitle == 1) {
          //判断是否已经有选择过，如果已经选择过则取消
          let isHave = this.checkArrayValue(this.postGetData.setMoreRenovation, 'id', item.id);
          if (isHave != -1) {
            this.postGetData.setMoreRenovation.splice(isHave, 1);
          } else {
            item.moreTitle = '1'
            this.postGetData.setMoreRenovation.push(item)
            this.selectedMore.push(item)
          }
        }
      } else if (type == 'diskSourceType') {
        //判断是否已经有选择过，如果已经选择过则取消
        let isHave = this.checkArrayValue(this.postGetData.setDiskIndex, 'id', item.id);
        if (isHave != -1) {
          this.postGetData.setDiskIndex.splice(isHave, 1);
        } else {
          this.postGetData.setDiskIndex.push(item)
        }
        //进行搜索
        this.handleType();
      }
    },
    //判断数组内的对像的key值是否等于某值(不等于或者不存在则返回 -1,如果等于则返回对应的key)
    checkArrayValue (item, key, val) {
      let str_return = -1;
      if (this.$commonUtils.utilCore.empty(item)) {
        return str_return;
      }
      item.forEach((tmp_item, index) => {
        if (tmp_item && tmp_item.hasOwnProperty(key) && tmp_item[key] == val) {
          str_return = index;
          return
        }
      })
      return str_return;
    },
    //切换 区域 与 地铁 的选择 || 更多
    selectTabArea (index, type) {
      if (type == "district") {//区域
        this.tabAreaIndex = index
        this.postGetData.tabAreaIndex = index
        //切换的时候要求把已选的清掉
        this.resetFunciton(type)
      } else if (type == "moreTitle") {//更多
        this.moreTitle = index
      } else if (type == "priceTab") {//价格
        this.tabPriceIndex = index
      } else {
        this.$commonUtils.appLog.log("选择的类型不正确==>", type)
      }
    },
    //跳转到搜索页
    getSearch () {
      this.postGetData.city_id = this.$route.query.city_id || this.switchCityInfo.city_id
      this.postGetData.page = 0
      this.postGetData.page_size = 10
      //把数据存在vuex里去
      this.$store.commit('map/setSearchDrawListGetData', this.postGetData);
      //进行跳转
      this.toolsGoPageView({ path: '/home/newsearch', query: { houseType: this.postGetData.houseType } })
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
    //检查输入的价格
    /**
     * num
     */
    checkPriceInput (num) {
      if (this.tabPriceIndex == 0) {
        this.postGetData.setPriceFirstVal[num] = this.postGetData.setPriceFirstVal[num].replace(/\D/g, '')
        if (this.postGetData.setPriceFirstVal[num] != "") {
          this.postGetData.setPriceTabFirst = []
        }
      }
      if (this.tabPriceIndex == 1) {
        this.postGetData.setPriceSecondVal[num] = this.postGetData.setPriceSecondVal[num].replace(/\D/g, '')
        if (this.postGetData.setPriceSecondVal[num] != "") {
          this.postGetData.setPriceTabSecond = []
        }
      }
    },
    // 深拷贝筛选数据, type 0：赋值，type 1： 深拷贝
    handleDropdownClone (type = 0) {
      if (this.isClosed) return;
      const cloneArray = ["priceTabFirst", "priceTabSecond", "huxing", "moreArea", "morePropertyType", "moreRenovation", "district", "addresslist", "districtMetro", "addresslistMetro", "tabPriceIndex", "tabAreaIndex", "moreTitle", "postGetData"];
      for (let i = 0; i < cloneArray.length; i++) {
        const item = cloneArray[i];
        // 赋值
        if (type === 0) {
          this[item] = this.cloneObject[item];
        } else {
          // 拷贝
          this.cloneObject[item] = this.$commonUtils.utilCore.deepClone(this[item]);
        }
        if (!this.$commonUtils.utilCore.empty(this.postGetData.setSelectedMore)) {
          this.selectedMore = this.postGetData.setSelectedMore
        } else {
          this.selectedMore = []
        }
      }
    },
    // 循环查询已选
    handleLoop () {
      this.postGetData.setSelected = []
      this.postGetData.setSelectedMore = []
      let priceRange = [] // 总价价格区间
      let unitPriceRange = [] // 单价价格区间
      if (!this.$commonUtils.utilCore.empty(this.postGetData.setPriceFirstVal[0]) && !this.$commonUtils.utilCore.empty(this.postGetData.setPriceFirstVal[1])) {
        priceRange = [{
          name: this.postGetData.setPriceFirstVal[0] + "~" + this.postGetData.setPriceFirstVal[1] + '万',
          type: 'priceTab',
          id: '',
          typeIndex: '0'
        }]
      }
      if (!this.$commonUtils.utilCore.empty(this.postGetData.setPriceSecondVal[0]) && !this.$commonUtils.utilCore.empty(this.postGetData.setPriceSecondVal[1])) {
        unitPriceRange = [{
          name: this.postGetData.setPriceSecondVal[0] + "~" + this.postGetData.setPriceSecondVal[1] + '万',
          type: 'priceTab',
          id: '',
          typeIndex: '1'
        }]
      }
      let arr = [
        this.postGetData.setPriceTabFirst,
        this.postGetData.setPriceTabSecond,
        this.postGetData.setHuxing,
        this.postGetData.setMoreArea,
        this.postGetData.setMorePropertyType,
        this.postGetData.setMoreRenovation,
        priceRange,
        unitPriceRange
      ]
      let arrMore = {
        setMoreArea: this.postGetData.setMoreArea,
        setMorePropertyType: this.postGetData.setMorePropertyType,
        setMoreRenovation: this.postGetData.setMoreRenovation
      }
      arr.forEach((item, index) => {
        console.log(item);
        if (item.length > 0) {
          item.forEach((i, idx) => {
            if (i.type == 'huxing' && i.id == '') { } else { this.postGetData.setSelected.push(i) }
          })
        }
      })
      // 多个数组（更多）整合一个数组
      Object.keys(arrMore).forEach(item => {
        this.postGetData.setSelectedMore.push(...arrMore[item])
      })
      this.selectedLength = this.postGetData.setSelected.length
    },
    goIm () {
      if (!this.isLogin) return location._fromCommission = 1, this.toolsGoPageView({ path: '/common/index', query: { fromCommission: true, path: '/user/index' } });
      this.$store.dispatch('im/goIm')
    },
    deleteSelected (item) {
      console.log(item);
      if (this.postGetData.loading) return
      if (item.type == 'priceTab' && item.id == '') {
        if (item.typeIndex == '0') {
          this.postGetData.setPriceFirstVal = ["", ""]//输入的总价
        } else {
          this.postGetData.setPriceSecondVal = ["", ""]//输入的单价
        }
        this.handleLoop()
        this.closeDropdownMenu(item.type, false)
        return
      }
      this.chooseDistrictAddress(item, item.type, false, true)
      this.handleLoop()
      this.closeDropdownMenu(item.type, false)
    },
    // 删除“更多”的已选中
    deleteSelectedMore (item, index) {
      this.chooseDistrictAddress(item, item.type, false, true)
      // this.selectedMore.splice(index, 1)
    },
    handleMore (type) {
      if (type == 'more') {
        this.isShowmore = !this.isShowmore
      } else {
        this.isShow = !this.isShow
        if (!this.isShow) {
          // 异步获取高度
          setTimeout(() => {
            this.computedHeight()
          }, 10);
        }
      }
    },
    computedHeight () {
      const navheight = document.querySelector(".fixed-container")
      this.navheight = navheight.offsetHeight
    }
  },
}
</script>

<style lang="scss" scoped>
// 下拉菜单最大高度 UI图 8.46 + 1.32
$dropdownContent: 9.78rem;
// 下拉菜单确认按钮浮动起来  按钮高度 + padding-bottom 1rem
$dropdownBottomBtn: 1.64rem + 1rem;
.list {
  .fixed-container {
    width: 100%;
    position: fixed;
    top: 0;
    background-color: #fff;
    z-index: 99;
    .header {
      .icon-return {
        img {
          width: 0.3rem;
          height: 0.3rem;
          display: block;
        }
      }
    }
    .search-condition {
      padding-top: 0.2rem;
      .house-region {
        .region-content {
          display: flex;
          // padding-bottom: 2.04rem;
          .region-left {
            font-size: 0.28rem;
            font-weight: 400;
            max-height: calc(#{$dropdownContent} - #{$dropdownBottomBtn});
            overflow: hidden;
            overflow-y: auto;
            padding-bottom: 1rem;
            ul {
              li {
                width: 1.74rem;
                height: 1rem;
                text-align: center;
                line-height: 1rem;
                color: #000000;
                background: #fafafa;
              }
            }
          }
          .region-middle {
            max-height: calc(#{$dropdownContent} - #{$dropdownBottomBtn});
            overflow: hidden;
            overflow-y: auto;
            padding-bottom: 1rem;
            ul {
              li {
                width: 2.52rem;
                height: 0.8rem;
                font-size: 0.28rem;
                font-weight: 400;
                text-indent: 0.4rem;
                line-height: 0.8rem;
                color: #000000;
                background: #fafafa;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
          .region-right {
            max-height: calc(#{$dropdownContent} - #{$dropdownBottomBtn});
            overflow: hidden;
            overflow-y: auto;
            padding-bottom: 1rem;
            ul {
              li {
                height: 0.8rem;
                font-size: 0.28rem;
                font-weight: 400;
                color: #000000;
                padding-left: 0.4rem;
                padding-right: 0.38rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                span {
                  width: 2.15rem;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                img {
                  width: 0.3rem;
                  height: 0.3rem;
                }
              }
            }
          }
        }
      }
      .house-price {
        background-color: #fff;
        .price-tab {
          font-size: 0.32rem;
          font-weight: 400;
          color: #9b9b9b;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 1.1rem 0.12rem 1.12rem;
          .price-tab-active {
            font-weight: bold;
            color: #111111;
            &::after {
              content: "";
              display: block;
              width: 1.6rem;
              height: 0.08rem;
              margin-top: 0.1rem;
              margin-left: 0.04rem;
              background: #f7d447;
            }
          }
        }
        .price-content {
          padding-bottom: 0.5rem !important;
        }
        .price-ipt {
          display: flex;
          align-items: center;
          padding-left: 0.66rem;
          padding-bottom: 0.72rem;
          input {
            width: 2.9rem;
            font-size: 0.36rem;
            font-weight: 400;
            border: none;
            text-align: center;
            box-sizing: border-box;
            border-bottom: 0.04rem solid #f8f8f8;
          }
          span {
            font-size: 0.28rem;
            font-weight: 400;
            color: #000000;
          }
        }
      }
      .house-type {
        .type-content {
          padding: 0.3rem 0.38rem 0.72rem;
          display: flex;
          flex-wrap: wrap;
          .type-price {
            font-size: 0.26rem;
            font-weight: 400;
            color: #000000;
            background: #f5f5f5;
            border-radius: 0.04rem;
            margin-bottom: 0.28rem;
            margin-right: 0.26rem;
            padding: 0.2rem 0.07rem 0.18rem 0.07rem;
            white-space: nowrap;
          }
          .type-item {
            width: 1.48rem;
            height: 0.64rem;
            font-size: 0.26rem;
            font-weight: 400;
            color: #000000;
            text-align: center;
            line-height: 0.64rem;
            background: #f5f5f5;
            border-radius: 0.04rem;
            margin-bottom: 0.28rem;
            margin-right: 0.26rem;
            &:nth-child(4n) {
              margin-right: 0;
            }
          }
        }
      }
      .house-more {
        .more-content {
          display: flex;
          align-items: flex-start;
          padding-bottom: 0.38rem;
          .more-left {
            font-size: 0.28rem;
            font-weight: 400;
            margin-right: 0.4rem;
            ul {
              li {
                width: 1.74rem;
                height: 1rem;
                text-align: center;
                line-height: 1rem;
                color: #000000;
                background: #fafafa;
              }
            }
          }
          .more-right {
            display: flex;
            flex-wrap: wrap;
            padding-top: 0.3rem;
            .more-item {
              width: 1.48rem;
              height: 0.64rem;
              font-size: 0.26rem;
              font-weight: 400;
              color: #000000;
              text-align: center;
              line-height: 0.64rem;
              background: #f5f5f5;
              border-radius: 0.04rem;
              margin-right: 0.26rem;
              margin-bottom: 0.28rem;
            }
          }
        }
      }
      .house-sort {
        .sort-item {
          height: 0.84rem;
          font-size: 0.28rem;
          font-weight: 400;
          color: #000000;
          text-align: center;
          line-height: 0.84rem;
          border-bottom: 0.01rem solid #e5e5e5;
        }
      }

      /deep/ .van-dropdown-menu {
        .van-dropdown-menu__bar {
          box-shadow: none;
          padding-right: 0.2rem;
          border-bottom: 0.02rem solid #e6e6e6;
        }
        .van-dropdown-item__option {
          text-align: center;
        }
      }
    }
    .disk-source-type {
      padding: 0.26rem 0.1rem 0.26rem 0.3rem;
      display: flex;
      flex-wrap: nowrap;
      white-space: nowrap;
      .disk-item {
        font-size: 0.22rem;
        font-weight: 400;
        color: #000000;
        background: #f8f8f8;
        border-radius: 0.4rem;
        padding: 0.2rem 0.25rem;
        margin-right: 0.2rem;
        &:nth-last-child(1) {
          margin-right: 0;
        }
      }
    }
    .selected-big-container {
      position: relative;
      .selected-container {
        max-height: 1.75rem;
        box-sizing: border-box;
        display: flex;
        align-items: baseline;
        padding: 0.14rem 0.2rem 0rem 0.36rem;
        overflow: hidden;
        border-bottom: 0.04rem solid #f8f8f8;
        .selected-title {
          font-size: 0.28rem;
          font-weight: 400;
          color: #000000;
          white-space: nowrap;
        }
        .selected-content {
          width: 5.2rem;
          display: flex;
          flex-wrap: wrap;
          align-items: center;

          .selected-box {
            font-size: 0.24rem;
            font-weight: 400;
            color: #000000;
            background: #fef6d6;
            border-radius: 0.04rem;
            border: 0.02rem solid #ffce09;
            padding: 0.1rem 0.25rem;
            margin-right: 0.5rem;
            margin-bottom: 0.3rem;
            white-space: nowrap;
            position: relative;
            &:nth-last-child(1) {
              margin-right: 0;
            }
            // &:nth-child(3n) {
            //   margin-right: 0;
            // }
            .selected-close {
              position: absolute;
              right: -0.14rem;
              top: -0.12rem;
              img {
                width: 0.32rem;
                height: 0.32rem;
                display: block;
              }
            }
          }
        }
        .selected-more {
          font-size: 0.28rem;
          font-weight: 400;
          color: #8d8d8d;
          display: flex;
          align-items: center;
          white-space: nowrap;
          position: absolute;
          bottom: 0.4rem;
          right: 0;
          transform: translate(-30%, 0);
          img {
            width: 0.22rem;
            height: 0.15rem;
            margin-left: 0.05rem;
          }
          &::after {
            content: "";
            display: block;
            width: 0.02rem;
            height: 0.24rem;
            background: #d8d8d8;
            position: absolute;
            left: -0.16rem;
          }
        }
      }
      .selected-moreTitle {
        max-height: 2rem;
        max-height: 1.98rem;
        padding: 0.4rem 0.2rem 0.28rem 0.34rem;
      }
      .fixed-line {
        width: 100%;
        height: 0.1rem;
        background: #f0f0f0;
      }
    }
  }
  .content-header {
    // padding-top: 4.1rem;
  }
  .reset-btn {
    box-shadow: 0rem -0.04rem 0.08rem 0rem rgba(0, 0, 0, 0.08);
    .btn-box {
      display: flex;
      align-items: center;
      padding: 0.3rem 0.4rem;
      .left {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-right: 1.1rem;
        position: relative;
        img {
          width: 0.28rem;
          height: 0.28rem;
        }
        .text {
          font-size: 0.28rem;
          font-weight: 400;
          color: #000000;
        }
        &::after {
          content: "";
          width: 0.02rem;
          height: 0.44rem;
          background: #f2f2f2;
          position: absolute;
          top: 0.08rem;
          right: 0.56rem;
          display: block;
        }
      }
      .right {
        width: 4.94rem;
        height: 0.72rem;
        font-size: 0.32rem;
        font-weight: 400;
        color: #000000;
        text-align: center;
        line-height: 0.72rem;
        background: #f7d447;
        border-radius: 0.08rem;
      }
    }
  }
  .active {
    border: 0.02rem solid #ffce09 !important;
    background: #fef6d6 !important;
    // border-color: #207fef !important;
    // color: #207fef !important;
  }
  .sort-active {
    background: #f7d447;
  }
  .type-active {
    width: 1.45rem !important;
    height: 0.6rem !important;
    background: #fef6d6 !important;
    border: 0.02rem solid #ffce09;
  }
  .type-active-price {
    background: #fef6d6;
    background: #fef6d6 !important;
    border: 0.02rem solid #ffce09;
  }
  .more-active {
    font-weight: bold;
    color: #f7d447 !important;
    background: #ffffff !important;
  }
  .choose-active {
    font-weight: 500;
    color: #000000;
  }

  /deep/ .van-dropdown-menu__bar .van-dropdown-menu__title {
    color: #3a4143;
  }
  /deep/ .more-active {
    font-weight: bold;
    color: #f7d447 !important;
    background: #ffffff !important;
  }
  /deep/ .choose-active {
    font-weight: 500;
    color: #000000 !important;
    background: #ffffff !important;
    &::after {
      border-color: transparent transparent #000000 #000000;
    }
  }
  // /deep/ .van-dropdown-item--down {
  //   // position: absolute;
  //   // height: 100vh;
  //   top: 3.16rem !important;
  // }
  /deep/ .van-dropdown-item__content {
    max-height: $dropdownContent;
  }
}
</style>
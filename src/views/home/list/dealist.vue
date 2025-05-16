<template>
  <div class="list">
    <div class="fixed-container">
      <gni-nav-bar @onClickLeft="onClickBack" :pageTitle="headTitle" :hideRight="false" :hideLeft="false">
        <template slot="slot-left">
          <div class="icon-return">
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_reutrn.png'" alt="">
          </div>
        </template>
      </gni-nav-bar>
      <div class="header">
        <div class="search">
          <input type="text" v-model="postGetData.inputKeyWord" placeholder="请输入小区/路段名称" @click="getSearch()">
          <img :src="$appConfig.appWebStaticUrl + '/home/icon_magnifier.png'" alt="" class="icon-magnifier">
        </div>
        <div class="header-right" @click="onClickBack">取消
        </div>
      </div>
      <div class="echart-container" v-show="isShowEchart">
        <div class="e-header">{{searchPostGetData.inputKeyWord}}成交价</div>
        <div class="e-box">
          <div ref="chart" style="width:100%;height:1.8rem"></div>
        </div>
        <div class="e-footer">
          <img :src="$appConfig.appWebStaticUrl + '/home/icon_excelmark.png'" alt="" class="icon-excelmark">
          以上数据仅供参考
        </div>
      </div>
      <div class="search-condition">
        <van-dropdown-menu active-color="#000000" :close-on-click-outside="false">
          <van-dropdown-item title="区域" ref="district" :title-class="districtClass" @opened="handleDropdownClone(1)" @close="handleDropdownClone()" v-if="isShowArea">
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
                <!-- 地铁 -->
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
          </van-dropdown-item>
          <van-dropdown-item title="租/售类别" ref="leaseSale" :title-class="rentSaleTypeClass" @opened="handleDropdownClone(1)" @close="handleDropdownClone()" :class="isShowArea?'rentSaleClass':'rentSaleShowClass'">
            <div class="house-sort">
              <div class="sort-item" v-for="(item,index) in rentSaleList" :key="index" @click="changeRentSaleType(item,'leaseSale')" :class="checkArrayValue(postGetData.setLeaseSale,'id',item.id) != -1?'sort-active':''">
                {{item.name}}
              </div>
            </div>
          </van-dropdown-item>
          <van-dropdown-item title="成交年份" ref="year" :title-class="dealYearTypeClass" @opened="handleDropdownClone(1)" @close="handleDropdownClone()" :class="isShowArea?'dealYearClass':'dealYearShowClass'">
            <div class="house-sort">
              <div class="sort-item" v-for="(item,index) in dealYearList" :key="index" @click="changeRentSaleType(item,'year')" :class="checkArrayValue(postGetData.setYear,'id',item.id) != -1?'sort-active':''">
                {{item.name}}
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
        </van-dropdown-menu>
      </div>
    </div>
    <div :style="{'padding-top':navheight+'px'}">
      <van-list @load="actOnLoad"
        v-model="postGetData.loading"
        :finished="postGetData.finished"
        :immediate-check="false"
        finished-text="没有更多了">
        <div class="deal-container">
          <div class="deal-box" @click="goDealDetail(item)" v-for="(item,index) in houselist" :key="index+1">
            <div class="deal-left-box">
              <div class="deal-left" :class="{'deal-active':postGetData.leaseSaleIndex==2}">{{postGetData.leaseSaleIndex==1?'售':'租'}}</div>
            </div>
            <div class="deal-right">
              <div class="deal-address deal-padbottom">{{postGetData.leaseSaleIndex==1?item.shouse_title:item.rent_title}}</div>
              <div class="deal-label deal-padbottom">{{item.house_orientation_name}}/{{item.floor_name}}/{{item.acreage_cover}}㎡</div>
              <div class="deal-time deal-padbottom">签约日期：{{$commonUtils.utilDate.date("Y.m",item.sign_time)}}</div>
              <div class="deal-price" v-if="postGetData.leaseSaleIndex==1">
                <div class="price-left">
                  <span>{{item.trade_amount_w}}</span>
                  <span class="price-unit">万</span>
                </div>
                <div class="price-right">{{item.average_price}}元/㎡</div>
              </div>
              <div class="rent-price" v-else>
                <span>{{item.trade_amount}}</span>元/月
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
    <!-- 回到顶部 -->
    <scrollTop></scrollTop>
    <popChangeCity :isChangecity="isChangecity" :popCityname="popCityname" @confirm="changeCity" @cancel="cancel"></popChangeCity>
  </div>
</template>

<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import houselistItem from "@/components/yni/houselistItem.vue"
import scrollTop from "@/components/yni/scrolltop.vue"
import popChangeCity from "./components/popchange-city.vue"
import { mapState, mapActions, mapMutations } from "vuex";
// 引入echarts
import * as echarts from "echarts/core";

/** 引入柱状图and折线图图表，图表后缀都为 Chart  */
import { LineChart } from "echarts/charts";

// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
} from "echarts/components";

// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from "echarts/features";

// Canvas 渲染器
import { CanvasRenderer } from "echarts/renderers";

// 注册必须的组件
echarts.use([
  // TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  LegendComponent,
  // TransformComponent,
  // LabelLayout,
  // UniversalTransition,
  CanvasRenderer,
  LineChart,
]);

export default {
  components: {
    gniNavBar,
    houselistItem,
    scrollTop,
    popChangeCity,
  },
  data () {
    return {
      navheight: 0, // 导航高度
      houselist: [],
      huxing: [],//户型
      // 区域
      district: [],
      //区域地址
      addresslist: [],
      // 地铁区域(线路)
      districtMetro: [],
      //地铁区域地址(站点)
      addresslistMetro: [],
      tabAreaIndex: 0,//区域tab切换
      postGetData: { //搜索选择的条件
        tabAreaIndex: 0,//区域tab切换 总是 等于 this.tabAreaIndex
        setDiskIndex: [],//当前选择的标签
        setDistrict: {},//区域，
        setDistrictList: [],//区域地址
        setDistrictMetro: {},//地铁线
        setDresslistMetro: [],//地铁站
        setHuxing: [],//户型
        setLayouthall: "", // 厅数
        setLeaseSale: [],//选择的租售类型
        setYear: [],//选择的年份
        houseType: "sale",//房源类型（sale 二手房，house 新房，rent 租房）
        leaseSaleIndex: 1, // 租售类型 1售 2租
        searchKeyWord: "",//搜索关键字
        searchUptownId: "",//
        inputKeyWord: "",//
        city_id: 8,//	否	string	城市id 默认8
        page: 0,//	否	string	页码 默认1
        page_size: 10,//	否	string	每页显示数 默认10
        loading: false,//列表数据加载中
        finished: false,//列表数据已经加载完毕
      },
      isUpdate: 0,
      isChangecity: false, //切换城市弹窗
      popCityname: '', // 弹窗城市名字 
      popCityId: '', // 切换的城市id
      pageFrom: "",//页面来源路径
      changeChooseMetroId: {}, // 选中切换弹窗的该地铁路线的id
      cloneObject: {}, //深拷贝筛选点击确定后的数据
      isClosed: false,
      // 2023.1.11 新增
      rentSaleList: [
        //排序值
        // { id: 0, name: "全部", val: "update_time~desc" },
        { id: 1, name: "售" },
        { id: 2, name: "租" },
      ],
      dealYearList: [
        //排序值
        { id: 0, name: "全部", val: "" },
        { id: 1, name: "2023年", val: "2023" },
        { id: 2, name: "2022年", val: "2022" },
        { id: 3, name: "2021年", val: "2021" },
        { id: 4, name: "2020年", val: "2020" },
        { id: 5, name: "2019年", val: "2019" },
        { id: 6, name: "2018年", val: "2018" },
      ],
      isShowArea: true, // 是否显示区域
      chooseYearIndex: 0, //
      headTitle: '查成交',//
      uptownPriceList: [], // 成交折线图数据
      avgNumArr: [],
      priceMin: '',//坐标轴刻度最小值
      priceMax: '',  // 坐标轴刻度最大值
      isShowEchart: false,
    }
  },
  computed: {
    ...mapState("user", ["userToken", "userInfo", "isLogin"]), //用户Token,用户登陆信息
    ...mapState("city", ["geoPosition", "thisCityInfo", "switchCityInfo", "cityInfoRows"]), //城市的信息
    ...mapState("home", ["searchPostGetData"]), //房源的信息
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
    huxingClass () {//是否有选择户型里的条件
      if (!this.$commonUtils.utilCore.empty(this.postGetData.setHuxing)) {
        return "choose-active"
      }
      return ""
    },
    rentSaleTypeClass () {//是否有选择租售类型
      if (!this.$commonUtils.utilCore.empty(this.postGetData.setLeaseSale)) {
        return "choose-active"
      }
      return ""
    },
    dealYearTypeClass () {//是否有选择年份
      if (!this.$commonUtils.utilCore.empty(this.postGetData.setYear)) {
        return "choose-active"
      }
      return ""
    },
  },
  mounted () {
  },
  beforeRouteEnter (to, from, next) {
    if ((from.name === "home-detail-dealSaleDetail" || from.name === "home-detail-dealRentDetail") && to.query.isUpdate != 1) {
      to.meta.canKeep = true;
    } else {
      to.meta.canKeep = false;
    }
    next(vm => {
      vm.pageFrom = from.name;
      vm.isUpdate = to.query.isUpdate || 0;
    });
  },
  async activated () {
    if (!this.$route.meta.canKeep) {
      // this.houselist = []
      const toggleArray = ["district", "leaseSale", "year", "huxing"];
      // 避免获取不到dom
      this.isClosed = true;
      setTimeout(() => {
        for (let i = 0; i < toggleArray.length; i++) {
          const itemCol = toggleArray[i];
          if (this.$refs[itemCol]) {
            this.$refs[itemCol].toggle(false);
          }
        }
      }, 100);
      await this.getListConfigInit();
    }
  },
  methods: {
    ...mapMutations('city', ['setSwitchCityInfo']),
    async getEchartData () {
      const postData = {
        uptown_id: this.searchPostGetData.searchUptownId || "",//	否	string	小区idthis.searchPostGetData.searchUptownId || ""
      }
      let res = await this.$store.dispatch(`home/${this.postGetData.leaseSaleIndex == 1 ? 'getAppFangcDealaUptownPrice' : 'getAppFangcDealaUptownRentPrice'}`, postData);
      if (res.length > 0) {
        this.isShowEchart = true
        res.forEach(item => {
          let arr = [item.y, item.avg]
          this.avgNumArr.push(item.avg)
          this.uptownPriceList.push(arr)
        })
        this.priceMin = Math.floor(Math.min.apply(null, this.avgNumArr))// 获取最小值并向下取整
        this.priceMax = Math.ceil(Math.max.apply(null, this.avgNumArr)) // 获取最大值并向上取整

        this.$nextTick(() => {
          const chart = this.$refs.chart
          if (chart) {
            const myChart = echarts.init(chart)
            const option = {
              legend: {
              },
              tooltip: {
                show: false
              },
              dataset: {
                // source: [
                //   ['2019', 3.95],
                // ],
                source: this.uptownPriceList,
              },
              xAxis: {
                type: 'category',
                nameTextStyle: {
                  align: 'center',
                },
                axisLabel: {
                  color: '#737376', // 坐标轴文字的颜色
                },
                axisTick: {
                  show: false,
                },
                axisLine: {
                  lineStyle: {
                    color: '#F2F2F2', //x坐标轴线第一条颜色
                  }
                },

              },
              yAxis: {
                type: 'value',
                axisTick: {
                },
                splitLine: {
                  lineStyle: {
                    color: '#F2F2F2', //坐标轴线颜色
                  }
                },
                axisLabel: {
                  formatter: value => {
                    return value + `${this.postGetData.leaseSaleIndex == 1 ? 'w' : ''}`;
                  }
                },
                min: this.priceMin, // 坐标轴刻度最小值
                max: this.priceMax + 1, // 坐标轴刻度最大值
                minInterval: 1,
                maxInterval: 20,
                // interval: this.postGetData.leaseSaleIndex == 1 ? 1 : parseInt((this.priceMax - this.priceMin) / 3),
                // interval: parseInt((this.priceMax - this.priceMin) / 3) < 1 ? '1' : parseInt((this.priceMax - this.priceMin) / 3),
                // interval: {
                //   formatter: value => {
                //     return parseInt(value)
                //   }
                // }
              },
              series: [
                {
                  type: 'line',
                  symbolSize: 8, // 拐点大小
                  label: {
                    color: '#FFCE09',
                    fontSize: '13', // 更改文字大小
                    fontWeight: 'bold',
                    show: true,
                    position: 'top',
                    formatter: params => {
                      if (params.dataIndex == this.uptownPriceList.length - 1) {
                        // return '{active|' + params.value[1] + (this.postGetData.leaseSaleIndex == 1 ? 'w' : '{activeRent|元/㎡}') + '}'
                        return this.postGetData.leaseSaleIndex == 1 ? '{active|' + params.value[1] + 'w}' : '{activedemo|' + params.value[1] + '}{activeRentdemo|元/㎡}'
                      }
                      return params.value[1] + (this.postGetData.leaseSaleIndex == 1 ? 'w' : '{activeRent|元/㎡}')
                    },
                    rich: {
                      active: {
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        backgroundColor: '#FF4844',
                        padding: [
                          3,  // 上
                          4, // 右
                          3,  // 下
                          4, // 左
                        ],
                        borderRadius: [3, 3, 3, 3],// 设置圆角
                      },
                      activeRent: {
                        fontWeight: 'bold',
                        verticalAlign: 'bottom',
                        fontSize: '9', // 更改文字大小
                      },
                      activedemo: {
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        backgroundColor: '#FF4844',
                        padding: [
                          3,  // 上
                          0, // 右
                          3,  // 下
                          4, // 左
                        ],
                        borderRadius: [3, 0, 0, 3],// 设置圆角
                      },
                      activeRentdemo: {
                        fontWeight: 'bold',
                        verticalAlign: 'bottom',
                        fontSize: '9', // 更改文字大小
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        backgroundColor: '#FF4844',
                        padding: [
                          6,  // 上
                          4, // 右
                          3,  // 下
                          0, // 左
                        ],
                        borderRadius: [0, 3, 3, 0],// 设置圆角
                      }
                    }
                  },
                  itemStyle: {
                    color: '#FFCE09',
                    fontSize: '30', // 更改坐标轴文字
                  },
                  textStyle: {
                  }

                },
              ],
              grid: {
                left: '0', //默认10%
                right: '0', //默认10%
                bottom: '0', //默认60
                top: "20%",
                containLabel: true,
                //grid区域是否包含坐标轴的刻度标签
              },
            }
            myChart.clear()
            // const autoHeight = this.uptownPriceList.length * 20
            // myChart.resize({ height: autoHeight })//设置图表动态高度
            myChart.setOption(option)
          }
        })

      }
    },
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
      this.postGetData.city_id = this.$route.query.city_id || this.switchCityInfo.city_id
      this.postGetData.loading = true;
      let res = await this.$store.dispatch(`home/${this.postGetData.leaseSaleIndex == 1 ? 'actAppFangDealShouseList' : 'actAppFangDealRentList'}`, this.postGetData);
      this.postGetData.loading = false;
      if (res && res.rows) {
        // this.postGetData.finished = true;
        //如果返回的条数小于每页的条数，则加载完了
        if (res.rows.length < this.postGetData.page_size) {
          this.postGetData.finished = true;
        }
        this.houselist.push(...res.rows)
      } else {
        this.postGetData.finished = true;
        this.$commonUtils.appLog.log("加载列表数据不正确", res)
      }
    },
    //初始化搜索选项
    async getListConfigInit () {
      this.houselist = [];
      this.isChangecity = false; //切换城市弹窗
      this.popCityname = ''; // 弹窗城市名字 
      this.popCityId = '';// 切换的城市id
      this.changeChooseMetroId = {}; // 选中切换弹窗的该地铁路线的id
      if (!this.$commonUtils.utilCore.empty(this.searchPostGetData) && this.pageFrom !== "common-index") {
        this.postGetData.inputKeyWord = this.searchPostGetData.inputKeyWord;
        this.postGetData.searchKeyWord = this.searchPostGetData.searchKeyWord || "";
        this.postGetData.searchUptownId = this.searchPostGetData.searchUptownId || "";
        this.postGetData.page = 0;
        this.postGetData.loading = true;
        this.postGetData.finished = false;
        if (this.pageFrom === "home-detail-searchdeal") {
          this.postGetData.setHuxing = [];
          this.postGetData.setLayouthall = "";
          this.postGetData.setYear = []
          this.postGetData.setDistrict = {}
          this.postGetData.setDistrictList = []
          this.postGetData.setDistrictMetro = {}
          this.postGetData.setDresslistMetro = []
          this.postGetData.setLeaseSale = []
          this.postGetData.leaseSaleIndex = this.searchPostGetData.leaseSaleIndex
        }
        // 都是从详情页的成交同户型进来的 
        else if (this.pageFrom === "home-detail-dealSaleDetail" || "home-detail-secondhouseDetail" || "home-detail-dealRentDetail") {
          this.postGetData.setHuxing = this.searchPostGetData.setHuxing || [];
          this.postGetData.setLayouthall = this.searchPostGetData.setLayouthall || "";
          this.postGetData.setYear = this.searchPostGetData.setYear || [];
          this.postGetData.setLeaseSale = [];
          this.postGetData.leaseSaleIndex = this.searchPostGetData.leaseSaleIndex
        }
        // 合并列表进来的筛选
        if (this.pageFrom === "home-list-mergelist") {
          if (!this.$commonUtils.utilCore.empty(this.searchPostGetData)) {
            this.postGetData = this.$commonUtils.utilCore.deepClone(this.searchPostGetData);
            this.postGetData.page = 0
            this.postGetData.loading = true;
            this.postGetData.finished = false;
          }
        }
      } else {
        this.huxing = [];//户型
        // 区域
        this.district = [];
        //区域地址
        this.addresslist = [];
        // 地铁区域(线路)
        this.districtMetro = [];
        //地铁区域地址(站点)
        this.addresslistMetro = [];
        this.tabAreaIndex = 0;//区域tab切换
        this.postGetData = { //搜索选择的条件
          tabAreaIndex: 0,//区域tab切换 总是 等于 this.tabAreaIndex
          setDiskIndex: [],//当前选择的标签
          setDistrict: {},//区域，
          setDistrictList: [],//区域地址
          setDistrictMetro: {},//地铁线
          setDresslistMetro: [],//地铁站
          setHuxing: [],//户型
          setLayouthall: "", // 厅数
          setLeaseSale: [],//选择的租售类型
          setYear: [],// 选择的年份
          searchKeyWord: "",//搜索关键字
          searchUptownId: "",
          inputKeyWord: "",//
          city_id: this.$route.query.city_id || 8,//	否	string	城市id 默认8
          page: 0,//	否	string	页码 默认1
          page_size: 10,//	否	string	每页显示数 默认10
          loading: false,//列表数据加载中
          finished: false,//列表数据已经加载完毕
        };
        this.cloneObject = {};
        await this.$store.commit('home/setSearchPostGetData', {
          tabAreaIndex: 0,//区域tab切换 总是 等于 this.tabAreaIndex
          setDiskIndex: [],//当前选择的标签
          setDistrict: {},//区域，
          setDistrictList: [],//区域地址
          setDistrictMetro: {},//地铁线
          setDresslistMetro: [],//地铁站
          setHuxing: [],//户型
          setLayouthall: "", // 厅数
          setLeaseSale: [],//选择的租售类型
          setYear: [], // 选择的年份
          city_id: this.$route.query.city_id || 8,//	否	string	城市id 默认8
          page: 0,//	否	string	页码 默认1
          page_size: 10,//	否	string	每页显示数 默认10
          loading: false,//列表数据加载中
          finished: false,//列表数据已经加载完毕
        });
        //是从搜索页过来，则把搜索条件加上
        if (!this.$commonUtils.utilCore.empty(this.searchPostGetData)) {
          //如果当前的搜索件条是同一种房源的，则加载起来
          if (this.searchPostGetData.houseType == this.postGetData.houseType) {
            let tmp_info = this.$commonUtils.utilCore.deepClone(this.searchPostGetData)
            this.postGetData = this.$commonUtils.utilCore.deepMerge(this.postGetData, tmp_info)
            //区域默认选择值
            this.tabAreaIndex = this.postGetData.tabAreaIndex || 0
          }
        }
        this.postGetData.leaseSaleIndex = 1; // 默认选择售
        this.postGetData.loading = true;
        this.postGetData.finished = false;
      }
      if (this.$route.query.uptown_id) {
        this.postGetData.searchUptownId = this.$route.query.uptown_id
      }
      //重置echarts数据
      this.resetEchart()
      if (!this.$commonUtils.utilCore.empty(this.postGetData.searchUptownId)) {
        // this.isShowEchart = true
        this.getEchartData()
      }
      // 是否显示区域筛选
      if (this.$commonUtils.utilCore.empty(this.postGetData.inputKeyWord)) {
        this.isShowArea = true
      } else {
        this.isShowArea = false
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

      //是从搜索页过来，则把搜索条件加上
      if (
        !this.$commonUtils.utilCore.empty(this.searchPostGetData)
        // && this.$route.query.pageType
        // && this.$route.query.pageType == "search"
      ) {
        //如果当前的搜索件条是同一种房源的，则加载起来
        if (this.searchPostGetData.houseType == this.postGetData.houseType) {
          // let tmp_info = this.$commonUtils.utilCore.deepClone(this.searchPostGetData)
          // this.postGetData = this.$commonUtils.utilCore.deepMerge(this.postGetData, tmp_info)
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
      let tmp_query = {
        id: item.shouse_id,//	是	string	二手房id
        broker_id: item.broker_id,//	否	string	经纪人id
        share_broker_id: ""//	否	string	分享者经纪人id
      }
      this.toolsGoPageView({
        path: '/home/detail/secondhouseDetail',
        query: tmp_query
      })
    },
    //点击关闭按钮
    async closeDropdownMenu (type, isClose = true) {
      //判断两个值的输入是否完成
      if (this.postGetData.loading) return
      //进行手动搜索
      this.postGetData.page = 0;
      this.postGetData.page_size = 10
      this.postGetData.loading = false;
      this.postGetData.finished = false;
      this.postGetData.city_id = this.$route.query.city_id || this.switchCityInfo.city_id
      // 切换需要重新搜索列表 下拉列表不收回
      if (isClose) {
        this.$refs[type].toggle();
      }
      this.handleDropdownClone(1);//上面改变了postGetData的key值，避免loading不出现, 所以再深拷贝一次
      this.handleDropdownClone(0);
      //把数据存在vuex里去
      this.$store.commit('home/setSearchPostGetData', this.postGetData);
      //清除当前列表数据
      this.houselist = []
      await this.actOnLoad();
    },
    // 重置函数
    resetFunciton (type) {
      if (type == 'district') {//区域
        this.postGetData.setDistrict = ""
        this.postGetData.setDistrictMetro = ""
        this.postGetData.setDistrictList = []
        this.postGetData.setDresslistMetro = []
      } else if (type == "huxing") {//户型
        this.postGetData.setHuxing = []
      }
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
            // 是否需要切换其他城市的弹窗
            if (isPop) { // 切换城市不弹，点击再弹
              if (item.back_city_id && item.back_city_id != 0) {
                this.popCityId = item.back_city_id
                if (item.back_city_id == '9') {
                  this.popCityname = '佛山'
                } else if (item.back_city_id == '8') {
                  this.popCityname = '广州'
                }
                this.isChangecity = true
                this.changeChooseMetroId = item.id
              }
            }
          }
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
      this.$store.commit('home/setSearchPostGetData', this.postGetData);
      //进行跳转
      this.toolsGoPageView({ path: '/home/detail/searchdeal', query: { typeIndex: this.postGetData.leaseSaleIndex } })
    },
    async changeCity () {
      let switchData = {}
      if (this.popCitfyId == '8') {
        switchData = {
          city_id: "8",
          city_name: "广州",
          is_69: true
        }
      } else if (this.popCityId == '9') {
        switchData = {
          city_id: "9",
          city_name: "佛山",
          is_69: true
        }
      }
      this.$commonUtils.utilCore.showLoading("", { overlay: true });
      this.setSwitchCityInfo(switchData)  // 切换城市
      this.getListConfigInit(); // 切换城市地铁路线
      const postData = {
        metro_line_id: this.postGetData.setDistrictMetro.id, // 	是	string	线路id
        metro_station_id: this.postGetData.setDresslistMetro.pop().id,//	是	string	站点id
      }
      const res = await this.$store.dispatch('city/getAppFangBaseDataChangeMetro', postData);
      if (res) {
        this.selectTabArea(1, 'district') // 切换 区域 与 地铁 的选择
        this.closeDropdownMenu('district', false) // 搜索列表
        let newLine = {}
        let newStation = {}
        // 异步渲染
        setTimeout(() => {
          this.districtMetro.forEach((item, index) => {
            if (res.data.metro_line_id == item.id) {
              newLine = Object.assign(item)
              return
            }
          })
          this.chooseDistrict(newLine, 'district')
        }, 500)
        setTimeout(() => {
          this.addresslistMetro.forEach((item, index) => {
            if (res.data.metro_station_id == item.id) {
              newStation = Object.assign(item)
              return
            }
          })
          this.chooseDistrictAddress(newStation, 'district', false)
        }, 700);
        this.isChangecity = false
        this.$commonUtils.utilCore.closeLoading()
      }
    },
    cancel () {
      this.isChangecity = false
      let isHave = this.checkArrayValue(this.postGetData.setDresslistMetro, 'id', this.changeChooseMetroId);
      this.postGetData.setDresslistMetro.splice(isHave, 1);
    },
    // 深拷贝筛选数据, type 0：赋值，type 1： 深拷贝
    handleDropdownClone (type = 0) {
      if (this.isClosed) return;
      const cloneArray = ["huxing", "district", "addresslist", "districtMetro", "addresslistMetro", "tabPriceIndex", "tabAreaIndex", "rentSaleList", "dealYearList", "postGetData"];
      for (let i = 0; i < cloneArray.length; i++) {
        const item = cloneArray[i];
        // 赋值
        if (type === 0) {
          this[item] = this.cloneObject[item];
        } else {
          // 拷贝
          this.cloneObject[item] = this.$commonUtils.utilCore.deepClone(this[item]);
        }
      }
    },
    goIm () {
      if (!this.isLogin) return location._fromCommission = 1, this.toolsGoPageView({ path: '/common/index', query: { fromCommission: true, path: '/user/index' } });
      this.$store.dispatch('im/goIm')
    },
    // 筛选点击事件（租售类型，年份）
    changeRentSaleType (item, type) {
      this.houselist = []
      if (type == 'leaseSale') {
        this.postGetData.setLeaseSale.splice(0, 1);
        this.postGetData.setLeaseSale.push(item);
        if (this.postGetData.leaseSaleIndex != item.id) {
          this.postGetData.leaseSaleIndex = item.id
          //重置echarts数据
          this.resetEchart()
          this.getEchartData()
        }
      } else {
        this.chooseYearIndex = item.val
        this.postGetData.setYear.splice(0, 1);
        this.postGetData.setYear.push(item);
      }
      //不要关那么快
      setTimeout(() => {
        this.closeDropdownMenu(type)
      }, 300)
    },
    computedHeight () {
      const navheight = document.querySelector(".fixed-container")
      this.navheight = navheight.offsetHeight
    },
    async goDealDetail (i) {
      if (this.postGetData.leaseSaleIndex == 1) {
        this.toolsGoPageView({
          path: '/home/detail/dealSaleDetail',
          query: { shouse_trade_id: i.shouse_trade_id }
        })
      } else {
        this.toolsGoPageView({
          path: '/home/detail/dealRentDetail',
          query: { rent_trade_id: i.rent_trade_id }
        })
      }
    },
    //重置echarts数据
    resetEchart () {
      this.uptownPriceList = [] // 成交折线图数据
      this.avgNumArr = []
      this.priceMin = ''//坐标轴刻度最小值
      this.priceMax = ''  // 坐标轴刻度最大值
      this.isShowEchart = false
    },
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
    touch-action: pan-x;
    .icon-return {
      width: 0.45rem;
      height: 0.4rem;
      padding-right: 0.4rem;
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    .header {
      padding: 0.2rem 0.4rem 0 0.4rem; // 0.2rem 0.74rem 0 0.4rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .search {
        width: 5.4rem; //  6.7rem
        height: 0.9rem;
        box-shadow: 0rem 0.02rem 0.2rem 0rem rgba(209, 209, 209, 0.5);
        background: #ffffff;
        position: relative;
        input {
          width: 100%;
          height: 100%;
          border-radius: 0.1rem;
          border: 0.01rem solid #cecece;
          font-size: 0.32rem;
          font-weight: bold;
          display: block;
          padding-left: 0.76rem;
          box-sizing: border-box;
        }
        .icon-magnifier {
          width: 0.28rem;
          height: 0.28rem;
          position: absolute;
          top: 0.3rem;
          left: 0.36rem;
        }
      }
      .header-right {
        font-size: 0.3rem;
        font-weight: bold;
        color: #000000;
      }
    }
    .echart-container {
      width: 6.7rem;
      background: #ffffff;
      box-shadow: 0rem 0.02rem 0.2rem 0rem rgba(209, 209, 209, 0.5);
      border: 0.01rem solid #cecece;
      border-radius: 0.1rem;
      margin: 0.2rem 0.4rem 0;
      padding: 0.3rem 0.4rem 0.24rem 0.2rem;
      box-sizing: border-box;
      .e-header {
        font-size: 0.28rem;
        font-weight: bold;
        color: #000000;
      }
      .e-box {
        // height: 2rem;
        padding: 0.24rem 0;
      }
      .e-footer {
        display: flex;
        align-items: center;
        .icon-excelmark {
          width: 0.22rem;
          height: 0.22rem;
          display: block;
          margin-right: 0.05rem;
        }
        font-size: 0.22rem;
        font-weight: 400;
        color: #999999;
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
            &:nth-child(4n) {
              margin-right: 0;
            }
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
      .house-sort {
        .sort-item {
          height: 1.1rem;
          font-size: 0.28rem;
          font-weight: 400;
          color: #000000;
          text-align: center;
          line-height: 1.1rem;
          border-bottom: 0.01rem solid #e5e5e5;
        }
      }

      /deep/ .van-dropdown-menu {
        .van-dropdown-menu__bar {
          box-shadow: none;
          // padding-right: 0.2rem;
          border-bottom: 0.02rem solid #e6e6e6;
        }
        .van-dropdown-item__option {
          text-align: center;
        }
      }
    }
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
        background: #ffce09;
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
  .type-active {
    width: 1.45rem !important;
    height: 0.6rem !important;
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
  .deal-container {
    .deal-box {
      padding: 0.4rem 0 0.36rem;
      margin: 0 0.54rem;
      border-bottom: 0.02rem solid #f0f0f0;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      .deal-left-box {
        width: 0.84rem;
        margin-right: 0.4rem;
        .deal-left {
          width: 0.84rem;
          height: 0.82rem;
          background: #87d730;
          font-size: 0.4rem;
          font-weight: 500;
          color: #ffffff;
          line-height: 0.82rem;
          text-align: center;
          border-radius: 50%;
          &.deal-active {
            background: #5ba8ff !important;
          }
        }
      }

      .deal-right {
        .deal-address {
          font-size: 0.3rem;
          font-weight: bold;
          color: #303030;
          line-height: 0.4rem;
        }
        .deal-label {
          font-size: 0.22rem;
          font-weight: 400;
          color: #000000;
        }
        .deal-time {
          font-size: 0.22rem;
          font-weight: 400;
          color: #000000;
        }
        .deal-price {
          padding-top: 0.05rem;
          display: flex;
          align-items: flex-end;
          .price-left {
            font-size: 0.3rem;
            font-weight: bold;
            color: #ff3100;
            padding-right: 0.1rem;
            .price-unit {
              font-size: 0.2rem;
            }
          }
          .price-right {
            font-size: 0.22rem;
            font-weight: 400;
            color: #999999;
          }
        }
        .rent-price {
          color: #ff3100;
          font-weight: bold;
          font-size: 0.2rem;
          display: flex;
          align-items: baseline;
          span {
            font-size: 0.3rem;
          }
        }
      }
      .deal-padbottom {
        padding-bottom: 0.1rem;
      }
    }
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
  /deep/ .van-dropdown-item__content {
    max-height: $dropdownContent;
  }
  /deep/ .van-dropdown-menu__item {
    position: relative;
    &:not(:last-child) {
      &::after {
        content: "";
        display: block;
        width: 0.02rem;
        height: 0.37rem;
        background: #dfdfdf;
        position: absolute;
        right: 0;
      }
    }
    &:nth-child(2) {
      &::after {
        content: "";
        display: block;
        width: 0.02rem;
        height: 0.37rem;
        background: #dfdfdf;
        position: absolute;
        right: -0.1rem;
      }
    }
    &:nth-child(3) {
      &::after {
        content: "";
        display: block;
        width: 0.02rem;
        height: 0.37rem;
        background: #dfdfdf;
        position: absolute;
        right: -0.15rem;
      }
    }
  }
  .sort-active {
    background: #ffce09;
  }
  .rentSaleClass /deep/ .van-dropdown-item__content {
    width: 2rem;
    left: 1.85rem;
  }
  .rentSaleShowClass /deep/ .van-dropdown-item__content {
    width: 2.52rem;
    left: 0;
  }
  .dealYearClass /deep/ .van-dropdown-item__content {
    width: 2rem;
    left: 3.8rem;
  }
  .dealYearShowClass /deep/ .van-dropdown-item__content {
    width: 2.52rem;
    left: 2.53rem;
  }
}
</style>
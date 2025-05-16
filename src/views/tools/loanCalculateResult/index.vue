
<template>
  <div>
    <!-- 顶部导航 -->
    <gni-nav-bar :pageTitle="pageTitle" @onClickLeft="onClickBack" :hideRight="false"></gni-nav-bar>
    <div class="wrap">
      <van-tabs v-model="tabsActive" @change="resultTabClick" animated swipeable sticky>
        <van-tab name="1">
          <template #title>
            <div class="item-title">
              <span>等额本息</span>
            </div>
          </template>
          <van-list>
            <v-chart class="chart" :option="barOptions0" :auto-resize="true" />
            <van-cell>
              <van-grid v-if="pageParam.type=='com'" :center="false" :column-num="4" :border="false">
                <van-grid-item text="贷款总额" />
                <van-grid-item :text="result0.loanAmount+'万'" />
                <van-grid-item text="还款总额" />
                <van-grid-item :text="result0.repayAmount+'万'" />
                <van-grid-item text="支付利息" />
                <van-grid-item :text="result0.interestAmount+'万'" />
              </van-grid>

              <van-grid v-if="pageParam.type!='fund'" :center="false" :column-num="4" :border="false">
                <van-grid-item text="商业贷款" />
                <van-grid-item :text="result0.bizAmount+'万'" />
                <van-grid-item text="商贷还款" />
                <van-grid-item :text="result0.bizRepayAmount+'万'" />
                <van-grid-item text="商贷利息" />
                <van-grid-item :text="result0.bizInterestAmount+'万'" />
                <van-grid-item text="商贷还款月数" />
                <van-grid-item :text="result0.bizMonthes+'月'" />
                <van-grid-item text="商贷每月还款" />
                <van-grid-item :text="result0.bizMonthPayment+'元'" />
              </van-grid>

              <van-grid v-if="pageParam.type!='biz'" :center="false" :column-num="4" :border="false">
                <van-grid-item text="公积金贷款" />
                <van-grid-item :text="result0.fundAmount+'万'" />
                <van-grid-item text="公积金还款" />
                <van-grid-item :text="result0.fundRepayAmount+'万'" />
                <van-grid-item text="公积金利息" />
                <van-grid-item :text="result0.fundInterestAmount+'万'" />
                <van-grid-item :text="'公积金还款月数' + '\u00A0\u00A0\u00A0' + result0.fundMonthes+'月'" />
                <van-grid-item text="公积金每月还款" />
                <van-grid-item :text="result0.fundMonthPayment+'元'" />
              </van-grid>

            </van-cell>
          </van-list>
        </van-tab>
        <van-tab name="2">
          <template #title>
            <div class="item-title">
              <span>等额本金</span>
            </div>
          </template>
          <van-list>
            <v-chart class="chart" :option="barOptions1" :auto-resize="true" />
            <van-cell>
              <van-grid v-if="pageParam.type=='com'" :center="false" :column-num="4" :border="false">
                <van-grid-item text="贷款总额" />
                <van-grid-item :text="result1.loanAmount+'万'" />
                <van-grid-item text="还款总额" />
                <van-grid-item :text="result1.repayAmount+'万'" />
                <van-grid-item text="支付利息" />
                <van-grid-item :text="result1.interestAmount+'万'" />
              </van-grid>

              <van-grid v-if="pageParam.type!='fund'" :center="false" :column-num="4" :border="false">
                <van-grid-item text="商业贷款" />
                <van-grid-item :text="result1.bizAmount+'万'" />
                <van-grid-item text="商贷还款" />
                <van-grid-item :text="result1.bizRepayAmount+'万'" />
                <van-grid-item text="商贷利息" />
                <van-grid-item :text="result1.bizInterestAmount+'万'" />
                <van-grid-item text="商贷还款月数" />
                <van-grid-item :text="result1.bizMonthes+'月'" />
                <van-grid-item text="商贷首月还款" />
                <van-grid-item :text="result1.bizMonthPayment+'元'" />
                <van-grid-item text="商贷每月递减" />
                <van-grid-item :text="result1.bizMonthDecrease+'元'" />
              </van-grid>

              <van-grid v-if="pageParam.type!='biz'" :center="false" :column-num="4" :border="false">
                <van-grid-item text="公积金贷款" />
                <van-grid-item :text="result1.fundAmount+'万'" />
                <van-grid-item text="公积金还款" />
                <van-grid-item :text="result1.fundRepayAmount+'万'" />
                <van-grid-item text="公积金利息" />
                <van-grid-item :text="result1.fundInterestAmount+'万'" />
                <van-grid-item :text="'公积金还款月数' + '\u00A0\u00A0\u00A0' + result1.fundMonthes+'月'" />
                <!-- <van-grid-item text="公积金还款月数" /> -->
                <!-- <van-grid-item :text="result1.fundMonthes+'月'" /> -->
                <van-grid-item text="公积金首月还款" />
                <van-grid-item :text="result1.fundMonthPayment+'元'" />
                <van-grid-item :text="'公积金每月递减' + '\u00A0\u00A0\u00A0' + result1.fundMonthDecrease+'元'" />
                <!-- <van-grid-item text="公积金每月递减" /> -->
                <!-- <van-grid-item :text="result1.fundMonthDecrease+'元'" /> -->

              </van-grid>

            </van-cell>
          </van-list>
        </van-tab>
      </van-tabs>
      <div class="desc-content">
        <p>以上结果仅供参考，请以实际情况为准。</p>
      </div>
      <!-- && pageParam.type!='com' -->
      <customTable v-if="pageParam.type" v-bind="monthData" />

      <div class="touch-ground" v-if="isShare == 0">
        <div class="touch-ground-btn" @click="showShareBox=true">分享</div>
        <!-- 2021.12.28 才哥说暂时先隐藏 -->
        <!-- <div class="touch-ground-btn">咨询</div> -->
      </div>
    </div>

    <!-- 分享 -->
    <van-share-sheet title="分享给好友" v-model="showShareBox" @select="onShareSelect" :options="shareOptions" />
  </div>
</template>

<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import pickerbox from "@/components/yni/picker-box.vue";
import customTable from "@/components/yni/custom-table.vue";

import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import VChart from "vue-echarts";

use([
  CanvasRenderer,
  PieChart,
]);

import { mapState, mapActions } from "vuex";

export default {
  components: {
    gniNavBar,
    pickerbox,
    customTable,
    VChart
  },
  data () {
    return {
      pageTitle: "房贷计算器结果", //页面标题
      tabsActive: 1,//默认显示第一个tab
      showShareBox: false,//是否显示分享

      shareWXInfo: {},//从服务器获取的分享到微信时的数据

      shareOptions: [//分享数据
        {
          name: '微信',
          icon: this.$appConfig.appWebStaticUrl + 'common/icon_share_wechat.png',
        },
        // 2021.12.28 才哥说暂时先隐藏 
        // {
        //   name: '推送裕丰网',
        //   icon: this.$appConfig.appWebStaticUrl + 'house/icon/share_icon2.png',
        // }
      ],
      barOptions0: {
        animation: true,
        backgroundColor: '#ffffff',
        color: ['#ff611a', '#fea726'],
        series: {
          label: {
            normal: {
              fontSize: 26,
              fontWeight: 'bold',
              formatter: '{a|{b}}\n{hr|}\n',
              rich: {
                a: {
                  lineHeight: 20
                }
              }

            }
          },
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['30%', '60%'],
          startAngle: 135,
          data: [],/*[{
            name: '支付利息\n(60%)',
            value: 600
          }, {
            name: '贷款总额\n(40%)',
            value: 400
          }]*/
        }
      },//显示图标的变量
      barOptions1: {
        animation: true,
        backgroundColor: '#ffffff',
        color: ['#ff611a', '#fea726'],
        series: {
          label: {
            normal: {
              fontSize: 26,
              fontWeight: 'bold',
              formatter: '{a|{b}}\n{hr|}\n',
              rich: {
                a: {
                  lineHeight: 20
                }
              }

            }
          },
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['30%', '60%'],
          startAngle: 135,
          data: [],/*[{
            name: '支付利息\n(60%)',
            value: 600
          }, {
            name: '贷款总额\n(40%)',
            value: 400
          }]*/
        }
      },//显示图标的变量
      pageParam: {},//接收页面传过来的参数

      result0: {
        loanAmount: 0,//贷款总额
        repayAmount: 0,//还款总额
        interestAmount: 0,//支付利息
        repayMonthNum: 0,//还款月数
        repayMonthMoney: 0,//月还款额
        echartsData: []
      },
      result1: {
        loanAmount: 0,
        repayAmount: 0,
        interestAmount: 0,
        repayMonthNum: 0,
        repayMonthMoney: 0,
        repayMonthDecrease: 0,//每月递减额
        echartsData: [],
        mouthdataArray: []
      },
      monthData: {//显示月供数据的变量
        tableData: [],
        option: {
          serial: true,
          serialtext: "期数",
          serialclass: "serialclass",
          column: [
            {
              label: "月供金额",
              prop: "monthNum1",
            },
            {
              label: "月供本金",
              prop: "monthNum2",
            },
            {
              label: "月供利息",
              prop: "monthNum3",
            },
            {
              label: "剩余本息",
              prop: "monthNum4",
            }
          ],
        },
      },
      isShare: true, // 控制分享按钮状态
    }
  },
  async mounted () {
    this.getQueryInit();//加载参数
    this.loadData();//组积数据
    this.resultTabClick();//组积表格数据

    this.getWXinit();//初始化微信分享
  },
  methods: {
    ...mapActions("app", ["getWXInfo"]),
    ...mapActions('app', ['getShareApp', 'getCopyMessage']),
    //获取微信分享的信息
    async getWXinit () {
      this.shareWXInfo = await this.getWXInfo({ messageAct: this.$messageAct, update: true, strkeyData: "uid=10000" });
      this.$commonUtils.appLog.log("getWXinit", this.shareWXInfo);
    },
    //获取页面传过来的参数
    getQueryInit () {
      this.isShare = this.$route.query.isShare;
      this.pageParam.type = this.$route.query.type;//贷款类型
      //如果贷款类型为空，则出错
      if (this.$commonUtils.utilCore.empty(this.pageParam.type)) {
        this.$toast("请贷款类型");
        this.onClickBack();
        return false;
      }
      if ("biz" == this.pageParam.type) {
        this.pageParam.bizLoanYear = this.$route.query.bizLoanYear; //商贷年限
        this.pageParam.bizLoanAmount = this.$route.query.bizLoanAmount;//商贷总额
        this.pageParam.bizRate = this.$route.query.bizRate;//商贷利率
      } else if ("com" == this.pageParam.type) {
        this.pageParam.comLoanYear = this.$route.query.comLoanYear; //商贷年限
        this.pageParam.comLoanAmount = this.$route.query.comLoanAmount;//商贷总额
        this.pageParam.comRate = this.$route.query.comRate;//商贷利率
        this.pageParam.comFundLoanAmount = this.$route.query.comFundLoanAmount;//公积金总额
        this.pageParam.comFundRate = this.$route.query.comFundRate;//公积金利率
        this.pageParam.comFundLoanYear = this.$route.query.comFundLoanYear;//公积金年限
      } else if ("fund" == this.pageParam.type) {
        this.pageParam.fundLoanAmount = this.$route.query.fundLoanAmount;//公积金总额
        this.pageParam.fundRate = this.$route.query.fundRate;//公积金利率
        this.pageParam.fundLoanYear = this.$route.query.fundLoanYear;//公积金年限
      } else {
        this.$toast("请正确的贷款类型");
        this.onClickBack();
        return false;
      }
      return true;
    },
    onClickBack () {
      this.$router.go(-1); //返回上一层
    },
    onClickMore () {

    },
    /**
     * 等额本息计算
     * num => 贷款总额
     * year=> 贷款年限
     * lilv=> 贷款利率
     * num1=> 公积金总额
     * year1=> 公积金贷款年限
     * lilv1=> 公积金贷款利率
     */
    benxi (num, year, lilv, fundNum, fundYear, fundLilv) {
      // 每月月供额=〔贷款本金×月利率×(1＋月利率)＾还款月数〕÷〔(1＋月利率)＾还款月数-1〕
      var mouth = parseInt(year) * 12
      var mouthlilv = parseFloat(lilv) / 12 / 100
      var dknum = parseFloat(num) * 10000

      // 每月月供
      var yuegong = (dknum * mouthlilv * Math.pow(1 + mouthlilv, mouth)) / (Math.pow(1 + mouthlilv, mouth) - 1)
      this.yuegong = yuegong



      // 如果是组合贷的话，公积金贷款的信息如下
      var fundmouth = 0;
      var fundmouthlilv = 0;
      var funddknum = 0;
      var fundyuegong = 0;
      if (fundNum) { // 组合贷才有这个变量传参
        fundmouth = parseInt(fundYear) * 12
        fundmouthlilv = parseFloat(fundLilv) / 12 / 100
        funddknum = parseFloat(fundNum) * 10000
        fundyuegong = (funddknum * fundmouthlilv * Math.pow(1 + fundmouthlilv, fundmouth)) / (Math.pow(1 + fundmouthlilv, fundmouth) - 1)
      }

      // 总利息=还款月数×每月月供额-贷款本金
      var totalLixi = mouth * yuegong - dknum
      var fundtotalLixi = fundmouth * fundyuegong - funddknum

      this.totalLixi = totalLixi / 10000
      // 还款总额 总利息+贷款本金
      // var totalPrice = totalLixi + dknum
      var leftFund = totalLixi + dknum
      var fundleftFund = fundtotalLixi + funddknum


      // 循环月份
      var mouthdataArray = []
      var nowmouth = new Date().getMonth()
      var realmonth = 0

      this.monthData.tableData = [];
      // 因为有可能是组合贷进来的，所以就需要获取最大的那个月份
      for (var i = 1; i <= Math.max(mouth, fundmouth); i++) {
        realmonth = nowmouth + i
        var yearlist = Math.floor(i / 12)

        realmonth = realmonth - 12 * yearlist

        if (realmonth > 12) {
          realmonth = realmonth - 12
        }
        // console.log(realmonth)
        // 每月应还利息=贷款本金×月利率×〔(1+月利率)^还款月数-(1+月利率)^(还款月序号-1)〕÷〔(1+月利率)^还款月数-1〕
        var yuelixi = (dknum * mouthlilv * (Math.pow(1 + mouthlilv, mouth) - Math.pow(1 + mouthlilv, i - 1))) / (Math.pow(1 + mouthlilv, mouth) - 1)
        // 每月应还本金=贷款本金×月利率×(1+月利率)^(还款月序号-1)÷〔(1+月利率)^还款月数-1〕
        var yuebenjin = (dknum * mouthlilv * Math.pow(1 + mouthlilv, i - 1)) / (Math.pow(1 + mouthlilv, mouth) - 1)
        leftFund = leftFund - (yuelixi + yuebenjin)

        if (leftFund < 0) {
          leftFund = 0
        }

        // 每月应还利息=贷款本金×月利率×〔(1+月利率)^还款月数-(1+月利率)^(还款月序号-1)〕÷〔(1+月利率)^还款月数-1〕
        var fundyuelixi = fundNum ? (funddknum * fundmouthlilv * (Math.pow(1 + fundmouthlilv, fundmouth) - Math.pow(1 + fundmouthlilv, i - 1))) / (Math.pow(1 + fundmouthlilv, fundmouth) - 1) : 0
        // 每月应还本金=贷款本金×月利率×(1+月利率)^(还款月序号-1)÷〔(1+月利率)^还款月数-1〕
        var fundyuebenjin = fundNum ? (funddknum * fundmouthlilv * Math.pow(1 + fundmouthlilv, i - 1)) / (Math.pow(1 + fundmouthlilv, fundmouth) - 1) : 0

        fundleftFund = fundleftFund - (fundyuelixi + fundyuebenjin)
        if (fundleftFund < 0) {
          fundleftFund = 0
        }

        var monthNum1 = 0;
        var monthNum2 = 0;
        var monthNum3 = 0;
        // 因为有可能是组合贷，所以需要求商贷和公积金贷的月份的最小月份，就是它们的最后一个月份的数据
        // 因为最后一个月的数据还是要还银行的，不能简单判断leftFund（剩下本金和利息）为0就直接全部为0；
        var minMonth = Math.min(mouth, fundmouth)
        if ((i == minMonth) || minMonth == 0) {//如果当前的轮训已经是最小月份了或者纯贷款商业贷款或者纯公积金贷款
          // 如果商贷是最小年份
          if (mouth == minMonth || minMonth == 0) {//如果是商业贷款最小年份或者只是纯贷款商业贷款而已
            monthNum1 = yuelixi + yuebenjin
            monthNum2 = yuebenjin
            monthNum3 = yuelixi
          }
          // 如果公积金贷是最小年份
          if (fundmouth == minMonth || minMonth == 0) {//如果是公积金贷款最小年份或者只是纯贷款公积金贷款而已
            monthNum1 += fundyuelixi + fundyuebenjin
            monthNum2 += fundyuebenjin
            monthNum3 += fundyuelixi
          }
        } else {
          // 如果不是最后一个月，那么就判断如果商业贷款leftFund和公积金贷款fundleftFund（剩下本金和利息）任意一方为0就为0，而不能再跟其他的加上了
          //否则本来商业贷款20年的，公积金贷款30年的，第241期就会有商业贷款的本金加上公积金贷款的本金了
          monthNum1 = (leftFund ? yuelixi + yuebenjin : 0) + (fundleftFund ? fundyuelixi + fundyuebenjin : 0)
          monthNum2 = (leftFund ? yuebenjin : 0) + (fundleftFund ? fundyuebenjin : 0)
          monthNum3 = (leftFund ? yuelixi : 0) + (fundleftFund ? fundyuelixi : 0)
        }
        mouthdataArray[i - 1] = {
          monthName: realmonth + '月',
          monthNum1: (monthNum1).toFixed(2), //月供金额
          monthNum2: (monthNum2).toFixed(2),           //月供本金
          monthNum3: (monthNum3).toFixed(2),             //月供利息
          monthNum4: (leftFund + fundleftFund).toFixed(2),            //剩余本息
          topNum: i
        }
      }
      //this.mouthdataArray = mouthdataArray
      this.monthData.tableData = mouthdataArray;
    },
    /**
     * 等额本金计算
     * num => 贷款总额
     * year=> 贷款年限
     * lilv=> 贷款利率
     * num1=> 公积金总额
     * year1=> 公积金贷款年限
     * lilv1=> 公积金贷款利率
     */
    benjin (num, year, lilv, fundNum, fundYear, fundLilv) {
      var mouth = parseInt(year) * 12
      var mouthlilv = parseFloat(lilv) / 12 / 100
      var dknum = parseFloat(num) * 10000
      var yhbenjin = 0 // 首月还款已还本金金额是0
      // 每月应还本金=贷款本金÷还款月数
      var everymonthyh = dknum / mouth
      // 每月月供额=(贷款本金÷还款月数)+(贷款本金-已归还本金累计额)×月利率
      var yuegong = everymonthyh + (dknum - yhbenjin) * mouthlilv

      // 如果是组合贷的话，公积金贷款的信息如下
      var fundmouth = 0;
      var fundmouthlilv = 0;
      var funddknum = 0;
      var fundyhbenjin = 0;
      var fundeverymonthyh = 0;
      var fundyuegong = 0;
      if (fundNum) { // 组合贷才有这个变量传参
        fundmouth = parseInt(fundYear) * 12
        fundmouthlilv = parseFloat(fundLilv) / 12 / 100
        funddknum = parseFloat(fundNum) * 10000
        fundyhbenjin = 0 // 首月还款已还本金金额是0
        // 每月应还本金=贷款本金÷还款月数
        fundeverymonthyh = funddknum / fundmouth
        // 每月月供额=(贷款本金÷还款月数)+(贷款本金-已归还本金累计额)×月利率
        fundyuegong = fundeverymonthyh + (funddknum - fundyhbenjin) * fundmouthlilv
      }

      this.yuegong = yuegong + fundyuegong
      // 每月月供递减额=每月应还本金×月利率=贷款本金÷还款月数×月利率
      var yuegongdijian = everymonthyh * mouthlilv + fundeverymonthyh * fundmouthlilv
      this.yuegongdijian = yuegongdijian
      // 总利息=〔(总贷款额÷还款月数+总贷款额×月利率)+总贷款额÷还款月数×(1+月利率)〕÷2×还款月数-总贷款额
      var totalLixi = (((everymonthyh + dknum * mouthlilv + (dknum / mouth) * (1 + mouthlilv)) / 2) * mouth - dknum)// + (((fundeverymonthyh + funddknum * fundmouthlilv + (funddknum / fundmouth) * (1 + fundmouthlilv)) / 2) * fundmouth - funddknum)
      var fundtotalLixi = fundNum ? (((fundeverymonthyh + funddknum * fundmouthlilv + (funddknum / fundmouth) * (1 + fundmouthlilv)) / 2) * fundmouth - funddknum) : 0
      this.totalLixi = totalLixi / 10000

      // 还款总额 总利息+贷款本金
      // var totalPrice = totalLixi + dknum //+ funddknum
      var leftFund = totalLixi + dknum
      var fundleftFund = fundtotalLixi + funddknum

      // 循环月份
      var mouthdataArray = []
      var nowmouth = new Date().getMonth()
      var realmonth = 0
      this.monthData.tableData = [];
      // 因为有可能是组合贷进来的，所以就需要获取最大的那个月份
      for (var i = 1; i <= Math.max(mouth, fundmouth); i++) {
        realmonth = nowmouth + i
        var yearlist = Math.floor(i / 12)

        realmonth = realmonth - 12 * yearlist

        if (realmonth > 12) {
          realmonth = realmonth - 12
        }
        yhbenjin = everymonthyh * (i - 1)
        fundyhbenjin = fundeverymonthyh * (i - 1)
        var yuebenjin = everymonthyh + (dknum - yhbenjin) * mouthlilv
        var fundyuebenjin = fundeverymonthyh + (funddknum - fundyhbenjin) * fundmouthlilv
        // 每月应还利息=剩余本金×月利率=(贷款本金-已归还本金累计额)×月利率
        var yuelixi = (dknum - yhbenjin) * mouthlilv
        var fundyuelixi = ((funddknum - fundyhbenjin) * fundmouthlilv)
        leftFund = leftFund - yuebenjin
        if (leftFund < 0) {
          leftFund = 0
        }
        fundleftFund = fundleftFund - fundyuebenjin
        if (fundleftFund < 0) {
          fundleftFund = 0
        }

        mouthdataArray[i - 1] = {
          monthName: realmonth + '月',
          monthNum1: ((leftFund ? yuelixi : 0) + (fundleftFund ? fundyuelixi : 0) + (leftFund ? everymonthyh : 0) + (fundleftFund ? fundeverymonthyh : 0)).toFixed(2), //月供金额
          monthNum2: ((leftFund ? everymonthyh : 0) + (fundleftFund ? fundeverymonthyh : 0)).toFixed(2),           //月供本金
          monthNum3: ((leftFund ? yuelixi : 0) + (fundleftFund ? fundyuelixi : 0)).toFixed(2),             //月供利息
          monthNum4: (leftFund + fundleftFund).toFixed(2),            //剩余本息
          topNum: i
        }
      }
      this.monthData.tableData = mouthdataArray;
    },
    // 等额本息还款的月还款额(参数:年利率,贷款总额,贷款总月数)
    getMonthMoney0 (rate, total, month) {
      const rateMonth = rate / 12
      return total * rateMonth * Math.pow(1 + rateMonth, month) / (Math.pow(1 + rateMonth, month) - 1)
    },
    // 等额本金还款的月还款额(参数:年利率,贷款总额,贷款总月数,贷款当前月索引0～length-1)
    getMonthMoney1 (rate, total, month, index) {
      const rateMonth = rate / 12
      const moneyMonth = total / month
      return (total - moneyMonth * index) * rateMonth + moneyMonth
    },
    async loadData () {
      if (this.pageParam.type == 'biz') {//商业贷款
        const rate = this.pageParam.bizRate / 100
        const total = this.pageParam.bizLoanAmount * 10000
        const month = this.pageParam.bizLoanYear * 12

        //等额本息
        const repayMonthMoney0 = this.getMonthMoney0(rate, total, month)
        const repayAmount0 = repayMonthMoney0 * month
        const interestAmount0 = repayAmount0 - total

        //等额本金
        const repayMonthMoney1 = this.getMonthMoney1(rate, total, month, 0)
        const repayMonthDecrease = repayMonthMoney1 - this.getMonthMoney1(rate, total, month, 1)
        let repayAmount1 = 0
        for (let i = 0; i < month; i++) {
          repayAmount1 += this.getMonthMoney1(rate, total, month, i)
        }
        const interestAmount1 = repayAmount1 - total

        this.result0.loanAmount = (total / 10000).toFixed(2)
        this.result0.repayAmount = (repayAmount0 / 10000).toFixed(2)
        this.result0.interestAmount = (interestAmount0 / 10000).toFixed(2)
        this.result0.repayMonthNum = month
        this.result0.repayMonthMoney = repayMonthMoney0.toFixed(2)

        this.result1.loanAmount = (total / 10000).toFixed(2)
        this.result1.repayAmount = (repayAmount1 / 10000).toFixed(2)
        this.result1.interestAmount = (interestAmount1 / 10000).toFixed(2)
        this.result1.repayMonthNum = month
        this.result1.repayMonthMoney = repayMonthMoney1.toFixed(2)
        this.result1.repayMonthDecrease = repayMonthDecrease.toFixed(2)

        this.result1.bizAmount = this.result0.bizAmount = parseFloat(total / 10000).toFixed(2)
        this.result0.bizRepayAmount = parseFloat(repayAmount0 / 10000).toFixed(2)
        this.result1.bizRepayAmount = parseFloat(repayAmount1 / 10000).toFixed(2)
        this.result0.bizInterestAmount = parseFloat(interestAmount0 / 10000).toFixed(2)
        this.result1.bizInterestAmount = parseFloat(interestAmount1 / 10000).toFixed(2)
        this.result1.bizMonthes = this.result0.bizMonthes = parseInt(month)
        this.result0.bizMonthPayment = parseFloat(repayMonthMoney0).toFixed(2)
        this.result1.bizMonthPayment = parseFloat(repayMonthMoney1).toFixed(2)
        this.result1.bizMonthDecrease = this.result0.bizMonthDecrease = parseFloat(repayMonthDecrease).toFixed(2)

      } else if (this.pageParam.type == 'com') {//组合贷款
        const month = parseFloat(this.pageParam.comLoanYear || 0) * 12
        const fundMonthes = parseFloat(this.pageParam.comFundLoanYear || 0) * 12
        this.result1.bizMonthes = this.result0.bizMonthes = parseInt(month)
        this.result1.fundMonthes = this.result0.fundMonthes = parseInt(fundMonthes)

        const rateBiz = this.pageParam.comRate / 100
        const totalBiz = this.pageParam.comLoanAmount * 10000
        this.result1.bizAmount = this.result0.bizAmount = parseFloat(totalBiz / 10000).toFixed(2)

        const repayMonthMoney0Biz = this.getMonthMoney0(rateBiz, totalBiz, month)
        const repayAmount0Biz = repayMonthMoney0Biz * month
        const interestAmount0Biz = repayAmount0Biz - totalBiz
        this.result0.bizRepayAmount = parseFloat(repayAmount0Biz / 10000).toFixed(2)
        this.result0.bizInterestAmount = parseFloat(interestAmount0Biz / 10000).toFixed(2)
        this.result0.bizMonthPayment = parseFloat(repayMonthMoney0Biz).toFixed(2)
        const repayMonthMoney1Biz = this.getMonthMoney1(rateBiz, totalBiz, month, 0)
        const repayMonthDecreaseBiz = repayMonthMoney1Biz - this.getMonthMoney1(rateBiz, totalBiz, month, 1)
        this.result1.bizMonthPayment = parseFloat(repayMonthMoney1Biz).toFixed(2)
        this.result1.bizMonthDecrease = this.result0.bizMonthDecrease = parseFloat(repayMonthDecreaseBiz).toFixed(2)

        let repayAmount1Biz = 0
        for (let i = 0; i < month; i++) {
          repayAmount1Biz += this.getMonthMoney1(rateBiz, totalBiz, month, i)
        }
        this.result1.bizRepayAmount = parseFloat(repayAmount1Biz / 10000).toFixed(2)

        const interestAmount1Biz = repayAmount1Biz - totalBiz
        this.result1.bizInterestAmount = parseFloat(interestAmount1Biz / 10000).toFixed(2)

        const rateFund = this.pageParam.comFundRate / 100
        const totalFund = this.pageParam.comFundLoanAmount * 10000
        const repayMonthMoney0Fund = this.getMonthMoney0(rateFund, totalFund, fundMonthes)
        const repayAmount0Fund = repayMonthMoney0Fund * fundMonthes
        const interestAmount0Fund = repayAmount0Fund - totalFund
        this.result0.fundRepayAmount = parseFloat(repayAmount0Fund / 10000).toFixed(2)
        this.result0.fundInterestAmount = parseFloat(interestAmount0Fund / 10000).toFixed(2)

        this.result1.fundAmount = this.result0.fundAmount = parseFloat(totalFund / 10000).toFixed(2)

        const repayMonthMoney1Fund = this.getMonthMoney1(rateFund, totalFund, fundMonthes, 0)
        const repayMonthDecreaseFund = repayMonthMoney1Fund - this.getMonthMoney1(rateFund, totalFund, fundMonthes, 1)
        let repayAmount1Fund = 0
        for (let i = 0; i < fundMonthes; i++) {
          repayAmount1Fund += this.getMonthMoney1(rateFund, totalFund, fundMonthes, i)
        }
        const interestAmount1Fund = repayAmount1Fund - totalFund
        this.result1.fundRepayAmount = parseFloat(repayAmount1Fund / 10000).toFixed(2)
        this.result1.fundInterestAmount = parseFloat(interestAmount1Fund / 10000).toFixed(2)

        this.result0.fundMonthPayment = parseFloat(repayMonthMoney0Fund).toFixed(2)

        this.result1.fundMonthPayment = parseFloat(repayMonthMoney1Fund).toFixed(2)

        this.result1.fundMonthDecrease = parseFloat(repayMonthDecreaseFund).toFixed(2)
        const total = totalBiz + totalFund
        const repayAmount0 = repayAmount0Biz + repayAmount0Fund
        const interestAmount0 = interestAmount0Biz + interestAmount0Fund
        const repayMonthMoney0 = repayMonthMoney0Biz + repayMonthMoney0Fund
        const repayAmount1 = repayAmount1Biz + repayAmount1Fund
        const interestAmount1 = interestAmount1Biz + interestAmount1Fund
        const repayMonthMoney1 = repayMonthMoney1Biz + repayMonthMoney1Fund
        const repayMonthDecrease = repayMonthDecreaseBiz + repayMonthDecreaseFund

        this.result0.loanAmount = (total / 10000).toFixed(2)
        this.result0.repayAmount = (repayAmount0 / 10000).toFixed(2)
        this.result0.interestAmount = (interestAmount0 / 10000).toFixed(2)
        this.result0.bizMonthes = month
        this.result0.repayMonthMoney = repayMonthMoney0.toFixed(2)

        this.result1.loanAmount = (total / 10000).toFixed(2)
        this.result1.repayAmount = (repayAmount1 / 10000).toFixed(2)
        this.result1.interestAmount = (interestAmount1 / 10000).toFixed(2)
        this.result1.repayMonthNum = month
        this.result1.repayMonthMoney = repayMonthMoney1.toFixed(2)
        this.result1.repayMonthDecrease = repayMonthDecrease.toFixed(2)
      } else if (this.pageParam.type == 'fund') {
        const rate = this.pageParam.fundRate / 100
        const total = this.pageParam.fundLoanAmount * 10000
        const month = this.pageParam.fundLoanYear * 12
        const repayMonthMoney0 = this.getMonthMoney0(rate, total, month)
        const repayAmount0 = repayMonthMoney0 * month
        const interestAmount0 = repayAmount0 - total

        const repayMonthMoney1 = this.getMonthMoney1(rate, total, month, 0)
        const repayMonthDecrease = repayMonthMoney1 - this.getMonthMoney1(rate, total, month, 1)
        let repayAmount1 = 0
        for (let i = 0; i < month; i++) {
          repayAmount1 += this.getMonthMoney1(rate, total, month, i)
        }
        const interestAmount1 = repayAmount1 - total

        this.result0.loanAmount = (total / 10000).toFixed(2)
        this.result0.repayAmount = (repayAmount0 / 10000).toFixed(2)
        this.result0.interestAmount = (interestAmount0 / 10000).toFixed(2)
        this.result0.repayMonthNum = month
        this.result0.repayMonthMoney = repayMonthMoney0.toFixed(2)

        this.result1.loanAmount = (total / 10000).toFixed(2)
        this.result1.repayAmount = (repayAmount1 / 10000).toFixed(2)
        this.result1.interestAmount = (interestAmount1 / 10000).toFixed(2)
        this.result1.repayMonthNum = month
        this.result1.repayMonthMoney = repayMonthMoney1.toFixed(2)
        this.result1.repayMonthDecrease = repayMonthDecrease.toFixed(2)

        this.result1.fundAmount = this.result0.fundAmount = parseFloat(total / 10000).toFixed(2)
        this.result0.fundRepayAmount = parseFloat(repayAmount0 / 10000).toFixed(2)
        this.result1.fundRepayAmount = parseFloat(repayAmount1 / 10000).toFixed(2)
        this.result0.fundInterestAmount = parseFloat(interestAmount0 / 10000).toFixed(2)
        this.result1.fundInterestAmount = parseFloat(interestAmount1 / 10000).toFixed(2)
        this.result1.fundMonthes = this.result0.fundMonthes = parseInt(month)
        this.result0.fundMonthPayment = parseFloat(repayMonthMoney0).toFixed(2)
        this.result1.fundMonthPayment = parseFloat(repayMonthMoney1).toFixed(2)
        this.result1.fundMonthDecrease = this.result0.fundMonthDecrease = parseFloat(repayMonthDecrease).toFixed(2)
      }

      //等额本息 图表数据
      this.result0.echartsData = [{
        name: '贷款总额\n(' + (this.result0.loanAmount / this.result0.repayAmount * 100).toFixed(2) + '%)',
        value: this.result0.loanAmount
      }, {
        name: '支付利息\n(' + (this.result0.interestAmount / this.result0.repayAmount * 100).toFixed(2) + '%)',
        value: this.result0.interestAmount
      }];
      this.barOptions0.series.data = this.result0.echartsData;

      //等额本金 图表数据
      this.result1.echartsData = [{
        name: '贷款总额\n(' + (this.result1.loanAmount / this.result1.repayAmount * 100).toFixed(2) + '%)',
        value: this.result1.loanAmount
      }, {
        name: '支付利息\n(' + (this.result1.interestAmount / this.result1.repayAmount * 100).toFixed(2) + '%)',
        value: this.result1.interestAmount
      }];
      this.barOptions1.series.data = this.result1.echartsData;
    },
    //切换选项时改变表格里的数据
    resultTabClick () {

      if (this.tabsActive == 1) {
        if (this.pageParam.type == 'biz') {
          this.benxi(this.pageParam.bizLoanAmount, this.pageParam.bizLoanYear, this.pageParam.bizRate);
        } else if (this.pageParam.type == 'com') {
          this.benxi(this.pageParam.comLoanAmount, this.pageParam.comLoanYear, this.pageParam.comRate, this.pageParam.comFundLoanAmount, this.pageParam.comFundLoanYear, this.pageParam.comFundRate);
        } else if (this.pageParam.type == 'fund') {
          this.benxi(this.pageParam.fundLoanAmount, this.pageParam.fundLoanYear, this.pageParam.fundRate);
        }
      } else {
        if (this.pageParam.type == 'biz') {
          this.benjin(this.pageParam.bizLoanAmount, this.pageParam.bizLoanYear, this.pageParam.bizRate);
        } else if (this.pageParam.type == 'com') {
          this.benjin(this.pageParam.comLoanAmount, this.pageParam.comLoanYear, this.pageParam.comRate, this.pageParam.comFundLoanAmount, this.pageParam.comFundLoanYear, this.pageParam.comFundRate);
        } else if (this.pageParam.type == 'fund') {
          this.benjin(this.pageParam.fundLoanAmount, this.pageParam.fundLoanYear, this.pageParam.fundRate);
        }
      }
    },
    // 分享微信
    async onShareSelect (option) {
      this.showShareBox = false;
      // this.$toast("分享到：" + option.name);
      let url = this.$appConfig.appH5PageUrl + `tools/loanCalculateResult`;
      // let url = 'http://192.168.1.219:8080/h5/#/' + `tools/loanCalculateResult`; // 本地调试
      let path = this.$commonUtils.utilCore.url(url, {
        type: this.pageParam.type,
        bizLoanYear: this.pageParam.bizLoanYear,
        bizLoanAmount: this.pageParam.bizLoanAmount,
        bizRate: this.pageParam.bizRate,
        comLoanYear: this.pageParam.comLoanYear,
        comLoanAmount: this.pageParam.comLoanAmount,
        comRate: this.pageParam.comRate,
        comFundLoanAmount: this.pageParam.comFundLoanAmount,
        comFundRate: this.pageParam.comFundRate,
        comFundLoanYear: this.pageParam.comFundLoanYear,
        fundLoanAmount: this.pageParam.fundLoanAmount,
        fundRate: this.pageParam.fundRate,
        fundLoanYear: this.pageParam.fundLoanYear,
      });
      let jsonData = {
        provider: 'weixin',
        scene: 'WXSceneSession',
        type: 0,
        imageUrl: this.$appConfig.appWebStaticUrl + 'share_logo.png',
        title: `房贷计算器结果`,
        href: path
      }
      let systemInfo = await this.getShareApp({ messageAct: this.$messageAct, jsonData: jsonData })
      if (option.name == '微信') {
        this.$commonUtils.appLog.log("h5分享结果的信息为：")
        this.$commonUtils.appLog.log(JSON.stringify(systemInfo))
      }
    }
  }
}
</script>

<style lang = "scss" scoped >
.chart {
  height: 200px;
}
.wrap {
  padding-bottom: 1.7rem;
  ::v-deep .van-tabs__wrap {
    border-top: 1px solid #eeeeee;
    border-bottom: 1px solid #eeeeee;
    height: 48px;
  }
  ::v-deep .van-tab__text {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.3rem;
  }
  ::v-deep .van-tabs__line {
    background-color: #ffce09;
  }
  ::v-deep .van-tab--active {
    color: #f9b50c;
  }
  ::v-deep .list-title {
    color: #070707;
    font-size: 0.28rem;
    min-width: 2.7rem;
  }
  ::v-deep .van-cell__value {
    white-space: nowrap;
  }
  .list-value {
    color: #4a4a4a;
  }

  ::v-deep .van-grid-item__content {
    padding: 16px 4px;
  }

  /* 计算说明 */
  .desc-content {
    font-size: 0.22rem;
    font-weight: 400;
    color: #8d8d8d;
  }
  .desc-content p {
    padding-top: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 0.32rem;
    letter-spacing: 1px;
  }

  /* 开始计算按钮 */
  .touch-ground {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1.32rem;
    background: #ffffff;
    box-sizing: border-box;
    padding: 0 0.4rem;
    box-shadow: 0rem -0.04rem 0.08rem 0rem rgba(0, 0, 0, 0.08);
    display: flex;
    justify-content: center;
    align-items: center;
    .touch-ground-btn {
      margin: 0 40px;
      width: 100%;
      height: 0.8rem;
      background: #ffce09;
      border-radius: 0.12rem;
      color: #000000;
      font-size: 0.34rem;
      line-height: 0.8rem;
      text-align: center;
      &.weird {
        background: #3b97ff;
      }
    }
    .touch-ground-btn .space {
      margin: 0, 10;
    }
  }
}
.share-popup {
  div,
  ul,
  li,
  dl,
  dt,
  dd {
    margin: 0;
    padding: 0;
  }
  .p-title {
    font-size: 0.3rem;
    color: #474747;
    padding: 0.26rem 0.36rem;
  }
  .p-value {
    overflow: hidden;
    padding: 0 0.2rem 0.2rem;

    dl {
      text-align: center;
      float: left;
      width: 20%;
      margin-bottom: 0.3rem;

      .van-image {
        width: 0.8rem;
        height: 0.8rem;
      }
      dd {
        padding-top: 0.1rem;
        font-size: 0.26rem;
        color: #333;
        text-align: center;
      }
    }
  }
  .dialog-share-cancel {
    line-height: 1.2rem;
    box-shadow: 0rem 0.02rem 0rem 0rem rgba(0, 0, 0, 0.1);
    text-align: center;
    color: #333333;
    font-size: 0.32rem;
    border-top: 1px solid #e5e5e5;
  }
}
</style>
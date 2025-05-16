<template>
  <div>
    <!-- 顶部导航 -->
    <gni-nav-bar :pageTitle="pageTitle" @onClickLeft="onClickBack" :hideRight="false"></gni-nav-bar>
    <div class="wrap loanCalculate">
      <van-tabs v-model="tabsActive" animated swipeable sticky>
        <van-tab name="1">
          <template #title>
            <div class="item-title">
              <span>商业贷款</span>
            </div>
          </template>
          <van-list>
            <van-field label-class="list-title" type="number" label="房源总价" input-align="right" v-model="bizHouseAmount" placeholder="请输入房源总价">
              <template #button>
                <div class="list-value">万</div>
              </template>
            </van-field>

            <van-cell label-class="list-title" title="贷款比例" :value="bizLoanRatioSelect.value.name" is-link @click="showSelect('bizLoanRatio', '请选择贷款比例', 1)" />

            <van-field label-class="list-title" type="number" label="商贷总额" input-align="right" v-model="bizLoanAmount" placeholder="请输入商贷总额">
              <template #button>
                <div class="list-value">万</div>
              </template>
            </van-field>

            <van-field label-class="list-title" readonly type="number" label="贷款年限" input-align="right" :value="bizLoanYearSelect.value.value" is-link @click="showSelect('bizLoanYear', '请选择贷款年限')">
              <template #button>
                <div class="list-value">年</div>
              </template>
            </van-field>

            <van-cell label-class="list-title" title="利率方式" value-class="list-value" is-link :value="bizWatSelect.value.name" @click="showSelect('bizWat', '请选择利率方式', 1)" />
            <template v-if="bizWatSelect.value.value == 1">
              <van-field label-class="list-title" readonly type="number" label="商贷利率" input-align="right" :value="bizRateMultipleSelect.value.value" @click="showSelect('bizRateMultiple', '请选择商贷利率', 6)" is-link>
                <template #button>
                  <div class="list-value">%</div>
                </template>
              </van-field>
            </template>
            <template v-if="bizWatSelect.value.value != 1">
              <van-field label-class="list-title" type="number" label="LRP" input-align="right" v-model="bizLrpRate">
                <template #button>
                  <div class="list-value">%</div>
                </template>
              </van-field>

              <van-field label-class="list-title" type="number" label="基点" input-align="right" v-model="bizBaseRate">
                <template #button>
                  <div class="list-value">BP(‱)</div>
                </template>
              </van-field>

              <van-cell label-class="list-title" value-class="list-value" title="商贷利率" :value="
                  bizLrpRate +
                  ' %   +  ' +
                  bizBaseRate +
                  ' ‱ =  ' +
                  bizLrp_bizBase_Rate +
                  ' %'
                " />
            </template>
          </van-list>
        </van-tab>
        <van-tab name="2">
          <template #title>
            <div class="item-title">
              <span>组合贷款</span>
            </div>
          </template>

          <van-list>
            <van-field label-class="list-title" type="number" label="房源总价" input-align="right" v-model="comHouseAmount" placeholder="请输入房源总价" onkeyup="value=value.replace(/[^\d.]/g,'')">
              <template #button>
                <div class="list-value">万</div>
              </template>
            </van-field>

            <van-cell label-class="list-title" title="贷款比例" :value="comLoanRatioSelect.value.name" is-link @click="showSelect('comLoanRatio', '请选择贷款比例', 1)" />

            <van-field label-class="list-title" type="number" label="贷款总额" input-align="right" v-model="comLoanAmountTotal" placeholder="请输入贷款总额">
              <template #button>
                <div class="list-value">万</div>
              </template>
            </van-field>

            <van-field label-class="list-title" type="number" label="商贷总额" input-align="right" v-model="comLoanAmount" placeholder="请输入商贷总额">
              <template #button>
                <div class="list-value">万</div>
              </template>
            </van-field>

            <van-field label-class="list-title" readonly type="number" label="商贷年限" input-align="right" :value="comLoanYearSelect.value.value" is-link @click="showSelect('comLoanYear', '请选择商贷年限',2)">
              <template #button>
                <div class="list-value">年</div>
              </template>
            </van-field>

            <van-cell label-class="list-title" title="利率方式" value-class="list-value" is-link :value="comWatSelect.value.name" @click="showSelect('comWat', '请选择利率方式', 1)" />
            <template v-if="comWatSelect.value.value == 1">
              <van-field label-class="list-title" readonly type="number" label="商贷利率" input-align="right" :value="comRateMultipleSelect.value.value" @click="showSelect('comRateMultiple', '请选择商贷利率', 6)" is-link>
                <template #button>
                  <div class="list-value">%</div>
                </template>
              </van-field>
            </template>
            <template v-if="comWatSelect.value.value != 1">
              <van-field label-class="list-title" type="number" label="LRP" input-align="right" v-model="comLrpRate">
                <template #button>
                  <div class="list-value">%</div>
                </template>
              </van-field>

              <van-field label-class="list-title" type="number" label="基点" input-align="right" v-model="comBaseRate">
                <template #button>
                  <div class="list-value">BP(‱)</div>
                </template>
              </van-field>

              <van-cell label-class="list-title" value-class="list-value" title="商贷利率" :value="
                  comLrpRate +
                  ' %   +  ' +
                  comBaseRate +
                  ' ‱ =  ' +
                  comLrp_comBase_Rate +
                  ' %'
                " />
            </template>

            <van-field label-class="list-title" type="number" label="公积金总额" input-align="right" v-model="comFundLoanAmount" placeholder="请输入公积金总额">
              <template #button>
                <div class="list-value">万</div>
              </template>
            </van-field>
            <van-field label-class="list-title" readonly type="number" label="公积金年限" input-align="right" v-model="comFundLoanYearSelect.value.value" is-link @click="showSelect('comFundLoanYear', '请选择公积金年限',2)">
              <template #button>
                <div class="list-value">年</div>
              </template>
            </van-field>
            <!-- type="number"  -->
            <van-field label-class="list-title" readonly label="公积金利率" input-align="right" v-model="comFundRateMultipleSelect.value.name" is-link @click="showSelect('comFundRateMultiple', '请选择公积金利率', 1)">
              <!-- <template #button>
                <div class="list-value">%</div>
              </template> -->
            </van-field>
          </van-list>
        </van-tab>
        <van-tab name="3">
          <template #title>
            <div class="item-title">
              <span>公积金贷款</span>
            </div>
          </template>

          <van-list>
            <van-field label-class="list-title" type="number" label="房源总价" input-align="right" v-model="fundHouseAmount" placeholder="请输入房源总价">
              <template #button>
                <div class="list-value">万</div>
              </template>
            </van-field>

            <van-cell label-class="list-title" title="贷款比例" :value="fundLoanRatioSelect.value.name" is-link @click="showSelect('fundLoanRatio', '请选择贷款比例')" />

            <van-field label-class="list-title" type="number" label="公积金总额" input-align="right" v-model="fundLoanAmount" placeholder="请输入公积金总额">
              <template #button>
                <div class="list-value">万</div>
              </template>
            </van-field>

            <van-field label-class="list-title" readonly type="number" label="贷款年限" input-align="right" :value="fundLoanYearSelect.value.value" is-link @click="showSelect('fundLoanYear', '请选择贷款年限',2)">
              <template #button>
                <div class="list-value">年</div>
              </template>
            </van-field>
            <!-- type="number"  -->
            <van-field label-class="list-title" readonly label="公积金利率" input-align="right" :value="fundRateMultipleSelect.value.name" @click="showSelect('fundRateMultiple', '请选择公积金利率',1)" is-link>
              <!-- <template #button>
                <div class="list-value">%</div>
              </template> -->
            </van-field>
          </van-list>
        </van-tab>
      </van-tabs>
      <div class="desc-content">
        <p>贷款利率仅供计算参考，实际交易利率折扣以银行评估为准</p>
      </div>

      <div class="touch-ground" @click="actSubmitClick()">
        <div class="touch-ground-btn">开始计算</div>
      </div>
    </div>

    <pickerbox v-model="isShowSelectBox" :list="showSelectData" :activate.sync="selectData" :customRelevance="{ label: 'name', value: 'value' }" :title="showSelectTitle" :defaultSelect="defaultSelect" @confirm="confirmSelect" />
  </div>
</template>

<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import pickerbox from "@/components/yni/picker-box.vue";
export default {
  components: {
    gniNavBar,
    pickerbox,
  },
  data () {
    return {
      pageTitle: "房贷计算器", //页面标题
      tabsActive: 1,//默认显示第一个tab

      showSelectBox: "",//要显示的选择内容
      isShowSelectBox: false,//是否正在显示选择
      showSelectData: null,//选择显示的数据列表
      selectData: null,//选择结果
      showSelectTitle: "",//选择标题
      defaultSelect: 0,//默认选择索引

      bizHouseAmount: "",//总房价
      bizLoanRatioSelect: {////是否显示贷款比例选择
        show: false,
        value: {//默认选择
          "name": '70%',
          "value": "70"
        },
      },
      bizLoanRatioData: [//贷款比例选择数据
        { "name": "80%", "value": "80" },
        { "name": "70%", "value": "70" },
        { "name": "60%", "value": "60" },
        { "name": "50%", "value": "50" },
        { "name": "40%", "value": "40" },
        { "name": "30%", "value": "30" },
        { "name": "20%", "value": "20" },
        { "name": "10%", "value": "10" },
      ],
      bizLoanAmount: "",//商贷总额
      bizLrpRate: 4.3,//默认LRP利率
      bizBaseRate: 0,//基点
      bizWatSelect: {
        show: false,
        value: {//默认选择
          "name": '按最新LPR',
          "value": "2"
        },
      },
      bizWatData: [
        { "name": '按旧版基准利率', "value": 1 },
        { "name": '按最新LPR', "value": 2 }
      ],
      bizLoanYearSelect: {//是否显示贷款年限
        show: false,
        value: {//默认选择
          "name": '30 年',
          "value": "30"
        },
      },
      bizLoanYearData: [//贷款年限选择数据
        { "name": "30 年", "value": "30" },
        { "name": "25 年", "value": "25" },
        { "name": "20 年", "value": "20" },
        { "name": "15 年", "value": "15" },
        { "name": "10 年", "value": "10" },
        { "name": "9 年", "value": "9" },
        { "name": "8 年", "value": "8" },
        { "name": "7 年", "value": "7" },
        { "name": "6 年", "value": "6" },
        { "name": "5 年", "value": "5" },
        { "name": "4 年", "value": "4" },
        { "name": "3 年", "value": "3" },
        { "name": "2 年", "value": "2" },
        { "name": "1 年", "value": "1" },
      ],
      bizRate: 4.9,//默认基准利率
      //基准利率的倍数
      bizRateMultiple: [0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3],
      bizRateMultipleSelect: {//是否显示基准利率
        show: false,
        value: {//默认选择
          "name": '基准利率(4.9%)',//bizRate
          "value": "4.9"
        },
      },
      bizRateMultipleData: [],//基准利率选择数据

      comHouseAmount: "",//总房价
      comLoanRatioSelect: {////是否显示贷款比例选择
        show: false,
        value: {//默认选择
          "name": '70%',
          "value": "70"
        },
      },
      comLoanRatioData: [//贷款比例选择数据
        { "name": "80%", "value": "80" },
        { "name": "70%", "value": "70" },
        { "name": "60%", "value": "60" },
        { "name": "50%", "value": "50" },
        { "name": "40%", "value": "40" },
        { "name": "30%", "value": "30" },
        { "name": "20%", "value": "20" },
        { "name": "10%", "value": "10" },
      ],
      comLoanAmountTotal: 0,//组合贷款的贷款总额
      comLoanAmount: "",//商贷总额
      comLrpRate: 4.3,//默认LRP利率
      comBaseRate: 0,//基点
      comWatSelect: {
        show: false,
        value: {//默认选择
          "name": '按最新LPR',
          "value": "2"
        },
      },
      comWatData: [
        { "name": '按旧版基准利率', "value": 1 },
        { "name": '按最新LPR', "value": 2 }
      ],
      comLoanYearSelect: {//是否显示贷款年限
        show: false,
        value: {//默认选择
          "name": '20 年',
          "value": "20"
        },
      },
      comLoanYearData: [//贷款年限选择数据
        { "name": "30 年", "value": "30" },
        { "name": "25 年", "value": "25" },
        { "name": "20 年", "value": "20" },
        { "name": "15 年", "value": "15" },
        { "name": "10 年", "value": "10" },
        { "name": "9 年", "value": "9" },
        { "name": "8 年", "value": "8" },
        { "name": "7 年", "value": "7" },
        { "name": "6 年", "value": "6" },
        { "name": "5 年", "value": "5" },
        { "name": "4 年", "value": "4" },
        { "name": "3 年", "value": "3" },
        { "name": "2 年", "value": "2" },
        { "name": "1 年", "value": "1" },
      ],
      comRate: 4.9,//默认基准利率
      //基准利率的倍数
      comRateMultiple: [0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3],
      comRateMultipleSelect: {//是否显示基准利率
        show: false,
        value: {//默认选择
          "name": '基准利率(4.9%)',//bizRate
          "value": "4.9"
        },
      },
      comRateMultipleData: [],//基准利率选择数据
      comFundLoanAmount: "",//公积金总额
      comFundLoanYearSelect: {//是否显示公积金年限
        show: false,
        value: {//默认选择
          "name": '20 年',
          "value": "20"
        },
      },
      comFundLoanYearData: [//公积金年限选择数据
        { "name": "30 年", "value": "30" },
        { "name": "25 年", "value": "25" },
        { "name": "20 年", "value": "20" },
        { "name": "15 年", "value": "15" },
        { "name": "10 年", "value": "10" },
        { "name": "9 年", "value": "9" },
        { "name": "8 年", "value": "8" },
        { "name": "7 年", "value": "7" },
        { "name": "6 年", "value": "6" },
        { "name": "5 年", "value": "5" },
        { "name": "4 年", "value": "4" },
        { "name": "3 年", "value": "3" },
        { "name": "2 年", "value": "2" },
        { "name": "1 年", "value": "1" },
      ],
      comFundRate: 1,//默认公积金基准利率
      //公积金基准利率的倍数
      comFundRateMultiple: [2.79, 3.1, 3.575, 3.255, 3.41],
      comFundRateMultipleText: ["最新基准利率9折(2.79%)", "最新基准利率(3.1%)", "最新二套利率(3.575%)", "最新基准利率上浮5%(3.255%)", "最新基准利率上浮10%(3.41%)"],
      comFundRateMultipleSelect: {//是否显示公积金基准利率
        show: false,
        value: {//默认选择
          "name": '最新基准利率(3.1%)',//bizRate
          "value": "3.1"
        },
      },
      comFundRateMultipleData: [],

      fundHouseAmount: "",//总房价
      fundLoanRatioSelect: {////是否显示贷款比例选择
        show: false,
        value: {//默认选择
          "name": '70%',
          "value": "70"
        },
      },
      fundLoanRatioData: [//贷款比例选择数据
        { "name": "70%", "value": "70" },
        { "name": "60%", "value": "60" },
        { "name": "50%", "value": "50" },
        { "name": "40%", "value": "40" },
        { "name": "30%", "value": "30" },
        { "name": "20%", "value": "20" },
        { "name": "10%", "value": "10" },
      ],
      fundLoanAmount: "",//公积金总额
      fundLoanYearSelect: {//是否显示公积金年限
        show: false,
        value: {//默认选择
          "name": '20 年',
          "value": "20"
        },
      },
      fundLoanYearData: [//公积金年限选择数据
        { "name": "30 年", "value": "30" },
        { "name": "25 年", "value": "25" },
        { "name": "20 年", "value": "20" },
        { "name": "15 年", "value": "15" },
        { "name": "10 年", "value": "10" },
        { "name": "9 年", "value": "9" },
        { "name": "8 年", "value": "8" },
        { "name": "7 年", "value": "7" },
        { "name": "6 年", "value": "6" },
        { "name": "5 年", "value": "5" },
        { "name": "4 年", "value": "4" },
        { "name": "3 年", "value": "3" },
        { "name": "2 年", "value": "2" },
        { "name": "1 年", "value": "1" },
      ],
      fundRate: 1,//默认公积金基准利率
      //公积金基准利率的倍数
      fundRateMultiple: [2.79, 3.1, 3.575, 3.255, 3.41],
      fundRateMultipleText: ["最新基准利率9折(2.79%)", "最新基准利率(3.1%)", "最新二套利率(3.575%)", "最新基准利率上浮5%(3.255%)", "最新基准利率上浮10%(3.41%)"],
      fundRateMultipleSelect: {//是否显示公积金基准利率
        show: false,
        value: {//默认选择
          "name": '最新基准利率(3.1%)',//bizRate
          "value": "3.1"
        },
      },
      fundRateMultipleData: [],
    };
  },
  computed: {
    bizLrp_bizBase_Rate () {//计算LPR 的商贷利率
      return (this.bizBaseRate * 0.01 + this.bizLrpRate * 1).toFixed(2);
    },
    comLrp_comBase_Rate () {//组合合贷 计算LPR 的商贷利率
      return (this.comBaseRate * 0.01 + this.comLrpRate * 1).toFixed(2);
    }
  },
  watch: {
    bizHouseAmount (value, old) {//商贷总额(房源总价改变时)
      this.bizLoanAmount = (this.bizHouseAmount * this.bizLoanRatioSelect.value.value * 0.01).toFixed(2);
    },
    "bizLoanRatioSelect.value.value" (value, old) {//商贷总额(贷款比例改变时)
      this.bizLoanAmount = (this.bizHouseAmount * this.bizLoanRatioSelect.value.value * 0.01).toFixed(2);
    },
    comHouseAmount (value, old) {//商贷总额(房源总价改变时)
      this.comLoanAmountTotal = (this.comHouseAmount * this.comLoanRatioSelect.value.value * 0.01).toFixed(2);
    },
    "comLoanRatioSelect.value.value" (value, old) {//商贷总额(贷款比例改变时)
      this.comLoanAmountTotal = (this.comHouseAmount * this.comLoanRatioSelect.value.value * 0.01).toFixed(2);
    },
    comLoanAmountTotal: function (value, old) {//组合贷款 里如果 贷款总额 发生改变，则默认把 商贷总额 设置为 贷款总额
      this.comLoanAmount = this.comLoanAmountTotal;
    },
    comLoanAmount: function (value, old) {//组合贷款 里如果 商贷总额 发生改变，则默认 公积金总额 =  贷款总额 -  商贷总额
      this.comFundLoanAmount = this.comLoanAmountTotal - this.comLoanAmount;
    },
    comFundLoanAmount: function (value, old) {//组合贷款 里如果 公积金总额 发生改变，则默认 商贷总额 =  贷款总额 -  公积金总额
      this.comLoanAmount = this.comLoanAmountTotal - this.comFundLoanAmount;
    },
    fundHouseAmount (value, old) {//公积金总额(房源总价改变时)
      this.fundLoanAmount = (this.fundHouseAmount * this.fundLoanRatioSelect.value.value * 0.01).toFixed(2);
    },
    "fundLoanRatioSelect.value.value" (value, old) {//公积金总额(公积金比例改变时)
      this.fundLoanAmount = (this.fundHouseAmount * this.fundLoanRatioSelect.value.value * 0.01).toFixed(2);
    },
    "fundLoanYearSelect.value.value" (value, old) { //公积金年限改变时（1~5年2.6，5年以上3.1)
      // this.$commonUtils.appLog.log("OKKKKK------------>>>", value, old);
      // if (value < 6) { // 五年期以上
      //   this.fundRate = 2.6;
      //   this.fundRateMultipleSelect.value.value = "2.6";
      //   this.fundRateMultipleSelect.value.name = "基准利率(2.6%)"
      // } else { // 五年以上期
      //   this.fundRate = 3.1;
      //   this.fundRateMultipleSelect.value.value = "3.1";
      //   this.fundRateMultipleSelect.value.name = "基准利率(3.1%)"
      // }
      this.initFundRateMultiple();
    },
    "comFundLoanYearSelect.value.value" (value, old) { //组合贷 公积金年限改变时（1~5年2.6，5年以上3.1)
      // this.$commonUtils.appLog.log("组合贷公积金 OKKKKK------------>>>", value, old);
      // if (value < 6) {
      //   this.comFundRate = 2.6;
      //   this.comFundRateMultipleSelect.value.value = "2.6";
      //   this.comFundRateMultipleSelect.value.name = "基准利率(2.6%)"
      // } else {
      //   this.comFundRate = 3.1;
      //   this.comFundRateMultipleSelect.value.value = "3.1";
      //   this.comFundRateMultipleSelect.value.name = "基准利率(3.1%)"
      // }
      this.initComFundRateMultiple();
    },
  },
  methods: {
    /**
     * 显示对应的选择面版
     */
    showSelect (mytype, mytitle, defaultVal) {

      if (mytype == "bizRateMultiple") {
        this.initBizRateMultiple();
      } else if (mytype == "comRateMultiple") {
        this.initComRateMultiple();
      } else if (mytype == "comFundRateMultiple") {
        this.initComFundRateMultiple();
      } else if (mytype == "fundRateMultiple") {
        this.initFundRateMultiple();
      }

      //默认选择值
      if (this.$commonUtils.utilCore.empty(defaultVal)) {
        this.defaultSelect = 0;
      } else {
        this.defaultSelect = defaultVal;
      }
      this.showSelectBox = mytype;//要显示的选择内容
      this.isShowSelectBox = true;//是否正在显示选择
      this.showSelectData = this[this.showSelectBox + "Data"];//选择显示的数据列表
      this.showSelectTitle = mytitle;//选择标题
    },
    //初始化 商贷利率
    initBizRateMultiple () {
      this.bizRateMultipleData = [];
      for (let key in this.bizRateMultiple) {
        let bizInterestRate = this.bizRate * this.bizRateMultiple[key];
        bizInterestRate = Math.round(bizInterestRate * 100) / 100;
        if (this.bizRateMultiple[key] == 1) {
          this.bizRateMultipleData.push({ "name": "基准利率" + "(" + bizInterestRate + "%)", "value": bizInterestRate });
        } else {
          this.bizRateMultipleData.push({ "name": "基准利率" + this.bizRateMultiple[key] + "倍" + "(" + bizInterestRate + "%)", "value": bizInterestRate });
        }
      }
    },
    //初始化 组合贷款 的 商贷利率
    initComRateMultiple () {
      this.comRateMultipleData = [];
      for (let key in this.comRateMultiple) {
        let comInterestRate = this.comRate * this.comRateMultiple[key];
        comInterestRate = Math.round(comInterestRate * 100) / 100;
        if (this.bizRateMultiple[key] == 1) {
          this.comRateMultipleData.push({ "name": "基准利率" + "(" + comInterestRate + "%)", "value": comInterestRate });
        } else {
          this.comRateMultipleData.push({ "name": "基准利率" + this.comRateMultiple[key] + "倍" + "(" + comInterestRate + "%)", "value": comInterestRate });
        }
      }
    },
    //初始化 组合贷款 的 公积金利率
    initComFundRateMultiple () {
      this.comFundRateMultipleData = [];
      for (let key in this.comFundRateMultiple) {
        let comInterestRate = this.comFundRate * this.comFundRateMultiple[key];
        // comInterestRate = Math.round(comInterestRate * 100) / 100;
        if (this.comFundRateMultiple[key] == 1) {
          // this.comFundRateMultipleData.push({ "name": "基准利率" + "(" + comInterestRate + "%)", "value": comInterestRate });
          this.comFundRateMultipleData.push({ "name": this.comFundRateMultipleText[key], "value": comInterestRate });
        } else {
          // this.comFundRateMultipleData.push({ "name": "基准利率" + this.comFundRateMultiple[key] + "倍" + "(" + comInterestRate + "%)", "value": comInterestRate });
          this.comFundRateMultipleData.push({ "name": this.comFundRateMultipleText[key], "value": comInterestRate });
        }
      }
    },
    //初始化 公积金贷款 的 公积金利率
    initFundRateMultiple () {
      this.$commonUtils.appLog.log("initFundRateMultiple", this.fundRate);
      this.fundRateMultipleData = [];
      for (let key in this.fundRateMultiple) {
        let comInterestRate = this.fundRate * this.fundRateMultiple[key];
        // comInterestRate = Math.round(comInterestRate * 100) / 100;
        if (this.fundRateMultiple[key] == 1) {
          // this.fundRateMultipleData.push({ "name": "基准利率" + "(" + comInterestRate + "%)", "value": comInterestRate });
          this.fundRateMultipleData.push({ "name": this.fundRateMultipleText[key], "value": comInterestRate });
        } else {
          this.fundRateMultipleData.push({ "name": this.fundRateMultipleText[key], "value": comInterestRate });
        }
      }
    },
    //获取选择结果
    confirmSelect (value) {
      this.$commonUtils.appLog.log("OKKKKK", value);
      this[this.showSelectBox + "Select"].value = value;//选择显示的数据列表
      this.isShowSelectBox = false;//是否正在显示选择
    },
    //执行计算
    actSubmitClick () {
      let param = {};//计算需要得到的参数
      param.type = this.getType();
      if (param.type == "") {
        return;
      }
      if (param.type == "biz") {//商业贷款
        let bizInterestRate = 1;
        if (this.bizWatSelect.value.value == 1) {
          bizInterestRate = this.bizRateMultipleSelect.value.value;
        } else {
          bizInterestRate = this.bizLrp_bizBase_Rate;
        }
        param.bizLoanYear = this.bizLoanYearSelect.value.value; //商贷年限
        param.bizLoanAmount = this.bizLoanAmount;//商贷总额
        param.bizRate = bizInterestRate;//商贷利率
        if (this.$commonUtils.utilCore.empty(param.bizLoanYear)) {
          this.$toast("贷款年限不能为空");
          return;
        }
        if (this.$commonUtils.utilCore.empty(param.bizLoanAmount)) {
          this.$toast("商贷总额不能为空");
          return;
        }
        if (this.$commonUtils.utilCore.empty(param.bizRate)) {
          this.$toast("商贷利率不能为空");
          return;
        }
        if (param.bizRate > 100) {
          this.$toast("商贷利率不能大于100%");
          return;
        }
      } else if (param.type == "com") {//组合贷款 
        let comInterestRate = 1;
        if (this.bizWatSelect.value.value == 1) {
          comInterestRate = this.comRateMultipleSelect.value.value;
        } else {
          comInterestRate = this.comLrp_comBase_Rate;
        }
        param.comLoanYear = this.comLoanYearSelect.value.value; //商贷年限
        param.comLoanAmount = this.comLoanAmount;//商贷总额
        param.comRate = comInterestRate;//商贷利率
        param.comFundLoanAmount = this.comFundLoanAmount;//公积金总额
        param.comFundRate = this.comFundRateMultipleSelect.value.value;//公积金利率
        param.comFundLoanYear = this.comFundLoanYearSelect.value.value;//公积金年限
        if (this.$commonUtils.utilCore.empty(param.comLoanYear)) {
          this.$toast("贷款年限不能为空");
          return;
        }
        if (this.$commonUtils.utilCore.empty(param.comLoanAmount)) {
          this.$toast("商贷总额不能为空");
          return;
        }
        if (this.$commonUtils.utilCore.empty(param.comRate)) {
          this.$toast("商贷利率不能为空");
          return;
        }
        if (param.comRate > 100) {
          this.$toast("商贷利率不能大于100%");
          return;
        }

        if (this.$commonUtils.utilCore.empty(param.comFundLoanYear)) {
          this.$toast("公积金年限不能为空");
          return;
        }
        if (this.$commonUtils.utilCore.empty(param.comFundLoanAmount)) {
          this.$toast("公积金总额不能为空");
          return;
        }
        if (this.$commonUtils.utilCore.empty(parseInt(param.comFundLoanAmount))) {
          this.$toast("公积金总额不能为0");
          return;
        }
        if (this.$commonUtils.utilCore.empty(param.comFundRate)) {
          this.$toast("公积金利率不能为空");
          return;
        }
        if (param.comFundRate > 100) {
          this.$toast("公积金利率不能大于100%");
          return;
        }
      } else if (param.type == "fund") {//公积金贷款
        param.fundLoanAmount = this.fundLoanAmount;//公积金总额
        param.fundRate = this.fundRateMultipleSelect.value.value;//公积金利率
        param.fundLoanYear = this.fundLoanYearSelect.value.value;//公积金年限
        if (this.$commonUtils.utilCore.empty(param.fundLoanYear)) {
          this.$toast("公积金年限不能为空");
          return;
        }
        if (this.$commonUtils.utilCore.empty(param.fundLoanAmount)) {
          this.$toast("公积金总额不能为空");
          return;
        }
        if (param.fundLoanAmount == '0') {
          this.$toast("公积金总额不能为0");
          return;
        }
        if (this.$commonUtils.utilCore.empty(param.fundRate)) {
          this.$toast("公积金利率不能为空");
          return;
        }
        if (param.fundRate > 100) {
          this.$toast("公积金利率不能大于100%");
          return;
        }
      }
      param.isShare = 0 // 0为显示，给分享到微信“分享”按钮唯一标识
      this.$router.push({ path: '/tools/loanCalculateResult', query: param });
    },
    //返回选择的贷款方式
    getType () {
      if (1 == this.tabsActive) {
        return "biz";
      } else if (2 == this.tabsActive) {
        return "com";
      } else if (3 == this.tabsActive) {
        return "fund";
      } else {
        this.$toast("请选择贷款方式！");
        return ""
      }
    },
    onClickBack () {
      this.$router.go(-1); //返回上一层
      // let backUrl = this.$store.state.app.appBackUrl;
      // this.$commonUtils.utilCore.uniGoPage(backUrl);
    },
    onClickMore () {

    },
  }
}

</script>

<style lang = "scss" scoped >
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
  &.loanCalculate ::v-deep .list-title {
    width: 1.44rem;
    min-width: 1.44rem;
  }
  ::v-deep .van-cell__value {
    white-space: nowrap;
  }
  .list-value {
    color: #4a4a4a;
  }

  /* 计算说明 */
  .desc-content {
    font-size: 0.22rem;
    font-weight: 400;
    color: #8d8d8d;
    line-height: 0.32rem;
    letter-spacing: 1px;
  }
  .desc-content p {
    padding-top: 5px;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
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
      width: 90%;
      height: 0.8rem;
      background: #ffce09;
      border-radius: 0.12rem;
      color: #000000;
      font-size: 0.34rem;
      line-height: 0.8rem;
      text-align: center;
      &.weird {
        background: #ffce09;
      }
    }
  }
}
</style>
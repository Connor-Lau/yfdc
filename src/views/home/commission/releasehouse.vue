<template>
  <div class="releasehouse">
    <gni-nav-bar @onClickLeft="onClickBack" :pageTitle="headTitle" :hideRight="false" :hideLeft="false">
      <template slot="slot-left">
        <div class="nav-left">
          <img :src="$appConfig.appWebStaticUrl + '/commission/icon_return.png'" alt="">
        </div>
      </template>
    </gni-nav-bar>
    <div class="wrapper" :style="isTips?'filter: blur(5px)':''">
      <div class="bannar">
        <img :src="$appConfig.appWebStaticUrl + '/commission/releasehouse_bannar.png'" alt="">
      </div>
      <!-- 2022/6/2 stella说这版暂时不上 -->
      <!-- <div class="add-asset">
        <div class="title">已添加的资产</div>
        <div class="add-container">
          <div class="add-address">萝岗敏捷广场</div>
          <div class="input-btn">+ 快速录入</div>
          <div class="input-btn">√ 已录入</div>
        </div>
      </div> -->
      <div class="information-container">
        <div class="title">
          信息录入
          <div @click="isTips = true">
            <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_tips.png'" alt="">
          </div>
        </div>
        <div class="cell-container">
          <div class="cell">
            <div class="left-title">城市：</div>
            <div class="right-content" :class="commissionData.city?'choose-active':''" @click="toolsGoPageView({path:'/home/city/index',query:{isFromwt:'1'}})">
              {{commissionData.city?commissionData.city.city_name:'请输入'}}
              <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_arrowRight.png'" alt="">
            </div>
            <img :src="$appConfig.appWebStaticUrl + '/commission/icon_required.png'" alt="" class="icon-required">
          </div>
          <div class="cell" style="align-items: normal;">
            <div class="left-title">小区/路名：</div>
            <div class="right-content" :class="commissionData.village.mix_name?'choose-active':''" @click="toolsGoPageView({path:'/home/commission/villagechoose',query:{villageId:commissionData.village.id || 0}})">
              {{commissionData.village.mix_name || '请输入'}}
              <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_arrowRight.png'" alt="">
            </div>
            <img :src="$appConfig.appWebStaticUrl + '/commission/icon_required.png'" alt="" class="icon-required">
          </div>
          <div class="cell" style="align-items: normal;">
            <div class="left-title">房号：</div>
            <div class="right-content" :class="commissionData.roomnumber.housefloor?'choose-active':''" @click="toolsGoPageView({path:'/home/commission/roomnumber'})">
              {{commissionData.roomnumber.housefloor?commissionData.roomnumber.housefloor+(commissionData.roomnumber.housefloor=='全栋'?'':'楼')+commissionData.roomnumber.houseNum+(commissionData.roomnumber.houseNum=='全层'?'':'房'):'请输入'}}
              <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_arrowRight.png'" alt="">
            </div>
            <img :src="$appConfig.appWebStaticUrl + '/commission/icon_required.png'" alt="" class="icon-required">
          </div>
          <div class="cell">
            <div class="left-title">期望售价：</div>
            <div class="right-ipt">
              <input type="number" placeholder="请输入" v-model="sellprice" oninput="if(value>100000)value=100000;value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')">
              万
            </div>
          </div>
          <div class="cell">
            <div class="left-title">建筑面积：</div>
            <div class="right-ipt">
              <input type="number" placeholder="请输入" v-model="buildarea" oninput="if(value>10000)value=10000;value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');">
              ㎡
            </div>
          </div>
          <div class="line"></div>
          <div class="cell">
            <div class="left-title">称呼：</div>
            <div class="right-ipt">
              <input type="text" placeholder="请输入 X小姐 或 X先生" v-model="name" :maxlength="nameMaxLength" @input="handleInputName($event)">
            </div>
          </div>
          <div class="cell">
            <div class="left-title">联系方式：</div>
            <div class="right-ipt">
              <!-- value="1********73" -->
              <input type="tel" placeholder="请输入您的联系方式" v-model="mobilephone" maxlength="11">
            </div>
            <img :src="$appConfig.appWebStaticUrl + '/commission/icon_required.png'" alt="" class="icon-required" style="top:0.43rem">
          </div>
          <div class="line"></div>
        </div>

      </div>
      <div class="house-flow">
        <div class="flow-title">房源发布流程</div>
        <div class="flow-sort">
          <div class="sort-item">
            <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_online02.png'" alt="">
            <div class="item-name">线上发布</div>
            <van-icon name="down" />
          </div>
          <div class="sort-item">
            <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_verify02.png'" alt="">
            <div class="item-name item-grey">核实房源</div>
            <van-icon name="down" />
          </div>
          <div class="sort-item">
            <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_grounding02.png'" alt="">
            <div class="item-name item-grey">房源上架</div>
            <van-icon name="down" />
          </div>
          <div class="sort-item">
            <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_deal02.png'" alt="">
            <div class="item-name item-grey">签约成交</div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="btn-return" @click="submit">确认发布</div>
      </div>
    </div>

    <!-- 提示遮罩层 -->
    <van-overlay :show="isTips" :z-index="1001" class-name="tips-overlay">
      <div class="block">
        <div class="oly-title">房源发布技巧</div>
        <div class="oly-line"></div>
        <div class="oly-text">1.小区：输入关键词后，请优先选择系统推荐小区，选择系统推荐小区可以查看定价参考信息。无系统推荐，也可手动输入。</div>
        <div class="oly-text">2.地址：准确填写楼栋、单元、门牌号，可以加速房源上架速度。</div>
        <div class="oly-text">3.期望售价：建议参考同小区相似户型最新成交信息。合理的价格，可以更快出售房源。</div>
        <div class="oly-text">4.如果您已在门店委托，请不要在线上重复委托，可直接到业主中心查看该房源。</div>
        <div class="oly-close" @click="isTips=false">
          <img :src="$appConfig.appWebStaticUrl + '/commission/icon_transparentclose.png'" alt="">
        </div>
      </div>
    </van-overlay>
    <!-- 一键卖房 -->
    <van-popup v-model="isOneClick" :round="true" :close-on-click-overlay="false">
      <div class="pop-container">
        <div class="close-img" @click="onClickBack">
          <img :src="$appConfig.appWebStaticUrl + '/commission/icon_popclose.png'" alt="">
        </div>
        <div v-if="isContent">
          <div class="pop-title">填写遇到问题，试试一键发布</div>
          <div class="pop-text">一键发布之后，将由专员与您联系，和您一起确定房源信息，省心省力。</div>
        </div>
        <div v-else>
          <div class="pop-title">金牌经纪人帮您卖房</div>
          <div class="pop-text">通过裕丰地产平台发布房源，省心省力省时间，您点击立即委托后，专员会与您确认房源信息，并为您推荐熟悉商圈的经纪人与您电话沟通提供售房服务，裕丰地产平台仅提供信息展示和网络技术支持。</div>
        </div>
        <div class="pop-btn">一键卖房</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  components: {
    gniNavBar,
  },
  computed: {
    ...mapState("commission", ["commissionData"]), //我的委托的信息
    ...mapState("user", ["userToken", "userInfo", "isLogin"]), //用户Token,用户登陆信息
  },
  data () {
    return {
      headTitle: '发布房源',
      isContent: false,
      isTips: false, // 提示遮罩层
      isOneClick: false, // 一键卖房弹窗
      sellprice: '',// 期望售价
      buildarea: '',  // 建筑面积
      name: '', // 称呼
      mobilephone: '',
      nowTime: '', // 现在的时间 年月日
      nameMaxLength: 24,//称呼字符长度
    }
  },
  async mounted () {
    // this.mobilephone = this.userInfo.user_row.mobile
    window.scrollTo(0, 0)
    this.getToday()  // 获取当前时间
    setTimeout(async () => {
      //初始化登陆的状态
      await this.init();
    }, 500)
  },
  beforeRouteEnter (to, from, next) {
    next(e => {
      if (from.path == '/home/commission/index' || from.path == '/common/index') {
        console.log(e);
        e.mobilephone = e.userInfo.user_row.mobile
      }
    })
  },
  activated () {
    if (this.$commonUtils.utilCore.empty(this.commissionData.city.city_id)) {
      //初始化城市
      this.$store.dispatch('commission/hanleChangeCityid');
    }
    console.log('用户信息', this.userInfo);
  },
  watch: {
    'commissionData.city.city_id': {
      handler () {
        if (!this.$commonUtils.utilCore.empty(this.commissionData.village)) {
          console.log('城市变了');
          this.emptyInit() // 清空填写的数据
          // 不能全部清空，不然城市又成默认广州了
          this.setCommissionData({ data: {}, key: "village" })
          this.setCommissionData({ data: {}, key: "roomnumber" })
        }
      }
    }
  },
  methods: {
    ...mapMutations('commission', ['setCommissionData']),
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
    // 确认发布
    async submit () {
      this.$commonUtils.utilCore.showLoading();
      const postData = {
        entrust_type: 'shouse',//	是	string	业务类型[shouse:售,rent:租]
        uptown_name: this.commissionData.village ? this.commissionData.village.uptown_name : '' || '',	//是	string	小区名称
        site_id: this.commissionData.city ? this.commissionData.city.city_id : '' || '',	//是	string	城市ID
        city_id: this.commissionData.city ? this.commissionData.city.city_id : '' || '',	//是	string	城市ID
        mobile: this.mobilephone || '',	//是	string	手机号码
        room_no: this.commissionData.roomnumber ? this.commissionData.roomnumber.houseNum : '' || '',	//是	string	房号
        price: this.sellprice || '',	//是	string	价格,若售业务该单位为万元
        acreage: this.buildarea || '',	//是	string	面积
        longitude: this.commissionData.village.lon || '', // 是 string 经度
        latitude: this.commissionData.village.lat || '', // 是 string 纬度 
        appellation: this.name || '',	//否	string	称呼
        district_id: this.commissionData.village.district_id || '',	//否	string	区域ID
        building_id: this.commissionData.village.unit_id || '',	//否	string	楼栋ID
        building_no: this.commissionData.village.unit_name || '',	//否	string	楼栋名称
        floor_no: this.commissionData.roomnumber ? this.commissionData.roomnumber.housefloor : '' || '',	//否	string	楼层
        door_no: "",	//否	string	门牌号
        uptown_id: this.commissionData.village ? this.commissionData.village.uptown_id : '' || '',//	否	string	小区ID
        rent_type: "",//	否	string	租赁方式[1:整租,2:合租]
      }
      const res = await this.$store.dispatch('commission/getAppEntrustAadd', postData);
      if (res.code == 200) {
        let commission = {
          entrust_id: res.data.publish_id,
          submitTime: this.nowTime,
          entrust_type: 'shouse'
        }
        let allDetail = Object.assign(postData, commission)
        this.setCommissionData({ data: allDetail, key: "detail" })
        // this.$commonUtils.utilCore.showToast("发布成功")
        this.$commonUtils.utilCore.closeLoading()
        setTimeout(() => {
          this.emptyInit()
          this.toolsGoPageView({ path: '/home/commission/releaseinformation', query: { publish_id: res.data.publish_id } })
        }, 500);
      }
    },
    openPop () {
      if (this.commissionData.village ? this.commissionData.village.uptown_name : '' || this.commissionData.roomnumber.housefloor) {
        this.isContent = true
      } else {
        this.isContent = false
      }
      this.isOneClick = true
    },
    // 获取当前时间
    getToday () {
      var date = new Date();
      let year = date.getFullYear()
      let month = this.checkTime(date.getMonth() + 1)
      let day = this.checkTime(date.getDate())
      this.nowTime = `${year}-${month}-${day}`;
    },
    // 时间补0函数，传入一个数字，不足10就补零返回
    checkTime (num) {
      if (num < 10) {
        num = '0' + num;
      }
      return num;
    },
    // 清空当前页数据
    emptyInit () {
      this.sellprice = ''
      this.buildarea = ''
      this.name = ''
    },
    // 称呼Input事件
    // 称呼Input事件
    handleInputName (e) {
      let value = e.target.value
      value = value.replace(/[^a-zA-Z\u4e00-\u9fa5]/g, '');
      const split = value.split('');
      //统计汉字跟英文字数
      const map = split.map((s, i) => {
        return (value.charCodeAt(i) >= 0 && value.charCodeAt(i) <= 128) ? 1 : 2;
      });
      //计算总和
      const charLength = map.length > 0 && map.reduce((n, v) => {
        return n + v;
      });
      //长度是否大于24 大于24调用字节截取
      if (charLength <= this.nameMaxLength) {
        this.name = value
      } else {
        setTimeout(() => {
          //调用字节截取内容的方法修改输入框的值
          this.name = this.computeMaxLength(this.name, 24)
        }, 10)
      }
    },
    //  计算中文长度
    computeMaxLength (str, len) {
      let num = 0;
      const str1 = str;
      for (var i = 0, lens = str1.length; i < lens; i++) {
        num += ((str1.charCodeAt(i) > 255) ? 2 : 1);
        if (num > len) {
          break;
        } else {
          str = str1.substring(0, i + 1);
        }
      }
      return str;
    },
    onClickBack () {
      this.emptyInit()
      this.setCommissionData({})
      this.toolsGoPageView({ path: '/home/commission/index' })
      // this.toolsGoPageBack();
    },
  }
}
</script>

<style lang='scss' scoped>
.releasehouse {
  padding-bottom: 1.5rem;
  .nav-left {
    img {
      width: 0.4rem;
      height: 0.36rem;
      display: block;
    }
  }
  .wrapper {
    .bannar {
      img {
        width: 100%;
        height: 2rem;
      }
    }
    .add-asset {
      padding: 0.34rem 0.4rem 0.74rem;
      .title {
        font-size: 0.4rem;
        font-weight: bold;
        color: #000000;
        padding-bottom: 0.34rem;
      }
      .add-container {
        width: 6.7rem;
        height: 1.48rem;
        background: #ffffff;
        box-shadow: 0rem 0.04rem 0.08rem 0rem rgba(0, 0, 0, 0.1);
        border: 0.02rem solid #d1d1d1;
        padding: 0 0.28rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;
        .add-address {
          font-size: 0.32rem;
          font-weight: 400;
          color: #000000;
          text-shadow: 0px 0px 0px rgba(0, 0, 0, 0.1);
        }
        .input-btn {
          width: 1.6rem;
          height: 0.52rem;
          font-size: 0.28rem;
          font-weight: 400;
          color: #000000;
          text-align: center;
          line-height: 0.52rem;
          text-shadow: 0px 0px 0px rgba(0, 0, 0, 0.1);
          background: #fef6d6;
          box-shadow: 0rem 0.04rem 0.08rem 0rem rgba(0, 0, 0, 0.1);
          border: 0.02rem solid #ffce09;
        }
      }
    }
    .information-container {
      padding-top: 0.74rem;
      .title {
        font-size: 0.4rem;
        font-weight: bold;
        color: #000000;
        padding-left: 0.4rem;
        display: flex;
        align-items: center;
        padding-bottom: 0.34rem;
        img {
          width: 0.28rem;
          height: 0.28rem;
          padding-left: 0.1rem;
        }
      }
      .cell-container {
        .cell {
          padding: 0.3rem 0;
          margin: 0 0.4rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 0.02rem solid #f7f7f7;
          position: relative;
          .left-title {
            font-size: 0.32rem;
            font-weight: 400;
            color: #000000;
            white-space: nowrap;
          }
          .right-content {
            font-size: 0.3rem;
            font-weight: 400;
            color: #737373;
            display: flex;
            align-items: center;
            img {
              width: 0.3rem;
              height: 0.3rem;
              padding-left: 0.18rem;
            }
          }
          .right-ipt {
            font-size: 0.3rem;
            font-weight: 400;
            color: #111111;
            display: flex;
            align-items: center;
            input {
              font-weight: bold;
              color: #000000;
              border: none;
              text-align: right;
            }
            ::-webkit-input-placeholder {
              color: #737373;
            }
            :-moz-placeholder {
              color: #737373;
            }
            ::-moz-placeholder {
              color: #737373;
            }
            :-ms-input-placeholder {
              color: #737373;
            }
          }
          .icon-required {
            width: 0.18rem;
            height: 0.18rem;
            position: absolute;
            top: 0.35rem;
            left: -0.22rem;
          }
        }
      }
    }
    .house-flow {
      padding: 0.34rem 0.48rem 0.6rem;
      .flow-title {
        font-size: 0.4rem;
        font-weight: bold;
        color: #000000;
        padding-bottom: 0.6rem;
      }
      .flow-sort {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .sort-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          img {
            width: 0.4rem;
            height: 0.4rem;
          }
          .item-name {
            font-size: 0.26rem;
            font-weight: bold;
            color: #303030;
            padding-top: 0.26rem;
          }
          .item-grey {
            color: #c2c2c2;
          }
          .van-icon {
            color: #9b9b9b;
            font-size: 0.2rem;
            font-weight: bold;
            transform: rotate(-90deg);
            position: absolute;
            top: 0.3rem;
            right: -0.55rem;
          }
        }
      }
    }
    .line {
      width: 100%;
      height: 0.2rem;
      background: #f8f8f8;
    }
  }
  .footer {
    width: 100%;
    position: fixed;
    bottom: 0;
    background: #ffffff;
    box-shadow: 0rem -0.04rem 0.08rem 0rem rgba(0, 0, 0, 0.08);
    padding: 0.26rem 0;
    .btn-return {
      width: 6rem;
      height: 0.8rem;
      margin: 0 auto;
      text-align: center;
      line-height: 0.8rem;
      font-size: 0.32rem;
      font-weight: 400;
      color: #000000;
      background: #ffce09;
      border-radius: 0.1rem;
    }
  }
  .tips-overlay {
    background: rgba(0, 0, 0, 0.82);
    .block {
      color: #ffffff;
      padding-top: 1.98rem;
      .oly-title {
        font-size: 0.34rem;
        font-weight: bold;
        padding-bottom: 0.38rem;
        text-align: center;
      }
      .oly-line {
        width: 5.46rem;
        height: 0.02rem;
        background: #f7f7f7;
        margin-left: 1.02rem;
        margin-bottom: 0.78rem;
      }
      .oly-text {
        font-size: 0.28rem;
        font-weight: 400;
        text-align: justify;
        padding: 0 1.16rem 0.72rem;
        line-height: 0.4rem;
      }
      .oly-close {
        margin-top: 1rem;
        img {
          width: 0.72rem;
          height: 0.72rem;
          display: block;
          margin: 0 auto;
        }
      }
    }
  }
  .pop-container {
    padding: 0.2rem 0 0.4rem;
    .close-img {
      display: flex;
      justify-content: flex-end;
      padding-right: 0.2rem;
      img {
        width: 0.28rem;
        height: 0.28rem;
        // display: block;
      }
    }
    .pop-title {
      font-size: 0.44rem;
      font-weight: bold;
      color: #303030;
      padding-top: 0.4rem;
      padding-bottom: 0.38rem;
      white-space: nowrap;
      text-align: center;
    }
    .pop-text {
      font-size: 0.28rem;
      font-weight: 400;
      color: #737373;
      padding: 0 0.58rem 0.54rem 0.64rem;
      padding-bottom: 0.54rem;
      line-height: 0.38rem;
      text-align: center;
    }
    .pop-btn {
      width: 5.52rem;
      height: 0.8rem;
      font-size: 0.32rem;
      font-weight: 400;
      color: #000000;
      text-align: center;
      line-height: 0.8rem;
      background: #ffce09;
      border-radius: 0.1rem;
      margin: 0 0.58rem;
    }
  }
  .choose-active {
    font-weight: bold !important;
    color: #000000 !important;
  }
  .van-popup--center.van-popup--round {
    border-radius: 0.1rem;
  }

  input::-webkit-input-placeholder {
    font-weight: 400;
  }
}
</style>
<template>
  <div class="releasehouse">
    <gni-nav-bar @onClickLeft="onClickBack" :pageTitle="headTitle" :hideRight="false" :hideLeft="false">
      <template slot="slot-left">
        <div class="nav-left">
          <img :src="$appConfig.appWebStaticUrl + '/commission/icon_return.png'" alt="">
          <div class="nav-close" @click.stop="isGiveup = true">
            <img :src="$appConfig.appWebStaticUrl + '/commission/icon_close.png'" alt="">
          </div>
        </div>
      </template>
      <template slot="slot-right">
        <div class="nav-right" @click="isTips=true">
          <img :src="$appConfig.appWebStaticUrl + '/commission/icon_tips.png'" alt="">
        </div>
      </template>
    </gni-nav-bar>
    <div class="wrapper" :style="isTips?'filter: blur(5px)':''">
      <!-- 2022/6/2 stella说这版暂时不上 -->
      <!-- <div class="add-asset">
        <div class="title">委托过的房源</div>
        <div class="add-container">
          <div class="add-address">萝岗敏捷广场</div>
          <div class="input-btn">一键录入</div>
        </div>
      </div> -->
      <div class="information-container">
        <div class="title">
          信息录入
        </div>
        <div class="cell-container">
          <div class="cell">
            <div class="left-title">城市：</div>
            <div class="right-content" :class="commissionData.city?'choose-active':''" @click="toolsGoPageView({path:'/home/city/index',query:{isFromwt:'2'}})">
              {{commissionData.city?commissionData.city.city_name:'请输入'}}
              <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_arrowRight.png'" alt="">
            </div>
          </div>
          <div class="cell" style="align-items: normal;">
            <div class="left-title">小区/路名：</div>
            <div class="right-content" :class="commissionData.village.mix_name?'choose-active':''" @click="toolsGoPageView({path:'/home/commission/villagechoose',query:{villageId:commissionData.village.id || 0}})">
              {{commissionData.village.mix_name || '请输入'}}
              <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_arrowRight.png'" alt="">
            </div>
          </div>
          <div class="cell" style="align-items: normal;">
            <div class="left-title">房号：</div>
            <div class="right-content" :class="commissionData.roomnumber.housefloor?'choose-active':''" @click="toolsGoPageView({path:'/home/commission/roomnumber'})">
              {{commissionData.roomnumber.housefloor?commissionData.roomnumber.housefloor+(commissionData.roomnumber.housefloor=='全栋'?'':'楼')+commissionData.roomnumber.houseNum+(commissionData.roomnumber.houseNum=='全层'?'':'房'):'请输入'}}
              <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_arrowRight.png'" alt="">
            </div>
          </div>
          <div class="cell">
            <div class="left-title">期望租金：</div>
            <div class="right-ipt">
              <input type="number" placeholder="请输入" v-model="rentprice" oninput="if(value>1000000)value=1000000;value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g,'$1')">
              元
            </div>
          </div>
          <div class="cell">
            <div class="left-title">建筑面积：</div>
            <div class="right-ipt">
              <input type="number" placeholder="请输入" v-model="buildarea" oninput="if(value>10000)value=10000;value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');">
              ㎡
            </div>
          </div>
          <div class="cell">
            <div class="left-title">出租方式：</div>
            <div class="right-content" :class="modestatus?'choose-active':''" @click="isShowrent = true">
              {{modestatus?modestatus==1?'整租':'合租':'请输入'}}
              <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_arrowRight.png'" alt="">
            </div>
          </div>
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
        <div class="btn-return" @click="submit">提交委托</div>
      </div>
    </div>

    <!-- 提示 -->
    <van-overlay :show="isTips" :z-index="1001" class-name="tips-overlay">
      <div class="block">
        <div class="oly-title">房源发布技巧</div>
        <div class="oly-line"></div>
        <div class="oly-text">1.小区：输入关键词后，请优先选择系统推荐小区，无系统推荐，也可手动输入小区/路名+楼栋号 (如金城花园A1栋)。</div>
        <div class="oly-text">2.地址：准确填写楼栋、单元、门牌号，可以加速房源上架。</div>
        <div class="oly-text">3.期望租金：建议参考同小区相似户型最新成交信息。合理的价格，可以更快出租房源。</div>
        <div class="oly-text">4.如果您已在门店委托，请不要在线上重复委托，可直接到业主中心查看该房源。</div>
        <div class="oly-close" @click="isTips=false">
          <img :src="$appConfig.appWebStaticUrl + '/commission/icon_transparentclose.png'" alt="">
        </div>
      </div>
    </van-overlay>
    <!-- 确定要放弃发布房源 -->
    <van-popup v-model="isGiveup" :round="true" :close-on-click-overlay="false">
      <div class="pop-container">
        <div class="pop-title">确定要放弃发布房源?</div>
        <div class="pop-content">
          <div class="pop-item">
            <img :src="$appConfig.appWebStaticUrl + '/commission/icon_puton.png'" alt="">
            <div class="item-text">快速上架</div>
          </div>
          <div class="pop-item">
            <img :src="$appConfig.appWebStaticUrl + '/commission/icon_fullservice.png'" alt="">
            <div class="item-text">全程服务</div>
          </div>
        </div>
        <div class="pop-btn">
          <div class="giveup-btn" @click="onClickBack">狠心放弃</div>
          <div class="keep-btn" @click="isGiveup=false">继续编辑</div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="isShowrent" position="bottom">
      <div class="rent-mode">
        <div class="mode-title">出租方式：</div>
        <div class="mode-content">
          <div class="content-item" @click="rent_mode=1" :class="rent_mode==1?'mode-active':''">整租</div>
          <div class="content-item" @click="rent_mode=2" :class="rent_mode==2?'mode-active':''">合租</div>
        </div>
        <div class="mode-footer">
          <div class="mode-close" @click="isShowrent=false">关闭</div>
          <div class="mode-confirm" @click="modeConfirm">确定</div>
        </div>
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
  data () {
    return {
      headTitle: '我要出租',
      isTips: false, // 提示遮罩层
      isGiveup: false, // 一键卖房弹窗
      rentprice: '',// 期望租价
      buildarea: '',  // 建筑面积
      name: '', // 称呼
      mobilephone: '',
      nowTime: '', // 现在的时间 年月日
      isShowrent: false, //底部弹窗
      rent_mode: -1, // 1整租 2合租
      modestatus: '',
      nameMaxLength: 24,//称呼字符长度
    }
  },
  computed: {
    ...mapState("commission", ["commissionData"]), //我的委托的信息
    ...mapState("user", ["userToken", "userInfo", "isLogin"]), //用户Token,用户登陆信息
  },
  async mounted () {
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
      console.log('初始化城市');
      this.$store.dispatch('commission/hanleChangeCityid');
    }
    // this.mobilephone = this.userInfo.user_row.mobile
    console.log('用户信息', this.userInfo);
  },
  watch: {
    'commissionData.city.city_id': {
      handler () {
        if (!this.$commonUtils.utilCore.empty(this.commissionData.village)) {
          console.log('城市变了啊');
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
      this.$store.dispatch('commission/hanleChangeCityid');
    },
    // 确认发布
    async submit () {
      this.$commonUtils.utilCore.showLoading();
      const postData = {
        entrust_type: 'rent',//	是	string	业务类型[shouse:售,rent:租]
        uptown_name: this.commissionData.village ? this.commissionData.village.uptown_name : '' || '',	//是	string	小区名称
        site_id: this.commissionData.city.city_id || '',	//是	string	城市ID
        city_id: this.commissionData.city.city_id || '',	//是	string	城市ID
        mobile: this.mobilephone || '',	//是	string	手机号码
        room_no: this.commissionData.roomnumber ? this.commissionData.roomnumber.houseNum : '' || '',	//是	string	房号
        price: this.rentprice || '',	//是	string	价格,若售业务该单位为万元
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
        rent_type: this.modestatus || "",//	否	string	租赁方式[1:整租,2:合租]
      }
      const res = await this.$store.dispatch('commission/getAppEntrustAadd', postData);
      if (res.code == 200) {
        let commission = {
          entrust_id: res.data.publish_id,
          submitTime: this.nowTime,
          entrust_type: 'rent'
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
    // 确定出租方式
    modeConfirm () {
      this.modestatus = this.rent_mode
      this.isShowrent = false
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
      this.rentprice = ''
      this.buildarea = ''
      this.name = ''
      this.rent_mode = -1
      this.modestatus = ''
    },
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
      this.isGiveup = false
      setTimeout(() => {
        this.emptyInit()
        this.setCommissionData({})
        this.toolsGoPageView({ path: '/home/commission/index' })
      }, 500);
    },
  }
}
</script>

<style lang='scss' scoped>
.releasehouse {
  padding-bottom: 1.5rem;
  .nav-left {
    display: flex;
    align-items: center;
    img {
      width: 0.4rem;
      height: 0.36rem;
      display: block;
    }
    .nav-close {
      padding-left: 0.24rem;
      img {
        width: 0.36rem;
        height: 0.36rem;
        display: block;
      }
    }
  }
  .nav-right {
    img {
      width: 0.36rem;
      height: 0.36rem;
      display: block;
    }
  }
  .wrapper {
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
      }
      .cell-container {
        .cell {
          padding: 0.3rem 0;
          margin: 0 0.4rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 0.02rem solid #f7f7f7;
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
      position: absolute;
      top: 0;
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
    width: 6.08rem;
    .pop-title {
      font-size: 0.44rem;
      font-weight: bold;
      color: #303030;
      text-align: center;
      padding-top: 0.6rem;
    }
    .pop-content {
      display: flex;
      justify-content: space-between;
      padding: 1rem 1.4rem 1.22rem;
      .pop-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          width: 0.8rem;
          height: 0.8rem;
        }
        .item-text {
          font-size: 0.28rem;
          font-weight: 400;
          color: #303030;
          padding-top: 0.28rem;
        }
      }
    }
    .pop-btn {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.48rem 0.34rem;
      .giveup-btn {
        width: 2.16rem;
        height: 0.68rem;
        font-size: 0.28rem;
        font-weight: 400;
        color: #000000;
        line-height: 0.68rem;
        text-align: center;
        border-radius: 0.08rem;
        border: 0.02rem solid #9d9d9d;
      }
      .keep-btn {
        width: 2.18rem;
        height: 0.7rem;
        font-size: 0.28rem;
        font-weight: 400;
        color: #000000;
        line-height: 0.7rem;
        text-align: center;
        background: #ffce09;
        border-radius: 0.08rem;
      }
    }
  }
  .rent-mode {
    .mode-title {
      font-size: 0.3rem;
      font-weight: 500;
      color: #000000;
      padding: 0.36rem 0.4rem 0.38rem;
    }
    .mode-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.4rem 0.92rem;
      .content-item {
        width: 3.16rem;
        height: 0.6rem;
        font-size: 0.28rem;
        font-weight: 400;
        color: #000000;
        text-align: center;
        line-height: 0.6rem;
        background: #f5f5f5;
        border-radius: 0.04rem;
      }
    }
    .mode-footer {
      width: 100%;
      height: 1.32rem;
      background: #ffffff;
      box-shadow: 0rem -0.04rem 0.08rem 0rem rgba(0, 0, 0, 0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.6rem;
      box-sizing: border-box;
      .mode-close {
        width: 2.6rem;
        height: 0.72rem;
        font-size: 0.32rem;
        font-weight: 400;
        color: #000000;
        text-align: center;
        line-height: 0.72rem;
        border-radius: 0.08rem;
        border: 0.04rem solid #000000;
      }
      .mode-confirm {
        width: 2.64rem;
        height: 0.76rem;
        font-size: 0.32rem;
        font-weight: 400;
        color: #000000;
        text-align: center;
        line-height: 0.76rem;
        background: #ffce09;
        border-radius: 0.08rem;
      }
    }
  }
  .choose-active {
    font-weight: bold !important;
    color: #000000 !important;
  }
  .mode-active {
    width: 3.14rem !important;
    height: 0.58rem !important;
    background: #fef6d6 !important;
    border: 0.02rem solid #ffce09 !important;
  }
  .van-popup--center.van-popup--round {
    border-radius: 0.1rem;
  }
  input::-webkit-input-placeholder {
    font-weight: 400;
  }
}
</style>
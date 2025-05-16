<template>
  <div class="appointmenthouse">
    <gni-nav-bar @onClickLeft="onClickBack" :pageTitle="headTitle" :hideRight="false">
    </gni-nav-bar>
    <div class="cell choose" @click="goBroker">
      <div class="cell-title">选择经纪人</div>
      <div class="cell-content" :class="appointmentbroker.broker_real_name?'choose-content':''">{{appointmentbroker.broker_real_name?appointmentbroker.broker_real_name:'请选择经纪人'}}</div>
      <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
    </div>
    <div class="cell call">
      <div class="cell-title">称呼</div>
      <input type="text" placeholder="请输入您的称呼" v-model="customName" :maxlength="nameMaxLength" @input="handleInputName">
    </div>
    <div class="cell-phone">
      <div class="cell-title">
        联系方式
        <div class="title-empty" @click="phoneNum = ''">
          <img :src="$appConfig.appWebStaticUrl + '/home/icon_empty_blue.png'" alt="">
          清空
        </div>
      </div>
      <gniPhoneInput :phone="phoneNum" @change="userMobileChange">
      </gniPhoneInput>
    </div>
    <div class="cell choose" @click="isCalendar = true">
      <div class="cell-title">预约时间</div>
      <div class="cell-content" :class="appointmentTime.alldate?'choose-content':''">{{timeIndex==0?appointmentTime.date+' '+'随时看房':(appointmentTime.alldate?appointmentTime.alldate:'请选择预约时间')}}</div>
      <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
    </div>
    <div class="footer">
      <div class="btn-return" @click="submit">预约提交</div>
    </div>
    <van-popup v-model="isAppointment" :round="true" :close-on-click-overlay="false">
      <div class="isAppointment">
        <div class="title">提示</div>
        <div class="content" v-if="isSuccess">预约成功！</div>
        <div class="content" v-else>预约失败！</div>
        <div class="btn" v-if="isSuccess" @click="goChat">确定</div>
        <div class="btn-cancel" v-else>
          <div class="btn-left" @click="isAppointment = false">取消</div>
          <div class="btn-right" @click="isAppointment = false">再次预约</div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="isCalendar" position="bottom">
      <calendarUi @confirm="confirm" @cancel="cancel" @changeTime="changeTime" :timeIndex="timeIndex" :timeItem="timeItem" :min-date="todayTime">
        <template slot="title">
          <div class="calender-title">预约时间：</div>
        </template>
        <template slot="subtitle">
          <div class="calender-title">看房时段：</div>
        </template>
        <template slot="timetype">
          <div class="time-type">
            <div class="type-item" v-for="(item,index) in timeType" :key="index" :class="timeIndex==index?'time-active':''" @click="chooseType(item,index,$event)">{{item.time}}</div>
          </div>
        </template>
      </calendarUi>
    </van-popup>
  </div>
</template>

<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import gniPhoneInput from "@/components/gni/gni-phone-input.vue";
import calendarUi from "@/components/yni/calendar-ui.vue";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  components: {
    gniNavBar,
    gniPhoneInput,
    calendarUi
  },
  data () {
    return {
      houseId: '', // 房源id
      resourceType: '', //1:二手房，2：租房
      headTitle: '',
      phoneNum: '',// 手机号码
      isAppointment: false, // 预约弹窗
      isCalendar: false, // 日历弹窗
      appointmentTime: {
        date: '',
        dateHour: '',
        alldate: ''
      }, //预约时间
      isSuccess: true,
      customName: '', //输入的称呼
      timeType: [
        {
          time: '随时可看'
        },
        {
          startTime: '9:00',
          endTime: '12:00',
          time: '9:00-12:00'
        },
        {
          startTime: '14:00',
          endTime: '18:00',
          time: '14:00-18:00'
        },
        {
          startTime: '18:00',
          endTime: '20:00',
          time: '18:00-20:00'
        },
      ],
      timeIndex: -1, // 选择时间段下标
      timeItem: {}, // 选择的数据
      todayTime: '', // 当前时间
      nameMaxLength: 12,//称呼字符长度
      cityId: '', // 城市id
    }
  },
  activated () {
    this.cityId = this.$route.query.city_id
    this.houseId = this.$route.query.houseId
    this.resourceType = this.$route.query.resourceType
    this.todayTime = this.$commonUtils.utilDate.date('Y-m-d')
    if (this.resourceType == 1) {
      this.headTitle = '预约看二手房'
    } else {
      this.headTitle = '预约看租房'
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   console.log('beforeRouteEnter', to, from, next);
  //   to.meta.keepAlive = true
  //   next()
  // },
  // beforeRouteLeave (to, from, next) {
  //   // 导航离开该组件的对应路由时调用
  //   console.log('beforeRouteLeave', to, from, next);
  //   if (to.path != "/home/detail/appointmentbroker") {
  //     from.meta.keepAlive = false
  //   }
  //   next()
  // },
  computed: {
    ...mapState("home", ["appointmentbroker"]),
  },
  async mounted () {
    setTimeout(async () => {
      //初始化登陆的状态
      await this.init();
    }, 500)
  },
  methods: {
    ...mapMutations('home', ['setAppointmentbroker']),
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
    //接收手机号
    userMobileChange (v) {
      this.phoneNum = v
    },
    // 预约提交
    async submit () {
      this.$commonUtils.utilCore.showLoading();
      const postData = {
        broker_checked: this.appointmentbroker.broker_id,//	是	string	经纪人id
        name: this.customName,//	是	string	称呼
        tel: this.phoneNum,//	是	string	联系方式
        time: this.appointmentTime.date,//	是	string	时间 格式 例子 2022/05/18
        resource_type: this.resourceType,//	是	string	1:二手房，2：租房
        resource_id: this.houseId,//	是	string	二手房id/租房id
        appointment_hour: this.timeIndex == 0 ? '' : this.appointmentTime.dateHour,//	否	string	预约时间段 例子 14:00-18:00 （如果是'随时看房'不用传）
        city_id: this.cityId
      }
      const res = await this.$store.dispatch('home/getAppointSeeHouseDo', postData);
      if (res.code == 200) {
        // 2022/5/19 stella说不显示预约失败的弹窗了，一律提示统一toast弹
        // 清掉选择的经纪人
        // this.setAppointmentbroker({})
        this.isAppointment = true
        this.$commonUtils.utilCore.closeLoading()
      }
    },
    confirm (v) {
      console.log(v);
      let startTime = v.startTime ? v.startTime.replace(":00", '') : ''
      let endTime = v.endTime ? v.endTime.replace(":00", '') : ''
      // 开始时间不得大于或等于结束时间
      if (Number(startTime) >= Number(endTime) && this.timeIndex != 0) {
        this.$commonUtils.utilCore.showToast("请选择正确的看房时段")
        return
      }
      this.appointmentTime.alldate = v._date3 // 总日期（日期➕具体时间）
      this.appointmentTime.date = v._date4 // 年月日
      this.appointmentTime.dateHour = v.hour // 具体小时
      this.isCalendar = false
    },
    // 选择时间段
    chooseType (item, index, e) {
      this.timeIndex = index
      this.timeItem = item
      // 如果已选中的可以取消
      // if (e.target.className == 'type-item time-active') {
      //   this.timeIndex = -1
      //   this.selectedhour = ''
      // }
    },
    // 跳转与经纪人聊天
    goChat () {
      this.isAppointment = false
      this.$store.dispatch('im/goChat', {
        to: 'b_' + this.appointmentbroker.erp_broker_id
      })
      this.setAppointmentbroker({})
      this.initEmpty()
    },
    cancel () {
      this.isCalendar = false
    },
    // 当修改到日期就取消上面选择的时间段
    changeTime () {
      if (this.timeIndex != -1) {
        this.timeIndex = -1
      }
    },
    goBroker () {
      this.toolsGoPageView({
        path: '/home/detail/appointmentbroker',
        query: {
          district_id: this.$route.query.district_id,
          houseId: this.houseId,
          resourceType: this.resourceType,//1:二手房，2：租房
          city_id: this.cityId
          // isBroker: this.$commonUtils.utilCore.empty(this.appointmentbroker) ? false : true
        }
      })
    },
    // 清空数据
    initEmpty () {
      this.phoneNum = ''
      this.customName = ''
      this.appointmentTime = {
        date: '',
        dateHour: '',
        alldate: ''
      }
    },
    // 称呼Input事件
    handleInputName () {
      this.name = this.name.replace(/[^a-zA-Z\u4e00-\u9fa5]/g, '');
      const leng = this.computeMaxLength(this.name);
      this.nameMaxLength = 24 - leng * 2;
    },
    //  计算中文长度
    computeMaxLength (val) {
      // 中文、中文标点、全角字符
      let length = 0;
      const reg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g;
      const mat = val.match(reg);
      if (mat) {
        length = mat.length;
      }
      return length;
    },
    // 返回
    onClickBack () {
      this.initEmpty()
      this.toolsGoPageBack();
      this.setAppointmentbroker({})
    }
  }
}
</script>

<style lang="scss" scoped>
.appointmenthouse {
  height: 100vh;
  .cell {
    margin: 0 0.4rem;
    display: flex;
    align-items: center;
    padding: 0.34rem 0;
    box-sizing: border-box;
    .cell-title {
      font-size: 0.32rem;
      font-weight: 400;
      color: #737373;
    }
    .cell-content {
      font-size: 0.28rem;
      font-weight: 400;
      color: #737373;
    }
    img {
      width: 0.4rem;
      height: 0.4rem;
    }
  }
  .choose {
    justify-content: space-between;
  }
  .call {
    border-bottom: 0.01rem solid #e5e5e5;
    white-space: nowrap;
    input {
      font-size: 0.28rem;
      font-weight: 400;
      border: none;
      margin-left: 2.35rem;
      text-indent: 0.2rem;
    }

    ::-webkit-input-placeholder {
      /* WebKit, Blink, Edge */
      color: #737373;
    }
    :-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: #737373;
    }
    ::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: #737373;
    }
    :-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: #737373;
    }
    ::-ms-input-placeholder {
      /* Microsoft Edge */
      color: #737373;
    }
  }
  .cell-phone {
    padding: 0.34rem 0.4rem;
    .cell-title {
      font-size: 0.32rem;
      font-weight: 400;
      color: #737373;
      padding-bottom: 0.2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title-empty {
        font-size: 0.24rem;
        color: #032a98;
        display: flex;
        align-items: center;
        img {
          width: 0.3rem;
          height: 0.3rem;
          padding-right: 0.03rem;
        }
      }
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
      width: 6.54rem;
      height: 1rem;
      margin: 0 auto;
      text-align: center;
      line-height: 1rem;
      font-size: 0.32rem;
      font-weight: 400;
      color: #000000;
      background: #ffce09;
      border-radius: 0.12rem;
    }
  }
  .isAppointment {
    width: 6rem;
    .title {
      font-size: 0.32rem;
      font-weight: 400;
      color: #111111;
      text-align: center;
      padding: 0.34rem 0 0.22rem;
      border-bottom: 0.01rem solid #cccccc;
    }
    .content {
      font-size: 0.32rem;
      font-weight: 400;
      color: #111111;
      text-align: center;
      padding: 0.9rem 0;
    }
    .btn {
      font-size: 0.28rem;
      font-weight: bold;
      color: #f7d447;
      text-align: center;
      padding: 0.3rem 0 0.28rem;
      border-top: 0.01rem solid #f1f1f1;
    }
    .btn-cancel {
      height: 0.85rem;
      line-height: 0.85rem;
      text-align: center;
      border-top: 0.01rem solid #f1f1f1;
      display: flex;
      .btn-left {
        width: 2.98rem;
        font-size: 0.28rem;
        font-weight: 400;
        color: #111111;
        border-right: 0.01rem solid #f1f1f1;
      }
      .btn-right {
        width: 2.98rem;
        font-size: 0.28rem;
        font-weight: bold;
        color: #f7d447;
      }
    }
  }
  .calender-title {
    font-size: 0.3rem;
    font-family: SourceHanSansCN-Bold, SourceHanSansCN;
    font-weight: bold;
    color: #111111;
    padding: 0.28rem 0.4rem;
  }
  .time-type {
    padding: 0.16rem 0.4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .type-item {
      width: 1.6rem;
      height: 0.64rem;
      font-size: 0.26rem;
      font-weight: 400;
      color: #000000;
      text-align: center;
      line-height: 0.64rem;
      background: #f8f8f8;
    }
  }
  .time-active {
    width: 1.6rem !important;
    background: #fef6d6 !important;
    border: 0.02rem solid #ffce09;
  }
  .choose-content {
    color: #111111 !important;
  }
  /deep/ .van-popup--center.van-popup--round {
    border-radius: 0.12rem;
  }
  /deep/ .van-popup--bottom {
    height: 90vh;
  }
  /deep/ ._bottom-button-box {
    z-index: 999;
  }
  /deep/ .van-picker-column__item {
    font-size: 0.36rem;
    font-weight: bold;
    color: #ffce09;
  }
}
</style>
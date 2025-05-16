<template>
  <div class="roomnumber">
    <gni-nav-bar :pageTitle="headTitle" @onClickLeft="onClickBack" :hideRight="false" :hideLeft="false">
      <template slot="slot-left">
        <div class="nav-left">
          <img :src="$appConfig.appWebStaticUrl + '/commission/icon_return.png'" alt="">
        </div>
      </template>
    </gni-nav-bar>
    <div class="wrapper">
      <div class="cell">
        <input type="text" placeholder="请输入楼层" v-model="housefloor" :readonly="isAllbuilding" maxlength="12" @input="housefloor = housefloor.replace(/[^\w\u4E00-\u9FA5]/g,'');">
        <div class="cell-right" @click="selectIcon(1)">
          <div class="right-select">
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_select.png'" alt="" v-if="isAllbuilding">
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_unselect.png'" alt="" v-else>
          </div>
          <span>全栋</span>
        </div>
        <div class="unit-text">楼</div>
      </div>
      <div class="cell">
        <input type="text" placeholder="请输入房号" v-model="houseNum" :readonly="isAllfloor" oninput="value=value.replace(/[\W]/g,'')" maxlength="12" v-if="floorIndex==10">
        <div v-else>
          <div class="choose-num" @click="!isAllfloor?isShowul = !isShowul:''" :style="houseNum?'color:#000000':''">
            {{houseNum?houseNum=='全层'?houseNum:houseNum+'房':'请选择房号'}}
            <img :src="$appConfig.appWebStaticUrl + '/commission/icon_open.png'" alt="" class="icon_open">
            <img :src="$appConfig.appWebStaticUrl + '/commission/icon_artboard.png'" alt="" v-show="isShowul && floorIndex==0" class="icon_artboard">
          </div>
          <ul v-show="isShowul">
            <li v-for="(item,index) in floorData" :key="index" @click="chooseFloor(item.num,index)" :class="floorIndex == index?'flooractive':''">{{item.num}}</li>
          </ul>
        </div>
        <div class="unit-text" v-if="floorIndex==10">房</div>
        <div class="cell-right" @click="selectIcon(2)">
          <div class="right-select">
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_select.png'" alt="" v-if="isAllfloor">
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_unselect.png'" alt="" v-else>
          </div>
          <span>全层</span>
        </div>
      </div>
      <div class="confirm" @click="submit">完成</div>
      <div class="tips-container">
        <div class="title">温馨提示：</div>
        <div class="text">别墅、商铺、厂房等如没有单元号，请选择全栋/全层。</div>
      </div>
    </div>
  </div>
</template>

<script>
import gniNavBar from '@/components/gni/gni-nav-bar.vue'
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  components: { gniNavBar },
  data () {
    return {
      headTitle: '房号', //标题文字
      isAllbuilding: false, // 全栋？
      isAllfloor: false, // 全层？
      floorData: [
        {
          num: '01',
        },
        {
          num: '02',
        },
        {
          num: '03',
        },
        {
          num: '04',
        },
        {
          num: '05',
        },
        {
          num: '06',
        },
        {
          num: '07',
        },
        {
          num: '08',
        },
        {
          num: '09',
        },
        {
          num: '10',
        },
        {
          num: '其他',
        },
      ],
      floorIndex: -1,
      isShowul: false,
      housefloor: '',  //楼层
      houseNum: '', //房号
    }
  },
  computed: {
    ...mapState("commission", ["commissionData"]), //城市的信息
  },
  mounted () {
    if (this.commissionData.roomnumber) {
      this.housefloor = this.commissionData.roomnumber.housefloor
      this.houseNum = this.commissionData.roomnumber.houseNum
    }
    if (this.commissionData.roomnumber && this.commissionData.roomnumber.housefloor == '全栋') {
      this.isAllbuilding = true
    }
    if (this.commissionData.roomnumber && this.commissionData.roomnumber.houseNum == '全层') {
      this.isAllfloor = true
    }
  },
  methods: {
    ...mapMutations('commission', ['setCommissionData']),
    // 选择房号
    chooseFloor (num, i) {
      if (i == 10) {
        this.houseNum = ''
      } else {
        this.houseNum = num
      }
      this.floorIndex = i
      this.isShowul = false
    },
    // 按钮 1栋 2层
    selectIcon (i) {
      if (i == 1) {
        this.isAllbuilding = !this.isAllbuilding
        this.housefloor = '全栋'
      } else {
        this.isAllfloor = !this.isAllfloor
        this.houseNum = '全层'
      }
    },
    // 完成提交
    submit () {
      if (this.$commonUtils.utilCore.empty(this.housefloor)) {
        this.$commonUtils.utilCore.showToast("请输入楼层");
        return
      } else if (this.$commonUtils.utilCore.empty(this.houseNum)) {
        this.$commonUtils.utilCore.showToast("请输入房号");
        return
      }
      let data = {
        housefloor: this.housefloor,
        houseNum: this.houseNum,
      }
      this.setCommissionData({ data: data, key: "roomnumber" })
      this.toolsGoPageBack();
    },
    //返回上一层
    onClickBack () {
      this.toolsGoPageBack();
    },
  }
}
</script>

<style lang="scss" scoped>
.roomnumber {
  .nav-left {
    img {
      width: 0.4rem;
      height: 0.36rem;
      display: block;
    }
  }
  .wrapper {
    margin: 0 0.4rem;

    input::-webkit-input-placeholder {
      color: #737373;
    }
    input::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: #737373;
    }
    input:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: #737373;
    }
    input:-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: #737373;
    }
    input {
      width: 100%;
      height: 1.08rem;
      font-size: 0.32rem;
      font-weight: 400;
      box-sizing: border-box;
      padding-left: 0.3rem;
      padding-right: 4.5rem;
      border: none;
      border-bottom: 0.02rem solid #f7f7f7;
      display: block;
    }
    .cell {
      position: relative;
      .choose-num {
        width: 2.5rem;
        height: 1.08rem;
        line-height: 1.08rem;
        font-size: 0.32rem;
        font-weight: 400;
        color: #737373;
        padding-left: 0.3rem;
        box-sizing: border-box;
        border-bottom: 0.02rem solid #f7f7f7;
        .icon_open {
          width: 0.3rem;
          height: 0.3rem;
          padding-left: 0.2rem;
          vertical-align: middle;
          position: absolute;
          top: 0.4rem;
          left: 2.1rem;
        }
        .icon_artboard {
          width: 0.15rem;
          height: 0.1rem;
          position: absolute;
          bottom: -0.1rem;
          left: 1.3rem;
        }
      }
      ul {
        height: 5rem;
        position: absolute;
        top: 1.15rem;
        z-index: 99;
        overflow: auto;
        background: #ffffff;
        box-shadow: 0rem 0.04rem 0.12rem 0rem rgba(129, 129, 129, 0.3);
        li {
          width: 2.6rem;
          height: 1rem;
          font-size: 0.28rem;
          font-weight: 400;
          color: #000000;
          text-align: center;
          line-height: 1rem;
          border-bottom: 0.02rem solid #f7f7f7;
        }
      }
      .cell-right {
        display: flex;
        align-items: center;
        position: absolute;
        top: 0.38rem;
        right: 0.34rem;
        .right-select {
          img {
            width: 0.3rem;
            height: 0.3rem;
            display: block;
          }
        }
        span {
          font-size: 0.3rem;
          font-weight: 400;
          color: #000000;
          padding-left: 0.1rem;
        }
      }
      .unit-text {
        color: #000000;
        font-size: 0.32rem;
        position: absolute;
        top: 0.32rem;
        left: 2.3rem;
      }
    }
    .confirm {
      width: 6rem;
      height: 0.8rem;
      font-size: 0.32rem;
      font-weight: 400;
      color: #000000;
      line-height: 0.8rem;
      text-align: center;
      background: #ffce09;
      border-radius: 0.1rem;
      margin-top: 0.26rem;
      margin-left: 0.32rem;
    }
    .tips-container {
      padding-top: 0.66rem;
      padding-left: 0.32rem;
      .title {
        font-size: 0.28rem;
        font-weight: bold;
        color: #000000;
        padding-bottom: 0.2rem;
      }
      .text {
        font-size: 0.24rem;
        font-weight: 400;
        color: #737373;
      }
    }
  }
  .flooractive {
    background: #ffce09 !important;
    border-radius: 0.04rem;
  }
}
</style>
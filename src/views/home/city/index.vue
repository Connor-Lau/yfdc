<template>
  <div class="cityIndex">
    <gni-nav-bar :pageTitle="headTitle" @onClickLeft="onClickBack" :hideRight="false"></gni-nav-bar>
    <div class="wrapper">
      <div class="ipt-container-wt" v-if="isFromwt" @click="toolsGoPageView({path:'/home/city/searchcity',query:{isFromwt:isFromwt}})">
        <input type="text" placeholder="请输入城市名称">
        <img :src="$appConfig.appWebStaticUrl + '/home/icon_magnifier.png'" alt="" class="icon-magnifier">
      </div>
      <div class="ipt-container" @click="toolsGoPageView({path:'/home/city/searchcity'})" v-else>
        <input v-model="inputData" type="text" placeholder="请输入城市名称">
        <div class="search-btn" @click="loadData">搜索</div>
      </div>
      <div class="choose-city">
        <div class="title">选择城市</div>
        <div class="location">
          <div class="left">
            <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_location.png'" alt="">
            <span>{{cityName}}</span>
          </div>
          <div class="right" @click="loadCtiy">
            <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_cityrefresh.png'" alt="">
            <span>重新获取</span>
          </div>
        </div>
      </div>
      <div class="recent-visit" v-if="recentCity.length > 0">
        <div class="recent-title">最近访问</div>
        <div class="recent-content">
          <div class="recent-item" v-for="(item,index) in recentCity" :key="index" @click="doChangeCityClick(item.cityName,item.cityId,item.is_69,item)">
            {{item.cityName}}
          </div>
        </div>
      </div>
      <div class="cityBox">
        <div class="city-title">全部城市（按首字母顺序）</div>
        <div v-for="(item, index) in listsCityData" :key="index" class="item-container">
          <div class="itemTitle" :id="item.id">
            {{item.name}}
          </div>
          <div class="itemCell">
            <div class="cellText" hover-class="active" v-for="(item2,index2) in item.data" :key="index2" @click="doChangeCityClick(item2.name,item2.id,item2.is_69,item)">
              {{item2.name}}
            </div>
          </div>
        </div>
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
      headTitle: '选择城市', //标题文字
      listsCityData: [],
      inputData: '', //搜索
      recentCityList: [], // 最近访问的数据
      isFromwt: false,// 从委托进来的标识
    }
  },
  computed: {
    ...mapState("user", ["userToken"]),
    ...mapState("city", ["geoPosition", "thisCityInfo", "switchCityInfo", "cityInfoRows", "recentCity"]), //城市的信息
    cityName () {//显示当前的城市
      if (
        !this.$commonUtils.utilCore.empty(this.switchCityInfo)
        && !this.$commonUtils.utilCore.empty(this.switchCityInfo.city_info)
        && !this.$commonUtils.utilCore.empty(this.switchCityInfo.city_id)
        && !this.$commonUtils.utilCore.empty(this.switchCityInfo.city_name)
      ) {
        return this.switchCityInfo.city_name
      }
      if (
        !this.$commonUtils.utilCore.empty(this.thisCityInfo)
        && !this.$commonUtils.utilCore.empty(this.thisCityInfo.city_id)
        && !this.$commonUtils.utilCore.empty(this.thisCityInfo.city_name)
      ) {
        return this.thisCityInfo.city_name
      }
    },
  },
  mounted () {
    this.isFromwt = this.$route.query.isFromwt  // 1发布房源 2我要出租
    this.loadData()
  },
  methods: {
    ...mapMutations('city', ['setRecentCity', 'setSwitchCityInfo']),
    ...mapMutations('commission', ['setCommissionData']),
    //返回上一层
    onClickBack () {
      this.$router.go(-1);
    },
    async loadData () {
      // this.$commonUtils.utilCore.showLoading("", { overlay: true });
      this.listsCityData = []
      let postData = {
        site_name: this.inputData
      }
      const cityRows = await this.$store.dispatch('city/getAppFangBaseDataGetCityRows', { messageAct: this.$messageAct, postData: postData });
      if (cityRows) {
        let letterCityRows = {}
        for (const key in cityRows) {
          const cityRow = cityRows[key]
          if (cityRow.first_letter) {  // 判断有没有大写字母排序，隐藏了“测试”项
            if (!(cityRow['first_letter'] in letterCityRows)) {
              letterCityRows[cityRow['first_letter']] = {
                'letter': cityRow['first_letter'],
                'id': cityRow['first_letter'],
                'name': cityRow['first_letter'],
                'data': {}
              }
            }
            letterCityRows[cityRow['first_letter']]['data'][cityRow['site_id']] = {
              'id': cityRow['site_id'],
              'name': cityRow['site_name'],
              'is_69': cityRow['is_69'],
            }
          }
        }
        // 将对象转为数组
        const letterCityRowsObj = letterCityRows
        letterCityRows = []
        for (const key in letterCityRowsObj) {
          letterCityRows.push(letterCityRowsObj[key])
        }
        // 数组字母排序
        letterCityRows.sort(function (a, b) {
          const m = a.letter
          const n = b.letter
          if (m < n) return -1
          else if (m > n) return 1
          else return 0
        })
        this.listsCityData = letterCityRows
      }
      // this.$commonUtils.utilCore.closeLoading()
    },
    doChangeCityClick (name, id, is69, info) {
      const messageData = {
        act: 'getCity',
        cityName: name,
        cityId: id,
        is_69: is69,
        msg: '最近访问的城市'
      }
      const switchData = {
        city_id: id,
        city_name: name,
        is_69: is69,
        city_info: info
      }
      if (this.$commonUtils.utilCore.empty(this.isFromwt)) {
        this.setRecentCity(messageData)
        this.setSwitchCityInfo(switchData)
      } else {
        this.setCommissionData({ data: switchData, key: "city" })
      }
      this.onClickBack()
    },
    async loadCtiy () {
      if (
        !this.$commonUtils.utilCore.empty(this.thisCityInfo)
        && !this.$commonUtils.utilCore.empty(this.thisCityInfo.city_id)
        && !this.$commonUtils.utilCore.empty(this.thisCityInfo.city_name)
      ) {
        const messageData = {
          act: 'getCity',
          cityName: this.thisCityInfo.city_name,
          cityId: this.thisCityInfo.city_id,
          is_69: this.thisCityInfo.is_69,
          msg: '获取当前城市'
        }
        const switchData = {
          city_id: this.thisCityInfo.city_id,
          city_name: this.thisCityInfo.city_name,
          city_info: this.thisCityInfo.city_info,
          is_69: this.thisCityInfo.is_69,
        }
        this.setRecentCity(messageData)
        this.setSwitchCityInfo(switchData)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.cityIndex {
  .wrapper {
    background: #f5f5f5;
    padding: 0.36rem 0.38rem 0.4rem;
    .ipt-container-wt {
      position: relative;
      box-shadow: 0rem 0.02rem 0.2rem 0rem rgba(209, 209, 209, 0.5);
      input {
        width: 6.74rem;
        height: 1rem;
        font-size: 0.32rem;
        background: #ffffff;
        box-sizing: border-box;
        font-weight: bold;
        border-radius: 0.1rem;
        border: 0.01rem solid #cecece;
        padding-left: 0.76rem;
        display: block;
      }
      img {
        width: 0.28rem;
        height: 0.28rem;
        position: absolute;
        top: 0.35rem;
        left: 0.36rem;
      }
    }
    .ipt-container {
      width: 6.74rem;
      height: 0.68rem;
      box-shadow: 0rem 0.06rem 0.08rem 0rem rgba(223, 223, 223, 0.5);
      border-radius: 0.33rem;
      position: relative;
      input {
        width: 100%;
        height: 100%;
        font-size: 0.28rem;
        color: #0a3cc7;
        font-weight: 400;
        text-shadow: 0px 0px 0px rgba(223, 223, 223, 0.5);
        border-radius: 0.33rem;
        border: 0.01rem solid #999999;
        display: block;
        box-sizing: border-box;
        padding-left: 0.28rem;
        padding-right: 1.72rem;
      }

      .search-btn {
        width: 1.12rem;
        font-size: 0.28rem;
        font-weight: 400;
        color: #000000;
        line-height: 0.68rem;
        text-align: center;
        text-shadow: 0px 0px 0px rgba(223, 223, 223, 0.5);
        background: #ffce09;
        box-shadow: 0rem 0.06rem 0.08rem 0rem rgba(223, 223, 223, 0.5),
          -0.04rem 0rem 0.02rem 0rem rgba(192, 192, 192, 0.5);
        border-radius: 0.33rem;
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    .recent-visit {
      .recent-title {
        font-size: 0.26rem;
        font-weight: 400;
        color: #737373;
        padding-top: 0.44rem;
        padding-bottom: 0.32rem;
      }
      .recent-content {
        display: flex;
        flex-wrap: wrap;
        .recent-item {
          width: 2.04rem;
          height: 0.78rem;
          font-size: 0.3rem;
          font-weight: 400;
          color: #000000;
          text-align: center;
          line-height: 0.78rem;
          background: #ffffff;
          margin-right: 0.3rem;
          margin-bottom: 0.3rem;
          &:nth-child(3n) {
            margin-right: 0;
          }
        }
      }
    }
    .choose-city {
      .title {
        font-size: 0.26rem;
        font-weight: 400;
        color: #737373;
        padding-top: 0.44rem;
        padding-bottom: 0.32rem;
      }
      .location {
        padding: 0.24rem 0.26rem;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          display: flex;
          align-items: center;
          img {
            width: 0.24rem;
            height: 0.24rem;
          }
          span {
            font-size: 0.26rem;
            font-weight: 400;
            color: #000000;
            padding-left: 0.14rem;
          }
        }
        .right {
          display: flex;
          align-items: center;
          img {
            width: 0.24rem;
            height: 0.24rem;
          }
          span {
            font-size: 0.24rem;
            font-weight: 400;
            color: #008df0;
            padding-left: 0.04rem;
          }
        }
      }
    }
    .cityBox {
      .city-title {
        font-size: 0.26rem;
        font-weight: 400;
        color: #737373;
        padding-top: 0.44rem;
        padding-bottom: 0.32rem;
      }
      .item-container {
        padding-bottom: 0.32rem;
        .itemTitle {
          font-size: 0.26rem;
          font-weight: 400;
          color: #737373;
          padding-bottom: 0.32rem;
        }
        .itemCell {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          background: #ffffff;
          .cellText {
            width: 2.04rem;
            height: 0.78rem;
            font-size: 0.3rem;
            line-height: 0.78rem;
            font-weight: 400;
            color: #000000;
            text-align: center;
            margin-right: 0.3rem;
            &.active {
              background-color: #f9f9f9;
            }
            &:nth-child(3n) {
              margin-right: 0;
            }
          }
        }
      }
    }
  }
}
</style>

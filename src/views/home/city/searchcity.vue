<template>
  <div class="choose-city">
    <gni-nav-bar :pageTitle="headTitle" @onClickLeft="onClickBack" :hideRight="false"></gni-nav-bar>
    <div class="wrapper">
      <div class="ipt-container">
        <input v-model="inputData" ref="inputVal" type="text" placeholder="请输入城市名称" @input="searchCity">
        <div class="empty" @click="emptyIpt()" v-if="inputData">
          <img :src="$appConfig.appWebStaticUrl + '/home/icon_close.png'" alt="">
        </div>
        <div class="search-btn" @click="searchCity">搜索</div>
      </div>
      <div class="search-history" v-if="searchHistoryCity.length > 0 && isShowhistory">
        <div class="title">
          <span>搜索历史</span>
          <div class="icon-empty" @click="clearSearchCity">
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_empty.png'" alt="">
          </div>

        </div>
        <div class="content">
          <div class="history-item" v-for="(item,index) in searchHistoryCity" :key="index" @click="chooseCity(item.cityName,item.cityId,item.is_69,item)">{{item.cityName}}</div>
        </div>
      </div>
      <div class="search-result">
        <div class="result-item" v-for="(item, index) in listsCityData" :key="index" v-html="item.html" @click="chooseCity(item.city_name,item.city_id,item.is_69,item.city_info)">
          {{item.html}}
        </div>
      </div>
      <div class="search-nothing" v-if="nothingResult && this.listsCityData.length == 0 ">没有找到"<span>{{inputData}}</span>"相关结果</div>
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
      nothingResult: false,
      isShowhistory: true,
      isFromwt: false,  // 从委托进来的标识
    }
  },
  computed: {
    ...mapState("user", ["userToken"]),
    ...mapState("city", ["recentCity", "searchHistoryCity"]), //
  },
  watch: {
    inputData: function (newVal, oldVal) {
      if (newVal == '') {
        this.nothingResult = false
        this.isShowhistory = true
      } else {
        this.isShowhistory = false
      }
    }
  },
  mounted () {
    this.isFromwt = this.$route.query.isFromwt
    this.$refs["inputVal"].focus();
  },
  methods: {
    ...mapMutations('city', ['setRecentCity', 'setSwitchCityInfo', 'setSearchCity', 'clearSearchCity']),
    ...mapMutations('commission', ['setCommissionData']),
    //返回上一层
    onClickBack () {
      this.$router.go(-1);
    },
    async getCitydata () {
      this.listsCityData = []
      let postData = {
        site_name: this.inputData
      }
      let res = await this.$store.dispatch('city/getAppFangBaseDataGetCityRows', { messageAct: this.$messageAct, postData: postData });
      if (JSON.stringify(res) != '{}') {
        this.$commonUtils.appLog.log("===============>>>>>", res)
        let resArr = []
        resArr.push(res)
        resArr.forEach((item) => {
          item.html = item.city_name.replace(this.inputData, "<span style='color: #007AFF;'>" + this.inputData + "</span>")
          this.listsCityData = resArr
        })
      } else {
        this.nothingResult = true
      }
    },
    // 清空搜索
    emptyIpt () {
      this.inputData = ''
      this.listsCityData = []
      console.log('s')
      console.log(11);    
    },
    searchCity () {
      this.listsCityData = []
      if (this.$commonUtils.utilCore.empty(this.inputData)) {
        return;
      }
      this.$nextTick(() => {
        this.getCitydata();
      });
    },
    chooseCity (name, id, is69, info) {
      const messageData = {
        act: 'getCity',
        cityName: name,
        cityId: id,
        is_69: is69,
        msg: '城市搜索访问的城市'
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
        this.setSearchCity(messageData)
        this.toolsGoPageView({ path: '/home/index' })
      } else if (this.isFromwt == '1') {
        this.setCommissionData({ data: switchData, key: "city" })
        this.toolsGoPageView({ path: '/home/commission/releasehouse' })
      } else {
        this.setCommissionData({ data: switchData, key: "city" })
        this.toolsGoPageView({ path: '/home/commission/rentalhouse' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.choose-city {
  .wrapper {
    padding: 0.36rem 0.38rem 0.4rem;
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
      .empty {
        position: absolute;
        top: 0.18rem;
        right: 1.4rem;
        z-index: 1;
        img {
          width: 0.32rem;
          height: 0.32rem;
          display: block;
        }
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
    .search-history {
      padding: 0.58rem 0.1rem 0;
      .title {
        padding-bottom: 0.4rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          font-size: 0.3rem;
          font-weight: 400;
          color: #000000;
        }
        .icon-empty {
          img {
            width: 0.32rem;
            height: 0.32rem;
            display: block;
          }
        }
      }
      .content {
        display: flex;
        flex-wrap: wrap;
        .history-item {
          width: 1.6rem;
          height: 0.56rem;
          font-size: 0.24rem;
          font-weight: 400;
          color: #000000;
          line-height: 0.56rem;
          text-align: center;
          background: #f5f5f5;
          border-radius: 0.3rem;
          margin-right: 0.24rem;
          margin-bottom: 0.24rem;
        }
      }
    }
    .search-result {
      margin-top: 0.28rem;
      .result-item {
        font-size: 0.3rem;
        font-family: SourceHanSansCN-Normal, SourceHanSansCN;
        font-weight: 400;
        color: #000000;
        padding: 0.28rem;
        border-bottom: 0.02rem solid #f7f7f7;
      }
      span {
        color: #0a3cc7;
      }
    }
    .search-nothing {
      font-size: 0.3rem;
      color: #737373;
      font-weight: 400;
      text-align: center;
      padding-top: 0.86rem;
      span {
        color: #0a3cc7;
      }
    }
  }
}
</style>

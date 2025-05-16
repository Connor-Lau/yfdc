<template>
  <div class="search">
    <div class="header-box" style="padding-bottom: 0.44rem;">
      <gni-nav-bar :isShowNav="false"></gni-nav-bar>
      <div class="header">
        <div class="icon-return" @click="onClickBack">
          <img :src="$appConfig.appWebStaticUrl + '/home/icon_reutrn.png'" alt="">
        </div>
        <div class="header-nav">
          <div class="header-item" v-for="(item,index) in options" :key="index" @click="handleTab(item)">
            <div class="text" :class="typeIndex == item.id?'active':''">{{item.text}}</div>
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_line.png'" alt="" v-show="typeIndex == item.id">
          </div>
        </div>
      </div>
      <div class="search-container">
        <div class="search">
          <form action="javascript:;" @submit="$refs.searchRef.blur();actSearch(2);" class="formstyle">
            <input type="text" v-model="searchValue" placeholder="请输入小区/路段名称" @input="inputSearch" ref="searchRef">
          </form>
          <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_searchbig.png'" alt="" class="icon-magnifier">
        </div>
        <div class="search-cancel" @click="emptyIpt">取消</div>
      </div>
    </div>
  
    <div class="wrapper" :style="{height: contentHeight + 'px'}">
      <!-- 2023/1/6 先屏蔽 -->
      <div class="search-key" v-show="searchValue && searchKeyWorkList.length > 0" @click="actSearch(2)">
        <div class="key-left">
          搜索“<span>{{searchValue}}</span>”
        </div>
        <div class="key-right">
          <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
        </div>
      </div>
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="searchKeyWorkList && searchKeyWorkList.length > 0 ? '没有更多了' : ''"
        :immediate-check="false"
        @load="_getList" v-show="searchValue">
        <div class="search-result">
          <template v-if="typeIndex==0">
            <div class="result-item" v-for="(item,index) in searchKeyWorkList" @click="selectSearch(item)" :key="index+1">
              <div class="item-left">
                <div class="result-label">{{item.type==4?'小区':'新房'}}</div>
                <div class="result-content">
                  <div class="content-top">
                    <div class="content-top-name" v-html="item.html"></div>
                  </div>
                  <div class="content-bottom">{{item.district_replace_name}} {{item.block_name}}</div>
                </div>
              </div>
              <div :class="item.type==4?'item-right':'item-right item-right-newhouse'">{{item.type==4?item.sale_num+'套在售':item.average_price+'元/㎡'}}</div>
            </div>
          </template>
          <template v-else>
            <!-- <div class="result-item-rent" v-for="(item,index) in searchKeyWorkList" @click="selectSearch(item)" :key="index"> -->
            <!-- <div class="result-label" v-show="typeIndex==0">{{item.type==3?'新房':'二手房'}}</div> -->
            <!-- <div class="result-content" v-html="item.html"></div>
            </div> -->
            <div class="result-item" v-for="(item,index) in searchKeyWorkList" @click="selectSearch(item)" :key="index+2">
              <div class="item-left">
                <div class="result-label">租房</div>
                <div class="result-content">
                  <div class="content-top">
                    <div class="content-top-name" v-html="item.html"></div>
                  </div>
                  <div class="content-bottom">{{item.district_replace_name}} {{item.block_name}}</div>
                </div>
              </div>
              <div class="item-right">{{item.rent_num}}套在租</div>
            </div>
          </template>
        </div>
      </van-list>
      <div class="search-history" v-show="!searchValue">
        <div class="title">
          <span>搜索历史</span>
          <div class="clear-history" @click="clearKeyWord()">
            <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_searchempty.png'" alt="">
          </div>
        </div>
        <div class="content">
          <div class="history-item" v-for="(item,index) in dataHistoryList" @click="selectHistorySearch(item)" :key="index">{{item}}</div>
        </div>
      </div>
      <div class="search-hint-box" v-show="!searchKeyWorkList.length && searchValue && !loading">
        <div class="keyword">没有找到“<span class="keyword">{{ searchValue }}</span>”相关结果</div>
        <div class="change-city" v-show="!$commonUtils.utilCore.empty(guessCity)">
          <div class="change-text">{{guessCity.tip}}</div>
          <div class="change-btn" @click="changeCity(guessCity)">切换城市</div>
        </div>
        <!-- <div class="guess-list" v-show="typeIndex==0">
          <div class="guess-title">猜你想搜索的房源</div>
          <div class="guess-content">
            <div class="result-item guess-item" v-for="(item,index) in guessList" @click="selectSearch(item)" :key="index+1">
              <div class="item-left">
                <div class="result-label">二手房</div>
                <div class="result-content">
                  <div class="content-top">
                    <div class="content-top-name" v-html="item.html"></div>
                  </div>
                  <div class="content-bottom">{{item.city_name}} {{item.district_name}}</div>
                </div>
              </div>
              <div class="item-right">{{item.num}}套在售</div>
            </div>
          </div>
        </div> -->
      </div>
    </div>
    <div class="footer">
      <div class="btn-return" @click="onClickBack">退出</div>
    </div>
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
      options: [
        {
          id: 0,
          text: '买房',
          val: 'sale'
        },
        {
          id: 1,
          text: '租房',
          val: 'rent'
        }
      ],
      typeIndex: 0,
      searchValue: '', //搜索的数据
      searchUptownId: '',// 2023/1/3改为通过小区id查询
      houseType: 'sale',//房源类型（sale 二手房 || 新房rent 租房）
      searchKeyWorkList: [],//模糊搜索提示数据
      showPlaceholder: "请输入小区/路段名称",//搜索框提示内容
      dataHistoryList: [],//搜索历史
      page: 1,
      limit: 10,
      loading: false,
      finished: false,
      contentHeight: 0,
      innerHeight: 0,
      guessList: [], // 猜你喜欢的数据
      guessCity: {}, // 猜你想切换的城市
      timer: null,
    }
  },
  //返回首页清空value
  beforeRouteEnter (to, from, next) {
    if (from.path == '/common/index') {
      next(e => {
        e.emptyIpt()
      })
    }
    next()
  },
  // 离开该页面去首页清空
  beforeRouteLeave (to, from, next) {
    if (to.path == '/common/index') {
      this.emptyIpt()
    }
    next()
  },
  computed: {
    ...mapState("user", ["userToken", "userInfo", "isLogin"]), //用户Token,用户登陆信息
    ...mapState("city", ["geoPosition", "thisCityInfo", "switchCityInfo", "cityInfoRows"]), //城市的信息
    ...mapState("home", ["searchPostGetData"]), //
  },
  created () {
    this.innerHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  },
  activated () {
    //接收URL传的参数
    this.initSearch();
    if (this.searchValue && !this.loading) {
      this.inputSearch();
    }
  },
  mounted () {
    // if (this.searchValue && !this.loading) {
    //   this.inputSearch();
    // }
    // 延时避免获取不到dom节点
    setTimeout(() => {
      const headerDom = document.querySelector(".header-box");
      const footerDom = document.querySelector(".footer");
      this.contentHeight = this.innerHeight - (headerDom.offsetHeight + footerDom.offsetHeight);
      this.$refs.searchRef.focus();//解决 81.这里的搜索也是要点击两次才能唤起搜索
    }, 100);
  },
  methods: {
    ...mapMutations('city', ['setSwitchCityInfo']),
    initSearch () {
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }, 200);
      if (!this.$commonUtils.utilCore.empty(this.$route.query.houseType)) {
        this.houseType = this.$route.query.houseType;
        if (this.houseType == "sale" || this.houseType == "house" || this.houseType == "index") {
          this.typeIndex = 0
        } else {
          this.typeIndex = 1
          this.houseType = "rent"
        }
      }
      //获取搜索历史关键词数据
      let tmpDataHistoryList = this.$commonCaches.getKeyCache('selectHouseKeyWorkCache');
      if (!this.$commonUtils.utilCore.empty(tmpDataHistoryList)) {
        this.dataHistoryList = JSON.parse(tmpDataHistoryList);
      }
      //获取当前的搜索关键词
      if (!this.$commonUtils.utilCore.empty(this.searchPostGetData) && !this.$commonUtils.utilCore.empty(this.searchPostGetData.searchKeyWord)) {
        this.searchValue = this.searchPostGetData.searchKeyWord
      }
    },
    inputSearch () {
      this.handleEventDebounce(() => {
        this.searchKeyWorkList = [];
        this.page = 1;
        if (this.$commonUtils.utilCore.empty(this.searchValue)) {
          return;
        }
        // 解决 数据错乱
        this.$nextTick(() => {
          this._getList();
        });
      })
    },
    // 防抖
    handleEventDebounce (fn) {
      this.clearTimeout();
      this.timer = setTimeout(() => {
        !!fn && fn();
      }, 800);
    },
    // 清除定时器
    clearTimeout () {
      if (this.timer) clearTimeout(this.timer);
    },
    async _getList () {
      if (this.typeIndex == 0) {
        let postData = {
          city_id: this.switchCityInfo.city_id || 8,
          keyword: this.searchValue,//	否	string	搜索内容
          page: this.page,
          page_size: this.limit,
        }
        this.loading = true;
        this.finished = false;
        let data_rows = await this.$store.dispatch('home/getAppFangToolsAsearch', postData);
        if (data_rows && data_rows.rows && data_rows.rows.length > 0) {
          for (let i = 0; i < data_rows.rows.length; i++) {
            let row = data_rows.rows[i];
            row.html = row.title.replace(
              this.searchValue,
              "<span style='color: #007AFF;'>" + this.searchValue + "</span>"
            );
            row.district_replace_name = row.district_name.replace('区', '')
            this.searchKeyWorkList.push(row);
          }
          if (data_rows.rows.length < this.limit) {
            this.finished = true;
          }
        }
        else {
          // 猜你喜欢的房源数据
          // this.getGuessList()
          // 猜你想切换的城市
          this.getGuessCity()
          this.finished = true;
        }
        this.loading = false;
        this.page++;
      } else {
        let postData = {
          city_id: this.switchCityInfo.city_id || 8,
          keyword: this.searchValue,//	否	string	搜索内容
          type: this.houseType,//	是	string	类型 sale 二手房，rent 租房，house新房
          page: this.page,
          page_size: this.limit,
        }
        this.loading = true;
        this.finished = false;
        let data_rows = await this.$store.dispatch('home/getAppFangToolsUptownSearch', postData);
        if (data_rows && data_rows.rows && data_rows.rows.length > 0) {
          this.$commonUtils.appLog.log("===============>>>>>", data_rows)
          for (let i = 0; i < data_rows.rows.length; i++) {
            let row = data_rows.rows[i];
            row.html = row.uptown_name.replace(
              this.searchValue,
              "<span style='color: #007AFF;'>" + this.searchValue + "</span>"
            );
            row.district_replace_name = row.district_name.replace('区', '')
            this.searchKeyWorkList.push(row);
          }
          if (data_rows.rows.length < this.limit) {
            this.finished = true;
          }
        }
        else {
          // 猜你喜欢的房源数据
          // this.getGuessList()
          // 猜你想切换的城市
          this.getGuessCity()
          this.finished = true;
        }
        this.loading = false;
        this.page++;
      }
    },
    selectSearch (val) {
      if (this.typeIndex == 0) {
        this.searchValue = val.title;
        this.searchUptownId = val.id
        if (val.type == 3) {
          this.houseType = 'house'// 新房
        } else if (val.type == 4) {
          this.houseType = 'sale' // 二手房
        }
      } else {
        this.searchUptownId = val.uptown_id
        this.searchValue = val.uptown_name;
      }
      this.actSearch();
    },
    selectHistorySearch (val) {
      this.searchValue = val
      this.actSearch(1);
    },
    //执行搜索
    async actSearch (type = 0) {
      this.searchValue = this.searchValue ? this.searchValue.replace(/(^\s*)|(\s*$)/g, "") : ""
      if (!this.$commonUtils.utilCore.empty(this.searchValue)) {
        this.saveSelectSearch(this.searchValue)
      } else {
        return
      }

      let info = {}
      if (this.$commonUtils.utilCore.empty(this.searchPostGetData)) {
        // info = 
      } else {
        info = this.$commonUtils.utilCore.deepClone(this.searchPostGetData)
      }

      if (type == 2) {
        // type为2是直接搜索关键词不带小区id
        info.searchKeyWord = this.searchValue;
        info.searchUptownId = ""
      } else {
        info.searchUptownId = this.searchUptownId
        info.searchKeyWord = this.searchValue
      }
      info.inputKeyWord = this.searchValue; // 该字段跳转列表顶部搜索框关键字展示用，不入参
      info.houseType = this.houseType;
      info.page = 0 //初始化页数
      info.page_size = 10 //初始化每页条数据
      info.loading = false;
      info.finished = false;
      info.typeIndex = this.typeIndex
      //把数据存在vuex里去
      this.$store.commit('home/setSearchPostGetData', info);
      //sale 二手房，house 新房，rent 租房
      // if (info.typeIndex == 0) {
      if (type == 1) {
        this.inputSearch()
      } else {
        // if (info.houseType == 'sale') {
        //   //进行跳转(注意是替换或跳转，不能再返回本页了！！！)
        //   this.$route.query.houseType = 'sale'
        //   return this.toolsGoPageView({ path: '/home/list/secondhouseList', query: { pageType: "fromSale" }, replace: true })

        // } else if (info.houseType == 'house') {
        //   //进行跳转(注意是替换或跳转，不能再返回本页了！！！)
        //   return this.toolsGoPageView({ path: '/home/list/newhouseList', query: { pageType: "fromSale" }, replace: true })
        // } else if (info.typeIndex == 1) {
        //   return this.toolsGoPageView({ path: '/home/list/renthouseList', query: { pageType: "fromRent" }, replace: true })
        // }

        // 跳转合并的列表
        return this.toolsGoPageView({ path: '/home/list/mergelist' })
        // }
        // } else {
        //进行跳转(注意是替换或跳转，不能再返回本页了！！！)
        // return this.toolsGoPageView({ path: '/home/list/renthouseList', query: { pageType: "fromRent" }, replace: true })
      }
    },
    saveSelectSearch (val) {
      //获取搜索历史关键词数据
      let tmpDataHistoryList = this.$commonCaches.getKeyCache('selectHouseKeyWorkCache');
      if (!this.$commonUtils.utilCore.empty(tmpDataHistoryList)) {
        tmpDataHistoryList = JSON.parse(tmpDataHistoryList);
      } else {
        tmpDataHistoryList = []
      }
      let isHave = false;
      tmpDataHistoryList.forEach((item) => {
        if (item == val) {
          isHave = true;
          return;
        }
      })
      //如果不存在则添加
      if (!isHave) {
        tmpDataHistoryList.push(val)
        //确保最多只存10条
        if (tmpDataHistoryList.length > 10) {
          tmpDataHistoryList.splice(0, 1)
        }
        this.dataHistoryList = tmpDataHistoryList;
        this.$commonCaches.setKeyCache('selectHouseKeyWorkCache', JSON.stringify(tmpDataHistoryList));
        this.searchValue = val
      }
    },
    //清理历史关键词
    clearKeyWord () {
      this.dataHistoryList.splice(0, this.dataHistoryList.length);
      this.$commonCaches.setKeyCache('selectHouseKeyWorkCache', []);
    },
    onClickBack () {
      // this.$router.go(-1);
      // this.toolsGoPageBack();
      this.toolsGoPageView({ path: '/common/index' });
    },
    //切换房源的类型
    handleTab (item) {
      if (item.id == this.typeIndex) {
        return;
      }
      this.searchKeyWorkList = [];
      this.loading = true;
      this.typeIndex = item.id
      this.houseType = item.val
      this.inputSearch()
      //切换房源类型的时候要清一下搜索条件
      //把数据存在vuex里去
      this.$store.commit('home/setSearchPostGetData', {});
    },
    // 猜你喜欢的房源
    async getGuessList () {
      this.guessList = []
      const postData = {
        key: this.searchValue || "",//	否	string	关键字
        type: this.typeIndex == 0 ? '1' : '2',//	否	string	类型 1二手房 2租房
      }
      const res = await this.$store.dispatch('home/getAppFangcUptownaSearchAll', postData);
      if (res) {
        res.forEach(item => {
          item.html = item.uptown_name.replace(this.searchValue, "<span style='color: #007AFF;'>" + this.searchValue + "</span>")
          this.guessList.push(item)
        })
      }
    },
    // 猜你想切换的城市
    async getGuessCity () {
      this.guessCity = {}
      const postData = {
        key: this.searchValue || "",//	否	string	关键字
      }
      const res = await this.$store.dispatch('home/getAppFangcUptownaSearchOther', postData);
      if (res) {
        this.guessCity = res
      }
    },
    // 切换城市按钮
    changeCity (info) {
      this.$commonUtils.utilCore.showLoading('切换城市中...');
      const switchData = {
        city_id: info.site_id,
        city_name: info.site_name,
        is_69: info.is_69,
        city_info: info
      }
      this.setSwitchCityInfo(switchData)
      setTimeout(() => {
        this.$commonUtils.utilCore.closeLoading()
        this.searchUptownId = info.uptown_id
        this.searchValue = info.uptown_name
        this.actSearch()
      }, 1000);
    },
    // 清空input
    emptyIpt () {
      this.guessCity = {}
      this.searchValue = ''
      let info = this.$commonUtils.utilCore.deepClone(this.searchPostGetData)
      info.searchKeyWord = this.searchValue;
      info.houseType = this.houseType;
      info.page = 0 //初始化页数
      info.page_size = 10 //初始化每页条数据
      info.loading = false;
      info.finished = false;
      //把数据存在vuex里去
      this.$store.commit('home/setSearchPostGetData', info);
    },
  }
}
</script>

<style lang="scss" scoped>
.search {
  height: 100vh;
  // overflow: hidden;
  .header {
    display: flex;
    align-items: center;
    padding: 0.1rem 0 0.32rem 0.36rem;
    .icon-return {
      width: 0.45rem;
      height: 0.4rem;
      padding-right: 1.74rem;
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    .header-nav {
      display: flex;
      align-items: center;
      .header-item {
        padding-right: 1.4rem;
        position: relative;
        .text {
          font-size: 0.3rem;
          font-weight: bold;
          color: #000000;
        }
        img {
          width: 0.35rem;
          height: 0.1em;
          display: block;
          position: absolute;
          bottom: -0.15rem;
          left: 0.1rem;
        }
      }
    }
  }
  .search-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.14rem 0.5rem 0 0.38rem;
    .search {
      width: 5.52rem;
      height: 0.9rem;
      box-shadow: 0rem 0rem 0.14rem 0rem rgba(216, 216, 216, 0.5);
      background: #ffffff;
      position: relative;
      .formstyle {
        width: 100%;
        height: 100%;
      }
      input {
        width: 100%;
        height: 100%;
        font-size: 0.28rem;
        font-weight: 500;
        color: #0a3cc7;
        border-radius: 0.1rem;
        border: 0.02rem solid #d6d6d6;
        display: block;
        padding-left: 0.66rem;
        box-sizing: border-box;
      }
      .icon-magnifier {
        width: 0.28rem;
        height: 0.28rem;
        position: absolute;
        top: 0.3rem;
        left: 0.28rem;
      }
    }
    .search-cancel {
      font-size: 0.3rem;
      font-weight: bold;
      color: #000000;
    }
  }
  /deep/ ._search-box {
    margin: 0.4rem 0.38rem 0.44rem !important;
    input {
      height: 0.68rem !important;
      box-shadow: 0rem 0.06rem 0.08rem 0rem rgba(223, 223, 223, 0.5);
    }
    .search-btn {
      height: 100%;
    }
    .btn-close {
      top: 0.08rem;
    }
  }
  .wrapper {
    overflow-x: hidden;
    overflow-y: auto;
    .search-key {
      padding: 0.3rem 0.4rem 0.2rem 0.4rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .key-left {
        font-size: 0.3rem;
        font-weight: bold;
        color: #000000;
        span {
          font-weight: 400;
          color: #0a3cc7;
        }
      }
      .key-right {
        img {
          width: 0.4rem;
          height: 0.4rem;
          display: block;
        }
      }
    }
    .search-history {
      padding-top: 0.3rem;
      .title {
        padding: 0 0.5rem 0.4rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          font-size: 0.3rem;
          font-weight: bold;
          color: #000000;
        }
        .clear-history {
          img {
            width: 0.32rem;
            height: 0.32rem;
            display: block;
          }
        }
      }
      .content {
        padding-left: 0.4rem;
        display: flex;
        flex-wrap: wrap;
        .history-item {
          font-size: 0.26rem;
          font-weight: 400;
          color: #000000;
          background: #f5f5f5;
          border-radius: 0.1rem;
          padding: 0.16rem 0.22rem 0.14rem 0.24rem;
          margin-right: 0.2rem;
          margin-bottom: 0.24rem;
        }
      }
    }
    .search-result {
      margin-left: 0.34rem;
      .result-item-rent {
        padding: 0.28rem 0 0.28rem 0.2rem;
        border-bottom: 0.02rem solid #f7f7f7;
        display: flex;
        align-items: center;
        .result-label {
          width: 0.72rem;
          height: 0.32rem;
          font-size: 0.2rem;
          font-weight: 400;
          color: #8d8d8d;
          text-align: center;
          line-height: 0.35rem;
          background: #f4f4f4;
          white-space: nowrap;
          margin-right: 0.2rem;
        }
        .result-content {
          font-size: 0.3rem;
          font-family: SourceHanSansCN-Normal, SourceHanSansCN;
          font-weight: 400;
          color: #000000;
        }
      }
      .result-item {
        padding: 0.4rem 0.5rem 0.38rem 0;
        border-bottom: 0.02rem solid #f7f7f7;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .item-left {
          display: flex;
          align-items: center;
          .result-label {
            width: 0.72rem;
            height: 0.32rem;
            font-size: 0.2rem;
            font-weight: 400;
            color: #8d8d8d;
            text-align: center;
            line-height: 0.35rem;
            background: #f4f4f4;
            white-space: nowrap;
            margin-right: 0.2rem;
          }
          .result-content {
            font-size: 0.24rem;
            font-weight: 400;
            color: #999999;
            white-space: nowrap;
            .content-top {
              width: 3.5rem;
              display: flex;
              align-items: flex-end;
              padding-bottom: 0.1rem;
              .content-top-name {
                font-size: 0.3rem;
                color: #000000;
                padding-right: 0.1rem;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              // .content-top-address {
              //   width: 2.2rem;
              //   overflow: hidden;
              //   text-overflow: ellipsis;
              // }
            }
          }
        }
        .item-right {
          font-size: 0.3rem;
          font-weight: 400;
          color: #000000;
          white-space: nowrap;
          &.item-right-newhouse {
            color: #ff3100 !important;
          }
        }
      }
      span {
        color: #0a3cc7;
      }
    }
    .nothing {
      font-size: 0.3rem;
      color: #737373;
      font-weight: 400;
      text-align: center;
      span {
        color: #0a3cc7;
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
  .active {
    color: #ffb90c !important;
  }
}
.search-hint-box {
  .keyword {
    text-align: center;
    font-size: 0.3rem;
    font-weight: 400;
    color: #737373;
    padding: 0.6rem 0;
    span {
      color: #0a3cc7;
    }
  }
  .guess-list {
    .guess-title {
      font-size: 0.3rem;
      font-weight: bold;
      color: #000000;
      padding-left: 0.1rem;
    }
    .guess-content {
      .result-item {
        padding: 0.4rem 0.5rem 0.38rem 0;
        border-bottom: 0.02rem solid #f7f7f7;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .item-left {
          display: flex;
          align-items: center;
          .result-label {
            width: 0.72rem;
            height: 0.32rem;
            font-size: 0.2rem;
            font-weight: 400;
            color: #8d8d8d;
            text-align: center;
            line-height: 0.35rem;
            background: #f4f4f4;
            white-space: nowrap;
            margin-right: 0.2rem;
          }
          .result-content {
            font-size: 0.24rem;
            font-weight: 400;
            color: #999999;
            white-space: nowrap;
            .content-top {
              width: 3.5rem;
              display: flex;
              align-items: flex-end;
              padding-bottom: 0.1rem;
              .content-top-name {
                font-size: 0.3rem;
                color: #000000;
                padding-right: 0.1rem;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              // .content-top-address {
              //   width: 2.2rem;
              //   overflow: hidden;
              //   text-overflow: ellipsis;
              // }
            }
          }
        }
        .item-right {
          font-size: 0.3rem;
          font-weight: 400;
          color: #000000;
          white-space: nowrap;
          &.item-right-newhouse {
            color: #ff3100 !important;
          }
        }
      }
    }
  }
  .change-city {
    width: 100%;
    background: #f7f7f7;
    padding: 0.18rem 0.56rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    .change-text {
      width: 5rem;
      font-size: 0.28rem;
      font-weight: 400;
      color: #000000;
    }
    .change-btn {
      width: 1.12rem;
      height: 0.44rem;
      background: #ffffff;
      border: 0.02rem solid #ffce09;
      font-size: 0.24rem;
      font-weight: 400;
      color: #000000;
      line-height: 0.44rem;
      text-align: center;
      border-radius: 0.05rem;
    }
  }
  .guess-item {
    margin: 0 0.16rem;
  }
}
</style>
<template>
  <div class="search">
    <div class="header-box" style="padding-bottom: 0.44rem;">
      <gni-nav-bar :isShowNav="false"></gni-nav-bar>
      <div class="header">
        <div class="icon-return" @click="onClickBack">
          <img :src="$appConfig.appWebStaticUrl + '/maphouse/icon_arrowLeft.png'" alt="">
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
          <form action="javascript:;" @submit="$refs.searchRef.blur();inputSearch();" class="formstyle">
            <input type="search" v-model="searchValue" placeholder="请输入小区/路段名称" confirm-type='search' @input="inputSearch" ref="searchRef">
          </form>
          <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_searchbig.png'" alt="" class="icon-magnifier">
        </div>
        <div class="search-cancel" @click="emptyIpt">取消</div>
      </div>
    </div>

    <div class="wrapper" :style="{height: contentHeight + 'px'}">
      <div class="search-key" v-show="searchValue">
        <div class="key-left">
          搜索“<span>{{searchValue}}</span>”
        </div>
        <!-- <div class="key-right">
          <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
        </div> -->
      </div>
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="searchKeyWorkList && searchKeyWorkList.length > 0 ? '没有更多了' : ''"
        :immediate-check="false"
        @load="_getList" v-show="searchValue">
        <div class="search-result">
          <div class="result-item" v-for="(item,index) in searchKeyWorkList" @click="actSearch(item)" :key="index">
            <div class="item-left">
              <div class="result-label">{{typeIndex==1?'小区':typeIndex==2?'新房':'租房'}}</div>
              <div class="result-content">
                <div class="content-top">
                  <div class="content-top-name" v-html="item.html"></div>
                  <!-- 2023/1/3 老麦说取消了 -->
                  <!-- <div class="content-top-address">({{}})</div> -->
                </div>
                <div class="content-bottom">{{item.district_replace_name}} {{item.block_name}}</div>
              </div>
            </div>
            <div class="item-right" :style="typeIndex==2?'color:#ff3100 !important':''">{{typeIndex==1?item.sale_num+'套在售':typeIndex==2?item.average_price_name: item.rent_num+'套在租'}}</div>
          </div>
        </div>
      </van-list>
      <div class="search-history" v-show="!searchValue">
        <div class="title">
          <span>搜索历史</span>
          <div class="title-empty" @click="clearKeyWord()">
            <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_searchempty.png'" alt="">
          </div>
        </div>
        <div class="content" v-if="dataHistoryList.length">
          <div class="history-item" v-for="(item,index) in dataHistoryList" @click="selectHistorySearch(item)" :key="index">{{item.searchValue}}</div>
        </div>
        <div class="unhistory" v-else>搜索小区、楼盘等名称，查找心仪房源</div>
      </div>
      <div class="search-hint-box mx-3" v-show="!searchKeyWorkList.length && searchValue && !loading">
        没有找到“<span class="keyword">{{ searchValue }}</span>”相关结果
      </div>
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
      searchValue: '', //搜索的数据
      searchKeyWorkList: [],//模糊搜索提示数据
      showPlaceholder: "请输入小区/路段名称",//搜索框提示内容
      dataHistoryList: [],//搜索历史
      page: 1,
      limit: 10,
      loading: false,
      finished: false,
      contentHeight: 0,
      innerHeight: 0,
      searchUptownId: '',// 2023/143改为通过小区id查询
      // 2023.1.13 新增区分成交租售
      options: [
        {
          id: 1,
          text: '二手房',
          val: 'dealSale'
        },
        {
          id: 2,
          text: '新房',
          val: 'dealRent'
        },
        {
          id: 3,
          text: '租房',
          val: 'dealRent'
        },
      ],
      typeIndex: 1,
    }
  },
  //返回首页清空value
  // beforeRouteEnter (to, from, next) {
  //   if (from.path == '/common/index') {
  //     next(e => {
  //       e.emptyIpt()
  //     })
  //   }
  //   next()
  // },
  computed: {
    ...mapState("user", ["userToken", "userInfo", "isLogin"]), //用户Token,用户登陆信息
    ...mapState("city", ["geoPosition", "thisCityInfo", "switchCityInfo", "cityInfoRows"]), //城市的信息
    ...mapState("map", ["searchMapHouseData"]), //
  },
  activated () {
    this.initSearch();

  },
  created () {
    this.innerHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  },
  mounted () {
    //接收URL传的参数
    // this.initSearch();
    // if (this.searchValue && !this.loading) {
    //   this.inputSearch();
    // }
    // 延时避免获取不到dom节点
    setTimeout(() => {
      const headerDom = document.querySelector(".header-box");
      this.contentHeight = this.innerHeight - (headerDom.offsetHeight);
      this.$refs.searchRef.focus();//解决 81.这里的搜索也是要点击两次才能唤起搜索
    }, 100);
  },
  methods: {
    initSearch () {
      if (!this.$commonUtils.utilCore.empty(this.$route.query.typeIndex)) {
        this.typeIndex = this.$route.query.typeIndex == '0' ? '1' : this.$route.query.typeIndex == '1' ? '2' : '3'
      }
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }, 200);
      //获取搜索历史关键词数据
      let tmpDataHistoryList = this.$commonCaches.getKeyCache('selectMapSearchKeyWorkCache');

      if (!this.$commonUtils.utilCore.empty(tmpDataHistoryList)) {
        this.dataHistoryList = JSON.parse(tmpDataHistoryList);
      }
      //获取当前的搜索关键词
      if (!this.$commonUtils.utilCore.empty(this.searchMapHouseData)) {
        this.searchValue = this.searchMapHouseData.searchKeyWord
        if (this.searchValue && !this.loading) {
          this.inputSearch();
        }
      } else {
        this.searchValue = ''
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
      }, 500);
    },
    // 清除定时器
    clearTimeout () {
      if (this.timer) clearTimeout(this.timer);
    },
    async _getList () {
      let postData = {
        city_id: this.switchCityInfo.city_id || 8,
        keyword: this.searchValue,//	否	string	搜索内容
        type: this.typeIndex == 1 ? 'sale' : this.typeIndex == 2 ? 'house' : 'rent',//	是	string	类型 sale 二手房，rent 租房，house新房
        page: this.page,
        page_size: this.limit,
      }
      this.loading = true;
      this.finished = false;
      let data_rows = await this.$store.dispatch('home/getAppFangToolsUptownSearch', postData);
      if (data_rows && data_rows.rows) {
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
      } else {
        this.finished = true;
      }
      this.loading = false;
      this.page++;
    },
    selectHistorySearch (val) {
      this.searchValue = val.searchValue
      this.inputSearch()
    },
    //执行搜索
    async actSearch (item) {
      this.searchValue = this.searchValue ? this.searchValue.replace(/(^\s*)|(\s*$)/g, "") : ""
      let arr = [
        {
          searchValue: this.searchValue,
          // searchUptownId: item.uptown_id,
        }
      ]
      if (!this.$commonUtils.utilCore.empty(this.searchValue)) {
        this.saveSelectSearch(arr)
      }
      item.typeIndex = this.typeIndex
      item.searchKeyWord = this.searchValue
      //把数据存在vuex里去
      this.$store.commit('map/setSearchMapHouseData', item);
      return this.toolsGoPageView({ path: '/maphouse/index' })
    },
    saveSelectSearch (val) {
      //获取搜索历史关键词数据
      let tmpDataHistoryList = this.$commonCaches.getKeyCache('selectMapSearchKeyWorkCache');
      if (!this.$commonUtils.utilCore.empty(tmpDataHistoryList)) {
        tmpDataHistoryList = JSON.parse(tmpDataHistoryList);
      } else {
        tmpDataHistoryList = []
      }
      let isHave = false;
      tmpDataHistoryList.forEach((item) => {
        if (item.searchValue == val[0].searchValue) {
          isHave = true;
          return;
        }
      })
      //如果不存在则添加
      if (!isHave) {
        tmpDataHistoryList.push(...val)
        //确保最多只存10条
        if (tmpDataHistoryList.length > 10) {
          tmpDataHistoryList.splice(0, 1)
        }
        this.dataHistoryList = tmpDataHistoryList;
        this.$commonCaches.setKeyCache('selectMapSearchKeyWorkCache', JSON.stringify(tmpDataHistoryList));
        this.searchValue = val[0].searchValue
      }
    },
    //清理历史关键词
    clearKeyWord () {
      this.dataHistoryList.splice(0, this.dataHistoryList.length);
      this.$commonCaches.setKeyCache('selectMapSearchKeyWorkCache', []);
    },
    onClickBack () {
      this.$router.go(-1);
      // this.toolsGoPageBack();
    },
    // 清空input
    emptyIpt () {
      this.searchValue = ''
      // let info = this.$commonUtils.utilCore.deepClone(this.searchMapHouseData)
      // info.searchKeyWord = this.searchValue;
      // info.searchUptownId = "";
      // info.page = 0 //初始化页数
      // info.page_size = 10 //初始化每页条数据
      // info.loading = false;
      // info.finished = false;
      //把数据存在vuex里去
      this.$store.commit('map/setSearchMapHouseData', {});
    },
    //切换房源的类型
    handleTab (item) {
      if (item.id == this.typeIndex) {
        return;
      }
      this.searchKeyWorkList = [];
      this.loading = true;
      this.typeIndex = item.id
      // this.houseType = item.val
      this.inputSearch()
      // //切换房源类型的时候要清一下搜索条件
      // //把数据存在vuex里去
      this.$store.commit('map/setSearchMapHouseData', {});
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
      width: 0.3rem;
      height: 0.3rem;
      padding-right: 1.32rem;
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
        position: relative;
        margin-right: 0.52rem;
        .text {
          font-size: 0.3rem;
          font-weight: 400;
          color: #000000;
        }
        img {
          width: 0.52rem;
          height: 0.15em;
          display: block;
          position: absolute;
          bottom: -0.07rem;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }
  .search-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.14rem 0.36rem 0;
    .search {
      width: 5.4rem;
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
        box-sizing: border-box;
        font-weight: 500;
        color: #0a3cc7;
        border-radius: 0.1rem;
        border: 0.01rem solid #cecece;
        display: block;
        padding-left: 0.66rem;
        appearance: none;
        background: #ffffff;
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
      // .key-right {
      //   img {
      //     width: 0.4rem;
      //     height: 0.4rem;
      //     display: block;
      //   }
      // }
    }
    .search-history {
      padding: 0.3rem 0.36rem 0;
      .title {
        padding-bottom: 0.4rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          font-size: 0.3rem;
          font-weight: bold;
          color: #000000;
        }
        .title-empty {
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
      .unhistory {
        font-size: 0.26rem;
        font-weight: 400;
        color: #737373;
      }
    }
    .search-result {
      margin: 0 0.44rem;
      .result-item {
        padding: 0.42rem 0.3rem 0.4rem 0;
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
  .active {
    font-size: 0.36rem !important;
    font-weight: bold !important;
    color: #000000 !important;
  }
}
.search-hint-box {
  margin-top: 0.76rem;
  text-align: center;
  font-size: 0.3rem;
  font-weight: 400;
  color: #737373;
  .keyword {
    color: #0a3cc7;
  }
}
</style>
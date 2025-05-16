<template>
  <div class="search">
    <div class="header-box" style="padding-bottom: 0.44rem;">
      <gni-nav-bar :isShowNav="false"></gni-nav-bar>
      <div class="header">
        <div class="icon-return" @click="onClickBack">
          <img :src="$appConfig.appWebStaticUrl + '/home/icon_reutrn.png'" alt="">
        </div>
        <!-- <div class="header-nav">查成交</div> -->
        <div class="header-nav">
          <div class="header-item" v-for="(item,index) in options" :key="index" @click="handleTab(item)">
            <div class="text" :class="typeIndex == item.id?'active':''">{{item.text}}</div>
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_line.png'" alt="" v-show="typeIndex == item.id">
          </div>
        </div>
      </div>
      <div class="search-container">
        <div class="search">
          <form action="javascript:;" @submit="$refs.searchRef.blur();actSearch('submit');" class="formstyle">
            <input type="search" v-model="searchValue" placeholder="请输入小区名" confirm-type='search' @input="inputSearch" ref="searchRef">
          </form>
          <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_searchbig.png'" alt="" class="icon-magnifier">
        </div>
        <div class="search-cancel" @click="emptyIpt">取消</div>
      </div>
    </div>

    <div class="wrapper" :style="{height: contentHeight + 'px'}">
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="searchKeyWorkList && searchKeyWorkList.length > 0 ? '没有更多了' : ''"
        :immediate-check="false"
        @load="_getList" v-show="searchValue">
        <div class="search-result">
          <div class="result-item" v-for="(item,index) in searchKeyWorkList" @click="selectSearch(item)" :key="index">
            <div class="item-left">
              <!-- <div class="result-label">小区</div> -->
              <div class="result-content">
                <div class="content-top">
                  <div class="content-top-name" v-html="item.html"></div>
                  <!-- 2023/1/3 老麦说取消了 -->
                  <!-- <div class="content-top-address">({{}})</div> -->
                </div>
                <div class="content-bottom">{{item.district_replace_name}} {{item.block_name}}</div>
              </div>
            </div>
            <div class="item-right">{{item.deal_num}}套成交</div>
          </div>
        </div>
      </van-list>
      <div class="search-history" v-show="!searchValue">
        <div class="title" @click="clearKeyWord()">
          <span>搜索历史</span>
          <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_searchempty.png'" alt="">
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
          text: '成交售',
          val: 'dealSale'
        },
        {
          id: 2,
          text: '成交租',
          val: 'dealRent'
        }
      ],
      typeIndex: 1,
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
  computed: {
    ...mapState("user", ["userToken", "userInfo", "isLogin"]), //用户Token,用户登陆信息
    ...mapState("city", ["geoPosition", "thisCityInfo", "switchCityInfo", "cityInfoRows"]), //城市的信息
    ...mapState("home", ["searchPostGetData"]), //
  },
  activated () {
    this.initSearch();
    if (this.searchValue && !this.loading) {
      this.inputSearch();
    }
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
      const footerDom = document.querySelector(".footer");
      this.contentHeight = this.innerHeight - (headerDom.offsetHeight + footerDom.offsetHeight);
      this.$refs.searchRef.focus();//解决 81.这里的搜索也是要点击两次才能唤起搜索
    }, 100);
  },
  methods: {
    initSearch () {
      if (!this.$commonUtils.utilCore.empty(this.$route.query.typeIndex)) {
        this.typeIndex = this.$route.query.typeIndex
      }
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }, 200);
      //获取搜索历史关键词数据
      let tmpDataHistoryList = this.$commonCaches.getKeyCache('selectDealKeyWorkCache');
      if (!this.$commonUtils.utilCore.empty(tmpDataHistoryList)) {
        this.dataHistoryList = JSON.parse(tmpDataHistoryList);
      }
      //获取当前的搜索关键词
      if (!this.$commonUtils.utilCore.empty(this.searchPostGetData) && !this.$commonUtils.utilCore.empty(this.searchPostGetData.searchKeyWord)) {
        this.searchValue = this.searchPostGetData.searchKeyWord
      } else {
        this.searchValue = this.searchPostGetData.inputKeyWord
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
        type: this.typeIndex,//		否	string	租售类型 1售2租 默认售
        keyword: this.searchValue,//		否	string	搜索关键字
        page: this.page,//	否	string	页码 默认1
        page_size: this.limit,//	否	string	每页数 默认10
      }
      this.loading = true;
      this.finished = false;
      let data_rows = await this.$store.dispatch('home/getAppFangcDealaUptownSearch', postData);
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
    selectSearch (val) {
      this.searchValue = val.uptown_name
      this.searchUptownId = val.uptown_id
      this.actSearch();
    },
    selectHistorySearch (val) {
      this.searchValue = val.searchValue
      this.searchUptownId = val.searchUptownId
      this.actSearch();
    },
    //执行搜索
    async actSearch (type) {
      this.searchValue = this.searchValue ? this.searchValue.replace(/(^\s*)|(\s*$)/g, "") : ""
      let arr = [
        {
          searchValue: this.searchValue,
          searchUptownId: this.searchUptownId,
        }
      ]
      if (!this.$commonUtils.utilCore.empty(this.searchValue)) {
        this.saveSelectSearch(arr)
      }
      let info = {}
      if (this.$commonUtils.utilCore.empty(this.searchPostGetData)) {
      } else {
        info = this.$commonUtils.utilCore.deepClone(this.searchPostGetData)
      }
      if (type != 'submit') {
        info.searchUptownId = this.searchUptownId;
        info.searchKeyWord = ""
      } else {
        // 直接输入框右下角搜索按钮跳转的
        info.searchUptownId = "";
        info.searchKeyWord = this.searchValue;
      }
      // if (!this.$commonUtils.utilCore.empty(this.searchUptownId)) {
      //   info.searchUptownId = this.searchUptownId;
      //   info.searchKeyWord = ""
      // } else {
      //   // 直接输入框右下角搜索按钮跳转的
      //   info.searchUptownId = "";
      //   info.searchKeyWord = this.searchValue;
      // }
      info.inputKeyWord = this.searchValue;
      info.leaseSaleIndex = this.typeIndex;  // 租售类型
      info.page = 0; //初始化页数
      info.page_size = 10; //初始化每页条数据
      info.loading = false;
      info.finished = false;
      //把数据存在vuex里去
      this.$store.commit('home/setSearchPostGetData', info);
      return this.toolsGoPageView({ path: '/home/list/dealist', replace: true })
    },
    saveSelectSearch (val) {
      //获取搜索历史关键词数据
      let tmpDataHistoryList = this.$commonCaches.getKeyCache('selectDealKeyWorkCache');
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
        this.$commonCaches.setKeyCache('selectDealKeyWorkCache', JSON.stringify(tmpDataHistoryList));
        this.searchValue = val[0].searchValue
      }
    },
    //清理历史关键词
    clearKeyWord () {
      this.dataHistoryList.splice(0, this.dataHistoryList.length);
      this.$commonCaches.setKeyCache('selectDealKeyWorkCache', []);
    },
    onClickBack () {
      this.$router.go(-1);
      // this.toolsGoPageBack();
    },
    // 清空input
    emptyIpt () {
      this.searchValue = ''
      let info = this.$commonUtils.utilCore.deepClone(this.searchPostGetData)
      info.searchKeyWord = this.searchValue;
      info.inputKeyWord = this.searchValue;
      info.searchUptownId = "";
      info.page = 0 //初始化页数
      info.page_size = 10 //初始化每页条数据
      info.loading = false;
      info.finished = false;
      //把数据存在vuex里去
      this.$store.commit('home/setSearchPostGetData', info);
    },
    //切换房源的类型
    handleTab (item) {
      if (item.id == this.typeIndex) {
        return;
      }
      this.typeIndex = item.id
      // this.houseType = item.val
      this.inputSearch()
      // //切换房源类型的时候要清一下搜索条件
      // //把数据存在vuex里去
      this.$store.commit('home/setSearchPostGetData', {});
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
      padding-right: 1.58rem;
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    // .header-nav {
    //   font-size: 0.3rem;
    //   font-weight: bold;
    //   color: #ffb90c;
    // }
    .header-nav {
      display: flex;
      align-items: center;
      .header-item {
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
          left: 50%;
          transform: translateX(-50%);
        }
        &:nth-child(1) {
          margin-right: 1rem;
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
        img {
          width: 0.32rem;
          height: 0.32rem;
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
        padding: 0.42rem 0.5rem 0.4rem 0;
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
    font-size: 0.34rem !important;
    color: #ffb90c !important;
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
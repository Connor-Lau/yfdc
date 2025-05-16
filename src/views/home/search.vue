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
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_line.png'" alt="" :style="typeIndex==0?'left:0.2rem':typeIndex==1 || typeIndex==2?'left:0.1rem':''" v-show="typeIndex == item.id">
          </div>
        </div>
      </div>
      <search-new
        v-model="searchValue"
        :placeholder="showPlaceholder"
        @change="inputSearch"
        @click="actSearch"
        @clear="emptyIpt"
        ref="searchRef"
        :waitTime="500"
        searchBoxStyle="margin: 0.4rem 0.38rem 0 0.44rem !important;"></search-new>
    </div>

    <div class="wrapper" :style="{height: contentHeight + 'px'}">
      <!-- <div class="ipt-container"> -->

      <!-- </div> -->
      <!-- <input v-model="searchValue" type="text" placeholder="请输入小区/路段名称">
        <div class="empty" @click="emptyIpt()" v-if="searchValue">
          <img :src="$appConfig.appWebStaticUrl + '/home/icon_close.png'" alt="">
        </div>
        <div class="search-btn">搜索</div> -->
      <!-- </div> -->
      <van-list
        v-model="loading"
        :finished="finished"
        :finished-text="searchKeyWorkList && searchKeyWorkList.length > 0 ? '没有更多了' : ''"
        :immediate-check="false"
        @load="_getList" v-show="searchValue">
        <div class="search-result">
          <div class="result-item" v-for="(item,index) in searchKeyWorkList" @click="selectSearch(item.uptown_name)" :key="index" v-html="item.html">{{item.html}}</div>
          <!-- <div class="result-item"><span v-if="searchValue">{{searchValue}}</span>路112号珠江国际大厦19楼</div> -->
          <!-- <div class="result-item"><span v-if="searchValue">{{searchValue}}</span>路112号珠江国际大厦19楼</div> -->
        </div>
      </van-list>
      <div class="search-history" v-show="!searchValue">
        <div class="title" @click="clearKeyWord()">
          <span>搜索历史</span>
          <img :src="$appConfig.appWebStaticUrl + '/home/icon_empty.png'" alt="">
        </div>
        <div class="content">
          <div class="history-item" v-for="(item,index) in dataHistoryList" @click="selectSearch(item)" :key="index">{{item}}</div>
          <!-- <div class="history-item">越华路118号之左大院</div> -->
        </div>
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
import searchNew from "@/components/gni/gni-search.vue";


import { mapState, mapActions, mapMutations } from "vuex";

export default {
  components: {
    gniNavBar, searchNew,
  },
  data () {
    return {
      options: [
        {
          id: 0,
          text: '二手房',
          val: 'sale'
        },
        {
          id: 1,
          text: '租房',
          val: 'rent'
        },
        {
          id: 2,
          text: '新房',
          val: 'house'
        }
      ],
      typeIndex: 0,
      searchValue: '', //搜索的数据
      houseType: 'sale',//房源类型（sale 二手房，house 新房，rent 租房）
      oldHouseType: 'sale',//记录进入页面前的房源类型
      searchKeyWorkList: [],//模糊搜索提示数据
      showPlaceholder: "请输入小区/路段名称",//搜索框提示内容
      dataHistoryList: [],//搜索历史
      page: 1,
      limit: 10,
      loading: false,
      finished: false,
      contentHeight: 0,
      innerHeight: 0,
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
  created () {
    this.innerHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  },
  mounted () {
    //接收URL传的参数
    this.initSearch();
    if (this.searchValue && !this.loading) {
      this.inputSearch();
    }
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
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }, 200);
      if (!this.$commonUtils.utilCore.empty(this.$route.query.houseType)) {
        this.houseType = this.$route.query.houseType;
        this.oldHouseType = this.$route.query.houseType;
        if (this.houseType == "sale") {
          this.typeIndex = 0
          this.houseType = "sale"
        } else if (this.houseType == "rent") {
          this.typeIndex = 1
          this.houseType = "rent"
        } else if (this.houseType == "house") {
          this.typeIndex = 2
          this.houseType = "house"
        } else {
          this.typeIndex = 0
          this.houseType = "sale"
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
      this.searchKeyWorkList = [];
      this.page = 1;
      if (this.$commonUtils.utilCore.empty(this.searchValue)) {
        return;
      }
      // 解决 数据错乱
      this.$nextTick(() => {
        this._getList();
      });
    },
    async _getList () {
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
      if (data_rows && data_rows.rows) {
        this.$commonUtils.appLog.log("===============>>>>>", data_rows)
        for (let i = 0; i < data_rows.rows.length; i++) {
          let row = data_rows.rows[i];
          row.html = row.uptown_name.replace(
            this.searchValue,
            "<span style='color: #007AFF;'>" + this.searchValue + "</span>"
          );
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
      this.searchValue = val;
      this.actSearch();
    },
    //执行搜索
    async actSearch () {

      //关键字为空应该也可以搜索的
      // if (this.$commonUtils.utilCore.empty(this.searchValue.replace(" ", ""))) {
      //   this.$commonUtils.utilCore.showToast(this.showPlaceholder)
      //   return;
      // }

      this.searchValue = this.searchValue ? this.searchValue.replace(/(^\s*)|(\s*$)/g, "") : ""
      if (!this.$commonUtils.utilCore.empty(this.searchValue)) {
        this.saveSelectSearch(this.searchValue)
      }

      let info = {}
      if (this.$commonUtils.utilCore.empty(this.searchPostGetData)) {
        // info = 
      } else {
        info = this.$commonUtils.utilCore.deepClone(this.searchPostGetData)
      }


      info.searchKeyWord = this.searchValue;
      info.houseType = this.houseType;
      info.page = 0 //初始化页数
      info.page_size = 10 //初始化每页条数据
      info.loading = false;
      info.finished = false;
      //把数据存在vuex里去
      this.$store.commit('home/setSearchPostGetData', info);
      //sale 二手房，house 新房，rent 租房
      if (info.houseType == 'sale') {
        //进行跳转(注意是替换或跳转，不能再返回本页了！！！)
        return this.toolsGoPageView({ path: '/home/list/secondhouseList', query: { pageType: "search" }, replace: true })

      } else if (info.houseType == 'house') {
        //进行跳转(注意是替换或跳转，不能再返回本页了！！！)
        return this.toolsGoPageView({ path: '/home/list/newhouseList', query: { pageType: "search" }, replace: true })

      } else if (info.houseType == 'rent') {
        //进行跳转(注意是替换或跳转，不能再返回本页了！！！)
        return this.toolsGoPageView({ path: '/home/list/renthouseList', query: { pageType: "search" }, replace: true })
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
      this.$router.go(-1);
      // this.toolsGoPageBack();
    },
    //切换房源的类型
    handleTab (item) {
      if (item.id == this.typeIndex) {
        return;
      }
      this.typeIndex = item.id
      this.houseType = item.val
      //切换房源类型的时候要清一下搜索条件
      //把数据存在vuex里去
      this.$store.commit('home/setSearchPostGetData', {});
    },
    // 清空input
    emptyIpt () {
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
    border-bottom: 0.01rem solid #f1f1f1;
    .icon-return {
      width: 0.45rem;
      height: 0.4rem;
      padding-right: 1.06rem;
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
        padding-right: 0.76rem;
        position: relative;
        .text {
          font-size: 0.3rem;
          font-weight: 400;
          color: #737373;
        }
        img {
          width: 0.52rem;
          height: 0.16rem;
          display: block;
          position: absolute;
          bottom: -0.13rem;
          left: 0.38rem;
        }
      }
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
    // .ipt-container {
    //   width: 6.74rem;
    //   height: 0.68rem;
    //   box-shadow: 0rem 0.06rem 0.08rem 0rem rgba(223, 223, 223, 0.5);
    //   border-radius: 0.33rem;
    //   margin: 0.4rem 0.38rem 0.44rem;
    //   position: relative;
    //   input {
    //     width: 100%;
    //     height: 100%;
    //     font-size: 0.28rem;
    //     color: #0a3cc7;
    //     font-weight: 400;
    //     text-shadow: 0px 0px 0px rgba(223, 223, 223, 0.5);
    //     border-radius: 0.33rem;
    //     border: 0.02rem solid #d6d6d6;
    //     display: block;
    //     box-sizing: border-box;
    //     padding-left: 0.28rem;
    //     padding-right: 1.72rem;
    //   }
    //   .empty {
    //     position: absolute;
    //     top: 0.18rem;
    //     right: 1.4rem;
    //     z-index: 1;
    //     img {
    //       width: 0.32rem;
    //       height: 0.32rem;
    //       display: block;
    //     }
    //   }

    //   .search-btn {
    //     width: 1.12rem;
    //     font-size: 0.28rem;
    //     font-weight: 400;
    //     color: #000000;
    //     line-height: 0.68rem;
    //     text-align: center;
    //     text-shadow: 0px 0px 0px rgba(223, 223, 223, 0.5);
    //     background: #ffce09;
    //     box-shadow: 0rem 0.06rem 0.08rem 0rem rgba(223, 223, 223, 0.5),
    //       -0.04rem 0rem 0.02rem 0rem rgba(192, 192, 192, 0.5);
    //     border-radius: 0.33rem;
    //     position: absolute;
    //     right: 0;
    //     top: 0;
    //   }
    // }
    .search-history {
      .title {
        padding: 0 0.5rem 0.4rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          font-size: 0.3rem;
          font-weight: 400;
          color: #000000;
        }
        img {
          width: 0.32rem;
          height: 0.32rem;
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
          border-radius: 0.28rem;
          padding: 0.16rem 0.22rem 0.14rem 0.24rem;
          margin-right: 0.2rem;
          margin-bottom: 0.24rem;
        }
      }
    }
    .search-result {
      margin-left: 0.36rem;
      .result-item {
        font-size: 0.3rem;
        font-family: SourceHanSansCN-Normal, SourceHanSansCN;
        font-weight: 400;
        color: #000000;
        padding: 0.28rem 0.12rem;
        border-bottom: 0.02rem solid #f7f7f7;
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
    font-size: 0.36rem !important;
    font-weight: bold !important;
    color: #303030 !important;
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
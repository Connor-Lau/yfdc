<template>
  <div class="attentionlist">
    <gni-nav-bar :isShowNav="false"></gni-nav-bar>
    <div class="w-full" :style="{height: navHeight + 'px'}"></div>
    <div class="header fixed bg-white w-full top-0" :style="{paddingTop: ('calc(0.2rem + ' + tmpStatusBarHeight + 'px)')}">
      <div class="icon-return" @click="onClickBack">
        <img :src="$appConfig.appWebStaticUrl + '/home/icon_reutrn.png'" alt="">
      </div>
      <div class="header-nav">
        <div class="header-item" v-for="(item,index) in options" :key="index" @click="handleTab(item.id)">
          <div class="text" :class="typeIndex == item.id?'active':''">{{item.text}}</div>
          <img :src="$appConfig.appWebStaticUrl + '/home/icon_line.png'" alt="" :style="typeIndex==0?'left:0.2rem':typeIndex==1 || typeIndex==2 || typeIndex==3?'left:0.1rem':''" v-show="typeIndex == item.id">
        </div>
      </div>
    </div>
    <!-- <houselistItem :list="houselist" :isShowattention="true" @goDetail="goDetail"></houselistItem> -->
    <!-- 二手房 - start -->
    <van-list @load="onLoad"
      v-model="houseInfo[typeIndex].loading"
      :finished="houseInfo[typeIndex].finished"
      :immediate-check="false"
      v-show="typeIndex === 0">
      <template v-if="!$commonUtils.utilCore.empty(houseInfo[typeIndex].list) && !houseInfo[typeIndex].loading">
        <newhouselistItem :list="houseInfo[typeIndex].list" :isShowattention="true" :showPopup="showPopup" @goDetail="goDetail" @confirm="handleCancelFavorite"></newhouselistItem>
      </template>
      <template v-if="$commonUtils.utilCore.empty(houseInfo[typeIndex].list) && !houseInfo[typeIndex].loading">
        <div class="uptown-nothing">
          <div class="nothing-text">你还没有关注任何二手房</div>
          <div class="nothing-btn" @click="toolsGoPageView({path:'/common/index',query:{path:'/home/index'}})">去首页看看</div>
        </div>
      </template>
    </van-list>
    <!-- 二手房 - end -->
    <!-- 租房 - start -->
    <van-list @load="onLoad"
      v-model="houseInfo[typeIndex].loading"
      :finished="houseInfo[typeIndex].finished"
      :immediate-check="false"
      v-show="typeIndex === 1">
      <template v-if="!$commonUtils.utilCore.empty(houseInfo[typeIndex].list) && !houseInfo[typeIndex].loading">
        <newhouselistItem :list="houseInfo[typeIndex].list" :isShowattention="true" :showPopup="showPopup" :isRent="true" @goDetail="goDetail" @confirm="handleCancelFavorite"></newhouselistItem>
      </template>
      <template v-if="$commonUtils.utilCore.empty(houseInfo[typeIndex].list) && !houseInfo[typeIndex].loading">
        <div class="uptown-nothing">
          <div class="nothing-text">你还没有关注任何租房</div>
          <div class="nothing-btn" @click="toolsGoPageView({path:'/common/index',query:{path:'/home/index'}})">去首页看看</div>
        </div>
      </template>
    </van-list>
    <!-- 租房 - end -->
    <!-- 新房 - start -->
    <van-list @load="onLoad"
      v-model="houseInfo[typeIndex].loading"
      :finished="houseInfo[typeIndex].finished"
      :immediate-check="false"
      v-show="typeIndex === 2">
      <template v-if="!$commonUtils.utilCore.empty(houseInfo[typeIndex].list) && !houseInfo[typeIndex].loading">
        <newhouselistItem :list="houseInfo[typeIndex].list" :isShowattention="true" :isNewHouse="true" :showPopup="showPopup" @goDetail="goDetail" @confirm="handleCancelFavorite"></newhouselistItem>
      </template>
      <template v-if="$commonUtils.utilCore.empty(houseInfo[typeIndex].list) && !houseInfo[typeIndex].loading">
        <div class="uptown-nothing">
          <div class="nothing-text">你还没有关注任何新房</div>
          <div class="nothing-btn" @click="toolsGoPageView({path:'/common/index',query:{path:'/home/index'}})">去首页看看</div>
        </div>
      </template>
    </van-list>
    <!-- 新房 - end -->
    <!-- 小区  跳转小区详情query:{id:houseInfo.uptown_id,housetype:'1', longitude, latitude}- start -->
    <van-list v-model="houseInfo[typeIndex].loading" :finished="houseInfo[typeIndex].finished" :immediate-check="false" @load="onLoad" v-show="typeIndex === 3">
      <template v-if="!$commonUtils.utilCore.empty(houseInfo[typeIndex].list) && !houseInfo[typeIndex].loading">
        <uptownlistItem :list="houseInfo[typeIndex].list" :showPopup="showPopup" @goUptownList="goUptownList" @goUptownDetail="goUptownDetail" @goHouseDetail="goHouseDetail"
          @confirm="handleCancelFavorite">
        </uptownlistItem>
      </template>
      <template v-if="$commonUtils.utilCore.empty(houseInfo[typeIndex].list) && !houseInfo[typeIndex].loading">
        <div class="uptown-nothing">
          <div class="nothing-text">你还没有关注任何小区</div>
          <div class="nothing-btn" @click="toolsGoPageView({path:'/common/index',query:{path:'/home/index'}})">去首页看看</div>
        </div>
      </template>
    </van-list>

    <!-- 小区 - end -->
    <scrollTop :scrollHeight="500"></scrollTop>
  </div>
</template>

<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import houselistItem from "@/components/yni/houselistItem.vue"
import newhouselistItem from "@/components/yni/newhouselistItem.vue"
import uptownlistItem from "@/components/yni/uptownlistItem.vue"
import scrollTop from "@/components/yni/scrolltop.vue"
import { mapState } from "vuex";
export default {
  components: {
    gniNavBar,
    houselistItem,
    newhouselistItem,
    scrollTop,
    uptownlistItem
  },
  data () {
    return {
      options: [
        {
          id: 0,
          text: '二手房'
        },
        {
          id: 1,
          text: '租房'
        },
        {
          id: 2,
          text: '新房'
        },
        {
          id: 3,
          text: '小区'
        }
      ],
      isLoading: false,
      houseInfo: {
        // 二手房
        0: {
          page: 1,
          loading: false,
          finished: false,
          list: [],
        },
        // 租房
        1: {
          page: 1,
          loading: false,
          finished: false,
          list: [],
        },
        // 新房
        2: {
          page: 1,
          loading: false,
          finished: false,
          list: [],
        },
        // 小区
        3: {
          page: 1,
          loading: false,
          finished: false,
          list: [],
        },
      },
      typeIndex: 0,
      showPopup: false,
      navHeight: 0, //导航栏高度
      tmpStatusBarHeight: 0, // 状态栏
      isBack: false, //是否返回
    }
  },
  computed: {
    ...mapState("user", ["userToken", "userInfo", "isLogin"]), //用户Token,用户登陆信息
    ...mapState("city", ["geoPosition", "thisCityInfo", "switchCityInfo", "cityInfoRows"]),
  },
  beforeRouteEnter (to, from, next) {
    if (
      from.path == "/home/detail/secondhouseDetail" ||
      from.path == "/home/detail/renthouseDetail" ||
      from.path == "/home/detail/newhouseDetail" || from.path == "/home/detail/housevillage" || from.path == "/home/list/secondhouseList" || from.path == "/home/list/renthouseList"
    ) {
      to.meta.canKeep = true;
    } else {
      to.meta.canKeep = false;
    }
    next();
  },
  mounted () {
    this.initPage(1);
    this.onLoad();
    const headerBox = document.querySelector(".header");
    this.tmpStatusBarHeight = Number(this.$store.state.app.systemInfo.statusBarHeight || 0);
    this.navHeight = Number(headerBox.offsetHeight || 0);
  },
  activated () {
    if (this.$route.meta.canKeep) {
      this.initPage();
      this.onLoad();
      return
    }
    if (this.isBack) {
      this.initPage(1);
      this.onLoad();
    }
  },
  methods: {
    initPage (type) {
      //这里不使用数组索引了，直接使用设置的id值来，可以直接对应
      if (type === 1) {
        this.typeIndex = Number(this.$route.query.typeIndex)
      }
      this.isLoading = false;
      this.houseInfo = {
        // 二手房
        0: {
          page: 1,
          loading: false,
          finished: false,
          list: [],
        },
        // 租房
        1: {
          page: 1,
          loading: false,
          finished: false,
          list: [],
        },
        // 新房
        2: {
          page: 1,
          loading: false,
          finished: false,
          list: [],
        },
        // 小区
        3: {
          page: 1,
          loading: false,
          finished: false,
          list: [],
        },
      };
    },
    async onLoad () {
      const { typeIndex, houseInfo } = this;
      if (!this.isLogin) {
        this.houseInfo[typeIndex].loading = false;
        this.houseInfo[typeIndex].finished = true;
        this.$commonUtils.utilCore.showToast("请登录");
        return
      }
      this.isLoading = true;
      this.houseInfo[typeIndex].loading = true;
      const postData = {
        page: houseInfo[typeIndex].page,//	否	string	页码 默认1
        page_size: 10,//	否	string	每页显示数 默认10
      }
      let res = null;

      // 注：此时的typeIndex不是传过来的typeIndex，
      // 已经在mounted钩子函数进行了调整了，为了拿下标和对象的属性一一对应
      // 二手房
      if (typeIndex === 0) {
        res = await this.$store.dispatch('user/getAppFavoriteSale', postData);
      }
      // 租房
      if (typeIndex === 1) {
        res = await this.$store.dispatch('user/getAppFavoriteRent', postData);
        console.log(JSON.stringify(res))
      }
      // 新房
      if (typeIndex === 2) {
        res = await this.$store.dispatch('user/getAppFavoriteHouse', postData);
      }
      // 小区列表
      if (typeIndex === 3) {
        res = await this.$store.dispatch('user/getAppFangFavoriteNewUptown', postData);
      }
      this.isBack = true;
      if (res) {
        this.houseInfo[typeIndex].loading = false;
        if (res.rows.length) {
          if (typeIndex === 3) {
            res.rows.forEach((item, index) => {
              item.typeIndex = 0
            })
          }
          this.houseInfo[typeIndex].list.push(...res.rows);
          if (res.rows.length < 10) {
            this.houseInfo[typeIndex].finished = true;
          }
        } else {
          if (this.houseInfo[typeIndex].page === 1) {
            this.houseInfo[typeIndex].list = [];
          }
          this.houseInfo[typeIndex].finished = true;
        }
        this.houseInfo[typeIndex].page++;
        this.isLoading = false;
      } else {
        this.houseInfo[typeIndex].loading = false;
        this.houseInfo[typeIndex].finished = true;
        this.isLoading = false;
      }
    },
    onClickBack () {
      this.$router.go(-1);
    },
    handleTab (index) {
      if (this.isLoading) return;
      this.typeIndex = index;
      if (!this.houseInfo[index].finished && !this.houseInfo[index].list.length) {
        this.onLoad();
      }
    },
    // 取消关注
    async handleCancelFavorite (e1, e2) {
      this.showPopup = true;
      this.isLoading = true;//先锁住，防止splice 删除错数据
      const postData = {
        city_id: this.switchCityInfo.city_id || this.thisCityInfo.city_id,//	是	string	城市id
        resource_id: e1.resource_id,//	是	string	资源id
        resource_type: e1.resource_type,//	是	string	资源类型id 1:二手房，2：租房，3：新房，4：小区，5：经纪人
      }
      const res = await this.$store.dispatch('home/cancelAppFangFavorite', postData);
      if (res) {
        this.houseInfo[this.typeIndex].list.splice(e2, 1);
        this.$nextTick(() => {
          this.showPopup = false;
        })
      }
      this.isLoading = false;
    },
    goDetail (item) {
      let query = {
        id: item.resource_id,
        broker_id: item.broker_id,//	否	string	经纪人id
        share_broker_id: item.share_broker_id || '',//	否	string	分享者经纪人id
        city_id: item.site_id || 0
      }
      let path = "";
      // 二手房
      if (this.typeIndex === 0) {
        path = "/home/detail/secondhouseDetail";
      }
      // 租房
      if (this.typeIndex === 1) {
        path = "/home/detail/renthouseDetail";
      }
      // 新房
      if (this.typeIndex === 2) {
        path = "/home/detail/newhouseDetail";
        query = {
          loupan_id: item.loupan_id
        }
      }
      this.toolsGoPageView({
        path,
        query,
      });
    },
    // 全部 跳转小区列表
    goUptownList (item) {
      if (item.typeIndex == 0) {
        this.toolsGoPageView({ path: '/home/list/secondhouseList', query: { fromUptown: 'true', uptown_id: item.uptown_data.uptown_id, titleUptown: item.uptown_data.uptown_name, city_id: item.site_id } });
      } else {
        this.toolsGoPageView({ path: '/home/list/renthouseList', query: { fromUptown: 'true', uptown_id: item.uptown_data.uptown_id, titleUptown: item.uptown_data.uptown_name, city_id: item.site_id } });
      }
    },
    //跳转小区详情
    goUptownDetail (item) {
      this.toolsGoPageView({ path: '/home/detail/housevillage', query: { id: item.uptown_data.uptown_id, cityId: item.site_id } })
      console.log(item);
    },
    //跳转房源详情
    goHouseDetail (item, item_house) {
      if (item.typeIndex == 0) {
        this.toolsGoPageView({
          path: '/home/detail/secondhouseDetail',
          query: { id: item_house.shouse_id, city_id: item.site_id }
        })
      } else {
        this.toolsGoPageView({
          path: '/home/detail/renthouseDetail',
          query: { id: item_house.rent_id, city_id: item.site_id }
        })
      }
      console.log(item);
    },
  },
}
</script>

<style lang="scss" scoped>
.attentionlist {
  .header {
    display: flex;
    align-items: center;
    padding: 0.18rem 0 0.32rem 0.36rem;
    border-bottom: 0.01rem solid #f1f1f1;
    z-index: 100;
    .icon-return {
      width: 0.45rem;
      height: 0.4rem;
      padding-right: 0.36rem;
      margin-right: 0.7rem;
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
  .uptown-nothing {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 3.2rem;
    .nothing-text {
      font-size: 0.28rem;
      font-weight: 400;
      color: #8d8d8d;
      padding-bottom: 0.4rem;
    }
    .nothing-btn {
      width: 2.4rem;
      height: 0.8rem;
      background: #ffce09;
      border-radius: 0.08rem;
      font-size: 0.32rem;
      font-weight: 500;
      color: #000000;
      line-height: 0.8rem;
      text-align: center;
    }
  }
  .active {
    font-size: 0.36rem !important;
    font-weight: bold !important;
    color: #303030 !important;
  }
}
</style>
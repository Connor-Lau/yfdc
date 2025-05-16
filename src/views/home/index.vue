<template>
  <div class="home">
    <!-- <gni-nav-bar :isShowNav="false"></gni-nav-bar> -->
    <div class="home-bg" @click="goToAPP('https://mp.weixin.qq.com/s/fT85NJLBVm4n_2gzNc1Emg')">
      <img :src="$appConfig.appWebStaticUrl + '/home/home_bg_069.png'" alt="" v-if="isSixnine">
      <img :src="$appConfig.appWebStaticUrl + '/home/home_bg_un069.png'" alt="" v-else>
      <!-- v-if="cityInfoRows && cityInfoRows.info && !isSixnine" -->
    </div>
    <div class="home-nav">
      <div class="search">
        <div class="search-left" @click="toolsGoPageView({ path: '/home/city/index' })">
          <div class="city">{{ selectCityName }}</div>
          <van-icon name="play" />
          <div class="line"></div>
        </div>
        <input type="text" placeholder="你想住在哪？"
          @click="toolsGoPageView({ path: '/home/newsearch', query: { houseType: 'index' } })">
        <div class="search-right" @click="toolsGoPageView({ path: '/home/newsearch', query: { houseType: 'index' } })">搜索
        </div>
      </div>
    </div>
    <div class="room-options">
      <div class="options-item" @click="toolsGoPageView({ path: '/home/list/secondhouseList' })">
        <img :src="$appConfig.appWebStaticUrl + '/home/icon_second.png'" alt="">
        <div class="text">二手房</div>
      </div>
      <div class="options-item" @click="toolsGoPageView({ path: '/home/list/renthouseList' })">
        <img :src="$appConfig.appWebStaticUrl + '/home/icon_renthouse01.png'" alt="">
        <div class="text">租房</div>
      </div>
      <div class="options-item" @click="toolsGoPageView({ path: '/home/list/newhouseList' })">
        <img :src="$appConfig.appWebStaticUrl + '/home/icon_newhouse01.png'" alt="">
        <div class="text">新房</div>
      </div>
      <!-- <div class="options-item" @click="goCommission">
        <img :src="$appConfig.appWebStaticUrl + '/home/icon_commission.png'" alt="">
        <div class="text">我要委托</div>
      </div> -->
      <div class="options-item" @click="toolsGoPageView({ path: '/home/list/dealist' })">
        <img :src="$appConfig.appWebStaticUrl + '/home/icon_checktransaction.png'" alt="">
        <div class="text">查成交</div>
      </div>
      <div class="options-item" @click="toolsGoPageView({ path: '/maphouse/index' })">
        <img :src="$appConfig.appWebStaticUrl + '/home/icon_maphome.png'" alt="">
        <div class="text">地图找房</div>
      </div>
    </div>
    <div class="bannar" @click="goWeChatMin">
      <img :src="$appConfig.appWebStaticUrl + '/home/homg_bannar01.png'" alt="">
    </div>
    <div class="wrapper">
      <div class="header">
        <div class="header-item" v-for="(item) in options" :key="item.val" @click="handleTab(item.val)">
          <div class="text" :class="typeIndex == item.val ? 'active' : ''">{{ item.text }}</div>
          <img :src="$appConfig.appWebStaticUrl + '/home/icon_line.png'" alt=""
            :style="typeIndex == 0 ? 'left:0.2rem' : typeIndex == 1 || typeIndex == 2 ? 'left:0.1rem' : ''"
            v-show="typeIndex == item.val">
        </div>
      </div>
      <div class="list">
        <van-list @load="actOnLoad" v-model="pageData.loading" :finished="pageData.finished" :immediate-check="false"
          finished-text="没有更多了">

          <template v-if="typeIndex == 0">
            <div v-for="(item, index) in indexPageListData.info" :key="'act' + index" class="list-item"
              @click="toolsGoPageView({ path: '/home/detail/secondhouseDetail', query: { id: item.shouse_id, block_id: item.block_id } })">
              <div class="item-left relative">
                <!-- <img :src="item.picture" alt=""> -->
                <img v-img-lazy="item.picture" @error="toolsGetErrorHouseImage($event)" alt="">
                <div class="absolute icon-vr-box flex items-center justify-center" v-if="item.vr_url">
                  <img :src="$appConfig.appWebStaticUrl + 'common/icon-vr.png'" alt="">
                </div>
              </div>
              <div class="item-right">
                <div class="title">{{ item.shouse_title }}</div>
                <div class="subtitle">{{ showTitle(item, typeIndex) }}</div>
                <div v-if="item.tags" class="label-container">
                  <div v-for="(item2, index) in item.tags" :key="index" class="label-item">{{ item2.tag_name }}</div>
                </div>
                <div class="price">{{ item.price_name }}</div>
              </div>
            </div>
          </template>
          <template v-if="typeIndex == 1">
            <div class="new-container">
              <newhouselistItem :list="indexPageListData.info" @goDetail="goDetail" :isNewHouse="true"></newhouselistItem>
            </div>

          </template>
          <template v-if="typeIndex == 2">
            <div v-for="(item, index) in indexPageListData.info" :key="'act' + index" class="list-item"
              @click="toolsGoPageView({ path: '/home/detail/renthouseDetail', query: { id: item.rent_id, broker_id: item.broker_id, share_broker_id: item.share_broker_id || '' } })">
              <div class="item-left relative">
                <!-- <img :src="item.picture" alt=""> -->
                <img :src="toolsGetWebStaticUrl(item.picture)" @error="toolsGetErrorHouseImage($event)" alt="">
                <div class="absolute icon-vr-box flex items-center justify-center" v-if="item.vr_url">
                  <img :src="$appConfig.appWebStaticUrl + 'common/icon-vr.png'" alt="">
                </div>
              </div>
              <div class="item-right">
                <div class="title">{{ item.rent_title }}</div>
                <div class="subtitle">{{ showTitle(item, typeIndex) }}</div>
                <div class="label-container">
                  <div v-for="(item2, index) in item.tags" :key="index" class="label-item">{{ item2.tag_name }}</div>
                </div>
                <div class="price">{{ item.rent_price_name }}</div>
              </div>
            </div>
          </template>
          <!-- <div class="list-item">
            <div class="item-left">
              <img src="" alt="">
            </div>
            <div class="item-right">
              <div class="title">荣华南 1室 40㎡</div>
              <div class="subtitle">海珠区/2室1厅/80㎡/朝南北/中楼层</div>
              <div class="label-container">
                <div class="label-item">精装修</div>
                <div class="label-item">期房在售</div>
              </div>
              <div class="price">228万</div>
            </div>
          </div> -->
        </van-list>
      </div>
    </div>
    <!-- <gniTabbar curP="/home/index" ref="tabbarView" v-if="isPage"></gniTabbar> -->
    <!-- 回到顶部 -->
    <scrollTop></scrollTop>
  </div>
</template>

<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import newhouselistItem from "@/components/yni/newhouselistItem.vue"
import gniTabbar from "@/components/gni/gni-tabbar.vue";
import scrollTop from "@/components/yni/scrolltop.vue"

import { mapState, mapActions, mapMutations } from "vuex";

export default {
  components: {
    gniNavBar,
    newhouselistItem,
    gniTabbar,
    scrollTop
  },
  props: {
    isUpDate: {
      type: Boolean,
      default: false
    },
    isPage: {
      type: Boolean,
      default: true
    },
    tabbarHeight: {
      type: [Number, String],
      default: 0,
    },
  },
  data () {
    return {
      options: [
        {
          text: '二手房',
          val: 0
        },
        {
          text: '租房',
          val: 2
        },
        {
          text: '新房',
          val: 1
        }
      ],
      typeIndex: 0,//当前选择的房源标签
      pageData: {
        loading: false,//是否加载中
        finished: false,//是否已经加载完
      },
      indexPageListData: {//显示时的数据转换
        info: [],//房源数据列表
        pageData: {
          typeIndex: 0,//当前选择的类型
          loading: true,//是否加载中
          finished: false,//是否已经加载完
          page_size: 20, //	否	string	每页显示数 默认10 最大20
          page: 0, //	否	string	页码 默认1
        }
      },
      indexGetLastSale: {//二手房数据列表
        info: [],//房源数据列表
        pageData: {
          typeIndex: 0,//当前选择的类型
          loading: true,//是否加载中
          finished: false,//是否已经加载完
          page_size: 20, //	否	string	每页显示数 默认10 最大20
          page: 0, //	否	string	页码 默认1
          update_time: '',
        }
      },
      indexGetLastHouse: {//新房数据列表
        info: [],//房源数据列表
        pageData: {
          typeIndex: 1,//当前选择的类型
          loading: true,//是否加载中
          finished: false,//是否已经加载完
          page_size: 20, //	否	string	每页显示数 默认10 最大20
          page: 0, //	否	string	页码 默认1
          update_time: '',
        }
      },
      indexGetLastRent: {//租房数据列表
        info: [],//房源数据列表
        pageData: {
          typeIndex: 2,//当前选择的类型
          loading: true,//是否加载中
          finished: false,//是否已经加载完
          page_size: 20, //	否	string	每页显示数 默认10 最大20
          page: 0, //	否	string	页码 默认1
          update_time: '',
        }
      },
    }
  },
  computed: {
    ...mapState("user", ["userToken", "userInfo", "isLogin"]), //用户Token,用户登陆信息
    ...mapState("city", ["geoPosition", "thisCityInfo", "switchCityInfo", "cityInfoRows"]), //城市的信息
    selectCityName () {//显示当前的城市
      if (
        !this.$commonUtils.utilCore.empty(this.switchCityInfo)
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
      return "请选城市"
    },
    isSixnine () {
      if (!this.$commonUtils.utilCore.empty(this.switchCityInfo)) {
        return this.switchCityInfo.is_69
      } else {
        return this.thisCityInfo.is_69
      }
    }
  },
  watch: {
    async isUpDate (val) {
      if (val) {
        await this.init();
        this.typeIndex = 0;//当前选择的房源标签
        this.pageData = {
          loading: false,//是否加载中
          finished: false,//是否已经加载完
        };
        this.indexPageListData = {//显示时的数据转换
          info: [],//房源数据列表
          pageData: {
            typeIndex: 0,//当前选择的类型
            loading: true,//是否加载中
            finished: false,//是否已经加载完
            page_size: 20, //	否	string	每页显示数 默认10 最大20
            page: 0, //	否	string	页码 默认1
          }
        };
        this.indexGetLastSale = {//二手房数据列表
          info: [],//房源数据列表
          pageData: {
            typeIndex: 0,//当前选择的类型
            loading: true,//是否加载中
            finished: false,//是否已经加载完
            page_size: 20, //	否	string	每页显示数 默认10 最大20
            page: 0, //	否	string	页码 默认1
          }
        };
        this.indexGetLastHouse = {//新房数据列表
          info: [],//房源数据列表
          pageData: {
            typeIndex: 1,//当前选择的类型
            loading: true,//是否加载中
            finished: false,//是否已经加载完
            page_size: 20, //	否	string	每页显示数 默认10 最大20
            page: 0, //	否	string	页码 默认1
          }
        };
        this.indexGetLastRent = {//租房数据列表
          info: [],//房源数据列表
          pageData: {
            typeIndex: 2,//当前选择的类型
            loading: true,//是否加载中
            finished: false,//是否已经加载完
            page_size: 20, //	否	string	每页显示数 默认10 最大20
            page: 0, //	否	string	页码 默认1
          }
        }
        // await this.initPosition();
        this.actOnLoad();
      }
    }
  },
  async mounted () {
    setTimeout(async () => {
      //初始化登陆的状态
      await this.init();
      //初始化地址的状态
      // await this.initPosition();
      // // 定位后再请求列表， 防止城市不对
      // this.actOnLoad();
      this.getHtmlPlus();
    }, 500)
  },
  methods: {
    //初始化用户登录的情况
    async init () {
      //如果用户没有登陆，则进行自动登陆
      if (this.$commonUtils.utilCore.empty(this.userToken) || !this.isLogin) {
        //判断一下用户登陆了没有
        let tmp_info = this.$store.dispatch('user/initLogin');
        //如果用户没有登陆，则清掉登陆相关的信息
        if (!tmp_info) {
          //如果数据为空，则清掉登陆的信息
          await this.$store.dispatch('user/actLoginOutApp');
        }
      }
      //每次进入首页，先清空一下搜索条件
      this.$store.commit('home/setSearchPostGetData', {});
    },
    //获取用户当前地址
    async initPosition () {
      await this.$store.dispatch('city/getGeoPosition', { messageAct: this.$messageAct, isUpdate: false });
      //当前时间
      let thisTime = this.$commonUtils.utilDate.time();
      //判断一下城市的缓存时间过期了没有,如果过期了需要重新获取
      if (this.$commonUtils.utilCore.empty(this.geoPosition.createTime) || this.geoPosition.createTime < thisTime - 86164) {
        await this.$store.dispatch('city/getGeoPosition', { messageAct: this.$messageAct, isUpdate: true });
      }
      //判断一下记录的城市是否有值，获取的定位城市与记录的城市是否同一个
      if (
        this.$commonUtils.utilCore.empty(this.thisCityInfo.city_info)
        || this.$commonUtils.utilCore.empty(this.thisCityInfo.city_name)
        || this.thisCityInfo.city_name != this.geoPosition.cityName.replace("市", "")
      ) {
        //去获取城市名称对应的城市Id
        if (!this.$commonUtils.utilCore.empty(this.geoPosition)) {
          let postData = {
            site_name: this.geoPosition.cityName.replace("市", "")
          }
          let res = await this.$store.dispatch('city/getAppFangBaseDataGetCityRows', { messageAct: this.$messageAct, postData: postData });
          //如果有搜索到对应的城市
          if (!this.$commonUtils.utilCore.empty(res)) {
            this.$store.commit('city/setThisCityInfo', res)
            await this.$store.dispatch('app/setAppStateData', { messageAct: this.$messageAct, jsonData: [{ "mod": "city", "fun": "setThisCityInfo", "val": res }] }, { root: true });
          }
        }
      }
      //如果执行到这里还是没有城市的数据，则获取城市位置出错了
      // if (this.$commonUtils.utilCore.empty(this.thisCityInfo.city_info)) {
      //   this.$commonUtils.utilCore.showToast("请开启定位")
      //   //判断到定位没有开启时，需要获取默认城市的信息的（默认城市就是广州）
      //   this.actOnLoad();
      // }
    },
    //加载数据
    async actOnLoad () {
      this.$commonUtils.appLog.log("加载数据---------------------->>>>", this.typeIndex)
      //设置当前数据的类型
      this.indexPageListData.pageData.typeIndex = this.typeIndex;
      if (this.typeIndex == 0) {//二手房
        await this.getLastSale();
      } else if (this.typeIndex == 1) {//新房
        await this.getLastHouse();
      } else if (this.typeIndex == 2) {//租房
        await this.getLastRent();
      } else {
        this.$commonUtils.appLog.log("选择的内容不正确", this.typeIndex)
      }
      return;
    },
    //加载二手房数据
    async getLastSale () {
      this.pageData.finished = this.indexGetLastSale.pageData.finished
      //如果是第一次搜索，则重置业数据列表为空数组
      if (this.indexGetLastSale.pageData.page == 0) {
        this.indexGetLastSale.info = [];
      } else if (this.indexGetLastSale.pageData.finished == true) {
        //如果已经加载完成了的，则直接返回就好了
        // this.indexPageListData = this.indexGetLastSale
        this.indexPageListData = this.$commonUtils.utilCore.deepClone(this.indexGetLastSale)
        this.$commonUtils.appLog.log("加载数据>>>>>完了！！！", this.indexGetLastSale.info.length)
        return;
      }
      this.indexGetLastSale.pageData.loading = true
      this.pageData.loading = this.indexGetLastSale.pageData.loading
      this.pageData.finished = false;

      //页数加1
      this.indexGetLastSale.pageData.page++;
      let postData = {
        city_id: this.switchCityInfo.city_id,
        page_size: this.indexGetLastSale.pageData.page_size,
        // page: this.indexGetLastSale.pageData.page,
        update_time: this.indexGetLastSale.pageData.update_time,
      }
      let res = await this.$store.dispatch('home/getAppFangIndexGetLastSale', postData);
      if (res && res.rows && res.rows.length > 0) {
        this.indexGetLastSale.pageData.update_time = res.rows[res.rows.length - 1].update_time
        res.rows.forEach(item => {
          if (item.price_name.replace('万', '') != 0) {
            //判断是否有重复的数据
            // if(!this.$commonUtils.utilCore.getRowByColumn(this.indexGetLastSale.info,item.shouse_id,"shouse_id","")){
            //   this.indexGetLastSale.info.push(item)
            // }
            this.indexGetLastSale.info.push(item)
          }
        })
        if (res.rows.length < postData.page_size) {
          this.$commonUtils.appLog.log("搜索二手房列表完成了了！！", res.rows.length, postData.page_size)
          this.indexGetLastSale.pageData.finished = true;
        }
      } else {
        this.$commonUtils.appLog.log("搜索二手房列表出错了！！", res)
        this.indexGetLastSale.pageData.finished = true;
      }
      this.indexGetLastSale.pageData.loading = false;

      this.pageData.finished = this.indexGetLastSale.pageData.finished
      this.pageData.loading = this.indexGetLastSale.pageData.loading

      // this.indexPageListData = this.indexGetLastSale
      this.indexPageListData = this.$commonUtils.utilCore.deepClone(this.indexGetLastSale)
    },
    //加载首页推荐新房列表
    async getLastHouse () {
      this.pageData.finished = this.indexGetLastHouse.pageData.finished

      //如果是第一次搜索，则重置业数据列表为空数组
      if (this.indexGetLastHouse.pageData.page == 0) {
        this.indexGetLastHouse.info = [];
      } else if (this.indexGetLastHouse.pageData.finished == true) {
        //如果已经加载完成了的，则直接返回就好了
        // this.indexPageListData = this.indexGetLastHouse
        this.indexPageListData = this.$commonUtils.utilCore.deepClone(this.indexGetLastHouse)
        this.$commonUtils.appLog.log("加载数据>>>>>完了！！！", this.indexGetLastHouse.info.length)
        return;
      }
      this.indexGetLastHouse.pageData.loading = true
      this.pageData.loading = this.indexGetLastHouse.pageData.loading
      this.pageData.finished = false;
      //页数加1
      this.indexGetLastHouse.pageData.page++;
      let postData = {
        city_id: this.switchCityInfo.city_id,
        page_size: this.indexGetLastHouse.pageData.page_size,
        // page: this.indexGetLastHouse.pageData.page,
        update_time: this.indexGetLastHouse.pageData.update_time,
      }
      let res = await this.$store.dispatch('home/getAppFangIndexGetLastHouse', postData);
      if (res && res.rows && res.rows.length > 0) {
        this.indexGetLastHouse.pageData.update_time = res.rows[res.rows.length - 1].update_time
        res.rows.forEach(item => {
          // if (!this.$commonUtils.utilCore.getRowByColumn(this.indexGetLastHouse.info, item.loupan_id, "loupan_id", "")) {
          //   this.indexGetLastHouse.info.push(item)
          // }
          this.indexGetLastHouse.info.push(item)
        })
        if (res.rows.length < postData.page_size) {
          this.$commonUtils.appLog.log("搜索新房房列表完成了了！！", res.rows.length, postData.page_size)
          this.indexGetLastHouse.pageData.finished = true;
        }
      } else {
        this.$commonUtils.appLog.log("搜索新房房列表出错了！！", res)
        this.indexGetLastHouse.pageData.finished = true;
      }
      this.indexGetLastHouse.pageData.loading = false;

      this.pageData.finished = this.indexGetLastHouse.pageData.finished
      this.pageData.loading = this.indexGetLastHouse.pageData.loading

      // this.indexPageListData = this.indexGetLastHouse
      this.indexPageListData = this.$commonUtils.utilCore.deepClone(this.indexGetLastHouse)
    },
    //加载首页推荐租房列表
    async getLastRent () {
      this.pageData.finished = this.indexGetLastRent.pageData.finished
      //如果是第一次搜索，则重置业数据列表为空数组
      if (this.indexGetLastRent.pageData.page == 0) {
        this.indexGetLastRent.info = [];
      } else if (this.indexGetLastRent.pageData.finished == true) {
        //如果已经加载完成了的，则直接返回就好了
        // this.indexPageListData = this.indexGetLastRent
        this.indexPageListData = this.$commonUtils.utilCore.deepClone(this.indexGetLastRent)
        this.$commonUtils.appLog.log("加载数据>>>>>完了！！！", this.indexGetLastRent.info.length)
        return;
      }
      this.indexGetLastRent.pageData.loading = true
      this.pageData.loading = this.indexGetLastRent.pageData.loading
      this.pageData.finished = false;
      //页数加1
      this.indexGetLastRent.pageData.page++;
      let postData = {
        city_id: this.switchCityInfo.city_id,
        page_size: this.indexGetLastRent.pageData.page_size,
        // page: this.indexGetLastRent.pageData.page,
        update_time: this.indexGetLastRent.pageData.update_time,
      }
      let res = await this.$store.dispatch('home/getAppFangIndexGetLastRent', postData);
      console.log(JSON.stringify(res))
      if (res && res.rows && res.rows.length > 0) {
        this.indexGetLastRent.pageData.update_time = res.rows[res.rows.length - 1].update_time
        res.rows.forEach(item => {
          if (item.rent_price != 0) {
            // if (!this.$commonUtils.utilCore.getRowByColumn(this.indexGetLastRent.info, item.rent_id, "rent_id", "")) {
            //   this.indexGetLastRent.info.push(item)
            // }
            this.indexGetLastRent.info.push(item)
          }
        })
        if (res.rows.length < postData.page_size) {
          this.$commonUtils.appLog.log("搜索新房房列表完成了了！！", res.rows.length, postData.page_size)
          this.indexGetLastRent.pageData.finished = true;
        }
      } else {
        this.$commonUtils.appLog.log("搜索新房房列表出错了！！", res)
        this.indexGetLastRent.pageData.finished = true;
      }
      this.indexGetLastRent.pageData.loading = false;

      this.pageData.finished = this.indexGetLastRent.pageData.finished
      this.pageData.loading = this.indexGetLastRent.pageData.loading

      // this.indexPageListData = this.indexGetLastRent
      this.indexPageListData = this.$commonUtils.utilCore.deepClone(this.indexGetLastRent)
    },
    async handleTab (index) {
      if (this.pageData.loading == true) {
        this.$commonUtils.appLog.log("正在请求内容，请等会！！！！")
        return;
      }
      this.typeIndex = index
      //如果选择的跟现在展示的是同一种类型，则不需要动
      if (this.indexPageListData.pageData.typeIndex == this.typeIndex) {
        this.$commonUtils.appLog.log("是同一种类型-=======================>>>>>>>", this.typeIndex)
        return;
      }
      if (this.typeIndex == 0) {
        this.indexGetLastSale.pageData.update_time = ''
        this.indexGetLastSale.pageData.page = 0
      } else if (this.typeIndex == 1) {
        this.indexGetLastHouse.pageData.update_time = ''
        this.indexGetLastHouse.pageData.page = 0
      } else {
        this.indexGetLastRent.pageData.update_time = ''
        this.indexGetLastRent.pageData.page = 0
      }
      this.indexPageListData.info = []
      await this.actOnLoad();
    },
    /**
     * 显示户型等内容
     * item=>数据
     * type=>数据类型
     */
    showTitle (item, type) {
      let strTitle = "";
      if (type == 0) {//二手房
        if (!this.$commonUtils.utilCore.empty(item.district_name)) {
          strTitle += item.district_name + "/"
        }
        if (!this.$commonUtils.utilCore.empty(item.layout_short_name)) {
          strTitle += item.layout_short_name + "/"
        }
        if (!this.$commonUtils.utilCore.empty(item.acreage_cover_name)) {
          strTitle += item.acreage_cover_name + "/"
        }
        if (!this.$commonUtils.utilCore.empty(item.house_orientation_name)) {
          if (item.house_orientation_name != '保留') {
            strTitle += item.house_orientation_name + "/"
          }
          // strTitle += item.house_orientation_name + "/"
        }
        if (!this.$commonUtils.utilCore.empty(item.floor_name)) {
          strTitle += item.floor_name + "/"
        }
        //去掉未尾的 /
        strTitle = strTitle.substr(-1) == "/" ? strTitle.substr(0, strTitle.length - 1) : strTitle

      } else if (type == 1) {//新房
        if (!this.$commonUtils.utilCore.empty(item.district_name)) {
          strTitle += item.district_name + "/"
        }
        if (!this.$commonUtils.utilCore.empty(item.property_type_name)) {
          strTitle += item.property_type_name + "/"
        }
        if (!this.$commonUtils.utilCore.empty(item.acreage_name)) {
          strTitle += item.acreage_name + "/"
        }
        if (!this.$commonUtils.utilCore.empty(item.sell_status_name)) {
          strTitle += item.sell_status_name + "/"
        }
        //去掉未尾的 /
        strTitle = strTitle.substr(-1) == "/" ? strTitle.substr(0, strTitle.length - 1) : strTitle
      } else if (type == 2) {//租房
        if (!this.$commonUtils.utilCore.empty(item.district_name)) {
          strTitle += item.district_name + "/"
        }
        if (!this.$commonUtils.utilCore.empty(item.floor_name)) {
          strTitle += item.floor_name + "/"
        }
        if (!this.$commonUtils.utilCore.empty(item.house_orientation_name)) {
          if (item.house_orientation_name != '保留') {
            strTitle += item.house_orientation_name + "/"
          }
        }
        //去掉未尾的 /
        strTitle = strTitle.substr(-1) == "/" ? strTitle.substr(0, strTitle.length - 1) : strTitle
      } else {
        strTitle = "数据不正确"
      }
      //海珠区/2室1厅/80㎡/朝南北/中楼层
      return strTitle;
    },
    goToAPP (url) {
      if (this.isSixnine) {
        // let toUrl = '/pages/common/web-view-show/web-detail?hideNav=no&url=' + url + "&title=裕丰地产"
        // this.$commonUtils.appLog.log("mmmmmmmmmmm=========>>>", toUrl)
        // this.$commonUtils.utilCore.uniGoPage(toUrl)
        this.toolsGoPageView({
          path: '/common/web-detail',
          query: { url: url, title: '裕丰新闻' },
        });
      } else {
        this.$commonUtils.appLog.log("不是0.69的城市")
      }
    },
    //跳转到详情页
    goDetail (item) {
      let tmp_query = {
        loupan_id: item.loupan_id
      }
      this.toolsGoPageView({
        path: '/home/detail/newhouseDetail',
        query: tmp_query
      })
    },
    // 跳转委托
    goCommission () {
      if (!this.isLogin) {
        // return this.$commonUtils.utilCore.showToast("请登录后再操作");
        // location._fromCommission = 1;
        // this.toolsGoPageView({ path: '/common/index', query: { fromCommission: true, path: '/user/index' } })
        this.$emit("goLogin");
        return
      }
      this.toolsGoPageView({ path: '/home/commission/index' })
    },
    /**
     *判断是否是app环境
     */
    isAppPlus () {
      const ua = navigator.userAgent.toLowerCase();
      if (ua.match(/html5plus/i) == "html5plus") {
        return true;
      }
      return false;
    },
    // 获取plus服务上的微信标识
    getServices () {
      plus.share.getServices(
        (s) => {
          for (let i = 0; i < s.length; i++) {
            const item = s[i];
            if (item.id === "weixin") {
              this.sweixin = item;
            }
          }
        },
        function (e) { }
      );
    },
    // 加载plus.share.getServices事件
    getHtmlPlus () {
      if (!this.isAppPlus()) return;
      if (window.plus) {
        this.getServices();
      } else {
        // 兼容老版本的plusready事件
        document.addEventListener(
          "plusready",
          () => {
            this.getServices();
          },
          false
        );
      }
    },
    // 跳转小程序
    goWeChatMin () {
      if (this.isAppPlus()) {
        // 调用微信小程序
        this.sweixin.launchMiniProgram(
          {
            id: "gh_cbb5c9d6827f", // 要跳转小程序的原始ID
            path: 'pages/user/user-broker/activity-illustrate'
          },
          (res) => {
          },
          (err) => {
          }
        );
      } else {
        this.$toast("请在app中打开");
      }
    },
    //检查是否有开始定位，如果没有则跳转到设置页
    async getPermision () {
      let tmp_info = { "mod": "app", "fun": "actCheckPermission", "val": { "pid": "location" } };
      if (this.$commonUtils.utilCore.getSys() != 'IOS') {//如果是安卓
        tmp_info.val.pid = 'android.permission.ACCESS_FINE_LOCATION';
      }
      let tmp_info_res = await this.$store.dispatch('app/actModFun', { messageAct: this.$messageAct, jsonData: tmp_info });
      if (tmp_info_res != 1) {
        this.$commonUtils.utilCore.showToast("请开启定位")
        // setTimeout(async ()=>{
        //   tmp_info = {"mod":"app","fun":"actUpPermission","val":{"pid":""}};
        //   await this.$store.dispatch('app/actModFun', { messageAct: this.$messageAct, jsonData: tmp_info });
        // },2000)
      } else {
        this.$commonUtils.utilCore.showToast("已开启定位")
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  min-height: 100vh;

  .home-bg {
    height: 3.36rem;
    padding-bottom: 0.28rem;

    img {
      width: 100%;
      height: 100%;
      // object-fit: contain;
    }
  }

  .home-nav {
    padding: 0 0.26rem 0.3rem;

    .search {
      width: 6.98rem;
      position: relative;

      .search-left {
        position: absolute;
        line-height: 0.76rem;
        left: 0.32rem;
        display: flex;
        align-items: center;
        z-index: 99;

        .city {
          font-size: 0.28rem;
          font-weight: bold;
          color: #303030;
          padding-right: 0.14rem;
        }

        .van-icon-play {
          font-size: 0.2rem;
          color: #727272;
          transform: rotate(90deg);
        }

        .line {
          width: 0.02rem;
          height: 0.29rem;
          margin-left: 0.28rem;
          background: #e4e4e4;
        }
      }

      input {
        width: 100%;
        height: 0.76rem;
        font-size: 0.28rem;
        font-weight: 400;
        color: #737373;
        border-radius: 0.33rem;
        border: 0.02rem solid #d1d1d1;
        padding-left: 1.82rem;
        box-sizing: border-box;
        display: block;
      }

      .search-right {
        width: 1.32rem;
        font-size: 0.26rem;
        font-weight: 400;
        color: #333333;
        line-height: 0.76rem;
        text-align: center;
        background: #ffce09;
        border-radius: 0rem 0.3rem 0.3rem 0rem;
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }

  .room-options {
    padding: 0 0.28rem 0.3rem;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;

    .options-item {
      width: 1.1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-right: 0.36rem;
      white-space: nowrap;

      img {
        width: 1.1rem;
        height: 0.7rem;
      }

      .text {
        font-size: 0.26rem;
        font-weight: 400;
        color: #000000;
        padding-top: 0.14rem;
      }

      &:nth-child(5n) {
        padding-right: 0;
      }
    }
  }

  .bannar {
    height: 2.14rem;
    margin-bottom: 0.28rem;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .wrapper {
    .header {
      padding-left: 0.4rem;
      display: flex;
      align-items: center;

      .header-item {
        padding-right: 0.4rem;
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
          bottom: -0.05rem;
          left: 0.38rem;
        }
      }
    }

    .list {
      .list-item {
        padding: 0.3rem 0.4rem;
        display: flex;
        border-bottom: 0.02rem solid #f1f1f1;

        .item-left {
          width: 2.2rem;
          height: 1.68rem;
          border-radius: 0.04rem;

          img {
            background-color: #f7f7f7;
            width: 2.2rem;
            height: 1.68rem;
            border-radius: 0.08rem;
            object-fit: cover;
          }

          .icon-vr-box {
            width: 0.4rem;
            height: 0.4rem;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 50%;
            left: 0.12rem;
            bottom: 0.12rem;

            img {
              width: 0.32rem;
              height: 0.2rem;
              background: rgba(0, 0, 0, 0);
            }
          }
        }

        .item-right {
          padding-left: 0.34rem;
          padding-top: 0.02rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .title {
            font-size: 0.3rem;
            font-weight: 400;
            color: #000000;
          }

          .subtitle {
            font-size: 0.22rem;
            font-weight: 400;
            color: #737373;
          }

          .label-container {
            display: flex;

            .label-item {
              font-size: 0.18rem;
              font-weight: 400;
              color: #333333;
              padding: 0.06rem;
              background: #f6f6f6;
              margin-right: 0.1rem;
            }
          }

          .price {
            font-size: 0.3rem;
            font-weight: bold;
            color: #ff0000;
          }
        }

        // &:nth-last-child(3) {
        //   border: none;
        // }
      }
    }
  }

  .active {
    font-size: 0.32rem !important;
    font-weight: bold !important;
    color: #000000 !important;
  }
}

.new-container {
  /deep/ .list-item {
    margin: 0;
    padding-right: 0.4rem;
    padding-left: 0.4rem;

    .item-right {
      .title {
        font-weight: 400;
      }
    }
  }
}
</style>
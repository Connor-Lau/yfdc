<template>
  <div class="villagechoose">
    <gni-nav-bar :pageTitle="headTitle" @onClickLeft="onClickBack" :hideRight="false" :hideLeft="false">
      <template slot="slot-left">
        <div class="nav-left">
          <img :src="$appConfig.appWebStaticUrl + '/commission/icon_return.png'" alt="">
        </div>
      </template>
    </gni-nav-bar>
    <div class="wrapper">
      <div class="nav-container">
        <div class="ipt-container-wt">
          <form action="javascript:;" @submit="$refs.searchRef.blur(); searchVillage();" class="formstyle">
            <input type="search" placeholder="请输入小区/路名" class="ipt-box" v-model="searchdata" @input="searchVillage"
              ref="searchRef">
          </form>
          <img :src="$appConfig.appWebStaticUrl + '/home/icon_magnifier.png'" alt="" class="icon-magnifier">
          <div class="icon-close" @click="emptySearch">
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_close.png'" alt="" v-if="searchdata">
          </div>
          <div class="ipt-item" @click="toolsGoPageView({ path: '/home/commission/roomnumber' })">
            <input type="text" readonly
              :value="!$commonUtils.utilCore.empty(commissionfloor) ? commissionfloor.housefloor : '00'"
              :style="$commonUtils.utilCore.empty(commissionfloor) ? 'color:#737373' : ''">
            <span>楼</span>
            <input type="text" readonly
              :value="!$commonUtils.utilCore.empty(commissionfloor) ? commissionfloor.houseNum : '00'"
              :style="$commonUtils.utilCore.empty(commissionfloor) ? 'color:#737373' : ''">
            <span>房</span>
          </div>
        </div>
      </div>
      <div class="search-list">
        <van-list @load="getList" v-model="pageData.loading" :finished="pageData.finished" finished-text="没有更多了"
          :immediate-check="false" v-show="searchdata">
          <div class="list-item" v-for="(item, index) in listdata" :key="index" @click="chooseItem(item, index)">
            <div class="item-left">
              <div class="house" v-html="item.html"></div>
              <div class="address">【{{ item.city_name }}-{{ item.district_name }}】</div>
            </div>
            <div class="item-right" v-if="commissionData.village">
              <img :src="$appConfig.appWebStaticUrl + '/home/icon_select.png'" alt=""
                v-if="commissionData.village.id == item.id">
              <img :src="$appConfig.appWebStaticUrl + '/home/icon_unselect.png'" alt="" v-else>
            </div>
          </div>
        </van-list>
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
      headTitle: '小区/路名', //标题文字
      listdata: [],
      selectIndex: -1, // 选中的下标
      searchdata: '',
      pageData: {
        loading: false,//是否加载中
        finished: false,//是否已经加载完
        page: 0,
        page_size: 20,
      },
      commissionfloor: {},
      commissionVillageId: 0,
      cityid: '',
      timer: null,
    }
  },
  async mounted () {
    setTimeout(async () => {
      //初始化登陆的状态
      await this.init();
    }, 500)
  },
  computed: {
    ...mapState("commission", ["commissionData"]), //我的委托的信息
  },
  watch: {
    cityid: {
      handler () {
        console.log('城市已变');
        this.setCommissionData({ data: {}, key: "village" })
        this.emptySearch()
      },
      deep: true,
    },
  },
  // 修复委托搜索小区选完楼层后关键词消失问题
  // beforeRouteEnter (to, from, next) {
  //   next(e => {
  //     if (to.query.villageId && from.path != '/home/commission/roomnumber') {
  //       console.log('数据已删除');
  //       e.emptySearch()
  //     }
  //   })
  // },
  activated () {
    this.commissionfloor = this.commissionData.roomnumber
    if (!this.$commonUtils.utilCore.empty(this.commissionData.village)) {
      this.searchdata = this.commissionData.village.mix_name
      this.initData()
      this.$nextTick(() => {
        this.getList()
      });
    }
    // 没选择房源再次进入需清除搜索的房源
    else {
      this.emptySearch()
    }
    this.cityid = this.commissionData.city.city_id
  },
  methods: {
    ...mapMutations('commission', ['setCommissionData']),
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
    // 获取列表数据
    async getList () {
      if (this.$commonUtils.utilCore.empty(this.searchdata)) return
      this.pageData.finished = false;
      this.pageData.loading = true;
      this.pageData.page++;
      const postData = {
        keyword: this.searchdata, //	是	string	关键字
        city_id: this.commissionData.city.city_id, // 否	string	城市id
        page: this.pageData.page, //	否	string	页码 默认1
        page_size: this.pageData.page_size, //	否	string	每页显示数 默认20
      }
      const res = await this.$store.dispatch(`commission/${this.cityid == 8 ? 'getAppEntrustSearchHouseDictionary' : 'getAppEntrustSearchErpUptown'}`, postData);
      if (res) {
        res.list.forEach(item => {
          item.html = item.mix_name.replace(this.searchdata, "<span style='color: #F7D447;'>" + this.searchdata + "</span>")
          this.listdata.push(item)
        });
        if (this.listdata.length == res.total) {
          // 搜索完成
          this.pageData.finished = true;
        }
        this.pageData.loading = false;
      }
    },
    // 重置变量
    initData () {
      this.listdata = []
      this.pageData.page = 0
      this.pageData.page_size = 20
      this.selectIndex = -1
    },
    // 选择小区
    chooseItem (item, index) {
      this.selectIndex = index
      this.searchdata = item.mix_name
      this.setCommissionData({ data: item, key: "village" })
      this.toolsGoPageBack();
    },
    // 搜索小区
    searchVillage () {
      this.handleEventDebounce(() => {
        this.listdata = []
        this.pageData.page = 0 //页码 默认1
        this.pageData.page_size = 20 //
        if (this.$commonUtils.utilCore.empty(this.searchdata)) {
          return;
        }
        this.$nextTick(() => {
          this.getList();
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
    // 清空搜索(当城市改变调的函数)
    emptySearch () {
      this.listdata = []
      this.searchdata = ''
      this.pageData.page = 0 //页码 默认1
      this.pageData.page_size = 20 //
      // this.$nextTick(() => {
      //   this.getList();
      // });
    },
    //返回上一层
    onClickBack () {
      this.toolsGoPageBack();
    },
  }

}
</script>

<style lang="scss" scoped>
.villagechoose {
  .nav-left {
    img {
      width: 0.4rem;
      height: 0.36rem;
      display: block;
    }
  }

  .wrapper {
    .nav-container {
      position: fixed;
      background: #f9f9f9;
      padding: 0.28rem 0;
      z-index: 1;

      .ipt-container-wt {
        position: relative;
        margin: 0 0.36rem 0.24rem 0.4rem;
        box-shadow: 0rem 0.02rem 0.2rem 0rem rgba(209, 209, 209, 0.5);

        .formstyle {
          width: 100%;
          height: 100%;
        }

        .ipt-box {
          width: 6.74rem;
          height: 1rem;
          font-size: 0.32rem;
          background: #ffffff;
          color: #000000;
          box-sizing: border-box;
          font-weight: bold;
          border-radius: 0.1rem;
          border: 0.01rem solid #cecece;
          padding-left: 0.76rem;
          padding-right: 3.6rem;
          display: block;
        }

        .icon-magnifier {
          width: 0.28rem;
          height: 0.28rem;
          position: absolute;
          top: 0.35rem;
          left: 0.36rem;
        }

        .icon-close {
          position: absolute;
          top: 0.34rem;
          left: 3.2rem;

          img {
            width: 0.32rem;
            height: 0.32rem;
            display: block;
          }
        }

        .ipt-item {
          font-size: 0.28rem;
          font-weight: bold;
          color: #333333;
          display: flex;
          align-items: center;
          position: absolute;
          top: 0.2rem;
          right: 0;

          input {
            width: 0.6rem;
            height: 0.5rem;
            font-size: 0.28rem;
            font-weight: bold;
            color: #000000;
            background: #ffffff;
            border-radius: 0.1rem;
            border: 0.01rem solid #a1a1a1;
            text-align: center;
            display: block;
          }

          span {
            padding-left: 0.1rem;
            padding-right: 0.18rem;
          }
        }
      }
    }

    .search-list {
      padding-top: 2rem;

      .list-item {
        padding: 0.32rem 0.46rem 0.32rem 0.3rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 0.02rem solid #f1f1f1;

        .item-left {
          font-weight: 400;
          color: #000000;

          .house {
            font-size: 0.3rem;
            padding-bottom: 0.1rem;
            padding-left: 0.16rem;
          }

          .address {
            font-size: 0.24rem;
          }
        }

        .item-right {
          img {
            width: 0.3rem;
            height: 0.3rem;
            display: block;
          }
        }
      }
    }
  }
}</style>
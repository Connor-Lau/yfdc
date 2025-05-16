<template>
  <div>
    <gni-nav-bar @onClickLeft="onClickBack" :pageTitle="headTitle" :hideRight="false"></gni-nav-bar>
    <!-- 房源详情 -->
    <div class="detailBox mx-5">
      <div class="detailSubTitle">
        <div class="title">基础信息：</div>
      </div>
      <div class="extends flex flex-row flex-wrap">
        <div class="itemCell">
          <div class="label">1. 房源户型：</div>
          <div class="desc">{{detailData.layout_short_name || "--"}}</div>
        </div>
        <div class="itemCell">
          <div class="label">2. 建筑面积：</div>
          <div class="desc">{{detailData.acreage_cover_name || "--"}}</div>
        </div>
        <div class="itemCell">
          <div class="label">3. 套内面积：</div>
          <div class="desc">{{detailData.acreage_inner_name || "--"}}</div>
        </div>
        <div class="itemCell">
          <div class="label">4. 户型结构：</div>
          <div class="desc">{{detailData.house_structure_name || "--"}}</div>
        </div>
        <!-- <div class="itemCell">
          <div class="label">5.梯户比例:</div>
          <div class="desc">{{detailData.lift_house_rate_name || "--"}}</div>
        </div> -->
        <div class="itemCell">
          <div class="label">5. 供暖方式：</div>
          <div class="desc">{{detailData.supply_heat_name || "--"}}</div>
        </div>
        <div class="itemCell">
          <div class="label">6. 产权年限：</div>
          <div class="desc">{{detailData.property_year_name || "--"}}</div>
        </div>
        <div class="itemCell">
          <div class="label">7. 房源编号：</div>
          <div class="desc">{{detailData.house_number || "--"}}</div>
        </div>
      </div>
    </div>
    <div class="detailHr"></div>
    <div class="detailBox mx-5">
      <div class="detailSubTitle">
        <div class="title">交易属性：</div>
      </div>
      <div class="extends flex flex-row flex-wrap">
        <div class="itemCell">
          <div class="label">1. 挂牌时间：</div>
          <div class="desc">{{detailData.register_time_name || "--"}}</div>
        </div>
        <div class="itemCell">
          <div class="label">2. 交易权属：</div>
          <div class="desc">{{detailData.ownership_name || "--"}}</div>
        </div>
        <div class="itemCell">
          <div class="label">3. 房屋用途：</div>
          <div class="desc">{{detailData.purpose_name || "--"}}</div>
        </div>
        <div class="itemCell">
          <div class="label">4. 房屋年限：</div>
          <div class="desc">{{detailData.house_year_name}}</div>
        </div>
        <div class="itemCell">
          <div class="label">5. 产权所属：</div>
          <div class="desc">{{detailData.is_together_own_name || "--"}}</div>
        </div>
        <!-- 2022/9/1 小林说删除 -->
        <!-- <div class="itemCell">
          <div class="label">6. 两证一书：</div>
          <div class="desc">{{detailData.upload_certificate_flag_name || "--"}}</div>
        </div>
        <div class="itemCell">
          <div class="label">7. 抵押信息：</div>
          <div class="desc">{{detailData.mortgage_flag_name || "--"}}</div>
        </div> -->
      </div>
    </div>
    <!-- 房屋交易政策为广州才显示 -->
    <div class="detailHr" v-show="detailData.site_id == '8'"></div>
    <div class="detailBox mx-5" v-show="detailData.site_id == '8'">
      <div class="detailSubTitle">
        <div class="title">房屋交易政策：</div>
      </div>
      <div class="extends flex flex-row flex-wrap">
        <div class="itemCell">
          <div class="label">政策：</div>
          <div class="desc flex items-center justify-between" style="color:#016CFF;" @click="openPriceLimitUrl('http://zfcj.gz.gov.cn/xysj/xzzx/qtl/')">广州市房屋交易政策指引告知书<img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt=""></div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import { mapState } from "vuex";
export default {
  components: {
    gniNavBar,
  },
  data () {
    return {
      headTitle: '房源信息',
      detailData: {}
    }
  },
  computed: {
    ...mapState("home", ["saleDeatialInfo"]),
  },
  created () {
    if (JSON.stringify(this.saleDeatialInfo) !== '{}') {
      this.detailData = this.saleDeatialInfo;
    }
  },
  beforeDestroy () {
    this.$store.commit('home/setSaleDeatialInfo', {});
  },
  methods: {
    onClickBack () {
      this.$router.go(-1);
    },
    // 打开政府指导价格链接
    openPriceLimitUrl (url) {
      if (!url) return this.$commonUtils.utilCore.showToast("链接不存在");
      if (this.$commonUtils.utilCore.isAppPlus()) {
        plus.runtime.openURL(url);
      } else {
        window.open(url);
      }
    },
  },
}
</script>
<style lang="scss" >
.detailBox {
  display: flex;
  flex-direction: column;
  .detailSubTitle {
    margin: 0.4rem 0 0.3rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 0.36rem;
      color: #333333;
      line-height: 1.5em;
    }
  }
  .extends {
    .label {
      flex: none;
      font-size: 0.28rem;
      color: #999999;
      line-height: 0.6rem;
      width: auto;
    }

    .desc {
      flex: auto;
      font-size: 0.28rem;
      color: #000;
    }

    .itemCell {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      img {
        width: 0.4rem;
        height: 0.4rem;
      }
    }
  }
}
.detailHr {
  height: 0.02rem;
  background-color: #eee;
  margin: 0.3rem 0.62rem 0.1rem 0.38rem;
}
</style>

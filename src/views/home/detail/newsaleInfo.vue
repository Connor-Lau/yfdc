<template>
  <div>
    <gni-nav-bar @onClickLeft="onClickBack" :pageTitle="headTitle" :hideRight="false"></gni-nav-bar>
    <!-- 房源详情 -->
    <div class="detailBox mb-2">
      <div class="detailSubTitle">
        <div class="title">基础信息</div>
      </div>
      <div class="detailIntro">
        <div class="extends2 ">
          <div class="itemCell">
            <div class="label">楼盘特色:</div>
            <div class="desc-flex" v-if="detailData.loupan_features">
              <div class="desc-item" v-for="(item,index) in detailData.loupan_features" :key="index">{{item.loupan_feature_name || "--"}}</div>
            </div>
            <div class="desc" v-else>--</div>
          </div>
          <div class="itemCell">
            <div class="label">楼盘状态:</div>
            <div class="desc">{{detailData.sell_status_name || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">物业类型:</div>
            <div class="desc">{{detailData.property_type_name || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">参考均价:</div>
            <div class="desc">{{detailData.average_price_name || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">参考总价:</div>
            <div class="desc">{{detailData.price_name || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">楼盘户型:</div>
            <div class="desc">{{detailData.layout_rooms_name || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">楼盘面积:</div>
            <div class="desc">{{detailData.acreage_name || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">最新开盘:</div>
            <div class="desc">{{detailData.open_time_name || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">交房时间:</div>
            <div class="desc">{{extendData.give_time_name || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">区域位置:</div>
            <div class="desc">{{detailData.district_name || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">楼盘地址:</div>
            <div class="desc">{{extendData.loupan_address || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">售楼处地址:</div>
            <div class="desc">{{extendData.sale_address || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">开发商:</div>
            <div class="desc">{{detailData.developer_name || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">联系电话:</div>
            <div class="desc" style="color:#e38a35">{{detailData.telephone || "--"}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="split-line"></div>
    <div class="detailBox mb-2">
      <div class="detailSubTitle">
        <div class="title">规划信息</div>
      </div>
      <div class="detailIntro flex flex-row">
        <div class="extends2 flex flex-row flex-wrap">
          <div class="itemCell">
            <div class="label">建筑类型:</div>
            <div class="desc">{{detailData.building_type_name || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">占地面积:</div>
            <div class="desc">{{extendData.acreage_land_name || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">建筑面积:</div>
            <div class="desc">{{extendData.acreage_building_name || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">绿化率:</div>
            <div class="desc">{{extendData.green_rate_name}}</div>
          </div>
          <div class="itemCell">
            <div class="label">容积率:</div>
            <div class="desc">{{extendData.plot_rate_name || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">规划户数:</div>
            <div class="desc">{{extendData.house_num_name || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">产权年限:</div>
            <div class="desc">{{extendData.property_year_name || "--"}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="split-line"></div>
    <div class="detailBox mb-2">
      <div class="detailSubTitle">
        <div class="title">配套信息</div>
      </div>
      <div class="detailIntro flex flex-row">
        <div class="extends2 flex flex-row flex-wrap">
          <div class="itemCell">
            <div class="label">物业公司:</div>
            <div class="desc">{{extendData.property_company_name || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">物业费类型:</div>
            <div class="desc">{{extendData.property_fee_type_name || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">物业费:</div>
            <div class="desc">{{extendData.property_fee_name || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">车位配比:</div>
            <div class="desc">{{extendData.car_place_rate}}</div>
          </div>
          <div class="itemCell">
            <div class="label">车位数:</div>
            <div class="desc">{{extendData.car_place_number || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">供暖方式:</div>
            <div class="desc">{{extendData.supply_heat_name || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">供水方式:</div>
            <div class="desc">{{extendData.supply_water_name || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">供电方式:</div>
            <div class="desc">{{extendData.supply_electric_name || "--"}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="split-line"></div>
    <div class="detailBox mb-2">
      <div class="detailSubTitle">
        <div class="title">周边规划</div>
      </div>
      <div class="detailIntro flex flex-row">
        <div class="extends2 flex flex-row flex-wrap">
          <div class="itemCell">
            <div class="label">地铁:</div>
            <div class="desc">{{extendData.metro || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">教育设施:</div>
            <div class="desc">{{extendData.education || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">医院:</div>
            <div class="desc">{{extendData.hospital || "--"}}</div>
          </div>
          <div class="itemCell">
            <div class="label">购物:</div>
            <div class="desc">{{extendData.shopping}}</div>
          </div>
          <div class="itemCell">
            <div class="label">公园:</div>
            <div class="desc">{{extendData.park || "--"}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="split-line"></div>
    <div class="detailBox">
      <div class="detailSubTitle">
        <div class="title">开盘信息</div>
      </div>
    </div>
    <div class="split-line"></div>
    <div class="detailBox ">
      <div class="detailSubTitle">
        <div class="title">预售许可证</div>
      </div>
    </div>
    <div class="tips">本网站所载各种交易信息和数据仅供参考，不构成任何投资建议；本网站不对交易数据的准确性作为承诺，也不对任何错误负任何法律责任。所有合同均以最终签约为准。</div>
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
      detailData: {},
      extendData: {},
    }
  },
  computed: {
    ...mapState("home", ["newsaleInfo"]), //城市的信息
  },
  mounted () {
    window.scroll(0, 0);
    this.detailData = this.newsaleInfo.data
    this.extendData = this.newsaleInfo.extend
  },
  beforeDestroy () {
    this.$store.commit('home/changeNewsaleInfo', {});
  },
  methods: {
    onClickBack () {
      this.$router.go(-1);
    }
  },
}
</script>
<style lang="scss" >
.detailBox {
  display: flex;
  flex-direction: column;
  .detailSubTitle {
    margin: 0.3rem;
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
  .detailIntro {
    margin: 0 0.3rem;
  }
  .extends2 {
    .label {
      flex: none;
      font-size: 0.28rem;
      color: #a7a7a7;
      // line-height: 0.6rem;
      width: auto;
      margin-right: 0.2rem;
      white-space: nowrap;
    }

    .desc {
      flex: auto;
      font-size: 0.28rem;
      color: #333333;
      line-height: 0.4rem;
    }
    .desc-flex {
      display: flex;
      .desc-item {
        font-size: 0.2rem;
        color: #e38a35;
        padding: 0.03rem;
        border-radius: 0.04rem;
        border: 0.02rem solid #e38a35;
        margin-right: 0.05rem;
      }
    }
    .itemCell {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: baseline;
      padding-bottom: 0.3rem;
    }
  }
}
.split-line {
  height: 0.24rem;
  background: #f9f9f9;
}
.tips {
  padding: 0.24rem 0.3rem 0.5rem;
  font-size: 0.27rem;
  color: #6c6c6c;
  line-height: 1.5em;
  background: #f9f9f9;
}
</style>

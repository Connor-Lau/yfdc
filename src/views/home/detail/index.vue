<template>
  <div class="detail">
    <gni-nav-bar @onClickLeft="onClickBack" :pageTitle="headTitle" :hideRight="false">
      <template slot="slot-right">
        <div class="nav-right">
          <div class="icon-chat">
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_chat.png'" alt="">
            <div class="tips-chat">99+</div>
          </div>
          <div class="icon-share" @click="isShare=true">
            <img :src="$appConfig.appWebStaticUrl + '/user/icon_share.png'" alt="">
          </div>
        </div>
      </template>
    </gni-nav-bar>
    <div class="wrapper">
      <div class="swipe">
        <van-swipe style="height: 5.2rem;">
          <van-swipe-item>
            <img :src="$appConfig.appWebStaticUrl + '/home/home_bg02.png'" alt="">
          </van-swipe-item>
          <van-swipe-item>
            <img :src="$appConfig.appWebStaticUrl + '/home/home_bg01.png'" alt="">
          </van-swipe-item>
          <van-swipe-item>3</van-swipe-item>
          <van-swipe-item>4</van-swipe-item>
          <template #indicator>
            <div class="custom-indicator">1/4</div>
          </template>
        </van-swipe>
        <div class="swipe-tab">
          <span v-for="(item,index) in swiperTab" :key="index" @click="swiperIndex = index" :class="swiperIndex == index ? 'swipe-active' : ''">{{item.text}}</span>
        </div>
      </div>
      <div class="house-detail">
        <div class="label">
          <div class="label-left">
            <span>满五年</span>
            <span>VR看房</span>
            <span>新上房源</span>
          </div>
          <div class="label-right" @click="isCollection = !isCollection">
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_collection.png'" alt="" v-if="isCollection">
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_uncollection.png'" alt="" v-else>
            <span v-if="isCollection">关注</span>
            <span v-else>取消关注</span>
          </div>
        </div>
        <div class="title">深航御花园机组线双地铁配套齐全精装保养南向望花园</div>
        <div class="title-information">
          <div class="title-item title-line">
            <div class="item-top">282 万</div>
            <div class="item-bottom">售价</div>
          </div>
          <div class="title-item title-line">
            <div class="item-top">4室2厅</div>
            <div class="item-bottom">房型</div>
          </div>
          <div class="title-item">
            <div class="item-top">119.26㎡</div>
            <div class="item-bottom">建筑面积</div>
          </div>
        </div>
        <div class="tips-box">
          <div class="tips-text">裕丰地产收费全透明，房屋买卖中介费各付成交价0.69%（若低于6000元，按6000元计收）。私下交易风险高，为保障您的财产安全，请勿与经纪人私下交易。如有疑问请联系客服。</div>
          <div class="contact-btn">联系客服</div>
        </div>
        <div class="reference">
          <div class="reference-item" style="paddingBottom:0.26rem">
            本套房源的参考总价：<span>2823万</span>
          </div>
          <div class="reference-item">
            本小区政府参考单价：<span>76922元/㎡</span>
            <span class="check-detail">（查看详情）</span>
          </div>
          <img :src="$appConfig.appWebStaticUrl + '/home/price_bg.png'" alt="">
        </div>
        <div class="specific-information">
          <div class="specific-box">
            <div class="box-item box-item-left">
              单价：<span>12723元/㎡</span>
            </div>
            <div class="box-item">
              朝向：<span>南 北</span>
            </div>
          </div>
          <div class="specific-box">
            <div class="box-item box-item-left">
              楼层：<span>中楼层</span>
            </div>
            <div class="box-item">
              电梯：<span>有电梯</span>
            </div>
          </div>
          <div class="specific-box">
            <div class="box-item box-item-left">
              梯户：<span>一梯两户</span>
            </div>
            <div class="box-item">
              装修：<span>精装修</span>
            </div>
          </div>
          <div class="specific-box">
            <div class="box-item box-item-left">
              楼型：<span>塔楼</span>
            </div>
            <div class="box-item">
              产权：<span>70年</span>
            </div>
          </div>
          <div class="specific-cell">
            <div class="cell-left">
              小区：<span>侨怡花园</span>
            </div>
            <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
          </div>
          <div class="specific-cell">
            <div class="cell-left">
              政策：<span>广州市房屋交易政策指引告知书</span>
            </div>
            <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
          </div>
          <div class="specific-cell">
            <div class="cell-left">
              费率：<span>查看服务收费标准</span>
            </div>
            <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
          </div>
          <div class="more-information">
            更多楼盘信息
            <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
          </div>
        </div>
        <div class="split-line"></div>
        <div class="appointment-key">
          <div class="appointment-key-left">
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_appointment.png'" alt="">
            <span>钥匙房源 随时看房</span>
          </div>
          <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
        </div>
        <div class="split-line"></div>
        <div class="periphery-map">
          <div class="title">
            <div class="left">周边配套及通勤</div>
            <div class="right">
              <span>查看更多</span>
              <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow.png'" alt="">
            </div>
          </div>
          <div class="school-information">
            学校信息：<span>咨询经纪人中小学情况</span>
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_consulting.png'" alt="">
          </div>
          <div class="map-container">地图</div>
          <div class="periphery-around">
            <div class="periphery-title">
              <div class="periphery-title-item" v-for="(item,index) in around" :key="index" @click="aroundIndex = index" :class="aroundIndex == index ? 'around-active' : ''">
                {{item}}
                <img :src="$appConfig.appWebStaticUrl + '/home/icon_line.png'" alt="" v-show="aroundIndex == index">
              </div>
            </div>
            <div class="periphery-in" v-show="aroundIndex == 2">
              <div class="periphery-in-item" v-for="(item,index) in vehicle" :key="index" @click="vehicleIndex = index" :class="vehicleIndex == index?'vehicle-active':''">{{item}}</div>
            </div>
            <div class="periphery-in-detail">
              <div class="detail-item" v-for="(item,index) in peripheryDetail" :key="index">
                <img :src="$appConfig.appWebStaticUrl + '/home/icon_bus.png'" alt="">
                <!-- <img :src="$appConfig.appWebStaticUrl + '/home/icon_subway.png'" alt=""> -->
                <div class="address">{{item.address}}</div>
                <div class="distance">直线 {{item.distance}}km</div>
              </div>
            </div>
          </div>
        </div>
        <div class="split-line"></div>
        <div class="recommend">
          <div class="recommend-title">推荐经纪人</div>
          <div class="recommend-broker">
            <div class="borker-container">
              <div class="broker-header">
                <img :src="$appConfig.appWebStaticUrl + '/common/icon_avatar.png'" alt="">
              </div>
              <div class="broker-name">
                <div class="name">陈丽君</div>
                <div class="name-label">房源熟悉度:</div>
              </div>
              <div class="broker-progress">
                <van-progress :percentage="20" stroke-width="0.2rem" :track-color="'#EFEFEF'" />
              </div>
              <div class=" contact-btn">
                <div class="btn-chat">
                  <img :src="$appConfig.appWebStaticUrl + '/home/icon_chating.png'" alt="">
                </div>
                <div class="btn-chat">
                  <img :src="$appConfig.appWebStaticUrl + '/home/icon_phoneing.png'" alt="">
                </div>
              </div>
            </div>
            <div class="borker-container">
              <div class="broker-header">
                <img :src="$appConfig.appWebStaticUrl + '/common/icon_avatar.png'" alt="">
              </div>
              <div class="broker-name">
                <div class="name">陈丽君</div>
                <div class="name-label">房源熟悉度:</div>
              </div>
              <div class="broker-progress">
                <van-progress :percentage="10" stroke-width="0.2rem" :track-color="'#EFEFEF'" />
              </div>
              <div class="contact-btn">
                <div class="btn-chat">
                  <img :src="$appConfig.appWebStaticUrl + '/home/icon_chating.png'" alt="">
                </div>
                <div class="btn-chat">
                  <img :src="$appConfig.appWebStaticUrl + '/home/icon_phoneing.png'" alt="">
                </div>
              </div>
            </div>
            <div class="borker-container">
              <div class="broker-header">
                <img :src="$appConfig.appWebStaticUrl + '/common/icon_avatar.png'" alt="">
              </div>
              <div class="broker-name">
                <div class="name">陈丽君</div>
                <div class="name-label">房源熟悉度:</div>
              </div>
              <div class="broker-progress">
                <van-progress :percentage="100" stroke-width="0.2rem" :track-color="'#EFEFEF'" />
              </div>
              <div class="contact-btn">
                <div class="btn-chat">
                  <img :src="$appConfig.appWebStaticUrl + '/home/icon_chating.png'" alt="">
                </div>
                <div class="btn-chat">
                  <img :src="$appConfig.appWebStaticUrl + '/home/icon_phoneing.png'" alt="">
                </div>
              </div>
            </div>
            <div class="room-card">
              <div class="card-title">
                <div class="card-title-left">
                  <div class="left-title">我的找房卡</div>
                  <div class="left-like">猜您喜欢：越秀区·4室·200~300万</div>
                </div>
                <div class="card-title-right">
                  一键生成
                  <img :src="$appConfig.appWebStaticUrl + '/common/icon/icon_rightArrow02.png'" alt="">
                </div>
              </div>
              <div class="card-label">
                <div class="card-label-item">
                  <img :src="$appConfig.appWebStaticUrl + '/home/icon_service.png'" alt="">
                  <div class="label-item-text">
                    <div class="top">在线高效咨询</div>
                    <div class="bottom">找房条件一键发送</div>
                  </div>
                </div>
                <div class="card-label-item card-label-item-second">
                  <img :src="$appConfig.appWebStaticUrl + '/home/icon_notice.png'" alt="">
                  <div class="label-item-text">
                    <div class="top">新上房源提醒</div>
                    <div class="bottom">新消息及时通知</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="split-line"></div>
        <div class="recommended-house">
          <div class="recommended-title">推荐二手房</div>
          <houselistItem :list="houselist"></houselistItem>
          <div class="morehouse-btn">更多二手房</div>
        </div>
        <div class="split-line"></div>
        <div class="recommended-house">
          <div class="recommended-title">推荐新房</div>
          <houselistItem :list="houselist" :isDetail="true"></houselistItem>
          <div class="morehouse-btn">更多新房</div>
        </div>
      </div>
    </div>
    <div class="footer-broker">
      <div class="footer-left">
        <img :src="$appConfig.appWebStaticUrl + '/common/icon_broker.png'" alt="">
        <div>
          <div class="footer-name">
            <div class="name">肖春红</div>
            <div class="label">经纪人</div>
          </div>
        </div>
      </div>
      <div class="footer-right">
        <div class="btn-question">在线问</div>
        <div class="btn-phone">打电话</div>
      </div>
    </div>
    <van-popup v-model="isShare" position="bottom" :round="true" teleport="body" :close-on-click-overlay="false">
      <div class="share-pop">
        <div class="title">分享房源</div>
        <div class="content">
          <div class="content-item">
            <img :src="$appConfig.appWebStaticUrl + '/common/icon_wechat.png'" alt="">
            <span>微信</span>
          </div>
          <div class="content-item">
            <img :src="$appConfig.appWebStaticUrl + '/common/icon_wechatmoments.png'" alt="">
            <span>朋友圈</span>
          </div>
          <div class="content-item">
            <img :src="$appConfig.appWebStaticUrl + '/common/icon_broker.png'" alt="">
            <span>经纪人</span>
          </div>
        </div>
        <div class="cancel" @click="isShare=false">取消</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
import houselistItem from "@/components/yni/houselistItem.vue"
import newhouselistItem from "@/components/yni/newhouselistItem.vue"
export default {
  components: {
    gniNavBar,
    houselistItem,
    newhouselistItem
  },
  data () {
    return {
      headTitle: '深航御龙四季花园之星深航御龙四季花园之星',
      isShare: false, // 分享弹窗
      isCollection: true, // 收藏
      swiperTab: [
        {
          text: 'VR'
        },
        {
          text: '图片'
        },
        {
          text: '户型'
        }
      ],
      swiperIndex: 0, // 轮播图的类型切换 VR等等
      around: ["教育", "医院", "交通", "生活", "休闲"], // 周边地方
      vehicle: ["地铁", "公交"],  // 交通工具
      peripheryDetail: [
        {
          address: '公园前西门口总站（26路；12路）',
          distance: '0.2'
        },
        {
          address: '公园前山前路（305路；720路wwwww',
          distance: '0.3'
        },
        {
          address: '中山五路（105路；20路；203路陆流',
          distance: '0.5'
        },
      ],
      aroundIndex: 2, // 周边下标
      vehicleIndex: 0, //交通下标
      houselist: [
        {
          id: 1,
          title: '丽江花丽江花园华林居 3室1厅',
          subtitle: '越秀区/3室1厅/105.11㎡/西北',
          label: [
            {
              text: '精装修',
            },
            {
              text: '期房在售',
            }
          ],
          left: '228',
          right: '51613元/㎡'
        },
        {
          id: 2,
          title: '丽江花丽江花园华林居 3室1厅',
          subtitle: '越秀区/3室1厅/105.11㎡/西北',
          label: [
            {
              text: '精装修',
            },
            {
              text: '期房在售',
            }
          ],
          left: '228',
          right: '51613元/㎡'
        },
        {
          id: 3,
          title: '丽江花丽江 3室1厅',
          subtitle: '越秀区/3室1厅/105.11㎡/西北',
          label: [
            {
              text: '精装修',
            },
            {
              text: '期房在售',
            }
          ],
          left: '228',
          right: '51613元/㎡'
        },
        {
          id: 3,
          title: '丽江花丽江 3室1厅',
          subtitle: '越秀区/3室1厅/105.11㎡/西北',
          label: [
            {
              text: '精装修',
            },
            {
              text: '期房在售',
            }
          ],
          left: '228',
          right: '51613元/㎡'
        }
      ],
    }
  },
  methods: {
    onClickBack () {
      this.$router.go(-1);
    }
  }
}
</script>

<style lang="scss" scoped>
.detail {
  padding-bottom: 1.58rem;
  .nav-right {
    display: flex;
    align-items: center;
    .icon-chat {
      padding-right: 0.42rem;
      position: relative;
      img {
        width: 0.44rem;
        height: 0.44rem;
        display: block;
      }
      .tips-chat {
        background: #f95640;
        border-radius: 0.14rem;
        font-size: 0.22rem;
        font-weight: 400;
        color: #ffffff;
        padding: 0.03rem;
        position: absolute;
        top: 0;
        top: -0.16rem;
        right: 0.2rem;
        line-height: 0.3rem;
      }
    }
    .icon-share {
      img {
        width: 0.44rem;
        height: 0.44rem;
        display: block;
      }
    }
  }
  .wrapper {
    .swipe {
      position: relative;
      .custom-indicator {
        font-size: 0.26rem;
        font-weight: 400;
        color: #ffffff;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 0.21rem;
        position: absolute;
        right: 0.26rem;
        bottom: 0.36rem;
        padding: 0.08rem 0.26rem;
      }
      .swipe-tab {
        width: 2.78rem;
        height: 0.44rem;
        font-size: 0.22rem;
        font-weight: 500;
        line-height: 0.44rem;
        color: #000000;
        background: #ffffff;
        border-radius: 0.22rem;
        opacity: 0.7;
        position: absolute;
        bottom: 0.36rem;
        left: 2.36rem;
        display: flex;
        justify-content: space-between;
        span {
          width: 0.76rem;
          height: 100%;
          text-align: center;

          border-radius: 0.22rem;
        }
      }
      /deep/ .van-swipe-item {
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .house-detail {
      .label {
        padding: 0.3rem 0.42rem 0.2rem 0.48rem;
        display: flex;
        justify-content: space-between;
        .label-left {
          display: flex;
          align-items: center;
          span {
            font-size: 0.2rem;
            font-weight: 400;
            color: #617f9d;
            background: #f6f6f6;
            padding: 0.06rem 0.1rem;
            margin-right: 0.1rem;
          }
        }
        .label-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          img {
            width: 0.34rem;
            height: 0.32rem;
          }
          span {
            font-size: 0.2rem;
            font-weight: bold;
            color: #4a4a4a;
            padding-top: 0.06rem;
          }
        }
      }
      .title {
        font-size: 0.4rem;
        font-weight: bold;
        color: #303030;
        line-height: 0.52rem;
        padding: 0 1.3rem 0.4rem 0.46rem;
      }
      .title-information {
        padding: 0 0.56rem 0.44rem 0.5rem;
        display: flex;
        justify-content: space-between;
        .title-item {
          position: relative;
          .item-top {
            font-size: 0.36rem;
            font-weight: bold;
            color: #ff3100;
            padding-bottom: 0.12rem;
          }
          .item-bottom {
            font-size: 0.24rem;
            font-weight: 400;
            color: #999999;
          }
        }
        .title-line {
          &::after {
            content: "";
            display: block;
            width: 0.02rem;
            height: 0.7rem;
            background: #f0f0f0;
            position: absolute;
            top: 0.06rem;
            right: -0.92rem;
          }
        }
      }
      .tips-box {
        padding: 0 0.42rem 0.24rem 0.4rem;
        .tips-text {
          font-size: 0.24rem;
          font-weight: 400;
          color: #ff1000;
          line-height: 0.36rem;
          padding-bottom: 0.12rem;
        }
        .contact-btn {
          font-size: 0.24rem;
          font-weight: 400;
          color: #2087fb;
        }
      }
      .reference {
        background: #fffbe7;
        border-radius: 0.12rem;
        padding: 0.34rem 0 0.32rem 0.18rem;
        margin: 0 0.3rem 0.46rem 0.3rem;
        position: relative;
        .reference-item {
          font-size: 0.24rem;
          font-weight: 400;
          color: #000000;
          span {
            font-size: 0.24rem;
            font-weight: bold;
            color: #ff3100;
          }
          .check-detail {
            font-size: 0.24rem;
            font-weight: 400;
            color: #016cff;
          }
        }
        img {
          width: 1.4rem;
          height: 1.3rem;
          position: absolute;
          right: 0;
          top: 0.2rem;
        }
      }
      .specific-information {
        padding: 0 0.52rem 0.4rem 0.5rem;
        .specific-box {
          display: flex;
          padding-bottom: 0.32rem;
          .box-item-left {
            width: 55% !important;
          }
          .box-item {
            width: 50%;
            font-size: 0.28rem;
            font-weight: 400;
            color: #999999;
            span {
              color: #000000;
            }
          }
        }
        .specific-cell {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.32rem;
          .cell-left {
            font-size: 0.28rem;
            font-weight: 400;
            color: #999999;
            span {
              color: #016cff;
            }
          }
          img {
            width: 0.4rem;
            height: 0.4rem;
          }
        }
        .more-information {
          font-size: 0.28rem;
          font-weight: 400;
          color: #8d8d8d;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 0.24rem;
          img {
            width: 0.4rem;
            height: 0.4rem;
          }
        }
      }
      .appointment-key {
        padding: 0.36rem 0.52rem 0.36rem 0.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .appointment-key-left {
          display: flex;
          align-items: center;
          img {
            width: 0.72rem;
            height: 0.48rem;
          }
          span {
            font-size: 0.28rem;
            font-weight: 400;
            color: #000000;
            padding-left: 0.08rem;
          }
        }
        img {
          width: 0.4rem;
          height: 0.4rem;
        }
      }
      .periphery-map {
        .title {
          padding: 0.4rem 0.5rem 0.46rem 0.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .left {
            font-size: 0.4rem;
            font-weight: bold;
            color: #303030;
          }
          .right {
            display: flex;
            align-items: center;
            span {
              font-size: 0.26rem;
              font-weight: 400;
              color: #8d8d8d;
            }
            img {
              width: 0.4rem;
              height: 0.4rem;
            }
          }
        }
        .school-information {
          font-size: 0.28rem;
          font-weight: 400;
          color: #999999;
          padding-left: 0.5rem;
          padding-bottom: 0.4rem;
          display: flex;
          align-items: center;
          span {
            color: #016cff;
            padding-right: 0.1rem;
          }
          img {
            width: 0.32rem;
            height: 0.32rem;
          }
        }
        .map-container {
          height: 3.28rem;
          background-color: red;
        }
        .periphery-around {
          .periphery-title {
            padding: 0.4rem 0.8rem 0.44rem 0.82rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .periphery-title-item {
              font-size: 0.32rem;
              font-family: SourceHanSansCN-Normal, SourceHanSansCN;
              font-weight: 400;
              color: #000000;
              position: relative;
              img {
                width: 0.52rem;
                height: 0.15rem;
                position: absolute;
                bottom: -0.1rem;
                left: 0.04rem;
              }
            }
          }
          .periphery-in {
            padding: 0 0 0.4rem 0.64rem;
            display: flex;
            align-items: center;
            .periphery-in-item {
              font-size: 0.24rem;
              font-weight: 400;
              color: #000000;
              background: #ebebeb;
              border-radius: 0.22rem;
              padding: 0.1rem 0.26rem;
              margin-right: 0.4rem;
            }
          }
          .periphery-in-detail {
            padding: 0 0.46rem 0.32rem 0.48rem;
            .detail-item {
              padding-bottom: 0.28rem;
              display: flex;
              align-items: center;
              img {
                width: 0.24rem;
                height: 0.27rem;
              }
              .address {
                width: 4.24rem;
                font-size: 0.28rem;
                font-weight: 400;
                color: #000000;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding-right: 0.32rem;
                padding-left: 0.12rem;
              }
              .distance {
                font-size: 0.28rem;
                font-weight: 400;
                color: #888888;
              }
            }
          }
        }
      }
      .recommend {
        padding: 0.6rem 0.5rem;
        .recommend-title {
          font-size: 0.4rem;
          font-weight: bold;
          color: #303030;
          padding-bottom: 0.5rem;
        }
        .recommend-broker {
          .borker-container {
            display: flex;
            align-items: center;
            padding-bottom: 0.4rem;
            .broker-header {
              padding-right: 0.26rem;
              img {
                width: 0.8rem;
                height: 0.8rem;
                display: block;
              }
            }
            .broker-name {
              white-space: nowrap;
              .name {
                font-size: 0.32rem;
                font-weight: bold;
                color: #303030;
              }
              .name-label {
                font-size: 0.22rem;
                font-weight: 400;
                color: #888888;
              }
            }
            .broker-progress {
              padding-right: 0.44rem;
              padding-left: 0.14rem;
              width: 1.5rem;
              /deep/ .van-progress__portion {
                background: linear-gradient(90deg, #fdd20c 0%, #ff621d 100%);
                .van-progress__pivot {
                  width: 0.56rem;
                  height: 0.56rem;
                  font-size: 0.2rem;
                  font-weight: 400;
                  color: #000000;
                  text-align: center;
                  line-height: 0.56rem;
                  background: #ffffff;
                  border: 0.02rem solid #ff611b;
                  border-radius: 50%;
                  box-sizing: content-box;
                  min-width: 0;
                  padding: 0;
                }
              }
            }
            .contact-btn {
              display: flex;
              .btn-chat {
                padding-right: 0.42rem;
                img {
                  width: 0.78rem;
                  height: 0.76rem;
                  display: block;
                }
                &:nth-last-of-type(1) {
                  padding: 0;
                }
              }
            }
          }
        }
        .room-card {
          background: linear-gradient(360deg, #fffaef 0%, #ffffff 100%);
          box-shadow: 0rem 0rem 0.12rem 0rem rgba(213, 213, 213, 0.5);
          border-radius: 0.08rem;
          padding-top: 0.44rem;
          padding-bottom: 0.5rem;
          margin-top: 0.3rem;
          .card-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 0.3rem 0.66rem 0.5rem;
            .card-title-left {
              .left-title {
                font-size: 0.36rem;
                font-weight: bold;
                color: #303030;
                padding-bottom: 0.16rem;
              }
              .left-like {
                font-size: 0.24rem;
                font-weight: 400;
                color: #000000;
              }
            }
            .card-title-right {
              font-size: 0.26rem;
              font-weight: bold;
              color: #016cff;
              display: flex;
              align-items: center;
              img {
                width: 0.15rem;
                height: 0.2rem;
                padding-left: 0.1rem;
              }
            }
          }
          .card-label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-left: 0.52rem;
            padding-right: 0.6rem;
            .card-label-item {
              display: flex;
              align-items: center;
              img {
                width: 0.52rem;
                height: 0.52rem;
              }
              .label-item-text {
                padding-left: 0.22rem;
                .top {
                  font-size: 0.24rem;
                  font-weight: bold;
                  color: #000000;
                  font-family: SourceHanSansCN-Bold, SourceHanSansCN;
                }
                .bottom {
                  font-size: 0.22rem;
                  font-weight: 400;
                  color: #9fa0a5;
                  font-family: SourceHanSansCN-Normal, SourceHanSansCN;
                }
              }
            }
            .card-label-item-second {
              img {
                width: 0.56rem;
                height: 0.52rem;
              }
            }
          }
        }
      }
      .recommended-house {
        .recommended-title {
          padding-top: 0.4rem;
          padding-left: 0.5rem;
          font-size: 0.32rem;
          font-weight: 400;
          color: #000000;
        }
        .morehouse-btn {
          width: 6.5rem;
          height: 0.96rem;
          font-size: 0.28rem;
          font-weight: 400;
          color: #000000;
          line-height: 0.96rem;
          text-align: center;
          background: #fffbe7;
          border-radius: 0.08rem;
          margin: 0.4rem 0.5rem;
        }
      }
    }
  }
  .footer-broker {
    width: 100%;
    height: 1.58rem;
    background: #ffffff;
    box-shadow: 0rem 0.04rem 0.08rem 0rem rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    right: 0;
    .footer-left {
      display: flex;
      padding-left: 0.4rem;
      img {
        width: 0.8rem;
        height: 0.8rem;
      }
      .footer-name {
        padding-left: 0.18rem;
        .name {
          font-size: 0.32rem;
          font-weight: bold;
          color: #000000;
          font-family: SourceHanSansCN-Bold, SourceHanSansCN;
        }
        .label {
          font-size: 0.24rem;
          font-weight: 400;
          color: #000000;
          font-family: SourceHanSansCN-Normal, SourceHanSansCN;
        }
      }
    }
    .footer-right {
      display: flex;
      .btn-question {
        width: 1.68rem;
        height: 0.8rem;
        font-size: 0.32rem;
        font-weight: bold;
        color: #000000;
        line-height: 0.8rem;
        text-align: center;
        text-shadow: 0px 0px 0px rgba(0, 0, 0, 0.5);
        box-shadow: 0rem 0.04rem 0.08rem 0rem rgba(0, 0, 0, 0.5);
        border-radius: 0.08rem;
        border: 0.02rem solid #919191;
      }
      .btn-phone {
        width: 1.68rem;
        height: 0.8rem;
        font-size: 0.32rem;
        font-weight: bold;
        color: #000000;
        line-height: 0.8rem;
        text-align: center;
        text-shadow: 0px 0px 0px rgba(0, 0, 0, 0.5);
        background: #ffce09;
        box-shadow: 0rem 0.04rem 0.08rem 0rem rgba(0, 0, 0, 0.5);
        border-radius: 0.08rem;
        margin-right: 0.38rem;
        margin-left: 0.18rem;
      }
    }
  }
  .share-pop {
    .title {
      font-size: 0.32rem;
      font-weight: bold;
      color: #303030;
      padding-top: 0.46rem;
      padding-bottom: 0.24rem;
      margin: 0 0.4rem;
      border-bottom: 0.02rem solid#F0F0F0;
    }
    .content {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 0.4rem 0;
      border-bottom: 0.02rem solid#F0F0F0;
      .content-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          width: 0.96rem;
          height: 0.96rem;
        }
        span {
          font-size: 0.24rem;
          font-weight: 500;
          color: #696969;
          padding-top: 0.18rem;
        }
      }
    }
    .cancel {
      font-size: 0.32rem;
      font-weight: bold;
      color: #303030;
      text-align: center;
      padding: 0.4rem;
    }
  }
  .split-line {
    height: 0.24rem;
    background: #f9f9f9;
  }
  .swipe-active {
    background: #ffce09 !important;
  }
  .around-active {
    font-weight: bold !important;
    color: #303030 !important;
  }
  .vehicle-active {
    border: 0.02rem solid #ffce09;
    background-color: #fff !important;
  }
  /deep/ .van-nav-bar__content .van-nav-bar__title {
    width: 3.5rem;
    .head-nav-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
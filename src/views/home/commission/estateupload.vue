<template>
  <div class="estateupload">
    <gni-nav-bar :pageTitle="headTitle" @onClickLeft="onClickBack" :hideRight="false" :hideLeft="false">
      <template slot="slot-left">
        <div class="nav-left">
          <img :src="$appConfig.appWebStaticUrl + '/commission/icon_return.png'" alt="">
        </div>
      </template>
    </gni-nav-bar>
    <div class="wrapper">
      <div class="cell-container">
        <div class="cell">
          <div class="left-title">证件登记日期：</div>
          <div class="right-ipt">
            <input type="text" placeholder="格式示例：20180909" v-model="registerdate" maxlength="8">
          </div>
        </div>
        <div class="cell">
          <div class="left-title">建筑面积：</div>
          <div class="right-ipt">
            <input type="number" placeholder="格式示例：120.55" class="input-info" v-model="acreage" oninput="if(value>10000)value=10000;value=value.replace(/[^0-9.]/g,'')">
            <span style="color: #000000">㎡</span>
          </div>
        </div>
        <div class="cell">
          <div class="left-title">是否为共有财产：</div>
          <div class="right-btn">
            <div class="btn" @click="isCommunity = 1">
              <img :src="$appConfig.appWebStaticUrl + '/home/icon_select.png'" alt="" v-if="isCommunity == 1">
              <img :src="$appConfig.appWebStaticUrl + '/home/icon_unselect.png'" alt="" v-else>
              是
            </div>
            <div class="btn" @click="isCommunity = 0">
              <img :src="$appConfig.appWebStaticUrl + '/home/icon_select.png'" alt="" v-if="isCommunity == 0">
              <img :src="$appConfig.appWebStaticUrl + '/home/icon_unselect.png'" alt="" v-else>
              否
            </div>
          </div>
        </div>
        <div class="cell">
          <div class="left-title">是否唯一：</div>
          <div class="right-btn">
            <div class="btn" @click="isOnly = 1">
              <img :src="$appConfig.appWebStaticUrl + '/home/icon_select.png'" alt="" v-if="isOnly == 1">
              <img :src="$appConfig.appWebStaticUrl + '/home/icon_unselect.png'" alt="" v-else>
              是
            </div>
            <div class="btn" @click="isOnly = 0">
              <img :src="$appConfig.appWebStaticUrl + '/home/icon_select.png'" alt="" v-if="isOnly == 0">
              <img :src="$appConfig.appWebStaticUrl + '/home/icon_unselect.png'" alt="" v-else>
              否
            </div>
          </div>
        </div>
      </div>
      <div class="upload-pictures">
        <div class="title">上传图片：</div>
        <van-uploader v-model="fileList" :after-read="afterRead" :preview-size="70" @delete="deleteAfterRead">
          <template #default>
            <div class="pricture">
              <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_upload.png'" alt="">
            </div>
          </template>
        </van-uploader>

      </div>
      <div class="matters-attention">
        <div class="title">注意事项：</div>
        <div class="text">
          <span>1.除封面和封底以外，需将房产证的所有内容都拍照上传</span>
          <span>2.需保证拍摄完整、图文清晰、亮度均匀
          </span>
          <span>3.不可缺页、模糊、不能有遮挡信息，不可倾斜或倒置</span>
        </div>
      </div>
    </div>
    <div class="footer-btnTips">
      <div class="submit" @click="submit">确认提交</div>
      <div class="tips">裕丰地产将保障您的隐私安全
        如有问题请联系您的专属维护人</div>
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
      headTitle: '房产证上传', //标题文字
      registerdate: "",// 证件登记日期
      acreage: '', // 建筑面积
      isCommunity: 1, // 是否产权共有0否,1是
      isOnly: 1, // 是否唯一0否1是
      fileList: [],  // 上传图片数据
      photoList: [],
      photoUrl: '', // 拼接图片
      entrustId: '', // 委托id
    }
  },
  watch: {
    entrustId: {
      handler () {
        console.log('委托id已变');
        this.initData()  // 初始化data
      },
      deep: true,
    }
  },
  activated () {
    this.entrustId = this.commissionData.detail.entrust_id || ''
  },
  computed: {
    ...mapState("commission", ["commissionData"]), //我的委托的信息
  },
  async mounted () {
    setTimeout(async () => {
      //初始化登陆的状态
      await this.init();
    }, 500)
  },
  methods: {
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
    // 图片上传后的回调
    async afterRead (e) {
      e.status = 'uploading';
      e.message = '上传中...';
      let imgUrl = ''
      if (e.content) {
        imgUrl = await this.$commonUtils.utilCore.compress(e.content, 0.6, true)
      }
      const postData = {
        img_str: imgUrl,//	是	string	图片内容字符串base64
        picture_type_id: "1",//	是	string	图片类型：1:身份证,2:房产证
        entrust_id: this.commissionData.detail.entrust_id,//	是	string	委托ID
        entrust_type: this.commissionData.detail.entrust_type,//	是	string	委托类型[shouse:售,rent:租]
        site_id: "",	//否,	string	城市ID
        picture_name: "",//	否	string	图片名字
        broker_id: "",//否	string	经纪人ID
      }
      const res = await this.$store.dispatch('commission/getAppEntrustAupload', postData);
      if (res) {
        e.status = 'done';
        this.photoList.push(res.upload_file_id)
        this.photoUrl = this.photoList.join(',')
      }
    },
    // 删除文件
    deleteAfterRead (e, i) {
      this.photoList.splice(i, 1)
      this.photoUrl = this.photoList.join(',')
    },
    // 提交
    async submit () {
      // this.$commonUtils.utilCore.showLoading();
      const postData = {
        picture_ids: this.photoUrl, //	是	string	图片文件id；多个逗号分隔
        entrust_id: this.commissionData.detail.entrust_id, //	是	string	出售委托ID
        registration_date: this.registerdate, //	是	string	注册日期
        acreage_cover: this.acreage, //	是	string	建筑面积
        is_common_property: this.isCommunity, //	是	string	是否产权共有0否,1是
        is_only: this.isOnly, //	是	string	是否唯一0否1是
        entrust_type: this.commissionData.detail.entrust_type,//	是	string	租售类型[Shouse,Rent]
      }
      // console.log('id', this.photoUrl);
      const res = await this.$store.dispatch('commission/getAppEntrustAupdateHouse', postData);
      if (res.code == 200) {
        this.$commonUtils.utilCore.closeLoading()
        this.$commonUtils.utilCore.showToast("上传成功")
        this.onClickBack()
      }
    },
    // 初始化data
    initData () {
      this.registerdate = ""// 证件登记日期
      this.acreage = '' // 建筑面积
      this.isCommunity = 1 // 是否产权共有0否,1是
      this.isOnly = 1// 是否唯一0否1是
      this.fileList = []  // 上传图片数据
      this.photoList = []
      this.photoUrl = ''// 拼接图片
    },
    //返回上一层
    onClickBack () {
      // this.toolsGoPageView({ path: '/home/commission/releaseinformation' })
      this.toolsGoPageBack();
    },
  }
}
</script>

<style lang="scss" scoped>
.estateupload {
  padding-bottom: 1rem;
  height: 100vh;
  .nav-left {
    img {
      width: 0.4rem;
      height: 0.36rem;
      display: block;
    }
  }
  .wrapper {
    margin: 0 0.4rem;
    .cell-container {
      .cell {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.38rem 0;
        border-bottom: 0.02rem solid #f7f7f7;
        position: relative;
        .left-title {
          font-size: 0.32rem;
          font-weight: 400;
          color: #000000;
        }
        .right-ipt {
          font-size: 0.3rem;
          display: flex;
          align-items: center;
          input {
            width: 3rem;
            font-weight: 400;
            border: none;
            display: block;
            text-align: right;
          }
          .input-info {
            width: 2.65rem;
          }
        }
        .right-btn {
          width: 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          white-space: nowrap;
          font-size: 0.3rem;
          font-weight: 400;
          color: #000000;
          img {
            width: 0.3rem;
            height: 0.3rem;
            margin-right: 0.1rem;
          }
          .btn {
            display: flex;
            align-items: center;
          }
        }
      }
    }
    .upload-pictures {
      padding-top: 0.58rem;
      padding-bottom: 0.4rem;
      border-bottom: 0.02rem solid #f7f7f7;
      .title {
        font-size: 0.32rem;
        font-weight: 400;
        color: #000000;
        padding-bottom: 0.18rem;
      }
      .pricture {
        img {
          width: 1.4rem;
          height: 1.4rem;
        }
      }
    }
    .matters-attention {
      padding-top: 0.4rem;
      // padding-bottom: 1rem;
      .title {
        font-size: 0.28rem;
        font-weight: bold;
        color: #000000;
        padding-bottom: 0.18rem;
      }
      .text {
        display: flex;
        flex-direction: column;
        span {
          font-size: 0.24rem;
          font-weight: 400;
          color: #737373;
        }
      }
    }
  }
  .footer-btnTips {
    background: #ffffff;
    box-shadow: 0rem -0.04rem 0.08rem 0rem rgba(0, 0, 0, 0.08);
    padding-top: 0.26rem;
    position: fixed;
    bottom: 0;
    left: 0;
    .submit {
      width: 6rem;
      height: 0.8rem;
      font-size: 0.32rem;
      font-weight: 400;
      color: #000000;
      text-align: center;
      line-height: 0.8rem;
      background: #ffce09;
      border-radius: 0.1rem;
      margin: 0 0.76rem;
    }
    .tips {
      font-size: 0.24rem;
      font-weight: 400;
      color: #737373;
      padding: 0.26rem 2rem 0.5rem 2.03rem;
      text-align: center;
      line-height: 0.32rem;
    }
  }
}
</style>
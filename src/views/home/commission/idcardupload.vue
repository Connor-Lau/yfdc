<template>
  <div class="idcardupload">
    <gni-nav-bar :pageTitle="headTitle" @onClickLeft="onClickBack" :hideRight="false" :hideLeft="false">
      <template slot="slot-left">
        <div class="nav-left">
          <img :src="$appConfig.appWebStaticUrl + '/commission/icon_return.png'" alt="">
        </div>
      </template>
    </gni-nav-bar>
    <div class="wrapper">
      <div class="upload-container">
        <div class="upload-box">
          <van-uploader v-model="headfile" :after-read="headRead" @delete="deleteHeadRead" :deletable="false" ref="headfileRef">
            <template #default>
              <div class="box-photo" v-show="headfile.length==0">
                <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_takephoto.png'" alt="">
                <div class="box-text">上传人像面</div>
              </div>
            </template>
            <template #preview-cover>
              <div class="box-success" v-show="headUrl">
                <img :src="$appConfig.appWebStaticUrl + '/commission/icon_upload.png'" alt="">
                <div class="box-success-text">上传成功</div>
              </div>
            </template>
          </van-uploader>
          <div class="reupload" @click="uploadFile('headfileRef')" v-show="headUrl">重新上传</div>
        </div>

        <div class="upload-box">
          <van-uploader v-model="nationalfile" :after-read="nationalRead" @delete="deleteNationalRead" :deletable="false" ref="nationalfileRef">
            <template #default>
              <div class="box-photo" v-show="nationalfile.length==0">
                <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_takephoto.png'" alt="">
                <div class="box-text">上传国徽面</div>
              </div>
            </template>
            <template #preview-cover>
              <div class="box-success" v-show="nationalUrl">
                <img :src="$appConfig.appWebStaticUrl + '/commission/icon_upload.png'" alt="">
                <div class="box-success-text">上传成功</div>
              </div>
            </template>
          </van-uploader>
          <div class="reupload" @click="uploadFile('nationalfileRef')" v-show="nationalUrl">重新上传</div>
        </div>

      </div>
      <div class="example-container">
        <div class="example-title">要求及示例</div>
        <div class="example-item-container">
          <div class="example-item">
            <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_idcard04.png'" alt="" class="example-img">
            <img :src="$appConfig.appWebStaticUrl + '/home/icon_select.png'" alt="" class="example-icon">
            <div class="example-text">标准</div>
          </div>
          <div class="example-item">
            <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_idcard03.png'" alt="" class="example-img">
            <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_cancel.png'" alt="" class="example-icon">
            <div class="example-text">边框缺失</div>
          </div>
          <div class="example-item">
            <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_idcard01.png'" alt="" class="example-img">
            <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_cancel.png'" alt="" class="example-icon">
            <div class="example-text">图片模糊</div>
          </div>
          <div class="example-item">
            <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_idcard02.png'" alt="" class="example-img">
            <img :src="$appConfig.appWebStaticUrl + '/commission/iconSell/icon_cancel.png'" alt="" class="example-icon">
            <div class="example-text">亮度不均</div>
          </div>
        </div>

      </div>
    </div>
    <div class="footer-btnTips">
      <div class="submit" @click="submit">确认提交</div>
      <div class="tips">信息仅用于身份验证，裕丰地产将保障您的隐私安全如有问题请联系您的专属维护人</div>
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
      headTitle: '身份证上传', //标题文字
      headfile: [],
      nationalfile: [],
      headUrl: '',
      nationalUrl: '',
      entrustId: '', // 委托id
    }
  },
  computed: {
    ...mapState("commission", ["commissionData"]), //我的委托的信息
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
    // 上传身份证正面照
    async headRead (e) {
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
        this.headUrl = res.upload_file_id
      }
    },
    // 删除身份证正面照
    deleteHeadRead (e) {
      this.headfile = []
      this.headUrl = ''
    },
    // 上传身份证国徽
    async nationalRead (e) {
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
        this.nationalUrl = res.upload_file_id
      }
    },
    // 删除身份证国徽
    deleteNationalRead () {
      this.nationalfile = []
      this.nationalUrl = ''
    },
    async submit () {
      this.$commonUtils.utilCore.showLoading();
      const postData = {
        picture_ids: this.headUrl + ',' + this.nationalUrl,//	是	string	图片文件ID；多个逗号分隔
        entrust_id: this.commissionData.detail.entrust_id,
        entrust_type: this.commissionData.detail.entrust_type,//	是	string	出售委托ID
      }
      console.log('看看', this.headUrl + ',' + this.nationalUrl,);
      const res = await this.$store.dispatch('commission/getAppEntrustAupdateIdCard', postData);
      if (res.code == 200) {
        this.$commonUtils.utilCore.closeLoading()
        this.$commonUtils.utilCore.showToast("上传成功")
        this.onClickBack()
      }
    },
    // 初始化data
    initData () {
      this.headfile = []
      this.nationalfile = []
      this.headUrl = ''
      this.nationalUrl = ''
    },
    // 主动调起文件选择，由于浏览器安全限制，只有在用户触发操作的上下文中调用才有效
    uploadFile (type) {
      if (type == 'headfileRef') {
        this.deleteHeadRead()
        this.$nextTick(() => {
          this.$refs.headfileRef.chooseFile()
        })

      } else {
        this.deleteNationalRead()
        this.$nextTick(() => {
          this.$refs.nationalfileRef.chooseFile()
        })
      }

    },
    //返回上一层
    onClickBack () {
      this.toolsGoPageBack();
    },
  }
}
</script>

<style lang="scss" scoped>
.idcardupload {
  height: 100vh;
  .nav-left {
    img {
      width: 0.4rem;
      height: 0.36rem;
      display: block;
    }
  }
  .wrapper {
    .upload-container {
      padding: 1.2rem 0.4rem 2.18rem;
      display: flex;
      justify-content: space-between;
      .upload-box {
        .box-photo {
          width: 3.2rem;
          height: 1.9rem;
          background: rgba(242, 242, 242, 0.3);
          border: 0.02rem dashed rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          img {
            width: 0.52rem;
            height: 0.44rem;
          }
          .box-text {
            font-size: 0.26rem;
            font-weight: 400;
            color: #737373;
            padding-top: 0.2rem;
          }
        }
        .box-success {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.6);
          img {
            width: 0.44rem;
            height: 0.44rem;
          }
          .box-success-text {
            font-size: 0.32rem;
            font-weight: 400;
            color: #ffce09;
            padding-left: 0.1rem;
          }
        }
        .reupload {
          width: 1.24rem;
          height: 0.4rem;
          background: #ffce09;
          border-radius: 0.04rem;
          font-size: 0.24rem;
          font-weight: 400;
          color: #000000;
          text-align: center;
          line-height: 0.4rem;
          margin: 0 auto;
        }
      }
    }
    .example-container {
      padding: 0 0.4rem;
      .example-title {
        font-size: 0.28rem;
        font-weight: 400;
        color: #737373;
        text-align: center;
        padding-bottom: 0.42rem;
      }
      .example-item-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .example-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          .example-img {
            width: 1.56rem;
            height: 1.12rem;
          }
          .example-icon {
            width: 0.32rem;
            height: 0.32rem;
            margin-top: 0.12rem;
            margin-bottom: 0.08rem;
          }
          .example-text {
            font-size: 0.28rem;
            font-weight: 400;
            color: #737373;
          }
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
      padding: 0.26rem 0.9rem 0.5rem;
      text-align: center;
      line-height: 0.32rem;
    }
  }
  /deep/ .van-uploader__preview-image {
    width: 3.2rem !important;
    height: 1.9rem !important;
  }
  // /deep/ .van-uploader {
  //   width: 3.2rem;
  //   height: 1.9rem;
  // }
  /deep/ .van-uploader__preview {
    margin: 0;
  }
}
</style>
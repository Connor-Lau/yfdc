<template>
  <div class="mui-content">
    <gni-nav-bar @onClickLeft="onClickBack" :pageTitle="'免责声明'" :hideRight="false"></gni-nav-bar>
    <div class="pageArticle">
      <p><strong>《免责声明》</strong></p>
      <p><strong>特别提示：</strong></p>
      <p><strong>您在使用裕丰地产（广州裕丰房地产销售代理有限公司及其子公司）提供的各项服务之前，请您务必审慎阅读、充分理解本协议各条款内容,以下内容适用于裕丰地产网站</strong>http://pc.yfdc.net<strong>和裕丰地产移动端APP"裕丰地产"。</strong></p>
      <p>1、裕丰地产网http://pc.yfdc.net（下称"本网站"）所载的文章、图片、音视频文件等资料，目的在于为公众传递更多信息资讯，仅供参考，并不代表本网站赞同其观点或证实其内容的真实性。如其他媒体、网站或个人从本网站下载使用，必须保留本网站注明的"稿件来源"，并自负版权等法律责任。如对稿件内容有异议，请及时与我们联系。</p>
      <p>&nbsp;2、本网站内凡注明"来源：裕丰地产网"的所有文字、图片和音视频稿件均属本网站原创内容，版权均属裕丰地产网所有，任何媒体、网站或个人未经本网站协议授权不得转载、链接、转贴或以其他方式复制发表。已经本网站协议授权的媒体、网站，在下载使用时必须注明"稿件来源：裕丰地产网"，违者将依法追究责任。</p>
      <p>&nbsp;3、凡本网站转载的所有文章、图片、音视频文件等资料的版权归版权所有人所有，本网站采用的非本网站原创文章及图片等内容无法一一和版权者联系，如果本网站所选内容的文章作者及编辑认为其作品不宜上网供大家浏览，或不应无偿使用，请及时用电子邮件或电话通知我们，以迅速采取适当措施，避免给双方造成不必要的经济损失。</p>
      <p>&nbsp;4、本网站不保证为向用户提供便利而设置的外部链接的准确性和完整性，同时，对于该外部链接指向的并非由本网站实际控制的任何网页上的内容，本网站不承担任何责任。</p>
      <p>&nbsp;5、本网站致力于提供合理、准确、完整的资讯信息，但不保证信息的合理性、准确性和完整性，且不对因信息的不合理、不准确或不完整导致的任何损失或损害承担责任。本网站所有信息和数据仅供参考，不构成任何投资建议，不作交易和服务的根据，如因自行使用本网站资料发生偏差，本网站概不负责，亦不负任何法律责任。</p>
      <p>&nbsp;6、任何由于黑客攻击、计算机病毒侵入或发作、因政府管制而造成的暂时性关闭等影响网络正常经营的不可抗力而造成的损失，本网站均得免责。由于与本网站链接的其它网站所造成之个人资料泄露及由此而导致的任何法律争议和后果，本网站均得免责。</p>
      <p>7、本网站如因系统维护或升级而需暂停服务时，将事先公告。若因线路及非本公司控制范围外的硬件故障或其它不可抗力而导致暂停服务，于暂停服务期间造成的一切不便与损失，本网站不负任何责任。</p>
    </div>
  </div>
</template>

<script>
import gniNavBar from "@/components/gni/gni-nav-bar.vue";
export default {
  components: {
    gniNavBar,
  },
  methods: {
    onClickBack () {
      this.$router.go(-1);
    },
  }
}
</script>

<style lang="scss" scoped>
.pageArticle {
  font-size: 14px;
  color: #333333;
  line-height: 1.8em;
  padding: 20px;
}
.pageArticle h2 {
  font-weight: bold;
  font-size: 16px;
  color: #333333;
  line-height: 1.8em;
  padding: 0.3em 0;
  text-align: center;
}
.pageArticle h3 {
  font-weight: bold;
  font-size: 14px;
  color: #333333;
  line-height: 1.8em;
  padding: 0.3em 0;
}
.pageArticle p {
  font-size: 14px;
  color: #333333;
  line-height: 1.8em;
  padding: 0.3em 0;
}
</style>
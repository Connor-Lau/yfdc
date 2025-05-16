<template>
  <div class="pdfBox">
    <div id="previewPdf"></div>
  </div>
</template>
<script>
import pdfh5 from 'pdfh5';
import 'pdfh5/css/pdfh5.css'
export default {
  name: 'gni-previewpdf-h5',
  data () {
    return {
      pdfh5: null,
    }
  },
  methods: {
    openPdf(url){     //url：PDF文件地址
      this.pdfh5 = new pdfh5('#previewPdf', {
        pdfurl: url
      });
      this.pdfh5.on('success', ()=>{
        this.$commonUtils.appLog.log('pdf渲染成功');
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.pdfBox {
  position: relative;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
  z-index: 99;
  #previewPdf {
    height: 100vh;
  }
}
</style>
<template>
  <div class="app-404">
    <van-image :src="$appConfig.appWebStaticUrl + 'common/404.png'" />
    <div class="font-box">
      <div class="title-404">{{ title }}</div>
      <div class="describe-404">{{ describe }}</div>
    </div>
    <div class="btn-404" @click="onClickBack">返回上一页</div>
    <div class="btn-404-home" @click="onClickBackHome">返回首页</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '你访问的页面已离开地球',
      describe: '请返回上一页，再进入试试~',
    }
  },
  methods: {
    //返回上一层
    onClickBack () {
      this.toolsGoPageBack();
      return;
    },
    //返回APP首页
    onClickBackHome () {
      this.toolsGoPageView({ path: '/common/index', replace: true });
      return;
    },
  }
}
</script>

<style lang="scss" scoped>
.app-404 {
  text-align: center;
  color: #6d6d6d;
  padding: 2rem 0 1rem;
  position: relative;

  .van-image {
    max-width: 750px;
  }

  .font-box {
    position: absolute;
    top: 6.1rem;
    left: 0;
    right: 0;
    line-height: 1;

    .title-404 {
      font-size: 0.4rem;
      font-weight: bold;
      padding-bottom: 0.28rem;
    }

    .describe-404 {
      font-size: 0.28rem;
    }
  }

  .btn-404 {
    width: 2.8rem;
    line-height: 0.88rem;
    background: #237ef0;
    box-shadow: 0rem 0.26rem 0.5rem 0rem rgba(86, 123, 194, 0.17);
    border-radius: 2rem;
    font-size: 0.32rem;
    color: #fff;
    margin: 0 auto;
    position: absolute;
    left: 75%;
    transform: translateX(-50%);
    bottom: 1rem;
  }
  .btn-404-home {
    width: 2.8rem;
    line-height: 0.88rem;
    background: #237ef0;
    box-shadow: 0rem 0.26rem 0.5rem 0rem rgba(86, 123, 194, 0.17);
    border-radius: 2rem;
    font-size: 0.32rem;
    color: #fff;
    margin: 0 auto;
    position: absolute;
    left: 25%;
    transform: translateX(-50%);
    bottom: 1rem;
  }
}
</style>
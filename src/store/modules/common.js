/**
 * 公共方法
 * uploadImage: 图片上传方法，不同模块都调用这个方法上传图片，图片的数据各个模块自己处理存储
 */

import commonUtils from '@/common/utils/index.js';
import commonProtocol from '@/common/protocols/index.js';
import appConfig from '@/common/configs/index.js';
import messageAct from "@/common/message-act";

export default {
  namespaced: true,
  state: {
    indexPage: "",//存首页链接
    testConfigValue: "",//当前选择的测试环境
    testConfigValueSYS: {},//缓丰的测试环境配置
    aPPSYSAppEnv: "",//当前APP运行的环境
  },
  mutations: {
    //设置当前APP运行的环境
    setAPPSYSAppEnv (state, info) {
      state.aPPSYSAppEnv = info;
    },
    setIndexPage (state, path) {
      state.indexPage = path;
    },
    setTestConfigValue (state, val) {
      state.testConfigValue = val
    },
    setTestConfigValueSYS (state, val) {
      state.testConfigValueSYS = val
    }
  },
  actions: {
    // 上传图片
    uploadImage: async function ({ commit, state, rootState }, base64Data) {
      //压缩一下图片
      base64Data = await commonUtils.utilCore.compress(base64Data, 0.2, true);

      let param = {
        app_key: appConfig.appKey,
        service: commonProtocol.oa.AppDisciplineV2UploadBase64Image.name,
        access_token: `${rootState.user.userToken}` || '',
        image: base64Data,
      }
      const res = await commonProtocol.request(commonProtocol.oa.AppDisciplineV2UploadBase64Image, { data: param })
      if (res && res.status == 200) {
        if (res.data.ret && res.data.ret == 200) {
          if (res.data.data && res.data.data.info && res.data.data.info.data) {
            return res.data.data.info.data
          }
          return false;
        } else if (res.data.ret == 406) {
          return commonUtils.utilCore.uniGoPage('/pages/common/login/login')
        }
      }
      return false;
    },

    /**
     * 授权验证
     *
     * @param {'location' | 'camera'} scope
     *
     * scope列表如下，其他的好像也用不到吧
       location:'位置',
       push:'推送',
       camera:'摄像头',
       photoLibrary:'相册',
       record:'麦克风',
     *
     * @throws Error
     * 40001：通用错误，比如参数校验不通过的错误，具体看message，一般属于需要提示用户的错误
     * 40010：用户没有打开定位功能
     * 40011：用户拒绝了定位授权
     * 40012：用户永久拒绝了定位授权
     * 40040: 用户手机操作系统既不是安卓，也不是ios，比如鸿蒙，目前不支持
     */
    authorize (context, scope) {
      return new Promise((resolve, reject) => {
        messageAct.messageProtocols.push({
          "authorizeAPP": (msg) => {
            if (msg.code === 0) {
              resolve(msg)
            } else {
              reject(msg)
            }
          }
        })
        let messageData = {
          act: "authorizeAPP",
          isAsync: true,
          scope,
          msg: "获取授权"
        }
        messageAct.sendMessageToApp(messageData)
      })
    },

  }
}

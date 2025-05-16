/**
 * 记录我的委托的数据 commission
 */
import commonUtils from '@/common/utils/index.js'
import commonCaches from '@/common/caches/index.js'
import commonProtocol from '@/common/protocols/index.js'
import appConfig from '@/common/configs/index.js'
export default {
  namespaced: true,
  state: {
    commissionData: {
      city: {
        city_id: "",
        city_name: "",
      },
      village: {}, // 小区
      roomnumber: {}, // 房号
    }, // 我的委托发布房源选择的城市
  },
  mutations: {
    // 记录我的委托发布房源选择的城市
    setCommissionData (state, { data, key }) {
      if (key) {
        state.commissionData[key] = data;
      } else {
        // 清除数据不清除默认格式
        state.commissionData = {
          city: {
            city_id: "",
            city_name: "",
          },
          village: {},
          roomnumber: {}
        }
      }
    },
  },
  actions: {
    /**
    *   -获取我的委托
    * @param {*} context 
    * @returns 
    */
    getAppEntrustIndex: async function (context, postData) {
      let optionsRequest = {
        data: postData
      }
      let res = await commonProtocol.request(commonProtocol.commission.appEntrustIndex, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
    *   -我的委托-发布房源（租售）
    * @param {*} context 
    * @returns 
    */
    getAppEntrustAadd: async function (context, postData) {
      let optionsRequest = {
        data: postData
      }
      let res = await commonProtocol.request(commonProtocol.commission.appEntrustAadd, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data;
      }
      return false;
    },
    /**
    *   -我的委托-小区搜索列表
    * @param {*} context 
    * @returns 
    */
    getAppEntrustSearchErpUptown: async function (context, postData) {
      let optionsRequest = {
        data: postData
      }
      let res = await commonProtocol.request(commonProtocol.commission.appEntrustSearchErpUptown, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },

    /**
    *   -我的委托-小区搜索列表 2023.8.8 新增 广州的才调取此小区列表接口
    * @param {*} context 
    * @returns 
    */
    getAppEntrustSearchHouseDictionary: async function (context, postData) {
      let optionsRequest = {
        data: postData
      }
      let res = await commonProtocol.request(commonProtocol.commission.appEntrustSearchHouseDictionary, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
   *   -我的委托-获取单个委托(详情)
   * @param {*} context 
   * @returns 
   */
    getAppEntrustAdetail: async function (context, postData) {
      let optionsRequest = {
        data: postData
      }
      let res = await commonProtocol.request(commonProtocol.commission.appEntrustAdetail, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
  *   -我的委托-更新委托状态(删除|取消)
  * @param {*} context 
  * @returns 
  */
    getAppEntrustAupdateStatus: async function (context, postData) {
      let optionsRequest = {
        data: postData
      }
      let res = await commonProtocol.request(commonProtocol.commission.appEntrustAupdateStatus, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data;
      }
      return false;
    },
    /**
  *   -我的委托-身份证图片提交
  * @param {*} context 
  * @returns 
  */
    getAppEntrustAupdateIdCard: async function (context, postData) {
      let optionsRequest = {
        data: postData
      }
      let res = await commonProtocol.request(commonProtocol.commission.appEntrustAupdateIdCard, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data;
      }
      return false;
    },
    /**
  *   -我的委托-委托图片上传
  * @param {*} context 
  * @returns 
  */
    getAppEntrustAupload: async function (context, postData) {
      let optionsRequest = {
        data: postData
      }
      let res = await commonProtocol.request(commonProtocol.commission.appEntrustAupload, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
  *   -我的委托-房产证图片和资料保存
  * @param {*} context 
  * @returns 
  */
    getAppEntrustAupdateHouse: async function (context, postData) {
      let optionsRequest = {
        data: postData
      }
      let res = await commonProtocol.request(commonProtocol.commission.appEntrustAupdateHouse, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data;
      }
      return false;
    },
    /**
  *   -我的委托-调整价格申请
  * @param {*} context 
  * @returns 
  */
    getAppEntrustAadjustPrice: async function (context, postData) {
      let optionsRequest = {
        data: postData
      }
      let res = await commonProtocol.request(commonProtocol.commission.appEntrustAadjustPrice, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data;
      }
      return false;
    },
    /**
  *   -我的委托-重新发布委托
  * @param {*} context 
  * @returns 
  */
    getAppEntrustArePublish: async function (context, postData) {
      let optionsRequest = {
        data: postData
      }
      let res = await commonProtocol.request(commonProtocol.commission.appEntrustArePublish, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data;
      }
      return false;
    },
    // 默认委托变化的城市
    hanleChangeCityid ({ state, commit, dispatch, rootState, }) {
      let switchData = {
        city_id: rootState.city.switchCityInfo.city_id || rootState.city.thisCityInfo.city_id,
        city_name: rootState.city.switchCityInfo.city_name || rootState.city.thisCityInfo.city_name,
      }
      commit('setCommissionData', { data: switchData, key: "city" })
    },
  }
}

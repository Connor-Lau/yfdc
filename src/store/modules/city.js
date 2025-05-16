/**
 * 记录用户当前城市数据
 */
import commonUtils from '@/common/utils/index.js'
import commonCaches from '@/common/caches/index.js'
import commonProtocol from '@/common/protocols/index.js'
import appConfig from '@/common/configs/index.js'
export default {
  namespaced: true,
  state: {
    geoPosition: {}, // 定位城市坐标信息
    thisCityInfo: { city_id: 8, city_name: '广州', city_info: "", createTime: 0, is_69: true },//当前城市的地址信息
    // thisCityInfo: { city_id: 17, city_name: '长沙', city_info: "", createTime: 0, is_69: false },//当前城市的地址信息
    switchCityInfo: "",/**{ city_id: 8, city_name: '广州', city_info: "", createTime: 0 , is_69: false} ,//选择的城市地址信息(记录数据的格式与当前城市的要一至)*/
    cityInfoRows: {},//记录城市列表
    recentCity: [], // 记录最近访问的城市
    searchHistoryCity: [], // 搜索历史的城市
  },
  mutations: {
    /**
     * 设置定位信息
     * @param {*} state
     * @param {*} geoPosition
     */
    setGeoPosition (state, geoPosition) {
      state.geoPosition = geoPosition
      //增加获取定位的时间
      if (!commonUtils.utilCore.empty(geoPosition)) {
        state.geoPosition.createTime = commonUtils.utilDate.time()
      }
    },
    //记录当前城市的地址信息
    setThisCityInfo (state, info) {
      //增加获取定位的时间
      if (!commonUtils.utilCore.empty(info)) {
        info.createTime = commonUtils.utilDate.time()
      }
      state.thisCityInfo = info;
      //如果当前没有选择城市，则默认当前定位的城市
      if (commonUtils.utilCore.empty(state.switchCityInfo) || commonUtils.utilCore.empty(state.switchCityInfo.city_info)) {
        state.switchCityInfo = info;
      }
      // commonUtils.appLog.log("城市数据=========>>", state.thisCityInfo, state.switchCityInfo)
    },
    //记录选择的城市地址信息
    setSwitchCityInfo (state, info) {
      state.switchCityInfo = info;
      //增加获取定位的时间
      if (!commonUtils.utilCore.empty(info)) {
        state.switchCityInfo.createTime = commonUtils.utilDate.time()
      }
    },
    //记录城市列表
    setCityInfoRows (state, info) {
      state.cityInfoRows.info = info;
      //增加获取定位的时间
      if (!commonUtils.utilCore.empty(info)) {
        state.cityInfoRows.createTime = commonUtils.utilDate.time()
      }
    },
    // 记录最近访问的城市
    setRecentCity (state, data) {
      let isRecent = false
      let recentIndex = 0
      state.recentCity.forEach((item, index) => {
        if (item.cityId == data.cityId) {
          isRecent = true
          recentIndex = index
        }
      })
      if (isRecent) {
        state.recentCity.splice(recentIndex, 1)
      }
      state.recentCity.unshift(data)
      if (state.recentCity.length > 3) {
        state.recentCity.pop()
      }
    },
    // 记录搜索历史的城市
    setSearchCity (state, data) {
      let isRecent = false
      let recentIndex = 0
      state.searchHistoryCity.forEach((item, index) => {
        if (item.cityId == data.cityId) {
          isRecent = true
          recentIndex = index
        }
      })
      if (isRecent) {
        state.searchHistoryCity.splice(recentIndex, 1)
      }
      state.searchHistoryCity.unshift(data)
      if (state.searchHistoryCity.length > 6) {
        state.searchHistoryCity.pop()
      }
    },
    //清理搜索历史的城市
    clearSearchCity (state, data) {
      state.searchHistoryCity = []
    }
  },
  actions: {
    /**
     * 获取定位信息
     * @param {*} param0 
     * @param {*} param1 
     * @returns 
     */
    getGeoPosition: async function ({ commit, state, dispatch }, { messageAct, isUpdate }) {
      return new Promise((resolve, reject) => {
        //如果已经有获取过定位，并且不是要求拿最新的，则直接返回已有的定位就好了
        let is_do = false;//是否已经有结果
        if (!isUpdate) {
          let thisTime = commonUtils.utilDate.time();
          if (
            !commonUtils.utilCore.empty(state.geoPosition)
            && !commonUtils.utilCore.empty(state.geoPosition.createTime)
            && state.geoPosition.createTime > thisTime - 86164
          ) {
            is_do = true;
            resolve(state.geoPosition)
          }
        }
        //去APP处请求
        if (!is_do) {
          messageAct.messageProtocols.push({
            "geoPositionAPP": (msg) => {
              if (commonUtils.utilCore.isObject(msg)) {
                commit('setGeoPosition', msg)
                resolve(msg)
              } else {
                resolve(msg)
              }
            }
          })
          const messageData = {
            act: 'geoPositionAPP',
            isAsync: true,
            msg: '获取定位信息'
          }
          messageAct.sendMessageToApp(messageData)
          commonUtils.appLog.log("请求APP去获取geoPosition")
        }
      })
    },
    //获取城市信息
    /**
     * 
     * @param {*} context 
     * @param {*} postData = {
        site_name:"城市名称",
      } 
     * @returns 
     */
    getAppFangBaseDataGetCityRows: async function (context, { messageAct, postData }) {
      let optionsRequest = { data: {} }
      optionsRequest.data.site_name = postData.site_name || ""  //	否	string	搜索名称

      commonUtils.appLog.log("提交的参数==>", optionsRequest)
      let res = await commonProtocol.request(commonProtocol.city.appFangBaseDataGetCityRows, optionsRequest)
      commonUtils.appLog.log('城市数据返回结果====》》》', res)
      if (res && res.data && res.data.code && res.data.code == 200) {
        //如果没有指定城市名称，则表示返回的是城市列表
        if (commonUtils.utilCore.empty(postData.site_name)) {
          //这里要帮用户完成登陆的标记
          //res = commonUtils.utilCore.deepClone(res.data.data)
          //把返回的数据变成真正的JS数组
          let tmp_items = []
          for (let i in res.data.data) {
            let item = res.data.data[i];
            if (!commonUtils.utilCore.empty(item) && !commonUtils.utilCore.empty(item.site_name)) {
              tmp_items.push(item)
            }
          }
          context.commit('setCityInfoRows', tmp_items)
          return tmp_items;
        } else {
          //这里要帮用户完成登陆的标记
          let tmp_item = {}
          for (let i in res.data.data) {
            let item = res.data.data[i];
            if (!commonUtils.utilCore.empty(item) && !commonUtils.utilCore.empty(item.site_name)) {
              tmp_item = {
                city_id: item.site_id,
                city_name: item.site_name,
                is_69: item.is_69,
                city_info: item
              }
            }
          }
          // context.commit('setThisCityInfo', tmp_item)
          // await context.dispatch('app/setAppStateData', { messageAct: messageAct, jsonData: [{ "mod": "city", "fun": "setThisCityInfo", "val": JSON.parse(JSON.stringify(context.state.thisCityInfo)) }] }, { root: true });
          // return JSON.parse(JSON.stringify(context.state.thisCityInfo))
          return JSON.parse(JSON.stringify(tmp_item))
        }
      }
      return false;
    },


    /**
  *   -地铁站点转换
  * @param {*} context 
  * @returns 
  */
    getAppFangBaseDataChangeMetro: async function (context, postData) {
      let optionsRequest = {
        data: postData
      }
      let res = await commonProtocol.request(commonProtocol.city.appFangBaseDataChangeMetro, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data;
      }
      return false;
    },
  }
}

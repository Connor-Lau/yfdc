/**
 * 记录地图的数据 map
 */
import commonUtils from '@/common/utils/index.js'
import commonCaches from '@/common/caches/index.js'
import commonProtocol from '@/common/protocols/index.js'
import appConfig from '@/common/configs/index.js'
export default {
  namespaced: true,
  state: {
    searchListGetData: {},//搜索列表筛选参数值
    searchMapHouseData: {}, // 搜索小区的参数
    searchDrawListGetData: {},//搜索列表筛选参数值
    drawIdArr: '', // 画完圈之后显示的套数id
  },
  mutations: {
    //设置列表筛选参数值
    setSearchListGetData (state, info) {
      state.searchListGetData = commonUtils.utilCore.deepClone(info)
      commonUtils.appLog.log("setSearchListGetData===>>", info)
    },
    //设置 搜索参数值
    setSearchMapHouseData (state, info) {
      state.searchMapHouseData = commonUtils.utilCore.deepClone(info)
      commonUtils.appLog.log("searchMapHouseData===>>", info)
    },
    //设置画圈完跳转的列表筛选参数值
    setSearchDrawListGetData (state, info) {
      state.searchDrawListGetData = commonUtils.utilCore.deepClone(info)
      commonUtils.appLog.log("searchDrawListGetData===>>", info)
    },
    setDrawIdArr (state, data) {
      state.drawIdArr = data
    }
  },
  actions: {
    /**
      *  地图找房-二手房-列表
      * @param {*} context 
      * @returns 
      */
    getAppFangMapaBubbleSale: async function (context, postData) {
      let optionsRequest = { data: postData }
      let res = await commonProtocol.request(commonProtocol.map.appFangMapaBubbleSale, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    //进行地图找房-二手房-列表的搜索操作
    actAppFangMapaBubbleSale: async function (context, info) {
      let postData = {
        bounds_max_lng: info.bounds_max_lng || "",//	新增 否	string	最大经度
        bounds_min_lng: info.bounds_min_lng || "",//	新增 否	string	最小经度
        bounds_max_lat: info.bounds_max_lat || "",//新增 否	string	最大纬度
        bounds_min_lat: info.bounds_min_lat || "",//新增 否	string	最小纬度
        zoom: info.zoom || '',//新增 否	string	地图缩放比例
        keyword: "",//否	string	关键字搜索
        areaType: "",//否	string	地区类型 area:地区 metro:地铁 nearby:附近
        district_id: "",//	否	string	一级地区id
        block_ids: "",//否	string	二级地区id 逗号分隔 不限为空
        metro_line_id: "",//否	string	地铁线路 id
        metro_station_ids: "",//否	string	地铁站点 逗号分隔 不限为空
        nearby_distance: "",//新增 否	string	距离 米
        longitude: info.longitude || "",//	新增 否	string	经度(定位)
        latitude: info.latitude || "",// 新增 否	string	纬度(定位)
        price_ids: "",//否	string	价格id查询 逗号分隔
        price_min: "",//否	string	最低价格(万)
        price_max: "",//否	string	最高价格(万)
        layout_room_ids: "",//否	string	户型id 逗号分隔
        acreage_ids: "",//否	string	建筑面积id 逗号分隔
        house_type_ids: "",//否	string	物业类型id 逗号分隔
        decoration_ids: "",//否	string	装修类型id 逗号分隔
        uptown_id: "", // 2023/3/13 新增通过小区搜索
      }


      //判断标签选择
      if (!commonUtils.utilCore.empty(info.setDiskIndex)) {
        let str_ids = ''
        info.setDiskIndex.forEach((item) => {
          if (item.id != "") {
            str_ids += item.id + ","
          } else {
            str_ids = ''
            return;
          }
        })
        //去掉未尾的 ,
        str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
        postData.second_tag_ids = str_ids
      }

      // //判断是 区域 
      // if (!commonUtils.utilCore.empty(info.setDistrict) || !commonUtils.utilCore.empty(info.setDistrictList)) {
      //   postData.areaType = 'area'
      //   if (info.setDistrict.id != "") {
      //     postData.district_id = info.setDistrict.id
      //     let str_ids = ''
      //     info.setDistrictList.forEach((item) => {
      //       if (item.id != "") {
      //         str_ids += item.id + ","
      //       } else {
      //         str_ids = ''
      //         return;
      //       }
      //     })
      //     //去掉未尾的 ,
      //     str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
      //     postData.block_ids = str_ids
      //   }

      // }
      // //判断是 地铁
      // if (!commonUtils.utilCore.empty(info.setDistrictMetro) || !commonUtils.utilCore.empty(info.setDresslistMetro)) {
      //   postData.areaType = 'metro'
      //   if (info.setDistrictMetro.id != "") {
      //     postData.metro_line_id = info.setDistrictMetro.id
      //     let str_ids = ''
      //     info.setDresslistMetro.forEach((item) => {
      //       if (item.id != "") {
      //         str_ids += item.id + ","
      //       } else {
      //         str_ids = ''
      //         return;
      //       }
      //     })
      //     //去掉未尾的 ,
      //     str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
      //     postData.metro_station_ids = str_ids
      //   }
      // }
      //判断总价
      if (!commonUtils.utilCore.empty(info.setPriceTabFirst)) {
        let str_ids = ''
        info.setPriceTabFirst.forEach((item) => {
          str_ids += item.id + ","
        })
        //去掉未尾的 ,
        str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
        postData.price_ids = str_ids
      }
      //判断输入的总价
      if (
        !commonUtils.utilCore.empty(info.setPriceFirstVal)
        && info.setPriceFirstVal.length == 2
        && (!commonUtils.utilCore.empty(info.setPriceFirstVal[0]) || info.setPriceFirstVal[0] == '0')
        && !commonUtils.utilCore.empty(info.setPriceFirstVal[1])
      ) {
        postData.price_min = info.setPriceFirstVal[0]
        postData.price_max = info.setPriceFirstVal[1]
      }
      //判断单价
      if (!commonUtils.utilCore.empty(info.setPriceTabSecond)) {
        let str_ids = ''
        info.setPriceTabSecond.forEach((item) => {
          str_ids += item.id + ","
        })
        //去掉未尾的 ,
        str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
        postData.average_price_ids = str_ids
      }
      //判断输入的单价
      if (
        !commonUtils.utilCore.empty(info.setPriceSecondVal)
        && info.setPriceSecondVal.length == 2
        && (!commonUtils.utilCore.empty(info.setPriceSecondVal[0]) || info.setPriceSecondVal[0] == '0')
        && !commonUtils.utilCore.empty(info.setPriceSecondVal[1])
      ) {
        postData.average_price_min = info.setPriceSecondVal[0]
        postData.average_price_max = info.setPriceSecondVal[1]
      }

      //判断区域id
      if (!commonUtils.utilCore.empty(info.searchUptownId)) {
        postData.uptown_id = info.searchUptownId
      }

      //判断户型
      if (!commonUtils.utilCore.empty(info.setHuxing)) {
        let str_ids = ''
        info.setHuxing.forEach((item) => {
          if (item) {
            str_ids += item.id + ","
          }
        })
        //去掉未尾的 ,
        str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
        postData.layout_room_ids = str_ids
      }
      //判断建筑面积
      if (!commonUtils.utilCore.empty(info.setMoreArea)) {
        let str_ids = ''
        info.setMoreArea.forEach((item) => {
          if (item) {
            str_ids += item.id + ","
          }
        })
        //去掉未尾的 ,
        str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
        postData.acreage_ids = str_ids
      }
      //判断 物业类型id
      if (!commonUtils.utilCore.empty(info.setMorePropertyType)) {
        let str_ids = ''
        info.setMorePropertyType.forEach((item) => {
          if (item) {
            str_ids += item.id + ","
          }
        })
        //去掉未尾的 ,
        str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
        postData.house_type_ids = str_ids
      }
      //判断 装修类型id
      if (!commonUtils.utilCore.empty(info.setMoreRenovation)) {
        let str_ids = ''
        info.setMoreRenovation.forEach((item) => {
          if (item) {
            str_ids += item.id + ","
          }
        })
        //去掉未尾的 ,
        str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
        postData.decoration_ids = str_ids
      }

      //判断排序
      if (
        !commonUtils.utilCore.empty(info.setSortListVal)
      ) {
        let tmpSort = info.setSortListVal[0].val.split("~")
        if (tmpSort && tmpSort.length == 2) {
          postData.sort = tmpSort[0]
          postData.order = tmpSort[1]
        }
      }
      // 判断附近
      if (!commonUtils.utilCore.empty(info.setNearby)) {
        postData.areaType = 'nearby'
        postData.nearby_distance = info.setNearby.val
      }
      let res = await context.dispatch('map/getAppFangMapaBubbleSale', postData, { root: true });
      return res;
    },
    /**
      *  地图找房-租房-列表
      * @param {*} context 
      * @returns 
      */
    getAppFangMapaBubbleRent: async function (context, postData) {
      let optionsRequest = { data: postData }
      let res = await commonProtocol.request(commonProtocol.map.appFangMapaBubbleRent, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    //进行地图找房-租房-列表的搜索操作
    actAppFangMapaBubbleRent: async function (context, info) {
      let postData = {
        bounds_max_lng: info.bounds_max_lng || "",//	新增 否	string	最大经度
        bounds_min_lng: info.bounds_min_lng || "",//	新增 否	string	最小经度
        bounds_max_lat: info.bounds_max_lat || "",//新增 否	string	最大纬度
        bounds_min_lat: info.bounds_min_lat || "",//新增 否	string	最小纬度
        zoom: info.zoom || '',//新增 否	string	地图缩放比例
        keyword: "",//否	string	关键字搜索
        areaType: "",//否	string	地区类型 area:地区 metro:地铁 nearby:附近
        district_id: "",//	否	string	一级地区id
        block_ids: "",//否	string	二级地区id 逗号分隔 不限为空
        metro_line_id: "",//否	string	地铁线路 id
        metro_station_ids: "",//否	string	地铁站点 逗号分隔 不限为空
        nearby_distance: "",//新增 否	string	距离 米
        longitude: info.longitude || "",//	新增 否	string	经度(定位)
        latitude: info.latitude || "",// 新增 否	string	纬度(定位)
        price_ids: "",//否	string	价格id查询 逗号分隔
        price_min: "",//否	string	最低价格(万)
        price_max: "",//否	string	最高价格(万)
        layout_room_ids: "",//否	string	户型id 逗号分隔
        acreage_ids: "",//否	string	建筑面积id 逗号分隔
        house_type_ids: "",//否	string	物业类型id 逗号分隔
        decoration_ids: "",//否	string	装修类型id 逗号分隔
        uptown_id: "", // 2023/3/13 新增通过小区搜索
      }


      //判断标签选择
      if (!commonUtils.utilCore.empty(info.setDiskIndex)) {
        let str_ids = ''
        info.setDiskIndex.forEach((item) => {
          if (item.id != "") {
            str_ids += item.id + ","
          } else {
            str_ids = ''
            return;
          }
        })
        //去掉未尾的 ,
        str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
        postData.second_tag_ids = str_ids
      }

      //判断是 区域 
      // if (!commonUtils.utilCore.empty(info.setDistrict) || !commonUtils.utilCore.empty(info.setDistrictList)) {
      //   postData.areaType = 'area'
      //   if (info.setDistrict.id != "") {
      //     postData.district_id = info.setDistrict.id
      //     let str_ids = ''
      //     info.setDistrictList.forEach((item) => {
      //       if (item.id != "") {
      //         str_ids += item.id + ","
      //       } else {
      //         str_ids = ''
      //         return;
      //       }
      //     })
      //     //去掉未尾的 ,
      //     str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
      //     postData.block_ids = str_ids
      //   }

      // }
      // //判断是 地铁
      // if (!commonUtils.utilCore.empty(info.setDistrictMetro) || !commonUtils.utilCore.empty(info.setDresslistMetro)) {
      //   postData.areaType = 'metro'
      //   if (info.setDistrictMetro.id != "") {
      //     postData.metro_line_id = info.setDistrictMetro.id
      //     let str_ids = ''
      //     info.setDresslistMetro.forEach((item) => {
      //       if (item.id != "") {
      //         str_ids += item.id + ","
      //       } else {
      //         str_ids = ''
      //         return;
      //       }
      //     })
      //     //去掉未尾的 ,
      //     str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
      //     postData.metro_station_ids = str_ids
      //   }
      // }
      //判断总价
      if (!commonUtils.utilCore.empty(info.setPriceTabFirst)) {
        let str_ids = ''
        info.setPriceTabFirst.forEach((item) => {
          str_ids += item.id + ","
        })
        //去掉未尾的 ,
        str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
        postData.price_ids = str_ids
      }
      //判断输入的总价
      if (
        !commonUtils.utilCore.empty(info.setPriceFirstVal)
        && info.setPriceFirstVal.length == 2
        && (!commonUtils.utilCore.empty(info.setPriceFirstVal[0]) || info.setPriceFirstVal[0] == '0')
        && !commonUtils.utilCore.empty(info.setPriceFirstVal[1])
      ) {
        postData.price_min = info.setPriceFirstVal[0]
        postData.price_max = info.setPriceFirstVal[1]
      }
      //判断单价
      if (!commonUtils.utilCore.empty(info.setPriceTabSecond)) {
        let str_ids = ''
        info.setPriceTabSecond.forEach((item) => {
          str_ids += item.id + ","
        })
        //去掉未尾的 ,
        str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
        postData.average_price_ids = str_ids
      }
      //判断输入的单价
      if (
        !commonUtils.utilCore.empty(info.setPriceSecondVal)
        && info.setPriceSecondVal.length == 2
        && (!commonUtils.utilCore.empty(info.setPriceSecondVal[0]) || info.setPriceSecondVal[0] == '0')
        && !commonUtils.utilCore.empty(info.setPriceSecondVal[1])
      ) {
        postData.average_price_min = info.setPriceSecondVal[0]
        postData.average_price_max = info.setPriceSecondVal[1]
      }

      //判断区域id
      if (!commonUtils.utilCore.empty(info.searchUptownId)) {
        postData.uptown_id = info.searchUptownId
      }

      //判断户型
      if (!commonUtils.utilCore.empty(info.setHuxing)) {
        let str_ids = ''
        info.setHuxing.forEach((item) => {
          if (item) {
            str_ids += item.id + ","
          }
        })
        //去掉未尾的 ,
        str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
        postData.layout_room_ids = str_ids
      }
      //判断建筑面积
      if (!commonUtils.utilCore.empty(info.setMoreArea)) {
        let str_ids = ''
        info.setMoreArea.forEach((item) => {
          if (item) {
            str_ids += item.id + ","
          }
        })
        //去掉未尾的 ,
        str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
        postData.acreage_ids = str_ids
      }
      //判断 物业类型id
      if (!commonUtils.utilCore.empty(info.setMorePropertyType)) {
        let str_ids = ''
        info.setMorePropertyType.forEach((item) => {
          if (item) {
            str_ids += item.id + ","
          }
        })
        //去掉未尾的 ,
        str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
        postData.house_type_ids = str_ids
      }
      //判断 装修类型id
      if (!commonUtils.utilCore.empty(info.setMoreRenovation)) {
        let str_ids = ''
        info.setMoreRenovation.forEach((item) => {
          if (item) {
            str_ids += item.id + ","
          }
        })
        //去掉未尾的 ,
        str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
        postData.decoration_ids = str_ids
      }

      //判断排序
      if (
        !commonUtils.utilCore.empty(info.setSortListVal)
      ) {
        let tmpSort = info.setSortListVal[0].val.split("~")
        if (tmpSort && tmpSort.length == 2) {
          postData.sort = tmpSort[0]
          postData.order = tmpSort[1]
        }
      }
      // 判断附近
      if (!commonUtils.utilCore.empty(info.setNearby)) {
        postData.areaType = 'nearby'
        postData.nearby_distance = info.setNearby.val
      }
      let res = await context.dispatch('map/getAppFangMapaBubbleRent', postData, { root: true });
      return res;
    },
    /**
      *  地图找房-新房-列表
      * @param {*} context 
      * @returns 
      */
    getAppFangMapaBubbleHouse: async function (context, postData) {
      let optionsRequest = { data: postData }
      let res = await commonProtocol.request(commonProtocol.map.appFangMapaBubbleHouse, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    //进行地图找房-新房-列表的搜索操作
    actAppFangMapaBubbleHouse: async function (context, info) {
      let postData = {
        bounds_max_lng: info.bounds_max_lng || "",//	新增 否	string	最大经度
        bounds_min_lng: info.bounds_min_lng || "",//	新增 否	string	最小经度
        bounds_max_lat: info.bounds_max_lat || "",//新增 否	string	最大纬度
        bounds_min_lat: info.bounds_min_lat || "",//新增 否	string	最小纬度
        zoom: info.zoom || '',//新增 否	string	地图缩放比例
        keyword: "",//否	string	关键字搜索
        areaType: "",//否	string	地区类型 area:地区 metro:地铁 nearby:附近
        district_id: "",//	否	string	一级地区id
        block_ids: "",//否	string	二级地区id 逗号分隔 不限为空
        metro_line_id: "",//否	string	地铁线路 id
        metro_station_ids: "",//否	string	地铁站点 逗号分隔 不限为空
        nearby_distance: "",//新增 否	string	距离 米
        longitude: info.longitude || "",//	新增 否	string	经度(定位)
        latitude: info.latitude || "",// 新增 否	string	纬度(定位)
        price_ids: "",//否	string	价格id查询 逗号分隔
        price_min: "",//否	string	最低价格(万)
        price_max: "",//否	string	最高价格(万)
        layout_room_ids: "",//否	string	户型id 逗号分隔
        acreage_ids: "",//否	string	建筑面积id 逗号分隔
        property_type_ids: "",//否	string	物业类型id 逗号分隔
        decoration_ids: "",//否	string	装修类型id 逗号分隔
        uptown_id: "", // 2023/3/13 新增通过小区搜索
      }


      //判断标签选择
      if (!commonUtils.utilCore.empty(info.setDiskIndex)) {
        let str_ids = ''
        info.setDiskIndex.forEach((item) => {
          if (item.id != "") {
            str_ids += item.id + ","
          } else {
            str_ids = ''
            return;
          }
        })
        //去掉未尾的 ,
        str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
        postData.second_tag_ids = str_ids
      }

      //判断是 区域 
      // if (!commonUtils.utilCore.empty(info.setDistrict) || !commonUtils.utilCore.empty(info.setDistrictList)) {
      //   postData.areaType = 'area'
      //   if (info.setDistrict.id != "") {
      //     postData.district_id = info.setDistrict.id
      //     let str_ids = ''
      //     info.setDistrictList.forEach((item) => {
      //       if (item.id != "") {
      //         str_ids += item.id + ","
      //       } else {
      //         str_ids = ''
      //         return;
      //       }
      //     })
      //     //去掉未尾的 ,
      //     str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
      //     postData.block_ids = str_ids
      //   }

      // }
      // //判断是 地铁
      // if (!commonUtils.utilCore.empty(info.setDistrictMetro) || !commonUtils.utilCore.empty(info.setDresslistMetro)) {
      //   postData.areaType = 'metro'
      //   if (info.setDistrictMetro.id != "") {
      //     postData.metro_line_id = info.setDistrictMetro.id
      //     let str_ids = ''
      //     info.setDresslistMetro.forEach((item) => {
      //       if (item.id != "") {
      //         str_ids += item.id + ","
      //       } else {
      //         str_ids = ''
      //         return;
      //       }
      //     })
      //     //去掉未尾的 ,
      //     str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
      //     postData.metro_station_ids = str_ids
      //   }
      // }
      //判断总价
      if (!commonUtils.utilCore.empty(info.setPriceTabFirst)) {
        let str_ids = ''
        info.setPriceTabFirst.forEach((item) => {
          str_ids += item.id + ","
        })
        //去掉未尾的 ,
        str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
        postData.price_ids = str_ids
      }
      //判断输入的总价
      if (
        !commonUtils.utilCore.empty(info.setPriceFirstVal)
        && info.setPriceFirstVal.length == 2
        && (!commonUtils.utilCore.empty(info.setPriceFirstVal[0]) || info.setPriceFirstVal[0] == '0')
        && !commonUtils.utilCore.empty(info.setPriceFirstVal[1])
      ) {
        postData.price_min = info.setPriceFirstVal[0]
        postData.price_max = info.setPriceFirstVal[1]
      }
      //判断单价
      if (!commonUtils.utilCore.empty(info.setPriceTabSecond)) {
        let str_ids = ''
        info.setPriceTabSecond.forEach((item) => {
          str_ids += item.id + ","
        })
        //去掉未尾的 ,
        str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
        postData.average_price_ids = str_ids
      }
      //判断输入的单价
      if (
        !commonUtils.utilCore.empty(info.setPriceSecondVal)
        && info.setPriceSecondVal.length == 2
        && (!commonUtils.utilCore.empty(info.setPriceSecondVal[0]) || info.setPriceSecondVal[0] == '0')
        && !commonUtils.utilCore.empty(info.setPriceSecondVal[1])
      ) {
        postData.average_price_min = info.setPriceSecondVal[0]
        postData.average_price_max = info.setPriceSecondVal[1]
      }

      //判断区域id
      if (!commonUtils.utilCore.empty(info.searchUptownId)) {
        postData.uptown_id = info.searchUptownId
      }

      //判断户型
      if (!commonUtils.utilCore.empty(info.setHuxing)) {
        let str_ids = ''
        info.setHuxing.forEach((item) => {
          if (item) {
            str_ids += item.id + ","
          }
        })
        //去掉未尾的 ,
        str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
        postData.layout_room_ids = str_ids
      }
      //判断建筑面积
      if (!commonUtils.utilCore.empty(info.setMoreArea)) {
        let str_ids = ''
        info.setMoreArea.forEach((item) => {
          if (item) {
            str_ids += item.id + ","
          }
        })
        //去掉未尾的 ,
        str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
        postData.acreage_ids = str_ids
      }
      //判断 物业类型id
      if (!commonUtils.utilCore.empty(info.setMorePropertyType)) {
        let str_ids = ''
        info.setMorePropertyType.forEach((item) => {
          if (item) {
            str_ids += item.id + ","
          }
        })
        //去掉未尾的 ,
        str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
        postData.property_type_ids = str_ids
      }
      //判断 装修类型id
      if (!commonUtils.utilCore.empty(info.setMoreRenovation)) {
        let str_ids = ''
        info.setMoreRenovation.forEach((item) => {
          if (item) {
            str_ids += item.id + ","
          }
        })
        //去掉未尾的 ,
        str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
        postData.decoration_ids = str_ids
      }

      //判断排序
      if (
        !commonUtils.utilCore.empty(info.setSortListVal)
      ) {
        let tmpSort = info.setSortListVal[0].val.split("~")
        if (tmpSort && tmpSort.length == 2) {
          postData.sort = tmpSort[0]
          postData.order = tmpSort[1]
        }
      }
      // 判断附近
      if (!commonUtils.utilCore.empty(info.setNearby)) {
        postData.areaType = 'nearby'
        postData.nearby_distance = info.setNearby.val
      }
      let res = await context.dispatch('map/getAppFangMapaBubbleHouse', postData, { root: true });
      return res;
    },
    /**
   *  获取板块在售的一个定位
   * @param {*} context 
   * @returns 
   */
    getAppFangMapaGetPosition: async function (context, postData) {
      let optionsRequest = { data: {} }
      optionsRequest.data = {
        ...postData
      }

      let res = await commonProtocol.request(commonProtocol.map.appFangMapaGetPosition, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
  }
}

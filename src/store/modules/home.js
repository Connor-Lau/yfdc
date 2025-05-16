import commonUtils from '@/common/utils/index.js'
import commonCaches from '@/common/caches/index.js'
import commonProtocol from '@/common/protocols/index.js'
import appConfig from '@/common/configs/index.js'

const home = {
  namespaced: true,
  state: {
    searchPostGetData: {},//搜索参数值
    screenMergeListData: {}, // 合并列表二手房筛选参数
    newsaleInfo: {}, // 新房更多信息
    saleDeatialInfo: {}, //二手房详情更多信息
    appointmentbroker: {}, // 预约的经纪人
  },
  mutations: {// 使用mutations直接更改state的值
    //设置 搜索参数值
    setSearchPostGetData (state, info) {
      state.searchPostGetData = commonUtils.utilCore.deepClone(info)
      commonUtils.appLog.log("setSearchPostGetData===>>", info)
    },
    //设置 合并列表筛选参数
    setScreenMergeListData (state, info) {
      state.screenMergeListData = commonUtils.utilCore.deepClone(info)
      commonUtils.appLog.log("setScreenMergeListData===>>", info)
    },
    changeNewsaleInfo (state, info) {
      state.newsaleInfo = info
    },
    //设置 二手房详情更多信息
    setSaleDeatialInfo (state, info) {
      state.saleDeatialInfo = info;
    },
    // 存储 推荐的经纪人
    setAppointmentbroker (state, info) {
      state.appointmentbroker = info;
    },
  },
  actions: {
    //首页推荐二手房列表
    /**
     * 
     * @param {*} context 
     * @param {*} postData = {
          city_id:"城市ID"
          page_size:"每页条数"
          page:"当前页码"
      } 
     * @returns 
     */
    getAppFangIndexGetLastSale: async function (context, postData) {
      let optionsRequest = {
        data: {
          city_id: postData.city_id,//	否	string	城市id 默认8广州
          page_size: postData.page_size || 10,//	否	string	每页显示数 默认10 最大20
          page: postData.page || '',	//否	string	页码 默认1
          update_time: postData.update_time || '',//	否	string	上一页最后一条数据的更新时间 此参数存在时page无效
        }
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangIndexGetLastSale, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        //这里要把加载的内容记录到vuex里
        res = commonUtils.utilCore.deepClone(res.data.data)
        return res;
      }
      return false;
    },
    //首页推荐新房列表
    /**
     * 
     * @param {*} context 
     * @param {*} postData = {
          city_id:"城市ID"
          page_size:"每页条数"
          page:"当前页码"
      } 
     * @returns 
     */
    getAppFangIndexGetLastHouse: async function (context, postData) {
      let optionsRequest = {
        data: {
          city_id: postData.city_id,//	否	string	城市id 默认8广州
          page_size: postData.page_size || 10,//	否	string	每页显示数 默认10 最大20
          page: postData.page || '',	//否	string	页码 默认1
          update_time: postData.update_time || '',//	否	string	上一页最后一条数据的更新时间 此参数存在时page无效
        }
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangIndexGetLastHouse, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        //这里要把加载的内容记录到vuex里
        res = commonUtils.utilCore.deepClone(res.data.data)
        return res;
      }
      return false;
    },
    //首页租房推荐列表
    /**
     * 
     * @param {*} context 
     * @param {*} postData = {
          city_id:"城市ID"
          page_size:"每页条数"
          page:"当前页码"
      } 
     * @returns 
     */
    getAppFangIndexGetLastRent: async function (context, postData) {
      let optionsRequest = {
        data: {
          city_id: postData.city_id,//	否	string	城市id 默认8广州
          page_size: postData.page_size || 10,//	否	string	每页显示数 默认10 最大20
          page: postData.page || '',	//否	string	页码 默认1
          update_time: postData.update_time || '',//	否	string	上一页最后一条数据的更新时间 此参数存在时page无效
        }
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangIndexGetLastRent, optionsRequest)

      console.log(res)
      if (res && res.data && res.data.code && res.data.code == 200) {
        //这里要把加载的内容记录到vuex里
        res = commonUtils.utilCore.deepClone(res.data.data)
        return res;
      }
      return false;
    },
    //新房详情页
    /**
     * 
     * @param {*} context 
     * @param {*} postData = {
          id:""
      } 
     * @returns 
     */
    getAppFangHouseGetNewDetail: async function (context, postData) {
      let optionsRequest = {
        data: {
          id: postData.id
        }
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangHouseGetNewDetail, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        //这里要把加载的内容记录到vuex里
        res = commonUtils.utilCore.deepClone(res.data.data)
        return res;
      }
      return false;
    },
    /**
     * 区域列表
     * @param {*} context 
     * @returns 
     */
    getAppGetAreaTree: async function (context, postData) {
      let optionsRequest = { data: {} }
      optionsRequest.data.city_id = postData.city_id

      commonUtils.appLog.log("提交的参数===========》》》", optionsRequest)

      let res = await commonProtocol.request(commonProtocol.home.appFangBaseDataGetAreaTree, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
     * 地铁列表
     * @param {*} context 
     * @returns 
     */
    getAppGetMetroTree: async function (context, postData) {
      let optionsRequest = { data: {} }
      optionsRequest.data.city_id = postData.city_id

      let res = await commonProtocol.request(commonProtocol.home.appFangBaseDataGetMetroTree, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
     *  价格区间列表（新房二手房）
     * @param {*} context 
     * @returns 
     */
    getAppBase_shouse_total_price: async function (context) {
      let optionsRequest = {
        data: {
        }
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangBaseDataGetDataBase_shouse_total_price, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
     *  户型列表
     * @param {*} context 
     * @returns 
     */
    getAppBase_layout_room: async function (context) {
      let optionsRequest = {
        data: {
        }
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangBaseDataGetDataBase_layout_room, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
     *  建筑面积列表
     * @param {*} context 
     * @returns 
     */
    getAppBase_acreage: async function (context) {
      let optionsRequest = {
        data: {
        }
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangBaseDataGetDataBase_acreage, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
      *  单价列表(新房)
      * @param {*} context 
      * @returns 
      */
    getAppBase_loupan_unit_price: async function (context) {
      let optionsRequest = {
        data: {
        }
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangBaseDataGetDataBase_loupan_unit_price, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
      *  价格区间列表（租房）
      * @param {*} context 
      * @returns 
      */
    getAppBase_rent_price: async function (context) {
      let optionsRequest = {
        data: {
        }
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangBaseDataGetDataBase_rent_price, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
      *  物业类型-二手房/租房
      * @param {*} context 
      * @returns 
      */
    getAppBase_house_type: async function (context) {
      let optionsRequest = {
        data: {
        }
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangBaseDataGetDataBase_house_type, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
      *  物业类型-新房
      * @param {*} context 
      * @returns 
      */
    getAppBase_property_type: async function (context) {
      let optionsRequest = {
        data: {
        }
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangBaseDataGetDataBase_property_type, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
      *  装修情况列表
      * @param {*} context 
      * @returns 
      */
    getAppBase_decoration: async function (context) {
      let optionsRequest = {
        data: {
        }
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangBaseDataGetDataBase_decoration, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
      *  详情页-租房
      * @param {*} context 
      * @returns 
      */
    rentDetail: async function (context, postData) {
      let param = {};
      param = commonUtils.utilCore.deepClone(postData);
      if (commonUtils.utilCore.empty(param.id)) {
        commonUtils.appLog.log("数据不完整：", param);
        return false;
      }
      let optionsRequest = {
        data: param,
      };
      let res = await commonProtocol.request(commonProtocol.home.appFangRentDetail, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },

    /**
      *  周边配套及通勤-标题列表
      * @param {*} context 
      * @returns 
      */
    nearbyGetField: async function (context, postData) {
      let param = {};
      param = commonUtils.utilCore.deepClone(postData);
      let optionsRequest = {
        data: param,
      };
      let res = await commonProtocol.request(commonProtocol.home.appWechatNearbyGetField, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },

    /**
      *  周边配套及通勤-内容列表
      * @param {*} context 
      * @returns 
      */
    nearbyGetIndex: async function (context, postData) {
      let param = {};
      param = commonUtils.utilCore.deepClone(postData);
      if (commonUtils.utilCore.empty(param.type)) {
        commonUtils.appLog.log("数据不完整：", param);
        return false;
      }
      let optionsRequest = {
        data: param,
      };
      let res = await commonProtocol.request(commonProtocol.home.appWechatNearbyGetIndex, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
      *  详情页-二手房
      * @param {*} context 
      * @returns 
      */
    getAppSaleDetail: async function (context, postData) {
      let optionsRequest = {
        data: postData
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangSaleDetail, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
      *  房源小区关键字搜索
      * @param {*} context 
      * @returns 
      */
    getAppFangToolsUptownSearch: async function (context, postData) {
      let optionsRequest = { data: {} }
      // optionsRequest.data.city_id = postData.city_id
      // optionsRequest.data.keyword = postData.keyword  //	否	string	搜索内容
      // optionsRequest.data.type = postData.type //	是	string	类型 sale 二手房，rent 租房，house新房
      optionsRequest.data = {
        ...postData
      }

      let res = await commonProtocol.request(commonProtocol.home.appFangToolsUptownSearch, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
      *  列表-二手房
      * @param {*} context 
      * @returns 
      */
    getAppFangSaleLists: async function (context, postData) {
      let optionsRequest = { data: postData }
      let res = await commonProtocol.request(commonProtocol.home.appFangSaleLists, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },

    //进行二手房列表的搜索操作（可以分页，并处理并键字）
    actAppFangSaleLists: async function (context, info) {
      let postData = {
        city_id: info.city_id,//	否	string	城市id 默认8
        page: info.page,//	否	string	页码 默认1
        page_size: info.page_size,//	否	string	每页显示数 默认10
        keyword: info.searchKeyWord || "",//	否	string	关键字搜索 2023/1/3改为通过小区id查询不用keyword  2023/2/28又有关键词搜索了
        areaType: "",//	否	string	地区类型 area:地区 metro:地铁
        district_id: "",//	否	string	一级地区id
        block_ids: "",//	否	string	二级地区id 逗号分隔 不限为空
        metro_line_id: "",//	否	string	地铁线路 id
        metro_station_ids: "",//	否	string	地铁站点 逗号分隔 不限为空
        price_ids: "",//	否	string	价格id查询 逗号分隔
        price_min: "",//	否	string	最低价格(万)
        price_max: "",//	否	string	最高价格(万)
        layout_room_ids: "",//	否	string	户型id 逗号分隔
        acreage_ids: "",//	否	string	建筑面积id 逗号分隔
        second_tag_ids: "",//否	string	二级标签搜索id 逗号分隔
        average_price_ids: "", //	否	string	单价id查询 逗号分隔
        average_price_min: "", //	否	string	最低单价 (万)
        average_price_max: "", //	否	string	最高单价 (万)
        house_type_ids: "", //	否	string	物业类型id 逗号分隔
        decoration_ids: "", //	否	string	装修类型id 逗号分隔
        sort: "", //	否	string	排序字段 update_time:最新 price:总价 average_price:单价 acreage_cover:面积
        order: "", //	否	string	正倒序 asc:正序 desc:倒序
        uptown_id: info.searchUptownId,//	否	string	小区id
        update_time: info.update_time || '',	//否	string	上一页最后一条数据的更新时间 此参数存在时page无效
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
      if (!commonUtils.utilCore.empty(info.setDistrict) || !commonUtils.utilCore.empty(info.setDistrictList)) {
        postData.areaType = 'area'
        if (info.setDistrict.id != "") {
          postData.district_id = info.setDistrict.id
          let str_ids = ''
          info.setDistrictList.forEach((item) => {
            if (item.id != "") {
              str_ids += item.id + ","
            } else {
              str_ids = ''
              return;
            }
          })
          //去掉未尾的 ,
          str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
          postData.block_ids = str_ids
        }

      }
      //判断是 地铁
      if (!commonUtils.utilCore.empty(info.setDistrictMetro) || !commonUtils.utilCore.empty(info.setDresslistMetro)) {
        postData.areaType = 'metro'
        if (info.setDistrictMetro.id != "") {
          postData.metro_line_id = info.setDistrictMetro.id
          let str_ids = ''
          info.setDresslistMetro.forEach((item) => {
            if (item.id != "") {
              str_ids += item.id + ","
            } else {
              str_ids = ''
              return;
            }
          })
          //去掉未尾的 ,
          str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
          postData.metro_station_ids = str_ids
        }
      }
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
      let res = await context.dispatch('home/getAppFangSaleLists', postData, { root: true });
      return res;
    },
    /**
      *  周边配套及通勤-内容列表
      * @param {*} context 
      * @returns 
      */
    getAppWechatNearbyIndex: async function (context, postData) {
      let optionsRequest = {
        data: postData || {}
      }
      let res = await commonProtocol.request(commonProtocol.home.appWechatNearbyIndex, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
      *  周边配套及通勤-标题列表
      * @param {*} context 
      * @returns 
      */
    getAppWechatNearbyGetField: async function (context, postData) {
      let optionsRequest = {
        data: postData || {}
      }
      let res = await commonProtocol.request(commonProtocol.home.appWechatNearbyGetField, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
      *  推荐租房列表
      * @param {*} context 
      * @returns 
      */
    appFangRentListRecommend: async function (context, postData) {
      let optionsRequest = {
        data: postData || {}
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangRentListRecommend, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
      *  房源详情-推荐二手房列表
      * @param {*} context 
      * @returns 
      */
    getAppFangSalelistRecommend: async function (context, postData) {
      let optionsRequest = {
        data: postData || {}
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangSalelistRecommend, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
      *  房源详情-推荐新房列表
      * @param {*} context 
      * @returns 
      */
    getAppFangHouselistRecommend: async function (context, postData) {
      let optionsRequest = {
        data: postData || {}
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangHouselistRecommend, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
      *   二级标签-二手房
      * @param {*} context 
      * @returns 
      */
    getAppFangSaleGetSecondTag: async function (context) {
      let optionsRequest = {
        data: {}
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangSaleGetSecondTag, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
    *   二级标签-新房
    * @param {*} context 
    * @returns 
    */
    getAppFangHouseGetSecondTag: async function (context) {
      let optionsRequest = {
        data: {}
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangHouseGetSecondTag, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
    *   二级标签-租房
    * @param {*} context 
    * @returns 
    */
    getAppFangRentGetSecondTag: async function (context) {
      let optionsRequest = {
        data: {}
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangRentGetSecondTag, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
    *  房源详情-关注
    * @param {*} context 
    * @returns 
    */
    addAppFangFavorite: async function (context, postData) {
      let optionsRequest = {
        data: postData || {}
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangFavoriteAdd, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
    *  房源详情-是否已关注
    * @param {*} context 
    * @returns 
    */
    getAppFangFavoriteStatus: async function (context, postData) {
      let optionsRequest = {
        data: postData || {}
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangFavoriteStatus, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
    *  房源详情-取消关注
    * @param {*} context 
    * @returns 
    */
    cancelAppFangFavorite: async function (context, postData) {
      let optionsRequest = {
        data: postData || {}
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangFavoriteCancel, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
    *  房源详情-推荐经纪人
    * @param {*} context 
    * @returns 
    */
    getAppWechatNearbyGetRecommendBroker: async function (context, postData) {
      let optionsRequest = {
        data: postData || {}
      }
      let res = await commonProtocol.request(commonProtocol.home.appWechatNearbyGetRecommendBroker, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
      *  列表-新房
      * @param {*} context 
      * @returns  
      */
    getAppFangHouseLists: async function (context, postData) {
      let optionsRequest = { data: postData }
      let res = await commonProtocol.request(commonProtocol.home.appFangHouseLists, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },

    //进行新房列表的搜索操作（可以分页，并处理并键字）
    actAppFangHouseLists: async function (context, info) {
      let postData = {
        city_id: info.city_id,//	否	string	城市id 默认8
        page: info.page || 1,//	否	string	页码 默认1
        page_size: info.page_size || 10,//	否	string	每页显示数 默认10
        keyword: info.searchKeyWord || "",//	否	string	关键字搜索
        areaType: "",//	否	string	地区类型 area:地区 metro:地铁
        district_id: "",//	否	string	一级地区id
        block_ids: "",//	否	string	二级地区id 逗号分隔 不限为空
        metro_line_id: "",//	否	string	地铁线路 id
        metro_station_ids: "",//	否	string	地铁站点 逗号分隔 不限为空
        price_ids: "",//	否	string	价格id查询 逗号分隔
        price_min: "",//	否	string	最低价格(万)
        price_max: "",//	否	string	最高价格(万)
        second_tag_ids: "",//否	string	二级标签搜索id 逗号分隔
        average_price_ids: "", //	否	string	单价id查询 逗号分隔
        average_price_min: "", //	否	string	最低单价 (万)
        average_price_max: "", //	否	string	最高单价 (万)
        property_type_ids: "", //	否	string	物业类型id 逗号分隔
        sort: "", //	否	string	排序字段 update_time:最新 open_time:开盘 average_price:均价
        order: "", //	否	string	正倒序 asc:正序 desc:倒序
        loupan_ids: info.searchLoupanIds || "",//  楼盘ID查询  多个逗号分隔
      }
      //判断标签选择(这个是单选的)
      // if (!commonUtils.utilCore.empty(info.setDiskIndex) && info.setDiskIndex != -1) {
      //   postData.second_tag_ids = info.setDiskIndex;
      // }
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
      if (!commonUtils.utilCore.empty(info.setDistrict) || !commonUtils.utilCore.empty(info.setDistrictList)) {
        postData.areaType = 'area'
        //如果选择 的不是 不限
        if (info.setDistrict.id != "") {
          postData.district_id = info.setDistrict.id
          let str_ids = ''
          info.setDistrictList.forEach((item) => {
            //如果选择 的不是 不限
            if (item.id != "") {
              str_ids += item.id + ","
            } else {
              str_ids = ''
              return;
            }
          })
          //去掉未尾的 ,
          str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
          postData.block_ids = str_ids
        }
      }
      //判断是 地铁
      if (!commonUtils.utilCore.empty(info.setDistrictMetro) || !commonUtils.utilCore.empty(info.setDresslistMetro)) {
        postData.areaType = 'metro'
        if (info.setDistrictMetro.id != "") {
          postData.metro_line_id = info.setDistrictMetro.id
          let str_ids = ''
          info.setDresslistMetro.forEach((item) => {
            //如果选择 的不是 不限
            if (item.id != "") {
              str_ids += item.id + ","
            } else {
              str_ids = ''
              return;
            }
          })
          //去掉未尾的 ,
          str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
          postData.metro_station_ids = str_ids
        }
      }
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
      //判断 物业类型
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

      let res = await context.dispatch('home/getAppFangHouseLists', postData, { root: true });
      return res;
    },
    /**
      *  列表-租房
      * @param {*} context 
      * @returns  
      */
    getAppFangRentLists: async function (context, postData) {
      let optionsRequest = { data: postData }
      let res = await commonProtocol.request(commonProtocol.home.appFangRentLists, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },

    //进行租房列表的搜索操作（可以分页，并处理并键字）
    actAppFangRentLists: async function (context, info) {
      let postData = {
        city_id: info.city_id,//	否	string	城市id 默认8
        page: info.page || 1,//	否	string	页码 默认1
        page_size: info.page_size || 10,//	否	string	每页显示数 默认10
        keyword: info.searchKeyWord || "",//	否	string	关键字搜索
        areaType: "",//	否	string	地区类型 area:地区 metro:地铁
        district_id: "", //	否	string	一级地区id
        block_ids: "", //	否	string	二级地区id 逗号分隔 不限为空
        metro_line_id: "", //	否	string	地铁线路 id
        metro_station_ids: "", //	否	string	地铁站点 逗号分隔 不限为空
        price_ids: "", //	否	string	价格id查询 逗号分隔
        price_min: "", //	否	string	最低价格 (万)
        price_max: "", //	否	string	最高价格 (万)
        second_tag_ids: "", //	否	string	二级标签搜索id 逗号分隔
        layout_room_ids: "", //	否	string	户型id 逗号分隔
        acreage_ids: "", //	否	string	建筑面积id 逗号分隔
        house_type_ids: "", //	否	string	物业类型 逗号分隔
        decoration_ids: "", //	否	string	装修类型id 逗号分隔
        sort: "", //	否	string	排序字段 update_time:最新 open_time:开盘 average_price:均价
        order: "", //	否	string	正倒序 asc:正序 desc:倒序
        acreage_max: "",//	否	string	最高平方数
        acreage_min: "",//	否	string	最低平方数
        uptown_id: info.searchUptownId,//	否	string	小区id
        update_time: info.update_time || '',	//否	string	上一页最后一条数据的更新时间 此参数存在时page无效
      }
      //判断标签选择(这个是单选的)
      // if (!commonUtils.utilCore.empty(info.setDiskIndex) && info.setDiskIndex != -1) {
      //   postData.second_tag_ids = info.setDiskIndex;
      // }
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
      if (!commonUtils.utilCore.empty(info.setDistrict) || !commonUtils.utilCore.empty(info.setDistrictList)) {
        postData.areaType = 'area'
        if (info.setDistrict.id != "") {
          postData.district_id = info.setDistrict.id
          let str_ids = ''
          info.setDistrictList.forEach((item) => {
            if (item.id != "") {
              str_ids += item.id + ","
            } else {
              str_ids = ''
              return;
            }
          })
          //去掉未尾的 ,
          str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
          postData.block_ids = str_ids
        }

      }
      //判断是 地铁
      if (!commonUtils.utilCore.empty(info.setDistrictMetro) || !commonUtils.utilCore.empty(info.setDresslistMetro)) {
        postData.areaType = 'metro'
        if (info.setDistrictMetro.id != "") {
          postData.metro_line_id = info.setDistrictMetro.id
          let str_ids = ''
          info.setDresslistMetro.forEach((item) => {
            if (item.id != "") {
              str_ids += item.id + ","
            } else {
              str_ids = ''
              return;
            }
          })
          //去掉未尾的 ,
          str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
          postData.metro_station_ids = str_ids
        }

      }
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
      //判断建筑面积(最小)
      if (!commonUtils.utilCore.empty(info.setAreaFirstVal)) {
        postData.acreage_min = info.setAreaFirstVal
      }
      //判断建筑面积(最大)
      if (!commonUtils.utilCore.empty(info.setAreaLastVal)) {
        postData.acreage_max = info.setAreaLastVal
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
      //判断 物业类型
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
      //判断 装修类型
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
      //判断区域id
      if (!commonUtils.utilCore.empty(info.searchUptownId)) {
        postData.uptown_id = info.searchUptownId
      }
      let res = await context.dispatch('home/getAppFangRentLists', postData, { root: true });
      return res;
    },

    /**
    *   更多楼盘信息-新房
    * @param {*} context 
    * @returns 
    */
    getAppFangHouseGetDetailInfo: async function (context, postData) {
      let optionsRequest = {
        data: postData
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangHouseGetDetailInfo, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },


    /**
    *   楼盘详情-小区详情
    * @param {*} context 
    * @returns 
    */
    getAppFangUptowndetail: async function (context, postData) {
      let optionsRequest = {
        data: postData
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangUptowndetail, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },

    /**
    *   小区详情-附近门店
    * @param {*} context 
    * @returns 
    */
    getAppFangStorenear: async function (context, postData) {
      let optionsRequest = {
        data: postData
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangStorenear, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },

    /**
    *    预约看二手房-经纪人列表
    * @param {*} context 
    * @returns 
    */
    getAppFangBrokerlists: async function (context, postData) {
      let optionsRequest = {
        data: postData
      }
      let res = await commonProtocol.request(commonProtocol.home.appFangBrokerlists, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },

    /**
    *    预约看二手房-提交数据
    * @param {*} context 
    * @returns 
    */
    getAppointSeeHouseDo: async function (context, postData) {
      let optionsRequest = {
        data: postData
      }
      let res = await commonProtocol.request(commonProtocol.home.appAppointSeeHouseDo, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data;
      }
      return false;
    },


    /**
      *  成交列表-二手房
      * @param {*} context 
      * @returns 
      */
    getAppFangDealShouseList: async function (context, postData) {
      let optionsRequest = { data: postData }
      let res = await commonProtocol.request(commonProtocol.home.appFangDealShouseList, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },


    //进行成交列表-二手房的搜索操作（可以分页，并处理并键字）
    actAppFangDealShouseList: async function (context, info) {
      let postData = {
        city_id: info.city_id,//	否	string	城市id 默认8
        page: info.page,//	否	string	页码 默认1
        page_size: info.page_size,//	否	string	每页显示数 默认10
        keyword: info.searchKeyWord || "",//	否	string	关键字搜索
        areaType: "",//	否	string	地区类型 area:地区 metro:地铁
        district_id: "",//否	string	一级地区id
        block_ids: "",//	否	string	二级地区id 逗号分隔 不限为空
        metro_line_id: "",//否	string	地铁线路 id
        metro_station_ids: "",//	否	string	地铁站点 逗号分隔 不限为空
        layout_room_ids: "",//	否	string	户型id 逗号分隔
        layout_hall_id: "",	//否	string	厅型id
        uptown_id: info.searchUptownId,// 小区id
        sign_time: info.setYear || "",//否	string	成交年份 例:2020
      }

      //判断是 区域 
      if (!commonUtils.utilCore.empty(info.setDistrict) || !commonUtils.utilCore.empty(info.setDistrictList)) {
        postData.areaType = 'area'
        if (info.setDistrict.id != "") {
          postData.district_id = info.setDistrict.id
          let str_ids = ''
          info.setDistrictList.forEach((item) => {
            if (item.id != "") {
              str_ids += item.id + ","
            } else {
              str_ids = ''
              return;
            }
          })
          //去掉未尾的 ,
          str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
          postData.block_ids = str_ids
        }
      }
      //判断是 地铁
      if (!commonUtils.utilCore.empty(info.setDistrictMetro) || !commonUtils.utilCore.empty(info.setDresslistMetro)) {
        postData.areaType = 'metro'
        if (info.setDistrictMetro.id != "") {
          postData.metro_line_id = info.setDistrictMetro.id
          let str_ids = ''
          info.setDresslistMetro.forEach((item) => {
            if (item.id != "") {
              str_ids += item.id + ","
            } else {
              str_ids = ''
              return;
            }
          })
          //去掉未尾的 ,
          str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
          postData.metro_station_ids = str_ids
        }
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
      //判断厅数
      if (info.setLayouthall) {
        postData.layout_hall_id = info.setLayouthall
      }
      //判断年份
      if (!commonUtils.utilCore.empty(info.setYear)) {
        postData.sign_time = info.setYear[0].val
      }
      let res = await context.dispatch('home/getAppFangDealShouseList', postData, { root: true });
      return res;
    },

    /**
      *  成交列表-租房
      * @param {*} context 
      * @returns 
      */
    getAppFangDealRentList: async function (context, postData) {
      let optionsRequest = { data: postData }
      let res = await commonProtocol.request(commonProtocol.home.appFangDealRentList, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    //进行成交列表-租房的搜索操作（可以分页，并处理并键字）
    actAppFangDealRentList: async function (context, info) {
      let postData = {
        city_id: info.city_id,//	否	string	城市id 默认8
        page: info.page,//	否	string	页码 默认1
        page_size: info.page_size,//	否	string	每页显示数 默认10
        keyword: info.searchKeyWord || "",//	否	string	关键字搜索
        areaType: "",//	否	string	地区类型 area:地区 metro:地铁
        district_id: "",//否	string	一级地区id
        block_ids: "",//	否	string	二级地区id 逗号分隔 不限为空
        metro_line_id: "",//否	string	地铁线路 id
        metro_station_ids: "",//	否	string	地铁站点 逗号分隔 不限为空
        layout_room_ids: "",//	否	string	户型id 逗号分隔
        layout_hall_id: "",	//否	string	厅型id
        uptown_id: info.searchUptownId,// 小区id
        sign_time: info.setYear || "",//否	string	成交年份 例:2020
      }

      //判断是 区域 
      if (!commonUtils.utilCore.empty(info.setDistrict) || !commonUtils.utilCore.empty(info.setDistrictList)) {
        postData.areaType = 'area'
        if (info.setDistrict.id != "") {
          postData.district_id = info.setDistrict.id
          let str_ids = ''
          info.setDistrictList.forEach((item) => {
            if (item.id != "") {
              str_ids += item.id + ","
            } else {
              str_ids = ''
              return;
            }
          })
          //去掉未尾的 ,
          str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
          postData.block_ids = str_ids
        }
      }
      //判断是 地铁
      if (!commonUtils.utilCore.empty(info.setDistrictMetro) || !commonUtils.utilCore.empty(info.setDresslistMetro)) {
        postData.areaType = 'metro'
        if (info.setDistrictMetro.id != "") {
          postData.metro_line_id = info.setDistrictMetro.id
          let str_ids = ''
          info.setDresslistMetro.forEach((item) => {
            if (item.id != "") {
              str_ids += item.id + ","
            } else {
              str_ids = ''
              return;
            }
          })
          //去掉未尾的 ,
          str_ids = str_ids.substr(-1) == "," ? str_ids.substr(0, str_ids.length - 1) : str_ids
          postData.metro_station_ids = str_ids
        }
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
      //判断厅数
      if (info.setLayouthall) {
        postData.layout_hall_id = info.setLayouthall
      }
      //判断年份
      if (!commonUtils.utilCore.empty(info.setYear)) {
        postData.sign_time = info.setYear[0].val
      }
      let res = await context.dispatch('home/getAppFangDealRentList', postData, { root: true });
      return res;
    },

    /**
      * 成交详情-二手房
      * @param {*} context 
      * @returns 
      */
    getAppFangDealShouseDetail: async function (context, postData) {
      let optionsRequest = { data: postData }
      let res = await commonProtocol.request(commonProtocol.home.appFangDealShouseDetail, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },

    /**
      *  成交详情-租房
      * @param {*} context 
      * @returns 
      */
    getAppFangDealRentDetail: async function (context, postData) {
      let optionsRequest = { data: postData }
      let res = await commonProtocol.request(commonProtocol.home.appFangDealRentDetail, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },


    /**
      *  房源小区/新房（二手房）关键字搜索
      * @param {*} context 
      * @returns 
      */
    getAppFangToolsAsearch: async function (context, postData) {
      let optionsRequest = { data: {} }
      optionsRequest.data = {
        ...postData
      }

      let res = await commonProtocol.request(commonProtocol.home.appFangToolsAsearch, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },

    /**
     *  成交-小区搜索
     * @param {*} context 
     * @returns 
     */
    getAppFangcDealaUptownSearch: async function (context, postData) {
      let optionsRequest = { data: {} }
      optionsRequest.data = {
        ...postData
      }

      let res = await commonProtocol.request(commonProtocol.home.appFangcDealaUptownSearch, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
     *  成交-小区成交均价（二手房）
     * @param {*} context 
     * @returns 
     */
    getAppFangcDealaUptownPrice: async function (context, postData) {
      let optionsRequest = { data: {} }
      optionsRequest.data = {
        ...postData
      }

      let res = await commonProtocol.request(commonProtocol.home.appFangcDealaUptownPrice, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },

    /**
    *  成交-小区成交均价(租房)
    * @param {*} context 
    * @returns 
    */
    getAppFangcDealaUptownRentPrice: async function (context, postData) {
      let optionsRequest = { data: {} }
      optionsRequest.data = {
        ...postData
      }

      let res = await commonProtocol.request(commonProtocol.home.appFangcDealaUptownRentPrice, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },

    /**
    *  拨打电话前调此接口 
    * @param {*} context 
    * @returns 
    */
    getAppWechatcSummaryAdd: async function (context, postData) {
      let optionsRequest = { data: {} }
      optionsRequest.data = {
        ...postData
      }

      let res = await commonProtocol.request(commonProtocol.home.appWechatcSummaryAdd, optionsRequest)
      if (res && res.data && res.data.code) {
        return res.data;
      }
      return false;
    },
    /**
    *  小区全国搜索
    * @param {*} context 
    * @returns 
    */
    getAppFangcUptownaSearchAll: async function (context, postData) {
      let optionsRequest = { data: {} }
      optionsRequest.data = {
        ...postData
      }

      let res = await commonProtocol.request(commonProtocol.home.appFangcUptownaSearchAll, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
    *  全国小区模糊关联搜索 -- 切换城市用
    * @param {*} context 
    * @returns 
    */
    getAppFangcUptownaSearchOther: async function (context, postData) {
      let optionsRequest = { data: {} }
      optionsRequest.data = {
        ...postData
      }

      let res = await commonProtocol.request(commonProtocol.home.appFangcUptownaSearchOther, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },
    /**
    *   客服提示
    * @param {*} context 
    * @returns 
    */
    getAppGetDefaultChatCustomer: async function (context, postData) {
      let optionsRequest = {
        data: postData
      }
      let res = await commonProtocol.request(commonProtocol.home.wechatNewImGetDefaultChatCustomer, optionsRequest)
      if (res && res.data && res.data.code && res.data.code == 200) {
        return res.data.data;
      }
      return false;
    },


  }
}
export default home

const mapJS = {
  async initPage () {
    let res = "";
    //区域列表
    let postData = {
      city_id: this.$route.query.city_id || this.switchCityInfo.city_id || 8
    }
    res = await this.$store.dispatch('home/getAppGetAreaTree', postData);
    if (res && res[postData.city_id]) {
      // this.$commonUtils.appLog.log("返回结果", res)
      this.district = []
      //增加 不限 的选项 
      this.district.push({
        id: "",
        name: "不限",
        sort: 0,
        children: []
      })
      for (let key in res[postData.city_id]) {
        let tmp_item = res[postData.city_id][key];
        let item = {
          "id": tmp_item.area_id,
          "name": tmp_item.area_name,
          "parent_id": tmp_item.parent_id,
          "first_letter": tmp_item.first_letter,
          "longitude": tmp_item.third_longitude ? tmp_item.third_longitude == 0 ? tmp_item.longitude : tmp_item.third_longitude : tmp_item.longitude,
          "latitude": tmp_item.third_latitude ? tmp_item.third_latitude == 0 ? tmp_item.latitude : tmp_item.third_latitude : tmp_item.latitude,
          "site_id": tmp_item.site_id,
          "site_id_real": tmp_item.site_id_real,
          "online_status": tmp_item.online_status,
          "online_time": tmp_item.online_time,
          "erp_id": tmp_item.erp_id,
          "sort": tmp_item.sort,
          "children": [],
          "map_border": tmp_item.map_border,
        }
        item.children.push({
          id: "0",
          name: "不限",
          sort: 0,
        })
        for (let key2 in res[postData.city_id][key].children) {
          tmp_item = res[postData.city_id][key].children[key2];
          let item2 = {
            "id": tmp_item.area_id,
            "name": tmp_item.area_name,
            "parent_id": tmp_item.parent_id,
            "first_letter": tmp_item.first_letter,
            "longitude": tmp_item.third_longitude ? tmp_item.third_longitude == 0 ? tmp_item.longitude : tmp_item.third_longitude : tmp_item.longitude,
            "latitude": tmp_item.third_latitude ? tmp_item.third_latitude == 0 ? tmp_item.latitude : tmp_item.third_latitude : tmp_item.latitude,
            "site_id": tmp_item.site_id,
            "site_id_real": tmp_item.site_id_real,
            "online_status": tmp_item.online_status,
            "online_time": tmp_item.online_time,
            "erp_id": tmp_item.erp_id,
            "sort": tmp_item.sort,
            "map_border": tmp_item.map_border,
          }
          item.children.push(item2)
        }
        this.district.push(item)
        delete res[postData.city_id][key];

        //记录默认选择的地址
        if (this.listGetData.setDistrict && this.listGetData.setDistrict.hasOwnProperty('id') && this.listGetData.setDistrict.id == item.id) {
          this.addresslist = item.children;
        }
      }
      res = ""
    } else {
      this.$commonUtils.utilCore.showToast("初始化区域列表出错")
    }

    //地铁列表
    postData = {
      city_id: this.$route.query.city_id || this.switchCityInfo.city_id || 8
    }
    res = await this.$store.dispatch('home/getAppGetMetroTree', postData);
    if (res) {
      // this.$commonUtils.appLog.log("返回结果", res)
      this.districtMetro = []
      this.districtMetro.push({
        id: "",
        name: "不限",
        sort: 0,
        children: []
      })
      for (let key in res[postData.city_id]) {
        let tmp_item = res[postData.city_id][key];
        let item = {
          "id": tmp_item.metro_line_id,
          "name": tmp_item.metro_line_name,
          "metro_line_search_name": tmp_item.metro_line_search_name,
          "line_uid": tmp_item.line_uid,
          "metro_station_ids": tmp_item.metro_station_ids,
          "site_id": tmp_item.site_id,
          "sort": tmp_item.sort,
          "children": [],
          "longitude": tmp_item.longitude,
          "latitude": tmp_item.latitude
        }
        item.children.push({
          id: "0",
          name: "不限",
          sort: 0,
        })
        // 地铁
        // for (let key2 in res[postData.city_id][key].children) {
        //   tmp_item = res[postData.city_id][key].children[key2];

        let metro_station_ids = res[postData.city_id][key].metro_station_ids && res[postData.city_id][key].metro_station_ids.split(',') || []
        let children = res[postData.city_id][key].children
        for (let key2 in metro_station_ids) {
          for (let key3 in children) {
            if (children[key3].metro_station_id == metro_station_ids[key2]) {
              tmp_item = children[key3];
              let item2 = {
                "id": tmp_item.metro_station_id,
                "name": tmp_item.metro_station_name,
                "metro_line_ids": tmp_item.metro_line_ids,
                "longitude": tmp_item.longitude,
                "latitude": tmp_item.latitude,
                "site_id": tmp_item.site_id,
                "sort": tmp_item.sort,
                "back_city_id": tmp_item.back_city_id
              }
              item.children.push(item2)
              break;
            }
          }
        }
        this.districtMetro.push(item)
        delete res[postData.city_id][key];
        //记录默认的选择线路站点
        if (this.listGetData.setDistrictMetro && this.listGetData.setDistrictMetro.hasOwnProperty('id') && this.listGetData.setDistrictMetro.id == item.id) {
          this.addresslistMetro = item.children;
        }
      }
    } else {
      this.$commonUtils.utilCore.showToast("初始化地铁列表出错")
    }
    //价格区间列表（新房二手房）
    res = await this.$store.dispatch(`home/${this.optionsIndex == 2 ? 'getAppBase_rent_price' : 'getAppBase_shouse_total_price'}`);
    if (res) {
      this.priceTabFirst = []
      if (this.optionsIndex == 2) {
        for (let key in res) {
          let item = res[key];
          let tmp_item = {
            id: item.rent_price_id,
            name: item.rent_price_name,
            min: item.rent_price_min,
            max: item.rent_price_max,
            site_id: item.site_id,
            sort: item.sort,
          }
          //转换一下数据的key,方便要求多选
          this.priceTabFirst.push(tmp_item);
        }
      } else {
        for (let key in res) {
          let item = res[key];
          let tmp_item = {
            id: item.shouse_total_price_id,
            name: item.shouse_total_price_name,
            min: item.shouse_total_price_min,
            max: item.shouse_total_price_max,
            site_id: item.site_id,
            sort: item.sort,
          }
          //转换一下数据的key,方便要求多选
          this.priceTabFirst.push(tmp_item);
        }
      }

    } else {
      this.$commonUtils.utilCore.showToast("初始化价格区间列表出错")
    }


    //户型列表
    res = await this.$store.dispatch('home/getAppBase_layout_room');
    if (res) {
      this.huxing = []
      //增加 不限 的选项 
      this.huxing.push({
        id: "",
        name: "不限",
        dname: "不限",
        bname: "不限",
        fname: "不限",
        sort: 0,
      })
      for (let key in res) {
        let item = res[key];
        let tmp_item = {
          id: item.layout_room_id,
          name: item.layout_room_cname,
          dname: item.layout_room_dname,
          bname: item.layout_room_bname,
          fname: item.layout_room_fname,
          sort: item.sort,
        }
        //转换一下数据的key,方便要求多选
        this.huxing.push(tmp_item);
      }
    } else {
      this.$commonUtils.utilCore.showToast("初始化户型列表出错")
    }
    //建筑面积列表
    res = await this.$store.dispatch('home/getAppBase_acreage');
    if (res) {
      this.moreArea = []
      for (let key in res) {
        let item = res[key];
        let tmp_item = {
          id: item.acreage_id,
          name: item.acreage_name,
          min: item.acreage_min,
          max: item.acreage_max,
          sort: item.sort,
        }
        //转换一下数据的key,方便要求多选
        this.moreArea.push(tmp_item);
      }
    } else {
      this.$commonUtils.utilCore.showToast("初始化建筑面积列表出错")
    }
    //单价列表(新房)
    res = await this.$store.dispatch('home/getAppBase_loupan_unit_price');
    if (res) {
      //this.$commonUtils.appLog.log("返回结果", res)
      this.priceTabSecond = []
      // this.priceTabSecond.push({
      //   id: "",
      //   name: "不限",
      //   sort: 0,
      // })
      for (let key in res) {
        let item = res[key];
        let tmp_item = {
          id: item.loupan_unit_price_id,
          name: item.loupan_unit_price_name,
          min: item.loupan_unit_price_min,
          max: item.loupan_unit_price_max,
          site_id: item.site_id,
          sort: item.sort,
        }
        //转换一下数据的key,方便要求多选
        this.priceTabSecond.push(tmp_item);
      }
    } else {
      this.$commonUtils.utilCore.showToast("初始化单价列表出错")
    }
    //二级标签
    res = await this.$store.dispatch(`home/${this.optionsIndex == 0 ? 'getAppFangSaleGetSecondTag' : this.optionsIndex == 1 ? 'getAppFangHouseGetSecondTag' : 'getAppFangRentGetSecondTag'}`);
    if (res) {
      // this.$commonUtils.appLog.log("返回结果", res)
      this.diskSourceType = []
      // this.diskSourceType.push({
      //   id: "",
      //   name: "不限",
      //   val: "",
      // })
      for (let key in res) {
        let item = res[key];
        let tmp_item = {
          id: item.second_tag_id,
          name: item.name,
          val: item.second_tag_id
        }
        //转换一下数据的key,方便要求多选
        this.diskSourceType.push(tmp_item);
      }
    } else {
      this.$commonUtils.utilCore.showToast("初始化单价列表出错")
    }
    //物业类型-二手房/租房
    res = await this.$store.dispatch('home/getAppBase_house_type');
    if (res) {
      // this.$commonUtils.appLog.log("返回结果+++++++++++====================>>>>", res)
      this.morePropertyType = []
      // this.morePropertyType.push({
      //   id: "",
      //   name: "不限",
      //   val: "",
      // })
      for (let key in res) {
        let item = res[key];
        let tmp_item = {
          id: item.house_type_id,
          name: item.house_type_name,
          val: item.house_type_id
        }
        //转换一下数据的key,方便要求多选
        this.morePropertyType.push(tmp_item);
      }
    } else {
      this.$commonUtils.utilCore.showToast("初始化单价列表出错")
    }
    //装修情况列表
    res = await this.$store.dispatch('home/getAppBase_decoration');
    if (res) {
      // this.$commonUtils.appLog.log("返回结果+++++++++++====================>>>>", res)
      this.moreRenovation = []
      // this.moreRenovation.push({
      //   id: "",
      //   name: "不限",
      //   val: "",
      // })
      for (let key in res) {
        let item = res[key];
        let tmp_item = {
          id: item.decoration_id,
          name: item.decoration_name,
          val: item.decoration_id
        }
        //转换一下数据的key,方便要求多选
        this.moreRenovation.push(tmp_item);
      }
    } else {
      this.$commonUtils.utilCore.showToast("初始化单价列表出错")
    }
  },
  // 画圈功能 start
  draw (map) {
    //禁止地图移动点击等操作
    map.disableDragging();
    // 隐藏
    this.hideMarker(map);
    map.disableScrollWheelZoom();
    map.disableDoubleClickZoom();
    map.disableKeyboard();
    map.setDefaultCursor('crosshair');
    // 隐藏标注
    // map.hideOverlay();;
    //设置标志位进入画圈状态
    this.isInDrawing = true
    this.isShowDraw = true;
    this.resetFunciton('map', 'mapTab', false)
    // this.bindEvents(this.newMap)
  },
  exit (map) {
    //恢复地图移动点击等操作
    map.enableDragging();
    // 显示
    // this.showMarker(map)
    map.enableScrollWheelZoom();
    map.enableDoubleClickZoom();
    map.enableKeyboard();
    map.setDefaultCursor('default');
    //清空
    map.removeOverlay(this.polygonAfterDraw);
    map.removeOverlay(this.lastPolyLine);
    this.drawNum = 0;  //重置套数
    this.polyPointArray = [];
    this.lastPolyLine = null;
    this.polygonAfterDraw = null
    this.isMouseDown = false;
    //设置标志位退出画圈状态
    this.isInDrawing = false
    this.isShowDraw = false;
    this.getMapData(map)
  },
  //隐藏覆盖物
  hideMarker (map) {
    map.getOverlays().forEach(item => {
      // 判断是label类型再隐藏，区分画图的线
      console.log('类型', item.toString());
      if (item.toString() == '[object Label]') {
        item.hide()
      }
    })
  },
  //显示覆盖物
  showMarker (map) {
    map.getOverlays().forEach(item => {
      item.show()
    })
  },
  // 画圈开关
  handleClick (type) {
    if (type == 'open') {
      if (this.optionsIndex != 1) {
        if (this.newMap.getZoom() < 14) {
          this.drawTips = true
          setTimeout(() => {
            this.drawTips = false
          }, 2000);
          return
        } else {
          this.drawTips = false
        }
      } else {
        if (this.newMap.getZoom() < 12) {
          this.drawTips = true
          setTimeout(() => {
            this.drawTips = false
          }, 2000);
          return
        } else {
          this.drawTips = false
        }
      }

      // 当有地铁线的时候要先清除
      if (this.isOpenMetro) {
        if (!this.$commonUtils.utilCore.empty(this.buslineData)) {
          this.isOpenMetro = false
          this.buslineData.clearResults()
          this.buslineData = {}
        }
      }
      // 当有区域覆盖物的时候要先清除
      if (!this.$commonUtils.utilCore.empty(this.bounDaryData)) {
        this.newMap.removeOverlay(this.bounDaryData)
        this.bounDaryData = {}
      }
      if (!this.$commonUtils.utilCore.empty(this.polygonAfterDraw)) {
        return
      }
      //初始化地图坐标点 画图找房
      setTimeout(() => {
        this.draw(this.newMap)
      }, 200);
    } else if (type == 'close') {
      this.exit(this.newMap)
    } else if (type == 'redraw') {
      this.draw(this.newMap)
      this.newMap.removeOverlay(this.polygonAfterDraw);
      this.newMap.removeOverlay(this.lastPolyLine);
      this.polygonAfterDraw = null
    }
  },
  //计算地图上点的包含状态
  caculateEstateContainedInPolygon (polygon, map) {
    //得到多边形的点数组
    var pointArray = polygon.getPath();
    //获取多边形的外包矩形
    var bound = polygon.getBounds();
    // this.getSoundLngLat(bound, map)
    //在多边形内的点的数组
    var pointInPolygonArray = [];
    this.drawNum = 0
    let drawId = []
    let drawIdArr = ''
    //计算每个点是否包含在该多边形内
    map.getOverlays().forEach(item => {
      // 该方法最后一个对象没有getPosition方法，会报错，这里判断一下
      try {
        if (item.getPosition && typeof (item.getPosition) == "function") {
          var markerPoint = item.getPosition();
        }
      } catch (e) {
        console.log('方法不存在', item);
      }
      if (this.isPointInPolygon(markerPoint, bound, pointArray)) {
        // 区分其他覆盖物（如：定位的覆盖物）
        if (item.V.localName == 'label') {
          pointInPolygonArray.push(item)
          drawId.push(item.V.firstChild.dataset.id)
          // 新房没有套数 
          if (this.optionsIndex == 1) {
            this.drawNum++
          } else {
            this.drawNum += Number(item.V.firstChild.dataset.num)
          }
          item.show()
        }
      }
      drawIdArr = drawId.join(',')
      this.$store.commit('map/setDrawIdArr', drawIdArr);
      this.isInDrawing = false
    })
  },
  //判定一个点是否包含在多边形内
  isPointInPolygon (point, bound, pointArray) {
    //首先判断该点是否在外包矩形内，如果不在直接返回false
    if (!bound.containsPoint(point)) {
      return false;
    }
    //如果在外包矩形内则进一步判断
    //该点往右侧发出的射线和矩形边交点的数量,若为奇数则在多边形内，否则在外
    var crossPointNum = 0;
    for (var i = 0; i < pointArray.length; i++) {
      //获取2个相邻的点
      var p1 = pointArray[i];
      var p2 = pointArray[(i + 1) % pointArray.length];
      //如果点相等直接返回true
      if ((p1.lng === point.lng && p1.lat === point.lat) || (p2.lng === point.lng && p2.lat === point.lat)) {
        return true
      }
      //如果point在2个点所在直线的下方则continue
      if (point.lat < Math.min(p1.lat, p2.lat)) {
        continue;
      }
      //如果point在2个点所在直线的上方则continue
      if (point.lat >= Math.max(p1.lat, p2.lat)) {
        continue;
      }
      //有相交情况:2个点一上一下,计算交点
      //特殊情况2个点的横坐标相同
      var crossPointLng;
      if (p1.lng === p2.lng) {
        crossPointLng = p1.lng;
      } else {
        //计算2个点的斜率
        var k = (p2.lat - p1.lat) / (p2.lng - p1.lng);
        //得出水平射线与这2个点形成的直线的交点的横坐标
        crossPointLng = (point.lat - p1.lat) / k + p1.lng;
      }
      //如果crossPointLng的值大于point的横坐标则算交点(因为是右侧相交)
      if (crossPointLng > point.lng) {
        crossPointNum++;
      }
    }
    //如果是奇数个交点则点在多边形内
    return crossPointNum % 2 === 1
  },
  // 地图找房画完圈定位到圈中心的方法
  getSoundLngLat (bound, map) {
    //圈的中心
    let centerPoint = bound.getCenter()
    map.setZoom(17);
    map.panTo(centerPoint);
    this.mapGetData.zoom = 17
    this.getMapData(map)
  },
  // 画圈功能 end


  // 点击小区显示的数据 筛选功能 start
  //切换 区域 与 地铁 的选择 || 更多
  selectTabArea (index, type, tabType) {
    let tabName
    if (tabType == 'mapTab') {
      tabName = this.mapGetData
    } else if (tabType == 'listTab') {
      tabName = this.listGetData
    }
    if (type == "district") {//区域
      tabName.tabAreaIndex = index
      //切换的时候要求把已选的清掉
      this.resetFunciton(type, tabType)
    } else if (type == "moreTitle") {//更多
      tabName.moreTitle = index
    } else if (type == "priceTab") {//价格
      tabName.tabPriceIndex = index
    } else {
      this.$commonUtils.appLog.log("选择的类型不正确==>", type)
    }
  },
  // 选择区
  chooseDistrict (itemVal, tabType, type = false) {
    let item = this.$commonUtils.utilCore.deepClone(itemVal);
    let tabName
    if (tabType == 'mapTab') {
      tabName = this.mapGetData
    } else if (tabType == 'listTab') {
      tabName = this.listGetData
    }
    if (tabName.tabAreaIndex != 2) {
      if (!type) {
        this.$refs.scrollRight.scrollTo(0, 0)
      }
      this.resetFunciton('district', tabType)
    }
    if (tabName.tabAreaIndex == 0) {
      this.addresslist = item.children;
      delete item.children
      tabName.setDistrict = item
      //清掉已选的内容
      tabName.setDistrictList = []
      this.cloneObject.addresslist = this.$commonUtils.utilCore.deepClone(this.addresslist);
      if (tabType == 'mapTab') {
        this.cloneObject.mapGetData.setDistrict = this.$commonUtils.utilCore.deepClone(item);
        this.cloneObject.mapGetData.setDistrictList = [];
      } else if (tabType == 'listTab') {
        this.cloneObject.listGetData.setDistrict = this.$commonUtils.utilCore.deepClone(item);
        this.cloneObject.listGetData.setDistrictList = [];
      }
    } else if (tabName.tabAreaIndex == 1) {
      this.addresslistMetro = item.children;
      delete item.children
      tabName.setDistrictMetro = item
      //清掉已选的内容
      tabName.setDresslistMetro = []
      this.cloneObject.addresslistMetro = this.$commonUtils.utilCore.deepClone(this.addresslistMetro);
      if (tabType == 'mapTab') {
        this.cloneObject.mapGetData.setDistrictMetro = this.$commonUtils.utilCore.deepClone(item);
        this.cloneObject.mapGetData.setDresslistMetro = [];
      } else if (tabType == 'listTab') {
        this.cloneObject.listGetData.setDistrictMetro = this.$commonUtils.utilCore.deepClone(item);
        this.cloneObject.listGetData.setDresslistMetro = [];
      }
    } else if (tabName.tabAreaIndex == 2) {
      tabName.setNearby = item
      // this.cloneObject.nearByList = this.$commonUtils.utilCore.deepClone(this.nearByList);
      this.cloneObject.mapGetData.setNearby = this.$commonUtils.utilCore.deepClone(item);
      // this.cloneObject.listGetData.setNearby = [];
    }
  },
  //判断数组内的对像的key值是否等于某值(不等于或者不存在则返回 -1,如果等于则返回对应的key)
  checkArrayValue (item, key, val) {
    let str_return = -1;
    if (this.$commonUtils.utilCore.empty(item)) {
      return str_return;
    }
    item.forEach((tmp_item, index) => {
      if (tmp_item && tmp_item.hasOwnProperty(key) && tmp_item[key] == val) {
        str_return = index;
        return
      }
    })
    return str_return;
  },
  //检查输入的价格
  /**
   * num
   */
  checkPriceInput (num, tabType) {
    let tabName
    if (tabType == 'mapTab') {
      tabName = this.mapGetData
      tabName.setPriceFirstVal[num] = tabName.setPriceFirstVal[num].replace(/\D/g, '')
      if (tabName.setPriceFirstVal[num] != "") {
        tabName.setPriceTabFirst = []
        // 如果已经选了价格
        if (!this.$commonUtils.utilCore.empty(tabName.setSelected)) {
          // 如果点了不限要把已选的数组的区域清掉
          for (var i = 0; i < tabName.setSelected.length; i++) {
            if (tabName.setSelected[i].type == 'priceTab') {
              tabName.setSelected.splice(i--, 1);
            }
          }
        }
      }
    } else if (tabType == 'listTab') {
      tabName = this.listGetData
      if (tabName.tabPriceIndex == 0) {
        tabName.setPriceFirstVal[num] = tabName.setPriceFirstVal[num].replace(/\D/g, '')
        if (tabName.setPriceFirstVal[num] != "") {
          tabName.setPriceTabFirst = []
          // 如果已经选了价格
          if (!this.$commonUtils.utilCore.empty(tabName.setSelected)) {
            // 如果点了不限要把已选的数组的区域清掉
            for (var i = 0; i < tabName.setSelected.length; i++) {
              if (tabName.setSelected[i].type == 'priceTab') {
                tabName.setSelected.splice(i--, 1);
              }
            }
          }
        }
      }
      if (tabName.tabPriceIndex == 1) {
        tabName.setPriceSecondVal[num] = tabName.setPriceSecondVal[num].replace(/\D/g, '')
        if (tabName.setPriceSecondVal[num] != "") {
          tabName.setPriceTabSecond = []
          // 如果已经选了价格
          if (!this.$commonUtils.utilCore.empty(tabName.setSelected)) {
            // 如果点了不限要把已选的数组的区域清掉
            for (var i = 0; i < tabName.setSelected.length; i++) {
              if (tabName.setSelected[i].type == 'priceTab') {
                tabName.setSelected.splice(i--, 1);
              }
            }
          }
        }
      }
    }
  },
  // 重置函数
  resetFunciton (type, tabType, isResetZoom = false) {
    let tabName
    if (tabType == 'mapTab') {
      tabName = this.mapGetData
    } else if (tabType == 'listTab') {
      tabName = this.listGetData
      // tabName.setSelectedShow = []
    }
    // 清除已选，显示的
    if (!this.$commonUtils.utilCore.empty(tabName.setSelected)) {
      tabName.setSelected = tabName.setSelected.filter(item => {
        return item.type != type
      })
    }
    if (type == 'district') {//区域
      this.addresslist = []
      this.addresslistMetro = []
      tabName.setDistrict = ""
      tabName.setDistrictMetro = ""
      tabName.setDistrictList = []
      tabName.setDresslistMetro = []
      tabName.setNearby = {} // 区域-附近
      tabName.longitude = ""
      tabName.latitude = ""
    } else if (type == "priceTab") {//价格
      tabName.setPriceTabFirst = []
      tabName.setPriceTabSecond = []
      tabName.setPriceFirstVal = ["", ""]
      tabName.setPriceSecondVal = ["", ""]
    } else if (type == "huxing") {//户型
      tabName.setHuxing = []
    } else if (type == "area") {//户型
      tabName.setMoreArea = []
    } else if (type == "moreTitle") {//更多
      tabName.setMorePropertyType = []
      tabName.setMoreRenovation = []
    } else if (type == 'map') {
      if (tabType == 'mapTab') {
        this.titleDistrict = '区域'
      }
      tabName.setDistrict = {}
      tabName.setNearby = {} // 区域-附近
      tabName.setDistrictList = []
      tabName.setDistrictMetro = {}
      tabName.setDresslistMetro = []
      tabName.setPriceTabFirst = []
      tabName.setPriceTabSecond = []
      tabName.setPriceFirstVal = ["", ""]
      tabName.setPriceSecondVal = ["", ""]
      tabName.setHuxing = []
      tabName.setMoreArea = []
      tabName.setMorePropertyType = []
      tabName.setMoreRenovation = []
      tabName.setSelected = []
      tabName.longitude = ""
      tabName.latitude = ""
      // 是否将视野和地铁都清掉
      if (isResetZoom) {
        tabName.searchUptownId = ''
        this.newMap.clearOverlays()
        this.isOpenMetro = false
        var point = new BMap.Point(this.cityInfo.longitude, this.cityInfo.latitude);  // 创建点坐标
        // this.newMap.centerAndZoom(point, 11)
        this.newMap.setZoom(11);
        this.newMap.panTo(point);
        tabName.zoom = 11
        this.getMapData(this.newMap)
      }
    }
  },
  // 深拷贝筛选数据, type 0：赋值，type 1： 深拷贝
  handleDropdownClone (type = 0) {
    if (this.isClosed) return;
    const cloneArray = ["priceTabFirst", "priceTabSecond", "huxing", "moreArea", "morePropertyType", "moreRenovation", "nearByList", "district", "addresslist", "districtMetro", "addresslistMetro", "tabPriceIndex", "tabAreaIndex", "moreTitle", "listGetData", "mapGetData"];
    for (let i = 0; i < cloneArray.length; i++) {
      const item = cloneArray[i];
      // 赋值
      if (type === 0) {
        this.borderRadius = '0.2rem'
        this[item] = this.cloneObject[item];
      } else {
        this.borderRadius = '0'
        // 拷贝
        this.cloneObject[item] = this.$commonUtils.utilCore.deepClone(this[item]);
      }
    }
  },
  //检查是否有输入完两个自定义值(输入完返回true,没有输入完返回false)
  checkInputTwoVal (type, tabType) {
    let tabName
    if (tabType == 'mapTab') {
      tabName = this.mapGetData
    } else if (tabType == 'listTab') {
      tabName = this.listGetData
    }
    //如果是输入了自定义的总价
    if ((type == 'priceTab' || type == 'priceTabMap') &&
      (tabName.setPriceFirstVal[1] == '0' || tabName.setPriceFirstVal[0] == '0' || !this.$commonUtils.utilCore.empty(tabName.setPriceFirstVal[0]) || !this.$commonUtils.utilCore.empty(tabName.setPriceFirstVal[1]))
    ) {
      if (this.$commonUtils.utilCore.empty(tabName.setPriceFirstVal[0]) && tabName.setPriceFirstVal[0] != '0') {
        this.$commonUtils.utilCore.showToast("请输入最低总价！")
        return false;
      }
      if (this.$commonUtils.utilCore.empty(tabName.setPriceFirstVal[1]) && tabName.setPriceFirstVal[1] != '0') {
        this.$commonUtils.utilCore.showToast("请输入最高总价!")
        return false;
      }
      if (tabName.setPriceFirstVal[0] > (Number(tabName.setPriceFirstVal[1]) || Number(tabName.setPriceFirstVal[1] == '0'))) {
        this.$commonUtils.utilCore.showToast("请输入正确的总价区间!")
        return false;
      }
    }
    //如果是输入了自定义的单价
    if ((type == 'priceTab' || type == 'priceTabMap') &&
      (tabName.setPriceSecondVal[1] == '0' || tabName.setPriceSecondVal[0] == '0' || !this.$commonUtils.utilCore.empty(tabName.setPriceSecondVal[0]) || !this.$commonUtils.utilCore.empty(tabName.setPriceSecondVal[1]))
    ) {

      if (this.$commonUtils.utilCore.empty(tabName.setPriceSecondVal[0]) && tabName.setPriceSecondVal[0] != '0') {
        this.$commonUtils.utilCore.showToast("请输入最低单价！")
        return false;
      }
      if (this.$commonUtils.utilCore.empty(tabName.setPriceSecondVal[1]) && tabName.setPriceSecondVal[1] != '0') {
        this.$commonUtils.utilCore.showToast("请输入最高单价!")
        return false;
      }
      if (tabName.setPriceSecondVal[0] > tabName.setPriceSecondVal[1] || tabName.setPriceSecondVal[1] == '0') {
        this.$commonUtils.utilCore.showToast("请输入正确的单价区间!")
        return false;
      }
    }
    return true;
  },
  //点击关闭按钮
  async closeDropdownMenu (type, isClose = true, tabType) {
    let tabName
    if (tabType == 'mapTab') {
      tabName = this.mapGetData
    } else if (tabType == 'listTab') {
      tabName = this.listGetData
    }
    //判断两个值的输入是否完成
    if (!this.checkInputTwoVal(type, tabType)) {
      return;
    }
    if (this.listGetData.loading) return
    //进行手动搜索
    tabName.page = 0;
    tabName.page_size = 10
    tabName.loading = false;
    tabName.finished = false;
    tabName.city_id = this.$route.query.city_id || this.switchCityInfo.city_id

    this.handleLoop(tabType)
    if (tabName.setSelected.length > 10) {
      this.$commonUtils.utilCore.showToast("最多只能选择10个选项。")
      return
    }
    // 切换需要重新搜索列表 下拉列表不收回
    if (isClose) {
      this.$refs[type].toggle();
    }
    this.handleDropdownClone(1);//上面改变了postGetData的key值，避免loading不出现, 所以再深拷贝一次
    this.handleDropdownClone(0);
    //把数据存在vuex里去
    if (tabType == 'mapTab') {
      // 当有地铁线的时候要先清除
      if (this.isOpenMetro) {
        if (this.$commonUtils.utilCore.empty(this.mapGetData.setDistrictMetro.id)) {
          if (!this.$commonUtils.utilCore.empty(this.buslineData)) {
            this.isOpenMetro = false
            this.buslineData.clearResults()
            this.buslineData = {}
          }
        }
      }
      // 如果选择的是区域的不限  二级的“不限”
      if (this.mapGetData.setDistrict.name == '不限' || this.mapGetData.setDistrictMetro.name == '不限') {
        this.mapGetData.zoom = 11
        this.titleDistrict = '区域'
        if (this.newMap.getZoom() == 11) return
        this.newMap.clearOverlays()
        this.newMap.setZoom(11);
        this.newMap.panTo(new BMap.Point(this.cityInfo.longitude, this.cityInfo.latitude));
        await this.getMapData(this.newMap);
        return
      }
      // 如果区域为空
      if (this.$commonUtils.utilCore.empty(this.mapGetData.setDistrict)) {
        if (!this.$commonUtils.utilCore.empty(this.bounDaryData)) {
          this.newMap.removeOverlay(this.bounDaryData)
        }
      }
      // 选择区（如越秀区）
      if (!this.$commonUtils.utilCore.empty(this.mapGetData.setDistrict) && this.$commonUtils.utilCore.empty(this.mapGetData.setDistrictList)) {
        // 创建区域边界覆盖物
        this.getBoundary(this.mapGetData.setDistrict.map_border)
        this.titleDistrict = this.mapGetData.setDistrict.name
        var point = new BMap.Point(this.mapGetData.setDistrict.longitude, this.mapGetData.setDistrict.latitude);  // 创建点坐标
        if (this.optionsIndex == 1) {
          // 如果是新房，高度不用那么低
          this.newMap.setZoom(12);
        } else {
          this.newMap.setZoom(14);
        }
        this.mapGetData.zoom = 14
        this.newMap.panTo(point);
      } else {
        this.titleDistrict = '区域'
      }
      // 选择区的街道（如东山口）
      if (!this.$commonUtils.utilCore.empty(this.mapGetData.setDistrict) && !this.$commonUtils.utilCore.empty(this.mapGetData.setDistrictList)) {
        // 如果选择的是“不限”
        if (this.mapGetData.setDistrictList[0].id == '0') {
          // 创建区域边界覆盖物
          this.getBoundary(this.mapGetData.setDistrict.map_border)
          this.titleDistrict = this.mapGetData.setDistrict.name
          var point = new BMap.Point(this.mapGetData.setDistrict.longitude, this.mapGetData.setDistrict.latitude);  // 创建点坐标 
          this.newMap.setZoom(14);
          this.newMap.panTo(point);
          this.mapGetData.zoom = 14
          await this.getMapData(this.newMap);
          return
        }
        let longitude = 0
        let latitude = 0
        for (let i = 0; i < this.mapGetData.setDistrictList.length; i++) {
          longitude += Number(this.mapGetData.setDistrictList[i].longitude)
          latitude += Number(this.mapGetData.setDistrictList[i].latitude)
          if (i == this.mapGetData.setDistrictList.length - 1) {
            longitude = longitude / this.mapGetData.setDistrictList.length
            latitude = latitude / this.mapGetData.setDistrictList.length
          }
        }
        var point = new BMap.Point(longitude, latitude);  // 创建点坐标 
        if (this.mapGetData.setDistrictList.length == 1) {
          // 获取板块中心点并跳转
          this.setBlockGetPosition(this.mapGetData.setDistrictList[0].id, this.optionsIndex, this.newMap)
          // 调取接口后再请求房源数据
          return
        } else {
          this.newMap.setZoom(14);
          this.mapGetData.zoom = 14
          this.newMap.panTo(point);
          this.titleDistrict = '多选'
          // 创建区域边界覆盖物
          this.getBoundary(this.mapGetData.setDistrict.map_border)
        }
      }
      // 选择地铁线（如1号线）
      if (!this.$commonUtils.utilCore.empty(this.mapGetData.setDistrictMetro.id) && this.$commonUtils.utilCore.empty(this.mapGetData.setDresslistMetro)) {
        this.titleDistrict = this.mapGetData.setDistrictMetro.name
        // 清空地铁线路的label
        this.blockList = []
        this.isOpenMetro = true
        this.setBusLine(this.newMap)
        return
      }
      // 选择地铁站（如西塱站）
      if (!this.$commonUtils.utilCore.empty(this.mapGetData.setDistrictMetro) && !this.$commonUtils.utilCore.empty(this.mapGetData.setDresslistMetro)) {
        // 如果选择的是“不限”
        if (this.mapGetData.setDresslistMetro[0].id == '0') {
          this.titleDistrict = this.mapGetData.setDistrictMetro.name
          // 清空地铁线路的label
          this.blockList = []
          this.isOpenMetro = true
          this.setBusLine(this.newMap)
          return
        }
        // if (this.isOpenMetro) return
        let longitudeMetro = 0
        let latitudeMetro = 0
        for (let i = 0; i < this.mapGetData.setDresslistMetro.length; i++) {
          longitudeMetro += Number(this.mapGetData.setDresslistMetro[i].longitude)
          latitudeMetro += Number(this.mapGetData.setDresslistMetro[i].latitude)
          if (i == this.mapGetData.setDresslistMetro.length - 1) {
            longitudeMetro = longitudeMetro / this.mapGetData.setDresslistMetro.length
            latitudeMetro = latitudeMetro / this.mapGetData.setDresslistMetro.length
          }
        }
        var point = new BMap.Point(longitudeMetro, latitudeMetro);  // 创建点坐标 
        if (this.mapGetData.setDresslistMetro.length == 1) {
          this.titleDistrict = this.mapGetData.setDresslistMetro[0].name
          // 清空地铁线路的label
          this.blockList = []
          this.isOpenMetro = true
          this.setBusLine(this.newMap, point, 17)
        } else {
          this.titleDistrict = '多选'
          // 清空地铁线路的label
          this.blockList = []
          this.isOpenMetro = true
          this.setBusLine(this.newMap, point, 14)
        }
        return
      }
      // 选择区域-附近
      if (!this.$commonUtils.utilCore.empty(this.mapGetData.setNearby) && !this.$commonUtils.utilCore.empty(this.mapGetData.setNearby.id)) {
        // if (this.$commonUtils.utilCore.empty(this.mapGetData.longitude)) {
        if (!this.$commonUtils.utilCore.empty(this.oldCircle)) {
          this.newMap.removeOverlay(this.oldCircle)
          this.oldCircle = null
        }
        this.titleDistrict = this.mapGetData.setNearby.name
        this.geoCoder(true, this.mapGetData.setNearby.id)
        return
        // }
      } else {
        if (!this.$commonUtils.utilCore.empty(this.oldCircle)) {
          this.newMap.removeOverlay(this.oldCircle)
          this.oldCircle = null
        }
      }
      console.log('地图的参数', this.mapGetData);
      setTimeout(() => {
        this.getMapData(this.newMap);
      }, 500);
    } else if (tabType == 'listTab') {
      this.$store.commit('map/setSearchListGetData', this.listGetData);
      //清除当前列表数据
      this.popHouseList = []
      await this.actOnLoad();
    }
  },
  // 循环查询已选
  handleLoop (tabType) {
    let tabName
    if (tabType == 'mapTab') {
      // 地图的不需要展示更多
      return
    } else if (tabType == 'listTab') {
      tabName = this.listGetData
    }
    tabName.setSelectedShow = []
    let priceRange = [] // 总价价格区间
    let unitPriceRange = [] // 单价价格区间
    if (!this.$commonUtils.utilCore.empty(tabName.setPriceFirstVal[0]) && !this.$commonUtils.utilCore.empty(tabName.setPriceFirstVal[1])) {
      priceRange = [{
        name: tabName.setPriceFirstVal[0] + "~" + tabName.setPriceFirstVal[1] + '万',
        type: 'priceTab',
        id: '',
        typeIndex: '0'
      }]
    }
    if (!this.$commonUtils.utilCore.empty(tabName.setPriceSecondVal[0]) && !this.$commonUtils.utilCore.empty(tabName.setPriceSecondVal[1])) {
      unitPriceRange = [{
        name: tabName.setPriceSecondVal[0] + "~" + tabName.setPriceSecondVal[1] + '万',
        type: 'priceTab',
        id: '',
        typeIndex: '1'
      }]
    }
    let arr = [
      tabName.setDistrictList,
      tabName.setDresslistMetro,
      tabName.setPriceTabFirst,
      tabName.setPriceTabSecond,
      tabName.setHuxing,
      tabName.setMoreArea,
      tabName.setMorePropertyType,
      tabName.setMoreRenovation,
      // priceRange,
      // unitPriceRange
    ]
    arr.forEach((item, index) => {
      if (item.length > 0) {
        item.forEach((i, idx) => {
          if (i.type == 'huxing' && i.id == '') { } else { tabName.setSelectedShow.push(i) }
        })
      }
    })
    this.selectedLength = tabName.setSelectedShow.length
  },
  // 删除已选中 删除并调接口
  deleteSelectedShow (item, tabType) {
    this.chooseDistrictAddress(item, item.type, false, true)
    this.closeDropdownMenu(item.type, false, tabType)
  },
  // 多选
  chooseDistrictAddress (item, type, isPop = true, isdelete = false, tabType = 'listTab') {
    var tabName
    if (tabType == 'mapTab') {
      tabName = this.mapGetData
    } else if (tabType == 'listTab') {
      tabName = this.listGetData
    }
    if (type == 'district') {//如果选择的是 区域 或 地铁
      item.type = 'district'
      if (isdelete) {
        if (item.tabAreaIndex == 0) {
          tabName.tabAreaIndex = 0
        } else {
          tabName.tabAreaIndex = 1
        }
      }
      // 如果已选要重新取消
      if (!this.$commonUtils.utilCore.empty(tabName.setSelected)) {
        tabName.setSelected.forEach((itemMore, indexMore) => {
          if (itemMore.type == item.type && itemMore.tabAreaIndex == item.tabAreaIndex && itemMore.id == item.id) {
            tabName.setSelected.splice(indexMore, 1)
          }
        })
      }
      if (tabName.tabAreaIndex == 0) {
        let isAll = this.checkArrayValue(tabName.setDistrictList, 'id', "0");
        //如果选择的是 不限
        if (item.id == "0") {
          if (isAll != -1) {
            tabName.setDistrictList.splice(isAll, 1);
            return
          }
          tabName.setDistrictList = [];
          // 如果点了不限要把已选的数组的区域清掉
          for (var i = 0; i < tabName.setSelected.length; i++) {
            if (tabName.setSelected[i].tabAreaIndex == 0 && tabName.setSelected[i].type == 'district') {
              tabName.setSelected.splice(i--, 1);
            }
          }
        } else {//如果不是 不限，则需要把 不限去掉了
          if (isAll != -1) {
            tabName.setDistrictList.splice(isAll, 1);
          }
        }

        //判断是否已经有选择过，如果已经选择过则取消
        let isHave = this.checkArrayValue(tabName.setDistrictList, 'id', item.id);
        if (isHave != -1) {
          tabName.setDistrictList.splice(isHave, 1);
        } else {
          item.tabAreaIndex = 0
          tabName.setDistrictList.push(item)
          if (item.id != '0') {
            tabName.setSelected.push(item)
          }
        }
      } else if (tabName.tabAreaIndex == 1) {
        let isAll = this.checkArrayValue(tabName.setDresslistMetro, 'id', "0");
        //如果选择的是 不限
        if (item.id == "0") {
          if (isAll != -1) {
            tabName.setDresslistMetro.splice(isAll, 1);
            return
          }
          tabName.setDresslistMetro = [];
          // 如果点了不限要把已选的数组的区域清掉
          for (var i = 0; i < tabName.setSelected.length; i++) {
            if (tabName.setSelected[i].tabAreaIndex == 1 && tabName.setSelected[i].type == 'district') {
              tabName.setSelected.splice(i--, 1);
            }
          }
        } else {//如果不是 不限，则需要把 不限去掉了
          if (isAll != -1) {
            tabName.setDresslistMetro.splice(isAll, 1);
          }
        }
        //判断是否已经有选择过，如果已经选择过则取消
        let isHave = this.checkArrayValue(tabName.setDresslistMetro, 'id', item.id);
        if (isHave != -1) {
          tabName.setDresslistMetro.splice(isHave, 1);
        } else {
          item.tabAreaIndex = 1
          tabName.setDresslistMetro.push(item)
          if (item.id != '0') {
            tabName.setSelected.push(item)
          }
          // 是否需要切换其他城市的弹窗
          if (isPop) { // 切换城市不弹，点击再弹
            if (item.back_city_id && item.back_city_id != 0) {
              this.popCityId = item.back_city_id
              if (item.back_city_id == '9') {
                this.popCityname = '佛山'
              } else if (item.back_city_id == '8') {
                this.popCityname = '广州'
              }
              this.isChangecity = true
              this.changeChooseMetroId = item.id
            }
          }
        }
      }
    } else if (type == 'priceTab') {//如果选择的是 总价 或 单价
      if (isdelete) {
        if (item.tabPriceIndex == 0) {
          tabName.tabPriceIndex = 0
        } else {
          tabName.tabPriceIndex = 1
        }
      } else {
        item.type = 'priceTab'
      }
      // 如果已选要重新取消
      if (!this.$commonUtils.utilCore.empty(tabName.setSelected)) {
        tabName.setSelected.forEach((itemMore, indexMore) => {
          if (itemMore.type == item.type && itemMore.id == item.id && itemMore.tabPriceIndex == item.tabPriceIndex) {
            tabName.setSelected.splice(indexMore, 1)
          }
        })
      }
      if (tabName.tabPriceIndex == 0) {
        //判断是否已经有选择过，如果已经选择过则取消
        let isHave = this.checkArrayValue(tabName.setPriceTabFirst, 'id', item.id);
        if (isHave != -1) {
          tabName.setPriceTabFirst.splice(isHave, 1);
        } else {
          item.tabPriceIndex = '0'
          tabName.setPriceTabFirst.push(item)
          tabName.setSelected.push(item)
        }
        tabName.setPriceFirstVal = ["", ""]//输入的总价
      } else {//单价
        //判断是否已经有选择过，如果已经选择过则取消
        let isHave = this.checkArrayValue(tabName.setPriceTabSecond, 'id', item.id);
        if (isHave != -1) {
          tabName.setPriceTabSecond.splice(isHave, 1);
          tabName.setSelected.splice(isHave, 1)
        } else {
          item.tabPriceIndex = '1'
          tabName.setPriceTabSecond.push(item)
          tabName.setSelected.push(item)
        }
        tabName.setPriceSecondVal = ["", ""]//输入的单价

      }
    } else if (type == "huxing") {//如果选择的是 户型
      //如果选择的是不限，则需要把所有已经选的户型都去掉
      if (item.id === "") {
        this.resetFunciton('huxing', tabType)
      } else {//如果有选择项的时候要把 不限 去掉
        let isHave = this.checkArrayValue(tabName.setHuxing, 'id', "");
        if (isHave != -1) {
          tabName.setHuxing.splice(isHave, 1);
        }
      }
      // 如果已选要重新取消
      if (!this.$commonUtils.utilCore.empty(tabName.setSelected)) {
        tabName.setSelected.forEach((itemMore, indexMore) => {
          if (itemMore.type == item.type && itemMore.id == item.id) {
            tabName.setSelected.splice(indexMore, 1)
          }
        })
      }
      //判断是否已经有选择过，如果已经选择过则取消
      let isHave = this.checkArrayValue(tabName.setHuxing, 'id', item.id);
      if (isHave != -1) {
        tabName.setHuxing.splice(isHave, 1);
      } else {
        item.type = 'huxing'
        tabName.setHuxing.push(item)
        // “不限”的不用push
        if (item.id != "") {
          tabName.setSelected.push(item)
        }
      }
    } else if (type == "area") {//如果选择的是 户型
      //如果选择的是不限，则需要把所有已经选的户型都去掉
      if (item.id === "") {
        this.resetFunciton('area', tabType)
      } else {//如果有选择项的时候要把 不限 去掉
        let isHave = this.checkArrayValue(tabName.setMoreArea, 'id', "");
        if (isHave != -1) {
          tabName.setMoreArea.splice(isHave, 1);
        }
      }
      // 如果已选要重新取消
      if (!this.$commonUtils.utilCore.empty(tabName.setSelected)) {
        tabName.setSelected.forEach((itemMore, indexMore) => {
          if (itemMore.type == item.type && itemMore.id == item.id) {
            tabName.setSelected.splice(indexMore, 1)
          }
        })
      }
      //判断是否已经有选择过，如果已经选择过则取消
      let isHave = this.checkArrayValue(tabName.setMoreArea, 'id', item.id);
      if (isHave != -1) {
        tabName.setMoreArea.splice(isHave, 1);
      } else {
        item.type = 'area'
        tabName.setMoreArea.push(item)
        tabName.setSelected.push(item)
      }
    } else if (type == "moreTitle") {//如果选择的是 更多
      item.type = 'moreTitle'
      if (isdelete) {
        if (item.moreTitle == 0) {
          tabName.moreTitle = 0
        } else {
          tabName.moreTitle = 1
        }
      }
      // 如果已选要重新取消
      if (!this.$commonUtils.utilCore.empty(tabName.setSelected)) {
        tabName.setSelected.forEach((itemMore, indexMore) => {
          if (itemMore.type == item.type && itemMore.moreTitle == item.moreTitle && itemMore.id == item.id) {
            tabName.setSelected.splice(indexMore, 1)
          }
        })
      }
      if (tabName.moreTitle == 0) {
        //判断是否已经有选择过，如果已经选择过则取消
        let isHave = this.checkArrayValue(tabName.setMorePropertyType, 'id', item.id);
        if (isHave != -1) {
          tabName.setMorePropertyType.splice(isHave, 1);
        } else {
          item.moreTitle = '0'
          tabName.setMorePropertyType.push(item)
          tabName.setSelected.push(item)
        }
      } else if (tabName.moreTitle == 1) {
        //判断是否已经有选择过，如果已经选择过则取消
        let isHave = this.checkArrayValue(tabName.setMoreRenovation, 'id', item.id);
        if (isHave != -1) {
          tabName.setMoreRenovation.splice(isHave, 1);
        } else {
          item.moreTitle = '1'
          tabName.setMoreRenovation.push(item)
          tabName.setSelected.push(item)
        }
      }
    } else if (type == 'diskSourceType') {
      //判断是否已经有选择过，如果已经选择过则取消
      let isHave = this.checkArrayValue(tabName.setDiskIndex, 'id', item.id);
      if (isHave != -1) {
        tabName.setDiskIndex.splice(isHave, 1);
      } else {
        tabName.setDiskIndex.push(item)
      }
      //进行搜索
      this.handleType(tabType);
    }
  },
  //标签选择 + 搜索
  async handleType (tabType) {
    let tabName
    if (tabType == 'mapTab') {
      tabName = this.mapGetData
    } else if (tabType == 'listTab') {
      tabName = this.listGetData
    }
    //进行手动搜索
    tabName.page = 0;
    tabName.page_size = 10
    tabName.loading = false;
    tabName.finished = false;
    tabName.city_id = this.$route.query.city_id || this.switchCityInfo.city_id
    //把数据存在vuex里去
    await this.$store.commit('map/setSearchListGetData', tabName);
    //清除当前列表数据
    this.popHouseList = []
    await this.actOnLoad();
  },
  // 删除已选中
  deleteSelected (item, index, tabType) {
    this.chooseDistrictAddress(item, item.type, false, true, tabType)
  },
  handleMore (type) {
    if (type == 'more') {
      this.isShowmore = !this.isShowmore
    } else {
      this.isShow = !this.isShow
      if (!this.isShow) {
        // 异步获取高度
        setTimeout(() => {
          this.computedHeight()
        }, 10);
      }
    }
  },
  computedHeight () {
    const navheight = document.querySelector(".fixed-container")
    this.navheight = navheight.offsetHeight
  },

  // 获取小区详情和二手房列表
  async getUptownAndSecondHouse (item) {
    setTimeout(() => {
      this.$commonUtils.utilCore.showLoading();
    }, 500);
    this.popHouseList = []
    // 参数重置
    this.resetGetdata('list')
    // 新房不需要小区详情
    if (this.optionsIndex == 1) {
      // 修改弹窗高度
      this.popHeight = 20
      this.listGetData.searchKeyWord = item.loupan_name
      this.actOnLoad()
    } else {
      this.popHeight = 50
      this.listGetData.searchKeyWord = ''
      this.listGetData.searchUptownId = item.uptown_id
      this.getUptownDetail(item, this.actOnLoad)
    }

  },
  // 获取小区详情
  async getUptownDetail (item, fn) {
    // this.uptowndata = {}
    const postData = {
      id: item.uptown_id,
    }
    const res = await this.$store.dispatch('home/getAppFangUptowndetail', postData);
    if (res) {
      this.uptowndata = res.data
      await fn()
      this.handleLoop('listTab')
    }
  },
  // 去详情页
  goDetail (item) {
    let tmp_query = {}
    if (this.optionsIndex == 0) {
      tmp_query = {
        id: item.shouse_id,//	是	string	二手房id
        broker_id: item.broker_id,//	否	string	经纪人id
        share_broker_id: ""//	否	string	分享者经纪人id
      }
      this.toolsGoPageView({
        path: '/home/detail/secondhouseDetail',
        query: tmp_query
      })
    } else if (this.optionsIndex == 1) {
      tmp_query = {
        loupan_id: item.loupan_id
      }
      this.toolsGoPageView({
        path: '/home/detail/newhouseDetail',
        query: tmp_query
      })
    } else {
      tmp_query = {
        id: item.rent_id,//	是	string	二手房id
        broker_id: item.broker_id,//	否	string	经纪人id
        share_broker_id: ""//	否	string	分享者经纪人id
      }
      this.toolsGoPageView({
        path: '/home/detail/renthouseDetail',
        query: tmp_query
      })
    }

  },
  // 去除“区”字眼
  setDistrict (val) {
    if (val) {
      let name = val.replace('区', '')
      return name
    }
  },
  // 设置地铁站 后面加个+站字
  setDresslistMetroText (val) {
    if (val.indexOf("站") == -1) {
      return val + '站'
    } else {
      return val
    }
  },
  async actOnLoad () {
    // 异步获取高度
    setTimeout(() => {
      this.computedHeight()
    }, 10);
    this.$commonUtils.appLog.log("=========+++++++++++++==============》》》actOnLoad", this.listGetData)
    if (this.listGetData.finished == true) {
      this.listGetData.loading = false;
      return;
    }
    this.listGetData.page++;
    this.listGetData.city_id = this.$route.query.city_id || this.switchCityInfo.city_id
    this.listGetData.loading = true;
    let res = await this.$store.dispatch(`home/${this.optionsIndex == 0 ? 'actAppFangSaleLists' : this.optionsIndex == 1 ? 'actAppFangHouseLists' : 'actAppFangRentLists'}`, this.listGetData);
    this.listGetData.loading = false;
    if (res && res.rows && res.rows.length > 0) {
      this.$commonUtils.utilCore.closeLoading()
      //如果返回的条数小于每页的条数，则加载完了
      if (res.rows.length < this.listGetData.page_size) {
        this.listGetData.finished = true;
        this.lockLoading = true
      }
      if (this.optionsIndex == 0) {
        res.rows.forEach((item) => {
          let tmp_item = {
            id: item.shouse_id,
            title: item.shouse_title,
            subtitle: this.showTitle(item, 0).toString(),
            left: item.price_name ? item.price_name.replace('万', '') : "",
            right: item.average_price_name,
            ...item
          }
          tmp_item.label = []
          if (item.tags && this.$commonUtils.utilCore.empty(item.tags)) {
            item.tags.forEach((val) => {
              let tmp_val = {
                text: val.tag_name,
                ...val
              }
              tmp_item.label.push(val)
            })
          }
          if (item.price_name.replace('万', '') != 0) {
            this.popHouseList.push(tmp_item)
          }
        })
      } else if (this.optionsIndex == 1) {
        res.rows.forEach((item) => {
          let tmp_item = {
            id: item.loupan_id,
            title: item.loupan_name,
            subtitle: this.showTitle(item, 1).toString(),
            right: item.average_price_name,
            ...item
          }
          tmp_item.label = []
          if (item.tags && this.$commonUtils.utilCore.empty(item.tags)) {
            item.tags.forEach((val) => {
              let tmp_val = {
                text: val.tag_name,
                ...val
              }
              tmp_item.label.push(val)
            })
          }
          this.popHouseList.push(tmp_item)
        })
      } else {
        res.rows.forEach((item) => {
          let tmp_item = {
            id: item.rent_id,
            title: item.rent_title,
            subtitle: this.showTitle(item, 0).toString(),
            left: item.price_name ? item.price_name.replace('万', '') : "",
            right: item.rent_price_name,
            ...item
          }
          tmp_item.label = []
          if (item.tags && this.$commonUtils.utilCore.empty(item.tags)) {
            item.tags.forEach((val) => {
              let tmp_val = {
                text: val.tag_name,
                ...val
              }
              tmp_item.label.push(val)
            })
          }
          if (item.rent_price != 0) {
            this.popHouseList.push(tmp_item)
          }
        })
      }
    } else {
      this.listGetData.finished = true;
      this.$commonUtils.appLog.log("加载列表数据不正确", res)
    }
    setTimeout(() => {
      this.computedHeight()
    }, 100);
  },
  /**
   * 显示户型等内容
   * item=>数据
   * type=>数据类型
   */
  showTitle (item, type) {
    let strTitle = "";
    if (type == 0) {//二手房
      if (!this.$commonUtils.utilCore.empty(item.district_name)) {
        strTitle += item.district_name + "/"
      }
      if (!this.$commonUtils.utilCore.empty(item.layout_short_name)) {
        strTitle += item.layout_short_name + "/"
      }
      if (!this.$commonUtils.utilCore.empty(item.acreage_cover_name)) {
        strTitle += item.acreage_cover_name + "/"
      }
      if (!this.$commonUtils.utilCore.empty(item.house_orientation_name)) {
        if (item.house_orientation_name != '保留') {
          strTitle += item.house_orientation_name + "/"
        }
      }
      if (!this.$commonUtils.utilCore.empty(item.floor_name)) {
        strTitle += item.floor_name + "/"
      }
      //去掉未尾的 /
      strTitle = strTitle.substr(-1) == "/" ? strTitle.substr(0, strTitle.length - 1) : strTitle

    } else if (type == 1) {//新房
      if (!this.$commonUtils.utilCore.empty(item.district_name)) {
        strTitle += item.district_name + "/"
      }
      if (!this.$commonUtils.utilCore.empty(item.property_type_name)) {
        strTitle += item.property_type_name + "/"
      }
      if (!this.$commonUtils.utilCore.empty(item.acreage_name)) {
        strTitle += item.acreage_name + "/"
      }
      if (!this.$commonUtils.utilCore.empty(item.sell_status_name)) {
        strTitle += item.sell_status_name + "/"
      }
      //去掉未尾的 /
      strTitle = strTitle.substr(-1) == "/" ? strTitle.substr(0, strTitle.length - 1) : strTitle
    } else if (type == 2) {//租房
      if (!this.$commonUtils.utilCore.empty(item.district_name)) {
        strTitle += item.district_name + "/"
      }
      if (!this.$commonUtils.utilCore.empty(item.floor_name)) {
        strTitle += item.floor_name + "/"
      }
      if (!this.$commonUtils.utilCore.empty(item.house_orientation_name)) {
        strTitle += item.house_orientation_name + "/"
      }
      //去掉未尾的 /
      strTitle = strTitle.substr(-1) == "/" ? strTitle.substr(0, strTitle.length - 1) : strTitle
    } else {
      strTitle = "数据不正确"
    }
    //海珠区/2室1厅/80㎡/朝南北/中楼层
    return strTitle;
  },
  // 参数重置
  resetGetdata (type) {
    if (type == 'list') {
      this.listGetData.finished = false
      this.listGetData.loading = false
      this.listGetData.page = 0
      this.listGetData.page_size = 10
    } else if (type == 'map') {
      this.mapGetData.longitude = ""
      this.mapGetData.latitude = ""
      this.mapGetData.uptown_id = ""
    }

  },
  // 点击小区显示的数据 筛选功能 end

  // 跳转画圈完的列表
  goDrawList () {
    this.toolsGoPageView({
      path: '/maphouse/drawList',
      query: {
        optionsIndex: this.optionsIndex,
        houseNum: this.drawNum,
      }
    })
  },

  // 创建地铁线路图
  setBusLine (map, point, zoom) {
    var _this = this
    var busline = new BMap.BusLineSearch(this.switchCityInfo.city_name, {
      renderOptions: { map: map },
      onGetBusListComplete: function (result) {
        if (result) {
          var fstLine = result.getBusListItem(0); //获取第一个公交列表显示到map上
          busline.getBusLine(fstLine);
        }
      },
      onPolylinesSet: function (line) {
        map.clearOverlays();
        line.setStrokeColor('#F45C45')
        line.setStrokeWeight(3)
        // var polyline = new BMap.Polyline(line.getPath(), {
        //   strokeColor: "#F45C45",
        //   strokeWeight: 3,
        //   strokeOpacity: 0.7,
        // });
        map.addOverlay(line);
      },
      onMarkersSet: function (marker) {
        var myIcon = new BMap.Icon(`${_this.$appConfig.appWebStaticUrl}` + '/maphouse/icon_metro.png', new BMap.Size(11, 11))
        myIcon.setImageSize(new BMap.Size(11, 11))
        marker.forEach(item => {
          item.setIcon(myIcon)
        })
        _this.dataMetroList.bubble_type = 'block'
        _this.dataMetroList.rows = []
        // res.forEach(item => {
        //   _this.dataList.rows.push({
        //     area_name: item.eC,
        //     longitude: item.point.lng,
        //     latitude: item.point.lat,
        //   })
        // })
        _this.addresslistMetro.forEach(item => {
          if (item.id != 0) {
            _this.dataMetroList.rows.push({
              id: item.id,
              area_name: item.name,
              longitude: item.longitude,
              latitude: item.latitude,
            })
          }
        })
        if (!_this.$commonUtils.utilCore.empty(point)) {
          setTimeout(() => {
            if (zoom == 17) {
              _this.mapGetData.zoom = 16
              var cirCle = new BMap.Circle(point, 1000, {
                strokeWeight: 2, //	边线的宽度，以像素为单位
                strokeColor: '#F45C45',
                fillColor: '#FFE47A',
                fillOpacity: 0.3,
              })
              map.addOverlay(cirCle)
              _this.cirCleList.push(cirCle)
              _this.getMetroMarker(map)
            }
            map.setZoom(zoom);
            map.panTo(point);
            if (zoom == 14) {
              _this.getMetroLabel(map)
              return
            }
            setTimeout(() => {
              _this.getMapData(map)
            }, 10);
          }, 500);
        }
      },
    })
    setTimeout(() => {
      this.buslineData = busline
      if (this.mapGetData.setDistrictMetro.name == '3号线北延段') {
        busline.getBusList('地铁3号线北延段(体育西路-机场北(2号航站楼))');
        // busline.getBusList('地铁3号线');
        // busline.getBusList(this.mapGetData.setDistrictMetro.name);
      } else {
        busline.getBusList(this.mapGetData.setDistrictMetro.name);
      }
    }, 500);
  },
  // 地铁线路设置标注函数
  getMetroLabel (map) {
    if (!this.$commonUtils.utilCore.empty(this.blockList)) {
      this.blockList.forEach(item => {
        item.show()
      })
      return
    }
    this.$nextTick(() => {
      this.dataMetroList.rows.forEach(item => {
        var point = new BMap.Point(item.longitude, item.latitude)
        var opts = {
          position: point, // 指定文本标注所在的地理位置
          offset: new BMap.Size(-30, -30) //设置文本偏移量
        }
        var label = new BMap.Label('<div class="label-circular"><div>' + item.area_name + '</div></div>', opts);
        label.setStyle({
          borderRadius: '50%',
          background: '#fe970a',
          border: 'none',
          cursor: "pointer",
          zIndex: '9999',
          boxShadow: '0rem 0rem 0.04rem 0rem rgba(0, 0, 0, 0.3)'
        })
        if (!this.$commonUtils.utilCore.empty(this.mapGetData.setDresslistMetro)) {
          this.mapGetData.setDresslistMetro.forEach(itemMetro => {
            if (item.id == itemMetro.id) {
              label.setStyle({
                background: '#F41809',
              })
            }
          })
        }
        label.setZIndex(9999)
        map.addOverlay(label)
        this.blockList.push(label)
        label.addEventListener("click", (e) => {
          label.setStyle({
            background: '#F41809',
          })
          this.blockList.forEach(item => {
            item.hide()
          })
          map.setZoom(17);
          map.panTo(point);
          this.mapGetData.zoom = 16
          setTimeout(() => {
            this.getMapData(map)
          }, 500);
        })
      })
    })
  },
  // 地铁站的标注 2023.4.6改版的
  getMetroMarker (map) {
    this.$nextTick(() => {
      this.dataMetroList.rows.forEach(item => {
        var point = new BMap.Point(item.longitude, item.latitude)
        var opts = {
          position: point, // 指定文本标注所在的地理位置
          offset: new BMap.Size(-40, -30) //设置文本偏移量
        }
        var label = new BMap.Label('<div class="label-metro"><img src="https://appv2.yfdc.net:444/h5ht/static/maphouse/icon_metro_marker.png" alt=""><div>' + item.area_name + '</div></div>', opts);
        label.setStyle({
          borderRadius: '0.5rem',
          background: '#F41809',
          border: 'none',
          cursor: "pointer",
          zIndex: '9999'
        })
        label.setZIndex(9999)
        map.addOverlay(label)
        this.metroList.push(label)
      })
    })
  },
  // 建议多边形覆盖物（区域的边界）
  getBoundary (mapBorder) {
    // var bounDary = new BMap.Boundary();  //创建多边形
    if (!this.$commonUtils.utilCore.empty(this.bounDaryData)) {
      this.newMap.removeOverlay(this.bounDaryData)
    }
    // 2023.4.19 使用后端的数据划分边界
    if (!this.$commonUtils.utilCore.empty(mapBorder)) {
      const tempPolygon = new BMap.Polygon(mapBorder, {
        strokeWeight: 2, //	边线的宽度，以像素为单位
        strokeColor: '#F45C45', // 边线颜色
        // fillColor: 'rgba(53, 126, 244,0.1)' //填充颜色
        fillColor: '#FFE47A', //填充颜色
        fillOpacity: 0.3,
      }); // 建立多边形覆盖物
      this.newMap.addOverlay(tempPolygon); // 添加覆盖物
      this.bounDaryData = tempPolygon
    }
    // bounDary.get(name, (data) => {
    //   if (data) {
    //     const tempPolygon = new BMap.Polygon(data.boundaries[0], {
    //       strokeWeight: 4, //	边线的宽度，以像素为单位
    //       strokeColor: '#F45C45', // 边线颜色
    //       // fillColor: 'rgba(53, 126, 244,0.1)' //填充颜色
    //       fillColor: '#FFE47A', //填充颜色
    //       fillOpacity: 0.3,
    //     }); // 建立多边形覆盖物
    //     this.newMap.addOverlay(tempPolygon); // 添加覆盖物
    //     this.bounDaryData = tempPolygon
    //   }
    //   console.log('构造', data);
    // })
  },
  // 获取板块中心点并跳转
  async setBlockGetPosition (block_id, typeIndex, map) {
    const postData = {
      block_id: block_id || "",//	是	string	板块id
      type: typeIndex == 0 ? '1' : typeIndex == 2 ? '2' : '',//	是	string	1二手房 2租房
    }
    const res = await this.$store.dispatch('map/getAppFangMapaGetPosition', postData);
    if (res) {
      this.mapGetData.zoom = 16
      this.titleDistrict = this.mapGetData.setDistrictList[0].name
      // 创建区域边界覆盖物
      this.getBoundary(this.mapGetData.setDistrictList[0].map_border)
      if (!this.$commonUtils.utilCore.empty(res.longitude) && !this.$commonUtils.utilCore.empty(res.latitude)) {
        var point = new BMap.Point(res.longitude
          , res.latitude);  // 创建点坐标
      } else {
        console.log('无板块中心坐标', res);
        // 如果没有数据就用回原本的坐标
        var point = new BMap.Point(this.mapGetData.setDistrictList[0].longitude, this.mapGetData.setDistrictList[0].latitude);  // 创建点坐标 
      }
      map.setZoom(17);
      map.panTo(point);
      setTimeout(() => {
        this.getMapData(map);
      }, 500);
    }
  },
}

export default mapJS
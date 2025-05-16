/**
 * 页面工具类函数,避免与页面内方法冲突,函数名统一以tools开头,已经合局混入
 */
export default {
  methods: {
    /**
     * 页面跳转
     * routerObj:对应于==》router.push(routerObj)
     */
    toolsGoPageView: function (routerObj, type = "push") {
      // 处理用户自动登陆
      if (this.$store) {
        if (this.$store.state.user && !this.$store.state.user.isLogin) {
          // 进行用户自动登录
          //this.$store.dispatch('user/initLogin')
        }
      }
      if (this.$commonUtils.utilCore.empty(routerObj) || !this.$commonUtils.utilCore.isObject(routerObj)) {
        this.$commonUtils.appLog.log("跳转地址为空");
        return;
      }
      // 处理 首页 显示问题
      if (!this.$commonUtils.utilCore.empty(routerObj.query)) {
        if ((routerObj.path === "/common/index" || routerObj.name === "common-index") && (routerObj.query.path || routerObj.query.page)) {
          this.$store.commit('common/setIndexPage', (routerObj.query.path || routerObj.query.page));
        }
      }
      this.$router[type](routerObj)
      return;
    },
    /**
   * 获取页面址址
   */
    toolsGetPageUrl: function (uri, param) {
      let url = uri
      if (!this.$commonUtils.utilCore.empty(param)) {
        let queryString = ''
        if (this.$commonUtils.utilCore.isObject(param)) {
          for (const key in param) {
            queryString += key + '=' + encodeURIComponent(param[key]) + '&'
          }
          queryString = queryString.substr(0, queryString.length - 1)
        } else if (typeof param === 'string' && /\=/.test(param)) {
          queryString = param
        } else {
          queryString = 'not_key=' + encodeURIComponent(param)
        }
        if (/\?/.test(url)) {
          url += '&' + queryString
        } else {
          url += '?' + queryString
        }
      }
      return url
    },
    /**
     * WEB页面返回
     */
    toolsGoPageBack: function (num) {
      // this.$commonUtils.appLog.log("要返回的地址为：", this.$router.yuFengFormPage); //keepAlive会报错，暂不用
      num = num || -1
      //如果有上一页，则返回上一页
      if (this.$router && this.$router.yuFengFormPage && this.$router.yuFengFormPage.path) {
        this.$router.go(-1);
      } else {//如果没有上一页，则跳转到首页
        this.$router.push({ path: "/common/index" });
      }
      return;
    },
    /**
     * 页面参数
     */
    toolsGetPageParam: function (event, key) {
      let value = ''
      key = key || 'not_key'
      if (this.$commonUtils.utilCore.isObject(event)) {
        if (key in event) {
          try {
            value = decodeURIComponent(event[key])
          } catch (exception) {
            this.$commonUtils.appLog.error('exception:' + exception.message)
            value = event[key]
          }
        }
      }
      return value
    },
    /**
     * 比较一段范围内的两个数，并显示相应信息
     */
    toolsDisplayRangeInfo (minValue, maxValue, dataType) {
      let unit = ''
      let rangeInfo = ''

      minValue = (!isNaN(minValue)) ? minValue : 0
      maxValue = (!isNaN(maxValue)) ? maxValue : 0
      minValue = Math.min(minValue, maxValue)
      maxValue = Math.max(minValue, maxValue)

      switch (dataType) {
        case 1: //	销售单价
          unit = '元/m²'
          break
        case 2: //	租金单价
          unit = '元/月'
          break
        case 3: //	面积
          unit = 'm²'
          break
        case 4: //	价格（万）
          unit = '万'
          break
        case 5: //	价格（元）
          unit = '元'
          break
        case 6: //	人数（人）
          unit = '人'
          break
      }
      if (minValue == 0 && maxValue == 0) {
        rangeInfo = ''
      } else if (minValue == 0) {
        rangeInfo = maxValue + unit + '或以下'
      } else if (maxValue == 0) {
        rangeInfo = minValue + unit + '或以上'
      } else if (minValue == maxValue) {
        rangeInfo = maxValue + unit
      } else {
        rangeInfo = minValue + '-' + maxValue + unit
      }
      return rangeInfo
    },
    /**
     * 打开电话页面
     * @param {Object} tel
     */
    toolsGoPageTel (tel) {
      if (!this.$commonUtils.utilCore.empty(tel)) {
        window.location.href = "tel:" + tel;
        return;
      } else {
        this.$commonUtils.utilCore.showToast("电话号码为空");
        return;
      }
    },
    /**
     * 事件空方法
     * @param {Object} event
     */
    toolsEventEmptyHandle (event) {
      return false
    },
    /**
     * 获取数组数据selected状态
     * @param {Object} rows
     */
    toolsGetRowsSelectedIds (rows) {
      let ids = ''
      for (const key in rows) {
        if (rows[key].selected) {
          ids += key + ','
        }
      }
      ids = ids.length ? ids.substr(0, ids.length - 1) : ids
      return ids
    },
    /**
     * 设置数组数据selected状态
     * @param {Object} rows
     * @param {Object} ids
     */
    toolsSetRowsSelectedIds (rows, ids) {
      if (ids) {
        for (const key in rows) {
          if ((new RegExp('(^|,)' + key + '($|,)')).test(ids)) {
            rows[key].selected = true
          } else {
            rows[key].selected = false
          }
        }
      } else {
        for (const key in rows) {
          rows[key].selected = false
        }
      }
      return rows
    },
    /**
     * 版本字符串比较
     * @param {Object} curr
     * @param {Object} promote
     */
    toolsVersionCompare (curr, promote) {
      const currVer = curr || '0.0.0'
      const promoteVer = promote || '0.0.0'
      if (currVer === promoteVer) return false
      const currVerArr = currVer.split('.')
      const promoteVerArr = promoteVer.split('.')
      const len = Math.max(currVerArr.length, promoteVerArr.length)
      let proVal, curVal
      for (var i = 0; i < len; i++) {
        proVal = ~~promoteVerArr[i]
        curVal = ~~currVerArr[i]
        if (proVal < curVal) {
          return false
        } else if (proVal > curVal) {
          return true
        }
      }
      return false
    },
    /**
     * 文件大小格式化
     * @param {Object} fileSize
     */
    toolsFormatFileSize (fileSize) {
      if (fileSize < 1024) {
        return fileSize + 'B'
      } else if (fileSize < (1024 * 1024)) {
        let temp = fileSize / 1024
        temp = temp.toFixed(2)
        return temp + 'KB'
      } else if (fileSize < (1024 * 1024 * 1024)) {
        let temp = fileSize / (1024 * 1024)
        temp = temp.toFixed(2)
        return temp + 'MB'
      } else {
        let temp = fileSize / (1024 * 1024 * 1024)
        temp = temp.toFixed(2)
        return temp + 'GB'
      }
    },
    /**
   * 是否完整URL
   * @param {String} url
   */
    toolsIsCompleteUrl: function (url) {
      return /^(https?|wss?):\/\//i.test(url);
    },
    /**
   * 获取完整URL
   * @param {String} url
   * @param {String} baseUrl
   */
    toolsGetCompleteUrl (url, baseUrl) {
      if (url && baseUrl && !this.toolsIsCompleteUrl(url)) {
        url = baseUrl.replace(/(\/+$)/, "") + "/" + url.replace(/(^\/+)/, "");
      }
      return url;
    },
    /**
    * 图片地址转换
    * @param {Object} url
    * @param {String} image
    */
    toolsGetWebStaticUrl (url, image) {
      image = image || (this.$appConfig.appWebStaticUrl + 'common/house.png')
      url = url || image;
      if (url) {
        url = this.toolsGetCompleteUrl(url, this.$appConfig.appApiUrl)
        url = url.replace('http://pic.yfdc.net:90/', this.toolsGetCompleteUrl('/pic_pc/', this.$appConfig.appApiUrl));
        url = url.replace('http://121.14.195.187:88/', this.toolsGetCompleteUrl('/pic_erp/', this.$appConfig.appApiUrl));
        url = url.replace('http://121.14.195.73:8205/', this.toolsGetCompleteUrl('/pic_test/', this.$appConfig.appApiUrl));
        url = url.replace('http://121.14.195.73:8300/', this.toolsGetCompleteUrl('/', this.$appConfig.appApiUrl));
      }
      return url;
    },
    // 获取房源错误图片 $event, type= 1 大图; (item, key 直接 赋值数据上，放大图片可用)
    toolsGetErrorHouseImage (event, type = 0, item, key) {
      let img = event.srcElement;
      img.src = this.$appConfig.appWebStaticUrl + 'common/house.png';
      if (type == 1) {
        img.src = this.$appConfig.appWebStaticUrl + 'common/house-big.png';
      } else if (type == 2) {
        img.src = this.$appConfig.appWebStaticUrl + 'common/house-shooting.png';
      }
      if (item) {
        item[key] = img.src;
      }
      img.onerror = null; //防止闪图
    },
    // 默认头像图片 $event, type= 1 女; type=2 房源经纪人默认头像 (item, key 直接 赋值数据上，放大图片可用)； 默认男
    toolsGetErroAvatarImage (event, type = 0, item, key) {
      let img = event.srcElement;
      img.src = this.$appConfig.appWebStaticUrl + 'common/defaultMenAvatar.png';
      if (type == 1) {
        img.src = this.$appConfig.appWebStaticUrl + 'common/defaultFemaleAvatar.png';
      } else if (type == 2) {
        img.src = this.$appConfig.appWebStaticUrl + '/common/icon_broker.png';
      }
      if (item) {
        item[key] = img.src;
      }
      img.onerror = null; //防止闪图
    },
    /**
   * vr url http改为https
   * @param {String} url
   */
    toolsUrlConversion: function (url) {
      let reg = /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i;
      let path = url.replace(reg, "https://$2$3$4$5$6");
      return path
    },
  }
}
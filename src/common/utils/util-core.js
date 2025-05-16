/**
 * 核心工具条
 */

import { Toast, Dialog, Loading } from "vant";
import router from '@/router'
// import store from "@/store";

const utilCore = {
  getSys: function () {
    let sys = "Android";
    if (navigator.userAgent.match("Android")) {
      sys = "Android";
    } else if (navigator.userAgent.match("iPhone")) {
      sys = "IOS";
    } else if (navigator.userAgent.match("iPad")) {
      sys = "IOS";
    }
    return sys;
  },
  /**
   * 判断变量是否为空,与php的empty相似，字符串'0'也为空
   * @param {Object} value
   */
  empty: function (value) {
    switch (typeof value) {
      case 'undefined':
        return true
      case 'string':
        if (value.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true
        value = Number(value)
        if (!isNaN(value) && !value) return true
        break
      case 'boolean':
        if (!value) return true
        break
      case 'number':
        if (value === 0 || isNaN(value)) return true
        break
      case 'object':
        if (value === null || value.length === 0) return true
        for (var i in value) {
          return false
        }
        return true
    }
    return false
  },
  /**
   * 对象类型
   */
  objectType: {
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Object]': 'object',
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Date]': 'date',
    '[object RegExp]': 'regexp',
    '[object Error]': 'error'
  },
  /**
   * 获取变量类型
   * @param {Object} value
   */
  type: function (value) {
    return value == null ? String(value) : utilCore.objectType[Object.prototype.toString.call(value)] || 'object'
  },
  /**
   * 是否函数类型
   * @param {Object} value
   */
  isFunction: function (value) {
    return utilCore.type(value) === 'function'
  },
  /**
   * 是否数组类型
   * @param {Object} value
   */
  isArray: function (value) {
    return utilCore.type(value) === 'array'
  },
  /**
   * 是否对象类型
   * @param {Object} value
   */
  isObject: function (value) {
    return utilCore.type(value) === 'object'
  },
  /**
   * 是否布尔类型
   * @param {Object} value
   */
  isBoolean: function (value) {
    return utilCore.type(value) === 'boolean'
  },
  /**
   * 是否数字类型
   * @param {Object} value
   */
  isNumber: function (value) {
    return utilCore.type(value) === 'number'
  },
  /**
   * 是否字符串类型
   * @param {Object} value
   */
  isString: function (value) {
    return utilCore.type(value) === 'string'
  },
  /**
   * 是否日期类型
   * @param {Object} value
   */
  isDate: function (value) {
    return utilCore.type(value) === 'date'
  },
  /**
   * 是否正则类型
   * @param {Object} value
   */
  isRegexp: function (value) {
    return utilCore.type(value) === 'regexp'
  },
  /**
   * 是否错误类型
   * @param {Object} value
   */
  isError: function (value) {
    return utilCore.type(value) === 'error'
  },
  /**
   * 是否数字
   * @param {Object} value
   */
  isNumeric: function (value) {
    var num = Number(value)
    var type = typeof value
    return value != null && type != 'boolean' && (type != 'string' || value.length) && !isNaN(num) && isFinite(num) ||
      false
  },
  /**
   * 是否Window对象
   * @param {Object} obj
   */
  isWindow: function (obj) {
    return obj != null && obj == obj.window
  },
  /**
   * 是否Document对象
   * @param {Object} obj
   */
  isDocument: function (obj) {
    return obj != null && obj.nodeType == obj.DOCUMENT_NODE
  },
  /**
   * 是否纯粹对象
   * @param {Object} value
   */
  isPlainObject: function (value) {
    if (!value || !utilCore.isObject(value)) {
      return false
    }
    var proto = Object.getPrototypeOf(value)
    if (!proto) {
      return true
    }
    var Ctor = Object.prototype.hasOwnProperty.call(proto, 'constructor') && proto.constructor
    return typeof Ctor === 'function' && Object.prototype.hasOwnProperty.toString.call(Ctor) === Object.prototype.hasOwnProperty
      .toString.call(Object)
  },
  /**
   * 判断数组是否包含元素
   * @param {Object} elem
   * @param {Array} array
   * @param {Number} fromIndex
   */
  inArray: function (elem, array, fromIndex) {
    return Array.prototype.indexOf.call(array, elem, fromIndex) >= 0
  },
  /**
   * 是否完整URL
   * @param {String} url
   */
  isCompleteUrl: function (url) {
    return /^(https?|wss?):\/\//i.test(url)
  },
  /**
   * 判断url是否是绝对地址
   */
  isAbsoluteUrl: function (url) {
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
  },
  /**
   * 判断是否是JSON字符串
   * @param {*} str 
   * @returns 
   */
  isJsonString (str) {
    try {
      if (str && str != "" && typeof JSON.parse(str) == "object") {
        return true;
      }
    } catch (e) {
    }
    return false;
  },
  /**
   * 判断只是数据才会返回 true(小数也会反回false)
   * @param {*} val
   * @returns
   */
  checkIsNumber (val) {
    if (val == "") {
      return false;
    }
    let isnum = /^\d+$/.test(val);
    return isnum
  },
  /**
   * 获取完整URL
   * @param {String} url
   * @param {String} baseUrl
   */
  getCompleteUrl: function (url, baseUrl) {
    if (url && baseUrl && !utilCore.isCompleteUrl(url)) {
      url = baseUrl.replace(/(\/+$)/, '') + '/' + url.replace(/(^\/+)/, '')
    }
    return url
  },
  /**
   * 是否ssl协议
   */
  isHttps: function () {
    let result = null
    if (process.env.NODE_ENV === 'production') {
      // #ifdef H5
      result = window.location.protocol === 'https:'
      // #endif
    }
    return result
  },
  /**
   * 判断是否手机号
   * @param {*} tel 
   * @param {*} type 
   */
  isPhone (tel) {
    if (tel.length != 11) {
      return false
    }
    let myreg = /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(tel)) {
      return false;
    }
    return true;
  },
  /**
   * 数组过滤回调
   * @param {Array} array
   * @param {Object} callback
   */
  filter: function (array, callback) {
    return Array.prototype.filter.call(array, callback)
  },
  /**
   * 数组或对象循环回调,返回false中断循环
   * @param {Object} elements
   * @param {Object} callback
   */
  each: function (elements, callback) {
    for (var key in elements) {
      if (callback.call(elements[key], key, elements[key]) === false) return elements
    }
    return elements
  },
  /**
   * 数组或对象循环回调,过滤null值
   * @param {Object} elements
   * @param {Object} callback
   */
  map: function (elements, callback) {
    var value, values
    if (utilCore.isArray(elements)) {
      values = []
      for (const key in elements) {
        value = callback(elements[key], key)
        if (value != null) values.push(value)
      }
    } else {
      values = {}
      for (const key in elements) {
        value = callback(elements[key], key)
        if (value != null) values[key] = value
      }
    }
    return values
  },
  /**
   * 字符串驼峰转换
   * @param {String} str
   */
  camelCase: function (str) {
    // fooBar
    str = str.replace(/^[-_\s]*([a-zA-Z])?/g, function (match, chr) {
      return chr ? chr.toLowerCase() : ''
    })
    str = str.replace(/[-_\s]+([a-zA-Z])?/g, function (match, chr) {
      return chr ? chr.toUpperCase() : ''
    })
    return str
  },
  /**
   * 字符串-分割转换
   * @param {String} str
   */
  kebabCase: function (str) {
    // foo-bar
    str = str.replace(/^[-_\s]*([a-zA-Z])?/g, function (match, chr) {
      return chr ? chr.toLowerCase() : ''
    })
    str = str.replace(/[-_\s]+([a-zA-Z])?/g, function (match, chr) {
      return chr ? '-' + chr.toLowerCase() : ''
    })
    str = str.replace(/([A-Z])?/g, function (match, chr) {
      return chr ? '-' + chr.toLowerCase() : ''
    })
    return str
  },
  /**
   * 字符串_分割转换
   * @param {String} str
   */
  snakeCase: function (str) {
    // foo_bar
    str = str.replace(/^[-_\s]*([a-zA-Z])?/g, function (match, chr) {
      return chr ? chr.toLowerCase() : ''
    })
    str = str.replace(/[-_\s]+([a-zA-Z])?/g, function (match, chr) {
      return chr ? '_' + chr.toLowerCase() : ''
    })
    str = str.replace(/([A-Z])?/g, function (match, chr) {
      return chr ? '_' + chr.toLowerCase() : ''
    })
  },
  /**
   * 字符串首字母小写
   * @param {String} str
   */
  lowerFirst: function (str) {
    return str.replace(/^[-_\s]*([a-zA-Z])?/g, function (match, chr) {
      return chr ? chr.toLowerCase() : ''
    })
  },
  /**
   * 字符串首字母大写
   * @param {String} str
   */
  upperFirst: function (str) {
    return str.replace(/^[-_\s]*([a-zA-Z])?/g, function (match, chr) {
      return chr ? chr.toUpperCase() : ''
    })
  },
  /**
   * 数组对象查找
   * @param {Object} rows
   * @param {Object} find
   * @param {Object} field
   */
  getRowByKey: function (rows, find, field) {
    return (find in rows) ? (field ? ((field in rows[find]) ? rows[find][field] : '') : rows[find]) : ''
  },
  /**
   * 数组对象查找
   * @param {Object} rows
   * @param {Object} finds
   * @param {Object} field
   */
  getRowByKeys: function (rows, finds, field) {
    var result = []
    if (!utilCore.isArray(finds)) {
      finds = finds.toString().split(',')
    }
    for (var index in finds) {
      var find = finds[index]
      var value = utilCore.getRowByKey(rows, find, field)
      if (value) result.push(value)
    }
    if (!utilCore.isArray(finds)) {
      return result.join(',')
    } else {
      return result
    }
  },
  /**
   * 数组对象查找
   * @param {Object} rows
   * @param {Object} find
   * @param {Object} index
   * @param {Object} field
   */
  getRowByColumn: function (rows, find, index, field) {
    for (var key in rows) {
      if (index in rows[key]) {
        if (rows[key][index] === find) {
          if (field) {
            if (field in rows[key]) {
              return rows[key][field]
            } else {
              return ''
            }
          } else {
            return rows[key]
          }
        }
      }
    }
    return ''
  },
  /**
   * 对象合并
   * @param {Object} target
   * @param {Object} source
   * @param {Object} deep
   */
  extendWith: function (target, source, deep) {
    for (var key in source) {
      if (deep && (utilCore.isPlainObject(source[key]) || utilCore.isArray(source[key]))) {
        if (utilCore.isPlainObject(source[key]) && !utilCore.isPlainObject(target[key])) {
          target[key] = {}
        }
        if (utilCore.isArray(source[key]) && !utilCore.isArray(target[key])) {
          target[key] = []
        }
        utilCore.extendWith(target[key], source[key], deep)
      } else if (source[key] !== undefined) {
        target[key] = source[key]
      }
    }
  },
  /**
   * 对象合并，类似jquery的extend
   * @param {Object} target
   */
  extend: function (target) {
    var deep
    var args = Array.prototype.slice.call(arguments, 1)
    if (utilCore.isBoolean(target)) {
      deep = target
      target = args.shift()
    }
    args.forEach(function (arg) {
      utilCore.extendWith(target, arg, deep)
    })
    return target
  },
  /**
   * 对象覆盖
   * @param {Object} target
   * @param {Object} source
   */
  cover: function (target, source) {
    for (var key in target) {
      if (!utilCore.empty(source[key])) {
        if (utilCore.isPlainObject(target[key])) {
          if (utilCore.isPlainObject(target[key]) && utilCore.isPlainObject(source[key])) {
            utilCore.cover(target[key], source[key])
          }
        } else if (utilCore.isArray(target[key])) {
          if (utilCore.isArray(target[key]) && utilCore.isArray(source[key])) {
            target[key] = source[key]
          }
        } else {
          target[key] = source[key]
        }
      } else if (utilCore.isNumber(source[key])) {
        target[key] = source[key]
      }
    }
  },
  /**
   * 对象重置
   * @param {Object} target
   */
  reset: function (target) {
    for (var key in target) {
      if (utilCore.isPlainObject(target[key])) {
        utilCore.reset(target[key])
      } else if (utilCore.isArray(target[key])) {
        target[key] = []
      } else if (utilCore.isNumber(target[key])) {
        target[key] = 0
      } else if (utilCore.isBoolean(target[key])) {
        target[key] = false
      } else {
        target[key] = ''
      }
    }
  },
  /**
   * 类似jquery的serialize
   * @param {Object} params
   * @param {Object} object
   * @param {Object} shallow
   * @param {Object} scope
   */
  serialize: function (params, object, shallow, scope) {
    var value, sType
    var bIsArray = utilCore.isArray(object)
    var bIsPlain = utilCore.isPlainObject(object)
    for (var key in object) {
      value = object[key]
      sType = utilCore.type(value)
      if (scope) {
        key = shallow ? scope : scope + '[' + (bIsPlain || sType === 'object' || sType === 'array' ? key
          : '') + ']'
      }
      if (!scope && bIsArray) params.add(value.name, value.value)
      else if (sType === 'array' || (!shallow && sType === 'object')) utilCore.serialize(params, value, shallow, key)
      else params.add(key, value)
    }
  },
  /**
   * 类似jquery的param
   * @param {Object} object
   * @param {Object} shallow
   */
  param: function (object, shallow) {
    var params = []
    params.add = function (key, value) {
      if (utilCore.isFunction(value)) value = value()
      if (value == null) value = ''
      this.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
    }
    utilCore.serialize(params, object, shallow)
    return params.join('&').replace(/%20/g, '+')
  },
  /**
   * 对encodeURIComponent参数解码
   * @param {Object} param
   */
  query: function (param) {
    if (utilCore.isPlainObject(param)) {
      for (var key in param) {
        param[key] = utilCore.query(param[key])
      }
    } else if (utilCore.isString(param)) {
      param = decodeURIComponent(param)
    }
    return param
  },
  /**
   * url参数拼接
   * @param {Object} url
   * @param {Object} param
   */
  url: function (url, param) {
    if (!utilCore.empty(param)) {
      param = utilCore.isPlainObject(param) ? utilCore.param(param) : param
      url += ((/\?/).test(url) ? '&' : '?') + param
    }
    return url
  },
  /**
   * 对象深度克隆
   */
  deepClone: function (object = {}) {
    let o, i, j
    if (typeof (object) !== 'object' || object === null) {
      return object
    }
    if (object instanceof Array) {
      o = []
      i = 0
      j = object.length
      for (; i < j; i++) {
        if (typeof (object[i]) === 'object' && object[i] != null) {
          o[i] = utilCore.deepClone(object[i])
        } else {
          o[i] = object[i]
        }
      }
    } else {
      o = {}
      for (i in object) {
        if (typeof (object[i]) === 'object' && object[i] !== null) {
          o[i] = utilCore.deepClone(object[i])
        } else {
          o[i] = object[i]
        }
      }
    }
    return o
  },
  /**
   * 对象深度合并
   */
  deepMerge: function (target = {}, source = {}) {
    target = utilCore.deepClone(target)
    if (typeof target !== 'object' || typeof source !== 'object') return false
    for (var prop in source) {
      if (!source.hasOwnProperty(prop)) continue
      if (prop in target) {
        if (typeof target[prop] !== 'object') {
          target[prop] = source[prop]
        } else {
          if (typeof source[prop] !== 'object') {
            target[prop] = source[prop]
          } else {
            if (target[prop].concat && source[prop].concat) {
              target[prop] = target[prop].concat(source[prop])
            } else {
              target[prop] = utilCore.deepMerge(target[prop], source[prop])
            }
          }
        }
      } else {
        target[prop] = source[prop]
      }
    }
    return target
  },
  /**
   * 本算法来源于简书开源代码，详见：https://www.jianshu.com/p/fdbf293d0a85
   * 全局唯一标识符（uuid，Globally Unique Identifier）,也称作 uuid(Universally Unique IDentifier)
   * 一般用于多个组件之间,给它一个唯一的标识符,或者v-for循环的时候,如果使用数组的index可能会导致更新列表出现问题
   * 最可能的情况是左滑删除item或者对某条信息流"不喜欢"并去掉它的时候,会导致组件内的数据可能出现错乱
   * v-for的时候,推荐使用后端返回的id而不是循环的index
   * @param {Number} len uuid的长度
   * @param {Boolean} firstU 将返回的首字母置为"u"
   * @param {Nubmer} radix 生成uuid的基数(意味着返回的字符串都是这个基数),2-二进制,8-八进制,10-十进制,16-十六进制
   */
  guid: function (len = 32, firstU = true, radix = null) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    const uuid = []
    radix = radix || chars.length

    if (len) {
      // 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
      for (let i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
    } else {
      let r
      // rfc4122标准要求返回的uuid中,某些位为固定的字符
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
      uuid[14] = '4'

      for (let i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r]
        }
      }
    }
    // 移除第一个字符,并用u替代,因为第一个字符为数值时,该guuid不能用作id或者class
    if (firstU) {
      uuid.shift()
      return 'u' + uuid.join('')
    } else {
      return uuid.join('')
    }
  },
  getEmptyMac: function () {
    const mac = 'F8-CA-B8-26-ED-CE' // '00:00:00:00:00:00'
    return mac
  },
  /**
   * 版本字符串比较
   * @param {Object} curr
   * @param {Object} promote
   */
  versionCompare: function (curr, promote) {
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
  formatFileSize: function (fileSize) {
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
 * 页面跳转
 * @param {String} uri 页面URL,要求全路径
 * @param {Object|String} param
 * @param {String} type 跳转类型，navigateTo,switchTab,redirectTo,reLaunch
 */
  uniGoPage: function (uri, param, type) {
    const url = utilCore.url(uri, param)
    if (!type) {
      if (/^\/pages\/page\//i.test(uri)) {
        type = 'switchTab'
      } else if (/(^\/$)/i.test(uri)) {
        type = 'reLaunch'
      } else {
        type = 'navigateTo'
      }
    }
    uni[type]({ url: url })
  },
  /**
   * 页面返回
   * @param {Object} delta
   */
  uniGoBack: function (delta) {
    delta = delta || 1
    uni.navigateBack({ delta: 1 })
  },

  /**
   * 图片压缩
   * @param img {String } 图片base64数据，不允许直接传入image对象，应为image的src可能跨域
   * @param quality {float} 图片的压缩率，默认是 0.6
   * @param cutType {Boolean} 是否进行缩小【如果宽度大于1280，则需要把高度等比缩小】，默认是 false
   * @return {Promise<String>} 返回数据，如果压缩成功则返回base64，否则返回原数据
   */
  compress (img, quality, cutType) {
    quality = quality || 0.6;
    cutType = cutType || false;//是否缩小图片
    return new Promise(resolve => {
      try {
        let el = new Image();
        el.src = img

        /*
        //旧的不载剪(不等比缩小)代码
        el.onload = function () {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')
          canvas.width = el.width;
          canvas.height = el.height;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(el, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        }
        */

        //====begin新的加入了需要裁剪(等比缩小)的代码
        el.onload = function () {
          let tmp_arr = {
            width: el.width,
            height: el.height
          }
          //如果需要缩小，则等比缩小
          if (cutType) {
            //如果宽度大于1280，则需要把高度等比缩小
            if (tmp_arr.width > 1280) {
              let tmpCut = tmp_arr.width / 1280;
              tmp_arr.width = 1280;
              tmp_arr.height = Math.ceil(tmp_arr.height / tmpCut)
            }
          }
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')
          canvas.width = tmp_arr.width;
          canvas.height = tmp_arr.height;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(el, 0, 0, el.width, el.height, 0, 0, tmp_arr.width, tmp_arr.height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        }
        //==============end 

        el.onerror = function () {
          resolve(img)
        }
      } catch (e) {
        resolve(img)
      }
    });
  },

  // 旧版app价格转换函数money为金额

  getConvertCurrency: function (money, cnlast = false, type = false,) {
    // 汉字的数字
    let cnNums
    if (type) {
      cnNums = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9')
    } else {
      cnNums = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9')
    }
    // 基本单位
    const cnIntRadice = new Array('', '拾', '佰', '仟')
    // 对应整数部分扩展单位
    const cnIntUnits = new Array('', '万', '亿', '兆')
    // 对应小数部分单位
    const cnDecUnits = new Array('角', '分', '毫', '厘')
    // 整数金额时后面跟的字符
    const cnInteger = ''
    // 整型完以后的单位
    const cnIntLast = (cnlast ? '万元' : '元')
    // 最大处理的数字
    const maxNum = 999999999999999.9999
    // 金额整数部分
    let integerNum
    // 金额小数部分
    let decimalNum
    // 输出的中文金额字符串
    let chineseStr = ''
    // 分离金额后用的数组，预定义
    let parts
    if (money == '') {
      return ''
    }
    money = parseFloat(money)
    if (money >= maxNum) {
      // 超出最大处理数字
      return ''
    }
    if (money == 0) {
      chineseStr = cnNums[0] + cnIntLast + cnInteger
      return chineseStr
    }
    // 转换为字符串
    money = money.toString()
    if (money.indexOf('.') == -1) {
      integerNum = money
      decimalNum = ''
    } else {
      parts = money.split('.')
      integerNum = parts[0]
      decimalNum = parts[1].substr(0, 4)
    }
    // 获取整型部分转换
    if (parseInt(integerNum, 10) > 0) {
      let zeroCount = 0
      const IntLen = integerNum.length
      for (let i = 0; i < IntLen; i++) {
        const n = integerNum.substr(i, 1)
        const p = IntLen - i - 1
        const q = p / 4
        const m = p % 4
        if (n == '0') {
          zeroCount++
        } else {
          // if (zeroCount > 0) {
          //   chineseStr += cnNums[0];
          // }
          // 归零
          zeroCount = 0
          chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
        }
        if (m == 0 && zeroCount < 4) {
          chineseStr += cnIntUnits[q]
        }
      }
      chineseStr += cnIntLast
    }
    // 小数部分
    if (decimalNum != '') {
      const decLen = decimalNum.length
      for (let i = 0; i < decLen; i++) {
        const n = decimalNum.substr(i, 1)
        if (n != '0') {
          chineseStr += cnNums[Number(n)] + cnDecUnits[i]
        }
      }
    }
    if (chineseStr == '') {
      chineseStr += cnNums[0] + cnIntLast + cnInteger
    } else if (decimalNum == '') {
      chineseStr += cnInteger
    }
    return chineseStr
  },
  /**
   * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
   * 即谷歌、高德 转 百度
   * @param lng
   * @param lat
   * @returns {longitude: string, latitude: string}
   */
  gcj02tobd09: function (lng, lat) {
    // let x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    let x_PI = Math.PI * 3000.0 / 180.0;
    let z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
    let theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
    let bd_lng = z * Math.cos(theta) + 0.0065;
    let bd_lat = z * Math.sin(theta) + 0.006;

    return { 'longitude': bd_lng, 'latitude': bd_lat }
  },
  /**
   * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02) 的转换
   * 即 百度 转 高德
   * @param {Object} bd_lng
   * @param {Object} bd_lat
   * @returns {longitude: string, latitude: string}
   */

  bd_decrypt: function (bd_lng, bd_lat) {
    var X_PI = Math.PI * 3000.0 / 180.0;
    var x = bd_lng - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);

    return { 'longitude': gg_lng, 'latitude': gg_lat }
  },
  /**
   * 数组删除值
   */

  arrayDeleteValue (arr, value) {
    if (arr instanceof Array) {
      let index = arr.indexOf(value);
      if (index > -1) {
        arr.splice(index, 1);
      }
    }
    return arr;
  },

  /**
   * sleep函数，一般用于测试
   * @param ms
   * @returns {Promise<unknown>}
   */
  sleep: ms => new Promise(r => setTimeout(r, ms)),
  /**
   *判断是否是app环境
   */
  isAppPlus () {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.match(/html5plus/i) == "html5plus") {
      return true;
    }
    return false;
  },
  // 下载图片，支持base64下载、链接下载 url下载链接、text下载成功提示文字，isSave是否保存、isBase64是否是Base64、fn回调函数、filename文件名称
  downloadImage (url, text = '', isSave = true, isBase64 = false, fn, filename = '', isImg = true) {
    const imgName = new Date().getTime() + '_yf.jpg';
    if (!utilCore.isAppPlus()) {
      // 创建一个单击事件，并触发的单击事件下载图片
      const a = document.createElement('a');
      const event = new MouseEvent('click');
      // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
      a.download = imgName;
      // 将生成的URL设置为a.href属性
      a.href = url;
      // 触发a的单击事件,下载图片
      a.dispatchEvent(event);
    } else {
      // base64
      if (isBase64) {
        const imageDown = function (url, success, error) {
          var bitmap = new window.plus.nativeObj.Bitmap('image')
          bitmap.loadBase64Data(url, function (i) {
            bigmapToSave(bitmap, success, error)
          }, function (err) {

          })
        }

        const bigmapToSave = function (bitmap, success, error) {
          bitmap.save(`_doc/${imgName}`, {
            overwrite: false
          }, function (event) {
            console.log('target', event.target)
            if (isSave) {
              imageSaveByGallery(event.target, success, error)
            } else {
              fn && fn(event.target)
            }
          }, function (err) {

          })
        }

        const imageSaveByGallery = function (url, success, error) {
          window.plus.gallery.save(url, function (event) {
            const tarbitmap = window.plus.nativeObj.Bitmap.getBitmapById('image')
            tarbitmap.clear()
            success()
          }, function (err) {
            error()
          })
        }
        imageDown(url, () => { //保存到相册方法
          if (isSave) {
            Toast((text || '保存') + '成功');
          }
        }, () => {
          if (isSave) {
            Toast((text || '保存') + '失败');
          }
        });
      } else {
        plus.nativeUI.showWaiting('加载中...')
        const dtask = plus.downloader.createDownload(url, {}, function (d, status) {
          // console.log(111111, JSON.stringify(d))
          // 下载完成
          if (status == 200) {
            if (isImg) {
              plus.gallery.save(d.filename, function (e) {//保存到相册方法
                plus.nativeUI.closeWaiting()
                Toast(text || '已保存到手机相册');
                fn && fn(e)
              }, function (e) {
                console.log(JSON.stringify(e))
                plus.nativeUI.closeWaiting()
                Toast('保存失败，请重试！');
              });
            } else {
              plus.nativeUI.closeWaiting()
              // 下载文件
              Dialog.alert({
                title: "提示",
                message: `打开${filename}？`,
                width: "80%",
                confirmButtonText: "打开",
                cancelButtonText: "关闭",
                showCancelButton: true,
                closeOnClickOverlay: true,
                confirmButtonColor: "#3B97FF",
                cancelButtonColor: "#3B97FF",
                className: 'dialog-style-box2', //自定义弹窗类名
                overlayClass: 'overlay-style', // 自定义遮罩层类名
              }).then(() => {
                plus.runtime.openFile(d.filename);
              });
            }
          } else {
            Toast("下载失败")
          }
        });
        dtask.start();
      }
    }
  },
  //显示toast提示信息
  showToast (msg) {
    if (!utilCore.empty(msg)) {
      Toast(msg)
    }
  },
  //显示对话框
  showDialog (options) {
    if (utilCore.empty(options) || !utilCore.isObject(options) || utilCore.empty(options.message)) {
      Toast("请设置对话内容！");
      return;
    }
    Dialog.alert(options);
  },
  /**
   * 显示加载
   * @param {Object} title
   */
  showLoading: function (title, options = {}) {
    Toast.loading({
      message: title || '加载中...',
      duration: 30000,
      forbidClick: true,
      ...options
    })
  },
  /**
   * 关闭加载
   */
  closeLoading: function (t) {
    setTimeout(() => {
      Toast.clear()
    }, t || 300)
  },

  /**
   * 校验uid格式
   */
  checkUid (uid) {
    if (typeof uid !== 'string') {
      throw new Error('参数to（' + uid + '） 类型错误，必须是字符串。')
    }
    let prefix = uid.slice(0, 2);
    if (!['a_', 'b_', 'u_'].includes(prefix)) {
      throw new Error('参数to（' + uid + '） 前缀错误，只能是"a_"、"b_"、"u_"开头, 当前前缀：' + prefix)
    }
    let id = uid.replace(prefix, '');
    if (! /^\d*$/.test(id)) {
      throw new Error('参数to（' + uid + '） 包含的erp_id错误，只能是数字，当前是：' + id)
    }
  }
}

export default utilCore

/**
 * 时间相关的工具条
 */

import utilCore from '@/common/utils/util-core.js'

const utilDate = {
  /**
     * 解析日期字符串
     * @param {String} time
     * @param {Date} date
     */
  parseDate: function (time, date) {
    date = date || new Date(0)
    var match = /^(\d{2,4})[^\d](\d{1,2})[^\d](\d{1,2})/.exec(time)
    if (match) {
      var year = parseInt(match[1])
      var month = parseInt(match[2])
      var day = parseInt(match[3])
      if (year) {
        date.setFullYear(year)
      }
      if (month) {
        date.setMonth(month - 1)
      }
      if (day) {
        date.setDate(day)
      }
    }
    return date
  },
  /**
   * 解析日期时间字符串
   * @param {String} time
   * @param {Date} date
   */
  parseDateTime: function (time, date) {
    date = date || new Date(0)
    var match = /^(\d{2,4})[^\d](\d{1,2})[^\d](\d{1,2})[^\d](\d{1,2})[^\d](\d{1,2})[^\d](\d{1,2})/.exec(time)
    if (match) {
      var year = parseInt(match[1])
      var month = parseInt(match[2])
      var day = parseInt(match[3])
      var hour = parseInt(match[4])
      var minute = parseInt(match[5])
      var second = parseInt(match[6])
      if (year) {
        date.setFullYear(year)
      }
      if (month) {
        date.setMonth(month - 1)
      }
      if (day) {
        date.setDate(day)
      }
      if (hour) {
        date.setHours(hour)
      }
      if (minute) {
        date.setMinutes(minute)
      }
      if (second) {
        date.setSeconds(second)
      }
    }
    return date
  },
  /**
   * 获取时间戳
   * @param {Date} date
   */
  time: function (date) {
    if (!utilCore.isDate(date)) {
      date = new Date()
    }
    return Math.round(date.getTime() / 1000)
  },
  /**
   * 时间格式化
   * @param {String} format
   * @param {Number|Date} time 时间戳或日期对象
   */
  date: function (format, time) {
    var result = ''
    var date = new Date()
    format = format || 'Y-m-d H:i:s'
    if (utilCore.isDate(time)) {
      date = time
    } else if (utilCore.isNumeric(time)) {
      if (time.toString().length == 10) { time *= 1000 }
      date.setTime(parseInt(time))
    }
    for (var i = 0; i < format.length; i++) {
      switch (format[i]) {
        case 'Y':
          result += (Array(4).join('0') + date.getFullYear()).slice(-4)
          break
        case 'm':
          result += (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
          break
        case 'd':
          result += (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
          break
        case 'H':
          result += (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours())
          break
        case 'i':
          result += (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes())
          break
        case 's':
          result += (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds())
          break
        default:
          result += format[i]
          break
      }
    }
    return result
  },
  /**
   * 时间格式化中文
   * @param {String} format
   * @param {Number|Date} time 时间戳或日期对象
   */
  dateChinese: function (format, time) {
    var result = ''
    var date = new Date()
    format = format || 'Y-m-d H:i:s'
    if (utilCore.isDate(time)) {
      date = time
    } else if (utilCore.isNumeric(time)) {
      if (time.toString().length == 10) { time *= 1000 }
      date.setTime(parseInt(time))
    }
    for (var i = 0; i < format.length; i++) {
      switch (format[i]) {
        case 'Y':
          result += (Array(4).join('0') + date.getFullYear()).slice(-4) + "年"
          break
        case 'm':
          result += (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + "月"
          break
        case 'd':
          result += (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + "日"
          break
        case 'H':
          result += (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours())
          break
        case 'i':
          result += (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes())
          break
        case 's':
          result += (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds())
          break
        default:
          result += format[i]
          break
      }
    }

    return result.replace(new RegExp(/-/g), '')
  },
  /**
   * 时间戳转为多久之前
   * @param String timestamp 时间戳
   * @param String | Boolean format 如果为时间格式字符串，超出一定时间范围，返回固定的时间格式；
   * 如果为布尔值false，无论什么时间，都返回多久以前的格式
   */
  timeFrom: function (timestamp = null, format = 'Y-m-d') {
    if (timestamp == null) { timestamp = Number(new Date()) }
    timestamp = parseInt(timestamp)
    // 判断用户输入的时间戳是秒还是毫秒,一般前端js获取的时间戳是毫秒(13位),后端传过来的为秒(10位)
    if (timestamp.toString().length == 10) { timestamp *= 1000 }
    var timer = (new Date()).getTime() - timestamp
    timer = parseInt(timer / 1000)
    // 如果小于5分钟,则返回"刚刚",其他以此类推
    let tips = ''
    switch (true) {
      case timer < 300:
        tips = '刚刚'
        break
      case timer >= 300 && timer < 3600:
        tips = parseInt(timer / 60) + '分钟前'
        break
      case timer >= 3600 && timer < 86400:
        tips = parseInt(timer / 3600) + '小时前'
        break
      case timer >= 86400 && timer < 2592000:
        tips = parseInt(timer / 86400) + '天前'
        break
      default:
        // 如果format为false，则无论什么时间戳，都显示xx之前
        if (format === false) {
          if (timer >= 2592000 && timer < 365 * 86400) {
            tips = parseInt(timer / (86400 * 30)) + '个月前'
          } else {
            tips = parseInt(timer / (86400 * 365)) + '年前'
          }
        } else {
          tips = utilDate.date(format, timestamp)
        }
    }
    return tips
  },
  dateToWeek: function (thisDate, type = '星期') {
    if (utilCore.empty(thisDate)) {
      thisDate = utilDate.date("Y-m-d")
    }
    var date = new Date(thisDate);
    var day = date.getDay();
    day = day == 0 ? day = 7 : day;
    var dayArr = { 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '日' };
    return type + dayArr[day]
  },
  /**
 * 获取月份
 * @param {*} dataTime => 年-月-日 格式的时间
 * @param {*} formatType=>获取的格式（Y年，M月，D日）
 */
  getMonth (dataTime, formatType) {
    if (utilCore.empty(dataTime)) {
      return " "
    }
    let tmpVal = dataTime.split("-");
    if (formatType == "Y") {
      return tmpVal[0];
    } else if (formatType == "D") {
      return tmpVal[2];
    } else {
      return tmpVal[1];
    }
  },
  /**
   * 【当天】显示上午+时间 ；  下午+时间，
   * 【本周】显示：周几，
   * 【本周以外】显示具体日期，留意【跨年】的时间非本年的需要显示具体年份。
   * @param String timestamp 时间戳
   * @param String | Boolean format 如果为时间格式字符串，超出一定时间范围，返回固定的时间格式；
   * 如果为布尔值false，无论什么时间，都返回多久以前的格式
   */
  timeFromColumn: function (timestamp = null, format = 'Y-m-d') {
    if (timestamp == null) { timestamp = Number(new Date()) }
    timestamp = parseInt(timestamp)
    if (timestamp.toString().length == 10) { timestamp *= 1000 }
    var timer = (new Date()).getTime() - timestamp
    const date = new Date(timestamp)
    const hour = date.getHours();
    timer = parseInt(timer / 1000)
    let tips = ''
    // console.log(timer)
    switch (true) {
      case timer < 86400 && hour <= 12 && (date.getDate() == new Date().getDate()):
        tips = '上午' + hour + ':' + (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes())
        break
      case timer < 86400 && hour >= 12 && (date.getDate() == new Date().getDate()):
        tips = '下午' + hour + ':' + (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes())
        break
      case date.getDate() < new Date().getDate() && utilDate.isSameWeek(date):
        tips = utilDate.dateToWeek(timestamp)
        break
      default:
        // 如果format为false，则无论什么时间戳，都显示xx之前
        if (timer > 0) {
          if (date.getFullYear() == new Date().getFullYear()) {
            tips = parseInt(date.getMonth() + 1) + '月' + date.getDate() + '日'
          } else {
            tips = date.getFullYear() + '年' + parseInt(date.getMonth() + 1) + '月' + date.getDate() + '日'
          }
        } else {
          tips = ''
        }
    }
    return tips
  },
  /**
   * 判断是不是本周
   * js默为一周的起点是周日，则需要根据今天计算出本周覆盖到的日子(注意同一周是可以跨月和跨年的)
   * @param {*} inDate 获取如YYYY/MM/DD的日期
   * @returns 
   */
  isSameWeek (inDate) {
    let inDateStr = inDate.toLocaleDateString();
    let nowDate = new Date();
    let nowTime = nowDate.getTime();
    let nowDay = nowDate.getDay();
    for (let i = 0; i < 7; i++) {
      if (inDateStr == (new Date(nowTime + (i - nowDay) * 24 * 3600 * 1000)).toLocaleDateString()) return true;
    }
    return false;
  }
}

export default utilDate

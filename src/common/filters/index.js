/*
全局过滤器
*/
import commonUtils from '@/common/utils/index.js'
import appConfig from '@/common/configs'

export default {
  /**
   * 格式化日期输出
   * @param {*} val =>要格式化的时间截
   * @param {*} val2 =》如果时间截为空时需要直接显示的时间
   */
  filterDate: function (val, val2) {
    if (commonUtils.utilCore.empty(val)) return val2
    return commonUtils.utilDate.date("Y.m.d", val)
  },
  /**
   * 将年月日时分秒的数据变成只显示日期
   * @param {*} val 
   */
  filterDateTimeDate (val) {
    if (commonUtils.utilCore.empty(val)) return ""
    return val.split(" ")[0]
  },
  //显示售价
  filterPrice: function (val) {
    val = val ? parseInt(val) : 0
    if (val > 100000) {
      return (val / 10000) + '万'
    } else {
      return parseInt(val) + '元'
    }
  },
  /**
   * 显示每平方米售价
   * @param {*} val =>售价
   * @param {*} val2 =>面积
   */
  filterPricePre: function (val, val2) {
    val = val ? parseInt(val) : 0
    val2 = val2 ? parseInt(val2) : 1
    return Math.floor(val / val2) + '元/m²'
  },
  /**
   * 获取月份
   * @param {*} val => 年-月-日 格式的时间
   * @param {*} formatType=>获取的格式（Y年，M月，D日）
   */
  filterMonth (val, formatType) {
    if (commonUtils.utilCore.empty(val)) {
      return " "
    }
    let tmpVal = val.split("-");
    if (formatType == "Y") {
      return tmpVal[0];
    } else if (formatType == "D") {
      return tmpVal[2];
    } else {
      return tmpVal[1];
    }
  },
  /**
  * 格式化时间输出
  * @param {*} val => 年-月-日 时:分:秒 格式的时间
  * @param {*} formatType=>获取的格式（年，-，.）
  */
  filterDate2 (val, formatType) {
    if (commonUtils.utilCore.empty(val)) {
      return " "
    }
    let tmpVal = val.split(" ");
    tmpVal = tmpVal[0].split("-");
    if (formatType == "年") {
      return tmpVal[0] + "年" + tmpVal[1] + "月" + tmpVal[2] + "日";
    } else if (formatType == ".") {
      return tmpVal[0] + "." + tmpVal[1] + "." + tmpVal[2];
    } else {
      return tmpVal[0] + "-" + tmpVal[1] + "-" + tmpVal[2];
    }
  },
}
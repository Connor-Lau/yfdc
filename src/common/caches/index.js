/**
 * 缓存模块处理
 */
// 加载模块
import utilCore from '@/common/utils/util-core.js'
import appLog from '@/common/utils/app-log.js'

const commonCaches = {
  /**
   * 同步按key获取缓存
   * @param {Object} key
   * @param {Object} defaultValue
   */
  getKeyCache: function (key, defaultValue) {
    var tmpData = localStorage.getItem(key)
    // appLog.log("=======--11111111111---======>>>", tmpData)
    if (utilCore.empty(tmpData)) {
      tmpData = defaultValue
    }
    return tmpData
  },
  /**
   * 同步按key设置缓存
   * @param {Object} key
   * @param {Object} value
   */
  setKeyCache: function (key, value) {
    try {
      localStorage.setItem(key, value)
      // appLog.log("=======--22222222222222---======>>>", value)
      return
    } catch (e) {
      appLog.error(e)
    }
  },
  /**
   * 同步按key删除缓存
   * @param {Object} key
   */
  delKeyCache: function (key) {
    try {
      localStorage.removeItem(key)
      return
    } catch (e) {
      appLog.error(e)
    }
  }
}
// 导出模块
export default commonCaches

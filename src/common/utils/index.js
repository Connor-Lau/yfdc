// 加载本目录下的模块
import appLog from '@/common/utils/app-log.js'
import utilCore from '@/common/utils/util-core.js'
import utilCryptoJS from '@/common/utils/util-crypto-js.js'
import utilDate from '@/common/utils/util-date.js'
import utilCache from '@/common/caches/index.js'

const commonUtils = {
  appLog,
  utilCore,
  utilCryptoJS,
  utilDate,
  utilCache
}
// 导出模块
export default commonUtils


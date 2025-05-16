/**
 * 处理输入日志的工具条
 */

import utilCore from '@/common/utils/util-core.js'
import appConfig from '@/common/configs/index.js'

const appLog = {
  /**
     * 日志输出,日志等级：info,log,warn,error
     */
  echo: function(level, args) {
    if (!appConfig.appDebug) {
      return false
    }
    args = args || []
    const levels = ['error', 'warn', 'log', 'info']
    let levelIndex = levels.indexOf(level)
    let logIndex = levels.indexOf(appConfig.appLogLevel)
    levelIndex = levelIndex < 0 ? 0 : levelIndex
    logIndex = levelIndex < 0 ? 0 : logIndex
    if (levelIndex <= logIndex) {
      const message = []
      if (utilCore.isArray(args) || utilCore.isObject(args)) {
        for (const key in args) {
          if (utilCore.isArray(args[key]) || utilCore.isObject(args[key])) {
            message.push(JSON.stringify(args[key]))
          } else {
            message.push(args[key])
          }
        }
      } else {
        message.push(args)
      }
      console[levels[levelIndex]](message.join(' -> '))
    }
  },
  /**
     * 日志输出
     */
  info: function() {
    appLog.echo('info', arguments)
  },
  log: function() {
    appLog.echo('log', arguments)
  },
  warn: function() {
    appLog.echo('warn', arguments)
  },
  error: function() {
    appLog.echo('error', arguments)
  }
}

export default appLog

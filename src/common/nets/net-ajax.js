/**
 * 进行异步请求
 */

import utilCore from "@/common/utils/util-core.js"
import appConfig from "@/common/configs/index.js"
import utilCryptoJS from "@/common/utils/util-crypto-js.js"
import appLog from "@/common/utils/app-log.js"
import router from '@/router'
import qs from 'qs'
import axios from 'axios'

const netAjax = {
  netConfig: {
    baseURL: appConfig.appApiUrl, // 请求的基本地址
    headers: {// 请求头部
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      'app-key': appConfig.newAppKey
    },
    method: 'GET', // 请求方式(GET,POST,PUT,HEAD,DELETE,OPTIONS,TRACE,CONNECT)
    params: null, // 通过URL提交的参数
    data: null, // 通过post提交的参数
    beforeFun: null, // 开始请求时执行函数
    comFun: null, // 请求成功时执行函数
    comFail: null, // 请求失败时执行函数
    endFun: null, // 请求完成时执行函数
    getTask: null, // 上传进度函数
    comFunDown: null, // 下载完成时默认执行的函数
    checkToken: null, // 是否验证登陆(会把登成功后需要的信息加入到请求的header中)
    responseType: 'json',//表示服务器响应的数据类型，可以是 "arraybuffer", "blob", "document", "json", "text", "stream"
    timeout: 30000
  },
  /**
     * 补齐ajax请求配置
     * @param {Object} config
     */
  setConfig (config) {
    // 如果传的配置为空，则返回false
    if (utilCore.empty(config)) {
      return false
    }
    for (var key in netAjax.netConfig) {
      // 如果没有设置对应的选项，则使用默认的
      if (utilCore.empty(config[key]) && !utilCore.empty(netAjax.netConfig[key])) {
        config[key] = utilCore.deepClone(netAjax.netConfig[key])
      }
    }
    return config
  },
  /**
* 判断url是否为绝对路径
* @param {Object} url
*/
  posUrl (url) {
    return /^(https?|wss?):\/\//i.test(url)
  },
  /**
   * 拼接ajax请求的URL及附在URL上的参数
   * @param {Object} url =>请求的URI
   * @param {Object} baseUrl =>请求的基本地址
   * @param {Object} params =>附在URL上的参数
   */
  mergeUrl (url, baseUrl, params) {
    let mergeUrl = url
    if (!netAjax.posUrl(url)) {
      if (url && baseUrl) {
        mergeUrl = baseUrl.replace(/(\/+$)/, '') + '/' + url.replace(/(^\/+)/, '')
      } else {
        mergeUrl = baseUrl || url
      }
    }
    if (!utilCore.empty(params) && Object.keys(params).length !== 0) {
      const paramsH = netAjax.addQueryString(params)
      mergeUrl += mergeUrl.includes('?') ? `&${paramsH}` : `?${paramsH}`
    }
    return mergeUrl
  },
  /**
   * 把数组对像转化为URL请求字符串
   * @param {Object} params
   */
  addQueryString (params) {
    if (typeof params !== 'object') {
      return ''
    }
    let paramsData = ''
    Object.keys(params).forEach(function (key) {
      paramsData += key + '=' + encodeURIComponent(params[key]) + '&'
    })
    return paramsData.substring(0, paramsData.length - 1)
  },
  /**
* @Function
* @param {Object} options - 请求配置项
* @prop {String} options.url - 请求路径
* @prop {Object} options.data - 请求参数
* @prop {Object} [options.responseType = config.responseType] [text|arraybuffer] - 响应的数据类型
* @prop {Object} [options.headers = config.headers] - 请求header
* @prop {Object} [options.method = config.method] - 请求方法
* @returns {Promise<unknown>}
*/
  async request (options = {}) {
    // 处理是否需要使用默认的参数
    options = netAjax.setConfig(options)
    // 默认的返回信息
    const returnMsg = {
      status: -1,
      errMsg: 'error'
    }

    // 如果没有请求网址则出错
    if (utilCore.empty(options.url)) {
      return returnMsg
    }

    // 执行AJAX查询
    return new Promise((resolve, reject) => {
      // 如果有请求前需要执行的动则，则执行
      if (!utilCore.empty(options.beforeFun)) {
        if (!options.beforeFun()) {
          reject(returnMsg)
        }
      }

      let config = {
        url: netAjax.mergeUrl(options.url, options.baseURL),
        data: options.data ? qs.stringify(options.data) : null,
        params: options.params ? options.params : null,
        // params: options.params ? qs.stringify(options.params) : null,
        headers: options.headers ? options.headers : null,
        method: options.method ? options.method : "GET",
        timeout: options.timeout ? options.timeout : 1000,
        responseType: options.responseType ? options.responseType : "json"
      }
      //console.log("================>",config)
      //进行ajax请求
      axios(config)
        .then((response) => {
          // 请求成功，则对数据进行解密
          if (response.status == 200) {
            appLog.log('ok response==>' + options.url)
            // appLog.log(response)
            if (!utilCore.empty(response.data.data)) {
              appLog.log("提交的数据", response.config)
              //去掉多余的信息
              response.config = {};
              // 04-07 response.data.data.length == 0 改为 utilCore.empty(response.data.data) 部分接口没有数据会返回null报错
            } else if (utilCore.empty(response.data.data)) {
              appLog.log("API没有数据返回！", response)
              if (response.data.code != 200) {
                //如果是登陆令牌出错
                if (response.data.code == 302) {
                  utilCore.showToast(response.data.msg || "服务器出错");
                  setTimeout(() => {
                    router.push({ path: '/user/index', query: { fromCommission: true, pageName: 'error' } });
                  }, 3000);
                } else {
                  utilCore.showToast(response.data.msg || "服务器出错");
                }
              }
            }
            else {
              appLog.log("API没有返回数据！", response)
              utilCore.showToast("服务器没有数据返回【" + options.url + "】");
            }
          } else {
            appLog.log('error response===>')
            appLog.log(response)
          }
          //如果有返回数据处理函数，则需要先运行处理结果函数
          if (!utilCore.empty(options.comFun)) {
            response = options.comFun(response)
          }
          // 如果有请求前需要执行的动则，则执行
          if (!utilCore.empty(options.endFun)) {
            options.endFun();
          }

          //返回处理结果
          resolve(response);

        })
        .catch((err) => { // 执行失败
          appLog.log("mmmmmmmmmmmmmmm", options)
          appLog.log(err)
          // 侧滑时，接口没请求完， 马上返回，导致JS报错
          // utilCore.showToast("服务器出错【" + options.url + "】");

          // 如果有请求前需要执行的动则，则执行
          if (!utilCore.empty(options.endFun)) {
            options.endFun();
          }

          //判断是否有错误处理函数
          if (!utilCore.empty(options.comFail)) {
            err = options.comFail(err)
          }

          //返回处理出错的结果
          reject(err);
        })

    })
  },
  /**
   * 用get进行AJAX请求
   */
  get (url, options = {}) {
    options.method = 'GET'
    return netAjax.request({
      url,
      ...options
    })
  },
  /**
   * 用post进行AJAX请求
   */
  post (url, data, options = {}) {
    options.method = 'POST'
    return netAjax.request({
      url,
      data,
      ...options
    })
  },
  /**
   * 用指定方式进行AJAX请求
   */
  ajax (url, data, options = {}) {
    return netAjax.request({
      url,
      data,
      ...options
    })
  }
}

export default netAjax
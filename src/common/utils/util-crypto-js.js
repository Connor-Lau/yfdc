/**
 * 基本于CryptoJS的工具条
 */
import CryptoJS from '@/common/libs/crypto-js.js'
import utilDate from '@/common/utils/util-date.js'
import utilCore from '@/common/utils/util-core.js'
import appConfig from '@/common/configs/index.js'

const utilCryptoJS = {
  /**
     * MD5
     * @param {String} data
     */
  md5: function (data) {
    return CryptoJS.MD5(data.toString()).toString()
  },
  /**
   * base64编码
   * @param {String} data
   */
  base64Encode: function (data) {
    data = CryptoJS.enc.Utf8.parse(data)
    data = CryptoJS.enc.Base64.stringify(data)
    return data
  },
  /**
   * base64解码
   * @param {String} data
   */
  base64Decode: function (data) {
    data = CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8)
    return data
  },
  /**
   * AES加密
   * @param {Object} data
   * @param {String} key
   * @param {Number} expiry
   */
  encrypt: function (data, key, expiry) {
    key = key || ''
    key = utilCryptoJS.md5(key)
    var password = key.slice(0, 16)
    var iv = key.slice(-16)
    password = CryptoJS.enc.Utf8.parse(password)
    iv = CryptoJS.enc.Utf8.parse(iv)
    expiry = expiry || 0
    data = {
      data: data,
      time: utilDate.time(),
      expiry: expiry
    }
    data = JSON.stringify(data)
    data = utilCryptoJS.base64Encode(data)
    data = CryptoJS.AES.encrypt(data, password, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
    data = data.toString()
    return data
  },
  /**
   * AES解密
   * @param {String} data
   * @param {String} key
   * @param {Number} expiry
   */
  decrypt: function (data, key, expiry) {
    key = key || ''
    key = utilCryptoJS.md5(key)
    var password = key.slice(0, 16)
    var iv = key.slice(-16)
    password = CryptoJS.enc.Utf8.parse(password)
    iv = CryptoJS.enc.Utf8.parse(iv)
    data = CryptoJS.AES.decrypt(data, password, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
    data = CryptoJS.enc.Utf8.stringify(data).toString()
    data = utilCryptoJS.base64Decode(data)
    data = JSON.parse(data)
    if (data && data.time) {
      expiry = expiry || (data.expiry ? parseInt(data.expiry) : 0)
      if (expiry && (parseInt(data.time) + parseInt(expiry) < utilDate.time())) {
        data.data = false
      }
      data = ('data' in data) ? data.data : data
    }
    return data
  },
  
  /**
   * AES解密
   * @param {String} data
   * @param {String} key
   * @param {Number} expiry
   */
   decryptCode: function(text) {
    const result = {}
    const key = CryptoJS.enc.Utf8.parse(CryptoJS.MD5('123456'))
    const iv = CryptoJS.enc.Utf8.parse('123abcdMOBILE678')
    let decodeMsg = CryptoJS.AES.decrypt(text, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    })
    decodeMsg = CryptoJS.enc.Utf8.stringify(decodeMsg).toString()
    result.decodeMsg = decodeMsg
    result.signMsg = CryptoJS.MD5(decodeMsg).toString().toUpperCase()
    return result
  },
  /**
   * 把数据按key的字典顺序排列
   * @param {Object} jsonData
   */
  keySort: function (jsonData) {
    try {
      const tempJsonObj = {}
      const sdic = Object.keys(jsonData).sort()
      sdic.map((item, index) => {
        tempJsonObj[item] = jsonData[sdic[index]]
      })
      return tempJsonObj
    } catch (e) {
      return jsonData
    }
  },
  /**
   * 获取登陆sign
   * @param {Object} data
   */
  getSign: function (data) {
    data = utilCryptoJS.keySort(data)
    let tmpStr = ''
    for (var i in data) {
      if (i == 'sign' || i == 'base64_file') {
        continue
      }
      if (utilCore.empty(data[i])) {
        if (data[i] != '0') {
          continue
        }
      }
      tmpStr += data[i]
    }
    //console.log("kkkkkkkkkkkkkkkkk=========>|" + tmpStr + appConfig.loginTokenKey);
    tmpStr = utilCryptoJS.md5(tmpStr + appConfig.loginTokenKey)
    return tmpStr.toUpperCase()
  },
  /**
   * 加密登陆提交的数据
   * @param {Object} data
   */
  getCrypto: function (data) {
    for (var key in data) {
      if (key == 'service' || key == 'app_key' || key == 'sign' || key == '' || key == 'base64_file') {
        continue
      }
      if (utilCore.empty(data[key])) {
        if (data[key] != '0' && data[key] !== 0) {
          //去掉值为的参数
          delete data[key]
          continue
        }
      }
      data[key] = utilCryptoJS.encryptPHP(data[key], appConfig.encryptKey, appConfig.encryptIV)
    }
    return data
  },
  /**
 * 解密提交的数据
 * @param {Object} data
 */
  toDecCrypto: function (data) {
    for (var key in data) {
      if (key == 'service' || key == 'app_key' || key == 'sign' || key == '' || key == 'base64_file') {
        continue
      }
      if (utilCore.empty(data[key])) {
        if (data[key] != '0' && data[key] !== 0) {
          //去掉值为的参数
          delete data[key]
          continue
        }
      }
      data[key] = utilCryptoJS.decryptPHP(data[key], appConfig.encryptKey, appConfig.encryptIV)
    }
    return data
  },
  /**
 * 接口数据加密函数
 * @param data string 需加密的json字符串
 * @param key string 加密key(16位)
 * @param iv string 加密向量(16位)
 * @return string 加密密文字符串
 */
  encryptPHP: function (data, key, iv) {

    key = utilCryptoJS.md5(key)
    iv = utilCryptoJS.md5(iv)
    iv = utilCryptoJS.md5(iv)

    //密钥16位
    key = CryptoJS.enc.Utf8.parse(key.slice(0, 16));
    //key = CryptoJS.enc.Utf8.parse(key);
    //加密向量16位
    iv = CryptoJS.enc.Utf8.parse(iv.slice(0, 16));

    data = utilCryptoJS.base64Encode(data.toString());//base64Decode
    data = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7//CryptoJS.pad.ZeroPadding
    });
    return data.toString();
  },

  /**
   * 接口数据解密函数
   * @param data string 已加密密文
   * @param key string 加密key(16位)
   * @param iv string 加密向量(16位)
   * @returns {*|string} 解密之后的json字符串
   */
  decryptPHP: function (data, key, iv) {

    key = utilCryptoJS.md5(key)
    iv = utilCryptoJS.md5(iv)
    iv = utilCryptoJS.md5(iv)

    //密钥16位
    key = CryptoJS.enc.Utf8.parse(key.slice(0, 16));
    //key = CryptoJS.enc.Utf8.parse(key);
    //加密向量16位
    iv = CryptoJS.enc.Utf8.parse(iv.slice(0, 16));
    data = CryptoJS.AES.decrypt(data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7//CryptoJS.pad.ZeroPadding
    });
    data = CryptoJS.enc.Utf8.stringify(data);
    data = utilCryptoJS.base64Decode(data);//base64Encode
    return data
  },
}

export default utilCryptoJS

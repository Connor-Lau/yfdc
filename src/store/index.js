import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

// 自动加载模块
const modules = {}
const req = require.context('./modules', false, /\.js$/)
const requireAll = (requireContext) => requireContext.keys().map(fileName => {
  const component = requireContext(fileName)
  const name = fileName.replace(/^.*\/(.*)\.\w+$/, '$1')
  modules[name] = component.default
})
requireAll(req)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',//如果是开发环境则启用严格模式
  modules,
  state: {},
  mutations: {},
  actions: {}
})
// 导出模块
export default store

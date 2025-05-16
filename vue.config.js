const resolve = dir => require('path').join(__dirname, dir)
/**
 * 是否生产环境
 */
const isProductionOK = process.env.NODE_ENV === 'production';


/**
 * 打包编译后的文件+ 复制文件到编译目录(注意对应的版本:5.0.0)
 * 首先需要引入filemanager-webpack-plugin插件
 * 安装
 * npm install filemanager-webpack-plugin@5.0.0 --save-dev
 */
let FileManagerPlugin = ""
if (isProductionOK) {
  FileManagerPlugin = require('filemanager-webpack-plugin')
}


module.exports = {
  css: {
    loaderOptions: {
      scss: {
        additionalData: `$appWebStaticUrl: '${process.env.VUE_APP_WEB_STATIC_URL}';\n`
      }
    }
  },
  publicPath: isProductionOK ? '/h5ht/' : '/',
  // publicPath: isProductionOK ? '/appv2/webtest/' : '/',

  assetsDir: '',
  productionSourceMap: isProductionOK ? false : true, //正式编译时设置为false


  chainWebpack: config => {
    if (isProductionOK) {
      // 移除 prefetch 插件
      config.plugins.delete('prefetch')
      // 移除 preload 插件
      //config.plugins.delete('preload')
      // 压缩代码
      config.optimization.minimize(true)
      // 分割代码
      config.optimization.splitChunks({
        chunks: 'all',
        // cacheGroups: {
        //   vendors: {
        //     test: /[\\/]node_modules[\\/]/,
        //     minChunks: 1,
        //     priority: -1
        //   },
        //   default: {
        //     minChunks: 2,
        //     priority: -3,
        //     reuseExistingChunk: true
        //   },
        // }
      })
      // 删除注释
      config.optimization.minimizer('terser').tap((args) => {
        // args[0].terserOptions.compress.drop_console = true
        // args[0].terserOptions.compress.drop_debugger = true
        // args[0].terserOptions.compress.pure_funcs = ['console.log']
        args[0].terserOptions.output = {
          comments: false
        };
        return args
      })
    }
  },

  configureWebpack: {
    resolve: {
      alias: {
        'core-js/es6/map': 'core-js/es/map',
      }
    },
    performance: {
      hints: 'warning',
      // 入口起点的最大体积
      maxEntrypointSize: 50000000,
      // 生成文件的最大体积
      maxAssetSize: 30000000,
      // 只给出 js 文件的性能提示
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith('.js')
      }
    },
    plugins: isProductionOK ? [
      new FileManagerPlugin({  //初始化 filemanager-webpack-plugin 插件实例
        events: {
          onEnd: {
            copy: [
              //把图片素材也放在编译后的目录里(如果本次的打包不需要更新图片的话，可以注释掉这句)
              { source: 'src/assets', destination: './dist/static' },
            ],
            archive: [ //然后我们选择dist文件夹将之打包成dist.zip并放在根目录
              { source: './dist', destination: './dist/dist.zip' },
            ]
          }
        }
      })
    ] : []
  }
}

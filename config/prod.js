/**
 * 打包环境
 */
module.exports = {
  env: {
    NODE_ENV: '"production"',
    remoteImgPreUrl: 'http://saas-2-min-pro.oss-cn-hangzhou.aliyuncs.com/',
    apiHost: 'https://f2.71dj.org/djcloudapi',
    pcPageHost: 'https://f2.71dj.org',
    apiBackImgPre: 'http://djimages.71dj.org',
    tokenKey: '71dj',
    openReduxLogger: false,
  },
  defineConstants: {
  },
  weapp: {
    module: {
      postcss: {
        autoprefixer: {
          enable: true
        },
        // 小程序端样式引用本地资源内联配置
        url: {
          enable: true,
          config: {
            limit: 10240 // 文件大小限制
          }
        }
      }
    }
  },
  h5: {
    /**
     * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
     * 参考代码如下：
     * webpackChain (chain) {
     *   chain.plugin('analyzer')
     *     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
     * }
     */
  }
}

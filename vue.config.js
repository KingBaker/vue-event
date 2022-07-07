const { defineConfig } = require('@vue/cli-service')

// 需要排除的包对象
let externals = {}

// 需要配置的CDN链接
let CDN = { css: [], js: [] }
// 判断是否是生产环境
const isProduction = process.env.NODE_ENV === 'production'
// 如何是生产环境，需要执行以下逻辑
if (isProduction) {
  externals = {
    /**
     * externals 对象属性解析：
     * '包名': '在项目中引入的名字'
     * 以 element-ui 举例 我再 main.js 里是以
     * import ELEMENT from 'element-ui'
     * Vue.use(ELEMENT)
     * 这样引入的，所以我的 externals 的属性值应该是 ELEMENT
     * 一定要去main.js设置
     */
    echarts: 'echarts',
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios',
    'vue-quill-editor': 'VueQuillEditor',
    'vuex-persistedstate': 'createPersistedState'
  }
  CDN = {
    css: [
      'https://unpkg.com/quill@1.3.7/dist/quill.core.css',
      'https://unpkg.com/quill@1.3.7/dist/quill.snow.css',
      'https://unpkg.com/quill@1.3.7/dist/quill.bubble.css'
    ],
    js: [
      'https://unpkg.com/echarts@5.3.3/dist/echarts.min.js',
      'https://unpkg.com/vue@2.6.14/dist/vue.js',
      'https://unpkg.com/vue-router@3.5.1/dist/vue-router.js',
      'https://unpkg.com/vuex@3.6.2/dist/vuex.js',
      'https://unpkg.com/axios@0.27.2/dist/axios.min.js',
      'https://unpkg.com/quill@1.3.7/dist/quill.js',
      'https://unpkg.com/vue-quill-editor@3.0.6/dist/vue-quill-editor.js',
      'https://unpkg.com/vuex-persistedstate@3.2.1/dist/vuex-persistedstate.umd.js'
    ]
  }
}
module.exports = defineConfig({
  transpileDependencies: true,
  // 开发环境设置为/,生产环境设置为./
  publicPath: process.env.NODE_ENV !== 'development' ? './' : '/',
  // dist瘦身,webpack不打包Vue等第三方包
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    // name: name,
    externals: externals
    // resolve: {
    //   alias: {
    //     '@': resolve('src')
    //   }
    // }
  },
  chainWebpack (config) {
    // 注入cdn变量(打包执行)
    config.plugin('html').tap(args => {
      args[0].cdn = CDN
      return args
    })
  }
})

// 1. publicPath: 影响webpack打包的前缀地址,导致打包后地址错误,无法打开
// 解决: 开发环境publicPath设置为/ 生产环境设置为./

// 2.dist瘦身
// 解决: 开发环境externals无值(不排除第三方包),不引入第三方包 生产环境有值,排除第三方包,引入CDN链接

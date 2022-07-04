import ajax from 'axios'
import store from '@/store'
import router from '@/router'

const axios = ajax.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net',
  timeout: 20000
})

// 添加请求拦截器
// 注册接口和登录接口不需要携带headers的 Authorization token,所以设置白名单
const whiteAPIList = ['/api/reg', '/api/login']
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 统一携带token, 除去白名单
  if (!whiteAPIList.includes(config.url)) {
    config.headers.Authorization = store.state.token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, async function (error) {
  // 对响应错误做点什么
  console.log(error)
  // 当token过期,状态码为401时,清除过期的token并跳转到登录页,重新登录获取新的token
  if (error.response.status === 401) {
    console.log(401)
    // 先清除token,防止过期的token被路由独享守卫阻止跳转登录页
    // 可以
    // store.state.token = ''
    // 或者
    store.commit('UPDATE_TOKEN', '')
    await router.push('/login')
  }
  return Promise.reject(error)
})

export default axios

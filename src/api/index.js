import axios from './request'
import store from '@/store'

// 注册接口
export const registerAPI = ({ username, password, repassword }) => {
  return axios({
    url: '/api/reg',
    method: 'POST',
    data: {
      username,
      password,
      repassword
    }
  })
}

// 登录接口
export const loginAPI = ({ username, password }) => {
  return axios({
    url: '/api/login',
    method: 'POST',
    data: {
      username,
      password
    }
  })
}

// 获取-用户基本资料接口
export const getUserinfoAPI = () => {
  return axios({
    url: '/my/userinfo',
    // axios默认的方法就是GET
    // method: 'GET',
    headers: {
      // this.$store.state.token 这里的this拿不到组件里面的对象,this指向axios
      Authorization: store.state.token
    }
  })
}

// 获取-侧边栏数据
export const asideAPI = () => {
  return axios({
    url: '/my/menus',
    headers: {
      Authorization: store.state.token
    }
  })
}

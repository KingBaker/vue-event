import Vue from 'vue'
import Vuex from 'vuex'
import { getUserinfoAPI } from '@/api'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)
// vuex的值默认保存在内存中, 刷新会把值进行重置为初始值,无法持久保存

export default new Vuex.Store({
  state: {
    // 1. 用来存储登录成功之后，得到的 token
    token: '',
    // 2. 用来保存注册成功的username
    username: '', // 注册与登录的用户名,提高用户体验
    userInfo: {} // 3. 用户资料的获取
  },
  getters: {
    // 简写规则: 形参只有一个,return只有一句话时可以简写去掉大括号,和形参小括号
    nickname (state) {
      return state.userInfo.nickname
    },
    // nickname: state => state.userInfo.nickname, // 昵称
    username: state => state.userInfo.username, // 用户名
    user_pic: state => state.userInfo.user_pic // 用户头像
  },
  mutations: {
    // 1. 更新 token 的 mutation 函数
    UPDATE_TOKEN (state, newToken) {
      state.token = newToken
    },
    // 2. 更新注册的username
    UPDATE_USERNAME (state, newName) {
      state.username = newName
    },
    // 3. 更新用户资料
    UPDATE_USERINFO (state, infoObj) {
      state.userInfo = infoObj
    }
  },
  actions: {
    // 调用获取用户资料接口
    async initUserInfo (store) {
      const res = await getUserinfoAPI()
      console.log(res)
      if (res.data.code === 0) {
        store.commit('UPDATE_USERINFO', res.data.data)
      }
    }
  },
  modules: {
  },
  // 配置为 vuex 的插件,可以保存到本地
  plugins: [
    createPersistedState()
  ]
})

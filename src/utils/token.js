// 用于保存用户的登录token
// 本项目使用vuex来保存, 废弃!
const key = 'get-token'

// 设置token
export const setToken = (token) => {
  localStorage.setItem(key, token)
}

// 获取token
export const getToken = () => localStorage.getItem(key)

// 移除token
export const removeToken = () => {
  localStorage.removeItem(key)
}

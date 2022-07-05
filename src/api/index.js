import axios from './request'
// import store from '@/store'

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
    url: '/my/userinfo'
    // axios默认的方法就是GET
    // method: 'GET',
    // axios统一携带了token,所以这里不需要了
    // headers: {
    //   // this.$store.state.token 这里的this拿不到组件里面的对象,this指向axios
    //   Authorization: store.state.token
    // }
  })
}

// 更新-用户基本资料
/**
 * 更新-用户基本资料
 * @param {*} param0 { id: 用户id, email: 用户邮箱, nickname: 用户昵称, user_pic: 用户头像地址, username: 用户名 }
 * @returns Promise对象
 */
export const renewUserInfoAPI = ({ id, email, nickname, userPic, username }) => {
  return axios({
    url: '/my/userinfo',
    method: 'PUT',
    data: {
      id,
      email,
      nickname,
      user_pic: userPic,
      username
    }
  })
}

// 更新-用户头像
export const userAvatarAPI = (avatar) => {
  return axios({
    url: '/my/update/avatar',
    method: 'PATCH',
    data: {
      avatar
    }
  })
}

// 更新-用户密码
export const userPasswordAPI = ({ oldPwd, newPwd, rePwd }) => {
  return axios({
    url: '/my/updatepwd',
    method: 'PATCH',
    data: {
      old_pwd: oldPwd,
      new_pwd: newPwd,
      re_pwd: rePwd
    }
  })
}

// 获取-侧边栏数据
export const asideAPI = () => {
  return axios({
    url: '/my/menus'
    // headers: {
    //   Authorization: store.state.token
    // }
  })
}

// 获取-文章分类
export const articleCateAPI = () => {
  return axios({
    url: '/my/cate/list'
  })
}

// 增加-文章分类
export const addArticleCateAPI = ({ cateName, cateAlias }) => {
  return axios({
    url: '/my/cate/add',
    method: 'POST',
    data: {
      cate_name: cateName,
      cate_alias: cateAlias
    }
  })
}

// 修改-文章分类
export const updateCateAPI = ({ id, cateName, cateAlias }) => {
  return axios({
    url: '/my/cate/info',
    method: 'PUT',
    data: {
      id,
      cate_name: cateName,
      cate_alias: cateAlias
    }
  })
}

// 删除-文章分类
export const deleteCateAPI = (id) => {
  return axios({
    url: '/my/cate/del',
    method: 'DELETE',
    params: {
      id
    }
  })
}

// 获取-文章列表
export const articleListAPI = () => {
  return axios({
    url: '/my/article/list'
    /*
      请求参数 位置 query
      pagenum 当前页码数 必填
      pagesize  当前页面需要的数据条数 必填
      cate_id 文章分类id(注意不是文章id)
      state 文章状态("已发布"和"草稿")2种值
     */
  })
}

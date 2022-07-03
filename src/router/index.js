import Vue from 'vue'
import store from '@/store'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/layout'
  },
  {
    path: '/reg',
    component: () => import(/* webpackChuckName: "register" */ '@/views/register')
  },
  {
    path: '/login',
    component: () => import(/* webpackChuckName: "login" */ '@/views/login')
  },
  {
    path: '/layout',
    component: () => import(/* webpackChuckName: "layout" */ '@/views/layout')
  }
]

const router = new VueRouter({
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const token = store.state.token
  // 判断当有token,且没有用户id的时候才进行用户资料的请求
  if (token.length !== 0 && !store.state.userInfo.id) {
    await store.dispatch('initUserInfo')
  }
  next() // 放行
})

export default router

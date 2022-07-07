import Vue from 'vue'
import store from '@/store'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "Layout" */ '@/views/layout'),
    alias: '/layout',
    redirect: '/home', // 默认显示首页的二级路由
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "Home" */ '@/views/home')
      },
      {
        path: 'user-info',
        component: () => import(/* webpackChunkName: "userInfo" */ '@/views/user/userInfo')
      },
      {
        path: 'user-avatar',
        component: () => import(/* webpackChunkName: "userAvatar" */ '@/views/user/userAvatar')
      },
      {
        path: 'user-pwd',
        component: () => import(/* webpackChunkName: "userPwd" */ '@/views/user/userPwd')
      },
      {
        path: 'art-cate',
        component: () => import(/* webpackChunkName: "artCate" */ '@/views/article/artCate')
      },
      {
        path: 'art-list',
        component: () => import(/* webpackChunkName: "artList" */ '@/views/article/artList')
      }
    ]
  },
  {
    path: '/reg',
    component: () => import(/* webpackChunkName: "Register" */ '@/views/register'),
    // 路由独享守卫注册页
    beforeEnter: (to, from, next) => {
      // 如果已经有了token,不能手动切换到注册页
      if (store.state.token) {
        next('/')
      } else {
        next()
      }
    }
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/login'),
    // 路由独享守卫登录页
    beforeEnter: (to, from, next) => {
      // 如果已经有了token,不能手动切换到登录页
      if (store.state.token) {
        next('/')
      } else {
        next()
      }
    }
  }
]

const router = new VueRouter({
  routes
})

// 路由守卫
// 卧槽,递归了,妈的
router.beforeEach(async (to, from, next) => {
  const token = store.state.token
  // 跳转白名单
  const whiteRouterList = ['/reg', '/login']
  // 有token时除了登录和注册页,其他都能去,给登录和注册设置独享守卫
  if (token) {
    // 判断当有token,且没有用户id的时候才进行用户资料的请求
    if (!store.state.userInfo.username) {
      await store.dispatch('initUserInfo')
    }
    next() // 放行
  } else {
    // 无token时只能去登录页和注册页,但不能在其他地方已经跳转了!
    // 发现点退出后递归了? 可能是退出清除token,跳转登录页,然后没有token,又继续跳,所以导致的递归
    // 解决方案: 判断一下没有token跳转不能是登录和注册才能在这里跳转登录页
    if (whiteRouterList.includes(to.path)) {
      next() // 跳转的是登录页或是注册页就让他去就行啦!
    } else {
      next('/login')
    }
  }
})

export default router

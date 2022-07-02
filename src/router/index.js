import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/register'
  },
  {
    path: '/register',
    component: () => import(/* webpackChuckName: "register" */ '@/views/register')
  },
  {
    path: '/login',
    component: () => import(/* webpackChuckName: "login" */ '@/views/login')
  }
]

const router = new VueRouter({
  routes
})

export default router

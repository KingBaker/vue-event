<template>
  <el-container class="main-container">
    <!-- 头部区域 -->
    <el-header>
      <!-- 左侧的 logo -->
      <img src="../../assets/images/logo.png" alt="左侧的logo">
      <!-- 右侧的菜单 -->
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        background-color="#23262E"
        text-color="#fff"
        active-text-color="#409EFF">
        <el-submenu index="1">
          <template slot="title">
            <img :src="user_pic" alt="用户自定义头像" v-if="user_pic" class="avatar">
            <img src="../../assets/images/myavatar.jpg" alt="默认头像" class="avatar" v-else>
            <span>个人中心</span>
          </template>
          <el-menu-item index="1-1" @click="$router.push('user-info')"><i class="el-icon-s-operation"></i>基本资料</el-menu-item>
          <el-menu-item index="1-2" @click="$router.push('user-avatar')"><i class="el-icon-camera"></i>更换头像</el-menu-item>
          <el-menu-item index="1-3" @click="$router.push('user-pwd')"><i class="el-icon-key"></i>重置密码</el-menu-item>
        </el-submenu>
        <el-menu-item index="2" @click="quitFn"><i class="el-icon-switch-button"></i><span class="quit">退出</span></el-menu-item>
      </el-menu>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside width="200px">
        <div class="aside-box">
          <img :src="user_pic" alt="用户自定义头像" v-if="user_pic">
          <img src="../../assets/images/myavatar.jpg" alt="默认头像" v-else>
          <span>欢迎 {{ nickname || username }}</span>
        </div>
        <!-- 左侧导航菜单 -->
        <!-- unique-opened 无效-->
        <!-- 解决方案是套一个<template></template>-->
        <el-menu
          :default-active=$route.path
          class="el-menu-vertical-demo"
          background-color="#23262E"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          router>
          <!-- aside 第一没有孩子-->
          <template v-for="item in asideData">
            <el-menu-item
              :key="item.indexPath"
              :index="item.indexPath"
              v-if="!item.children">
              <i :class="item.icon"></i>{{ item.title }}
            </el-menu-item>
            <el-submenu
              v-else
              :index="item.indexPath"
              :key="item.indexPath">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.title }}</span>
              </template>
              <el-menu-item
                v-for="subItem in item.children"
                :key="subItem.indexPath"
                :index="subItem.indexPath">
                <i :class="subItem.icon"></i>{{ subItem.title }}
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 页面主体区域 -->
        <!-- <el-main>出现双滚动条 style="overflow-y: hidden" -->
        <el-main>
          <!-- 二级路由挂载点 -->
          <router-view></router-view>
        </el-main>
        <!-- 底部 footer 区域 -->
        <el-footer>© www.itheima.com - 黑马程序员</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { asideAPI } from '@/api'

export default {
  name: 'layoutIndex',
  data () {
    return {
      asideData: [] // 侧边栏数据
    }
  },
  async created () {
    const res = await asideAPI()
    // console.log(res)
    // 侧边栏数据获取成功
    if (res.data.code === 0) {
      this.asideData = res.data.data
    }
  },
  computed: {
    // 映射getters的方式定义计算属性 要放在计算中
    ...mapGetters(['user_pic', 'username', 'nickname'])
  },
  methods: {
    // 退出点击事件
    quitFn () {
      // 清除token和userInfo,跳转登录页面
      this.$confirm('您确认要退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('UPDATE_TOKEN', '')
          this.$store.commit('UPDATE_USERINFO', {})
          this.$router.push('/login')
        })
        .catch((err) => err)
    }
  }
}
</script>

<style scoped lang="less">
.el-container {
  height: 100%;
  .el-header,
  .el-aside {
    background-color: #23262e;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    padding: 0;
  }
  .el-main {
    //height: 0;
    //flex-grow: 1;
    overflow-y: scroll;
    height: 0;
    background-color: #F2F2F2;
  }
  .el-footer {
    background-color: #eee;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .aside-box {
    height: 70px;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    display: flex;
    justify-content: center;
    align-items: center;
    // 是否可以选择该文本 none不能选择,text用户指针选择,all全部选择
    user-select: none;
    img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      background-color: #fff;
      margin-right: 15px;
      object-fit: cover;
    }
    span {
      color: white;
      font-size: 12px;
    }
  }
}
.avatar {
  width: 35px;
  height: 35px;
  background-color: #fff;
  margin-right: 10px;
  border-radius: 50%;
  object-fit: cover;
}
.el-aside {
  .el-submenu,
  .el-menu-item {
    width: 200px;
    user-select: none;
  }
}
//.quit {
//  //font-size: 16px;
//  //line-height: 18px;
//}
</style>

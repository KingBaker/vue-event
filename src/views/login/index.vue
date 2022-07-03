<template>
  <!-- 登录页面的整体盒子 -->
  <div class="login-container">
    <!-- 登录的盒子 -->
    <div class="login-box">
      <!-- 标题的盒子 -->
      <div class="title-box">
      <!-- 登录的表单区域 -->
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" placeholder="请输入密码" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">登录</el-button>
            <el-link type="info" @click="goToRegFn">去注册</el-link>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { loginAPI } from '@/api'
import { mapMutations } from 'vuex'

export default {
  name: 'loginIndex',
  data () {
    return {
      form: {
        username: this.$store.state.username || '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,10}$/, message: '用户名必须是1-10位的大小写字母数字', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码必须是6-15位非空格字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['UPDATE_TOKEN', 'UPDATE_USERNAME']),
    // 登录事件
    onSubmit () {
      // 先进行校验
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const res = await loginAPI(this.form)
          console.log(res)
          // code为0表示登录成功,1表示登录失败
          if (res.data.code === 0) {
            this.$message.success(res.data.message)
            this.UPDATE_TOKEN(res.data.token)
            this.UPDATE_USERNAME(this.form.username)
            await this.$router.push('/layout')
            // 或者
            // this.$store.commit('UPDATE_TOKEN', res.data.token)
          } else {
            this.$message.error(res.data.message)
          }
        } else {
          return false
        }
      })
    },
    // 跳转注册事件
    goToRegFn () {
      this.$router.push('/reg')
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  background: url('../../assets/images/login_bg.jpg') center;
  background-size: cover;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-box {
    width: 400px;
    height: 270px;
    background-color: #fff;
    border-radius: 15px;
    //position: absolute;
    //left: 50%;
    //top: 50%;
    //transform: translate(-50%, -50%);
    padding: 0 30px;
    box-sizing: border-box;
    .title-box {
      height: 60px;
      background: url('../../assets/images/login_title.png') center no-repeat;
      .el-form {
        padding-top: 60px;
        text-align: center;
        .el-button {
          width: 100%;
        }
      }
    }
  }
}
</style>

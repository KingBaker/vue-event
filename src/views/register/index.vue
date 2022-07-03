<template>
  <!-- 注册页面的整体盒子 -->
  <div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!-- 标题的盒子 -->
      <div class="title-box">
        <!-- 注册的表单区域 -->
        <el-form ref="form" :model="form" :rules="rules">
          <!-- prop必须与v-model绑定的值一致-->
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" placeholder="请输入密码" type="password"></el-input>
          </el-form-item>
          <el-form-item prop="repassword">
            <el-input v-model="form.repassword" placeholder="请再次确认密码" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">注册</el-button>
            <el-link type="info" @click="goToLoginFn">去登录</el-link>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { registerAPI } from '@/api'
import { mapMutations } from 'vuex'

export default {
  name: 'registerIndex',
  data () {
    // 自定义校验规则
    const samePaw = (rule, value, callback) => {
      if (value !== this.form.password) {
        return callback(new Error('两次输入的密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      // 与后端参数名保持一直好传参
      form: {
        username: '', // 用户名
        password: '', // 密码
        repassword: '' // 再次确认密码
      },
      // 校验规则设置
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }, // 失焦空白校验
          { // 失焦输入内容校验
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: '用户名必须是1-10位的大小写字母数字',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '密码必须是6-15位非空格字符', trigger: 'blur' }
        ],
        repassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: samePaw, trigger: 'blur' } // validator为自定义验证器
        ]
      }
    }
  },
  methods: {
    ...mapMutations(['UPDATE_USERNAME']),
    // 注册的点击事件
    onSubmit () {
      // JS兜底校验 validate
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          console.log(this.form)
          const res = await registerAPI(this.form)
          console.log(res)
          // code为0表示注册成功 "message":"注册成功！" code为1表示注册失败, "message":"用户名被占用，请更换其他用户名！"
          if (res.data.code === 0) {
            console.log(res.data.message)
            this.UPDATE_USERNAME(this.form.username)
            this.$message.success(res.data.message)
            await this.$router.push('/login')
          } else {
            console.log(res.data.message)
            this.$message.error(res.data.message)
          }
        } else {
          return false
        }
      })
    },
    // 跳转登录页
    goToLoginFn () {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped lang="less">
.reg-container {
  background: url('../../assets/images/login_bg.jpg') center;
  background-size: cover;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .reg-box {
    width: 400px;
    height: 335px;
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

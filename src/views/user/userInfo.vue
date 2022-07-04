<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>基本资料</span>
    </div>
    <!-- 表单 -->
    <el-form
      :model="userForm"
      :rules="userFormRules"
      ref="userFormRef"
      label-width="100px"
    >
      <el-form-item label="登录名称" prop="username">
        <el-input v-model="userForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="userForm.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="userForm.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitFn"
          :disabled="userForm.email === '' || userForm.nickname === ''">提交修改
        </el-button>
        <el-button @click="resetFn">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { renewUserInfoAPI } from '@/api'

export default {
  name: 'UserInfo',
  data () {
    return {
      userForm: {
        username: this.$store.getters.username, // 默认值用登录后获取到的用户名
        nickname: '',
        email: ''
      },
      // 表单的验证规则对象
      userFormRules: {
        nickname: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '昵称必须是1-10位的非空字符串', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitFn () {
      // 防止不通过验证用户就点击提交按钮
      this.$refs.userFormRef.validate(async valid => {
        if (valid) {
          console.log('yong')
          this.userForm.id = this.$store.state.userInfo.id
          const res = await renewUserInfoAPI(this.userForm)
          console.log(res)
          // code为0表示修改成功
          if (res.data.code === 0) {
            this.$message.success(res.data.message)
            // this.$store.commit('UPDATE_USERINFO', this.userForm)
            await this.$store.dispatch('initUserInfo')
          } else {
            this.$message.error(res.data.message)
          }
        } else {
          // 验证失败
          return false
        }
      })
    },
    resetFn () {
      // this.userForm.email = ''
      // this.userForm.nickname = ''
      this.$refs.userFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.el-form {
  width: 500px;
}
</style>

<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>重置密码</span>
    </div>
    <!-- 表单 -->
    <el-form
      :model="userForm"
      :rules="userFormRules"
      ref="userFormRef"
      label-width="100px"
    >
      <el-form-item label="原密码" prop="oldPwd">
        <el-input type="password" v-model="userForm.oldPwd"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd">
        <el-input type="password" v-model="userForm.newPwd"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="rePwd">
        <el-input type="password" v-model="userForm.rePwd"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitFn"
          :disabled="userForm.oldPassword === '' || userForm.newPassword === '' || userForm.confirmPassword === ''">提交修改
        </el-button>
        <el-button @click="resetFn">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { userPasswordAPI } from '@/api'

export default {
  name: 'userPwd',
  data () {
    const newOldPwd = (rule, value, callback) => {
      if (value === this.userForm.oldPwd) {
        return callback(new Error('新旧密码不能一致!'))
      } else {
        callback()
      }
    }
    const samePwd = (rule, value, callback) => {
      if (value !== this.userForm.newPwd) {
        return callback(new Error('两次输入的密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      userForm: {
        oldPwd: '',
        newPwd: '',
        rePwd: ''
      },
      userFormRules: {
        oldPwd: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
          { message: '密码必须是6-15位非空格字符', pattern: /^[a-zA-Z0-9]{6,15}$/, trigger: 'blur' }
        ],
        newPwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { message: '密码必须是6-15位非空格字符', pattern: /^[a-zA-Z0-9]{6,15}$/, trigger: 'blur' },
          { validator: newOldPwd, trigger: 'blur' }
        ],
        rePwd: [
          { required: true, message: '请再次确认新密码', trigger: 'blur' },
          { validator: samePwd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitFn () {
      this.$refs.userFormRef.validate(async vaild => {
        if (vaild) {
          const res = await userPasswordAPI(this.userForm)
          console.log(res)
          if (res.data.code === 0) {
            this.$message.success(res.data.message)
            this.$refs.userFormRef.resetFields()
          } else {
            this.$message.error(res.data.message)
          }
        } else {
          return false
        }
      })
    },
    resetFn () {
      this.$refs.userFormRef.resetFields()
    }
  }
}
</script>

<style scoped lang="less">
.el-form {
  width: 500px;
}
</style>

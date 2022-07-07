<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更改头像</span>
    </div>
    <!-- 图片，用来展示用户选择的头像 -->
    <img class="the_img" alt="avatar" src="../../assets/images/avatar.jpg" v-if="!avatar">
    <img class="the_img" alt="avatar" :src="this.avatar" v-else>

    <!-- 按钮区域 -->
    <div class="btn-box">
      <input type="file" accept="image/*" style="display: none" ref="iptRef" @change="onFileChange" />
      <el-button type="primary" icon="el-icon-plus" @click="chooseImg">选择图片</el-button>
      <el-button type="success" icon="el-icon-upload" :disabled="!avatar" @click="updateAvatarFn">上传头像</el-button>
    </div>
  </el-card>
</template>

<script>
import { userAvatarAPI } from '@/api'

export default {
  name: 'userAvatar',
  data () {
    return {
      avatar: '' // 保存图片地址或者是base64字符串
    }
  },
  methods: {
    chooseImg () {
      this.$refs.iptRef.click()
    },
    onFileChange (e) {
      const file = e.target.files
      // 没有选择图片,点了取消,直接返回
      if (file.length === 0) return
      // console.log(file[0])
      // 将图片文件转为base64字符串或者是图片地址,(一个内存的临时地址,不能发给后台)
      // URL.createObjectURl
      // 1. 创建 FileReader 对象
      const reader = new FileReader()
      reader.readAsDataURL(file[0])
      reader.onload = e => {
        this.avatar = e.target.result
      }
      // 这种方式不能给后台传递
      // this.avatar = URL.createObjectURL(file[0])
      // console.log(this.avatar)
    },
    // 上传头像
    async updateAvatarFn () {
      const res = await userAvatarAPI(this.avatar)
      console.log(res)
      console.log(res.data.message)
      if (res.data.code === 0) {
        await this.$store.dispatch('initUserInfo')
        this.$message.success(res.data.message)
      } else {
        this.$message.error(res.data.message)
      }
    }
  }
}
</script>

<style scoped>
.btn-box {
  margin-top: 10px;
}
.the_img {
  width: 350px;
  height: 350px;
}
</style>

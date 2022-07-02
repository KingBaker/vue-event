<template>
  <div>
    <div>App 根组件</div>
    <el-button>123</el-button>
  </div>
</template>

<script>
import { getListAPI } from '@/api'

export default {
  name: 'App',
  created () {
    const res = getListAPI()
    console.log(res)
  }
}
</script>
<style lang="less">
</style>

<template>
  <router-view></router-view>
</template>

<script>
// 项目的后端有bug,删除的文章分类不能再次使用,且删除的文章分类中的文章不会自己删除,需要手动一个个的删除
export default {
  name: 'App'
}
</script>
<style lang="less">
</style>

<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini">添加分类</el-button>
      </div>
      <el-table style="width: 100%" border stripe :data="artCateList">
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column prop="cate_name" label="分类名称"></el-table-column>
        <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" size="mini">修改</el-button>
          <el-button type="danger" size="mini">删除</el-button>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { articleCateAPI } from '@/api'

export default {
  name: 'artCate',
  data () {
    return {
      artCateList: []
    }
  },
  async created () {
    const res = await articleCateAPI()
    console.log(res)
    this.artCateList = res.data.data
  }
}
</script>

<style scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

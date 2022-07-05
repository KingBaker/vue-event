<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addArtCateFn">添加分类</el-button>
      </div>
      <el-table style="width: 100%" border stripe :data="artCateList">
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column prop="cate_name" label="分类名称"></el-table-column>
        <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
        <el-table-column label="操作">
          <!-- 使用作用域插槽来获取id -->
          <template v-slot="scope">
            <el-button type="primary" size="mini" @click="reviseFn(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="deleteFn(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--  添加分类弹窗  -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible" @close="onAddClosedFn">
      <el-form :model="addForm" :rules="formRules" label-width="80px" ref="addRef">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="分类别称" prop="alias">
          <el-input v-model="addForm.alias"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addFn">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { articleCateAPI, addArticleCateAPI, updateCateAPI, deleteCateAPI } from '@/api'

export default {
  name: 'artCate',
  data () {
    return {
      artCateList: [], // 接收文章分类数组
      title: '', // 弹窗标题
      editId: '', // 编辑状态的文章id
      isEdit: false, // 保存编辑状态(false新增, true编辑)
      dialogFormVisible: false, // 弹窗是否显示控制
      addForm: {
        name: '',
        alias: ''
      },
      formRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '分类名称必须是1-10个非空格字符', trigger: 'blur' }
        ],
        alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z]{1,15}$/, message: '分类别名必须是1-15个大小写字母和数字组成的字符串', trigger: 'blur' }
        ]
      }
    }
  },
  async created () {
    await this.initArticleCateFn()
  },
  methods: {
    // 封装请求文章分类的函数
    async initArticleCateFn () {
      const res = await articleCateAPI()
      console.log(res)
      this.artCateList = res.data.data
    },
    // 添加按钮点击事件
    addArtCateFn () {
      this.title = '添加文章分类'
      this.editId = ''
      // 解决方案 1
      // this.addForm.name = ''
      // this.addForm.alias = ''
      this.isEdit = false
      this.dialogFormVisible = true
    },
    // 封装判断是否成功方法
    judgeFn (res) {
      if (res.data.code === 0) {
        this.$message.success(res.data.message)
        this.dialogFormVisible = false
        this.initArticleCateFn()
      } else {
        this.$message.error(res.data.message)
      }
    },
    // 确认添加点击事件
    addFn () {
      this.$refs.addRef.validate(async valid => {
        if (valid) {
          // 修改文章分类
          if (this.isEdit) {
            const res = await updateCateAPI({
              id: this.editId,
              cateName: this.addForm.name,
              cateAlias: this.addForm.alias
            })
            console.log(res)
            this.judgeFn(res)
          } else {
            // 添加文章分类
            const res = await addArticleCateAPI({
              cateName: this.addForm.name,
              cateAlias: this.addForm.alias
            })
            console.log(res)
            this.judgeFn(res)
          }
        } else {
          return false
        }
      })
    },
    // 弹窗关闭时,清空输入框
    onAddClosedFn () {
      // bug
      // $refs 只会在组件渲染完成之后生效，并且它们不是响应式的。
      /*
      因为 $refs不是响应式的, 第一次点击的是添加按钮,弹窗进行首次渲染, 则弹窗输入表单没有问题
      但是第一次点击的是修改按钮时就会出现问题,this.$refs.addRef.resetFields()只会重置为第一次渲染弹窗时的样式
       */
      // 解决方案 1.直接在点击各自按钮时进行赋值
      // 解决方案 2.点击修改按钮渲染弹窗时先让表单绑定空值,在去赋值
      this.$refs.addRef.resetFields()
    },
    // 修改分类点击事件
    reviseFn (obj) {
      this.isEdit = true
      this.title = '修改文章分类'
      this.dialogFormVisible = true
      this.editId = obj.id
      // 数据回显
      // 解决方案 1
      // this.addForm.name = obj.cate_name
      // this.addForm.alias = obj.cate_alias
      // 解决方案 2.1
      // setTimeout(() => {
      //   this.addForm.name = obj.cate_name
      //   this.addForm.alias = obj.cate_alias
      // }, 0)
      // 解决方案 2.2
      this.$nextTick(() => {
        // 先让对话框出现, 它绑定空值的对象, 才能resetFields清空用初始空值
        this.addForm.name = obj.cate_name
        this.addForm.alias = obj.cate_alias
        console.log(this.addForm.name)
      })
      console.log(this.addForm.name + 'kong')
    },
    // 删除分类
    async deleteFn (id) {
      const res = await deleteCateAPI(id)
      console.log(res)
      if (res.data.code === 0) {
        this.$message.success(res.data.message)
        await this.initArticleCateFn()
      } else {
        this.$message.error(res.data.message)
      }
    }
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

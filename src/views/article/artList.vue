<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form inline :model="q">
          <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
              <el-option v-for="obj in cateList" :key="obj.id" :label="obj.cate_name" :value="obj.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px;">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="chooseFn">筛选</el-button>
            <el-button type="info" size="small" @click="resetChooseFn">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button type="primary" size="small" class="btn-pub" @click="publishFn">发表文章</el-button>
      </div>

      <!-- 文章表格区域 -->

      <!-- 分页区域 -->
    </el-card>
    <!-- 发表文章的 Dialog 对话框 -->
    <el-dialog title="发表文章" :visible.sync="pubDialogVisible" fullscreen :before-close="handleClose">
      <!-- 发布文章的对话框 -->
      <el-form :model="pubForm" :rules="pubFormRules" ref="pubFormRef" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%;">
            <el-option v-for="obj in cateList" :key="obj.id" :label="obj.cate_name" :value="obj.id"></el-option>
          </el-select>
        </el-form-item>
        <!--   富文本编辑器     -->
        <el-form-item label="文章内容" prop="content">
          <quill-editor v-model="pubForm.content"></quill-editor>
        </el-form-item>
        <!--   文章封面选择    -->
        <el-form-item label="文章封面">
          <img src="../../assets/images/cover.jpg" alt="cover" class="cover-img" v-if="!pubForm.coverData">
          <img :src="pubForm.coverData" alt="cover" class="cover-img" v-else>
          <br/>
          <input type="file" style="display: none" accept="image/*" @change="changeCoverFn" ref="coverRef" />
          <el-button type="text" size="small" @click="chooseCoverFn">+ 选择封面</el-button>
        </el-form-item>
        <el-form-item>
        <el-button type="primary" size="small">发布</el-button>
        <el-button type="info" size="medium">存为草稿</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { articleCateAPI } from '@/api'

export default {
  name: 'artList',
  data () {
    return {
      cateList: [], // 文章分类
      q: {
        cate_id: '',
        state: ''
      },
      pubDialogVisible: false, // 控制dialog对话框
      pubForm: {
        title: '', // 文章名称
        cate_id: '',
        content: '', // 文章内容
        coverData: '' // 保存封面图片数据地址或者是base64字符串
      },
      pubFormRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        cate_id: [{ required: true, message: '请选择文章标题', trigger: 'blur' }],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 调用获取文章分类
    this.getArtCateFn()
  },
  methods: {
    // 获取文章分类
    async getArtCateFn () {
      const res = await articleCateAPI()
      console.log(res)
      this.cateList = res.data.data
    },
    // 筛选点击事件
    chooseFn () {},
    // 重置筛选点击事件
    resetChooseFn () {
      this.q.cate_id = ''
      this.q.state = ''
    },
    // 发布按钮点击事件
    publishFn () {
      this.pubDialogVisible = true
    },
    // Dialog 对话框关闭前的回调
    async handleClose (done) { // done 用于关闭 Dialog
      // this.pubDialogVisible = false
      this.$confirm('此操作将导致文章信息丢失, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          done()
        })
        .catch(err => err)

      // 标准答案长这样
      // 询问用户是否确认关闭对话框
      // const confirmResult = await this.$confirm('此操作将导致文章信息丢失, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).catch(err => err) // 捕获点击取消时的拒绝状态结果 'cancel' 字符串
      //
      // // 取消了关闭-阻止住, 什么都不干
      // if (confirmResult === 'cancel') return
      // // 确认关闭
      // done()

      // await只能拿到成功的结果并放行,如果抛出了错误,await会阻止代码的进行执行
      // await后的拒绝状态如何进行捕获?
      // 1. try {} catch (err) {}
      // 2. Promise 的链式调用,用catch来return接收拒绝状态的Promise对象的值,来当做成功的结果返回,await就可以接收了
    },
    // input映射事件
    changeCoverFn (e) {
      const files = e.target.files
      // 说明点了取消,没有选择图片
      if (files.length === 0) return
      // 点了图片
      // 创建 FileReader 对象
      const reader = new FileReader()
      reader.readAsDataURL(files[0])
      reader.onload = e => {
        this.pubForm.coverData = e.target.result
      }
    },
    // 选择封面点击事件
    chooseCoverFn () {
      this.$refs.coverRef.click()
    }
  }
}
</script>

<style scoped lang="less">
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}

::v-deep .ql-editor {
  min-height: 300px;
}

// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
</style>

<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form inline :model="q" ref="searchRef">
          <el-form-item label="文章分类" prop="cate_id">
            <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
              <el-option v-for="obj in cateList" :key="obj.id" :label="obj.cate_name" :value="obj.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px;" prop="state">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="chooseFn">筛选</el-button>
            <el-button type="info" size="small" @click="resetChooseFn('searchRef')">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button type="primary" size="small" class="btn-pub" @click="publishArtFn">发表文章</el-button>
      </div>

      <!-- 文章表格区域 -->
      <el-table :data="articleList" style="width: 100%;" border stripe>
        <!-- 无法绑定点击事件,通过插槽来实现点击-->
        <el-table-column label="文章标题" prop="title">
          <template v-slot="scope">
            <el-link type="primary" @click="articleDetailFn(scope.row.id)">{{ scope.row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="cate_name"></el-table-column>
        <el-table-column label="发表时间" prop="pub_date"></el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <!-- 使用作用域插槽来获取id -->
          <template v-slot="scope">
            <el-button type="primary" size="mini" @click="reviseFn(scope.row.id)">修改</el-button>
            <el-button type="danger" size="mini" @click="deleteFn(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChangeFn"
        @current-change="handleCurrentChangeFn"
        :current-page.sync="q.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size.sync="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 发表文章的 Dialog 对话框 -->
      <el-dialog
        title="发表文章"
        :visible.sync="pubDialogVisible"
        fullscreen
        :before-close="handleClose"
        @closed="onDialogClosedFn">
        <!-- 发布文章的对话框 -->
        <el-form :model="pubForm" :rules="pubFormRules" ref="pubFormRef" label-width="100px">
          <el-form-item label="文章标题" prop="title">
            <el-input v-model.trim="pubForm.title" placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="文章分类" prop="cate_id">
            <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%;">
              <el-option v-for="obj in cateList" :key="obj.id" :label="obj.cate_name" :value="obj.id"></el-option>
            </el-select>
          </el-form-item>
          <!--   富文本编辑器     -->
          <el-form-item label="文章内容" prop="content">
            <quill-editor v-model="pubForm.content" @blur="contentChangeFn"></quill-editor>
          </el-form-item>
          <!--   文章封面选择    -->
          <el-form-item label="文章封面" prop="cover_img">
            <img :src="defaultImg" alt="cover" class="cover-img" ref="imageRef">
            <br/>
            <input type="file" style="display: none" accept="image/*" @change="changeCoverFn" ref="coverRef" />
            <el-button type="text" size="small" @click="chooseCoverFn">+ 选择封面</el-button>
          </el-form-item>
          <!--   按钮    -->
          <div class="btn-dialog">
            <el-form-item>
              <el-button type="primary" size="small" @click="pubArticleFn('已发布')">发布</el-button>
              <el-button type="info" size="medium" @click="pubArticleFn('草稿')">存为草稿</el-button>
            </el-form-item>
            <el-button type="danger" size="small" class="btn-pub" @click="resetPublishFn">重置</el-button>
          </div>
        </el-form>
      </el-dialog>

      <!-- 查看文章详情的对话框 -->
      <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
        <h1 class="title">{{ artDetail.title }}</h1>

        <div class="info">
          <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
          <span>发布时间：{{ artDetail.pub_date }}</span>
          <span>所属分类：{{ artDetail.cate_name }}</span>
          <span>状态：{{ artDetail.state }}</span>
        </div>

        <!-- 分割线 -->
        <el-divider></el-divider>

        <!-- 文章的封面 -->
        <img :src="baseURL + artDetail.cover_img" alt="" />

        <!-- 文章的详情 -->
        <div v-html="artDetail.content" class="detail-box"></div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { baseURL } from '@/api/request'
import defaultImg from '@/assets/images/cover.jpg'
import { articleCateAPI, articleListAPI, deleteArticleAPI, publicArticleAPI, articleDetailAPI } from '@/api'

export default {
  name: 'artList',
  data () {
    return {
      cateList: [], // 文章分类
      articleList: [], // 文章列表
      artDetail: [], // 文章详情
      total: 0, // 文章总数
      defaultImg: defaultImg, // 默认封面
      baseURL: baseURL, // 基地址
      q: {
        cate_id: '', // 文章分类id
        state: '', // 文章发布状态
        pagenum: 1, // 当前页码
        pagesize: 2 // 当前页面需要的数据条数
      },
      pubDialogVisible: false, // 控制发表文章dialog对话框
      detailVisible: false, // 控制查看文章详情dialog对话框
      pubForm: {
        title: '', // 文章名称
        cate_id: '', // 文章分类id
        content: '', // 文章内容
        cover_img: null, // 保存封面图片文件
        state: '' // 发布状态
      },
      pubFormRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        cate_id: [{ required: true, message: '请选择文章分类', trigger: 'change' }],
        // content绑定在quill-editor的非原生的标签上,无法走校验
        content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
        cover_img: [{ required: true, message: '请选择文章封面', trigger: 'change' }]
      }
    }
  },
  computed: {
  },
  created () {
    // 调用获取文章分类
    this.getArtCateFn()
    // 调用获取文章列表
    this.getArtListFn()
  },
  methods: {
    // 获取文章分类
    async getArtCateFn () {
      const res = await articleCateAPI()
      console.log(res)
      this.cateList = res.data.data
    },
    // 获取文章列表
    async getArtListFn () {
      const res = await articleListAPI(this.q)
      console.log(res)
      this.articleList = res.data.data
      // Date.prototype.getTimezoneOffset() 方法返回协调世界时（UTC）相对于当前时区的时间差值，单位为分钟。
      // 中国区的偏差是-480分钟,乘以60000转成时间戳 === 8 * 3600000,toISOString()是按协调世界时进行计算的
      // 或者使用dayjs包进行转化
      // this.articleList.forEach(function (t) {
      //   // const date = new Date(t.pub_date)
      //   // t.pub_date = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('.')[0].replace('T', ' ')
      //   会报错!说 $localtime() 未定义??? 艹!
      //   const date = t.pub_date
      //   t.pub_date = this.$localtime(date)
      // })
      // 文章总数
      this.total = res.data.total
      for (let i = 0; i < this.articleList.length; i++) {
        // 将后台返回的时间格式化
        // const time1 = new Date(this.articleList[i].pub_date).getTime()
        // this.articleList[i].pub_date = new Date(time1 + 8 * 3600000).toISOString().split('.')[0].replace('T', ' ')
        this.articleList[i].pub_date = this.$localtime(this.articleList[i].pub_date)
      }
    },
    // 筛选点击事件
    chooseFn () {
      this.q.pagenum = 1
      this.getArtListFn()
    },
    // 重置筛选点击事件
    resetChooseFn (formName) {
      this.$refs[formName].resetFields()
      this.q.pagenum = 1
      this.getArtListFn()
    },
    // 发布文章按钮点击事件
    publishArtFn () {
      this.pubDialogVisible = true
    },

    // 获取文章详情
    async getArticleDetailFn (id) {
      const res = await articleDetailAPI(id)
      // console.log(res)
      this.artDetail = res.data.data
      this.artDetail.pub_date = this.$localtime(this.artDetail.pub_date)
    },

    // 文章详情点击事件
    articleDetailFn (id) {
      this.getArticleDetailFn(id)
      this.detailVisible = true
    },
    // 修改文章点击事件
    async reviseFn (id) {
      await this.getArticleDetailFn(id)
      this.pubDialogVisible = true
      this.$nextTick(() => {
        this.pubForm.title = this.artDetail.title
        this.pubForm.cate_id = this.artDetail.cate_id
        this.pubForm.content = this.artDetail.content
        this.pubForm.cover_img = baseURL + this.artDetail.cover_img
        this.defaultImg = this.pubForm.cover_img
        console.log(this.pubForm)
      })
      // this.$nextTick(() => {
      //   this.getArticleDetailFn(id)
      //   this.pubForm.title = this.artDetail.title
      //   console.log(this.artDetail.title)
      //   console.log(this.pubForm.title)
      // })
    },
    // 删除文章点击事件
    deleteFn (id) {
      console.log(id)
      // 添加确认弹窗
      this.$confirm('您确认要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await deleteArticleAPI(id)
          console.log(res)
          if (res.data.code === 0) {
            this.$message.success(res.data.message)
            // console.log(this.articleList.length)
            if (this.articleList.length === 1) {
              if (this.q.pagenum > 1) { // 保证q.pagenum最小为1
                this.q.pagenum--
              }
            }
            await this.getArtListFn()
          } else {
            this.$message.error(res.data.message)
          }
        })
        .catch(err => err)
    },
    // 每页条数改变函数
    handleSizeChangeFn (val) {
      // 可写可以不写
      this.q.pagesize = val
      // 不重置q.pagenum 可能会出现偶发性的bug,
      // 例如: 当前页数在最后一页时,从每页2条切成3页每条,最后一页将没有值,el-pagination会自动跳转到有值的最后一页,
      // 那么每页条数和页码值都发生了改变,会进行两次请求,但是不一定谁先回来,
      // 如果页码值请求先回来,每页条数请求后回来,那么就会出现问题,因为每页条数请求时的请求页码是之前的2页每条的最后页码,
      // 请求3页每条是2页的最后页码,那么肯定是没有值,就会出现显示bug,反之就没有,页码值的请求回来的数据会覆盖每页条数请求的空数据
      this.q.pagenum = 1
      this.getArtListFn()
    },
    // 页码值发生了变化
    handleCurrentChangeFn (newPage) {
      // 可写可以不写
      this.q.pagenum = newPage
      this.getArtListFn()
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
    // 对话框关闭之前的函数
    onDialogClosedFn () {
      this.resetPublishFn()
    },
    // 富文本校验事件
    contentChangeFn () {
      this.$refs.pubFormRef.validateField('content')
    },
    // input映射事件
    changeCoverFn (e) {
      const files = e.target.files
      // 说明点了取消,没有选择图片
      if (files.length === 0) {
        this.pubForm.cover_img = null
        // 可以
        this.defaultImg = defaultImg
        // 也可以这样
        // this.$refs.imageRef.setAttribute('src', defaultImg)
      } else {
        // 点了图片
        this.pubForm.cover_img = files[0]
        // 可以
        this.defaultImg = URL.createObjectURL(files[0])
        // 也可以这样
        // const url = URL.createObjectURL(files[0])
        // this.$refs.imageRef.setAttribute('src', url)
        // 封面图校验事件
        // console.log(222)
      }
      this.$refs.pubFormRef.validateField('cover_img')
    },
    // 选择封面点击事件
    chooseCoverFn () {
      this.$refs.coverRef.click()
    },
    // 对话框中的发布或存为草稿点击事件
    pubArticleFn (str) {
      // str 已发布和草稿
      this.pubForm.state = str
      console.log(this.pubForm)
      this.$refs.pubFormRef.validate(async valid => {
        // 通过校验
        if (valid) {
          const theFd = new FormData()
          theFd.append('title', this.pubForm.title)
          theFd.append('cate_id', this.pubForm.cate_id)
          theFd.append('content', this.pubForm.content)
          theFd.append('cover_img', this.pubForm.cover_img)
          theFd.append('state', this.pubForm.state)
          const res = await publicArticleAPI(theFd)
          console.log(res)
          if (res.data.code === 0) {
            // 发布成功
            this.$message.success(res.data.message)
            // 刷新文章列表
            await this.getArtListFn()
            // 关闭弹窗
            this.pubDialogVisible = false
          } else {
            // code为1或2, 发布失败
            this.$message.error('发布文章失败!')
          }
        } else {
          return false
        }
      })
    },
    // 重置发布内容的点击事件
    resetPublishFn () {
      this.defaultImg = defaultImg
      this.$refs.pubFormRef.resetFields()
    }
  }
}
</script>

<style scoped lang="less">
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.btn-pub {
  margin-top: 5px;
}

/deep/ .ql-editor {
  min-height: 300px;
}

// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
.btn-dialog {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.el-pagination {
  margin-top: 15px;
}

.title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}

.info {
  font-size: 12px;
  span {
    margin-right: 20px;
  }
}

// 修改 dialog 内部元素的样式，需要添加样式穿透
/deep/ .detail-box {
  img {
    width: 500px;
  }
}
</style>

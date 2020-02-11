<template>
  <div class="users">
<el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
      <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
    <el-button slot="append" icon="el-icon-search"  @click="searchUser"></el-button>
  </el-input>
    <el-button class="rigbutton" type='success' @click="showAddDialog" plain>添加用户</el-button>
  <el-table
      :data="usersList"
      style="width: 100%">
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot:default="obj">
          <el-switch
          v-model="obj.row.mg_state"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change='changeState(obj.row)'>
        </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <!-- obj.row.id -->
         <template v-slot:default="obj">
         <el-button @click='showeditDialog(obj.row)' type="primary" icon="el-icon-edit" plain size='small'></el-button>
         <el-button @click="delUser(obj.row.id)" type="danger" icon="el-icon-delete" plain size='small'></el-button>
         <el-button type="success" icon="el-icon-check" plain size='small'>分配角色</el-button>
         </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8 ,10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!--添加的对话框-->
<el-dialog
  @close="closeDialog"
  title="添加用户"
  :visible.sync="dialogVisible"
  width="40%">
  <el-form :rules="rules" ref="form" :model='form' label-width="80px">
    <el-form-item label="用户名" prop='username'>
      <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
    </el-form-item>
        <el-form-item label="密码" prop="password">
      <el-input type='password' placeholder="请输入密码" v-model="form.password"></el-input>
    </el-form-item>
        <el-form-item label="邮箱" prop='email'>
      <el-input placeholder="请输入邮箱" v-model="form.email"></el-input>
    </el-form-item>
        <el-form-item label="手机" prop='mobile'>
      <el-input placeholder="请输入手机" v-model="form.mobile"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click='addUser'>确 定</el-button>
  </span>
</el-dialog>
 <!--添加的编辑框-->
<el-dialog
  title="修改用户"
  :visible.sync="editVisible"
  width="40%">
  <el-form :rules="rules" ref="editForm" :model='editForm' label-width="80px">
    <el-form-item label="用户名" prop='username'>
      <el-tag type="info">{{editForm.username}}</el-tag>
    </el-form-item>
        <el-form-item label="邮箱" prop='email'>
      <el-input placeholder="请输入邮箱" v-model="editForm.email"></el-input>
    </el-form-item>
        <el-form-item label="手机" prop='mobile'>
      <el-input placeholder="请输入手机" v-model="editForm.mobile"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button @click="editUser" type="primary">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.getUserList()
  },
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 4,
      usersList: [],
      total: 0,
      dialogVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editVisible: false,
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['change', 'blur'] },
          { min: 3, max: 12, message: '长度在3  到 12个字符', trigger: ['change', 'blur'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['change', 'blur'] },
          { min: 3, max: 12, message: '密码长度在3到12个字符', trigger: ['change', 'blur'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    async getUserList () {
      const { data, meta } = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.usersList = data.users
        this.total = data.total
        console.log(data.users)
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getUserList()
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getUserList()
    },
    showAddDialog () {
      this.dialogVisible = true
    },
    async  delUser (id) {
      try {
        await this.$confirm('你确定要删除吗？', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success('删除成功')
          if (this.usersList.length === 1 && this.pagenum > 1) { this.pagenum-- }
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    searchUser () {
      this.pagenum = 1
      this.getUserList()
    },
    async addUser () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('users', this.form)
        if (meta.status === 201) {
          console.log(meta)

          this.$message.success('添加成功')
          this.dialogVisible = false
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    closeDialog () {
      this.$refs.form.resetFields()
    },
    showeditDialog (row) {
      this.editVisible = true
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
    },
    async editUser () {
      try {
        await this.$refs.editForm.validate()
        const { id, email, mobile } = this.editForm
        const { meta } = await this.$axios.put(`users/${id}`, { email, mobile })
        if (meta.status === 200) {
          this.$message.success('修改成功')
          this.editVisible = false
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async changeState (row) {
      const { meta } = await this.$axios.put(`users/${row.id}/state/${row.mg_state}`)

      if (meta.status === 200) {
        this.$message.success('修改成功')
      } else {
        this.$message.error(meta.msg)
      }
    }
  }

}
</script>

<style lang='scss' scoped>
.users{
.el-breadcrumb{
  line-height: 40px;
  height: 40px;
  border-bottom: 1px solid #cccccc;
}
.input-with-select{
  width: 300px;
  margin-bottom: 10px;
  margin-right: 10px;
}

}
</style>

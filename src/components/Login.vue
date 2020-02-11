<template>
  <div class="login">
    <!--
      el-form: 表单组件
        :model="form"  model 传入了一个对象, 作用: 给表单元素提供双向数据绑定
        label-width="80px"

      el-form-item: 表单项, 一个表单可以有多个表单项
        label 表单项的标签

      el-input: 文本框
        v-model="form.name" 和传入的form对象的某个属性双向绑定
     -->
    <el-form ref="form" status-icon :model="form" :rules="rules" label-width="80px">
      <img src="../assets/avatar.jpg" alt="">
      <el-form-item label="用户名" prop="username">
        <el-input @keyup.enter.native="login" v-model="form.username"  placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input @keyup.enter.native="login" v-model="form.password" type="password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '用户名长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '密码长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {

    resetForm () {
      // 通过 ref 拿到 el-form 组件, 调用重置方法
      this.$refs.form.resetFields()
    },
    async login () {
      try {
        await this.$refs.form.validate()
        const res = await this.$axios({
          method: 'post',
          url: 'login',
          data: this.form
        })
        const { meta, data } = res
        if (meta.status === 200) {
          localStorage.setItem('token', data.token)
          this.$message({
            type: 'success',
            message: '恭喜,登录成功',
            duration: 1000
          })
          this.$router.push('/index')
        } else {
          console.log(meta)
          this.$message({
            type: 'error',
            message: meta.msg,
            duration: 1000
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$bgColor: #2d434c;

.login {
  width: 100%;
  height: 100%;
  list-style: none;
  background: $bgColor;
  overflow: hidden;

  .el-form {
    width: 400px;
    background-color: #fff;
    margin: 200px auto;
    padding: 75px 20px 20px;
    border-radius: 20px;
    position: relative;
    img {
      width: 120px;
      height: 120px;
      position: absolute;
      left: 50%;
      top: -70px;
      transform: translateX(-50%);
      border-radius: 50%;
      background-color: #fff;
      border: 5px solid #fff;
    }

    .el-button:last-child {
      margin-left: 80px;
    }
  }
}
</style>

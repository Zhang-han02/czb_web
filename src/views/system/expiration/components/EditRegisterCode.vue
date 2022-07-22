<template>
  <el-dialog
    title="填写注册码"
    :visible.sync="dialogVisible"
    width="600px"
    append-to-body
  >
    <div>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="false" size="small">
        <el-form-item label="注册码" prop="registerCode">
          <el-input v-model="form.registerCode" />
        </el-form-item>
      </el-form>

    </div>
    <span slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">确认</el-button>
    </span>
  </el-dialog>

</template>
<script>
import { saveRegisterCode } from '@/api/system/user'
const defaultForm = { registerCode: null }
export default {
  data() {
    return {
      dialogVisible: false,
      loading: false,
      form: {
        ...defaultForm
      },
      rules: {
        registerCode: [
          { required: true, message: '注册码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {

  },
  methods: {
    open(registerCode) {
      this.dialogVisible = true
      this.form = { ...defaultForm }
      if (registerCode) {
        this.form.registerCode = registerCode
      }
    },

    submit() {
      this.loading = true
      saveRegisterCode(this.form).then(
        (response) => {
          this.$emit('success')
          this.loading = false
          this.$notify({
            title: '成功',
            message: '注册码设置成功',
            type: 'success'
          })
          this.dialogVisible = false
        }
      ).catch(e => {
        this.loading = false
        console.log(e)
      })
    }
  }
}
</script>

<template>
  <div>
    <div class="btns">
      <el-button type="success" @click="loadDetail">刷新</el-button>
      <el-button v-permission="['admin','barcodeConfig:add']" :loading="submitLoading" type="primary" @click="submit">保存设置</el-button>
    </div>

    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px" class="form">
      <div class="block">
        <h3>条码生成规则</h3>
        <el-form-item label="流水号类型" prop="serialNumberType">
          <el-select v-model="form.serialNumberType" filterable placeholder="请选择" style="width: 370px;">
            <el-option
              v-for="item in dict.serial_number_type"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="前缀类型">
          <el-select v-model="form.prefixType" filterable placeholder="请选择" style="width: 370px;">
            <el-option
              v-for="item in dict.barcode_decorate_type"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="form.prefixType === '3'" label="前缀固定字符">
          <el-input v-model="form.prefixValue" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="后缀类型">
          <el-select v-model="form.suffixType" filterable placeholder="请选择" style="width: 370px;">
            <el-option
              v-for="item in dict.barcode_decorate_type"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="form.suffixType === '3'" label="后缀固定字符">
          <el-input v-model="form.suffixValue" style="width: 370px;" />
        </el-form-item>

      </div>
    </el-form>

  </div>
</template>

<script>
import { latest, save } from '@/api/czb/barcodeConfig'

export default {
  name: 'BarcodeConfig',
  data() {
    return {
      form: {
        id: null,
        serialNumberType: null,
        prefixType: null,
        prefixValue: null,
        suffixType: null,
        suffixValue: null
      },
      submitLoading: false,
      rules: {
        serialNumberType: [
          { required: true, message: '请选择流水号类型', trigger: 'change' }
        ]
      }
    }
  },
  dicts: ['barcode_decorate_type', 'serial_number_type'],
  mounted() {
    this.loadDetail()
  },
  methods: {
    loadDetail() {
      latest().then((result) => {
        this.form = result
      }).catch((err) => {
        console.log(err)
      })
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$confirm('确定保存该设置?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitAction()
          }).catch(() => {

          })
        } else {
          return false
        }
      })
    },
    submitAction() {
      this.submitLoading = true

      save(this.form).then(res => {
        this.submitLoading = false
        this.$notify({
          title: '成功',
          message: '保存配置成功',
          type: 'success'
        })
        this.loadDetail()
      }).catch(e => {
        this.submitLoading = false
        console.log(e)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.btns{
    display: flex;
    justify-content: flex-end;
    padding: 10px 20px;
}
.form{
    padding: 20px;
    .block{
        margin-bottom: 25px;
        border: 1px solid #e5e5e5;
        padding: 15px;
    }
}
</style>

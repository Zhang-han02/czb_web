<template>
  <div>
    <div class="btns">
      <el-button type="success" @click="loadDetail">刷新</el-button>
      <el-button v-permission="['admin','serverConfig:add']" :loading="submitLoading" type="primary" @click="submit">保存配置</el-button>
    </div>

    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px" class="form">
      <div class="block">
        <h3>ERP服务器配置</h3>
        <el-form-item label="数据库类型">
          <el-select v-model="form.dbType" filterable placeholder="请选择" style="width: 370px;">
            <el-option
              v-for="item in dict.db_type"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数据库地址">
          <el-input v-model="form.dbIp" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="数据库端口">
          <el-input v-model="form.dbPort" style="width: 370px;" />
        </el-form-item>
        <!-- <el-form-item label="数据库名称">
          <el-input v-model="form.dbName" style="width: 370px;" />
        </el-form-item> -->
        <el-form-item label="数据库用户名">
          <el-input v-model="form.dbUsername" style="width: 370px;" />
        </el-form-item>
        <el-form-item label="数据库密码">
          <el-input v-model="form.dbPassword" style="width: 370px;" />
        </el-form-item>

        <el-form-item label="账套名称">
          <el-select v-model="form.account" filterable placeholder="请选择" style="width: 370px;">
            <el-option
              v-for="item in accountList"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-button v-permission="['admin','serverConfig:add']" style="margin-left:10px;" type="primary" size="small" @click="getAccountSet">获取账套列表</el-button>
        </el-form-item>

      </div>

      <div class="block">
        <h3>称重模式选择</h3>
        <el-form-item label="称重模式">
          <el-select v-model="form.weighModel" filterable placeholder="请选择">
            <el-option
              v-for="item in dict.weigh_model"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </div>

      <div class="block">
        <h3>称重配置</h3>
        <el-form-item label="称重频次">
          <el-radio v-for="item in dict.weigh_frequency" :key="item.id" v-model="form.weighFrequency" :label="item.value">{{ item.label }}</el-radio>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.isAutoPrint" style="width: 370px;">是否保存后自动打印</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.isAutoSavePrint" style="width: 370px;">是否稳定后自动保存并打印</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.isMustOrder" style="width: 370px;">是否必选订单</el-checkbox>
        </el-form-item>
      </div>
    </el-form>

  </div>
</template>

<script>
import { latest, save, accountSet } from '@/api/czb/serverConfig'

export default {
  name: 'ServerConfig',
  data() {
    return {
      form: {
        dbType: null,
        dbIp: null,
        dbPort: null,
        dbName: null,
        dbUsername: null,
        dbPassword: null,
        weighModel: null,
        weighFrequency: null,
        isAutoPrint: null,
        isAutoSavePrint: null,
        isMustOrder: null,
        account: null
      },
      submitLoading: false,
      accountList: [],
      rules: {

        // dbType: [
        //   { required: true, message: '请选择数据库类型', trigger: 'blur' }
        // ]
      }
    }
  },
  dicts: ['weigh_model', 'weigh_frequency', 'db_type'],
  mounted() {
    this.loadDetail()
  },
  methods: {
    getAccountSet() {
      accountSet(this.form).then((result) => {
        this.accountList = result
        this.$message({
          message: '获取账套列表成功',
          type: 'success'
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    loadDetail() {
      latest().then((result) => {
        this.form = result
        this.form.weighModel = result.weighModel.toString()
        this.form.weighFrequency = result.weighFrequency.toString()
        if (this.form.account) {
          this.accountList = [this.form.account]
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    submit() {
      this.$confirm('确定保存该配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submitAction()
      }).catch(() => {

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

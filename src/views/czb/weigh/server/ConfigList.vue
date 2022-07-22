<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->

        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="服务器名称">
            <el-input v-model="form.serverName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="数据库地址">
            <el-input v-model="form.databaseAddress" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="数据库密码">
            <el-input v-model="form.databasePassword" style="width: 370px;" />
          </el-form-item>
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
          <el-form-item label="称重频次">
            <el-radio v-for="item in dict.weigh_frequency" :key="item.id" v-model="form.weighFrequency" :label="item.value">{{ item.label }}</el-radio>
          </el-form-item>
          <el-form-item label="是否保存后自动打印 0:否 1:是">
            <el-input v-model="form.isAutoPrint" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否稳定后自动保存并打印 0:否 1:是">
            <el-input v-model="form.isAutoSavePrint" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否必选订单 0:否 1:是">
            <el-input v-model="form.isMustOrder" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="serverName" label="服务器名称" />
        <el-table-column prop="databaseAddress" label="数据库地址" />
        <el-table-column prop="databasePassword" label="数据库密码" />
        <el-table-column prop="weighModel" label="称重模式">
          <template slot-scope="scope">
            {{ dict.label.weigh_model[scope.row.weighModel] }}
          </template>
        </el-table-column>
        <el-table-column prop="weighFrequency" label="称重频次">
          <template slot-scope="scope">
            {{ dict.label.weigh_frequency[scope.row.weighFrequency] }}
          </template>
        </el-table-column>
        <el-table-column prop="isAutoPrint" label="是否保存后自动打印 0:否 1:是" />
        <el-table-column prop="isAutoSavePrint" label="是否稳定后自动保存并打印 0:否 1:是" />
        <el-table-column prop="isMustOrder" label="是否必选订单 0:否 1:是" />
        <el-table-column prop="createBy" label="创建者" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column v-if="checkPer(['admin','serverConfig:edit','serverConfig:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudServerConfig from '@/api/czb/serverConfig'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, serverName: null, databaseAddress: null, databasePassword: null, weighModel: null, weighFrequency: null, isAutoPrint: null, isAutoSavePrint: null, isMustOrder: null, createBy: null, createTime: null, updateBy: null, updateTime: null }
export default {
  name: 'ServerConfig',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['weigh_model', 'weigh_frequency'],
  cruds() {
    return CRUD({ title: '服务器配置', url: 'api/serverConfig', idField: 'id', sort: 'id,desc', crudMethod: { ...crudServerConfig }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'serverConfig:add'],
        edit: ['admin', 'serverConfig:edit'],
        del: ['admin', 'serverConfig:del']
      },
      rules: {

        // serverName: [
        //   { required: true, message: '请填写服务器名称', trigger: 'blur' }
        // ]
      }
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>

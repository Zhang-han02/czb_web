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
          <el-form-item label="前缀类型">
            <el-select v-model="form.prefixType" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.barcode_decorate_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="前缀固定字符">
            <el-input v-model="form.prefixValue" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="后缀类型">
            <el-select v-model="form.suffixType" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.barcode_decorate_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="后缀固定字符">
            <el-input v-model="form.suffixValue" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="流水号类型" prop="serialNumberType">
            <el-select v-model="form.serialNumberType" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.serial_number_type"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
        <el-table-column prop="prefixType" label="前缀类型">
          <template slot-scope="scope">
            {{ dict.label.barcode_decorate_type[scope.row.prefixType] }}
          </template>
        </el-table-column>
        <el-table-column prop="prefixValue" label="前缀固定字符" />
        <el-table-column prop="suffixType" label="后缀类型">
          <template slot-scope="scope">
            {{ dict.label.barcode_decorate_type[scope.row.suffixType] }}
          </template>
        </el-table-column>
        <el-table-column prop="suffixValue" label="后缀固定字符" />
        <el-table-column prop="serialNumberType" label="流水号类型">
          <template slot-scope="scope">
            {{ dict.label.serial_number_type[scope.row.serialNumberType] }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建日期" />
        <el-table-column v-if="checkPer(['admin','barcodeConfig:edit','barcodeConfig:del'])" label="操作" width="150px" align="center">
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
import crudBarcodeConfig from '@/api/czb/barcodeConfig'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, prefixType: null, prefixValue: null, suffixType: null, suffixValue: null, serialNumberType: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'BarcodeConfig',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['barcode_decorate_type', 'barcode_decorate_type', 'serial_number_type'],
  cruds() {
    return CRUD({ title: '条码设置', url: 'api/barcodeConfig', idField: 'id', sort: 'id,desc', crudMethod: { ...crudBarcodeConfig }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'barcodeConfig:add'],
        edit: ['admin', 'barcodeConfig:edit'],
        del: ['admin', 'barcodeConfig:del']
      },
      rules: {
        serialNumberType: [
          { required: true, message: '流水号类型不能为空', trigger: 'blur' }
        ]
      }}
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

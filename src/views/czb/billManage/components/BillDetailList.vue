<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">单据id</label>
        <el-input v-model="query.billId" clearable placeholder="单据id" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="单据id" prop="billId">
            <el-input v-model="form.billId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="产品id" prop="prodId">
            <el-input v-model="form.prodId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="磅台名称">
            <el-input v-model="form.poundName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="磅单编号">
            <el-input v-model="form.poundBillNum" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="单位">
            <el-input v-model="form.unit" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="辅助单位1">
            <el-input v-model="form.unit1" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="辅助单位2">
            <el-input v-model="form.unit2" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="重量">
            <el-input v-model="form.weight" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="辅助数量1">
            <el-input v-model="form.amount1" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="辅助数量2">
            <el-input v-model="form.amount2" style="width: 370px;" />
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
        <el-table-column prop="billId" label="单据id" />
        <el-table-column prop="prodId" label="产品id" />
        <el-table-column prop="poundName" label="磅台名称" />
        <el-table-column prop="poundBillNum" label="磅单编号" />
        <el-table-column prop="unit" label="单位" />
        <el-table-column prop="unit1" label="辅助单位1" />
        <el-table-column prop="unit2" label="辅助单位2" />
        <el-table-column prop="weight" label="重量" />
        <el-table-column prop="amount1" label="辅助数量1" />
        <el-table-column prop="amount2" label="辅助数量2" />
        <el-table-column prop="updateBy" label="更新者" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column v-if="checkPer(['admin','billDetail:edit','billDetail:del'])" label="操作" width="150px" align="center">
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
import crudBillDetail from '@/api/czb/billDetail'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, billId: null, prodId: null, poundName: null, poundBillNum: null, unit: null, unit1: null, unit2: null, weight: null, amount1: null, amount2: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'BillDetail',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '单据详情', url: 'api/billDetail', idField: 'id', sort: 'id,desc', crudMethod: { ...crudBillDetail }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'billDetail:add'],
        edit: ['admin', 'billDetail:edit'],
        del: ['admin', 'billDetail:del']
      },
      rules: {
        billId: [
          { required: true, message: '单据id不能为空', trigger: 'blur' }
        ],
        prodId: [
          { required: true, message: '产品id不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'billId', display_name: '单据id' }
      ]
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

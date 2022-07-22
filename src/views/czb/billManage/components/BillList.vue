<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">单据编号</label>
        <el-input v-model="query.billNum" clearable placeholder="单据编号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">单据日期</label>
        <date-range-picker
          v-model="query.billDate"
          class="date-item"
        />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission">
        <template v-slot:right>
          <import-dialog upload-api="api/bill/importExcel" :template-name="templateName" :class-type="String(billType)" :show-import-model="false" @importSuccess="crud.toQuery()" />
          <el-button type="primary" icon="el-icon-printer" size="mini" :loading="printLoading" :disabled="crud.selections.length !== 1" class="filter-item" @click="printAction">打印</el-button>

        </template>
      </crudOperation>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible="crud.status.cu > 0" :title="crud.status.title" width="90%" append-to-body top="6vh">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px" inline>
          <h3>单据信息</h3>
          <el-form-item label="单据编号" prop="billNum">
            <el-input v-model="form.billNum" style="width: 280px;" :readonly="isDetail" />
          </el-form-item>
          <el-form-item label="单据日期" prop="billDate">
            <el-date-picker v-model="form.billDate" type="date" value-format="yyyy-MM-dd" style="width: 280px;" :readonly="isDetail" />
          </el-form-item>

          <el-form-item label="仓库" prop="warehouseId">
            <el-input v-model="form.warehouse.name" style="width: 280px;" readonly placeholder="请选择仓库">
              <el-button slot="append" icon="el-icon-search" :disabled="isDetail" @click="pickWarehouse" />
            </el-input>
          </el-form-item>
          <el-form-item v-if="billType === 1" label="供应商" prop="supplierId">
            <el-input v-model="form.supplier.name" style="width: 280px;" readonly placeholder="请选择供应商">
              <el-button slot="append" icon="el-icon-search" :disabled="isDetail" @click="$refs.supplierPicker.open()" />
            </el-input>
          </el-form-item>
          <el-form-item v-if="billType === 2" label="客户" prop="custId">
            <el-input v-model="form.cust.name" style="width: 280px;" readonly placeholder="请选择客户">
              <el-button slot="append" icon="el-icon-search" :disabled="isDetail" @click="$refs.custPicker.open()" />
            </el-input>
          </el-form-item>
          <h3>单据详情</h3>
          <div class="row-space">
            <el-button type="primary" size="small" @click="form.detail.push({...defaultDetailItem,prod: { name: null }})">添加</el-button>

          </div>
          <el-table :data="form.detail" border stripe size="small" max-height="400px">
            <el-table-column
              type="index"
              width="40"
              align="center"
            />

            <el-table-column label="产品" width="180" align="center">
              <template slot-scope="scope">
                <el-input v-model="form.detail[scope.$index].prod.name" size="mini" class="edit-input" readonly placeholder="请选择产品">
                  <el-button slot="append" size="mini" icon="el-icon-search" @click="pickProd(scope.$index)" />
                </el-input>
              </template>
            </el-table-column>

            <el-table-column label="磅台名称" align="center">
              <template slot-scope="scope">
                <el-input v-model="form.detail[scope.$index].poundName" size="mini" class="edit-input" />
              </template>
            </el-table-column>

            <el-table-column label="磅单编号" align="center">
              <template slot-scope="scope">
                <el-input v-model="form.detail[scope.$index].poundBillNum" size="mini" class="edit-input" />
              </template>
            </el-table-column>

            <el-table-column label="单位" align="center">
              <template slot-scope="scope">
                <el-input v-model="form.detail[scope.$index].unit" size="mini" class="edit-input" />
              </template>
            </el-table-column>

            <el-table-column label="辅助单位1" align="center">
              <template slot-scope="scope">
                <el-input v-model="form.detail[scope.$index].unit1" size="mini" class="edit-input" />
              </template>
            </el-table-column>

            <el-table-column label="辅助单位2" align="center">
              <template slot-scope="scope">
                <el-input v-model="form.detail[scope.$index].unit2" size="mini" class="edit-input" />
              </template>
            </el-table-column>

            <el-table-column label="重量" align="center">
              <template slot-scope="scope">
                <el-input v-model="form.detail[scope.$index].weight" size="mini" class="edit-input" @blur="getAmount(scope.$index)" />
              </template>
            </el-table-column>

            <el-table-column label="辅助数量1" align="center">
              <template slot-scope="scope">
                <el-input v-model="form.detail[scope.$index].amount1" size="mini" class="edit-input" />
              </template>
            </el-table-column>

            <el-table-column label="辅助数量2" align="center">
              <template slot-scope="scope">
                <el-input v-model="form.detail[scope.$index].amount2" size="mini" class="edit-input" />
              </template>
            </el-table-column>

            <el-table-column label="单价" align="center">
              <template slot-scope="scope">
                <el-input v-model="form.detail[scope.$index].price" size="mini" class="edit-input" @blur="getAmount(scope.$index)" />
              </template>
            </el-table-column>

            <el-table-column label="金额" align="center">
              <template slot-scope="scope">
                <el-input v-model="form.detail[scope.$index].amount" size="mini" class="edit-input" readonly />
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="100">
              <template slot-scope="scope">
                <el-button type="danger" size="mini" @click="form.detail.splice(scope.$index,1)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="billNum" label="单据编号" />
        <el-table-column prop="billDate" label="单据日期" />
        <el-table-column prop="warehouse.name" label="仓库" />
        <el-table-column v-if="billType === 1" prop="supplier.name" label="供应商" />
        <el-table-column v-if="billType === 2" prop="cust.name" label="客户" />
        <el-table-column prop="operator.nickName" label="操作员" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column v-if="checkPer(['admin', cudPermission.edit,cudPermission.del])" label="操作" width="150px" align="center">
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
    <WarehousePicker ref="warehousePicker" @result="warehouseResult" />
    <SupplierPicker ref="supplierPicker" @result="supplierResult" />
    <ProdPicker ref="prodPicker" @result="prodResult" />
    <CustPicker ref="custPicker" @result="custResult" />
  </div>
</template>

<script>
import crudBill, { serialNumber, print } from '@/api/czb/bill'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import WarehousePicker from '@/views/czb/archive/warehouse/components/WarehousePicker'
import SupplierPicker from '@/views/czb/archive/supplier/components/SupplierPicker'
import ProdPicker from '@/views/czb/archive/prod/components/ProdPicker'
import CustPicker from '@/views/czb/archive/cust/components/CustPicker'
import ImportDialog from '@/components/czb/ImportDialog'
import { templatePrint } from '@/utils/czbUtil'

const defaultForm = { id: null, billType: null, billDate: null, billNum: null, warehouseId: null, warehouse: { name: null }, supplierId: null, supplier: { name: null }, custId: null, cust: { name: null }, detail: [], createBy: null, updateBy: null, createTime: null, updateTime: null }

export default {
  name: 'Bill',
  components: { pagination, crudOperation, rrOperation, udOperation, DateRangePicker, WarehousePicker, SupplierPicker, ProdPicker, CustPicker, ImportDialog },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '单据', url: 'api/bill', idField: 'id', sort: 'id,desc', crudMethod: { ...crudBill }})
  },
  props: {
    billType: {
      type: Number,
      default: 0
    },
    cudPermission: {
      type: Object,
      default: () => {
        return {
          add: '',
          edit: '',
          del: ''
        }
      }
    }
  },
  data() {
    return {
      permission: {
        add: ['admin', this.cudPermission.add],
        edit: ['admin', this.cudPermission.edit],
        del: ['admin', this.cudPermission.del]
      },
      rules: {
        billDate: [
          { required: true, message: '单据日期不能为空', trigger: 'blur' }
        ],
        billNum: [
          { required: true, message: '单据编号不能为空', trigger: 'blur' }
        ],
        warehouseId: [
          { required: true, message: '仓库不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'billType', display_name: '单据类型 1：采购入库 2：销售出库' },
        { key: 'billNum', display_name: '单据编号' }
      ],
      curDetailChoose: null,
      defaultDetailItem: {
        prodId: null,
        prod: { name: null },
        poundName: null,
        poundBillNum: null,
        unit: null,
        unit1: null,
        unit2: null,
        weight: null,
        amount1: null,
        amount2: null,
        price: null,
        amount: null
      },
      isDetail: false,
      printLoading: false
    }
  },
  computed: {
    templateName() {
      return this.billType === 1 ? '采购入库单据导入模板.xlsx' : '销售出库单据导入模板.xlsx'
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      this.query.billType = this.billType
      return true
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      form.billType = this.billType
      if (form.id) {
        this.isDetail = true
      } else {
        this.isDetail = false
        serialNumber(this.billType).then((result) => {
          form.billNum = result
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    // 提交前
    [CRUD.HOOK.beforeSubmit]() {
      for (let i = 0; i < this.form.detail.length; i++) {
        const item = this.form.detail[i]
        if (!item.prodId) {
          this.$message.error(`第 ${i + 1} 行请选择产品`)
          return false
        }
      }
      return true
    },
    getAmount(index) {
      const row = this.form.detail[index]
      if (row.price && row.weight) {
        const r = Number(row.weight) * Number(row.price)
        this.$set(row, 'amount', r || 0)
      }
    },
    pickWarehouse() {
      this.$refs.warehousePicker.open()
    },
    warehouseResult(row) {
      this.form.warehouseId = row.id
      this.form.warehouse.name = row.name
    },
    supplierResult(row) {
      this.form.supplierId = row.id
      this.form.supplier.name = row.name
    },
    pickProd(index) {
      this.curDetailChoose = index
      this.$refs.prodPicker.open()
    },
    prodResult(row) {
      this.form.detail[this.curDetailChoose].prodId = row.id
      this.form.detail[this.curDetailChoose].prod.name = row.name
    },
    custResult(row) {
      this.form.custId = row.id
      this.form.cust.name = row.name
    },
    printAction() {
      const ids = this.crud.selections.map(val => val.id).join(',')
      this.printLoading = true
      print(ids).then((result) => {
        templatePrint(result, '1').then(() => {
          this.printLoading = false
          console.log('打印结束')
        }).catch((err) => {
          this.printLoading = false
          this.$message.error(err.message)
        })
      }).catch((err) => {
        this.printLoading = false
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.row-space{
  margin-bottom: 10px;
}

</style>

<template>
  <div>
    <el-dialog
      title="明细"
      :visible.sync="dialogVisible"
      width="80%"
      append-to-body
    >
      <div>
        <div class="head-container">
          <label class="el-form-item-label">单据日期</label>
          <el-date-picker
            v-model="query.billDate"
            placeholder="单据日期"
            type="date"
            value-format="yyyy-MM-dd"
            style="width: 185px"
            class="filter-item"
            clearable
            :disabled="collectType === 4"
          />
          <label class="el-form-item-label">产品</label>
          <el-input
            v-model="query.prodName"
            size="mini"
            class="filter-item"
            readonly
            placeholder="请选择产品"
            style="width: 185px"
          >
            <el-button
              slot="append"
              size="mini"
              icon="el-icon-search"
              :disabled="collectType === 1"
              @click="$refs.prodPicker.open()"
            />
          </el-input>
          <label class="el-form-item-label">仓库</label>
          <el-input
            v-model="query.warehouseName"
            size="mini"
            class="filter-item"
            readonly
            placeholder="请选择仓库"
            style="width: 185px"
          >
            <el-button
              slot="append"
              size="mini"
              icon="el-icon-search"
              :disabled="collectType === 3"
              @click="$refs.warehousePicker.open()"
            />
          </el-input>
          <template v-if="billType === 1">
            <label class="el-form-item-label">供应商</label>
            <el-input
              v-model="query.supplierName"
              size="mini"
              class="filter-item"
              readonly
              placeholder="请选择供应商"
              style="width: 185px"
            >
              <el-button
                slot="append"
                size="mini"
                icon="el-icon-search"
                :disabled="collectType === 2"
                @click="$refs.supplierPicker.open()"
              />
            </el-input>
          </template>
          <template v-if="billType === 2">
            <label class="el-form-item-label">客户</label>
            <el-input
              v-model="query.custName"
              size="mini"
              class="filter-item"
              readonly
              placeholder="请选择客户"
              style="width: 185px"
            >
              <el-button
                slot="append"
                size="mini"
                icon="el-icon-search"
                :disabled="collectType === 2"
                @click="$refs.custPicker.open()"
              />
            </el-input>
          </template>
          <label class="el-form-item-label">操作员</label>
          <el-input
            v-model="query.operatorName"
            size="mini"
            class="filter-item"
            readonly
            placeholder="请选择操作员"
            style="width: 185px"
          >
            <el-button
              slot="append"
              size="mini"
              icon="el-icon-search"
              @click="$refs.userPicker.open()"
            />
          </el-input>

          <el-button
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-search"
            @click="refresh"
          >搜索</el-button>
          <el-button class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="resetQuery()">重置</el-button>
        </div>
        <el-table
          ref="table"
          v-loading="loading"
          :data="tableData"
          size="small"
          style="width: 100%; margin-bottom: 15px"
        >
          <el-table-column prop="billDate" label="单据日期" width="90" />
          <el-table-column prop="billNum" label="单据编号" />
          <el-table-column prop="warehouseName" label="仓库" show-overflow-tooltip />
          <el-table-column
            v-if="billType === 1"
            prop="supplierName"
            label="供应商"
            show-overflow-tooltip
          />
          <el-table-column v-if="billType === 2" prop="custName" label="客户" show-overflow-tooltip />
          <el-table-column prop="operatorName" label="操作员" />

          <el-table-column prop="prodName" label="产品" show-overflow-tooltip />
          <el-table-column prop="poundName" label="磅台名称" show-overflow-tooltip />
          <el-table-column prop="poundBillNum" label="磅单编号" />

          <el-table-column prop="unit" label="单位" />
          <el-table-column prop="unit1" label="辅助单位1" />
          <el-table-column prop="unit2" label="辅助单位2" />
          <el-table-column prop="weight" label="重量" />
          <el-table-column prop="amount1" label="辅助数量1" />
          <el-table-column prop="amount2" label="辅助数量2" />
        </el-table>

        <div class="block">
          <el-pagination
            layout="total,prev, pager, next"
            :current-page="pageNo + 1"
            :total="totalItem"
            :page-size="pageSize"
            @prev-click="turnPage"
            @next-click="turnPage"
            @current-change="turnPage"
          />
        </div>
      </div>
    </el-dialog>

    <WarehousePicker ref="warehousePicker" @result="warehouseResult" />
    <SupplierPicker ref="supplierPicker" @result="supplierResult" />
    <ProdPicker ref="prodPicker" @result="prodResult" />
    <CustPicker ref="custPicker" @result="custResult" />
    <UserPicker ref="userPicker" @result="userResult" />
  </div>
</template>
<script>
import { collectDetail } from '@/api/czb/billDetail'
import WarehousePicker from '@/views/czb/archive/warehouse/components/WarehousePicker'
import SupplierPicker from '@/views/czb/archive/supplier/components/SupplierPicker'
import ProdPicker from '@/views/czb/archive/prod/components/ProdPicker'
import CustPicker from '@/views/czb/archive/cust/components/CustPicker'
import UserPicker from '@/views/system/user/components/UserPicker'

const defaultQuery = {
  billDate: null,
  prodId: null,
  prodName: null,
  warehouseId: null,
  warehouseName: null,
  supplierId: null,
  supplierName: null,
  custId: null,
  custName: null,
  operator: null,
  operatorName: null
}

export default {
  components: {
    WarehousePicker,
    SupplierPicker,
    ProdPicker,
    CustPicker,
    UserPicker
  },
  props: {
    // 单据类型 1：采购入库 2：销售出库
    billType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      pageNo: 0,
      pageSize: 10,
      totalItem: 0,
      query: {
        ...defaultQuery
      },
      loading: false,
      collectType: 0,
      value: {
        id: null,
        label: null
      }
    }
  },
  mounted() {},
  methods: {
    /**
     * @param collectType 汇总类型 1：按产品 2：按往来单位 3：按仓库 4：按日期
     * @param value 汇总条件值
     */
    open(collectType, value) {
      this.collectType = collectType
      this.value = value
      this.dialogVisible = true

      this.resetQuery()
    },
    initParams() {
      // 汇总类型 1：按产品 2：按往来单位 3：按仓库 4：按日期
      switch (this.collectType) {
        case 1:
          // 按产品
          this.query.prodId = this.value.id
          this.query.prodName = this.value.label
          break
        case 2:
          // 按往来单位
          // 单据类型 1：采购入库 2：销售出库
          if (this.billType === 1) {
            this.query.supplierId = this.value.id
            this.query.supplierName = this.value.label
          } else {
            this.query.custId = this.value.id
            this.query.custName = this.value.label
          }

          break
        case 3:
          // 按仓库
          this.query.warehouseId = this.value.id
          this.query.warehouseName = this.value.label
          break
        case 4:
          // 按日期
          this.query.billDate = this.value.label
          break

        default:
          break
      }
    },
    resetQuery() {
      this.query = { ...defaultQuery }
      this.initParams()
      this.refresh()
    },
    refresh() {
      this.pageNo = 0
      this.getList()
    },
    turnPage(e) {
      this.pageNo = e - 1
      this.getList()
    },
    getList() {
      this.loading = true
      const params = {
        ...this.query,
        billType: this.billType,
        page: this.pageNo,
        size: this.pageSize
      }
      collectDetail(params)
        .then((response) => {
          this.loading = false
          this.totalItem = response.totalElements
          this.tableData = response.content
        })
        .catch((e) => {
          this.loading = false
          console.log(e)
        })
    },
    warehouseResult(row) {
      this.query.warehouseId = row.id
      this.query.warehouseName = row.name
    },
    supplierResult(row) {
      this.query.supplierId = row.id
      this.query.supplierName = row.name
    },
    prodResult(row) {
      this.query.prodId = row.id
      this.query.prodName = row.name
    },
    custResult(row) {
      this.query.custId = row.id
      this.query.custName = row.name
    },
    userResult(row) {
      this.query.operator = row.username
      this.query.operatorName = row.nickName
    }
  }
}
</script>
<style lang="scss">
.head-container {
  .filter-item {
    display: inline-table;
  }
}
</style>

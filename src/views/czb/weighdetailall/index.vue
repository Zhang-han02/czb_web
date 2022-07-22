<template>
  <div class="app-container">
    <div>
        <div class="head-container">
          <label class="el-form-item-label">称重时间:</label>
          <el-date-picker
            v-model="query.weighDate"
            placeholder="称重日期"
            type="date"
            value-format="yyyy-MM-dd"
            style="width: 200px"
            class="filter-item"
            clearable
          />
          <label class="el-form-item-label">产品:</label>
          <el-input
            v-model="query.prodName"
            size="mini"
            class="filter-item"
            readonly
            placeholder="请选择产品"
            style="width: 200px"
          >
            <el-button
              slot="append"
              size="mini"
              icon="el-icon-search"
              @click="$refs.prodPicker.open()"
            />
          </el-input>
          <label class="el-form-item-label">单据类型:</label>
          <el-select
            v-model="query.billType"
            clearable
            filterable
            :filter-method="refresh"
            size="small"
            placeholder="单据类型"
            class="filter-item"
            style="width: 200px"
            @change="refresh()"
          >
            <el-option
              v-for="item in dict.bill_type"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <template v-if="!!query.billType">
            <label class="el-form-item-label">往来单位</label>
            <el-input
              v-if="query.billType === '1'"
              v-model="query.supplierName"
              size="mini"
              class="filter-item"
              readonly
              placeholder="请选择供应商"
              style="width: 200px"
            >
              <el-button
                slot="append"
                size="mini"
                icon="el-icon-search"
                @click="$refs.supplierPicker.open()"
              />
            </el-input>

            <el-input
              v-if="query.billType === '2'"
              v-model="query.custName"
              size="mini"
              class="filter-item"
              readonly
              placeholder="请选择客户"
              style="width: 200px"
            >
              <el-button
                slot="append"
                size="mini"
                icon="el-icon-search"
                @click="$refs.custPicker.open()"
              />
            </el-input>
          </template>
          <label class="el-form-item-label">司磅员</label>
          <el-input
            v-model="query.operatorName"
            size="mini"
            class="filter-item"
            readonly
            placeholder="请选择操作员"
            style="width: 200px"
          >
          <el-button
            slot="append"
            size="mini"
            icon="el-icon-search"
            @click="$refs.userPicker.open()"
          />
          </el-input>
          <label class="el-form-item-label">仓库</label>
          <el-input
            v-model="query.warehouseName"
            size="mini"
            class="filter-item"
            readonly
            placeholder="请选择仓库"
            style="width: 190px"
          >
            <el-button
              slot="append"
              size="mini"
              icon="el-icon-search"
              @click="$refs.warehousePicker.open()"
            />
          </el-input>

          <label class="el-form-item-label">磅台</label>
          <el-input v-model="query.poundName" clearable placeholder="磅台" style="width: 190px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
          <el-button
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-search"
            @click="refresh"
          >搜索
          </el-button>
          <el-button
            class="filter-item"
            size="mini"
            type="warning"
            icon="el-icon-refresh-left"
            @click="resetQuery()"
          >
            重置
          </el-button>
        </div>
        <div>
          <el-button
            type="primary"
            icon="el-icon-printer"
            size="mini"
            :loading="printLoading"
            class="filter-item"
            @click="printAction"
          >
            打印
          </el-button>
          <el-button
            :loading="createBillLoading"
            type="primary"
            icon="el-icon-s-promotion"
            size="mini"
            class="filter-item"
            :disabled="crud.selections.length == 0"
            @click="createUpOrder"
          >
            生单
          </el-button>
        </div>
        <el-table
          ref="table"
          v-loading="loading"
          :data="tableData"
          size="small"
          style="width: 100%; margin-bottom: 15px"
          @selection-change="crud.selectionChangeHandler"
        >
          <el-table-column
            type="selection"
            width="55"
            :selectable="checkStatus"
          />
          <el-table-column prop="weighDate" label="称重日期" width="150" />
          <el-table-column prop="billType" label="单据类型">
            <template slot-scope="scope">
              {{ dict.label.bill_type[scope.row.billType] }}
            </template>
          </el-table-column>
          <el-table-column prop="billStatus" label="单据状态">
            <template slot-scope="scope">
              {{ dict.label.bill_status[scope.row.billStatus] }}
            </template>
          </el-table-column>
          <el-table-column prop="poundName" label="磅台名称" />
          <el-table-column prop="poundBillNum" label="磅单编号" />
          <el-table-column prop="prodInfo.name" label="产品" />
          <el-table-column prop="warehouseInfo.name" label="仓库" />
          <el-table-column
            label="往来单位"
            :formatter="transCompany"
            show-overflow-tooltip
          />
          <el-table-column prop="operatorInfo.nickName" label="司磅员" />
          <el-table-column prop="weight" label="重量" />
          <el-table-column prop="unit" label="单位" />
          <el-table-column prop="price" label="单价" />
          <el-table-column prop="amount" label="总金额" />
        </el-table>

        <div class="block">
          <el-pagination
            layout="total, prev, pager, next"
            :current-page="pageNo + 1"
            :total="totalItem"
            :page-size="pageSize"
            @prev-click="turnPage"
            @next-click="turnPage"
            @current-change="turnPage"
          />
        </div>
      </div>
      <WarehousePicker ref="warehousePicker" @result="warehouseResult" />
    <SupplierPicker ref="supplierPicker" @result="supplierResult" />
    <ProdPicker ref="prodPicker" @result="prodResult" />
    <CustPicker ref="custPicker" @result="custResult" />
    <UserPicker ref="userPicker" @result="userResult" />
    </div>
</template>
<script>
import CRUD, { presenter, header, crud } from '@crud/crud'
import { collectDetail, print,createUpOrder,collectDetailAll } from '@/api/czb/weighSummary'
import WarehousePicker from '@/views/czb/archive/warehouse/components/WarehousePicker'
import SupplierPicker from '@/views/czb/archive/supplier/components/SupplierPicker'
import ProdPicker from '@/views/czb/archive/prod/components/ProdPicker'
import CustPicker from '@/views/czb/archive/cust/components/CustPicker'
import UserPicker from '@/views/system/user/components/UserPicker'
import { templatePrint } from '@/utils/czbUtil'
import pagination from '@crud/Pagination'

const defaultQuery = {
  weighDate: null,
  prodId: null,
  prodName: null,
  warehouseId: null,
  warehouseName: null,
  supplierId: null,
  supplierName: null,
  custId: null,
  custName: null,
  operator: null,
  operatorId: null,
  operatorName: null,
  poundName: null,
  billType: null
}

export default {
  name: 'weighdetailall',
  components: {
    WarehousePicker,
    SupplierPicker,
    ProdPicker,
    CustPicker,
    UserPicker,
    pagination
  },
  mixins: [presenter(), header(), crud()],
  dicts: ['bill_type', 'bill_status'],
  cruds() {
    return CRUD({
      title: '查询称重所有明细',
      url: 'api/weighSummary/detailAll',
      idField: 'id',
      sort: 'id,desc'
    })
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
      },
      printLoading: false,
      billStatus: null,
      createBillLoading: false
    }
  },
  mounted() {},
  created() {
      this.gettingData();
    },
  methods: {
    [CRUD.HOOK.beforeRefresh]() {
      return false
    },
    checkStatus(row) {
      return row.billStatus === '1'
    },
    resetQuery() {
      this.query = { ...defaultQuery }
      this.billStatus = null
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
    transCompany(row) {
      if (row.billType === '1') {
        // 采购入库
        return row.supplierInfo.name
      } else {
        // 销售出库
        return row.custInfo.name
      }
    },
    getList() {
      this.loading = true
      const params = {
        ...this.query,
        page: this.pageNo,
        size: this.pageSize,
        billStatus: this.billStatus
      }
      collectDetailAll(params)
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
       this.refresh()
    },
    supplierResult(row) {
      this.query.supplierId = row.id
      this.query.supplierName = row.name
       this.refresh()
    },
    prodResult(row) {
      this.query.prodId = row.id
      this.query.prodName = row.name
       this.refresh()
    },
    custResult(row) {
      this.query.custId = row.id
      this.query.custName = row.name
       this.refresh()
    },
    userResult(row) {
      this.query.operator = row.username
      this.query.operatorName = row.nickName
       this.refresh()
    },
    createUpOrder() {
      this.createBillLoading = true
      const ids = this.crud.selections.map((val) => val.id).join(',')
      createUpOrder(ids)
        .then((result) => {
          this.createBillLoading = false
          this.$message({
            message: '生单成功',
            type: 'success'
          })
          this.refresh()
          this.$emit('refreshList')
        })
        .catch((e) => {
          this.createBillLoading = false
        })
    },
    printAction() {
      const params = {
        ...this.query,
        collectType: this.collectType
      }
      this.printLoading = true
      print(params)
        .then((result) => {
          templatePrint(result, '2')
            .then(() => {
              this.printLoading = false
              console.log('打印结束')
            })
            .catch((err) => {
              this.printLoading = false
              this.$message.error(err.message)
            })
        })
        .catch((err) => {
          this.printLoading = false
          console.log(err)
        })
    },
    gettingData(){
      this.query.poundName = this.$route.query.pound_name;
      this.query.weighDate =  this.$route.query.weigh_date;
      this.billStatus = this.$route.query.bill_status;
      this.refresh()
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

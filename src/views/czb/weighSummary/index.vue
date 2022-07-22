<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div>
        <!-- 搜索 -->
        <label class="el-form-item-label">汇总方式</label>
        <el-select
          v-model="collectType"
          size="small"
          placeholder="汇总方式"
          class="filter-item"
          style="width: 185px"
          @change="tableData = []"
        >
          <el-option label="按产品汇总" :value="1" />
          <el-option label="按往来单位汇总" :value="2" />
          <el-option label="按司磅员汇总" :value="3" />
          <el-option label="按日期汇总" :value="4" />
          <el-option label="按仓库汇总" :value="5" />
          <el-option label="按磅台汇总" :value="6" />
        </el-select>
        <template v-if="collectType == '2'">
          <label class="el-form-item-label">单据类型:</label>
          <el-select
            v-model="billType"
            clearable
            size="small"
            placeholder="单据类型"
            class="filter-item"
            style="width: 185px"
            @change="tableData = []"
          >
            <el-option
              v-for="item in dict.bill_type"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
        <label class="el-form-item-label">单据状态</label>
        <el-select
          v-model="billStatus"
          size="small"
          placeholder="单据状态"
          class="filter-item"
          style="width: 185px"
          @change="tableData = []"
        >
          <el-option
            v-for="item in dict.bill_status"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button
          class="filter-item"
          size="mini"
          type="success"
          icon="el-icon-search"
          @click="refresh"
        >搜索
        </el-button>
      </div>

      <el-table
        ref="table"
        v-loading="loading"
        :data="tableData"
        size="small"
        style="padding-top: 10px"
      >
        <!--        <el-table-column type="selection" width="55"/>-->
        <!--        <el-table-column prop="id" label="称重记录id" />-->
        <el-table-column prop="weighDate" label="称重日期" />
        <el-table-column prop="billType" label="单据类型">
          <template slot-scope="scope">
            {{ dict.label.bill_type[scope.row.billType] }}
          </template>
        </el-table-column>
        <el-table-column prop="poundName" label="磅台" />
        <el-table-column prop="prodName" label="产品" />
        <el-table-column label="往来单位" :formatter="transCompany" />
        <el-table-column prop="warehouseName" label="仓库" />
        <el-table-column prop="operatorName" label="司磅员" />
        <el-table-column prop="weight" label="重量" />
        <el-table-column prop="unit" label="单位" />
        <el-table-column label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="showDetail(scope.row)"
            >查看明细
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
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
      <IndexDetail ref="indexDetail" @refreshList="refresh" />
    </div>
  </div>
</template>

<script>
import CRUD, { presenter, header, crud } from '@crud/crud'
import { collect } from '@/api/czb/weighSummary'
import IndexDetail from '@/views/czb/weighSummary/indexDetail'

export default {
  name: 'Weigh',
  components: { IndexDetail },
  mixins: [presenter(), header(), crud()],
  dicts: ['bill_type', 'bill_status'],
  cruds() {
    return CRUD({
      title: '称重汇总及明细',
      url: 'api/weighSummary',
      idField: 'id',
      sort: 'id,desc'
    })
  },
  data() {
    return {
      collectType: 1,
      billStatus: '1',
      billType: '1',
      tableData: [],
      pageNo: 0,
      pageSize: 10,
      totalItem: 0,
      loading: false
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return false
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
        collectType: this.collectType,
        billStatus: this.billStatus,
        billType: this.billType,
        page: this.pageNo,
        size: this.pageSize
      }
      collect(params)
        .then(response => {
          this.loading = false
          this.totalItem = response.totalElements
          this.tableData = response.content
        })
        .catch(e => {
          this.loading = false
        })
    },
    transCompany(row) {
      if (row.billType === '1') {
        // 采购入库
        return row.supplierName
      } else {
        // 销售出库
        return row.custName
      }
    },
    showDetail(row) {
      const value = {}
      // 汇总类型 1按产品汇总2按往来单位汇总3按司磅员汇总4按日期汇总5按仓库汇总6按磅台汇总
      switch (this.collectType) {
        case 1:
          // 1按产品汇总
          value.id = row.prodId
          value.label = row.prodName
          break
        case 2:
          // 2按往来单位汇总
          value.billType = row.billType
          // 单据类型 1：采购入库 2：销售出库
          if (row.billType === '1') {
            value.id = row.supplierId
            value.label = row.supplierName
          } else {
            value.id = row.custId
            value.label = row.custName
          }
          break
        case 3:
          // 3按司磅员汇总
          value.id = row.operatorId
          value.label = row.operatorName
          break
        case 4:
          // 4按日期汇总
          value.label = row.weighDate
          break
        case 5:
          // 5按仓库汇总
          value.id = row.warehouseId
          value.label = row.warehouseName
          break
        case 6:
          // 6按磅台汇总
          value.label = row.poundName
          break
        default:
          break
      }
      this.$refs.indexDetail.open(this.collectType, value, this.billStatus)
    }
  }
}
</script>

<style scoped></style>

<template>
  <div class="wrapper">
    <h4>汇总方式</h4>
    <div class="query">
      <el-radio-group v-model="collectType" @change="tableData = []">
        <el-radio :label="1">按产品汇总</el-radio>
        <el-radio :label="2">按往来单位汇总</el-radio>
        <el-radio :label="3">按仓库汇总</el-radio>
        <el-radio :label="4">按日期汇总</el-radio>
      </el-radio-group>
      <el-button
        class="search-btn"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="refresh"
      >搜索</el-button>
    </div>

    <el-table ref="table" v-loading="loading" :data="tableData" size="small">
      <el-table-column v-if="collectType === 1" prop="prodName" label="产品" align="center" />
      <el-table-column v-if="collectType === 3" prop="warehouseName" label="仓库" align="center" />
      <el-table-column v-if="collectType === 4" prop="billDate" label="日期" align="center" />
      <el-table-column v-if="collectType === 2" :prop="billType === 1?'supplierName':'custName'" :label="billType === 1?'供应商':'客户'" align="center" />

      <el-table-column prop="weight" label="重量合计" align="center" />
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="showDetail(scope.row)"
          >查看明细</el-button>
        </template>
      </el-table-column>
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
    <StockInAndOutCollectDetail ref="stockInAndOutCollectDetail" :bill-type="billType" />
  </div>
</template>
<script>
import { collect } from '@/api/czb/bill'
import StockInAndOutCollectDetail from './StockInAndOutCollectDetail'

export default {
  components: {
    StockInAndOutCollectDetail
  },
  props: {
    billType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      collectType: 1,
      tableData: [],
      pageNo: 0,
      pageSize: 10,
      totalItem: 0,
      loading: false
    }
  },
  mounted() {

  },
  methods: {
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
        billType: this.billType,
        page: this.pageNo,
        size: this.pageSize
      }
      collect(params).then(
        (response) => {
          this.loading = false
          this.totalItem = response.totalElements
          this.tableData = response.content
        }
      ).catch(e => {
        this.loading = false
        console.log(e)
      })
    },
    showDetail(row) {
      const value = {}

      // 汇总类型 1：按产品 2：按往来单位 3：按仓库 4：按日期
      switch (this.collectType) {
        case 1:
        // 按产品
          value.id = row.prodId
          value.label = row.prodName
          break
        case 2:
        // 按往来单位
        // 单据类型 1：采购入库 2：销售出库
          if (this.billType === 1) {
            value.id = row.supplierId
            value.label = row.supplierName
          } else {
            value.id = row.custId
            value.label = row.custName
          }

          break
        case 3:
        // 按仓库
          value.id = row.warehouseId
          value.label = row.warehouseName
          break
        case 4:
        // 按日期
          value.label = row.billDate
          break

        default:
          break
      }

      this.$refs.stockInAndOutCollectDetail.open(this.collectType, value)
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  padding: 15px;
  .query {
    margin-bottom: 15px;
    .search-btn {
      margin-left: 20px;
    }
  }
}
</style>

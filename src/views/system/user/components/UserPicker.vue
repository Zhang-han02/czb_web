<template>
  <el-dialog
    title="用户选择"
    :visible.sync="dialogVisible"
    width="900px"
    append-to-body
  >
    <div>
      <div>

        <label class="el-form-item-label">名称</label>
        <el-input v-model="query.blurry" clearable placeholder="输入名称搜索" style="width: 185px;" class="filter-item" @keyup.enter.native="refresh" />

        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="refresh">搜索</el-button>
      </div>
      <el-table ref="table" v-loading="loading" :data="tableData" size="small" style="width: 100%;margin:15px 0;" highlight-current-row @current-change="handleCurrentChange">
        <el-table-column :show-overflow-tooltip="true" prop="username" label="用户名" />
        <el-table-column :show-overflow-tooltip="true" prop="nickName" label="姓名" />
        <el-table-column prop="gender" label="性别" />
        <el-table-column :show-overflow-tooltip="true" prop="phone" width="100" label="电话" />
        <el-table-column :show-overflow-tooltip="true" width="135" prop="userNum" label="职员编号" />
        <el-table-column :show-overflow-tooltip="true" prop="dept" label="部门">
          <template slot-scope="scope">
            <div>{{ scope.row.dept.name }}</div>
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
    </div>
    <span slot="footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </span>
  </el-dialog>

</template>
<script>
import { list } from '@/api/system/user'

export default {
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      pageNo: 0,
      pageSize: 10,
      totalItem: 0,
      query: {
        blurry: ''
      },
      loading: false,
      currentRow: null
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    open() {
      this.dialogVisible = true
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
        enabled: true,
        page: this.pageNo,
        size: this.pageSize,
        sort: 'id,desc'
      }
      list(params).then(
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
    handleCurrentChange(val) {
      this.currentRow = val
    },
    submit() {
      if (!this.currentRow) {
        this.$message.error('请选择记录')
        return
      }

      this.$emit('result', this.currentRow)
      this.dialogVisible = false
      this.$refs.table.setCurrentRow(null)
    }
  }
}
</script>

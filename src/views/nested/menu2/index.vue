<template>
  <div style="padding:30px;">
    <el-alert :closable="false" title="二级菜单" />
    <el-button type="primary" size="default" @click="preview">预览</el-button>

    <el-dialog
      title="预览"
      :visible.sync="previewVisible"
      width="60%"
      fullscreen
    >
      <div>
        <div ref="bill" class="bill">
          <h1 class="title">销售订单</h1>
          <div>
            仓库：仓库一号
          </div>
          <table width="100%" class="table" border="1" cellspacing="0">
            <tr>
              <th>姓名</th>
              <th>年龄</th>
              <th>性别</th>
            </tr>
            <tr v-for="(item,index) in tableData" :key="index">
              <td>{{ item.name }}</td>
              <td>{{ item.age }}</td>
              <td>{{ item.sex }}</td>
            </tr>
          </table>
        </div>
      </div>
      <span slot="footer">
        <el-button @click=" previewVisible = false">Cancel</el-button>
        <el-button type="primary" @click="print">Print</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
export default {
  data() {
    return {
      previewVisible: false,
      tableData: []
    }
  },
  mounted() {
    for (let i = 0; i < 100; i++) {
      this.tableData.push({
        name: '张三',
        age: '19',
        sex: '男'
      })
    }
  },
  methods: {
    preview() {
      this.previewVisible = true
    },
    print() {
      window.print()
    }
  }
}
</script>
<style lang="scss" scoped>
.bill{
  padding: 10px;
}
.title{
  text-align: center;
}
.table{
  margin-top: 10px;
  tr {
    text-align: center;
  }
}
</style>

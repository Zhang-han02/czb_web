<template>
  <el-dialog
    :visible.sync="visible"
    :width="width+'mm'"
    @close="hideModal"
  >
    <div id="preview_content" v-loading="spinning" class="main-view" />
    <template slot="title">
      <div class="title">
        <div style="margin-right: 20px">打印预览</div>
        <el-button :loading="waitShowPrinter" type="primary" size="small" @click.stop="print">打印</el-button>
        <el-button type="primary" size="small" @click.stop="toPdf">pdf</el-button>
      </div>
    </template>
    <template slot="footer">
      <el-button type="default" size="small" @click="hideModal">
        关闭
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'PrintPreview',
  props: {},
  data() {
    return {
      visible: false,
      spinning: true,
      waitShowPrinter: false,
      // 纸张宽 mm
      width: 0,
      // 模板
      hiprintTemplate: {},
      // 数据
      printData: {}
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    hideModal() {
      this.visible = false
    },
    show(hiprintTemplate, printData, width = '220') {
      this.visible = true
      this.spinning = true
      this.width = width
      this.hiprintTemplate = hiprintTemplate
      this.printData = printData
      setTimeout(() => {
        // eslint-disable-next-line no-undef
        $('#preview_content').html(hiprintTemplate.getHtml(printData))
        this.spinning = false
      }, 500)
    },
    print() {
      this.waitShowPrinter = true
      this.hiprintTemplate.print(this.printData, {}, {
        callback: () => {
          console.log('callback')
          this.waitShowPrinter = false
        }
      })
    },
    toPdf() {
      this.hiprintTemplate.toPdf({}, '打印预览')
    }
  }
}

</script>
<style lang="scss" scoped>
.main-view{
  min-height: 100px;
  box-sizing: border-box;
}
.title{
  display: flex;
  flex-direction: row;
  align-items: center;
}

</style>

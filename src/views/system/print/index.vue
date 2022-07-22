<template>
  <div class="wrap">
    <div class="header">
      <label class="space">模板类型</label>
      <el-select ref="templateKey" v-model="templateKey" filterable placeholder="请选择" size="small" class="space" @change="templateKeyChange">
        <el-option
          v-for="item in dict.print_template_type"
          :key="item.id"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-radio-group v-model="curPaper.type" class="space" @change="setPaper">
        <el-radio-button v-for="(value,type) in paperTypes" :key="type" :label="type">
          {{ type }}
        </el-radio-button>
      </el-radio-group>

      <template v-if="curPaper.type == '自定义'">
        <el-input v-model="curPaper.width" placeholder="宽" size="small" style="width:80px" @change="setPaper" />
        -
        <el-input v-model="curPaper.height" placeholder="高" size="small" style="width:80px" class="space" @change="setPaper" />
      </template>

      <el-button type="success" size="small" class="space" @click="preView">预览</el-button>
      <el-popconfirm
        title="是否确认清空?"
        confirm-button-type="danger"
        confirm-button-text="确定清空"
        @confirm="clearPaper"
      >
        <el-button slot="reference" type="danger" size="small">清空</el-button>
      </el-popconfirm>
      <!-- <el-button type="primary" size="small" @click="print">直接打印</el-button> -->
      <el-button v-permission="['admin','printTemplate:add']" type="primary" size="small" :loading="submitLoading" style="margin-left:20px;" @click="saveTemplate">保存模板</el-button>

    </div>
    <el-row :gutter="8">
      <el-col :span="4" :offset="0">
        <el-card style="height: 100vh">
          <el-row>
            <el-col :span="24" class="rect-printElement-types">
              <el-row>
                <div class="hiprintEpContainer" />
              </el-row>
              <el-row class="drag_item_title">基础组件</el-row>
              <el-row style="height: 100px;">
                <el-col :span="12" class="drag_item_box">
                  <div>
                    <a class="ep-draggable-item" tid="defaultModule.text" style>
                      <svg-icon icon-class="ic_text" class-name="icon" />
                      <p class="glyphicon-class">文本</p>
                    </a>
                  </div>
                </el-col>
                <el-col :span="12" class="drag_item_box" tid="defaultModule.text">
                  <div>
                    <a class="ep-draggable-item" tid="defaultModule.longText">
                      <svg-icon icon-class="ic_longText" class-name="icon" />
                      <p class="glyphicon-class">长文</p>
                    </a>
                  </div>
                </el-col>
              </el-row>
              <el-row style="height: 100px;">
                <el-col :span="12" class="drag_item_box" tid="defaultModule.text">
                  <div>
                    <a class="ep-draggable-item" tid="defaultModule.image" style>
                      <svg-icon icon-class="ic_image" class-name="icon" />
                      <p class="glyphicon-class">图片</p>
                    </a>
                  </div>
                </el-col>
                <el-col :span="12" class="drag_item_box" tid="defaultModule.text">
                  <div>
                    <a class="ep-draggable-item" tid="defaultModule.tableCustom" style>
                      <svg-icon icon-class="ic_tableCustom" class-name="icon" />
                      <p class="glyphicon-class">表格</p>
                    </a>
                  </div>
                </el-col>
              </el-row>
              <el-row class="drag_item_title">辅助</el-row>
              <el-row style="height: 100px;">
                <el-col :span="12" class="drag_item_box" tid="defaultModule.text">
                  <div>
                    <a class="ep-draggable-item" tid="defaultModule.hline" style>
                      <svg-icon icon-class="ic_hline" class-name="icon" />
                      <p class="glyphicon-class">横线</p>
                    </a>
                  </div>
                </el-col>
                <el-col :span="12" class="drag_item_box" tid="defaultModule.text">
                  <div>
                    <a class="ep-draggable-item" tid="defaultModule.vline" style>
                      <svg-icon icon-class="ic_vline" class-name="icon" />
                      <p class="glyphicon-class">竖线</p>
                    </a>
                  </div>
                </el-col>
              </el-row>
              <el-row style="height: 100px;">
                <el-col :span="12" class="drag_item_box" tid="defaultModule.text">
                  <div>
                    <a class="ep-draggable-item" tid="defaultModule.rect">
                      <svg-icon icon-class="ic_rect" class-name="icon" />
                      <p class="glyphicon-class">矩形</p>
                    </a>
                  </div>
                </el-col>
                <el-col :span="12" class="drag_item_box" tid="defaultModule.text">
                  <div>
                    <a class="ep-draggable-item" tid="defaultModule.oval">
                      <svg-icon icon-class="ic_oval" class-name="icon" />
                      <p class="glyphicon-class">椭圆</p>
                    </a>
                  </div>
                </el-col>
              </el-row>

            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="15" :offset="0">
        <el-card class="card-design">
          <div id="hiprint-printTemplate" class="hiprint-printTemplate" />
        </el-card>
      </el-col>
      <el-col :span="5" :offset="0">
        <el-card>
          <el-row class="hinnn-layout-sider">
            <div id="PrintElementOptionSetting" />
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <!-- 预览 -->
    <print-preview ref="preView" />
  </div>
</template>

<script>
import { defaultElementTypeProvider as DefaultElementTypeProvider, hiprint } from 'vue-plugin-hiprint'

let hiprintTemplate
import printData from './print-test-data'
import printPreview from './preview'
import providers from './providers'
import { detail, save } from '@/api/system/printTemplate'

let curTemplateKey = '1'
const defaultPager = {
  type: 'A4',
  width: 210,
  height: 296.6
}

export default {
  name: 'Print',
  components: { printPreview },
  data() {
    return {
      templateKey: curTemplateKey,
      submitLoading: false,
      curPaper: {
        ...defaultPager
      },
      paperTypes: {
        'A3': {
          width: 420,
          height: 296.6
        },
        'A4': {
          width: 210,
          height: 296.6
        },
        'A5': {
          width: 210,
          height: 147.6
        },
        'B3': {
          width: 500,
          height: 352.6
        },
        'B4': {
          width: 250,
          height: 352.6
        },
        'B5': {
          width: 250,
          height: 175.6
        },
        '自定义': {
          width: 220,
          height: 80
        }
      },
      templateJson: {},
      form: {
      }
    }
  },
  computed: {

  },
  dicts: ['print_template_type'],
  mounted() {
    this.getDetail()
  },
  methods: {
    templateKeyChange() {
      if (this.templateKey !== curTemplateKey && this.form.content !== JSON.stringify(hiprintTemplate.getJsonTid())) {
        this.$confirm('您有修改没有保存，确定丢弃修改吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.switchTemplateType()
        }).catch(() => {
          // 取消
          this.templateKey = curTemplateKey
          this.$refs.templateKey.blur()
        })
      } else {
        this.switchTemplateType()
      }
    },
    switchTemplateType() {
      curTemplateKey = this.templateKey
      this.getDetail()
      this.$refs.templateKey.blur()
    },
    saveTemplate() {
      this.form.paperType = this.curPaper.type
      this.form.paperWidth = this.curPaper.width
      this.form.paperHeight = this.curPaper.height
      this.form.content = JSON.stringify(hiprintTemplate.getJsonTid())
      this.$confirm('确定保存该设置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submitLoading = true
        save(this.form).then((result) => {
          this.submitLoading = false
          this.$notify({
            title: '成功',
            message: '保存配置成功',
            type: 'success'
          })
          this.getDetail()
        }).catch((err) => {
          this.submitLoading = false
          console.log(err)
        })
      }).catch(() => {

      })
    },
    getDetail() {
      detail({ key: this.templateKey }).then((result) => {
        this.form = result
        if (result.paperType) {
          this.curPaper = {
            type: result.paperType,
            width: result.paperWidth,
            height: result.paperHeight
          }
        } else {
          this.curPaper = { ...defaultPager }
        }

        if (result.content) {
          this.templateJson = JSON.parse(result.content)
        } else {
          this.templateJson = {}
        }
        this.initHiPrint()
      }).catch((err) => {
        console.log(err)
        this.initHiPrint()
      })
    },
    initHiPrint() {
      hiprint.init({
        providers: [providers[0].f, new DefaultElementTypeProvider()]
      })
      // 还原配置
      hiprint.setConfig()
      // 替换配置
      hiprint.setConfig({
        movingDistance: 2.5,
        text: {
          supportOptions: [
            {
              name: 'styler',
              hidden: true
            },
            {
              name: 'formatter',
              hidden: true
            }
          ]
        }
      })
      // eslint-disable-next-line no-undef
      $('.hiprintEpContainer').empty()
      hiprint.PrintElementTypeManager.build('.hiprintEpContainer', providers[0].value)
      hiprint.PrintElementTypeManager.buildByHtml($('.ep-draggable-item'))

      $('#hiprint-printTemplate').empty()
      hiprintTemplate = new hiprint.PrintTemplate({
        template: this.templateJson,
        settingContainer: '#PrintElementOptionSetting',
        paginationContainer: '.hiprint-printPagination'
      })
      hiprintTemplate.design('#hiprint-printTemplate')
    },

    /**
     * 设置纸张大小
     * @param type [A3, A4, A5, B3, B4, B5, other]
     * @param value {width,height} mm
     */
    setPaper() {
      const type = this.curPaper.type

      try {
        let value
        if (type !== '自定义') {
          value = this.paperTypes[type]
          this.curPaper = { ...value, type }
        } else {
          value = this.curPaper
        }
        hiprintTemplate.setPaper(value.width, value.height)
      } catch (error) {
        this.$message.error(`操作失败: ${error}`)
      }
    },

    preView() {
      this.$refs.preView.show(hiprintTemplate, printData[this.templateKey])
    },
    print() {
      if (window.hiwebSocket.opened) {
        const printerList = hiprintTemplate.getPrinterList()
        console.log(printerList)
        hiprintTemplate.print2(printData[this.templateKey], { printer: '', title: 'hiprint测试打印' })
        return
      }
      this.$message.error('客户端未连接,无法直接打印')
    },
    clearPaper() {
      try {
        hiprintTemplate.clear()
      } catch (error) {
        this.$message.error(`操作失败: ${error}`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap{
    padding: 10px;
    .header{
      margin-bottom: 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
      .space{
        margin-right: 10px;
      }
    }
}
// 拖拽
.drag_item_box {
  height: 100%;
  padding: 6px;
}

.drag_item_box > div {
  height: 100%;
  width: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.drag_item_box > div > a {
  text-align: center;
  text-decoration-line: none;
}

.drag_item_box > div > a > span {
  font-size: 28px;
}

.drag_item_box > div > a > p {
  margin: 0;
}

.drag_item_title {
  font-size: 16px;
  padding: 12px 6px 0 6px;
  font-weight: bold;
}

// 设计容器
.card-design {
  overflow: hidden;
  overflow-x: auto;
  overflow-y: auto;
}
.icon{
  font-size: 30px;
  margin-bottom: 10px;
}

</style>
<style lang="scss">
// 默认图片
.hiprint-printElement-image-content {
  img {
    content: url("~@/assets/hi.png");
  }
}
// build 拖拽
.hiprintEpContainer .hiprint-printElement-type li ul li a {
  padding: 4px 4px !important;
  color: #1296db !important;
  line-height: 1 !important;
  height: auto !important;
  text-overflow: ellipsis;
  font-size: 13px;
}
.hiprint-printElement-type .title{
  text-align: left !important;
  color: black !important;
  font-weight:700;
  margin-bottom: 10px !important;
}
</style>

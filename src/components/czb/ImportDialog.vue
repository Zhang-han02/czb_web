<template>
  <div class="wrapper">
    <el-button type="success" size="mini" icon="el-icon-upload2" class="filter-item" @click="show">导入</el-button>

    <el-dialog
      title="导入"
      :visible.sync="uploadDialog"
      width="600px"
      :before-close="cancelUpload"
      append-to-body
    >
      <div class="upload-body column-center">
        <el-upload
          ref="uploadExcel"
          v-loading="uploadLoading"
          :action="uploadUrl"
          :show-file-list="false"
          drag
          :file-list="files"
          name="excel"
          :multiple="false"
          :before-upload="beforeUpload"
          :on-success="handleUploadSuccess"
          :headers="headers"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip column-center">
            <h3>选择文件后自动导入</h3>
            <el-link type="primary" :underline="true" :href="templateUrl" target="_blank">模板文件</el-link>
          </div>
        </el-upload>
        <el-radio-group v-show="showImportModel" v-model="importModel" style="margin-top:30px">
          <el-radio v-for="item in dict.import_model" :key="item.id" :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="uploadDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'

export default {
  props: {
    uploadApi: {
      type: String,
      default: ''
    },
    templateName: {
      type: String,
      default: ''
    },
    classType: {
      type: String,
      default: null
    },
    showImportModel: {
      type: Boolean,
      default: true
    }

  },
  data() {
    return {
      uploadDialog: false,
      uploadLoading: false,
      files: [],
      importModel: '2'
    }
  },
  computed: {
    uploadUrl() {
      return `${this.$baseUrl + this.uploadApi}?importModel=${this.importModel}&classType=${this.classType}`
    },
    headers() {
      return {
        Authorization: getToken()
      }
    },
    templateUrl() {
      return process.env.VUE_APP_BASE_API + 'excel/' + encodeURIComponent(this.templateName)
    }
  },
  dicts: ['import_model'],
  methods: {
    show() {
      this.uploadDialog = true
    },
    beforeUpload(file) {
      const name = file.name.toLowerCase().split('.')
      const type = name[name.length - 1]
      const isExcel = type === 'xls' || type === 'xlsx'

      if (!isExcel) {
        this.$message.error('只能导入 Excel表格 文件!')
      } else {
        this.uploadLoading = true
      }

      return isExcel
    },
    cancelUpload(done) {
      this.$refs.uploadExcel.abort()
      this.files = []
      this.uploadLoading = false
      done()
    },
    handleUploadSuccess(response, file, fileList) {
      this.files = []
      this.uploadLoading = false

      this.$message({
        showClose: true,
        message: '导入成功',
        type: 'success'
      })
      this.uploadDialog = false
      this.$emit('importSuccess')
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  display: inline-block;
}

  .column-center{
      display: flex;
      flex-direction: column;
      align-items: center;
  }
</style>

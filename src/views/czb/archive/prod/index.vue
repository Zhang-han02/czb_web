<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="9" :sm="6" :md="5" :lg="4" :xl="4">
        <SideClassTree ref="sideClassTree" :type="classType" @nodeClick="nodeClick" />
      </el-col>
      <el-col :xs="15" :sm="18" :md="19" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
            <label class="el-form-item-label">产品编号</label>
            <el-input v-model="query.prodNum" clearable placeholder="产品编号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
            <label class="el-form-item-label">产品名称</label>
            <el-input v-model="query.name" clearable placeholder="产品名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
            <label class="el-form-item-label">状态</label>
            <el-select
              v-model="query.enabled"
              clearable
              size="small"
              placeholder="状态"
              class="filter-item"
              style="width: 185px"
              @change="crud.toQuery"
            >
              <el-option
                v-for="item in dict.enable_status"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <rrOperation :crud="crud" />
          </div>
          <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
          <crudOperation :permission="permission">
            <template v-slot:right>
              <import-dialog v-permission="['admin','prod:add']" upload-api="api/prod/importExcel" template-name="产品档案导入模板.xlsx" @importSuccess="crud.toQuery()" />
              <ClassTreeManage :type="classType" @refreshTree="refreshTree" />
              <el-button
                v-if="crud.optShow.add"
                v-permission="permission.add"
                :loading = "importstatus"
                class="filter-item"
                size="mini"
                type="primary"
                icon="el-icon-document-add"
                @click="selectImport()"
              >
                导入ERP数据
               </el-button>
            </template>
            
          </crudOperation>
          <!--表单组件-->
          <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="800px">
            <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px" inline>
              <el-form-item label="产品名称" prop="name">
                <el-input v-model="form.name" style="width: 280px;" />
              </el-form-item>
              <el-form-item label="产品编号" prop="prodNum">
                <el-input v-model="form.prodNum" style="width: 280px;" />
              </el-form-item>
              <el-form-item label="分类" prop="classInfo" required>

                <Treeselect
                  v-model="form.classInfo.id"
                  :options="classes"
                  style="width: 280px;"
                  placeholder="选择分类"
                  no-options-text="暂无数据"
                />
              </el-form-item>

              <el-form-item label="规格" prop="specification">
                <el-input v-model="form.specification" style="width: 280px;" />
              </el-form-item>
              <el-form-item label="型号" prop="model">
                <el-input v-model="form.model" style="width: 280px;" />
              </el-form-item>
              <el-form-item label="基本单位" prop="baseUnit">
                <el-input v-model="form.baseUnit" style="width: 280px;" />
              </el-form-item>
              <el-form-item label="辅助单位1">
                <el-input v-model="form.unit1" style="width: 280px;" />
              </el-form-item>
              <el-form-item label="辅助单位2">
                <el-input v-model="form.unit2" style="width: 280px;" />
              </el-form-item>
              <el-form-item label="状态" prop="enabled">
                <div style="width: 280px;">
                  <el-radio v-for="item in dict.enable_status" :key="item.id" v-model="form.enabled" :label="item.value">{{ item.label }}</el-radio>
                </div>

              </el-form-item>
              <el-form-item label="备注1">
                <el-input v-model="form.remark1" :rows="3" type="textarea" style="width: 280px;" />
              </el-form-item>
              <el-form-item label="备注2">
                <el-input v-model="form.remark2" :rows="3" type="textarea" style="width: 280px;" />
              </el-form-item>
              <el-form-item label="备注3">
                <el-input v-model="form.remark3" :rows="3" type="textarea" style="width: 280px;" />
              </el-form-item>
              <el-form-item label="备注4">
                <el-input v-model="form.remark4" :rows="3" type="textarea" style="width: 280px;" />
              </el-form-item>
              <el-form-item label="备注5">
                <el-input v-model="form.remark5" :rows="3" type="textarea" style="width: 280px;" />
              </el-form-item>
              <el-form-item label="备注6">
                <el-input v-model="form.remark6" :rows="3" type="textarea" style="width: 280px;" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="text" @click="crud.cancelCU">取消</el-button>
              <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
            </div>
          </el-dialog>
          <!--表格渲染-->
          <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
            <el-table-column type="selection" width="55" />

            <el-table-column prop="prodNum" label="产品编号" />
            <el-table-column prop="name" label="产品名称" />
            <el-table-column prop="classInfo.name" label="分类" />
            <el-table-column prop="specification" label="规格" />
            <el-table-column prop="model" label="型号" />
            <el-table-column prop="baseUnit" label="基本单位" />
            <el-table-column prop="enabled" label="状态">
              <template slot-scope="scope">
                {{ dict.label.enable_status[scope.row.enabled] }}
              </template>
            </el-table-column>
            <el-table-column prop="remark1" label="备注1" />
            <el-table-column prop="remark2" label="备注2" />
            <el-table-column prop="updateTime" label="更新时间" width="180" />
            <el-table-column v-if="checkPer(['admin','prod:edit','prod:del'])" label="操作" width="150px" align="center">
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import crudProd from '@/api/czb/prod'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import SideClassTree from '@/views/czb/archive/classTree/components/SideClassTree'
import ClassTreeManage from '@/views/czb/archive/classTree/components/ClassTreeManage'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { loadClassTree, getAllTreeNodes } from '@/utils/czbUtil'
import ImportDialog from '@/components/czb/ImportDialog'
import { importData } from '@/api/czb/prod'

const defaultForm = { id: null, classInfo: { id: null }, prodNum: null, name: null, specification: null, model: null, baseUnit: null, unit1: null, unit2: null, enabled: 'true', remark1: null, remark2: null, remark3: null, remark4: null, remark5: null, remark6: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'Prod',
  components: { pagination, crudOperation, rrOperation, udOperation, SideClassTree, ClassTreeManage, Treeselect, ImportDialog },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['enable_status'],
  cruds() {
    return CRUD({ title: '产品档案', url: 'api/prod', idField: 'id', sort: 'id,desc', crudMethod: { ...crudProd }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'prod:add'],
        edit: ['admin', 'prod:edit'],
        del: ['admin', 'prod:del']
      },
      rules: {
        prodNum: [
          { required: true, message: '产品编号不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '产品名称不能为空', trigger: 'blur' }
        ],
        specification: [
          { required: true, message: '规格不能为空', trigger: 'blur' }
        ],
        model: [
          { required: true, message: '型号不能为空', trigger: 'blur' }
        ],
        baseUnit: [
          { required: true, message: '基本单位不能为空', trigger: 'blur' }
        ],
        enabled: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'classIds', display_name: '分类id' },
        { key: 'prodNum', display_name: '产品编号' },
        { key: 'name', display_name: '产品名称' },
        { key: 'enabled', display_name: '状态：1启用、0禁用' }
      ],
      classes: [],
      classType: '1',
      importstatus: false,
      importFlag: false
    }
  },
  mounted() {
    this.getClassOptions()
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      form.enabled = form.enabled.toString()
    },
    [CRUD.HOOK.afterValidateCU](crud) {
      // 提交前做的操作
      if (!crud.form.classInfo.id) {
        this.$message({
          message: '分类不能为空',
          type: 'warning'
        })
        return false
      }
      return true
    },
    nodeClick(node) {
      this.query.classIds = getAllTreeNodes(node)
      this.crud.toQuery()
    },
    selectImport(){
      this.$confirm(`导入时是否只导入ERP新增内容?`, '提示', {
        confirmButtonText: '非覆盖导入',
        cancelButtonText: '覆盖导入',
        type: 'warning',
        distinguishCancelAndClose: true,    //设置为true才会把右上角X和取消区分开来
      }).then(() => {
        this.importData();
      }).catch(action => {
        if(action === "cancel"){
          this.UpdateImport();
        }
      })
    },
    //更新以及导入
    UpdateImport(){
      this.importFlag = true;
      this.importData();
    },
    importData(){
      this.importstatus = true
      importData(this.importFlag).then(
        (response) => {
          this.importstatus = false
          this.crud.toQuery()
          this.$refs.sideClassTree.getTree()
        }
      ).catch(e => {
        this.importstatus = false
        console.log(e)
      })
      
    },
    getClassOptions() {
      loadClassTree(this.classType).then(res => {
        this.classes = res
      }).catch(e => console.log(e))
    },
    refreshTree() {
      this.$refs.sideClassTree.getTree()
      this.getClassOptions()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .vue-treeselect__control,
::v-deep .vue-treeselect__placeholder,
::v-deep .vue-treeselect__single-value {
  height: 30px;
  line-height: 30px;
}
.dialogheight{
  height:100px;
}
</style>

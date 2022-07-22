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
            <label class="el-form-item-label">仓库编号</label>
            <el-input v-model="query.warehouseNum" clearable placeholder="仓库编号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
            <label class="el-form-item-label">仓库名称</label>
            <el-input v-model="query.name" clearable placeholder="仓库名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
              <import-dialog v-permission="['admin','warehouse:add']" upload-api="api/warehouse/importExcel" template-name="仓库档案导入模板.xlsx" @importSuccess="crud.toQuery()" />
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
              <el-form-item label="仓库名称" prop="name">
                <el-input v-model="form.name" style="width: 280px;" />
              </el-form-item>
              <el-form-item label="仓库编号" prop="warehouseNum">
                <el-input v-model="form.warehouseNum" style="width: 280px;" />
              </el-form-item>
              <el-form-item label="分类" prop="classId">

                <Treeselect
                  v-model="form.classId"
                  :options="classes"
                  style="width: 280px;"
                  placeholder="选择分类"
                  no-options-text="暂无数据"
                />
              </el-form-item>

              <el-form-item label="状态" prop="enabled">
                <el-radio v-for="item in dict.enable_status" :key="item.id" v-model="form.enabled" :label="item.value">{{ item.label }}</el-radio>
              </el-form-item>
              <el-form-item label="备注1">
                <el-input v-model="form.remark1" :rows="3" type="textarea" style="width: 280px;" />
              </el-form-item>
              <el-form-item label="备注2">
                <el-input v-model="form.remark2" :rows="3" type="textarea" style="width: 280px;" />
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

            <el-table-column prop="warehouseNum" label="仓库编号" />
            <el-table-column prop="name" label="仓库名称" />
            <el-table-column prop="classInfo.name" label="分类" />
            <el-table-column prop="remark1" label="备注1" />
            <el-table-column prop="enabled" label="状态">
              <template slot-scope="scope">
                {{ dict.label.enable_status[scope.row.enabled] }}
              </template>
            </el-table-column>

            <el-table-column prop="updateTime" label="更新时间" />
            <el-table-column v-if="checkPer(['admin','warehouse:edit','warehouse:del'])" label="操作" width="150px" align="center">
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
import crudWarehouse from '@/api/czb/warehouse'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

import SideClassTree from '@/views/czb/archive/classTree/components/SideClassTree'
import ClassTreeManage from '@/views/czb/archive/classTree/components/ClassTreeManage'
import { loadClassTree, getAllTreeNodes } from '@/utils/czbUtil'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import ImportDialog from '@/components/czb/ImportDialog'

const defaultForm = { id: null, classId: null, warehouseNum: null, name: null, enabled: 'true', remark1: null, remark2: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'Warehouse',
  components: { pagination, crudOperation, rrOperation, udOperation, SideClassTree, ClassTreeManage, Treeselect, ImportDialog },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['enable_status'],
  cruds() {
    return CRUD({ title: '仓库档案', url: 'api/warehouse', idField: 'id', sort: 'id,desc', crudMethod: { ...crudWarehouse }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'warehouse:add'],
        edit: ['admin', 'warehouse:edit'],
        del: ['admin', 'warehouse:del']
      },
      rules: {
        // classId: [
        //   { required: true, message: '分类不能为空', trigger: 'blur' }
        // ],
        warehouseNum: [
          { required: true, message: '仓库编号不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '仓库名称不能为空', trigger: 'blur' }
        ],
        enabled: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'classIds', display_name: '分类id' },
        { key: 'warehouseNum', display_name: '仓库编号' },
        { key: 'name', display_name: '仓库名称' },
        { key: 'enabled', display_name: '状态' }
      ],
      classType: '2',
      classes: [],
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

    nodeClick(node) {
      this.query.classIds = getAllTreeNodes(node)
      this.crud.toQuery()
    },
    getClassOptions() {
      loadClassTree(this.classType).then(res => {
        this.classes = res
      }).catch(e => console.log(e))
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
      crudWarehouse.importData(this.importFlag).then(
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
    refreshTree() {
      this.$refs.sideClassTree.getTree()
      this.getClassOptions()
    }
  }
}
</script>

<style scoped>

</style>

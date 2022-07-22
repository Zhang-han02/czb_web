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
            <label class="el-form-item-label">供应商编号</label>
            <el-input v-model="query.supplierNum" clearable placeholder="供应商编号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
            <label class="el-form-item-label">供应商名称</label>
            <el-input v-model="query.name" clearable placeholder="供应商名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
            <label class="el-form-item-label">联系人</label>
            <el-input v-model="query.contact" clearable placeholder="联系人" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
              <import-dialog v-permission="['admin','supplier:add']" upload-api="api/supplier/importExcel" template-name="供应商档案导入模板.xlsx" @importSuccess="crud.toQuery()" />
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
          <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="830px">
            <el-form ref="form" :model="form" :rules="rules" size="small" label-width="95px" inline>
              <el-form-item label="供应商名称" prop="name">
                <el-input v-model="form.name" style="width: 280px;" />
              </el-form-item>
              <el-form-item label="供应商编号" prop="supplierNum">
                <el-input v-model="form.supplierNum" style="width: 280px;" />
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

              <el-form-item label="联系人" prop="contact">
                <el-input v-model="form.contact" style="width: 280px;" />
              </el-form-item>
              <el-form-item label="联系地址">
                <el-input v-model="form.contactAddress" :rows="3" type="textarea" style="width: 280px;" />
              </el-form-item>
              <el-form-item label="联系电话" prop="contactMobile">
                <el-input v-model="form.contactMobile" style="width: 280px;" />
              </el-form-item>
              <el-form-item label="结算单位">
                <el-select
                  v-model="form.checkOutUnit"
                  filterable
                  remote
                  clearable
                  placeholder="请输入结算单位名称或编号"
                  :remote-method="checkOutRemoteMethod"
                  :loading="checkOutloading"
                  style="width: 280px;"
                >
                  <el-option
                    v-for="item in supplierOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
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

            <el-table-column prop="supplierNum" label="供应商编号" />
            <el-table-column prop="name" label="供应商名称" />
            <el-table-column prop="classInfo.name" label="分类" />
            <el-table-column prop="contact" label="联系人" />
            <el-table-column prop="contactAddress" label="联系地址" />
            <el-table-column prop="contactMobile" label="联系电话" />
            <el-table-column prop="checkOutUnitInfo.name" label="结算单位" />
            <el-table-column prop="enabled" label="状态">
              <template slot-scope="scope">
                {{ dict.label.enable_status[scope.row.enabled] }}
              </template>
            </el-table-column>
            <el-table-column prop="remark1" label="备注1" />
            <el-table-column prop="updateTime" label="更新时间" width="180" />
            <el-table-column v-if="checkPer(['admin','supplier:edit','supplier:del'])" label="操作" width="150px" align="center">
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
import crudSupplier from '@/api/czb/supplier'
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

const defaultForm = { id: null, classId: null, supplierNum: null, name: null, contact: null, contactAddress: null, contactMobile: null, checkOutUnit: null, enabled: 'true', remark1: null, remark2: null, remark3: null, remark4: null, remark5: null, remark6: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'Supplier',
  components: { pagination, crudOperation, rrOperation, udOperation, SideClassTree, ClassTreeManage, Treeselect, ImportDialog },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['enable_status'],
  cruds() {
    return CRUD({ title: '供应商档案', url: 'api/supplier', idField: 'id', sort: 'id,desc', crudMethod: { ...crudSupplier }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'supplier:add'],
        edit: ['admin', 'supplier:edit'],
        del: ['admin', 'supplier:del']
      },
      rules: {
        supplierNum: [
          { required: true, message: '供应商编号不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '供应商名称不能为空', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        contactMobile: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' }
        ],
        enabled: [
          { required: true, message: '状态：1启用、0禁用不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'classIds', display_name: '分类id' },
        { key: 'supplierNum', display_name: '供应商编号' },
        { key: 'name', display_name: '供应商名称' },
        { key: 'contact', display_name: '联系人' },
        { key: 'enabled', display_name: '状态：1启用、0禁用' }
      ],
      checkOutloading: false,
      supplierOptions: [],
      classes: [],
      classType: '4',
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
      if (this.form.checkOutUnit) {
        this.supplierOptions = [{ ...this.form.checkOutUnitInfo }]
      }
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
    refreshTree() {
      this.$refs.sideClassTree.getTree()
      this.getClassOptions()
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
      crudSupplier.importData(this.importFlag).then(
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
    checkOutRemoteMethod(query) {
      if (query) {
        this.checkOutloading = true
        crudSupplier.list({
          enabled: true,
          blurry: query,
          page: 0,
          size: 100
        }).then(res => {
          this.supplierOptions = res.content
          this.checkOutloading = false
        }).catch(e => {
          console.log(e)
          this.checkOutloading = false
        })
      } else {
        this.supplierOptions = []
      }
    }
  }
}
</script>

<style scoped>

</style>

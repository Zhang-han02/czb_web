<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">权限名称</label>
        <el-input v-model="query.name" clearable placeholder="权限名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">权限标识</label>
        <el-input v-model="query.tag" clearable placeholder="权限标识" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="权限标识" prop="tag">
            <el-input v-model="form.tag" style="width: 370px;" />
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
        <el-table-column prop="name" label="权限名称" />
        <el-table-column prop="tag" label="权限标识" />
        <el-table-column prop="createTime" label="创建日期" />
        <el-table-column v-if="checkPer(['admin','clientPermission:edit','clientPermission:del'])" label="操作" width="150px" align="center">
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
  </div>
</template>

<script>
import crudClientPermission from '@/api/czb/clientPermission'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, name: null, tag: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'ClientPermission',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '客户端权限', url: 'api/clientPermission', idField: 'id', sort: 'id,desc', crudMethod: { ...crudClientPermission }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'clientPermission:add'],
        edit: ['admin', 'clientPermission:edit'],
        del: ['admin', 'clientPermission:del']
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ],
        tag: [
          { required: true, message: '权限标识(唯一)不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '权限名称' },
        { key: 'tag', display_name: '权限标识(唯一)' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    [CRUD.HOOK.afterSubmit]() {
      this.notifyRefresh()
    },
    [CRUD.HOOK.afterDelete]() {
      this.notifyRefresh()
    },
    notifyRefresh() {
      this.$emit('refresh')
    }
  }
}
</script>

<style scoped>

</style>

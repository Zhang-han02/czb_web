<template>
  <div class="wrapper">
    <el-button
      type="primary"
      size="mini"
      icon="el-icon-setting"
      @click="classManageDialog = true"
    >分类管理</el-button>

    <el-dialog
      title="分类管理"
      :visible.sync="classManageDialog"
      width="80%"
      append-to-body
    >
      <div class="app-container">
        <!--工具栏-->
        <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->

            <el-select
              v-model="query.enabled"
              clearable
              size="small"
              placeholder="状态"
              class="filter-item"
              style="width: 90px"
              @change="crud.toQuery"
            >
              <el-option
                v-for="item in dict.enable_status"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <rrOperation />
          </div>
          <crudOperation :permission="permission">
            <template v-slot:right>
              <import-dialog upload-api="api/classTree/importExcel" template-name="分类导入模板.xlsx" :class-type="type" @importSuccess="crud.toQuery()" />
            </template>
          </crudOperation>
        </div>
        <!--表单组件-->
        <el-dialog
          append-to-body
          :close-on-click-modal="false"
          :before-close="crud.cancelCU"
          :visible.sync="crud.status.cu > 0"
          :title="crud.status.title"
          width="500px"
        >
          <el-form
            ref="form"
            inline
            :model="form"
            :rules="rules"
            size="small"
            label-width="80px"
          >
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="form.name" style="width: 370px" />
            </el-form-item>
            <el-form-item label="分类编号" prop="classNum">
              <el-input v-model="form.classNum" style="width: 370px" />
            </el-form-item>

            <el-form-item label="分类排序" prop="sort">
              <el-input-number
                v-model.number="form.sort"
                :min="0"
                :max="999"
                controls-position="right"
                style="width: 370px"
              />
            </el-form-item>

            <el-form-item label="状态" prop="enabled">
              <el-radio
                v-for="item in dict.enable_status"
                :key="item.id"
                v-model="form.enabled"
                :label="item.value"
              >{{ item.label }}</el-radio>
            </el-form-item>

            <el-form-item
              style="margin-bottom: 0"
              label="上级分类"
              prop="pid"
            >
              <treeselect
                v-model="form.pid"
                :options="classes"
                style="width: 370px"
                placeholder="选择上级类目"
                no-options-text="暂无数据"
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click="crud.cancelCU">取消</el-button>
            <el-button
              :loading="crud.status.cu === 2"
              type="primary"
              @click="crud.submitCU"
            >确认</el-button>
          </div>
        </el-dialog>
        <!--表格渲染-->
        <el-table
          ref="table"
          v-loading="crud.loading"
          :tree-props="{ children: 'children', label:'name' }"
          :data="crud.data"
          row-key="id"
          @select="crud.selectChange"
          @select-all="crud.selectAllChange"
          @selection-change="crud.selectionChangeHandler"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column label="名称" prop="name" />
          <el-table-column label="分类编号" prop="classNum" />
          <el-table-column label="排序" prop="sort" />
          <el-table-column label="状态" align="center" prop="enabled">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.enabled"
                active-color="#409EFF"
                inactive-color="#F56C6C"
                @change="changeEnabled(scope.row, scope.row.enabled)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建日期" />
          <el-table-column
            v-if="checkPer(['admin', 'dept:edit', 'dept:del'])"
            label="操作"
            width="130px"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <udOperation
                :data="scope.row"
                :permission="permission"
                msg="确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import crudClass from '@/api/czb/classTree'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import ImportDialog from '@/components/czb/ImportDialog'

const defaultForm = {
  id: null,
  name: null,
  subCount: 0,
  pid: null,
  sort: 999,
  enabled: 'true',
  classNum: null
}
export default {
  name: 'Class',
  components: {
    Treeselect,
    crudOperation,
    rrOperation,
    udOperation,
    ImportDialog
  },

  cruds() {
    return CRUD({
      title: '分类',
      url: 'api/classTree',
      crudMethod: { ...crudClass }
    })
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 设置数据字典
  dicts: ['enable_status'],
  props: {
    type: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      classManageDialog: false,
      classes: [],
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        classNum: [{ required: true, message: '请输入分类编号', trigger: 'blur' }],
        sort: [
          {
            required: true,
            message: '请输入序号',
            trigger: 'blur',
            type: 'number'
          }
        ]
      },
      permission: {
        add: [],
        edit: [],
        del: []
      }
    }
  },
  methods: {
  // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      this.query.type = this.type
      return true
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      form.enabled = `${form.enabled}`
      this.getClassTree()
    },

    getClassTree() {
      crudClass.list({ enabled: true, type: this.type }).then((res) => {
        const data = res.content
        this.buildTree(data)

        this.classes = data
      })
    },

    buildTree(tree) {
      tree.forEach(data => {
        if (data.children) {
          this.buildTree(data.children)
        }
        if (data.children.length === 0) {
          delete data.children
        }
      })
    },

    // 提交前的验证
    [CRUD.HOOK.afterValidateCU]() {
      if (this.form.pid !== null && this.form.pid === this.form.id) {
        this.$message({
          message: '上级分类不能为该分类本身',
          type: 'warning'
        })
        return false
      }
      this.form.type = this.type
      return true
    },
    [CRUD.HOOK.afterSubmit]() {
      // 提交之后
      this.informRefresh()
    },
    [CRUD.HOOK.afterDelete]() {
      // 删除之后
      this.informRefresh()
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm(
        '此操作将 "' +
          this.dict.label.enable_status[val] +
          '" ' +
          data.name +
          '分类, 是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          crudClass
            .edit(data)
            .then((res) => {
              this.crud.notify(
                this.dict.label.enable_status[val] + '成功',
                CRUD.NOTIFICATION_TYPE.SUCCESS
              )
              this.informRefresh()
            })
            .catch((err) => {
              data.enabled = !data.enabled
              console.log(err.response.data.message)
            })
        })
        .catch(() => {
          data.enabled = !data.enabled
        })
    },
    informRefresh() {
      this.$emit('refreshTree')
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
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
.wrapper {
  display: inline-block;
  vertical-align: top;
}
</style>

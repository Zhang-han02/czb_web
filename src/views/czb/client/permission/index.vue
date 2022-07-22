<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.blurry" size="small" clearable placeholder="输入名称或者描述搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <rrOperation />
      </div>
      <crudOperation>
        <template v-slot:right>
          <el-button type="primary" size="small" @click="openManage">权限配置</el-button>

        </template>
      </crudOperation>
    </div>

    <el-row :gutter="15">
      <!--角色管理-->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
          </div>
          <el-table ref="table" v-loading="crud.loading" highlight-current-row style="width: 100%;" :data="crud.data" @current-change="handleCurrentChange">
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="dataScope" label="数据权限" />
            <el-table-column prop="level" label="角色级别" />
            <el-table-column :show-overflow-tooltip="true" prop="description" label="描述" />
            <el-table-column :show-overflow-tooltip="true" width="135px" prop="createTime" label="创建日期" />

          </el-table>
          <!--分页组件-->
          <pagination />
        </el-card>
      </el-col>
      <!-- 菜单授权 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单" placement="top">
              <span class="role-span">权限分配</span>
            </el-tooltip>
            <el-button
              v-permission="['admin','clientPermission:list']"
              :disabled="!showButton"
              :loading="menuLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="savePermission"
            >保存</el-button>
          </div>

          <div>
            <el-checkbox-group v-model="checkedPermissions" class="flex-column">
              <el-checkbox v-for="item in permissions" :key="item.id" :label="item.id" class="m-check-box">
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>

          </div>

        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      title="权限配置"
      :visible.sync="manageDialog"
      width="70%"
    >
      <PermissionManage @refresh="getPermissionDatas" />
      <span slot="footer">
        <el-button @click="manageDialog = false">关闭</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import crudRoles from '@/api/system/role'
import { listAll } from '@/api/czb/clientPermission'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import DateRangePicker from '@/components/DateRangePicker'
import PermissionManage from './PermissionManage'

const defaultForm = { id: null, name: null, depts: [], description: null, dataScope: '全部', level: 3 }
export default {
  name: 'Permission',
  components: { pagination, crudOperation, rrOperation, DateRangePicker, PermissionManage },
  cruds() {
    return CRUD({ title: '角色', url: 'api/roles', sort: 'level,asc', crudMethod: { ...crudRoles },
      optShow: {
        add: false,
        edit: false,
        del: false,
        download: false,
        reset: true
      }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      manageDialog: false,
      permissions: [],
      checkedPermissions: [],
      defaultProps: { children: 'children', label: 'label', isLeaf: 'leaf' },
      dateScopes: ['全部', '本级', '自定义'], level: 3,
      currentId: 0, menuLoading: false, showButton: false
    }
  },
  mounted() {
    this.getPermissionDatas()
  },
  methods: {
    openManage() {
      this.manageDialog = true
    },
    getPermissionDatas() {
      listAll().then(res => {
        this.permissions = res
      })
    },
    [CRUD.HOOK.afterRefresh]() {
      this.checkedPermissions = []
    },
    // 触发单选
    handleCurrentChange(val) {
      if (val) {
        const _this = this
        // 保存当前的角色id
        this.currentId = val.id
        // 初始化默认选中的key
        this.checkedPermissions = []
        val.clientPermissions.forEach(function(data) {
          _this.checkedPermissions.push(data.id)
        })
        this.showButton = true
      }
    },

    // 保存权限
    savePermission() {
      this.menuLoading = true
      crudRoles.editPermission(this.currentId, this.checkedPermissions).then(() => {
        this.crud.notify('保存成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        this.menuLoading = false
        this.update()
      }).catch(err => {
        this.menuLoading = false
        console.log(err.response.data.message)
      })
    },
    // 改变数据
    update() {
      // 无刷新更新 表格数据
      crudRoles.get(this.currentId).then(res => {
        for (let i = 0; i < this.crud.data.length; i++) {
          if (res.id === this.crud.data[i].id) {
            this.crud.data[i] = res
            break
          }
        }
      })
    }

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .role-span {
    font-weight: bold;color: #303133;
    font-size: 15px;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
 ::v-deep .vue-treeselect__multi-value{
    margin-bottom: 0;
  }
 ::v-deep .vue-treeselect__multi-value-item{
    border: 0;
    padding: 0;
  }
  .flex-column{
      display: flex;
      flex-direction: column;
      .m-check-box{
          margin: 5px 0;
      }

  }
</style>

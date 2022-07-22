<template>
  <div class="app-container wrapper">
    <p><label>注册码：</label>{{ form.registerCode }} <el-button type="primary" size="mini" @click="eidtRegisterCode">修改</el-button>
    </p>
    <p><label>系统到期时间：</label>{{ form.expirationTime }}</p>
    <p><label>剩余天数：</label>{{ form.residueDays }}天</p>
    <EditRegisterCode ref="editRegisterCode" @success="loadInfo" />
  </div>
</template>
<script>
import { expirationInfo } from '@/api/system/user'
import EditRegisterCode from '@/views/system/expiration/components/EditRegisterCode'

export default {
  components: {
    EditRegisterCode
  },

  data() {
    return {
      form: {
        expirationTime: null,
        residueDays: null
      }
    }
  },
  mounted() {
    this.loadInfo()
  },
  methods: {
    loadInfo() {
      expirationInfo().then((res) => {
        this.form = res
      }).catch((err) => {
        console.log(err)
      })
    },
    eidtRegisterCode() {
      this.$refs.editRegisterCode.open(this.form.registerCode)
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper{
    font-size: 1.1em;
}
</style>

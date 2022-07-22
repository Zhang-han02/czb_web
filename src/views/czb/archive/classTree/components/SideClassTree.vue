<template>
  <div>

    <el-tree
      :data="classDatas"
      :load="getClassDatas"
      :props="defaultProps"
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
    />
  </div>
</template>

<script>
import { list } from '@/api/czb/classTree'

export default {
  props: {
    type: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      classDatas: [],
      defaultProps: { children: 'children', label: 'name' }
    }
  },
  mounted() {
    this.getTree()
  },
  methods: {
    handleNodeClick(data) {
      this.$emit('nodeClick', data)
    },
    getTree() {
      const sort = 'sort,asc'
      const params = { sort: sort }

      params.type = this.type
      params.enabled = true

      list(params).then(res => {
        const data = res.content
        this.classDatas = [{ name: '全部', id: null }, ...data]
      })
    },
    getClassDatas(node, resolve) {
      const sort = 'sort,asc'
      const params = { sort: sort }
      if (typeof node !== 'object') {
        if (node) {
          params['name'] = node
        }
      } else if (node.level !== 0) {
        params['pid'] = node.data.id
      }
      params.type = this.type
      params.enabled = true
      setTimeout(() => {
        list(params).then(res => {
          const data = res.content
          if (resolve) {
            resolve(data)
          } else {
            this.classDatas = data
          }
        })
      }, 100)
    }
  }
}
</script>

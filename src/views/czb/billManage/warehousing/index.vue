<template>
  <BillList :bill-type="1" :cud-permission="cudPermission" />
</template>
<script>
import BillList from '../components/BillList'
export default {
  name: 'Warehousing',
  components: {
    BillList
  },
  data() {
    return {
      cudPermission: {
        add: 'warehousing:add',
        edit: 'warehousing:edit',
        del: 'warehousing:del'
      }
    }
  }
}
</script>

<template>
  <BillList :bill-type="2" :cud-permission="cudPermission" />
</template>
<script>
import BillList from '../components/BillList'
export default {
  name: 'StockOut',
  components: {
    BillList
  },
  data() {
    return {
      cudPermission: {
        add: 'stockOut:add',
        edit: 'stockOut:edit',
        del: 'stockOut:del'
      }
    }
  }
}
</script>

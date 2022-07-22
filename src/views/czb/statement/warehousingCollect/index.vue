<template>
  <StockInAndOutCollect :bill-type="1" />
</template>
<script>
import StockInAndOutCollect from '../components/StockInAndOutCollect'
export default {
  name: 'WarehousingCollect',
  components: {
    StockInAndOutCollect
  },
  data() {
    return {

    }
  }
}
</script>

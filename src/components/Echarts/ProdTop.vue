<template>
  <div style="height:420px">
  <div >
    <div style="float:left;">
      <h3>本月TOP 10</h3>
    </div>
    <div style="float:left; margin-left:60%;margin-top:10px;">
      <el-button @click="entry">入库</el-button>
      <el-button @click="shipment">出库</el-button>
    </div>
  </div>
  <div class="min">
    <div style="display: inline-block; width: 100%">
      <el-table  :data="formData"  style="width: 100%"
            class="top" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
            <el-table-column type="index" label="#" width="40" />
            <el-table-column align="center" prop="prod_name" label="产品" />
            <el-table-column align="center" prop="total" label="车次" />
            <el-table-column align="center" prop="weightTotal" label="重量" />
            <el-table-column align="center" prop="average" label="平均车重" />
      </el-table>
      <vue-seamless-scroll :data="formData" class="seamless-warp" :class-option="classOption" style="float:left;">
        <el-table ref="table" :data="formData" style="width: 100%"
            class="bottom"  cell-style="font-weight: 700" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
            <el-table-column type="index" label="#" width="40" />
            <el-table-column align="center" prop="prod_name" label="产品" />
            <el-table-column align="center" prop="total" label="车次" />
            <el-table-column align="center" prop="weightTotal" label="重量" />
            <el-table-column align="center" prop="average" label="平均车重" />
        </el-table>
      </vue-seamless-scroll>
    </div>
  </div>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { findProd } from '@/api/czb/weighSummary'

const defaultQuery = {
  weighDate: null,
  prodId: null,
  prodName: null,
  warehouseId: null,
  warehouseName: null,
  supplierId: null,
  supplierName: null,
  custId: null,
  custName: null,
  operator: null,
  operatorId: null,
  operatorName: null,
  poundName: null,
  billType: 1
}

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    }
  },
  components: {
    CountTo
  },
  
data() {
    return {
      query: {
        ...defaultQuery
      },
      pageNo: 0,
      pageSize: 10,
      formData:[]
    }
  },
  created() {
      this.findProd();
    },
  computed: {
    classOption() {
        return {
          step: 0.5, // 数值越大速度滚动越快
          limitMoveNum: 5, // 无缝滚动的数据量
          hoverStop: true, // 是否开启鼠标悬停stop
          direction: 1, // 0向下 1向上 2向左 3向右
          openWatch: false, // 开启数据实时监控刷新dom
          singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
          singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
          waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
        };
      },
  },
  methods: {
    entry(){
      this.query.billType = 1;
      this.findProd()
    },
    shipment(){
      this.query.billType = 2;
      this.findProd()
    },
    findProd(){
      const params = {
        ...this.query,
        page: this.pageNo,
        size: this.pageSize,
        billStatus: "1"
      }
      findProd(params).then(
        (response) => {
          this.formData = response.content;
        }
      ).catch(e => {
        
        console.log(e)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bbttom{
  border-bottom: 1px solid #000;

}
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
>>>.seamless-warp {
    height: 300px;
    overflow: hidden;
    width: 100%
  }

 >>>.min {
  display: flex;
  width: 100%;
}
>>>.top .el-table__body-wrapper {
  display: none;
}
>>>.bottom .el-table__header-wrapper {
  display: none;
  width: 100%;
}
</style>

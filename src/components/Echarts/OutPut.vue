<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
          <h2>称重入库</h2>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
           过磅车次
          </div>
          <count-to :start-val="0" :end-val="putData[0].number" :duration="1000" class="card-panel-num" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            过磅重量
          </div>
          <count-to :start-val="0" :end-val="putData[0].weight" :duration="1000" class="card-panel-num" />
        </div>
        <div style="margin-left:85%">
          <div style="margin-top:20%">
            <el-button size="mini" @click="putDay">当天</el-button>
          </div>
          <div style="margin-top:20%">
            <el-button size="mini" @click="putMoth">当月</el-button>
          </div>
          <div style="margin-top:20%">
            <el-button size="mini" @click="putYear">当年</el-button>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <h2>称重出库</h2>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
           过磅车次
          </div>
          <count-to :start-val="0" :end-val="outData[0].number" :duration="1000" class="card-panel-num" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            过磅重量
          </div>
          <count-to :start-val="0" :end-val="outData[0].weight" :duration="1000" class="card-panel-num" />
        </div>
        <div style="margin-left:85%">
          <div style="margin-top:20%">
            <el-button size="mini" @click="outDay">当天</el-button>
          </div>
          <div style="margin-top:20%">
            <el-button size="mini" @click="outMoth">当月</el-button>
          </div>
          <div style="margin-top:20%">
            <el-button size="mini" @click="outYear">当年</el-button>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { outPut } from '@/api/czb/weighSummary'

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
  billType: null
}


export default {
  components: {
    CountTo
  },
  
data() {
    return {
      query: {
        ...defaultQuery
      },
      // 1:日 2:月 3:年
      putType: 1,
      outType: 1,
      putData:[],
      outData:[]
    }
  },
  created() {
      this.weighPut();
      this.weighOut();
    },
  methods: {
    putDay(){
      this.putType = 1;
      this.weighPut();
    },
    putMoth(){
      this.putType = 2;
      this.weighPut();
    },
    putYear(){
      this.putType = 3;
      this.weighPut();
    },
    outDay(){
      this.outType = 1;
      this.weighOut();
    },
    outMoth(){
       this.outType = 2;
       this.weighOut();
    },
    outYear(){
       this.outType = 3;
       this.weighOut();
    },
    weighPut(){
      this.query.billType = 1;
      const params = {
        collectType:this.putType,
        ...this.query,
        page: this.pageNo,
        size: this.pageSize,
      }
      outPut(params).then(
        (response) => {
          this.putData = response.content;
        }
      ).catch(e => {
        
        console.log(e)
      })
    },
    weighOut(){
      this.query.billType = 2;
      const params = {
        collectType:this.outType,
        ...this.query,
        page: this.pageNo,
        size: this.pageSize,
      }
      outPut(params).then(
        (response) => {
          this.outData = response.content;
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
  margin-top: 20px;
  height: 180px;

  .card-panel-col {
    margin-bottom: 5px;
  }

  .card-panel {
    height: 180px;
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
      margin: 47px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: left;
      font-weight: bold;
      margin: 60px;
      margin-left: 15%;

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
.xunuhan{
  margin-left:10px
}
</style>

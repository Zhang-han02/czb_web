<template>
<el-row class="panel-group">
      <div class="min">
        <div style="display: inline-block; width: 100%">
          <el-table :data="formData" class="top" cell-style="padding:4px;font-weight: 700" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                  <el-table-column align="center" prop="pound_name" label="磅台名称" />
                  <el-table-column align="center" prop="weight" label="当日称重总数" />
                  <el-table-column align="center" prop="sync" label="当日已同步数" />
                  <el-table-column align="center" label="当日待同步数">
                  <template slot-scope="scope"> 
                    <router-link :to="{ name: 'Weighdetailall', query: { pound_name: scope.row.pound_name, weigh_date:scope.row.weigh_date,bill_status: 1 } }" style="color:blue;text-decoration:underline;font-weight:bold">
                  <!-- 当前列取值-->
                    {{ scope.row.nosync }}
                    </router-link>
                  </template>
                  </el-table-column>
            </el-table>
            <vue-seamless-scroll :data="formData" class="seamless-warp" :class-option="classOption">
              <el-table :data="formData"  class="bottom" cell-style="padding:4px;font-weight: 700" :header-cell-style="{background:'#eef1f6',color:'#606266'}" >
                    <el-table-column align="center" prop="pound_name" label="磅台名称" />
                    <el-table-column align="center" prop="weight" label="当日称重总数" />
                    <el-table-column align="center" prop="sync" label="当日已同步数" />
                    <el-table-column align="center" label="当日待同步数">
                    <template slot-scope="scope"> 
                      <router-link :to="{ name: 'Weighdetailall', query: { pound_name: scope.row.pound_name, weigh_date:scope.row.weigh_date,bill_status: 1 } }" style="color:blue;text-decoration:underline;font-weight:bold">
                    <!-- 当前列取值-->
                      {{ scope.row.nosync }}
                      </router-link>
                    </template>
                    </el-table-column>
              </el-table>
            </vue-seamless-scroll>
          </div>
        </div>
  </el-row>




<!--
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            New Visits
          </div>
          <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Messages
          </div>
          <count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Purchases
          </div>
          <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="shopping" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Shoppings
          </div>
          <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row> -->
</template>

<script>
import CountTo from 'vue-count-to'
import { findPound } from '@/api/czb/weighSummary'

export default {
  components: {
    CountTo
  },
  
data() {
    return {
      formData:[]
    }
  },
  computed: {
    classOption() {
        return {
          step: 0.3, // 数值越大速度滚动越快
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
  created() {
      this.findPound();
    },
    mounted(){
      //在mounted 声明周期中创建定时器
      const timer = setInterval(()=>{
        // 这里调用调用需要执行的方法，1为自定义的参数，由于特殊的需求它将用来区分，定时器调用和手工调用，然后执行不同的业务逻辑
        this.findPound();
      }, 5*60*1000) // 每两秒执行1次
      // 通过$once来监听定时器，在beforeDestroy钩子可以被清除
      this.$once('hook:beforeDestroy',()=>{
        // 在页面销毁时，销毁定时器
        clearInterval(timer)
      })
    },

  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    viewdetial(){
      this.$router.push({name:'Weighdetailall'})
    },
    findPound(){
      findPound().then(
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
  margin-top: 9px;

  .card-panel-col {
    margin-bottom: 5px;
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
    height: 110px;
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

<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>
<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { prodTopThree } from '@/api/czb/weighSummary'

export default {
  mixins: [resize],
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
      default: '420px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      nameDate:[],
      oneDate:[],
      twoDate:[],
      threeDate:[],
      monthData:[]
    }
  },
  watch: {
   monthData:{
      deep: true,
      handler() {
        this.setOptions()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
    created() {
      this.prodTopThree();
    },
  methods: {
    prodTopThree(){
      prodTopThree().then(
        (response) => {
          this.oneDate = response.weigh[0]
          this.twoDate = response.weigh[1]
          this.threeDate = response.weigh[2]
          this.monthData = response.month[0]
          this.nameDate = response.name
        }
      ).catch(e => {
        
        console.log(e)
      })
    },


    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions()
    },
    setOptions() {
      this.chart.setOption({
        title: {
            text: '年度产品走势图(TOP3)'
          },
        xAxis: {
          data: this.monthData,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          x: 'right',
          data: this.nameDate
        },
        series: [{
          name: this.nameDate[0], 
          itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: this.oneDate,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: this.nameDate[1],
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: this.twoDate,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        },
        {
          name: this.nameDate[2],
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#cc6600',
              lineStyle: {
                color: '#cc6600',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data:  this.threeDate,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    }
  }
}
</script>

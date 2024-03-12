<template>
  <el-row :gutter="20">

    <el-col :span="12"><div class="grid-content ep-bg-purple" />
      <div ref="chart1" style="width: 600px;height:400px;"></div>
    </el-col>

    <el-col :span="12"><div class="grid-content ep-bg-purple" />
      <div ref="chart2" style="width: 600px;height:400px;"></div>
    </el-col>

  </el-row>
  <el-row :gutter="20">

    <el-col :span="12"><div class="grid-content ep-bg-purple" />
      <div ref="chart3" style="width: 600px;height:400px;"></div>
    </el-col>

    <el-col :span="12"><div class="grid-content ep-bg-purple" />
      <div ref="chart4" style="width: 600px;height:400px;"></div>
    </el-col>

  </el-row>
</template>

<script setup>
import {onBeforeMount, onMounted, ref} from 'vue'
import * as echarts from 'echarts'
import {getUserReport,getReletReport,getTurnoverReport,getRepairReport} from '@/api/report'


//数据模型

//近7天日期
const sDay=ref();
//日期列表
const dayList= ref([]);
//用户总辆列表
const totalUserList=ref([]);
//新用户列表
const newUserList=ref([]);
//租赁数据列表
const reletList=ref([]);
//营业额列表
const turnoverList=ref([]);
//维修数据列表
const repairList=ref([]);


//初始化

onMounted(async()=>{
  sDay.value=past7Day();
  await getUserReportData();
  await getReletListData();
  await getTurnoverReportData();
  await getRepairListData();

  //图表1
  init1();
  init2();
  init3();
  init4();
})
//日期格式化
function dateFormat(fmt, time) {
  let date = new Date(time);
  let ret;
  const opt = {
    // 年
    "Y+": date.getFullYear().toString(),
    // 月
    "m+": (date.getMonth() + 1).toString(),
    // 日
    "d+": date.getDate().toString()
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (const k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
      );
    }
  }
  return fmt;
}
// 获取近7日
const past7Day = () => {
  let toData = new Date(new Date().toLocaleDateString()).getTime();
  let past7daysStart = toData - 7 * 3600 * 24 * 1000;
  let past7daysEnd = toData - 1;
  let days7Start = dateFormat("YYYY-mm-dd", past7daysStart);
  let days7End = dateFormat("YYYY-mm-dd", past7daysEnd);
  return {'begin':days7Start,
    'end':days7End};
};
//获取用户统计数据方法
const getUserReportData=async ()=>{
  await getUserReport(sDay.value)
  .then((result) => {
    dayList.value=result.data.dateList.split(',');
    totalUserList.value=result.data.totalUserList.split(',');
    newUserList.value=result.data.newUserList.split(',');
  })
}

//获取租赁数据
const getReletListData=async ()=>{
  await getReletReport()
  .then((result) => {
    reletList.value=result.data
  })
}

//获取营业额数据方法
const getTurnoverReportData=async ()=>{
  await getTurnoverReport(sDay.value)
  .then((result) => {
    dayList.value=result.data.dateList.split(',');
    turnoverList.value=result.data.turnoverList.split(',');
  })
}
//获取维修数据
const getRepairListData=async ()=>{
  await getRepairReport()
  .then((result) => {
    repairList.value=result.data
  })
}

//图标1用户数量
const chart1=ref();
const init1=()=>{
  var myChart = echarts.init(chart1.value);

      // 指定图表的配置项和数据
      var option = {
        tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff', //背景颜色（此时为默认色）
        borderRadius: 2, //边框圆角
        textStyle: {
          color: '#333', //字体颜色
          fontSize: 12, //字体大小
          fontWeight: 300,
        },
      },
      grid: {
        top: '20%',
        left: '20',
        right: '50',
        bottom: '12%',
        containLabel: true,
      },

        title: {
          text: '用户数量(近7天)'
        },
        xAxis: {
          type: 'category',
        boundaryGap: false,
        axisLabel: {
          //X轴字体颜色
          textStyle: {
            color: '#666',
            fontSize: '11px',
          },
        },
        axisLine: {
          //X轴线颜色
          lineStyle: {
            color: '#E5E4E4',
            width: 1, //x轴线的宽度
          },
        },
        //日期列表
        data: dayList.value 

        },
        yAxis: [
        {
          type: 'value',
          min: 0,
          //max: 500,
          //interval: 100,
          axisLabel: {
            textStyle: {
              color: '#666',
              fontSize: '12px',
            },
            // formatter: "{value} ml",//单位
          },
        }, //左侧值
      ],

        series: [
          {
          name: '用户总量',
          type: 'line',
          // stack: 'Total',
          smooth: false, //否平滑曲线
          showSymbol: false, //未显示鼠标上移的圆点
          symbolSize: 10,
          // symbol:"circle", //设置折线点定位实心点
          itemStyle: {
            normal: {
              color: '#FFD000',
              lineStyle: {
                color: '#FFD000',
              },
            },
            emphasis: {
              color: '#fff',
              borderWidth: 5,
              borderColor: '#FFC100',
            },
          },
            //用户总量列表
            data: totalUserList.value
          },

          {
            name: '新增用户',
          type: 'line',
          // stack: 'Total',
          smooth: false, //否平滑曲线
          showSymbol: false, //未显示鼠标上移的圆点
          symbolSize: 10, //圆点大小
          // symbol:"circle", //设置折线点定位实心点
          itemStyle: {
            normal: {
              color: '#FD7F7F',
              fontWeigth: 300,
              lineStyle: {
                color: '#FD7F7F',
              },
            },
            emphasis: {
              // 圆点颜色
              color: '#fff',
              borderWidth: 5,
              borderColor: '#FD7F7F',
            },
          },
            //新增用户列表
            data: newUserList.value
          }
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
}
//图表2租赁数据
const chart2=ref();
const init2=()=>{
  var myChart = echarts.init(chart2.value);

  var option = {
    title: {
    text: '租赁次数',
    left: 'center',
    top: 'center'
  },
  
  tooltip: {
    trigger: 'item'
  },
  
  series: [
    {
      name: '车辆名称',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      
      
    
      data: reletList.value
    }
  ]
  };
  myChart.setOption(option);
}
//图表3营业额数据
const chart3=ref();
const init3=()=>{
  var myChart = echarts.init(chart3.value);

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '营业额（元）'
        },
        tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data:dayList.value,
      axisTick: {
        alignWithLabel: true
      },
      axisLabel: {
          //X轴字体颜色
          textStyle: {
            color: '#666',
            fontSize: '10px',
          },
        }



      
    }
          
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'Direct',
      type: 'bar',
      barWidth: '60%',
      data: turnoverList.value
    }
  ]
        
        
        

        
            
              
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
}
//图表4维修次数排名
const chart4=ref();
const init4=()=>{
  var myChart = echarts.init(chart4.value);

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: '维修次数'
        },
        tooltip: {
        trigger: 'axis',
        axisPointer: {
        type: 'shadow'
        }
        },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },

  dataset: [
    {
      dimensions: ['name',  'number',],
      source: repairList.value
    },
    {
      transform: {
        type: 'sort',
        config: { dimension: 'number', order: 'desc' }
      }
    }
  ],
  xAxis: {
    type: 'category',
    axisLabel: { interval: 0, rotate: 30 }
  },
  yAxis: {},
  series: {
    type: 'bar',
    encode: { x: 'name', y: 'number' },
    datasetIndex: 1
  }        
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>

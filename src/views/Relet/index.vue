<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import {ElMessage} from "element-plus"
import {reletPageService,reletStatusNumberService,reletRejectionService,reletPassService,reletDeleteService} from '@/api/relet'

/* ------------------------------------------------------初始化数据模型 */
//续租数据
const reletData = ref([])
//详情数据模型
const detailDataModel=ref({})
//待审核状态数量
const statusNumber=ref(0)
//控制添加弹窗
const dialogDetailVisible = ref(false)
const dialogCheckVisible = ref(false)
const dialogConfirmVisible=ref(false)
//页码
const page=ref(1);
//每页记录数
const pageSize=ref(10);

//审核人姓名
const employeeNameInput=ref('');
//订单号
const numberInput=ref('')

//状态
const statusInput=ref('');
//总页数
const counts=ref(0);

const small = ref(false)
const background = ref(false)
const disabled = ref(false)

//分页查询数据模型
const pageQuery=ref({
    page:page,
    pageSize:pageSize,
    number:numberInput,
    employeeName:employeeNameInput,
    status:statusInput
})
//状态列表数据
const changedOrderList=ref([
{
        label: '全部续租',
        value: ''
      },
      {
        label: '待审核',
        value: 0,
        num: statusNumber.value
      },
      {
        label: '已审核',
        value: 1,
      },
      {
        label: '未通过',
        value: 2,
      },
      {
        label: '已取消',
        value: 3
      },
])
const activeIndex=ref('')

//驳回数据模型
const rejectDate=ref({
  id:'',
  rejectionReason:''
})
/* -------------------------------------校验 */
const rules = {
  rejectionReason: [
        { required: true, message: '请输入驳回原因', trigger: 'blur' },
    ]
}

/* ------------------------------------------------------方法 */
//操作状态列表
const tabChange=(activeIndexP)=>{
    activeIndex.value=activeIndexP
    statusInput.value=activeIndexP
    pageList()
}

//操作页码
const handleSizeChange = (val) => {
 pageSize.value = val;
 pageList();
}
const handleCurrentChange = (val) => {
  page.value = val;
  pageList();
}
//获取待审核预约数量
const getStatusNumber=async ()=>{
  await reletStatusNumberService()
  .then((result) => {
    statusNumber.value=result.data
    changedOrderList.value[1].num=statusNumber.value
  })
}
//分页查询
const pageList=async ()=>{
    await reletPageService(pageQuery.value)
    .then((result) => {
        reletData.value=result.data.records;
        counts.value=result.data.total;
        getStatusNumber()
    })
}
pageList();

//点开详情页
const detailHandle=(row)=>{
    detailDataModel.value=row
    dialogDetailVisible.value=true
}
//点开审核页面
const CheckHandle=(row)=>{
    detailDataModel.value=row
    dialogCheckVisible.value=true
}
//驳回
const formRef = ref(null)
const rejectionHandle=async (formEl)=>{
  rejectDate.value.id=detailDataModel.value.id
  if (!formEl) return
  await formEl.validate(async (valid) =>{
    if(valid){
      if (confirm('确认驳回续租?', '提示')){
        await reletRejectionService(rejectDate.value)
        .then((result) => {
          ElMessage.success('驳回成功！')
          pageList()
          dialogCheckVisible.value=false
          dialogConfirmVisible.value=false
          
        }).catch((err) => {
          ElMessage.error('驳回失败！');
        });


      }
    }else{
      ElMessage.error('请正确填写每项数据');
    }
  })
}

//通过
const passHandle=async ()=>{
  if (confirm('确认通过续租?', '提示')){
    await reletPassService({id:detailDataModel.value.id})
    .then((result) => {
      ElMessage.success('提交成功！')
      pageList()
      dialogCheckVisible.value=false
    }).catch((err) => {
      ElMessage.error('提交失败！');
      pageList()
    });
  }
}

//根据id删除预约
const deleteHandle=async (id)=>{
  if (confirm('确认删除该预约?', '提示')){
    await reletDeleteService({id:id})
    .then((result) => {
      ElMessage.success('删除成功！')
      pageList()
    }).catch((err) => {
      ElMessage.error('删除失败！');
    });
  }
}

</script>
<template>
        <div class="tab-change">

            <div v-for="item in changedOrderList" :key="item.value" class="tab-item" 
            :class="{ active: item.value === activeIndex }"  @click="tabChange(item.value)">
             <el-badge :class="{'special-item':item.num<10}"
                       class="item"
                       :value="item.num > 99 ? '99+' : item.num"
                       :hidden="(['',1, 2,3].includes(item.value) && item.num)"
                       >
                       {{ item.label }}
             </el-badge>
           </div>

         </div>
           
        <el-card class="page-container">
        <template #header>
            <div class="header">

                
                <label style="margin-right: 0px;margin-left: 0px">订单号：</label>
                <el-input
                v-model="numberInput"
                class="w-50 m-2"
                placeholder="搜索订单号"
                :prefix-icon="Search"
                style="width: 20%;margin-right: 0px;margin-left: 0px"
                />

                <label style="margin-right: 0px;margin-left: 0px">审核人姓名：</label>
                <el-input
                v-model="employeeNameInput"
                class="w-50 m-2"
                placeholder="搜索审核人姓名"
                :prefix-icon="Search"
                style="width: 20%;margin-right: 0px;margin-left: 0px"
                />

                 
                

                <el-button style="margin-right: 500px"  
                @click="pageList"
                >查询</el-button>

                
            </div>
            
        </template>



        <el-table :data="reletData" style="width: 100%">
            <el-table-column label="序号" width="60" type="index"> </el-table-column>

            <el-table-column label="订单号" prop="number" width="197"></el-table-column>

            <el-table-column label="用户" prop="order.userName" width="110"></el-table-column>

            <el-table-column label="车牌号码" prop="order.licensePlateNumber" width="110">
                <template v-slot="scope">
                    {{scope.row.order.licensePlateNumber.slice(0,2)+'·'+scope.row.order.licensePlateNumber.slice(2,7)}}
                </template>
            </el-table-column>

            

            <el-table-column label="审核人" prop="employeeName" width="100">
                <template v-slot="scope">
                    {{scope.row.employeeName||"无"}}
                </template>
            </el-table-column>

            <el-table-column label="申请还车时间" prop="returnTime" width="180"></el-table-column>

            <el-table-column label="发起时间" prop="reletTime" width="180"></el-table-column>

            <el-table-column label="处理时间"  width="180" >
                <template v-slot="scope">
                    {{scope.row.cancelTime||scope.row.passTime||"无"}}
                </template>
            </el-table-column>

            <el-table-column label="当前续租状态" prop="status" width="120">
                <template v-slot="scope">
                
                {{scope.row.status===0?"待审核":scope.row.status===1?"已审核":scope.row.status===2?"未通过":"已取消"}}

                
                </template>
            </el-table-column>

            <el-table-column label="操作" width="190">
                <template v-slot="scope">
                <el-button type="warning"
                       size="small"
                       round
                       v-if="scope.row.status===0"
                       style="float:center"
                       @click="CheckHandle(scope.row)"
                       >
                    审核
                 </el-button>

                 <el-button type="danger"
                       size="small"
                       round
                       v-else
                       style="float:center"
                       @click="deleteHandle(scope.row.id)"
                       >
                    删除
                 </el-button>
                
                 <el-button type="primary"
                       size="small"
                       round
                    style="float:right;margin-right:55px"
                    @click="detailHandle(scope.row)"
                       >
                    详情
                 </el-button>
                </template>


            </el-table-column>





            <template #empty>
                <el-empty description="没有数据" />
            </template>




        </el-table>
        <!-- 分页 -->
        <div class="pageList">
    
           <el-pagination
             :page-sizes="[10, 15, 20, 30]"
             :page-size="pageSize"
             :small="small"
             :disabled="disabled"
             :background="background"
             layout="total,sizes, prev, pager, next"
             :total="counts"
             @size-change="handleSizeChange"
             @current-change="handleCurrentChange"
           />
         </div>

    </el-card>


    <el-dialog v-model="dialogDetailVisible" title="详情信息" width="50%">
        
        <!-- 描述信息 -->
         <el-descriptions
          class="margin-top"
          :title="detailDataModel.userName"
          :column="2"
          :size="size"
          border>
        
          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                用户身份证号：
              </div>
            </template>
            {{detailDataModel.order.idNumber}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                用户驾驶证号：
              </div>
            </template>
            {{detailDataModel.order.licenceId}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                用户手机号：
              </div>
            </template>
            {{detailDataModel.order.phone}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                续租信息：
              </div>
            </template>
            {{detailDataModel.reletInfo}}
          </el-descriptions-item>


          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                申请还车时间：
              </div>
            </template>
            {{detailDataModel.returnTime}}
          </el-descriptions-item>

          
          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                申请车辆：
              </div>
            </template>
            {{detailDataModel.order.vehicleName}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                车牌号：
              </div>
            </template>
            {{detailDataModel.order.licensePlateNumber.slice(0,2)+'·'+detailDataModel.order.licensePlateNumber.slice(2,7)}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px" v-if="detailDataModel.status===1||detailDataModel.status===2">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                审核人：
              </div>
            </template>
            {{detailDataModel.employeeName}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                续租状态：
              </div>
            </template>
            {{detailDataModel.status===0?"待审核":detailDataModel.status===1?"已审核":detailDataModel.status===2?"未通过":"已取消"}}
          </el-descriptions-item>

          

          

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                续租发起时间：
              </div>
            </template>
            {{detailDataModel.reletTime}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px" v-if="detailDataModel.status===3||detailDataModel.status===2">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                申请取消时间：
              </div>
            </template>
            {{detailDataModel.cancelTime}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px" v-if="detailDataModel.status===1">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                审核通过时间：
              </div>
            </template>
            {{detailDataModel.passTime}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px" v-if="detailDataModel.status===1">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                订单号：
              </div>
            </template>
            {{detailDataModel.number}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px" v-if="detailDataModel.status===2">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                审核不通过原因：
              </div>
            </template>
            {{detailDataModel.rejectionReason}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px" v-if="detailDataModel.status===3||detailDataModel.status===2">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                续租取消原因：
              </div>
            </template>
            {{detailDataModel.cancelReason}}
          </el-descriptions-item>


          
          </el-descriptions>
       
          
        
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogDetailVisible = false">返回</el-button>
                
                
                
            </span>
        </template>


    </el-dialog>

    <el-dialog v-model="dialogCheckVisible" title="审核预约" width="50%">
     
       
        <el-descriptions
           class="margin-top"
           :column="1"
           :size="size"
           border
         >
           
         <el-descriptions-item label="订单号：" min-width="100px">{{detailDataModel.number}}</el-descriptions-item>

         <el-descriptions-item label="订单状态：" min-width="100px">{{detailDataModel.order.status===0?"待付押金"
                :detailDataModel.order.status===1?"待取车"
                :detailDataModel.order.status===2?"租赁中"
                :detailDataModel.order.status===3?"已还车"
                :detailDataModel.order.status===4?"待付款"
                :detailDataModel.order.status===5?"已完成":"已取消"}}</el-descriptions-item>

           <el-descriptions-item label="预约用户姓名：" min-width="100px">{{detailDataModel.order.userName}}</el-descriptions-item>

           <el-descriptions-item label="用户身份证号：" >{{detailDataModel.order.idNumber}}</el-descriptions-item>

           <el-descriptions-item label="用户驾驶证号：" >{{detailDataModel.order.licenceId}}</el-descriptions-item>

           <el-descriptions-item label="用户手机号：" >{{detailDataModel.order.phone}}</el-descriptions-item>
           
           <el-descriptions-item label="预约车辆名称：" >{{detailDataModel.order.vehicleName}}</el-descriptions-item>

           <el-descriptions-item label="车牌号码：" >{{detailDataModel.order.licensePlateNumber}}</el-descriptions-item>

           <el-descriptions-item label="申请还车时间：" >{{ detailDataModel.returnTime }}</el-descriptions-item>

           <el-descriptions-item label="续租信息：" >{{detailDataModel.reletInfo}}</el-descriptions-item>

           
           
         </el-descriptions>
       



      <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogCheckVisible = false">返回</el-button>

                <el-button type="danger"
                @click="dialogConfirmVisible=true"
                >驳回</el-button>

                <el-button type="success"
                @click="passHandle"
                >通过</el-button>

            </span>
        </template>
    </el-dialog>
       
    <el-dialog v-model="dialogConfirmVisible" title="驳回" width="50%">
      <el-form :model="rejectDate" :rules="rules" label-width="100px" style="padding-right: 30px"
            ref="formRef"
        >
            <el-form-item label="驳回原因" prop="rejectionReason">
                <el-input v-model="rejectDate.rejectionReason" minlength="1" maxlength="255" type="textarea"></el-input>
            </el-form-item>
      </el-form>


      <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogConfirmVisible = false">返回</el-button>
                <el-button type="primary" 
                @click="rejectionHandle(formRef)"
                > 确认 </el-button>
            </span>
        </template>
    </el-dialog>

</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
.pageList{
  margin-top: 25px;
  margin-left: 35%;
}

.tab-change {
  display: flex;
  border-radius: 4px;
  margin-bottom: 20px;

  .tab-item {
    width: 120px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    color: #333;
    border: 1px solid #e5e4e4;
    background-color: white;
    border-left: none;
    cursor: pointer;
    .special-item {
      .el-badge__content {
        width: 20px;
        padding: 0 5px;
      }
    }
    .item {
      .el-badge__content {
        background-color: #fd3333 !important;
        line-height: 18px;
        height: auto;
        min-width: 18px;
        min-height: 18px;
        // border-radius: 50%;
      }
      .el-badge__content.is-fixed {
        top: 14px;
        right: 2px;
      }
    }
  }
  .active {
    background-color: #4e6dfb;
    font-weight: bold;
  }
  .tab-item:first-child {
    border-left: 1px solid #e5e4e4;
  }
}
</style>

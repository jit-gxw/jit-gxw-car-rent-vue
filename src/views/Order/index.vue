<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import {ElMessage} from "element-plus"
import {OrderPageService,OrderStatisticsService,OrderCancelService,OrderPaymentService,OrderConfirmService,OrderReturnService,OrderAmountService,OrderDeleteService} from '@/api/order'

/* ------------------------------------------------------初始化数据模型 */
//订单数据
const appointmentData = ref([])
//详情数据模型
const detailDataModel=ref({})
//订单状态数据模型
const statusNumber=ref({
    pendingDeposit:'',
    waitingForCollection:'',
    renting:'',
    returned:'',
    waitingForPayment:''
})
//控制添加弹窗
const dialogDetailVisible = ref(false)
const dialogCheckAmountVisible = ref(false)
const dialogCancelVisible=ref(false)
//页码
const page=ref(1);
//每页记录数
const pageSize=ref(10);
//订单号
const numberInput=ref('');
//手机号
const phoneInput=ref('');
//开始时间
const beginTime=ref('');
//结束时间
const endTime=ref('');
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
    phone:phoneInput,
    beginTime:beginTime,
    endTime:endTime,
    status:statusInput
})
//状态列表数据
const changedOrderList=ref([
{
        label: '全部预约',
        value: ''
      },
      {
        label: '待付押金',
        value: 0,
        num: statusNumber.value.pendingDeposit
      },
      {
        label: '待取车',
        value: 1,
        num: statusNumber.value.waitingForCollection
      },
      {
        label: '租赁中',
        value: 2,
        num: statusNumber.value.renting
      },
      {
        label: '已还车',
        value: 3,
        num: statusNumber.value.returned
      },
      {
        label: '待付款',
        value: 4,
        num: statusNumber.value.waitingForPayment
      },
      {
        label: '已完成',
        value: 5
      },
      {
        label: '已取消',
        value: 6
      },
])
const activeIndex=ref('')

//取消数据模型
const CancelDate=ref({
  id:'',
  cancelReason:''
})
//确认最终订单金额数据模型
const ConfirmAmountDate=ref({
    id:'',
    extraCharges:''
})
/* -------------------------------------校验 */
const rules = {
    cancelReason: [
        { required: true, message: '请输入取消原因', trigger: 'blur' },
    ]
}
const rulesAmount={
  extraCharges: [
        { required: true, message: '请输入额外费用,没有填0'},
        { type: 'number', message: '请填写正确的金额' },
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
//获取订单状态数量
const getStatusNumber=async ()=>{
  await OrderStatisticsService()
  .then((result) => {
    statusNumber.value=result.data
    changedOrderList.value[1].num=statusNumber.value.pendingDeposit
    changedOrderList.value[2].num=statusNumber.value.waitingForCollection
    changedOrderList.value[3].num=statusNumber.value.renting
    changedOrderList.value[4].num=statusNumber.value.returned
    changedOrderList.value[5].num=statusNumber.value.waitingForPayment
  })
}
//分页查询
const pageList=async ()=>{
    await OrderPageService(pageQuery.value)
    .then((result) => {
        appointmentData.value=result.data.records;
        counts.value=result.data.total;
        getStatusNumber()
    })
}
pageList();
//打开详情页
const detialHandle=(detial)=>{
  detailDataModel.value=detial
  dialogDetailVisible.value=true
}
//打开取消订单页
const cancelHandle=(id)=>{
  CancelDate.value.id=id
  dialogCancelVisible.value=true
}
//提交取消
const formRef = ref(null)
const cancelSubmit=async (formEl)=>{
  if (!formEl) return
  await formEl.validate(async (valid) =>{
    if(valid){
      if (confirm('确认取消该订单?', '提示')){
        await OrderCancelService(CancelDate.value)
        .then((result) => {
          ElMessage.success('取消成功！')
          pageList()
          dialogCancelVisible.value=false
          dialogDetailVisible.value=false
        }).catch((err) => {
          ElMessage.error('取消失败！');
        });

      }
    }else{
      ElMessage.error('请正确填写每项数据');
    }
  })
}
//现金支付
const paymentHandle=async (id)=>{
  if (confirm('请仔细确认实收现金金额！', '提示')){
    await OrderPaymentService({id:id})
    .then((result) => {
      ElMessage.success('提交成功！')
          pageList()
    }).catch((err) => {
      ElMessage.error('提交失败！');
    });
  }
}
//租赁车辆
const confirmHandle=async (id)=>{
  if (confirm('请仔细核对租车用户是否与预约信息一致！', '提示')){
    await OrderConfirmService({id:id})
    .then((result) => {
      ElMessage.success('提交成功！')
          pageList()
    }).catch((err) => {
      ElMessage.error('提交失败！');
    });
  }
}
//确认还车
const returnHandle=async (id)=>{
  if (confirm('请认真确认车辆是否有损坏，是否有违章！', '提示')){
    await OrderReturnService({id:id})
    .then((result) => {
      ElMessage.success('提交成功！')
          pageList()
    }).catch((err) => {
      ElMessage.error('提交失败！');
    });
  }
}
//打开结算页
const amountHandle=(id)=>{
  ConfirmAmountDate.value.id=id
  dialogCheckAmountVisible.value=true
}
const checkForm= ref(null)
const amountSubmit=async (formEl)=>{
  if (!formEl) return
  await formEl.validate(async (valid) =>{
    if(valid){
      if (confirm('仔细确认所有费用已经结清！', '提示')){
        await OrderAmountService(ConfirmAmountDate.value)
        .then((result) => {
          ElMessage.success('已向用户发起付款！')
          pageList()
          dialogCheckAmountVisible.value=false
        }).catch((err) => {
          ElMessage.error('提交失败！');
        });

      }
    }else{
      ElMessage.error('请正确填写每项数据');
    }
  })
}
//根据id删除订单
const deleteHandle=async (id)=>{
  if (confirm('确认删除该订单？', '提示')){
    await OrderDeleteService({id:id})
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
                       :value="item.num > 99 ? '99+':item.num===0? '' : item.num"
                       :hidden="(['',6,7].includes(item.value) && item.num)"
                       >
                       {{ item.label }}
             </el-badge>
           </div>

         </div>
           
        <el-card class="page-container">
        <template #header>
            <div class="header">
                <label style="margin-right: 0px">订单号：</label>
                <el-input
                v-model="numberInput"
                class="w-50 m-2"
                placeholder="搜索订单号"
                :prefix-icon="Search"
                style="width: 15%;margin-right: 0px;margin-left: 0px"
                />

                
                <label style="margin-right: 0px;margin-left: 0px">手机号：</label>
                <el-input
                v-model="phoneInput"
                class="w-50 m-2"
                placeholder="搜索手机号"
                :prefix-icon="Search"
                style="width: 15%;margin-right: 0px;margin-left: 0px"
                />

                <label style="margin-right: 0px;margin-left: 0px">订单生成时间：</label>
                <el-date-picker
                    v-model="beginTime"
                    type="date"
                    placeholder="Pick a day"
                    :size="size"
                    format="YYYY/MM/DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss"
                  />
                  到
                  <el-date-picker
                    v-model="endTime"
                    type="date"
                    placeholder="Pick a day"
                    :size="size"
                    format="YYYY/MM/DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss"
                  />

                 

                <el-button style="margin-right: 20px"  
                @click="pageList"
                >查询</el-button>

                
            </div>
            
        </template>



        <el-table :data="appointmentData" style="width: 100%">
            <el-table-column label="序号" width="60" type="index"> </el-table-column>

            <el-table-column label="订单号" prop="number" width="197"></el-table-column>

            <el-table-column label="用户" prop="userName" width="80"></el-table-column>

            <el-table-column label="手机号" prop="phone" width="115"></el-table-column>

            <el-table-column label="车牌号码" prop="licensePlateNumber" width="100">
                <template v-slot="scope">
                    {{scope.row.licensePlateNumber.slice(0,2)+'·'+scope.row.licensePlateNumber.slice(2,7)}}
                </template>
            </el-table-column>

            <el-table-column label="车辆名称" prop="vehicleName" width="150"></el-table-column>


            <el-table-column label="订单总额" prop="amount" width="90">
              <template v-slot="scope">
              ￥{{scope.row.amount  }}
            </template>
            </el-table-column>

            <el-table-column label="押金" prop="amount" width="71">
              <template v-slot="scope">
              ￥{{scope.row.cashPledge  }}
            </template>
            </el-table-column>

            <el-table-column label="取车时间" prop="collectionTime" width="150"></el-table-column>

            <el-table-column label="还车时间" prop="returnTime" width="150"></el-table-column>

            <el-table-column label="当前订单状态" prop="status" width="110">
                <template v-slot="scope">
                
                {{scope.row.status===0?"待付押金"
                :scope.row.status===1?"待取车"
                :scope.row.status===2?"租赁中"
                :scope.row.status===3?"已还车"
                :scope.row.status===4?"待付款"
                :scope.row.status===5?"已完成":"已取消"}}

                
                </template>
            </el-table-column>

            <el-table-column label="生成时间" prop="orderTime" width="150"></el-table-column>

            <el-table-column label="结束时间"  width="180" >
                <template v-slot="scope">
                    {{scope.row.cancelTime||scope.row.completionTime||"无"}}
                </template>
            </el-table-column>

            

            <el-table-column label="操作" width="140" fixed="right">
                <template v-slot="scope">


                
                  <el-button type="success"
                       size="small"
                       round
                       v-if="scope.row.status===0||scope.row.status===4"
                       style="float:left"
                       @click="paymentHandle(scope.row.id)"
                       >
                    支付
                 </el-button>

                 
                <el-button type="success"
                       size="small"
                       round
                       v-if="scope.row.status===1"
                       style="float:left"
                       @click="confirmHandle(scope.row.id)"
                       >
                    租赁
                 </el-button>

                 <el-button type="success"
                       size="small"
                       round
                       v-if="scope.row.status===2"
                       style="float:left"
                       @click="returnHandle(scope.row.id)"
                       >
                    还车
                 </el-button>

                 <el-button type="success"
                       size="small"
                       round
                       v-if="scope.row.status===3"
                       style="float:left"
                       @click="amountHandle(scope.row.id)"
                       >
                    结算
                 </el-button>

                 <el-button type="danger"
                       size="small"
                       round
                       v-if="scope.row.status===5||scope.row.status===6"
                       style="float:left"
                       @click="deleteHandle(scope.row.id)"
                       >
                    删除
                 </el-button>

                 <!-- 
                    放到详情页里
                     -->
                
                 <el-button type="primary"
                       size="small"
                       round
                    style="float:right;"
                    @click="detialHandle(scope.row)"
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
          :title="detailDataModel.number"
          :column="2"
          :size="size"
          border>


          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                用户姓名：
              </div>
            </template>
            {{detailDataModel.userName}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                身份证号：
              </div>
            </template>
            {{detailDataModel.idNumber}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                驾驶证号：
              </div>
            </template>
            {{detailDataModel.licenceId}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                手机号：
              </div>
            </template>
            {{detailDataModel.phone}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                车辆名称：
              </div>
            </template>
            {{detailDataModel.vehicleName}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                车牌号码：
              </div>
            </template>
            {{detailDataModel.licensePlateNumber.slice(0,2)+'·'+detailDataModel.licensePlateNumber.slice(2,7)}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                取车时间：
              </div>
            </template>
            {{detailDataModel.collectionTime}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                还车时间：
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
                车辆押金：
              </div>
            </template>
            ￥{{detailDataModel.cashPledge}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                是否有续租：
              </div>
            </template>
            {{detailDataModel.reletStatus===0?"无":'有'}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                订单总额：
              </div>
            </template>
            ￥{{detailDataModel.amount}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                额外费用：
              </div>
            </template>
            ￥{{detailDataModel.extraCharges}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                支付状态：
              </div>
            </template>
            {{detailDataModel.payStatus===0?'未支付':detailDataModel.payStatus===1?'已支付':'已退款'}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                押金状态：
              </div>
            </template>
            {{detailDataModel.cashPledgeStatus===0?'未支付':detailDataModel.cashPledgeStatus===1?'已支付':'已退款'}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px" v-if="detailDataModel.status===6">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                取消时间：
              </div>
            </template>
            {{detailDataModel.cancelTime}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px" v-if="detailDataModel.status===6">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                取消原因：
              </div>
            </template>
            {{detailDataModel.cancelReason}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px" >
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                下单时间：
              </div>
            </template>
            {{detailDataModel.orderTime}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px" >
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                完成时间：
              </div>
            </template>
            {{detailDataModel.completionTime}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                备注信息：
              </div>
            </template>
            {{detailDataModel.remark}}
          </el-descriptions-item>

          </el-descriptions>
       
        
        <template #footer>
            <span class="dialog-footer">

              <el-button type="danger"
                       v-if="detailDataModel.status!=6"
                       @click="cancelHandle(detailDataModel.id)"
                       >
                    {{detailDataModel.status===5?'订单退款':'取消订单'}}
                 </el-button>

              
                <el-button @click="dialogDetailVisible = false">返回</el-button>
                
                
                
            </span>
        </template>


    </el-dialog>

    <el-dialog v-model="dialogCheckAmountVisible" title="订单金额确认" width="50%">
      <el-form :model="ConfirmAmountDate" :rules="rulesAmount" label-width="100px" style="padding-right: 30px"
            ref="checkForm"
        >
            <el-form-item label="额外费用" prop="extraCharges">
                <el-input v-model.number="ConfirmAmountDate.extraCharges" minlength="1" maxlength="5" placeholder="单位：元"></el-input>
            </el-form-item>
      </el-form>
       



      <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogCheckAmountVisible = false">返回</el-button>
                <el-button type="success"
                @click="amountSubmit(checkForm)"
                >确认</el-button>

            </span>
        </template>
    </el-dialog>
       
    <el-dialog v-model="dialogCancelVisible" title="取消订单" width="50%">
      <el-form :model="CancelDate" :rules="rules" label-width="100px" style="padding-right: 30px"
            ref="formRef"
        >
            <el-form-item label="取消原因" prop="cancelReason">
                <el-input v-model="CancelDate.cancelReason" minlength="1" maxlength="255" type="textarea"></el-input>
            </el-form-item>
      </el-form>


      <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogCancelVisible = false">返回</el-button>
                <el-button type="primary" 
                @click="cancelSubmit(formRef)"
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

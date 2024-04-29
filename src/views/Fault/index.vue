<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import {ElMessage} from "element-plus"
import {pageFaultService,startRepairService,completeRepairService,failRepairService,deleteRepairService} from '@/api/fault'
import{useCurrentUserDataStore} from '@/store/currentUser'
const currentUserDataStore=useCurrentUserDataStore();
/* ------------------------------------------------------初始化数据模型 */
const currentUserData=currentUserDataStore.currentUserData;
//车辆数据
const faultData = ref([])
//详情数据模型
const detailDataModel=ref({})
//控制添加弹窗
const dialogDetailVisible = ref(false)
const dialogCompleteVisible = ref(false)
//页码
const page=ref(1);
//每页记录数
const pageSize=ref(10);
//车牌号码
const licensePlateNumberInput=ref('');
//报修人角色
const informantRoleIdInput=ref('');
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
    licensePlateNumber:licensePlateNumberInput,
    informantRole:informantRoleIdInput,
    beginTime:beginTime,
    endTime:endTime,
    status:statusInput
})
//完成或失败数据模型
const completeRepairData=ref({
    id:'',
    reason:"",
    solution:"",
    cost:''
})
/* -------------------------------------校验 */
const rules = {
    reason: [
        { required: true, message: '请输入故障原因', trigger: 'blur' },
    ],
    solution: [
        { required: true, message: '请输入维修过程', trigger: 'blur' },
    ],
    cost: [
        { required: true, message: '请输入维修开销', trigger: 'blur' },
        { type: 'number', message: '请输入正确的开销' }
    ]
}

/* ------------------------------------------------------方法 */
//操作页码
const handleSizeChange = (val) => {
 pageSize.value = val;
 pageList();
}
const handleCurrentChange = (val) => {
  page.value = val;
  pageList();
}
//分页查询
const pageList=async ()=>{
    await pageFaultService(pageQuery.value)
    .then((result) => {
        faultData.value=result.data.records;
        counts.value=result.data.total;
    })
}
pageList();

//点开详情页
const detailHandle=(row)=>{
    detailDataModel.value=row
    dialogDetailVisible.value=true
}
//开始维修
const startRepair=async (rowId)=>{
    if (confirm('确认开始维修?', '提示')){
    await startRepairService({id:rowId})
    .then((result) => {
        ElMessage.success("开始维修！")
        pageList()
    }).catch((err) => {
        ElMessage.error("开始维修失败！")
    });
    }
}
const pass=async (rowId)=>{
    if (confirm('确认审核?', '提示')){
    await startRepairService({id:rowId})
    .then((result) => {
        ElMessage.success("审核通过！")
        pageList()
    }).catch((err) => {
        ElMessage.error("审核失败！")
    });
    }
}
//完成或失败维修
const dialogTitle=ref('')
const clickComplete=(id,type)=>{
    completeRepairData.value={}
    completeRepairData.value.id=id
    if(type==='完成'){
        dialogTitle.value="完成维修信息"
        dialogCompleteVisible.value=true
    }else{
        if (confirm('确认车辆维修失败?', '提示')){
            if (confirm('确认车辆维修失败?', '提示')){
                if (confirm('确认车辆维修失败?', '提示')){
                    dialogTitle.value="失败维修信息"
                    dialogCompleteVisible.value=true
                }
                
            }
        }
        
    }
}
const formRef = ref(null)
//提交完成或失败维修
const submit=async (formEl)=>{
if (!formEl) return
  await formEl.validate(async (valid) =>{
    if(valid){
          if(dialogTitle.value==='完成维修信息'){
                await completeRepairService(completeRepairData.value)
                .then((result) => {
                    ElMessage.success("提交成功")
                    dialogCompleteVisible.value=false
                    pageList()
                }).catch((err) => {
                    ElMessage.error("提交失败")
                });
            }else{
                await failRepairService(completeRepairData.value)
                .then((result) => {
                    ElMessage.success("提交成功")
                    dialogCompleteVisible.value=false
                    dialogDetailVisible.value=false
                    pageList()
                }).catch((err) => {
                    ElMessage.error("提交失败")
                });
            }

    }else{
      ElMessage.error('请正确填写每项数据');
    }


  })
}
//根据id删除表单
const deleteHandle=async (id)=>{
     if (confirm('确认删除该故障信息?', '提示')){
        await deleteRepairService({id:id})
         .then((result) => {
           ElMessage.success("删除信息成功")
           pageList();
         }).catch((err) => {
           ElMessage.error("删除信息失败")
         });
         }
}

</script>
<template>

           
        <el-card class="page-container">
        <template #header>
            <div class="header">
                <label style="margin-right: 0px">车牌号码：</label>
                <el-input
                v-model="licensePlateNumberInput"
                class="w-50 m-2"
                placeholder="搜索车牌号码"
                :prefix-icon="Search"
                style="width: 10%;margin-right: 0px;margin-left: 0px"
                />

                
                <label style="margin-right: 0px;margin-left: 0px">报修人员：</label>
                <el-select v-model="informantRoleIdInput"  placeholder="请选择报修人角色" style="width: 10%">
                    <el-option label="全部" value='' />
                    <el-option label="职员" value='0' />
                    <el-option label="用户" value='1' />
                </el-select>

                <label style="margin-right: 0px;margin-left: 0px">报修时间：</label>
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

                 <label style="margin-right: 0px;margin-left: 0px">维修状态：</label>
                <el-select v-model="statusInput" placeholder="选择搜索的维修状态" style="width: 10%;margin-right: 0px">
                  <el-option label="全部" value='' />
                  <el-option label="待维修" value=0 />
                  <el-option label="维修中" value=1 />
                  <el-option label="完成" value=2 />
                  <el-option label="失败" value=3 />
                  <el-option label="待审核" value=4 />
                </el-select>
                

                <el-button style="margin-right: 20px"  
                @click="pageList"
                >查询</el-button>

                
            </div>
            
        </template>



        <el-table :data="faultData" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>

            <el-table-column label="车牌号码" prop="licensePlateNumber">
                <template v-slot="scope">
                    {{scope.row.licensePlateNumber.slice(0,2)+'·'+scope.row.licensePlateNumber.slice(2,7)}}
                </template>
            </el-table-column>

            <el-table-column label="报修人姓名" prop="informantName">
              
            </el-table-column>

            <el-table-column label="维修工姓名" prop="employeeName">
              <template v-slot="scope">
                    {{scope.row.employeeName||"无"}}
                </template>
            </el-table-column>

            <el-table-column label="报修时间" prop="notificationTime"></el-table-column>

            <el-table-column label="完成时间" prop="completionTime">
              <template v-slot="scope">
                    {{scope.row.completionTime||"无"}}
                </template>
            </el-table-column>

            <el-table-column label="当前维修状态" prop="status">
                <template v-slot="scope">
                
                {{scope.row.status===0?"待维修":scope.row.status===1?"维修中":scope.row.status===2?"完成":scope.row.status===4?"待审核":"失败"}}

                
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template v-slot="scope">
                <el-button type="warning"
                       size="small"
                       round
                       v-if="scope.row.status===0"
                       style="float:center"
                       @click="startRepair(scope.row.id)"
                       >
                    维修
                 </el-button>

                
                <el-button type="warning"
                       size="small"
                       round
                       v-if="scope.row.status===4&&currentUserData.roleId===1"
                       style="float:center"
                       @click="pass(scope.row.id)"
                       >
                    审核
                 </el-button>
                

                 <el-button type="success"
                       size="small"
                       round
                       v-if="scope.row.status===1"
                       @click="clickComplete(scope.row.id,'完成')"
                       >
                    完成
                 </el-button>
                  <el-button type="danger" 
                  size="small"
                       round
                v-if="scope.row.status===2 | scope.row.status===3"
                @click="deleteHandle(scope.row.id)"
                > 删除 </el-button>

                
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
          :title="detailDataModel.name"
          :column="2"
          :size="size"
          border>
          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                车牌号：
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
                报修人角色：
              </div>
            </template>
           {{detailDataModel.informantRole=0?"职员":"用户"}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                报修人姓名：
              </div>
            </template>
           {{detailDataModel.informantName}}
          </el-descriptions-item>

            <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                报修原因：
              </div>
            </template>
           {{detailDataModel.information}}
          </el-descriptions-item>

            <el-descriptions-item min-width="150px" >
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                维修状态：
              </div>
            </template>
           {{detailDataModel.status===0?"待维修":detailDataModel.status===1?"维修中":detailDataModel.status===2?"完成":detailDataModel.status===4?"待审核":"失败"}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                维修工姓名：
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
                故障原因:
              </div>
            </template>
           {{detailDataModel.reason}}
          </el-descriptions-item>

            <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                报修时间:
              </div>
            </template>
           {{detailDataModel.notificationTime}}
          </el-descriptions-item >

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                开始维修时间:
              </div>
            </template>
           {{detailDataModel.repairTime}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                完成时间:
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
                维修过程：
              </div>
            </template>
           {{detailDataModel.solution}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                维修费用:
              </div>
            </template>
           ￥{{detailDataModel.cost}}
          </el-descriptions-item>

          
          </el-descriptions>
       
          
        
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogDetailVisible = false">返回</el-button>
                
                <el-button type="danger" 
                v-if="detailDataModel.status===1"
                @click="clickComplete(detailDataModel.id,'失败')"
                > 维修失败 </el-button>
                
            </span>
        </template>


    </el-dialog>

         <el-dialog v-model="dialogCompleteVisible" :title="dialogTitle" width="50%">
      <el-form :model="completeRepairData" :rules="rules" label-width="100px" style="padding-right: 30px"
            ref="formRef"
        >
            <el-form-item label="故障原因" prop="reason">
                <el-input v-model="completeRepairData.reason" minlength="1" maxlength="255" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="维修过程" prop="solution" v-if="dialogTitle==='完成维修信息'">
                <el-input v-model="completeRepairData.solution" minlength="1" maxlength="255" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="维修开销" prop="cost">
                <el-input v-model.number="completeRepairData.cost" placeholder="单位（元）" minlength="1" maxlength="255"></el-input>
            </el-form-item>
      </el-form>


      <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogCompleteVisible = false">返回</el-button>
                <el-button type="primary" 
                @click="submit(formRef)"
                > 提交 </el-button>
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


</style>
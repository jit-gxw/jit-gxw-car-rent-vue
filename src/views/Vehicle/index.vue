<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import {pageVehicleService,enableOrDisableVehicleService,deleteVehicleService} from '@/api/vehicle'
import {useRouter} from 'vue-router'
import {pageService} from '@/api/classification'
import {ElMessage} from "element-plus"
import {submitFaultService} from '@/api/fault'
const router = useRouter();


/* ------------------------------------------初始化数据模型---------------------------------- */
//车辆数据
const vehicleData = ref([
   
])

//详情数据模型
const detailDataModel=ref({})
//控制添加弹窗
const dialogVisible = ref(false)
const dialogRepairVisible=ref(false)

//页码
const page=ref(1);
//每页记录数
const pageSize=ref(10);
//分类
const classificationIdInput=ref('');
//车牌号码
const licensePlateNumberInput=ref('');
//名称
const nameInput=ref('');
//状态
const statusInput=ref('');
//总页数
const counts=ref(0);

const small = ref(false)
const background = ref(false)
const disabled = ref(false)


const pageQuery=ref({
    page:page,
    pageSize:pageSize,
    name:nameInput,
    classificationId:classificationIdInput,
    licensePlateNumber:licensePlateNumberInput,
    status:statusInput
})
//车辆分类信息
const vehicleClass=ref([

])
//报修信息
const repairData=ref({
  vehicleId:'',
  information:''
})
/* ---------------------------------------------------------表单校验------------------------------------------- */
const rules = {
    information: [
        { required: true, message: '请输入故障原因', trigger: 'blur' },
    ]
}




/* -----------------------------------------------------方法---------------------------------------------------- */

//操作页码
const handleSizeChange = (val) => {
 pageSize.value = val;
 pageList();
}
const handleCurrentChange = (val) => {
  page.value = val;
  pageList();
}

//调用api分页查询
const pageList=async()=>{
    await pageVehicleService(pageQuery.value).then((result) => {
        vehicleData.value=result.data.records;
        counts.value=result.data.total
        
    })
}
pageList();

//查询分类信息
const selectClass=async ()=>{
  const params={
    "page":1,
    "pageSize":1000,
    "status":0
  }
  await pageService(params)
  .then((result) => {
    vehicleClass.value=result.data.records;
  })
}
selectClass();

//点开详情页
const detialHandle=(row)=>{
    detailDataModel.value=row
    dialogVisible.value=true
}
//添加或修改车辆入口
const addVehicle=(st)=>{
    if(st==="add"){
      //添加操作
      router.push({path:'/vehicle/add',query: { st: st }})
    }else{
      //修改操作
      router.push({path:'/vehicle/add',query: { id: st }})
    }
}

//修改车辆状态
const statusHandle=(row)=>{
    const idForSet=row.id
    const status=row.status
    if (confirm('确认调整该分类的状态?', '提示')) {
    enableOrDisableVehicleService({id:idForSet,status: status===0 ? 1 : 0})
      .then((res) => {
        ElMessage.success('状态更改成功！');
        pageList();
      })
      .catch((err) => {
        ElMessage.error('状态更改失败');
      });
  }

}
//删除车辆
const deleteVehicle=async (id)=>{
  if (confirm('确认删除该车辆?', '提示')){
  await deleteVehicleService({id:id})
  .then((result) => {
    ElMessage.success("删除车辆成功")
    dialogVisible.value = false
    pageList();
  }).catch((err) => {
    ElMessage.error("删除车辆失败")
  });
  }
}

//车辆报修
const submitRepair=(id)=>{
    repairData.value.vehicleId=id
    repairData.value.information=''
    dialogRepairVisible.value=true
}
//提交报修
const formRef = ref(null)
const repair =async (formEl)=>{
  if (!formEl) return
  await formEl.validate(async (valid) =>{
    if(valid){
      await submitFaultService(repairData.value)
      .then((result) => {
        ElMessage.success("报修成功")
        dialogRepairVisible.value=false
        pageList()
      }).catch((err) => {
        ElMessage.error("报修失败")
      });
    }else{
      ElMessage.error('请正确填写每项数据');
    }
  })
}
</script>
<template>
    <el-card class="page-container">



        <template #header>
            <div class="header">
                <label style="margin-right: 0px">车辆名称：</label>
                <el-input
                v-model="nameInput"
                class="w-50 m-2"
                placeholder="搜索车辆名称"
                :prefix-icon="Search"
                style="width: 10%;margin-right: 0px;margin-left: 0px"
                />
                <label style="margin-right: 0px">车牌号码：</label>
                <el-input
                v-model="licensePlateNumberInput"
                class="w-50 m-2"
                placeholder="搜索车牌号码"
                :prefix-icon="Search"
                style="width: 10%;margin-right: 0px;margin-left: 0px"
                />

                <label style="margin-right: 0px;margin-left: 0px">车辆状态：</label>
                <el-select v-model="statusInput" placeholder="选择搜索的分类状态" style="width: 10%;margin-right: 0px">
                  <el-option label="全部" value='' />
                  <el-option label="启用" value=0 />
                  <el-option label="禁用" value=1 />
                  <el-option label="使用中" value=2 />
                  <el-option label="维修中" value=3 />
                  <el-option label="已报废" value=4 />
                </el-select>
                <label style="margin-right: 0px;margin-left: 0px">车辆分类：</label>
                <el-select v-model="classificationIdInput"  placeholder="请选择车辆分类" style="width: 10%">
                    <el-option label="全部" value='' />
                    <el-option v-for="(item, index) in vehicleClass"
                         :key="index"
                         :label="item.name"
                         :value="item.id" />
                </el-select>
                


                <el-button style="margin-right: 200px"
                @click="pageList"
                >查询</el-button>


              





                <div class="extra">
                    <el-button type="primary"
                    @click="addVehicle('add')"
                    >添加车辆</el-button>
                </div>
            </div>
        </template>



        <el-table :data="vehicleData" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>

            <el-table-column label="名称" prop="name"></el-table-column>

            <el-table-column label="图片" prop="image">
                <template v-slot="{ row }">
                    <el-image style="width: 100px; height: auto; border: none; cursor: pointer"
                      :src="row.image"
                      :preview-src-list="row.image"
                      :initial-index="0"
                      >
            </el-image>
                </template>
            </el-table-column>


            <el-table-column label="车牌号码" prop="licensePlateNumber">
                <template v-slot="scope">
                    {{scope.row.licensePlateNumber.slice(0,2)+'·'+scope.row.licensePlateNumber.slice(2,7)}}
                </template>
            </el-table-column>


            <el-table-column label="分类" prop="classificationName"></el-table-column>

            <el-table-column label="日租价格" prop="priceDay">
                <template v-slot="scope">
                    <span style="margin-right: 10px">￥{{ scope.row.priceDay  }}</span>
                </template>
            </el-table-column>

            <el-table-column label="月租价格" prop="priceMonth">
                <template v-slot="scope">
                    <span style="margin-right: 10px">￥{{ scope.row.priceMonth  }}</span>
                </template>
            </el-table-column>

            <el-table-column label="修改时间" prop="updateTime"></el-table-column>




            <!-- <el-table-column label="车辆状态" prop="status">
                <template v-slot="scope">
                    {{scope.row.status===0?"正常":scope.row.status===1?"禁用":scope.row.status===2?"使用中":scope.row.status===3?"维修中":"已报废"}}
                </template>

            </el-table-column> -->

            <el-table-column label="当前车辆状态" prop="status">
                <template v-slot="scope">
                <el-button
                type="text"
                size="small"
                class="non"
                :class="{
                blueBug: scope.row.status == '0',
                delBut: scope.row.status != '0',
              }"
                @click="statusHandle(scope.row)"
                >
                {{scope.row.status===0?"正常":scope.row.status===1?"禁用":scope.row.status===2?"使用中":scope.row.status===3?"维修中":"已报废"}}

                </el-button>
                </template>
            </el-table-column>




            <el-table-column label="操作">
                <template v-slot="scope">
                <el-button type="warning"
                       size="small"
                       round
                        @click="submitRepair(scope.row.id)"
                       >
                    报修
                 </el-button>
                 <el-button type="primary"
                       size="small"
                       round
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



<!-- --------------------------------------------对话框--------------------------------------- -->
    <el-dialog v-model="dialogVisible" title="详情信息" width="50%">
        
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
                分类名称:
              </div>
            </template>
           {{detailDataModel.classificationName}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                押金金额：
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
                座位数：
              </div>
            </template>
           {{detailDataModel.seating}}
          </el-descriptions-item>

            <el-descriptions-item min-width="150px" >
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                图片：
              </div>
            </template>
           <el-image class="vehicle-image" :src="detailDataModel.image" style="width:50%"/>
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                车辆状态：
              </div>
            </template>
           {{detailDataModel.status===0?"正常":detailDataModel.status===1?"禁用":detailDataModel.status===2?"使用中":detailDataModel.status===3?"维修中":"已报废"}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                日租价格:
              </div>
            </template>
           ￥{{detailDataModel.priceDay}}
          </el-descriptions-item>

            <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                月租价格:
              </div>
            </template>
           ￥{{detailDataModel.priceMonth}}
          </el-descriptions-item >

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                车辆描述:
              </div>
            </template>
           {{detailDataModel.description}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                购入时价格:
              </div>
            </template>
           ￥{{detailDataModel.buyingPrice/10000}}万元
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                购入时间:
              </div>
            </template>
           {{detailDataModel.createTime}}
          </el-descriptions-item>

          <el-descriptions-item min-width="150px">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                更新时间:
              </div>
            </template>
           {{detailDataModel.updateTime}}
          </el-descriptions-item>


          </el-descriptions>
       
          
        
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">返回</el-button>
                
                <el-button type="danger" 
                @click="deleteVehicle(detailDataModel.id)"
                > 删除 </el-button>
                <el-button type="primary" 
                @click="addVehicle(detailDataModel.id)"
                > 编辑 </el-button>
            </span>
        </template>


    </el-dialog>


    <el-dialog v-model="dialogRepairVisible" title="故障报修" width="50%">
      <el-form :model="repairData" :rules="rules" label-width="100px" style="padding-right: 30px"
            ref="formRef"
        >
            <el-form-item label="故障原因" prop="information">
                <el-input v-model="repairData.information" minlength="1" maxlength="255" type="textarea"></el-input>
            </el-form-item>
      </el-form>


      <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogRepairVisible = false">返回</el-button>
                <el-button type="primary" 
                @click="repair(formRef)"
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
<template>
  <div class="addBrand-container">
    <div class="container">
      <h1 style="text-align: center">{{title}}</h1>
      <el-form ref="formRef"
               :model="addDataModel"
               :rules="rules"

               :inline="false"

               label-width="180px"
               class="demo-ruleForm">

               <el-form-item label="车辆名称:"
                      prop="name" >
              <el-input v-model="addDataModel.name"
                    placeholder="请输入车辆名称"
                    maxlength="255" />
              </el-form-item>

              <el-form-item label="车牌号码:"
                      prop="licensePlateNumber" >
              <el-input v-model="addDataModel.licensePlateNumber"
                    placeholder="请输入车牌号码"
                    maxlength="20" />
              </el-form-item>

              <el-form-item label="车辆分类" prop="classificationId">
                <el-select v-model="addDataModel.classificationId"  placeholder="请选择车辆分类">
                  
                    <el-option v-for="(item, index) in vehicleClass"
                         :key="index"
                         :label="item.name"
                         :value="item.id" />
                </el-select>
              </el-form-item>

              <el-form-item label="车辆图片:"
                        prop="image">
            <el-upload
              class="avatar-uploader"
              action="/api/admin/common/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :headers="headers"
              :on-remove="handleRemove"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              
               <span v-if="imageUrl"
                class="el-upload-list__item-actions">
              <span class="el-upload-span"
                    @click.stop="handleRemove()">
                <el-icon><Delete /></el-icon>
              </span>
              </span>
              </el-upload>
              </el-form-item>

              <el-form-item label="车辆押金:"
                      prop="cashPledge" >
              <el-input v-model.number="addDataModel.cashPledge"
                    placeholder="请输入押金，单位（元）"
                    maxlength="20" />
              </el-form-item>

              <el-form-item label="车辆座位数:"
                      prop="seating" >
              <el-input v-model="addDataModel.seating"
                    placeholder="请输入座位数"
                    maxlength="20" />
              </el-form-item>

              <el-form-item label="日租价格:"
                      prop="priceDay" >
              <el-input v-model.number="addDataModel.priceDay"
                    placeholder="请输入日租价格，单位（元）"
                    maxlength="20" />
              </el-form-item>

              <el-form-item label="月租价格:"
                      prop="priceMonth" >
              <el-input v-model.number="addDataModel.priceMonth"
                    placeholder="请输入月租价格，单位（元）"
                    maxlength="20" />
              </el-form-item>

              <el-form-item label="购入价格:"
                      prop="buyingPrice" >
              <el-input v-model.number="addDataModel.buyingPrice"
                    placeholder="请输入车辆购入时价格，单位（元）"
                    maxlength="20" />
              </el-form-item>

              <el-form-item label="车辆描述:"
                      prop="description" >
              <el-input v-model="addDataModel.description"
                    placeholder="请输入车辆描述"
                    
                    type="textarea"
                    />
              </el-form-item>

        <div class="subBox address">
          <!-- <el-form-item> -->
          <el-button 
          @click="() => $router.go(-1)"
          >
            取消
          </el-button>

          <el-button type="primary"
            @click="subForm(formRef)"
                     >
            保存
          </el-button>

          

          <!-- </el-form-item> -->
        </div>

      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref} from 'vue'
import { ElMessage,FormInstance, FormRules, useTransitionFallthroughEmits} from 'element-plus'
import {queryVehicleByIdService} from '@/api/vehicle'
import {pageService} from '@/api/classification'
import{addVehicleService,editVehicleService} from '@/api/vehicle'

import { Delete,Plus} from '@element-plus/icons-vue'
import{useTokenStore} from '@/store/token'

//调用route
import {useRouter} from 'vue-router'
const router = useRouter();
/* --------------------------------------------------------初始化数据模型 */
const addDataModel = ref({
  "licensePlateNumber": "",
        "name": "",
        "classificationId": '',
        "classificationName": '',
        "cashPledge": '',
        "seating": '',
        "image": '',
        "status": '',
        "priceDay": '',
        "priceMonth": '',
        "description": '',
        "buyingPrice": ''
})
//车辆分类信息
const vehicleClass=ref([

])
//图片路径
const imageUrl = ref('')
/* ----------------------------------------------------------方法 */
//如果是修改操作初始化方法
const init=async ()=>{
    const id = router.currentRoute.value.query.id
    await queryVehicleByIdService(id).then(res=>{
    addDataModel.value=res.data;
    imageUrl.value=res.data.image
  })
}
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


let title = '';
const operationType=ref('')
if(router.currentRoute.value.query.st === 'add'){
  title = '增加车辆'
  operationType.value='add'

}else{
  title = '编辑车辆信息'
  init()
}




/* -------------------------------------------------图片---------------------------------------------- */

const tokenStore=useTokenStore();


const headers={"token":tokenStore.token};




const handleAvatarSuccess = (
  response,
  uploadFile
) => {
  imageUrl.value = response.data
  addDataModel.value.image=imageUrl.value
}

const beforeAvatarUpload= (rawFile) => {
  if (['image/jpeg','image/png','image/jpg'].indexOf(rawFile.type) == -1) {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }

  return true
}

const handleRemove= () => {
  imageUrl.value=''
  addDataModel.value.image=''
}
////////////////////////////////////////////////////////





/* --------------------------------------------提交表单----------------------------- */
const formRef = ref(null)
const subForm = async (formEl)=>{
addDataModel.image=imageUrl.value
//判断表单规则
if (!formEl) return
await formEl.validate(async (valid) => {
    
		if (valid) {
			
      if(title==="增加车辆"){
        await addVehicleService(addDataModel.value)
        .then((result) => {
          ElMessage.success("添加成功！")
          router.go(-1)
        })
      }else{
        //编辑车辆
        await editVehicleService(addDataModel.value)
        .then((result) => {
          ElMessage.success("修改成功！")
          router.go(-1)
        })

      }






     
		} else {
      //失败
			ElMessage.error('请正确填写每项数据');
		}
})





}

/* ----------------------------------------------------定义校验规则------------------------------------- */
const rules={
 
  name:[
    { required: true, message: '请输入车辆名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在2个字符以上', trigger: 'blur' },
  ],
  licensePlateNumber:[
    { required: true, message: '请输入车牌号码', trigger: 'blur' },
    { pattern: /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{4}[A-Z_0-9\u4e00-\u9fa5]{1}$/, message: '请输入正确的车牌号码', trigger: 'blur' },
  ],
  cashPledge:[
    { required: true, message: '请输入车辆押金', trigger: 'blur' },
    { type: 'number', message: '请输入正确的押金' },
  ],
  classificationId:[
     {required: true,
      message: '请选择分类',
      trigger: 'change',}
  ],
  seating:[
    { required: true, message: '请输入座位数', trigger: 'blur' },
    { pattern: /^\d{1,2}$/, message: '请输入正确的车牌号码', trigger: 'blur' },
  ],
  priceDay:[
    { required: true, message: '请输入日租价格', trigger: 'blur' },
    { type: 'number', message: '请输入正确的日租价格' },
  ],
  priceMonth:[
    { required: true, message: '请输入月租价格', trigger: 'blur' },
    { type: 'number', message: '请输入正确的月租价格' },
  ],
  buyingPrice:[
    { required: true, message: '请输入购入价格', trigger: 'blur' },
    { type: 'number', message: '请输入正确的购入价格' },
  ],
  description:[
    { required: true, message: '请输入车辆描述', trigger: 'blur' },
  ],
  image:[
    { required: true, message: '请添加图片', trigger: 'blur' },
  ]


}

</script>





<style lang="scss" scoped>
.addBrand {
  &-container {
    margin: 30px;
    margin-top: 5%;
    margin-left:20%;
    margin-right: 20%;
    
    .container {
      position: relative;
      z-index: 1;
      background: rgb(232, 233, 253);
      padding: 30px;
      border-radius: 4px;
      
    
      
      
      // min-height: 500px;
      .subBox {
        padding-top: 30px;
        text-align: center;
        border-top: solid 1px ;
      }
    }
    .idNumber {
      margin-bottom: 39px;
    }

    .el-form-item {
      margin-bottom: 29px;
    }
    .el-input {
      width: 293px;
    }
    .roleId{
      width: 293px;
    }
  }
}
/* 图片上传 */
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.el-upload-list__item-actions:hover .upload-icon {
  display: inline-block;
}
.el-upload-list__item-actions:hover {
  opacity: 1;
}
.el-upload-list__item-actions {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  cursor: default;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.el-upload-span {
  width: 100px;
  height: 30px;
  border: 1px solid #ffffff;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  line-height: 30px;
}
.el-upload-span:first-child {
  margin-bottom: 20px;
}
///////////////////////////////////

</style>


<style>
/* 图片上传 */
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
/* ------------------------------- */
</style>
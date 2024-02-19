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

               
       
        <el-form-item label="账号:"
                      prop="username" >
          <el-input v-model="addDataModel.username"
                    placeholder="请输入账号"
                    maxlength="20" />
        </el-form-item>



        <el-form-item label="员工姓名:"
                      prop="name">
          <el-input v-model="addDataModel.name"
                    placeholder="请输入员工姓名"
                    maxlength="12" />
        </el-form-item>


        <el-form-item label="职位" prop="roleId">
      <el-select  v-model="addDataModel.roleId"
      placeholder="选择员工角色" 
      class="roleId"
      >
        <el-option label="管理员" value="1" />
        <el-option label="员工" value="2" />
        <el-option label="维修工" value="3" />
      </el-select>
      </el-form-item>


        
        <el-form-item label="手机号:"
                      prop="phone">
          <el-input v-model="addDataModel.phone"
                    placeholder="请输入手机号"
                    maxlength="11" />
        </el-form-item>


        <el-form-item label="性别:"
                      prop="sex">
          <el-radio-group  v-model="addDataModel.sex">
            <el-radio label="男" />
            <el-radio label="女" />
          </el-radio-group>
        </el-form-item>


        <el-form-item label="身份证号:"
                      prop="idNumber"
                      class="idNumber">
          <el-input v-model="addDataModel.idNumber"
                    placeholder="请输入身份证号"
                    maxlength="20" />
        </el-form-item>
        


        <div class="subBox address">
          <!-- <el-form-item> -->
          <el-button 
          @click="() => $router.push('/employee')"
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
import {addEmployeeService,queryEmployeeByIdService,editEmployeeService} from '@/api/employee'
//调用route
import {useRouter} from 'vue-router'
const router = useRouter();
//初始化数据模型
const addDataModel = ref({
  username:'',
  name:'',
  phone:'',
  sex:'',
  roleId:'',
  idNumber:''
})

const init=async ()=>{
    const id = router.currentRoute.value.query.id
    await queryEmployeeByIdService(id).then(res=>{
    addDataModel.value=res.data;
    addDataModel.value.sex=res.data.sex === '0' ? '女' : '男';
    addDataModel.value.roleId = res.data.roleId === 1 ? '管理员' : (res.data.roleId === 2 ? '员工' : '维修工');
  })
}


let title = '';
const operationType=ref('')
if(router.currentRoute.value.query.st === 'add'){
  title = '增加员工'
  operationType.value='add'

}else{
  title = '编辑员工信息'
  init()
}








/* 增加员工 */
const formRef = ref(null)
const subForm = async (formEl)=>{
//判断表单规则
if (!formEl) return
await formEl.validate(async (valid) => {
		if (valid) {
			//通过
      
      if(operationType.value==='add'){
        //增加员工
        const params = ref({
        username:addDataModel.value.username,
        name:addDataModel.value.name,
        phone:addDataModel.value.phone,
        sex:addDataModel.value.sex==='女'?'0':'1',
        roleId:addDataModel.value.roleId,
        idNumber:addDataModel.value.idNumber
        })
        //调用接口
        await addEmployeeService(params.value)
        .then((result) => {
          ElMessage.success(result.msg ? result.msg : '保存成功');
          router.push('/employee')



        }).catch((err) => {
          ElMessage.error('保存失败');
        });


      }else{
        //编辑员工信息
        //调用编辑接口
        addDataModel.value.roleId=addDataModel.value.roleId==='管理员'? 1 :(addDataModel.value.roleId==='员工'? 2 : (addDataModel.value.roleId==='维修工'?3:addDataModel.value.roleId))
        addDataModel.value.sex=addDataModel.value.sex==='女'?'0':'1'
        await editEmployeeService(addDataModel.value)
        .then((result) => {
          ElMessage.success(result.msg ? result.msg : '编辑成功');
          router.push('/employee')



        }).catch((err) => {
          ElMessage.error('编辑失败');
        });



      }
      

      


      
		} else {
      //失败
			ElMessage.error('请正确填写每项数据');
		}
})

/* 修改员工 */



}

/* 定义校验规则 */
const rules={
  username:[
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在3个字符以上', trigger: 'blur' },
  ],
  name:[
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在2个字符以上', trigger: 'blur' },
  ],
  roleId:[
     {required: true,
      message: '请选择职位',
      trigger: 'change',}
  ],
  phone:[
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  sex: [
    {
      required: true,
      message: '请输入性别',
      trigger: 'change',
    }],
  idNumber:[
    { required: true, message: '请输入身份证', trigger: 'blur' },
    { pattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/, 
    message: '请输入正确的身份证号', trigger: 'blur' }
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
</style>

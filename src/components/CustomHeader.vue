<template>
  <!-- el-header 的模板内容 -->
  <el-header>
                <div><strong style="font-size: 25px">{{currentUserData.roleId===1?'管理员':currentUserData.roleId===2?'员工':currentUserData.roleId===3?'维修工':'未知'}}：
                    </strong>{{currentUserData ? currentUserData.userName : '未知'}}</div>
                <el-dropdown placement="bottom-end">
                    <span class="el-dropdown__box">
                        <el-avatar :src="avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="password" :icon="EditPen"
                            @click="dialogVisible = true"
                            >重置密码</el-dropdown-item>

                            <el-dropdown-item command="logout" :icon="SwitchButton"
                            @click="logout"
                            >退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>






    <!-- 添加分类弹窗 -->
<el-dialog v-model="dialogVisible" title="重置密码" width="30%">
    <el-form ref="formRef" :model="editPasswordModel" :rules="rules" label-width="100px" style="padding-right: 30px">


        <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="editPasswordModel.oldPassword" minlength="1" maxlength="10"></el-input>
        </el-form-item>


        <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="editPasswordModel.newPassword" minlength="1" maxlength="15"></el-input>
        </el-form-item>


    </el-form>
    <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary"
            @click="editPass(formRef)"
            > 确认 </el-button>
        </span>
    </template>
</el-dialog>



</template>

<script setup>
import { defineProps,ref } from 'vue'
import { useLogout } from '@/composables/useLogout'
import {useEditPassWord} from '@/composables/useEditPassword'
import { ElMessage } from 'element-plus'

const props = defineProps({
  currentUserData: Object
})

//控制添加分类弹窗
const dialogVisible = ref(false)

//添加分类数据模型
const editPasswordModel = ref({
    empId:props.currentUserData.id,
    newPassword:'',
    oldPassword:''
})
//校验密码的函数
const checkPassword=(rule,value,callback)=>{
    if(editPasswordModel.value.newPassword===editPasswordModel.value.oldPassword){
        callback(new Error('新密码不能旧密码相同'))
    }else{
        callback()
    }
}

//添加分类表单校验
const rules = {
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码至少6位非空字符', trigger: 'blur' },
        { validator: checkPassword, trigger: 'blur' }
    ],
    oldPassword: [
        { required: true, message: '请输入旧密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码至少6位非空字符', trigger: 'blur' }

    ]
}

const { logout } = useLogout()
const { editPassWord }=useEditPassWord();
const avatar = require('@/assets/default.png')

const formRef = ref(null)
const editPass = async (formEl) => {
    //校验规则
    if (!formEl) return
    await formEl.validate(async (valid) =>{
        if (valid){
            //通过

            // 直接使用 editPasswordModel.value 来访问响应式数据
            editPassWord(editPasswordModel.value).then((result) => {
            if(result.msg==='原密码验证失败'){
                ElMessage.error('原密码验证失败'); // 应该使用 ElMessage.error 
            }else{
            logout();
            }
            
            })







        }else {
      //失败
			ElMessage.error('请正确填写每项数据');
		}


    })




  
};




</script>

<style lang="scss" scoped>
/* CSS 样式 */
.el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }
</style>
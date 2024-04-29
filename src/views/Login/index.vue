<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
//调用后台接口
//调用route
import {useRouter} from 'vue-router'
import{useTokenStore} from '@/store/token'
import{useCurrentUserDataStore} from '@/store/currentUser'
import {loginService} from '@/api/employee.js'
const router = useRouter();


const tokenStore=useTokenStore();


const currentUserDataStore=useCurrentUserDataStore();




//定义数据模型
const loginData = ref({
    username:'',
    password:''
})

//定义表单校验规则
const rules={
    username:[
        {required:true,message:'请输入用户名',trigger:'blur'}
    ],
    password:[
        {required:true,message:'请输入密码',trigger:'blur'},
        {min:6,max:20,message:'长度不能少于6位非空字符',trigger:'blur'}
    ]
}


const login = async () => {
    tokenStore.removeToken();
    currentUserDataStore.removeCurrentUserData();
    //loginData是一个响应式对象,如果要获取值,需要.value
    let result = await loginService(loginData.value);
    
    if (result.data.roleId === 1){
        //如果是管理员
        ElMessage.success(result.msg ? result.msg : '管理员登录成功');
        currentUserDataStore.setCurrentUserData(result.data);
        //赋值token
        tokenStore.setToken(result.data.token)
        router.push('/AdminLayout')
    }else if (result.data.roleId === 2){
        //如果是员工
        ElMessage.success(result.msg ? result.msg : '员工登录成功');

        currentUserDataStore.setCurrentUserData(result.data);
        tokenStore.setToken(result.data.token)
        router.push('/EmployeeLayout')
    }else if (result.data.roleId === 3){
        //如果是维修工
        ElMessage.success(result.msg ? result.msg : '维修工登录成功');
        currentUserDataStore.setCurrentUserData(result.data);
        tokenStore.setToken(result.data.token)
        router.push('/RepairmanLayout')
    }
    
}
</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" style="weight: 500px" class="bg"></el-col>
        <el-col :span="6" :offset="2" class="form">
           <!-- 登录表单 -->
            <el-form ref="form" size="large" autocomplete="off" :model="loginData" :rules="rules">
                <el-form-item>
                    <h1 >员工登录</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="loginData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="loginData.password"></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                        <el-link type="primary" :underline="false">忘记密码？</el-link>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login">
                        登录
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
        background:
            url('@/assets/login-l.jpg') no-repeat center / cover;
        border-radius: 0 10px 20px 0;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>
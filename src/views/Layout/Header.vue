<template>
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
                            <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>

                            <el-dropdown-item command="logout" :icon="SwitchButton"
                            @click="loginOut"
                            >退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
</template>

<script setup>
import {
    Management,
    Promotion,
    UserFilled,
    User,
    Crop,
    EditPen,
    SwitchButton,
    WarningFilled,
    DocumentAdd,
    List,
    Timer,
    CreditCard,
    Van,
    MessageBox
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import {loginOutService} from '@/api/employee'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'
const router=useRouter();
import {useTokenStore} from '@/store/token'
import { ref } from 'vue'
const tokenStore=useTokenStore();
//传递用户数据
import{useCurrentUserDataStore} from '@/store/currentUser'
const currentUserDataStore=useCurrentUserDataStore();

//数据模型
const currentUserData=currentUserDataStore.currentUserData;




//退出登录
const loginOut=async ()=>{
await loginOutService()
.then((result) => {
    tokenStore.removeToken();
    currentUserDataStore.removeCurrentUserData();
    ElMessage.success('登出成功')
    router.push('/login')
}).catch((err) => {
    ElMessage.error('登出失败')
});

}

import { defineProps } from 'vue'

const props = defineProps({
    currentUserData: Object,
    loginOut: Function
})
</script>

<style lang="scss" scoped>
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
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
    Van
} from '@element-plus/icons-vue'




import CustomHeader from '@/components/CustomHeader.vue'
import { useCurrentUserDataStore } from '@/store/currentUser'
const currentUserDataStore = useCurrentUserDataStore()
const currentUserData = currentUserDataStore.currentUserData


</script>

<template>
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            <!-- 菜单 -->
            <el-menu active-text-color="#ffd04b" background-color="#232323"  text-color="#fff"
                router>
               
                <el-menu-item index="/SearchCar">
                    <el-icon>
                        <Van />
                    </el-icon>
                    <span>查看车辆</span>
                </el-menu-item>


                <el-menu-item index="/rfault">
                    <el-icon>
                        <WarningFilled />
                        </el-icon>
                    <span>故障管理</span>
                </el-menu-item>

                

                

                


                
            </el-menu>
        </el-aside>
        <!-- 右侧主区域 -->
        <el-container>


            <!-- 头部区域 -->
            <CustomHeader :currentUserData="currentUserData" />


            <!-- 中间区域 -->
            <el-main>
                <router-view></router-view>
            </el-main>


            <!-- 底部区域 -->
            <el-footer>汽车租赁管理系统 ©2023 Created by jit-gxw</el-footer>

            
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #232323;

        &__logo {
            height: 120px;
            background: url('@/assets/login-l.jpg') no-repeat center / 199px 120px;
        }

        .el-menu {
            border-right: none;
        }
    }

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

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
</style>
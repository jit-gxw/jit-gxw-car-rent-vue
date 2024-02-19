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
                <el-menu-item index="/employee">
                    <el-icon>
                        <User />
                    </el-icon>
                    <span>员工管理</span>
                </el-menu-item>


                <el-menu-item index="/user">
                    <el-icon>
                        <UserFilled />
                        </el-icon>
                    <span>用户管理</span>
                </el-menu-item>


                <el-menu-item index="/vehicle">
                    <el-icon>
                        <Van />
                    </el-icon>
                    <span>车辆管理</span>
                </el-menu-item>

                <el-menu-item index="/classification">
                    <el-icon>
                        <MessageBox />
                    </el-icon>
                    <span>车辆分类管理</span>
                </el-menu-item>

                <el-sub-menu >
                    <template #title>
                        <el-icon>
                            <CreditCard />
                            </el-icon>
                        <span>租赁管理</span>
                    </template>
                    <el-menu-item index="/appointment">
                        <el-icon>
                            <Timer />
                        </el-icon>
                        <span>预约管理</span>
                    </el-menu-item>
                    <el-menu-item index="/order">
                        <el-icon>
                            <List />
                            </el-icon>
                        <span>订单管理</span>
                    </el-menu-item>
                    <el-menu-item index="/relet">
                        <el-icon>
                            <DocumentAdd />
                        </el-icon>
                        <span>续租管理</span>
                    </el-menu-item>
                </el-sub-menu>


                <el-menu-item index="/fault">
                    <el-icon>
                        <WarningFilled />
                        </el-icon>
                    <span>故障管理</span>
                </el-menu-item>

                <el-menu-item index="/report">
                    <el-icon>
                        <EditPen />
                        </el-icon>
                    <span>数据统计</span>
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
<script setup>
//调用route
import {useRouter} from 'vue-router'

import {
    Edit,
    Delete,
    Search
} from '@element-plus/icons-vue'
import { ref } from 'vue'
//查询员工消息调用接口
import {pageService,enableOrDisableEmployeeService,delEmployeeService} from '@/api/employee'
import { ElMessage } from 'element-plus';
const router = useRouter();


//数据模型
//记录
const tableData = ref([

]
);
//页码
const page=ref(1);
//每页记录数
const pageSize=ref(10);
//输入框
const input=ref('');
//总页数
const counts=ref(0);

const small = ref(false)
const background = ref(false)
const disabled = ref(false)


const pageQuery=ref({
    page:page,
    pageSize:pageSize,
    name:input
})
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
    await pageService(pageQuery.value).then((result) => {
        tableData.value=result.data.records;
        counts.value=result.data.total
        
    })
}
pageList();


//增加员工
const addEmployeeHandle =(st)=>{
    if(st==='add'){
        //添加操作
        router.push({ path: '/Employee/add',query: { st: st }})
    }else{
        //更新操作
        router.push({ path: '/Employee/add',query: { id: st }})
    }
    
}
const id=ref();
const status=ref();
//修改员工状态
const statusHandle=(row)=>{
    id.value=row.id
    status.value=row.status
    if (confirm('确认调整该账号的状态?', '提示')) {
    enableOrDisableEmployeeService({id:id.value,status: status.value===0 ? 1 : 0})
      .then((res) => {
        ElMessage.success('账号状态更改成功！');
        pageList();
      })
      .catch((err) => {
        ElMessage.error('请求出错了：' + err.message);
      });
  }

}
//删除员工
const delEmployeeHandle=(id)=>{
    if (confirm('确认删除该员工?', '提示')){
        delEmployeeService({id:id})
        .then((res)=>{
            ElMessage.success('员工删除成功！');
        pageList();
        }).catch((err) => {
        ElMessage.error('请求出错了：' + err.message);
      });

    }

}

</script>
<template>
    
    <el-card class="page-container">
        <template #header>
            
            <div class="header">

    
                <label style="margin-right: 5px">员工姓名：</label>
                <el-input
                v-model="input"
                class="w-50 m-2"
                placeholder="搜索姓名"
                :prefix-icon="Search"
                style="width: 30%;margin-right: 10px;margin-left: 0px"
                />
                <el-button style="margin-right: 700px"
                @click="pageList"
                >查询</el-button>



                <div class="extra">
                    <el-button type="primary" 
                    @click="addEmployeeHandle('add')">添加员工</el-button>
                </div>
            </div>
        </template>
        <el-table :data="tableData" style="width: 100%">

            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="用户名" prop="username"></el-table-column>


            <el-table-column label="职位" prop="roleId">

                <template v-slot="scope">
                {{scope.row.roleId===1?'管理员':scope.row.roleId===2?'员工':'维修工'}}
            </template>

            </el-table-column>
            

            <el-table-column label="性别" prop="sex">
            <template v-slot="scope">
                {{scope.row.sex==='0'?'女':'男'}}
            </template>
            
            
               
            </el-table-column>


            


            <el-table-column label="创建时间" prop="createTime"></el-table-column>
            <el-table-column label="修改时间" prop="updateTime"></el-table-column>


            <!-- <el-table-column label="账号状态" prop="status">
                
              <template v-slot="scope">
                <span
                @click="statusHandle(scope.row)"
                :disabled="scope.row.username === 'admin'"
                >{{scope.row.status===0?'启用':'禁用'}}</span>
            </template>
            
            </el-table-column> -->

            <el-table-column label="当前账号状态" prop="status">
                <template v-slot="scope">
                <el-button
                :disabled="scope.row.username === 'admin'"
                type="text"
                size="small"
                class="non"
                :class="{
                'disabled-text': scope.row.username === 'admin',
                blueBug: scope.row.status == '0',
                delBut: scope.row.status != '0',
              }"
              @click="statusHandle(scope.row)"
                >
                {{scope.row.status===0?'启用':'禁用'}}

                </el-button>
                </template>


            </el-table-column>


            <el-table-column label="操作" width="100">
                <template v-slot="scope">

                    <!-- 编辑 -->
                    <el-button :icon="Edit" circle plain type="primary" 
                    @click="addEmployeeHandle(scope.row.id)"
                    :disabled="scope.row.username === 'admin'"
                    ></el-button>

                    <!-- 删除 -->
                    <el-button :icon="Delete" circle plain type="danger"
                    :disabled="scope.row.username === 'admin'"
                    @click="delEmployeeHandle(scope.row.id)"
                    ></el-button>
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
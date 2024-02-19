<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import {useRouter} from 'vue-router'

//分类aip调用接口
import {pageService,addClassificationService,editClassificationService,enableOrDisableClassificationService,deleteClassificationService} from '@/api/classification'

import { ElMessage } from 'element-plus';

const router = useRouter();
/* ---------------------------------------初始化数据模型---------------------------------- */
//分类数据
const classificationData = ref([
       
])

//页码
const page=ref(1);
//每页记录数
const pageSize=ref(10);
//输入框
const input=ref('');
//总页数
const counts=ref(0);
//查询状态
const status=ref()

const small = ref(false)
const background = ref(false)
const disabled = ref(false)

//分页查询数据模型
const pageQuery=ref({
    page:page,
    pageSize:pageSize,
    name:input,
    status:status
})
//增加修改分类数据模型
const addDataModel=ref({
    name:'',
    sort:''

})
/* -------------------------------表单校验规则---------------------- */
const rules = {
    name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
    ],
    sort: [
        { required: true, message: '排序字段', trigger: 'blur' },
        { type: 'number', message: '排序字段必须是数字' }
    ]
}

/* ---------------------------------方法---------------------------------- */
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
        classificationData.value=result.data.records;
        counts.value=result.data.total
        
    })
}
pageList();

//控制添加弹窗
const dialogVisible = ref(false)


let title=''
//弹出增加或修改分类弹窗
const addClassificationHandle=(st)=>{
    if(st==='add'){
        //添加操作
        title="增加分类"
        dialogVisible.value = true
    }else{
        //修改操作
        title="修改分类"
        //传递数据
        addDataModel.value.name=st.name
        addDataModel.value.id=st.id
        addDataModel.value.sort=st.sort
        dialogVisible.value = true
    }
}
const formRef = ref(null)
//添加或修改分类提交
const submit=async (formEl)=>{
    //校验表单规则
    if (!formEl) return
    await formEl.validate(async (valid) =>{
        //通过
        if(valid){
            if(title==='增加分类'){
                addClassificationService(addDataModel.value)
                .then((result) => {
                    ElMessage.success("分类添加成功");
                    dialogVisible.value = false;
                    addDataModel.value=ref(null);
                    pageList();
                }).catch((err) => {
                    ElMessage.error("分类添加失败")
                });

            }else if(title==='修改分类'){
                editClassificationService(addDataModel.value)
                .then((result) => {
                    ElMessage.success("分类修改成功");
                    dialogVisible.value = false;
                    pageList();
                }).catch((err) => {
                    ElMessage.error("分类修改失败")
                });
            }else{
                ElMessage.error("未知操作")
            }
        }else{
            ElMessage.error('请正确填写每项数据');
        }
    })
}
//设置分类状态
const idForSet=ref();
const statusForSet=ref();
//修改分类状态
const statusHandle=(row)=>{
    idForSet.value=row.id
    statusForSet.value=row.status
    if (confirm('确认调整该分类的状态?', '提示')) {
    enableOrDisableClassificationService({id:idForSet.value,status: statusForSet.value===0 ? 1 : 0})
      .then((res) => {
        ElMessage.success('分类状态更改成功！');
        pageList();
      })
      .catch((err) => {
        ElMessage.error('分类状态更改失败');
      });
  }

}


//删除分类
const deleteClassificationHandle=(id)=>{
    if (confirm('确认删除该分类?', '提示')){
        deleteClassificationService({id:id})
        .then((res)=>{
        ElMessage.success('分类删除成功！');
        pageList();
        }).catch((err) => {
        ElMessage.error('分类删除失败！' );
      });

    }
}

</script>






<template>
    <el-card class="page-container">



        <template #header>
            <div class="header">

                <label style="margin-right: 0px">车辆分类名称：</label>
                <el-input
                v-model="input"
                class="w-50 m-2"
                placeholder="搜索分类名称"
                :prefix-icon="Search"
                style="width: 20%;margin-right: 10px;margin-left: 0px"
                />

                <label style="margin-right: 0px;margin-left: 0px">分类状态：</label>
                <el-select v-model="status" placeholder="选择搜索的分类状态" style="margin-right: 10px">
                  <el-option label="全部" value='' />
                  <el-option label="启用" value=0 />
                  <el-option label="禁用" value=1 />
                </el-select>
                


                <el-button style="margin-right: 390px"
                @click="pageList"
                >查询</el-button>


                <div class="extra">
                    <el-button type="primary"
                    @click="addClassificationHandle('add')"
                    >添加分类</el-button>
                </div>


            </div>
        </template>



        <el-table :data="classificationData" style="width: 100%">


            <el-table-column label="序号" width="100" type="index"> </el-table-column>


            <el-table-column label="分类名称" prop="name"></el-table-column>



            <el-table-column label="创建时间" prop="createTime"></el-table-column>

            <el-table-column label="修改时间" prop="updateTime"></el-table-column>


            <!-- <el-table-column label="状态" prop="status">

                <template v-slot="scope">
                <span
                >{{scope.row.status===0?'启用':'禁用'}}</span>
            </template>


            </el-table-column> -->

            <el-table-column label="当前分类状态" prop="status">
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
                {{scope.row.status===0?'启用':'禁用'}}

                </el-button>
                </template>
            </el-table-column>


            <el-table-column label="操作" width="100">
                <template v-slot="scope">
                    <el-button :icon="Edit" circle plain type="primary" 
                    @click="addClassificationHandle(scope.row)"
                    ></el-button>

                    
                    <el-button :icon="Delete" circle plain type="danger"
                    @click="deleteClassificationHandle(scope.row.id)"
                    ></el-button>
                </template>
            </el-table-column>



            <template #empty>
                <el-empty description="没有数据" />
            </template>


            <!-- 分页 -->
            
        </el-table>
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


    <!-- 添加弹窗 -->
    <el-dialog v-model="dialogVisible" :title="title" width="30%">
        <el-form :model="addDataModel" :rules="rules" label-width="100px" style="padding-right: 30px"
            ref="formRef"
        >
            <el-form-item label="分类名称" prop="name">
                <el-input v-model="addDataModel.name" minlength="1" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="排序字段" prop="sort">
                <el-input v-model.number="addDataModel.sort" minlength="1" maxlength="15"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" 
                @click="submit(formRef)"
                > 确认 </el-button>
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
//导入request。js请求
import request from '@/utils/request.js'
import { useTokenStore } from '@/store/token'

/* 

车辆分类管理 


*/
//分页查询
export const pageService =(params)=>{
   return request.get('/admin/classification/page',{params:params})
}

//增加分类
export const addClassificationService=(params)=>{
   return request.post('/admin/classification',params)
}
//修改分类
export const editClassificationService=(params)=>{
   return request.put('/admin/classification',params)
}
//修改分类状态
export const enableOrDisableClassificationService=(params)=>{
   return request({
      url: `/admin/classification/status/${params.status}`,
      method: 'post',
      params: { id:params.id }
    })
}
//删除分类
export const deleteClassificationService=(params)=>{
   return request.delete('/admin/classification',{params:params})
}
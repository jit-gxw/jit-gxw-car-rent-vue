//导入request。js请求
import request from '@/utils/request.js'
import { useTokenStore } from '@/store/token'

/* 

续租管理 


*/
//分页查询
export const reletPageService =(params)=>{
   return request({
      url: `/admin/relet/conditionSearch`,
      method: 'GET',
      params: params
    })
}
//获取待审核的数量
export const reletStatusNumberService=()=>{
   return request({
      url: `/admin/relet/number`,
      method: 'GET',
    })
}
   
//拒绝预约
export const reletRejectionService=(params)=>{
   return request.put('/admin/relet/rejection',params)
}
//通过审核
export const reletPassService=(params)=>{
   return request({
      url: `/admin/relet/pass`,
      method: 'PUT',
      data: { ...params }
    })
}
//根据id删除预约
export const reletDeleteService=(params)=>{
   return request({
      url: `/admin/relet`,
      method: 'DELETE',
      params: params
    })
}
//导入request。js请求
import request from '@/utils/request.js'
import { useTokenStore } from '@/store/token'

/* 

预约管理 


*/
//分页查询
export const appointmentPageService =(params)=>{
   return request.get('/admin/appointment/conditionSearch',{params:params})
}
//拒绝预约
export const appointmentRejectionService=(params)=>{
   return request.put('/admin/appointment/rejection',params)
}
//通过审核
export const appointmentPassService=(params)=>{
   return request({
      url: `/admin/appointment/pass`,
      method: 'PUT',
      params: params
    })
}
//根据id删除预约
export const appointmentDeleteService=(params)=>{
   return request({
      url: `/admin/appointment`,
      method: 'DELETE',
      params: params
    })
}

//获取待预约的数量
export const appointmentStatusNumberService=()=>{
   return request({
      url: `/admin/appointment/number`,
      method: 'GET',
    })
}
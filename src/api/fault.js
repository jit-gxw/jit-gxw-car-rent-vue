//导入request。js请求
import request from '@/utils/request.js'
import { useTokenStore } from '@/store/token'


/* 

故障管理 


*/
//故障报修
export const submitFaultService=(params)=>{
   return request.post("/admin/fault/submit",params)
}
//分页查询
export const pageFaultService =(params)=>{
   return request.get('/admin/fault/conditionSearch',{params:params})
}
//开始维修
export const startRepairService =(params)=>{
   return request.put('/admin/fault/startRepair',params)
}
//完成维修
export const completeRepairService =(params)=>{
   return request.put('/admin/fault/complete',params)
}
//维修失败
export const failRepairService =(params)=>{
   return request.put('/admin/fault/fail',params)
}
//根据id删除故障单
export const deleteRepairService =(params)=>{
   return request.delete('/admin/fault',{params:params})
}
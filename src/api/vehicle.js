//导入request。js请求
import request from '@/utils/request.js'
import { useTokenStore } from '@/store/token'


/* 

车辆信息管理 


*/
//分页查询
export const pageVehicleService =(params)=>{
   return request.get('/admin/vehicle/page',{params:params})
}
//根据id查询车辆
export const queryVehicleByIdService=(params)=>{
   return request.get(`/admin/vehicle/${params}`)
}
//增加车辆
export const addVehicleService=(params)=>{
   return request.post("/admin/vehicle",params)
}
//修改车辆信息
export const editVehicleService=(params)=>{
   return request.put("/admin/vehicle",params)
}
//修改车辆状态
export const enableOrDisableVehicleService=(params)=>{
   return request({
      url: `/admin/vehicle/status/${params.status}`,
      method: 'post',
      params: { id:params.id }
    })
}
//删除车辆
export const deleteVehicleService=(params)=>{
   return request.delete("/admin/vehicle",{params:params})
}

//导入request。js请求
import request from '@/utils/request.js'


//用户数量统计
export const getUserReport =(params)=>{
    return request({
       url: `/admin/report/userStatistics?begin=${params.begin}&end=${params.end}`,
       method: 'GET'
     })
 }
 //租赁数据统计
export const getReletReport =(params)=>{
  return request({
     url: `/admin/report/reletStatistics`,
     method: 'GET'
   })
}

//营业额统计
export const getTurnoverReport =(params)=>{
  return request({
     url: `/admin/report/turnoverStatistics?begin=${params.begin}&end=${params.end}`,
     method: 'GET'
   })
}

 //维修数据统计
 export const getRepairReport =(params)=>{
  return request({
     url: `/admin/report/repair`,
     method: 'GET'
   })
}


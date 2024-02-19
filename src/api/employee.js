//导入request。js请求
import request from '@/utils/request.js'
import { useTokenStore } from '@/store/token'

/* 员工管理 */

//提供调用登录接口的函数
export const loginService = (loginData)=>{
   return request.post('/admin/employee/login',loginData)
}


/* 员工分页查询 */
export const pageService =(params)=>{
   return request.get('/admin/employee/page',{params:params})
}

/* 增加员工 */
export const addEmployeeService=(params)=>{
   return request.post('/admin/employee',params)
}
/* 根据id查询员工 */
export const queryEmployeeByIdService=(id)=>{
   return request.get(`/admin/employee/${id}`)
}
/* 编辑员工 */
export const editEmployeeService=(params)=>{
   return request.put('/admin/employee',params)
}
//修改员工状态
export const enableOrDisableEmployeeService=(params)=>{
   return request({
      url: `/admin/employee/status/${params.status}`,
      method: 'post',
      params: { id:params.id }
    })
}
//删除员工
export const delEmployeeService=(params)=>{
   return request.delete('/admin/employee',{params:params})
}
//员工登出
export const loginOutService=()=>{
   return request.post('/admin/employee/logout')
}
//修改密码
export const editPassWordService=(params)=>{
   return request.put('/admin/employee/editPassword',params)
}
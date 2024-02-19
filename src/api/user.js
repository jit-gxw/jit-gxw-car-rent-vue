//导入request。js请求
import request from '@/utils/request.js'

/* 用户分页查询 */
export const UserPageService =(params)=>{
    return request.get('/admin/user/page',{params:params})
 }

 //删除用户
export const delUserService=(params)=>{
    return request.delete('/admin/user',{params:params})
 }

 //修改用户状态
export const SetUserStatusService=(params)=>{
    return request({
       url: `/admin/user/status/${params.status}`,
       method: 'post',
       params: { id:params.id }
     })
 }
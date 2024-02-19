//定制请求的实例

//导入axios  npm install axios
import axios from 'axios';

import { ElMessage } from 'element-plus'

//定义一个变量,记录公共的前缀  ,  baseURL
//const baseURL = 'http://localhost:8080';
const baseURL = '/api';
const instance = axios.create({baseURL})
import { useTokenStore } from '@/store/token';

//添加请求拦截器
instance.interceptors.request.use(
    (config)=>{
        //请求前的回调
        //添加token
        const tokenStore=useTokenStore();
        //判断有没有token
        if(tokenStore.token){
            config.headers.token = tokenStore.token
        }
        return config;
    },
    (err)=>{
        //请求错误的回调
        Promise.reject(err)
    }
)

import router from '@/router'
//添加响应拦截器
instance.interceptors.response.use(
    result=>{
        //判断状态码
        if(result.data.code === 1){
        return result.data;
        }else if (result.data.msg==='用户认证失败'||result.data.msg==='token非法'||result.data.msg==='用户未登录'||result.data.msg==='该账户没有权限访问'){
            ElMessage.error('请先登录');
            router.push('/login')
        }
        //操作失败
        //alert(result.data.msg?result.data.msg:'服务异常')
        ElMessage.error(result.data.msg?result.data.msg:'服务异常')
        //异步操作的状态转换为失败
        return Promise.reject(result.data)
    },
    err=>{
        //判断响应状态码
        if(err.response.status===401){  
            ElMessage.error('请先登录');
            router.push('/login')
        }else{
            ElMessage.error('服务异常');
            
        }
        return Promise.reject(err);//异步的状态转化成失败的状态
        
    }
)

export default instance;
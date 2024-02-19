//导入request。js请求
import request from '@/utils/request.js'
import { useTokenStore } from '@/store/token'

/* 

订单管理 


*/
//分页查询
export const OrderPageService =(params)=>{
   return request({
      url: `/admin/order/conditionSearch`,
      method: 'GET',
      params: params
    })
}
//各个状态的订单数量统计
export const OrderStatisticsService =()=>{
   return request({
      url: `/admin/order/statistics`,
      method: 'GET'
    })
}
//取消/退款订单
export const OrderCancelService=(params)=>{
   return request({
      url: `/admin/order/cancel`,
      method: 'PUT',
      data: { ...params }
    })
}
//现金支付
export const OrderPaymentService=(params)=>{
   return request({
      url: `/admin/order/payment`,
      method: 'PUT',
      params: params
    })
}
//租赁车辆
export const OrderConfirmService=(params)=>{
   return request({
      url: `/admin/order/confirm`,
      method: 'PUT',
      params: params
    })
}
//确认还车
export const OrderReturnService=(params)=>{
   return request({
      url: `/admin/order/returnVehicle`,
      method: 'PUT',
      params: params
    })
}
//确认最终订单金额
export const OrderAmountService=(params)=>{
   return request({
      url: `/admin/order/amount`,
      method: 'PUT',
      data: { ...params }
    })
}
//根据id删除订单
export const OrderDeleteService=(params)=>{
   return request({
      url: `/admin/order`,
      method: 'DELETE',
      params: params
    })
}
import { createRouter, createWebHistory} from 'vue-router'




//导入组件



const routes = [
  
  {
    path: '/',
    redirect:'/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "Login" */ '../views/Login')
  },
  
  {
    //管理员界面
    path: '/AdminLayout',
    name: 'AdminLayout',
    component: () => import(/* webpackChunkName: "AdminLayout" */ '../views/Layout/AdminLayout.vue'),
    redirect:'/employee',
    children:[
      {path: '/user',component: () => import( '../views/User')},
      {path: '/employee',component: () => import( '../views/Employee')},
      {path: '/vehicle',component: () => import( '../views/Vehicle')},
      {path: '/classification',component: () => import( '../views/Classification')},
      {path: '/fault',component: () => import( '../views/Fault')},
      {path: '/appointment',component: () => import( '../views/Appointment')},
      {path: '/relet',component: () => import( '../views/Relet')},
      {path: '/order',component: () => import( '../views/Order')},
      {path: '/report',component: () => import( '../views/Report')},
      {
        //增加员工
        path: '/employee/add',
        component:()=> import('../views/Employee/addEmployee.vue')
      },
      {
        //增加车辆
        path: '/vehicle/add',
        component:()=> import('../views/Vehicle/addVehicle.vue')
      }


    ]
  },
  {
    //员工界面
    path: '/EmployeeLayout',
    name: 'EmployeeLayout',
    component: () => import(/* webpackChunkName: "EmployeeLayout" */ '../views/Layout/EmployeeLayout.vue'),
    redirect:'/evehicle',
    children:[
      {path: '/evehicle',component: () => import( '../views/Vehicle')},
      {path: '/eclassification',component: () => import( '../views/Classification')},
      {path: '/eappointment',component: () => import( '../views/Appointment')},
      {path: '/erelet',component: () => import( '../views/Relet')},
      {path: '/eorder',component: () => import( '../views/Order')},
      {path: '/ereport',component: () => import( '../views/Report')},
      {
        //增加车辆
        path: '/evehicle/add',
        component:()=> import('../views/Vehicle/addVehicle.vue')
      }
    ]
  },
  {
    //维修工界面
    path: '/RepairmanLayout',
    name: 'RepairmanLayout',
    component: () => import(/* webpackChunkName: "RepairmanLayout" */ '../views/Layout/RepairmanLayout.vue'),
    redirect:'/SearchCar',
    children:[
      
      {path: '/SearchCar',component: () => import( '../views/Fault/SearchCar.vue')},
      {path: '/rfault',component: () => import( '../views/Fault')}


    ]
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

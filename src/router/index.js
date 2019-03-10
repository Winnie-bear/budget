import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
import Expenses from '@/views/expenses'
import Revenue from '@/views/revenue'
import Modify from'@/views/modify'
import Reports from'@/views/reports' 
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/expenses',
      name: 'expenses',
      component: Expenses
    },
    {
      path: '/revenue',
      name: 'revenue',
      component: Revenue
    },
    {
      path: '/modify',
      name: 'modify',
      component: Modify
    },
    {
      path: '/reports/*',
      name: 'reports',
      component: Reports
    },
  ]
})

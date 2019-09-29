import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '*',
    redirect: '/' //重定向
  }, {
    path: '/',
    name: 'Home',
    component: Home
  }]
})
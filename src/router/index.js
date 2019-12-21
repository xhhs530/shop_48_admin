import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: Index
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/index',
      name: 'index',
      component: Index
    }
  ]
})
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (token || to.pash === '/login') {
    next()
  } else {
    next('/login')
  }
})
export default router

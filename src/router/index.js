import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Index from '../components/Index.vue'
import Users from '../components/Users.vue'
import Roles from '../components/Roles.vue'
import Rights from '../components/Rights.vue'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [{
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
    component: Index,
    children: [
      {
        path: '/users',
        name: 'users',
        component: Users
      },
      {
        path: '/roles',
        name: 'roles',
        component: Roles
      },
      {
        path: '/rights',
        name: 'rights',
        component: Rights
      }

    ]
  }

  ]
})
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (token || to.path === '/login') {
    next()
  } else {
    next({ name: 'login' })
  }
})
export default router

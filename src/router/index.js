import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login.vue'
import Main from '../views/main.vue'
import TandaTerima from '../views/tandaterima.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta:{
      ifAuth: true
    }
  },
  {
    path: '',
    component: Main,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        redirect: 'tandaterima'
      },
      {
        path: 'tandaterima',
        name: 'tandaterima',
        component: TandaTerima
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const isAuthenticated= () => {
  if(localStorage.getItem("token"))
    return true
  else
    return false
}

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (isAuthenticated()) {
      next()
      return
    }
    next('/login')
  } else if (to.matched.some((record) => record.meta.ifAuth)){
    if (isAuthenticated()) {
      next('/')
      return
    }
    next()
  }
  next()
})
export default router

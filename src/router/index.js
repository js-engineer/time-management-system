import Vue from 'vue'
import VueRouter from 'vue-router'
import LogIn from '../views/LogIn.vue'
import SignUp from '../views/SignUp.vue'
import VerifyEmail from '../views/VerifyEmail.vue'
import MyRecords from '../views/MyRecords.vue'
import MyRecordDetail from '../views/MyRecordDetail.vue'
import Users from '../views/Users.vue'
import UserDetail from '../views/UserDetail.vue'
import GlobeRecords from '../views/GlobeRecords.vue'
import GlobeRecordDetail from '../views/GlobeRecordDetail.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'LogIn',
    component: LogIn
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/verify-email/:token',
    name: 'VerifyEmail',
    component: VerifyEmail
  },
  {
    path: '/',
    name: 'MyRecords',
    component: MyRecords
  },
  {
    path: '/myrecord/detail',
    name: 'MyRecordDetail',
    component: MyRecordDetail,
  },
  {
    path: '/users',
    name: 'Users',
    component: Users
  },
  {
    path: '/user/detail',
    name: 'UserDetail',
    component: UserDetail,
  },
  {
    path: '/globerecords',
    name: 'GlobeRecords',
    component: GlobeRecords
  },
  {
    path: '/globerecord/detail',
    name: 'GlobeRecordDetail',
    component: GlobeRecordDetail,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  if ( store.state.auth.user ) {
    // When user's authenticated
    if ( to.name !== 'LogIn' && to.name !== 'SignUp' && to.name !== 'VerifyEmail') {
      return next()
    } else {
      return next({ name: 'MyRecords' })
    }
  } else {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const res = await store.dispatch('auth/checkToken', { token })
        if (res.succeed) {
          // When user's authenticated, and page's refreshed
          if ( to.name !== 'LogIn' && to.name !== 'SignUp' && to.name !== 'VerifyEmail') {
            return next()
          } else {
            return next({ name: 'MyRecords' })
          }
        }
      }
    } catch(e) {
      console.log(e)
    }

    // When user isn't authenticated
    if ( to.name !== 'LogIn' && to.name !== 'SignUp' && to.name !== 'VerifyEmail') {
      return next({ name: 'LogIn' })
    } else {
      return next()
    }
  }
})

export default router

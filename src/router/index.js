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
import Settings from '../views/Settings.vue'
import ChangePassword from '../views/ChangePassword.vue'
import PermissionError from '../views/PermissionError.vue'
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
    path: '/own-record/detail',
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
    path: '/globe-records',
    name: 'GlobeRecords',
    component: GlobeRecords
  },
  {
    path: '/globe-record/detail',
    name: 'GlobeRecordDetail',
    component: GlobeRecordDetail,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
  {
    path: '/change-password',
    name: 'ChangePassword',
    component: ChangePassword,
  },
  {
    path: '/permission-error',
    name: 'PermissionError',
    component: PermissionError,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  const RegularDisallowedRoutes = ['Users', 'UserDetail', 'GlobeRecords', 'GlobeRecordDetail'];
  const ManagerDisallowedRoutes = ['GlobeRecords', 'GlobeRecordDetail'];
  let user = store.state.auth.user
  if ( user ) {
    // When user's authenticated
    if ( to.name !== 'LogIn' && to.name !== 'SignUp' && to.name !== 'VerifyEmail') {
      // When User's authenticated, but has no permission for routes
      if (user.role === 'regular' && RegularDisallowedRoutes.includes(to.name)
        || user.role === 'manager' && ManagerDisallowedRoutes.includes(to.name)) {
        return next({ name: 'PermissionError' })
      }
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
          user = store.state.auth.user
          // When user's authenticated, and page's refreshed
          if ( to.name !== 'LogIn' && to.name !== 'SignUp' && to.name !== 'VerifyEmail') {
            // User's authenticated, but has no permission for routes
            if (user.role === 'regular' && RegularDisallowedRoutes.includes(to.name) 
              || user.role === 'manager' && ManagerDisallowedRoutes.includes(to.name)) {
              return next({ name: 'PermissionError' })
            }
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

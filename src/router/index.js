import Vue from 'vue'
import VueRouter from 'vue-router'
import Cookies from 'js-cookie'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue';
import insertstore from '../views/insertstore.vue';
import insertuser from '../views/insertuser.vue';
import updateuser from '../views/updateuser.vue';
import storedata from '../views/storedata.vue';



Vue.use(VueRouter)

const routes = [
  {
    path: '/main',
    name: 'home',
    component: HomeView,
    meta: { requireAuth: true }
  },
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: { clearCookies: true }
  },
  {
    path: '/insertstore',
    name: 'insertstore',
    component: insertstore,
    meta: { requireAuth: true }
  },
  {
    path: '/insertuser',
    name: 'insertuser',
    component: insertuser,
    meta: { requireAuth: true }
  },
  {
    path: '/updateuser',
    name: 'updateuser',
    component: updateuser,
    meta: { requireAuth: true }
  },
  {
    path: '/storedata',
    name: 'storedata',
    component: storedata,
    props: route => ({
      MAccount: route.query.MAccount,
      Mname: route.query.Mname,
      Voucher:route.query.Voucher,
      Sid: route.query.Sid
    }),
    meta: { requireAuth: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  
  if (to.meta.clearCookies) {
    Cookies.remove('login');
  }
  // 目标路由在 meta 上是否有设置 requireAuth: true
  if (to.meta.requireAuth) {
    // 获取 Cookies 中的 login 信息并解析出 token
    const info = Cookies.get('login');
    
    // 如果 info 存在且可以解析
    if (info) {
      // 解析出 token
      const parsedInfo = JSON.parse(info);
      const token = parsedInfo.token;

      // 如果 token 存在且非空
      if (token) {
        next(); // 允许导航
      } else {
        // 如果 token 不存在或为空，重定向到 Login 页面
        next({ name: 'Login' });
      }
    } else {
      // 如果 Cookies 中没有 login 信息，重定向到 Login 页面
      next({ name: 'Login' });
    }
  } else {
    // 如果目标路由不需要认证，直接允许导航
    next();
  }
});



export default router

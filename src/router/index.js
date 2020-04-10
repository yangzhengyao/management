import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const Login = () => import("../views/login.vue");
const Home = () => import("../views/home.vue");

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    /*{
      path: "/",
      alias: "/login",
      name: "Login",
      meta: {
        title: "登陆"
      },
      component: Login
    },*/
    {
      path: "/",
      redirect: "/home",
      meta: {
        title: "后台审核"
      },
      component: Home
    },
    {
      path: "/home",
      name: "Home",
      meta: {
        title: "后台审核"
      },
      component: Home
    },
    //通配符
    {
      path: "*",
      redirect: "/"
    },
    {
      path: '/404',
      name:'404',
      component: () => import('@/views/errorPage/404'),
    }
  ]
});

router.beforeEach((to, from, next) => {
  // 路由发生变化修改页面title
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;

import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import NotFound from "../views/NotFound.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: Home,
    meta: {
      title: "Accueil",
    },
  },
  {
    path: "/posts",
    name: "Posts",
    meta: {
      title: "Posts",
    },
    // route level code-splitting
    // this generates a separate chunk (posts.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "posts" */ "../views/Posts.vue"),
  },
  {
    path: "/profile",
    name: "Profile",
    meta: {
      title: "Profile",
    },
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/Profile.vue"),
  },
  {
    path: "*",
    name: "NotFound",
    component: NotFound,
    meta: {
      title: "404 Not Found",
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.afterEach((to) => {
  document.title = to.meta.title;
});

export default router;

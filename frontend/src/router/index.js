import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: {
      title: "Groupomania - Connexion ou inscription",
    },
  },
  {
    path: "/posts",
    name: "Posts",
    meta: {
      title: "Groupomania - Publications",
    },
    // route level code-splitting
    // this generates a separate chunk (posts.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "posts" */ "../views/Posts.vue"),
  },
  {
    path: "/profile/:id",
    name: "Profile",
    meta: {
      title: "Grouponamia - Utilisateur",
    },
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/Profile.vue"),
  },
  {
    path: "*",
    name: "NotFound",
    component: () =>
      import(/* webpackChunkName: "NotFound" */ "../views/NotFound.vue"),
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

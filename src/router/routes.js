const routes = [
  {
    path: "/",
    component: () => import("../views/UploadsView.vue"),
  },
  {
    path: "/saved",
    component: () => import("../views/SavedView.vue"),
  },
  {
    path: "/login",
    component: () => import("../views/LoginView.vue"),
  },
];

export default routes;

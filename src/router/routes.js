const routes = [
  {
    path: "/",
    component: () => import("../views/UploadsView.vue"),
  },
  {
    path: "/saved",
    component: () => import("../views/SavedView.vue"),
  },
];

export default routes;

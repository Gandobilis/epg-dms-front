const routes = [
  {
    path: "/",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/records",
    component: () => import("../components/Records.vue"),
  },
];

export default routes;

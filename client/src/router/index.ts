import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import CardView from "../views/CardView.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "CardView",
    component: CardView
  }
];

const router = new VueRouter({
  routes
});

export default router;

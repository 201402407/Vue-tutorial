import Vue from "vue"
import VueRouter, { RouteConfig } from "vue-router"
import Home from "@/views/Home.vue"
import Test from "@/views/test/index.vue"
import Main from "@/views/main/index.vue"

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/test",
    name: "Test",
    component: Test,
  },
  {
    path: "/main",
    name: "Main",
    component: Main,
  },
]

const router = new VueRouter({
  mode: "history",
  base: "/spa",
  routes,
})

export default router

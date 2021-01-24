import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Game from "../views/Game.vue";
import Room from "../views/Room.vue";
import Page404 from "../views/Page404.vue";
import AllGames from "../views/AllGames.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/allgames",
    name: "AllGames",
    component: AllGames
  },
  {
    path: "/game/:code",
    name: "Game",
    component: Game
  },
  {
    path: "/room/:code",
    name: "Room",
    component: Room
  },
  {
    path: "*",
    name: "404",
    component: Page404
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;

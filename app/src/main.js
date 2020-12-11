import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import VueDarkMode from "@growthbunker/vuedarkmode";

Vue.config.productionTip = false;
Vue.use(VueDarkMode);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

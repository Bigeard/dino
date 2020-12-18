import Vue from "vue";
import VueIdb from "vue-idb";

Vue.use(VueIdb);

export default new VueIdb({
  version: 1,
  database: "dino",
  schemas: [{ user: "id, username, pass_id, updated_at" }],
  options: {
    user: {
      type: "list",
      primary: "id",
      label: "username",
      updated_at: "updated_at"
    }
  }
});

import Vue from "vue";
import VueIdb from "vue-idb";

Vue.use(VueIdb);

export default new VueIdb({
  version: 1,
  database: "dino",
  schemas: [
    { user: "id, _id, username, pass_id, updated_at" },
    {
      game:
        "_id, name, code, map, players, width, height, closeDialogWin, status, created_at, updated_at"
    }
  ],
  options: {
    user: {
      type: "list",
      primary: "id",
      label: "username",
      updated_at: "updated_at"
    },
    game: {
      type: "list",
      primary: "_id",
      label: "name",
      updated_at: "updated_at"
    }
  }
});

import Vue from "vue";
import Vuex from "vuex";
import VueIdb from "../idb";

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== "production";
let modules = VueIdb.modules;

export default new Vuex.Store({
  state: {
    hydrated: false
  },
  actions: {},
  mutations: {
    DELETE_INDEXED_DB() {}
  },
  modules: modules,
  getters: {
    hydrated: state => state.hydrated
  },
  plugins: [VueIdb.plugin],
  strict: debug
});

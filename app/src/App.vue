<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import axios from "axios";
export default {
  async beforeMount() {
    const user = await this.$db.user.get({ id: 0 });
    if ((!user || !user.pass_id) && this.$route.path !== "/") {
      this.$router.push("/");
    }
    const self = this;
    window.addEventListener("online", async () => {
      const actions = await this.$db.action.where({ status: "wait" }).toArray();
      actions.forEach(a => {
        axios
          .post("https://dino-srv.azurewebsites.net/api/game/action", a.body)
          .then(() => {
            self.$db.action.delete(a.id);
          })
          .catch(error => {
            console.error(error);
          });
      });
    });
  }
};
</script>

<style lang="scss">
html,
body {
  font-family: Helvetica, Arial;
  scrollbar-width: thin;
  background-color: #1b2431;
  text-align: center;
  color: #fff;
  margin: 0;
  width: 100%;
  background-size: 10px 10px;
  background-image: radial-gradient(
      circle at 50% 50%,
      #000,
      #000 1px,
      transparent 1px
    ),
    radial-gradient(circle at 0 0, #000, #000 1px, transparent 1px),
    radial-gradient(circle at 0 100%, #000, #000 1px, transparent 1px),
    radial-gradient(circle at 100% 0, #000, #000 1px, transparent 1px),
    radial-gradient(circle at 100% 100%, #000, #000 1px, transparent 1px);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

[class^="gb-"]:not(.gb-base-icon):not(.gb-base-heading) {
  font-size: 16px !important;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: #171e29;
}

::-webkit-scrollbar-thumb {
  background: #ffffff7a;
}

a:-webkit-any-link {
  color: #0093ee;
}
</style>

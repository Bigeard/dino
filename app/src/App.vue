<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  async beforeMount() {
    const user = await this.$db.user.get({ id: 0 });
    if (!user && !user.pass_id && this.$route.path !== "/") {
      this.$router.push("/");
    }
  }
};
</script>
<style lang="scss">
html,
body {
  scrollbar-width: thin;
  background-color: #1b2431;
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
}

#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
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
</style>

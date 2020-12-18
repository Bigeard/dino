<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
html,
body {
  background-color: #1b2431;
  margin: 0;
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
</style>

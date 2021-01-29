const { GenerateSW } = require("workbox-webpack-plugin");

module.exports = {
  // devServer: {
  //   host: "localhost",
  //   port: 8080
  // },
  pwa: {
    // configure the workbox plugin
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: "src/service-worker.js"
      // ...other Workbox options...
    }
  }
};

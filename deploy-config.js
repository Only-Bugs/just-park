// deploy-config.js
const path = require("path");

module.exports = {
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: true,
  },
  preview: {
    port: 5173,
  },
};

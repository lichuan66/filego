const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const WebpackBar = require("webpackbar");

module.exports = merge(common, {
  mode: "production",
  output: {
    publicPath: "/",
  },
  devtool: false,
  plugins: [new WebpackBar()],
});

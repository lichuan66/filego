const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "../src/main.tsx"),
  output: {
    path: path.resolve(__dirname, "../dist/filego"),
    filename: "bundle.js",
    publicPath: "/",
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
    alias: {
      "@": path.resolve(__dirname, "../src"),
      process: "process/browser",
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader", // 使用 PostCSS 处理 CSS
            options: {
              postcssOptions: {
                plugins: [
                  require("postcss-preset-env")({
                    /* 选项 */
                  }),
                  // 添加其他 PostCSS 插件，如 Autoprefixer
                  require("autoprefixer"),
                  require("tailwindcss"),
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 4096,
          fallback: "file-loader",
          name: "images/[name].[ext]",
          esModule: false,
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../src/index.html"),
    }),
    new CleanWebpackPlugin(),
    new Dotenv({
      silent: true,
    }),
  ],
};

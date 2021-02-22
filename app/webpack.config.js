const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
require('dotenv').config();

module.exports = {
  target: "web",
  entry: "./app/src/App.jsx",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "app.bundle.js",
  },
  devServer: {
    contentBase: "./build",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      }
    ]
  },
  resolve: {
    fallback: {
      util: false,
      fs: false,
    },
	extensions: ['*', '.js', '.jsx']
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "app/index.html",
    }),
    new webpack.DefinePlugin({
      __WEBSERVER_HOST__: `"${process.env.ROOT_URL}"`,
      __HOTWORD_NAME__: `"${process.env.HOTWORD_NAME}"`
    }),
    new webpack.ExternalsPlugin('commonjs', [
      'electron'
    ])
  ],
  devtool: "source-map"
};
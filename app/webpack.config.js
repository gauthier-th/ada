const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
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
      },
      {
        test: /\.svg$/,
        use: ['svg-loader']
      },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, use: ['url-loader?limit=100000'] }
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
    ]),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, "../node_modules/@tensorflow/tfjs/dist/tf.min.js"), to: "./modules" },
        { from: path.resolve(__dirname, "../node_modules/@tensorflow-models/speech-commands/dist/speech-commands.min.js"), to: "./modules" },
        { from: path.resolve(__dirname, "../node_modules/dat.gui/build/dat.gui.min.js"), to: "./modules" },
        { from: path.resolve(__dirname, "../node_modules/three/build/three.min.js"), to: "./modules/three" },
        { from: path.resolve(__dirname, "../node_modules/three/examples/js/shaders/CopyShader.js"), to: "./modules/three" },
        { from: path.resolve(__dirname, "../node_modules/three/examples/js/shaders/CopyShader.js"), to: "./modules/three" },
        { from: path.resolve(__dirname, "../node_modules/three/examples/js/postprocessing/EffectComposer.js"), to: "./modules/three" },
        { from: path.resolve(__dirname, "../node_modules/three/examples/js/postprocessing/RenderPass.js"), to: "./modules/three" },
        { from: path.resolve(__dirname, "../node_modules/three/examples/js/postprocessing/ShaderPass.js"), to: "./modules/three" },
        { from: path.resolve(__dirname, "../node_modules/three/examples/js/shaders/HorizontalBlurShader.js"), to: "./modules/three" },
        { from: path.resolve(__dirname, "../node_modules/three/examples/js/shaders/VerticalBlurShader.js"), to: "./modules/three" },
        { from: path.resolve(__dirname, "../node_modules/three/examples/js/shaders/FilmShader.js"), to: "./modules/three" },
        { from: path.resolve(__dirname, "../node_modules/three/examples/js/shaders/LuminosityHighPassShader.js"), to: "./modules/three" },
        { from: path.resolve(__dirname, "../node_modules/three/examples/js/postprocessing/UnrealBloomPass.js"), to: "./modules/three" },
        { from: path.resolve(__dirname, "../node_modules/@gauthier-th/bad-tv-shader/BadTVShader.js"), to: "./modules/three" },
      ],
    })
  ],
  devtool: "source-map"
};
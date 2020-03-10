"use strict"

const path = require("path")
// const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = {
  entry: {
    app: './src/client/script/app.js',
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /(\.js?$)|(\.jsx?$)/,
        use: 'babel-loader',
      }
    ]
  },
  mode: 'production',
  devtool: 'inline-source-map',
  // plugins: [
  //   new WorkboxPlugin.InjectManifest({
  //     swSrc: './src/client/script/sw.js',
  //     swDest: 'sw.js'
  //   })
  // ]
}

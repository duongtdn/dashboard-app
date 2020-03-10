"use strict"

const path = require("path")

module.exports = {
    entry: {
      dev: ["./src/client/script/app.js"]
    },
    output: {
      filename: "app.js",
      publicPath: "/assets/",
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          use: 'babel-loader',
          exclude: /node_modules/
        }
      ]
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      contentBase: path.join(__dirname, 'build'),
      publicPath: "/assets/",
      historyApiFallback: true
    }
}

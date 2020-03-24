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
      proxy: {
        '/api': {
          target: 'http://localhost:3400',
          pathRewrite: {'^/api' : ''}
        }
      },
      contentBase: path.join(__dirname, 'build'),
      publicPath: "/assets/",
      historyApiFallback: true
    }
}

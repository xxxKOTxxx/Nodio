const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const koutoSwiss = require('kouto-swiss');

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  context: path.resolve('src'),
  entry: ["./js/script"],
  resolve: {
      modulesDirectories: [
          "."
      ]
  },
  output: {
      path: path.join(__dirname, "www"),
      filename: "build.js"
  },
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV)
    }),
    new HtmlWebpackPlugin({
      title: 'Title',
      chunks: ['application', 'vendors'],
      filename: 'index.html',
      template: path.join('index.jade')
    })
  ],
  reslove: {
    modulesDirectorises: ['node_modules'],
    extensions: ['', '.js'],
  },
  resloveLoader: {
    modulesDirectorises: ['node_modules'],
    modulesTemplates: ['*-loader', '*'],
    extensions: ['', '.js'],
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "src"),
        ],
        loader: "babel-loader"
      },
      {
        test: /\.styl$/,
        include: [
          path.resolve(__dirname, "src"),
        ],
        exclude: [
          path.resolve(__dirname, "src/*/variables.styl"),
        ],
        loaders: ['style-loader', 'css-loader', 'stylus-loader'],
      },
      {
        test: /\.jade$/,
        include: [
          path.resolve(__dirname, "src"),
        ],
        loader: 'jade-loader'
      },
      {
        test: /\.(png|jpg|jpeg|svg|ttf|eot|woff|woff2)$/,
        include: [
          path.resolve(__dirname, "src"),
        ],
        loader: 'file?name=[path][name].[ext]'
      }
    ]
  },
  stylus: {
    use: [koutoSwiss()],
  },
  watch: NODE_ENV == 'development',
  watchOptions: {
    aggregateTimeout: 100
  },
  dewvtool: 'cheap-inline-module-source-map'
};

if(NODE_ENV == 'production') {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        unsafe: true
      }
    })
  )
};
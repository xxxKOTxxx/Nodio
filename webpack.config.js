const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const koutoSwiss = require('kouto-swiss');

// const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
  context: path.resolve('src'),

  path: path.resolve('./www'),
  resolve: {
    modulesDirectories: [
      ".",
      'node_modules',
      'bower_components'
    ],
    extensions: [
      '',
      '.js',
      '.es6',
      '.css',
      '.styl'
    ],
  },
  entry: {
    build: "./js/index"
  },
  output: {
    publicPath: './',
    path: path.join(__dirname, "www"),
    filename: '[name].js',
    // chunkFilename: '[chunkhash].js',
    pathinfo: true
  },
  plugins: [
    // new webpack.DefinePlugin({
    //   NODE_ENV: JSON.stringify(NODE_ENV)
    // }),
    new HtmlWebpackPlugin({
      title: 'Title',
      chunks: ['application', 'vendors'],
      filename: 'index.html',
      template: path.join('index.jade')
    }),
    // new webpack.optimize.CommonsChunkPlugin({name: 'commons', minChunks: 2})
  ],
  reslove: {
    modulesDirectorises: ['node_modules', 'src'],
    extensions: ['', '.js', '.es6', '.styl'],
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
        loaders: ['style-loader', 'css-loader?sourceMap?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]', 'stylus-loader?resolve url'],
      },
      {
        test: /\.jade$/,
        include: [
          path.resolve(__dirname, "src"),
        ],
        loader: 'jade-loader'
      },

      {
        test: /\.(png|jpg|jpeg|svg|ttf|otf|eot|woff|woff2)$/,
        include: [
          path.resolve(__dirname, "src"),
        ],
        loader: 'file?name=[path][name].[ext]'
      }
    ]
  },
  stylus: {
    use: [koutoSwiss()],
    // define: {
    //   'inline-image': require('stylus-inline-webpack')({
    //     limit: 50000
    //   })
    // }
  },
  watch: true,
  watchOptions: {
    aggregateTimeout: 100
  },
  // devtool: 'source-map',
  devtool: 'cheap-inline-module-source-map',
  devServer: {
    proxy: {
      '*': 'http://localhost:8080'
    },
    contentBase: 'www',
    hot: true,
    colors: true,
    progress: true
  },
};

// if(NODE_ENV == 'production') {
//   module.exports.plugins.push(
//     new webpack.optimize.UglifyJsPlugin({
//       compress: {
//         warnings: false,
//         drop_console: true,
//         unsafe: true
//       }
//     })
//   )
// };
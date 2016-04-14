var BABEL_LOADER = "babel?cacheDirectory&presets[]=es2015";

var webpack = require('webpack');

module.exports = {
  target: "web",
  cache: false,
  context: __dirname,
  devtool: false,
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ],
  module: {
    loaders: [
      { test: /\.js$/, loaders: [BABEL_LOADER], exclude: /node_modules/},
      { test: /node_modules\/geof-util\/.*\.js$/, loaders: [BABEL_LOADER]}
    ]
  }
};
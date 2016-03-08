module.exports = {
  module: {
    loaders: [
      { test: /\.js$/, loaders: ["babel?cacheDirectory&presets[]=es2015"], exclude: /node_modules/},
      { test: /\.worker\.js$/, loaders: ["worker"] }
    ]
  }
};
var BABEL_LOADER = "babel?cacheDirectory&presets[]=es2015";

module.exports = {
  module: {
    loaders: [
      { test: /\.js$/, loaders: [BABEL_LOADER], exclude: /node_modules/},
      { test: /\.worker\.js$/, loaders: ["worker", BABEL_LOADER] }
    ]
  }
};
var config = require('./webpack');

delete config.plugins;

module.exports = config;
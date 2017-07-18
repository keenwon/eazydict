'use strict';

const debug = require('./debug');
const config = require('./config');
const pkg = require('../package.json');

const plugins = Object.keys(pkg.dependencies)
  .filter(d => /^eazydict\-.+/.test(d))
  .filter(pluginModule => {
    if (!Array.isArray(config.enable) || !config.enable.includes(pluginModule)) {
      return false;
    }

    return true;
  });

module.exports = plugins;

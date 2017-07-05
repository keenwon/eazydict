'use strict';

const pkg = require('../package.json');

const plugins = Object.keys(pkg.dependencies)
  .filter(d => /^eazydict\-.+/.test(d))
  .map(pluginModule => {
    // eslint-disable-next-line
    return require(pluginModule);
  })

module.exports = plugins;

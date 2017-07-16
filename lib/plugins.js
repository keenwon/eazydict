'use strict';

const pkg = require('../package.json');
const debug = require('./debug');

const plugins = Object.keys(pkg.dependencies)
  .filter(d => /^eazydict\-.+/.test(d))
  .map(pluginModule => {
    debug(`load plugin ${pluginModule}`);

    // eslint-disable-next-line
    return require(pluginModule);
  })

module.exports = plugins;

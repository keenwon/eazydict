'use strict';

const path = require('path');
const loadModules = require('load-modules');

const plugins = loadModules
  .load('eazydict-*')
  .map(modulePath => {
    return require(path.join(__dirname, '../', modulePath));
  });

module.exports = plugins;

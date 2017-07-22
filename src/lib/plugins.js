'use strict';

const debug = require('./debug');
const config = require('./config');
const pkg = require('../../package.json');

let plugins = [];
const dependencies = Object.keys(pkg.dependencies)
  .filter(d => /^eazydict\-.+/.test(d));

/**
 * 根据配置文件刷选启用的 plugin
 * 同时保证输出的结果和配置文件中 plugin 的顺序一致
 */
if(Array.isArray(config.enable)) {
  plugins = config.enable.filter(plugin => {
    return config.enable.includes(plugin);
  });
}

module.exports = plugins;

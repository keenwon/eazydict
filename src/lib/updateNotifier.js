'use strict';

const updateNotifier = require('update-notifier');
const pkg = require('../../package.json');

/**
 * npm package 的更新检查
 */
function main() {
  updateNotifier({
    pkg: {
      name: pkg.name,
      version: pkg.version
    },
    updateCheckInterval: 1000 * 60 * 60 * 24 // 24h
  }).notify();
}

module.exports = main;
'use strict';

const updateNotifier = require('update-notifier');
const pkg = require('../../package.json');

/**
 * 测试，发布 npm 后修改
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
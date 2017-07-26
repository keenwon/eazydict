'use strict';

const updateNotifier = require('update-notifier');

/**
 * 测试，发布 npm 后修改
 */
function main() {
  updateNotifier({
    pkg: {
      name: 'public-ip',
      version: '0.9.2'
    },
    updateCheckInterval: 1000 * 60 * 30 // 30 min
  }).notify();
}

module.exports = main;
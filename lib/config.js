'use strict';

const debug = require('./debug');
const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const ini = require('ini');

const home = os.homedir();
const defaultConfigFile = path.join(__dirname, '..', '.eazydict.ini');
const userConfigFile = path.join(home, '.eazydict.ini');

// 创建用户配置
if (!fs.pathExistsSync(userConfigFile)) {
  fs.copySync(defaultConfigFile, userConfigFile);
}

let content = fs.readFileSync(userConfigFile, 'utf-8');
let config = {};
let userConfig;

try {
  userConfig = ini.parse(content);
} catch (err) {
  console.error(err); // eslint-disable-line no-console
  throw new Error(`用户配置文件解析错误: ${userConfigFile}`);
}

debug(`read config from ${userConfigFile}: %O`, userConfig);

// format config
Object.keys(userConfig).forEach(item => {
  let userConfigItem = userConfig[item];

  if (item === 'enable') {
    config[item] = userConfigItem.map(key => {
      return `eazydict-${key}`;
    });
  } else {
    config[`eazydict-${item}`] = Object.create(null);

    Object.keys(userConfigItem).forEach(key => {
      let value = userConfigItem[key];

      config[`eazydict-${item}`][key] = /^-?\d+\.?\d*$/.test(value)
        ? Number(value)
        : value;
    });
  }
});

debug('format config: %O', config);

module.exports = config;

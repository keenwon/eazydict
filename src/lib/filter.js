'use strict';

const config = require('./config');

let pluginsConfig = config.output;

function getCount(value) {
  let number = Number(value);

  if (!number || number < 0) {
    return Infinity;
  }

  return number;
}

/**
 * 根据配置文件过滤 plugin 输出的原始数据
 */
function filter(outputArray) {
  if (!pluginsConfig) {
    return outputArray;
  }

  return outputArray
    .filter(item => {
      // 输出前过滤出启用的插件
      return config.enable.includes(item.packageName);
    })
    .map(item => {
      // 完全没有插件配置 或 没有当前插件的，直接返回
      if (!pluginsConfig || !pluginsConfig[item.packageName]) {
        return item;
      }

      let pluginConfig = pluginsConfig[item.packageName];

      let exampleCount = getCount(pluginConfig.examples);
      let phoneticCount = getCount(pluginConfig.phonetics);
      let translateCount = getCount(pluginConfig.translates);

      item.examples = item.examples.slice(0, exampleCount);
      item.phonetics = item.phonetics.slice(0, phoneticCount);
      item.translates = item.translates.slice(0, translateCount);

      return item;
    });
}

module.exports = filter;

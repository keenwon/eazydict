'use strict';

const config = require('./config');

let pluginsConfig = config.output;

function getCount(value) {
  let number = Number(value);

  if (typeof number !== 'number' || number < 0) {
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

  let availableOutputArray = [];

  // 根据配置文件启用的插件过滤输出数据，同时保证顺序
  config.enable.forEach(packageName => {
    let data = outputArray
      .find(output => output.packageName === packageName);

    if (data) {
      availableOutputArray.push(data);
    }
  });

  return availableOutputArray.map(item => {
    let pluginName = item.packageName.replace(/^eazydict-/, '');

    // 完全没有插件配置 或 没有当前插件的，直接返回
    if (!pluginsConfig || !pluginsConfig[pluginName]) {
      return item;
    }

    let pluginConfig = pluginsConfig[pluginName];

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

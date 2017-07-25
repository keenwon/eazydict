'use strict';

/**
 * 生词本
 */

const co = require('co');
const sequelize = require('sequelize');
const WordBookModel = require('./model/WordBookModel');

/**
 * 保存生词
 */
function save(historyId) {
  return co(function* () {
    let wordBookModel = yield new WordBookModel();

    yield wordBookModel.create({
      historyId
    });

    return true;
  }).catch(error => {
    // historyId 已存在的话，忽略
    if (error.name === 'SequelizeUniqueConstraintError') {
      return true;
    }

    throw error;
  });
}

/**
 * 删除生词
 */
function remove(id) {
  return co(function* () {
    let wordBookModel = yield new WordBookModel();

    yield wordBookModel.destroy({
      where: {
        id
      }
    });

    return true;
  });
}

/**
 * 获取生词
 */
function getAll(offset = 0, limit = 100) {
  return co(function* () {
    let wordBookModel = yield new WordBookModel();
    let ids = yield wordBookModel.findAll({
      attributes: [
        'id', 'historyId', 'createdAt', 'updatedAt',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      offset,
      limit,
      order: [
        ['id', 'DESC']
      ]
    });

    console.log(ids);
  });
}

module.exports = {
  save,
  remove,
  getAll
};

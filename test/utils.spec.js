'use strict';

/* eslint-disable no-console, max-nested-callbacks */

const { pad, isExpired } = require('../src/utils');
const moment = require('moment');

const mocha = require('mocha');
const chai = require('chai');
chai.should();

describe('Utils 测试', function () {

  describe('# pad 测试', function () {

    let objs = [
      {
        str: 'test',
        width: 6,
        result: 'test  '
      },
      {
        str: '测试',
        width: 6,
        result: '测试  '
      },
      {
        str: 'test测试',
        width: 10,
        result: 'test测试  '
      },
      {
        str: 'test测试',
        result: 'test测试  '
      }
    ];

    objs.forEach((obj) => {
      let title = `test: string ${obj.str}, width: ${obj.width || 'default'}`;

      it(title, function () {
        return pad(obj.str, obj.width)
          .should.equal(obj.result);
      });
    });

  });

  describe('# isExpired 测试', function () {

    let objs = [
      {
        timeStr: moment().subtract(2, 'months').format(),
        range: '3M',
        result: false
      },
      {
        timeStr: moment().subtract(2, 'months').format(),
        range: '1M',
        result: true
      },
      {
        timeStr: moment().subtract(1, 'months').format(),
        result: false
      },
      {
        timeStr: moment().subtract(1, 'minutes').format(),
        range: '1s',
        result: true
      }
    ];

    objs.forEach((obj) => {
      let title = `test: time ${obj.timeStr}, range: ${obj.range || 'default'}`;

      it(title, function () {
        return isExpired(obj.timeStr, obj.range)
          .should.equal(obj.result);
      });
    });

  });

});
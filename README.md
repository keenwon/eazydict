# EazyDict

[![NPM version][npm-image]][npm-url]
[![Build Status][github-actions-image]][github-actions-url]
[![License][license-image]][license-url]
[![Lgtm Alerts][lgtm-alerts-image]][lgtm-alerts-url]
[![Lgtm Grade][lgtm-grade-image]][lgtm-grade-url]

简单易用的命令行词典，基于 Node 开发。支持 Linux、Mac（部分功能支持 Windows）

主要功能：

- 中英互译
- 输出翻译、音标、例句，并且可自由配置
- 支持以插件形式集成词典，默认包含: [Google](http://github.com/keenwon/eazydict-google), [Bing](http://github.com/keenwon/eazydict-bing), [Youdao](http://github.com/keenwon/eazydict-youdao)
- 本地缓存，可设置缓存时长
- 历史记录
- 生词本
- 支持代理（需要插件支持，内置的Google、Bing、Youdao插件已实现代理功能）
- 可查询程序状态：累计查询次数，生词个数等
- 更新提示：使用过程中会自动检测更新，并输出提示

效果图:

<center>
  <img src="docs/images/screenshot.gif">
</center>

目录:
<!-- TOC -->

- [环境](#环境)
- [安装](#安装)
- [运行](#运行)
- [插件](#插件)
- [配置文件](#配置文件)
- [本地缓存](#本地缓存)
- [DEBUG模式](#debug模式)
- [本地数据的备份与恢复](#本地数据的备份与恢复)
- [ChangeLog](#changelog)
- [License](#license)

<!-- /TOC -->

## 环境

运行 EazyDict 需要：

- Node ( **v8+** )
- NPM

安装方法请查看 Node 官网：[https://nodejs.org/](https://nodejs.org/)

## 安装

使用 npm 安装，执行：

```shell
npm i -g eazydict
```

当然也可以使用 [yarn](https://yarnpkg.com)：

```shell
yarn global add eazydict
```

> 注意：因为依赖了 node-sqlite3，会直接根据你的系统下载预编译版本，可能会比较慢，安装时可以添加 `--verbose` 查看详情。
>
> ```shell
> npm i -g eazydict --verbose
> ```
> 安装的相关详细信息可以查看: [link](https://github.com/mapbox/node-sqlite3#installing)

## 运行

直接执行 `eazydict` 或者 `eazydict --help` 可以看到详细的帮助信息：

```shell
$ eazydict --help

  Usage: eazydict <words...>

  简单易用的命令行词典 https://github.com/keenwon/eazydict


  Options:

    -s, --save  查询单词，同时保存到生词本
    -r, --raw   不转换为小写，查询原始的输入值
    -h, --help  output usage information


  Commands:

    lookup|l [options] <words...>  查询 words 的翻译
    version|v                      版本信息
    history|h [count]              显示最近查询的历史记录
    save|s                         保存上一次查询的单词、短语到生词本
    install|i <plugin-name>        安装插件
    wordbook|w                     打开生词本
    status                         显示统计信息

  Examples:

    查询短语 "fly in sky"：
    $ eazydict fly in sky
    $ eazydict lookup fly in sky
    $ eazydict l fly in sky

    查询短语 "hello"，同时保存到生词本：
    $ eazydict --save hello
    $ eazydict -s hello

    查看历史记录：
    $ eazydict history
    $ eazydict h

    保存上一次查询的单词、短语到生词本：
    $ eazydict save
    $ eazydict s

    打开生词本：
    $ eazydict wordbook
    $ eazydict w

    安装插件"eazydict-example":
    $ eazydict i eazydict-example
    $ eazydict install eazydict-example

    查看 EazyDict 版本信息:
    $ eazydict version
    $ eazydict v
```

## 插件

- [eazydict-google](http://github.com/keenwon/eazydict-google) (默认包含，无需安装)
- [eazydict-bing](http://github.com/keenwon/eazydict-bing) (默认包含，无需安装)
- [eazydict-youdao](http://github.com/keenwon/eazydict-youdao) (默认包含，无需安装)

如果你有兴趣开发更多的插件，可以参考文档: [EazyDict 插件开发](./docs/plugins.md)

## 配置文件

EazyDict 第一次运行的时候，会自动生成配置文件 .eazydict.yml 到用户的的 [Home](https://nodejs.org/api/os.html#os_os_homedir) 目录下。你可以根据自己的需求修改配置。参考 [.eazydict.yml](https://github.com/keenwon/eazydict/blob/master/.eazydict.yml)

## 本地缓存

EazyDict 会缓存你的查询过的单词。缓存使用 Sqlite，数据库文件在 `${home}/.eazydict/databasae.sqlite`

## DEBUG模式

当程序运行异常时（例如和你的配置文件不符），可以使用 DEBUG 模式查看更多信息

```shell
DEBUG=eazydict:core:* eazydict love
```

同样也可以单独查看插件的 DEBUG 信息，具体参数可以查看各插件文档 & 源码

## 本地数据的备份与恢复

原则上本地的数据只是缓存，使用过程中完全不用在意。但是如果你希望对数据进行备份，可以直接操作 `${home}/.eazydict/databasae.sqlite` 文件

- 备份：直接备份 `database.sqlite` 文件
- 恢复：将备份的文件放在 `${home}/.eazydict/` 目录
- 删除：直接删除 `database.sqlite` 文件

## ChangeLog

see [CHANGELOG.md](./CHANGELOG.md)

## License

MIT.

[npm-image]: https://img.shields.io/npm/v/eazydict.svg?maxAge=3600
[npm-url]: https://www.npmjs.com/package/eazydict
[github-actions-image]: https://github.com/keenwon/eazydict/workflows/unittest/badge.svg
[github-actions-url]: https://github.com/keenwon/eazydict/actions
[license-image]: https://img.shields.io/npm/l/eazydict.svg?maxAge=3600
[license-url]: https://github.com/keenwon/eazydict/blob/master/LICENSE
[lgtm-alerts-image]: https://img.shields.io/lgtm/alerts/g/keenwon/eazydict.svg?logo=lgtm&logoWidth=18&maxAge=3600
[lgtm-alerts-url]: https://lgtm.com/projects/g/keenwon/eazydict/alerts/
[lgtm-grade-image]: https://img.shields.io/lgtm/grade/javascript/g/keenwon/eazydict.svg?logo=lgtm&logoWidth=18&maxAge=3600
[lgtm-grade-url]: https://lgtm.com/projects/g/keenwon/eazydict/context:javascript
# EazyDict 插件开发

万一你需要为 EazyDict 开发插件，可以参考本文档

<!-- TOC -->

- [插件约束](#插件约束)
    - [命名](#命名)
    - [输出](#输出)
- [示例](#示例)
- [发布与安装](#发布与安装)

<!-- /TOC -->

## 插件约束

### 命名

插件命名必须以 `eazydict-` 开头，例如 `eazydict-google`

### 输出

插件可以"发送请求获取线上结果"，也可以"读取本地文件"。EazyDict 不关心插件执行过程，只要输出必须遵循如下规则：

- 必须输出 `Promise`
- `Promise` 的结果必须返回 [标准 Output 对象](https://github.com/keenwon/eazydict-standard-output)

## 示例

这里有一个简单的 Example 可供参考：[eazydict-example](https://github.com/keenwon/eazydict-example)。同时也可以参考内置插件：

- [eazydict-google](http://github.com/keenwon/eazydict-google)
- [eazydict-bing](http://github.com/keenwon/eazydict-bing)
- [eazydict-youdao](http://github.com/keenwon/eazydict-youdao)

## 发布与安装

开发完成后，请发布npm包，用户可通过 `eazydict install <your-plugin-name>` 安装。

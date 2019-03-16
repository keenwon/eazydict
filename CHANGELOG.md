# Changelog

## v2.0.0 (2019-03-17)

* Node.js 需要 v8+
* 升级插件到 2.0.0
* 升级依赖

## v1.2.2 (2018-05-20)

* 升级依赖，支持 node v10.x
* travis 添加 node v10.x

## v1.2.1 (2017-10-10)

* [[`d3279c3`](https://github.com/keenwon/eazydict/commit/d3279c353d07a9bf8a5ccbe6c17fe33dfdf308cd)] - fix [#3](https://github.com/keenwon/eazydict/issues/3)

## v1.2.0 (2017-10-09)

* [[`c616a9e`](https://github.com/keenwon/eazydict/commit/c616a9e7141f398ae1d4cfed08e30bffd6588fab)] - 默认转为小写查询，使用`--raw`选项查询原始输入值
* [[`88faaf7`](https://github.com/keenwon/eazydict/commit/88faaf7f0c59b0b2e7312270e91a3e99db22c455)] - status边框设置为纯白，保证终端有透明度时也能看到
* [[`8d7b87f`](https://github.com/keenwon/eazydict/commit/8d7b87f7f2f22451905ba092c7a62a7487abe1ab)] - 输入 `eazydict -s`，但是不输入单词时，直接展示help
* [[`7ba0b36`](https://github.com/keenwon/eazydict/commit/7ba0b365c253a9f1e0dbf1ad353dde5cd8bc6ccb)] - 升级依赖
* [[`bd3b780`](https://github.com/keenwon/eazydict/commit/bd3b780c77aa36e8a1979867335fe9cc3414e0d2)] - 解决 sequelize 的警告信息 [#2](https://github.com/keenwon/eazydict/issues/2)

## v1.1.2 (2017-08-05)

* [[`5bb58a8`](https://github.com/keenwon/eazydict/commit/5bb58a80ce1272f09592d464dd54f9bb3965d5eb)] - 添加插件安装功能 `eazydict install <plugin-name>`

## v1.0.6 (2017-08-04)

* [[`57a340c`](https://github.com/keenwon/eazydict/commit/57a340c81f1acf5a2d14b850f6cae7b4d404b016)] - 生词本：蓝色在黑底下不明显，改为绿色
* [[`bf16b21`](https://github.com/keenwon/eazydict/commit/bf16b21572dc0a301ef57bc6ab1b5e7b47a31a99)] - 生词本：搜索模式时，闪烁提示用户输入关键字

## v1.0.5 (2017-07-31)

* [[`dc6d5df`](https://github.com/keenwon/eazydict/commit/dc6d5dfd76f00413b9eb3cacb1fa89da9d4b21b2)] - fix bug: 修复通过配置文件禁用音标的问题
* [[`173bbdd`](https://github.com/keenwon/eazydict/commit/173bbddfe833513b8fa97932dbc2a13ea68cec44)] - fix bug: 修正cli help文案
* [[`9f5097c`](https://github.com/keenwon/eazydict/commit/9f5097c5cecb72aa1633668ab3064aafd88ba051)] - fix bug: 组件输出按照配置文件的顺序输出
* 添加 npm keywords

## v1.0.4 (2017-07-30)

* 发布第一个可用版本

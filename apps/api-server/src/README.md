# API Server Source Map

这不是最终框架代码，而是第一版后端领域骨架。

当前 `src/` 的作用：

- `server-manifest.js`
  用最简单的方式把后端核心模块写清楚，避免后面搭 NestJS 时边界漂移。
- `server-manifest.test.js`
  用单元测试保证当前模块地图不会被无意改坏。

后续真正接入 Web 框架时，建议按下面结构展开：

- `modules/auth`
- `modules/project`
- `modules/routing`
- `modules/billing`
- `modules/settlement`
- `modules/risk-control`

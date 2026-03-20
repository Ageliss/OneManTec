# API Server Source Map

这不是最终框架代码，而是第一版后端领域骨架。

当前 `src/` 的作用：

- `server-manifest.js`
  用最简单的方式把后端核心模块写清楚，避免后面搭 NestJS 时边界漂移。
- `module-layout.js`
  把 manifest 转成真实目录映射，保证模块文档和模块职责一致。
- `control-plane.js`
  把当前已落地的模块 service 聚合成一个简单入口，方便后续接路由层。
- `server-manifest.test.js`
  用单元测试保证当前模块地图不会被无意改坏。
- `modules/*/service.js`
  放每个模块当前可执行的核心服务逻辑。
- `modules/*/service.test.js`
  为每个模块 service 提供单元测试。
- `modules/*/README.md`
  把每个后端模块的职责单独写清楚。

后续真正接入 Web 框架时，建议按下面结构展开：

- `modules/auth`
- `modules/project`
- `modules/routing`
- `modules/billing`
- `modules/settlement`
- `modules/risk-control`

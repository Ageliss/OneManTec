# Module Layout

`api-server/src/modules` 目录按领域拆分控制面后端模块。

当前阶段先放模块说明，而不是直接塞进框架代码，目的是：

- 先把边界固定
- 让后续 NestJS 或 Fastify 接入时不乱
- 让每个模块职责能单独阅读

当前模块：

- `auth`
- `project`
- `routing`
- `billing`
- `settlement`
- `risk-control`

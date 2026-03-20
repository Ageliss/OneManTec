# API Server Source Map

这不是最终框架代码，而是第一版后端领域骨架。

当前 `src/` 的作用：

- `server-manifest.js`
  用最简单的方式把后端核心模块写清楚，避免后面搭 NestJS 时边界漂移。
- `module-layout.js`
  把 manifest 转成真实目录映射，保证模块文档和模块职责一致。
- `control-plane.js`
  把当前已落地的模块 service 聚合成一个简单入口，方便后续接路由层。
- `http-app.js`
  定义第一版 HTTP 路由，先提供预览型控制面接口。
- `http-server.js`
  用 Node 原生 `http` 把 `http-app` 挂出来，避免太早引入框架。
- `repositories/in-memory-repository.js`
  提供一层可替换的数据读取接口，后续可以平滑替换成 Prisma。
- `repositories/index.js`
  统一管理 repository 模式选择。当前支持 `memory` 和 `prisma` 两种模式。
- `repositories/contracts.js`
  明确 repository 需要满足的方法边界，后续换数据源时有基线。
- `repositories/runtime-config.js`
  解析 `API_SERVER_REPOSITORY_MODE`，让服务启动时明确自己在用哪种数据源。
- `repositories/prisma-client.js`
  负责按需加载 `@prisma/client`，并在依赖缺失时给出清楚错误。
- `use-cases/demo-request-preview.js`
  演示真实控制面如何从 repository 取数据，再经过 auth / routing / billing 链路。
- `use-cases/demo-settlement-preview.js`
  演示结算相关流程的预览输出。
- `use-cases/demo-risk-preview.js`
  演示风控检测和 risk event 生成。
- `use-cases/list-admin-models.js`
  返回控制面模型目录。
- `use-cases/list-admin-nodes.js`
  返回节点列表和健康汇总。
- `use-cases/resolve-deployment.js`
  负责按 project 和 model alias 找活动部署。
- `use-cases/mock-chat-completion.js`
  提供最小可用的 mock runtime 生成逻辑，并复用现有控制链。
- `validation.js`
  统一处理 HTTP 入口的基础字段校验。
- `server-manifest.test.js`
  用单元测试保证当前模块地图不会被无意改坏。
- `http-app.test.js`
  验证健康检查、请求预览、404 等接口行为。
- `modules/*/service.js`
  放每个模块当前可执行的核心服务逻辑。
- `modules/*/service.test.js`
  为每个模块 service 提供单元测试。
- `modules/*/README.md`
  把每个后端模块的职责单独写清楚。

当前可用接口：

- `GET /health`
- `GET /manifest`
- `GET /modules`
- `GET /admin/models`
- `GET /admin/nodes`
- `GET /v1/models`
- `POST /preview/auth`
- `POST /preview/budget`
- `POST /preview/route`
- `POST /preview/billing`
- `POST /preview/request`
- `POST /preview/demo-request`
- `POST /preview/deployment-resolution`
- `POST /preview/demo-settlement`
- `POST /preview/demo-risk`
- `POST /v1/chat/completions`

当前 runtime 接口特点：

- 支持从 `Authorization: Bearer ...` 读取 API key
- 支持通过 `x-request-id` 把请求 ID 透传回响应
- 成功和失败响应都走统一包裹结构

当前 repository 模式：

- 默认使用 `memory`
- 当 `API_SERVER_REPOSITORY_MODE=prisma` 时，会尝试加载 `@prisma/client`
- 这一步只是把接入点打通，还没有替换当前 demo 数据链路

后续真正接入 Web 框架时，建议按下面结构展开：

- `modules/auth`
- `modules/project`
- `modules/model`
- `modules/resource`
- `modules/deployment`
- `modules/routing`
- `modules/billing`
- `modules/settlement`
- `modules/risk-control`

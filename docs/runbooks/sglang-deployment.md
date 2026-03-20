# SGLang Deployment Runbook

## 1. Scope

这份 runbook 面向 `scheduler-worker` 这条支线，先约定 OneManTec 如何把一个 deployment task 翻译成可执行的 `SGLang` Docker 运行计划。

第一阶段目标不是直接做远程执行器，而是把下面几件事先固定下来：

- deployment task 的最小字段
- deployment task 到 scheduler payload 的生成规则
- deployment spec 的最小字段
- `docker run` / env / volume / health check 的生成规则
- 与主力开发主线对接时的边界

## 2. Current Contract

`apps/scheduler-worker/src/job-payload.js` 当前负责把 deployment task 转成 scheduler payload。

最小 deployment task 字段：

- `id`
- `deploymentId`
- `taskType`
- `modelAlias`
- `modelPath`

推荐补充字段：

- `projectId`
- `nodeId`
- `requestedGpuCount`
- `requestedPort`
- `tensorParallelSize`
- `runtimeConfig`

`apps/scheduler-worker/src/sglang-deployment.js` 当前输出：

- `containerName`
- `image`
- `environment`
- `volumes`
- `serverArgs`
- `dockerArgs`
- `dockerCommand`
- `healthCheck`
- `runtime`

## 3. Deployment Flow Boundary

1. `api-server`
   负责 deployment task API、状态查询、参数保存、权限校验。
2. `scheduler-worker`
   负责消费 deployment task、生成 job payload、生成 `SGLang` deployment plan、执行部署、轮询健康检查、写回状态。
3. node agent / SSH executor
   负责在目标机器上真正执行 `docker run`、`docker logs`、`docker rm -f` 等命令。

这样主力开发可以继续推进控制面和数据模型，这条支线则独立把 `scheduler-worker` 能力做深。

## 4. Health Check Rule

- readiness url: `GET /v1/models`
- interval: 10s
- timeout: 5s
- failure threshold: 12

判定 ready 后再把 deployment 状态切到 `running`，否则保持 `starting` 或进入 `failed`。

## 5. Collaboration Rule

- 不直接改主线已有 HTTP 路由语义，先补 worker 与契约。
- deployment 字段扩展时，优先新增字段，不轻易改已有字段名字。
- 每次改动都带 UT。
- 每天至少同步一次主力分支。
- PR 尽量按“契约 / worker 内核 / 执行器 / 状态回写 / 文档”分批提交。

## 6. Next Implementation Order

1. 把 deployment task schema 补充到 Prisma
2. 接入 node executor
3. 增加容器清理 / 重试 / rollback
4. 补 deployment history 和 task event 查询接口
5. 把 task status 回写接入控制面

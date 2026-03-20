# SGLang Deployment Runbook

## 1. Scope

这份 runbook 面向 `scheduler-worker` 这条支线，先约定 OneManTec 如何把一个 deployment task 翻译成可执行的 `SGLang` Docker 运行计划。

第一阶段目标不是直接做远程执行器，而是把下面三件事先固定下来：

- deployment spec 的最小字段
- `docker run` / env / volume / health check 的生成规则
- 与主力开发主线对接时的边界

## 2. Current Contract

当前 `apps/scheduler-worker/src/sglang-deployment.js` 已输出：

- `containerName`
- `image`
- `environment`
- `volumes`
- `serverArgs`
- `dockerArgs`
- `dockerCommand`
- `healthCheck`
- `runtime`

最小输入字段：

- `deploymentId`
- `modelAlias`
- `modelPath`

推荐补充字段：

- `nodeId`
- `gpuCount`
- `tensorParallelSize`
- `maxRunningRequests`
- `maxTotalTokens`
- `memFractionStatic`
- `extraEnv`
- `extraArgs`
- `volumes`

## 3. Deployment Flow Boundary

建议把部署链路拆成下面几层：

1. `api-server`
   负责 deployment task API、状态查询、参数保存、权限校验。
2. `scheduler-worker`
   负责选节点、生成 `SGLang` deployment plan、执行部署、轮询健康检查、写回状态。
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

- 不直接改主线已有 HTTP 路由语义，先补 worker 与 runbook。
- deployment 字段扩展时，优先新增字段，不轻易改已有字段名字。
- 每次改动都带 UT。
- 同步主力分支前先 `git fetch` + `git rebase`，减少大体积冲突。
- PR 尽量按“契约 / worker 内核 / 执行器 / 状态回写 / 文档”分批提交，不做超大 PR。

## 6. Next Implementation Order

1. 把 deployment task schema 补充到 Prisma
2. 增加 scheduler job payload 定义
3. 接入 node executor
4. 增加容器清理 / 重试 / rollback
5. 补 deployment history 和 task event

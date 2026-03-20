# scheduler-worker

调度任务执行器。

当前负责：

- `SGLang` 部署规划
- 启动参数与环境变量拼装
- deployment task 到 scheduler payload 的转换
- 健康检查与 runtime endpoint 约定

未来负责：

- 资源分配
- 部署任务执行
- 重试与补偿
- 节点健康感知

当前第一版实现位于 `src/sglang-deployment.js`，目标是先把部署契约稳定下来，再逐步接入真实队列、SSH/agent 执行器和部署状态回写。

其中 `src/job-payload.js` 负责把 deployment task 转成 scheduler 可消费的 payload。

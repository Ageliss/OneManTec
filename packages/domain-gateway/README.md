# domain-gateway

运行时网关、请求校验、转发、限流等领域模块。

当前已落地：

- `src/routing-policy.js`
  负责最基础的目标路由与故障回退
- `src/request-guard.js`
  负责把 key 校验、预算校验、路由选择串成一条清晰请求链
- `src/routing-policy.test.js`
  覆盖 pinned route、fallback、无可用路由等场景

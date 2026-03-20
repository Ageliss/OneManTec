# domain-auth

鉴权、权限、API Key、会话等领域模块。

当前已落地：

- `src/policy.js`
  负责 API Key 治理规则的纯函数实现
- `src/policy.test.js`
  覆盖模型限制、IP 限制、RPM 限制等核心单元测试

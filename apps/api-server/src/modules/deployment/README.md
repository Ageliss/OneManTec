# deployment module

负责：

- deployment listing
- endpoint resolution
- active target selection
- rollout state summaries

当前已落地：

- `service.js`
  封装部署列表和活动 endpoint 选择
- `service.test.js`
  验证活动部署解析

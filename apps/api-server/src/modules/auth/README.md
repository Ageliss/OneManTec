# auth module

负责：

- 登录
- 租户身份识别
- 角色权限
- API key 生命周期

后续建议再拆：

- `controllers`
- `services`
- `repositories`
- `dto`

当前已落地：

- `service.js`
  封装 API key policy 的创建和请求授权判断
- `service.test.js`
  验证最基本的授权路径

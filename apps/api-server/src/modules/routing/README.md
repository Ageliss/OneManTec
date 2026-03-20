# routing module

负责：

- 模型别名
- 路由规则
- fallback
- route target 选择

当前已在领域层有纯函数实现，后续这里负责把规则挂到 API 上。

当前已落地：

- `service.js`
  封装路由策略创建、路径预览、请求级路由判断
- `service.test.js`
  验证健康目标选择

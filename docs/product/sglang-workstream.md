# SGLang Workstream

## 1. Goal

这条工作流的目标是支持主力开发，而不是和主线抢边界。

因此这里遵循两个原则：

- 只做 `SGLang deployment` 直接相关的能力
- 优先落低耦合、易合并、可测试的代码

## 2. Suggested Division Of Work

主力开发建议继续负责：

- `api-server` 控制面主链路
- repository / schema 主干
- admin 侧 deployment task 表单与状态页

这条支线建议负责：

- `scheduler-worker` 内的 deployment planner
- deployment task 到 scheduler payload 的转换
- node 执行器适配层
- `SGLang` 参数模板与健康检查
- deployment runbook
- 相关单测和 runbook

## 3. Sync Rhythm

- 每天至少同步一次主力分支
- 每完成一个稳定的小切片就提 PR
- PR 合并前补运行说明和变更影响
- 避免跨模块大改，优先走薄切片

## 4. PR Slice Recommendation

推荐按以下顺序拆 PR：

1. deployment planner + unit tests
2. deployment task schema / contract fields
3. scheduler payload + task event contract
4. node executor abstraction
5. deployment status transition + retry policy

## 5. Quality Bar

- 新增逻辑必须带 UT
- 文档必须说明输入、输出、默认值和失败场景
- 不直接耦合到某个具体云厂商
- 不在主干未稳定前引入复杂编排系统

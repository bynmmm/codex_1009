# NOMI 情境化推荐 Demo

线上网站：[打开 Demo](https://nomi-cabin-lab-1016.wcmmm0707.chatgpt.site)（当前仅所有者可访问）。

支持规则模拟与豆包、OpenAI、DeepSeek 的真实模型调用，包含全舱 GUI、自动 TTS、灯光、NOMI 转向与表情、可拖动事件时间轴。API Key 由访问者在页面中填写，仅保留在页面内存；不提交至 GitHub。服务端固定转发至对应供应商官方 API。

本地启动：`node scripts/serve.mjs`，打开 http://127.0.0.1:4173。

验证：`node scripts/check.mjs` 和 `node scripts/check-providers.mjs`（后者使用模拟上游响应，不发送真实 API 请求）。

构建：`npm run build`；产物检查：`npm run validate`。托管为 Sites Worker ESM，部署产物包含同源 `/api/plan`，不使用 GitHub Pages。网站发布与 GitHub 同步为独立步骤；后续提交不会自动部署。

模型调用需有效 API Key 与模型权限。车辆能力与情境变化均为仿真，未控制真实车辆。时间轴、入场动效和语音已采用2倍速。

包含用户提供的参考界面图，仅用于本项目原型演示。

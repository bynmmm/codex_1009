# NOMI 情境化推荐 Demo

支持规则模拟与豆包、OpenAI、DeepSeek真实模型调用。包含全舱 GUI、NOMI TTS、灯光、表情和可拖动时间轴。

线上地址：https://nomi-cabin-lab-1016.wcmmm0707.chatgpt.site

当前线上网站仅所有者可访问。模型 API Key 由访问者在网页中填写，仅在本页内存保留，不提交到本仓库。网站通过同源服务端转发请求至所选供应商。

本地运行：`node scripts/serve.mjs`，访问 http://127.0.0.1:4173。

构建：`npm run build`；检查：`node scripts/check.mjs` 与 `node scripts/check-providers.mjs`。

车辆能力均为仿真；真实模型调用需有效供应商凭据。

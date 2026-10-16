# NOMI 情境化推荐 Demo

[公开网站](https://nomi-cabin-lab-1016.wcmmm0707.chatgpt.site)

支持豆包、OpenAI、DeepSeek 的真实服务端模型调用。访问者自行填写 API Key；密钥仅在页面内存保留，不写入仓库。

## 决策
- C 决定是否推荐，P/T 决定强弱。
- D 仅影响强推荐。弱推荐 D=0，立即出现，不因打扰成本延迟。
- VUI 独立判断 now / after-trigger / off。弱推荐可以播报，强推荐可以静默，语音可有独立事件节点。
- 模型结合历史行为记忆、当前任务、多人场景和候选能力，输出维度理由、情境适配摘要与引用规则 ID。

## 规则参考
`data/rule-catalog.json` 经用户明确授权公开，来自飞书“NOMI建议 - 故事集”全量集页面 UI。原表显示66条记录，当前整理61个主条目并合并同能力文案变体。visibleWhy 只记录可见副标题/需求线索；未读取的条件保留未知，不代表完整车端触发阈值。全量集未逐项核验上线状态。

## 运行与检查
`node scripts/serve.mjs` 启动本地服务。依次运行 `node scripts/check.mjs`、`node scripts/check-providers.mjs`、`node scripts/check-decisions.mjs`。模型接口测试模拟上游响应，不发真实请求。

`npm run build` 构建，`npm run validate` 校验 ESM。Sites Worker ESM 托管同源 `/api/plan`。GitHub 同步和线上发布为独立步骤。

全舱、灯光、NOMI 表情、车辆能力均为仿真。时间轴固定2倍速，可拖动定位、点选事件和顺序播放。语音由浏览器中文 TTS 合成，并未接入真实 NOMI 音色。

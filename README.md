# 🎮 AI 游戏交易所

**刀刀999，去他妈的交易艺术！**

将加密货币交易变成 RPG 战斗体验的游戏化 DeFi 交易平台。

---

## ✨ 核心特性

### 🎯 副本系统
- 每个持仓是一个**战斗副本**
- Boss 拟态化市场：ETH 牛魔王、BTC 熊魔王
- 难度分级：⭐ 初级（低波动） / ⭐⭐ 中级 / ⭐⭐⭐ 高级（高波动）

### ⚔️ 游戏化战斗界面
- **血量条**：健康度实时显示（距离清算价格）
- **护甲层数**：阻力位强度可视化
- **Boss 技能**：
  - 💥 突破阻力：大额买单涌入 +$12.3M
  - 🌪️ 成交量爆发：散户 FOMO 入场
  - 🐋 鲸鱼买入：巨鲸转入 5000 ETH
- **装备系统**：杠杆倍数切换（1x ~ 10x）

### 🤖 AI 智能团队
4 个专业 AI 实时协作：
- 📊 **盯盘 AI**：监控价格变化
- 📈 **市场分析 AI**：分析趋势和影响
- 🐦 **舆情分析 AI**：Twitter 情绪指数
- 🎯 **策略 AI**：执行交易策略

### 💬 AI 对话助手
- 投资策略咨询："现在适合入金吗？"
- 风险评估："我的持仓健康吗？"
- 智能建议："应该补仓还是止损？"
- 策略执行："帮我开一个 ETH 3x 副本"

### 📊 实时战况播报
资金流驱动的游戏化战斗描述：
- "大额卖单砸盘 -$4.7M，Boss 发动【旋风斩】，价格下跌 2.3%！"
- "新增多头持仓 +$8.2M，团队生命值恢复 +15%！"
- "巨鲸地址转入 3500 ETH，Boss 进入【狂暴】状态！"

---

## 🚀 快速开始

### 环境要求
- Node.js 22+
- pnpm 9+
- MySQL/TiDB 数据库

### 安装依赖
```bash
pnpm install
```

### 配置环境变量
复制 `.env.example` 到 `.env` 并填写必要的配置：
```env
DATABASE_URL=mysql://...
JWT_SECRET=your-secret-key
VITE_APP_TITLE=AI 游戏交易所
```

### 启动开发服务器
```bash
pnpm dev
```

访问 `http://localhost:3000` 开始体验！

---

## 🏗️ 技术栈

### 前端
- **React 19** + **Vite 6**
- **Tailwind CSS 4** - 现代化样式
- **shadcn/ui** - 高质量 UI 组件
- **Wouter** - 轻量级路由

### 后端
- **tRPC 11** - 类型安全的 API
- **Express 4** - Web 服务器
- **Drizzle ORM** - 数据库操作
- **Superjson** - 数据序列化

### 数据库
- **MySQL / TiDB** - 持久化存储

### AI 集成
- **Manus LLM API** - 智能对话
- **实时价格数据** - WebSocket 连接

---

## 📁 项目结构

```
client/
  src/
    pages/              # 页面组件
      OverviewPage.tsx  # 主页（副本列表 + AI 助手）
      InstanceDetailPage.tsx  # 副本详情（战斗界面）
    components/         # 可复用组件
      BattleView.tsx    # 战斗视图
      AIRealtimeAnalysis.tsx  # AI 实时分析
      MainAIChatWindow.tsx    # AI 对话窗口
      ManusSidebar.tsx  # 侧边栏导航
    
server/
  routers.ts            # tRPC 路由定义
  db.ts                 # 数据库查询
  _core/
    llm.ts              # LLM 集成
    
drizzle/
  schema.ts             # 数据库表结构
```

---

## 🎮 使用指南

### 1. 开启副本
- 点击"开启新副本"按钮
- 选择资产（ETH/BTC/SOL）
- 选择杠杆倍数（1x ~ 10x）
- 输入投资金额
- 查看预计清算价格

### 2. 进入战斗
- 点击副本卡片进入战斗界面
- 左侧：AI 三区域面板
  - 实时战况分析
  - AI 执行日志
  - 与总指挥沟通
- 右侧：战斗视图
  - 玩家 vs Boss 对战
  - 实时血量、护甲、技能
  - 战况播报

### 3. 操作装备
- 切换杠杆倍数（装备栏）
- 补充弹药（补仓）
- 更换武器（调整策略）
- 撤退（平仓）

### 4. AI 对话
- 点击右下角 AI 按钮
- 咨询投资策略
- 请求风险评估
- 执行交易指令

---

## 🛠️ 开发计划

### 已完成 ✅
- [x] 游戏化战斗界面
- [x] AI 三区域面板
- [x] 副本难度分级系统
- [x] 主页 AI 对话入口
- [x] Boss 拟态化系统
- [x] 装备系统（杠杆切换）
- [x] 钱包连接对话框

### 进行中 🚧
- [ ] 集成真实 LLM API
- [ ] 实现副本创建后端逻辑
- [ ] 完善 Web3 钱包集成
- [ ] 接入真实价格数据 API

### 计划中 📋
- [ ] 多人协作机制（世界 Boss）
- [ ] 战斗动画效果
- [ ] 成就系统
- [ ] 排行榜
- [ ] 社交功能

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 开源协议

MIT License - 自由使用、修改和分发

---

## 🙏 致谢

- [Manus](https://manus.im) - AI 开发平台
- [shadcn/ui](https://ui.shadcn.com) - UI 组件库
- [tRPC](https://trpc.io) - 类型安全 API
- [Tailwind CSS](https://tailwindcss.com) - CSS 框架

---

## 📧 联系方式

- GitHub Issues: [提交问题](https://github.com/416738994/ai-game-exchange/issues)
- 项目主页: [AI 游戏交易所](https://github.com/416738994/ai-game-exchange)

---

**刀刀999，去他妈的交易艺术！🎮⚔️**

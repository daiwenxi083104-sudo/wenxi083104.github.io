# 戴雯晞的个人作品集

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://wenxi083104.github.io)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> 🎵 音乐艺术背景的我，在找寻热爱与价值的路上步履不停，始终相信步步向青山的力量。

一个为**企业文化/行政方向求职**打造的个人作品集网站，包含个人介绍、技能展示、实用工具和日常生活记录。

---

## 🌟 在线预览

**🔗 [https://wenxi083104.github.io](https://wenxi083104.github.io)**

---

## 📋 项目介绍

### 我是谁
- **姓名**：戴雯晞
- **学历**：长沙师范学院音乐学专业 2026届毕业生
- **求职方向**：企业文化 / 行政管理
- **核心优势**：音乐学背景 + 创意策划 + 团队协调

### 四个关键词
1. **跨界破局** - 从音乐学跨界到企业文化领域
2. **生活策展** - 感知美好，留住微光
3. **主动进化** - 持续学习AI、设计、数据分析
4. **长期践行** - 知行合一，步步向青山

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **构建工具** | Vite 5.4 - 模块热替换、代码压缩、ES2015转译 |
| **前端基础** | HTML5 + CSS3 + ES6+ JavaScript |
| **模块化** | ES6 Modules (import/export) |
| **字体方案** | Google Fonts + 本地字体 fallback |
| **部署** | GitHub Pages |
| **代码规范** | Conventional Commits |

---

## 📁 项目结构

```
.
├── index.html              # 主页 - 个人介绍
├── life.html               # 生活记录模块
├── wheel.html              # 转盘大全导航
├── wheel-prize.html        # 抽奖转盘
├── wheel-decision.html     # 决策转盘
├── wheel-food.html         # 今天吃什么转盘
├── wheel-yesno.html        # 是/否转盘
├── draw.html               # 随机抽签工具
├── vote.html               # 投票小助手
├── notice.html             # 通知生成器
├── js/                     # JavaScript 模块
│   ├── utils.js           # 工具函数
│   ├── RandomDraw.js      # 抽签模块
│   ├── VoteHelper.js      # 投票模块
│   └── NoticeGenerator.js # 通知生成模块
├── fonts.css              # 字体定义
├── fonts/                 # 本地字体文件
├── vite.config.js         # Vite 配置
├── package.json           # 项目配置
└── .github/workflows/     # GitHub Actions
    └── deploy.yml         # 自动部署配置
```

---

## 🚀 本地运行

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式（热替换）

```bash
npm run dev
```

访问 http://localhost:3000

### 生产构建

```bash
npm run build
```

输出到 `dist/` 目录

### 预览构建结果

```bash
npm run preview
```

---

## ✨ 功能特性

### 1. 响应式设计
- 移动端优先适配
- 断点：768px（平板）、480px（手机）
- 触摸友好的按钮尺寸（padding: 14px 24px）

### 2. 性能优化
- ✅ `requestAnimationFrame` 动画（替代 setInterval）
- ✅ 图片懒加载 `loading="lazy"`
- ✅ 字体 `font-display: swap`
- ✅ 代码压缩（Terser）
- ✅ 减少动画偏好支持 `prefers-reduced-motion`

### 3. 可访问性（A11y）
- ✅ Skip Link 跳转
- ✅ Focus 样式（蓝色轮廓线）
- ✅ ARIA 标签
- ✅ 语义化 HTML 标签
- ✅ 键盘导航支持

### 4. 错误处理
- ✅ 投票防抖（300ms）+ 重复投票防护
- ✅ XSS 输入过滤
- ✅ 空列表提示
- ✅ 动画防重复点击

### 5. 用户体验
- ✅ Toast 提示（替代 alert）
- ✅ Loading 状态
- ✅ 操作反馈

---

## 📝 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式（不影响功能）
refactor: 重构
test: 测试相关
chore: 构建/工具相关
perf: 性能优化
```

### 示例

```bash
git commit -m "feat(vote): 添加投票防抖功能

- 300ms 防抖防止快速点击
- 防止同一轮重复投票
- 添加投票状态重置"
```

---

## 🔄 版本历史

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.1.0 | 2024 | 添加 Vite 构建工具、可访问性优化、性能优化 |
| v1.0.0 | 2024 | 初始版本，基础功能完成 |

---

## 🎯 未来计划

- [ ] 添加更多企业文化工具（会议纪要、排班表）
- [ ] 集成 AI 辅助功能（文案生成、图片优化）
- [ ] 添加数据分析可视化
- [ ] 支持多语言（i18n）
- [ ] PWA 离线支持

---

## 📞 联系方式

- 📧 邮箱：3284497028@qq.com
- 💬 微信：dwx07160831
- 📱 电话：18817142327

---

## 📄 许可证

[MIT License](LICENSE) © 2024 戴雯晞

---

<p align="center">感谢你的浏览，期待相遇 ✨</p>

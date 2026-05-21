<p align="center">
  <strong>📖 中文</strong>  ·  <a href="./README.en.md">English</a>
</p>

<p align="center">
  <img src="./banner.png" alt="ChatScope · AI 对话助手" width="520" />
</p>

# ChatScope · AI 对话助手

> ### **fold  ·  outline  ·  export**  your AI chats
>
> 轻量浏览器扩展。在 **ChatGPT** 和 **Claude.ai** 上一键折叠 AI 回复、按问题跳转、选择性导出 PDF 或 Markdown，支持中英双语界面。

![manifest](https://img.shields.io/badge/Manifest-V3-blue) ![browser](https://img.shields.io/badge/Edge%20%7C%20Chrome-supported-brightgreen) ![license](https://img.shields.io/badge/license-MIT-green) ![lang](https://img.shields.io/badge/UI-中%20%7C%20EN-orange)

---

## ✨ 功能 · Features

| 功能 | 说明 |
|---|---|
| 🗂 **折叠 / 展开 AI 回复** | 长对话里一键收起所有 AI 回复，只看自己问过的问题；任意一条单击即可单独展开 |
| 📋 **右侧浮动目录** | 列出所有用户提问，单击跳转到对应位置（带闪烁高亮） |
| ✏️ **自定义目录标题** | 双击目录项重命名，按 `Enter` 保存；自定义标题持久存在 `localStorage`，刷新页面也保留 |
| ☑️ **逐条勾选** | 每条消息旁边一个勾选框，决定哪些进入打印 / 导出。支持 `All / Question / Answer / None` 一键批量 |
| 🖨️ **打印 / PDF** | 把对话渲染成干净的打印页（无侧边栏、无 UI 噪音），自动调起浏览器打印对话框，可在窗口里选 75 % – 150 % 缩放。**解决浏览器原生打印 ChatGPT/Claude 内容不全的问题** |
| 📝 **导出 Markdown** | 保留代码块（带语言标签）、列表、表格、链接、引用、加粗等格式，下载为 `.md` 文件，可直接导入 Obsidian / Notion |
| 🌐 **中英双语** | 一键切换 UI 语言，自动根据浏览器语言初始化，选择持久保存 |
| 🔒 **零数据外传** | 全部逻辑在本地 content script 内执行，不申请任何网络/标签/存储 API 权限，不收集任何对话内容 |

---

## 📷 截图 · Screenshots

> _占位：上架前在 Edge / Chrome 上拍 3-4 张截图替换。建议尺寸 1280×800。_
> - `screenshots/1-fab.png` — 右下角浮动面板与状态徽章
> - `screenshots/2-toc.png` — 右侧问题目录、自定义标题
> - `screenshots/3-collapsed.png` — 折叠状态下的对话视图
> - `screenshots/4-export.png` — 打印窗口含缩放选择

---

## 🛠 安装 · Installation

### 方法 A：开发者模式加载（当前唯一方式，待上架后会有商店链接）

1. 下载源码（克隆仓库或下载 ZIP 并解压）
2. 在浏览器打开 `edge://extensions/` 或 `chrome://extensions/`
3. 右上角打开 **开发者模式 / Developer mode**
4. 左上角点 **加载已解压的扩展程序 / Load unpacked**
5. 选中本仓库根目录（含 `manifest.json` 的目录）
6. 打开 [chatgpt.com](https://chatgpt.com) 或 [claude.ai](https://claude.ai) 刷新即可

### 方法 B：应用商店（即将上线）

- 🛒 Chrome Web Store · _coming soon_
- 🛒 Edge Add-ons · _coming soon_

---

## ⌨️ 使用 · Usage

### 右下角浮动面板

| 按钮 / Button | 功能 / Function |
|---|---|
| `问题 N · 回复 M` | 状态徽章，实时显示检测到的问题数 / 回复数 |
| **折叠 / 展开** | 一键 toggle 全部 AI 回复的收起/展开状态 |
| **目录** | 显示 / 隐藏右侧问题目录 |
| **选择 ▾** | 批量勾选：`All` / `Question` / `Answer` / `None` |
| **导出 ▾** | 导出格式：`PDF` / `Markdown` |
| **EN / 中** | 切换 UI 语言 |

### 键盘快捷键 · Shortcuts

| 快捷键 | 功能 |
|---|---|
| `Alt+Shift+C` | 折叠 / 展开切换 |
| `Alt+Shift+E` | 强制全部展开 |
| `Alt+Shift+T` | 显示 / 隐藏目录 |
| `Alt+Shift+A` | 全选 / 反选所有勾选框 |
| `Alt+Shift+P` | 导出 PDF |
| `Alt+Shift+M` | 导出 Markdown |

### 单条操作

- **AI 回复右上角**："收起 / 展开"按钮（hover 时变明显）
- **任一消息左侧**：勾选框，控制是否进入打印 / 导出
- **目录项**：单击跳转、**双击重命名**

---

## 🔐 隐私 · Privacy

- ❌ 不收集任何对话内容
- ❌ 不向任何服务器发送数据
- ❌ 不需要登录、不读取 cookie
- ✅ 自定义标题、语言偏好仅保存在你浏览器的 `localStorage`
- ✅ Manifest 不申请 `tabs` / `storage` / `webRequest` 等权限，**仅** 在 `chat.openai.com` / `chatgpt.com` / `claude.ai` 注入脚本

---

## 🌍 兼容性 · Compatibility

| 浏览器 | 状态 |
|---|---|
| Microsoft Edge | ✅ 已测试（v1.7+） |
| Google Chrome | ✅ 应可用（Manifest V3 / Chromium 兼容） |
| Brave / Vivaldi / Arc | ✅ Chromium 内核，应可用 |
| Firefox | ⚠️ 未测试，可能需要适配 host_permissions |
| Safari | ❌ 未支持 |

---

## 🧱 项目结构 · Project structure

```
chatscope/
├── manifest.json      # MV3 扩展声明
├── content.js         # 全部业务逻辑（约 800 行，纯原生 JS）
├── styles.css         # UI 样式（约 400 行）
├── icon-16.png        # 工具栏 / 详情页小图标
├── icon-48.png        # 扩展页中等图标
├── icon-128.png       # 商店 / 加载详情大图标
├── banner.png         # README 横幅
├── README.md          # 中文（本文件）
├── README.en.md       # English
└── LICENSE
```

零依赖、零构建步骤、零网络请求。

---

## 🐛 已知限制 · Known limitations

- 网站 DOM 变更可能导致选择器失效：`[data-message-author-role]`（ChatGPT）与 `.font-claude-response` / `[data-testid="user-message"]`（Claude）。一旦失效，徽章会变红色 `问题 0 · 回复 0` —— 提 issue 即可。
- ChatGPT 代码块在导出窗口里**没有语法高亮**（依赖原页面的 highlight.js CSS），但保留缩进、字体、深色背景。
- 数学公式（KaTeX）在 Markdown 导出时会被转为纯文本。

---

## 🤝 贡献 · Contributing

欢迎提 issue / PR。改动建议：

1. Fork → 改动 → 在 ChatGPT 和 Claude.ai 上各测一遍
2. 注意：**禁止使用 inline `<script>` 注入页面 main world**——ChatGPT/Claude 的 CSP 会拒，Edge 会把扩展打入冷宫
3. 选择器尽量带 fallback（class 名 + data attribute 双保险）

---

## 📄 License

MIT — see [LICENSE](./LICENSE).

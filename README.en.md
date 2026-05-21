<p align="center">
  <a href="./README.md">中文</a>  ·  <strong>📖 English</strong>
</p>

<p align="center">
  <img src="./banner.png" alt="ChatScope · AI 对话助手" width="520" />
</p>

# ChatScope · AI 对话助手

> ### **fold  ·  outline  ·  export**  your AI chats
>
> A lightweight browser extension that turns long **ChatGPT** & **Claude.ai** conversations into something you can actually navigate, curate, and export.

![manifest](https://img.shields.io/badge/Manifest-V3-blue) ![browser](https://img.shields.io/badge/Edge%20%7C%20Chrome-supported-brightgreen) ![license](https://img.shields.io/badge/license-MIT-green) ![lang](https://img.shields.io/badge/UI-EN%20%7C%20中-orange)

---

## ✨ Features

| Feature | What it does |
|---|---|
| 🗂 **Collapse / Expand AI replies** | One click hides every AI reply so you can scan your own questions. Click a single reply's button to expand just that one. |
| 📋 **Floating TOC of questions** | A right-side panel lists every question you asked. Click an item to scroll to it with a brief highlight flash. |
| ✏️ **Editable, persistent titles** | Double-click any TOC item to rename it. Custom titles are saved to `localStorage` and survive page reloads. |
| ☑️ **Per-message checkboxes** | Each message has a checkbox controlling whether it's included in Print/Export. Use the `All / Question / Answer / None` dropdown for batch selection. |
| 🖨️ **Print / PDF (with zoom)** | Opens a clean print window without the site's sidebar/UI noise, then auto-triggers the browser print dialog. **Solves the well-known "ChatGPT print to PDF cuts off content" problem.** Choose 75%–150% zoom inside the window. |
| 📝 **Markdown export** | Saves selected messages as a `.md` file preserving code blocks (with language tag), lists, tables, links, blockquotes, etc. Drop straight into Obsidian / Notion. |
| 🌐 **Bilingual UI** | Toggle between English and 中文 with one click. Auto-detects from `navigator.language` on first install; choice is persisted. |
| 🔒 **Zero data exfiltration** | Pure content script. No network calls, no telemetry, no tabs/storage/webRequest permissions. Site is only matched on `chatgpt.com` / `chat.openai.com` / `claude.ai`. |

---

## 📷 Screenshots

> _Placeholder — replace with real shots before submitting to stores. Recommended size: 1280×800._
>
> - `screenshots/1-fab.png` — Floating panel with status badge
> - `screenshots/2-toc.png` — TOC with edited titles
> - `screenshots/3-collapsed.png` — Collapsed reply view
> - `screenshots/4-export.png` — Print window with zoom selector

---

## 🛠 Installation

### Option A — Load unpacked (current method)

1. Clone the repo or download a release ZIP and unpack it
2. Open `edge://extensions/` or `chrome://extensions/`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** (top-left)
5. Select this project's root directory (the folder containing `manifest.json`)
6. Visit [chatgpt.com](https://chatgpt.com) or [claude.ai](https://claude.ai) and refresh

### Option B — Web stores (coming soon)

- 🛒 Chrome Web Store · _pending submission_
- 🛒 Edge Add-ons · _pending submission_

---

## ⌨️ Usage

### Bottom-right floating panel

| Control | Function |
|---|---|
| `Q N · A M` badge | Live count of detected questions / answers |
| **Collapse / Expand** | Smart toggle: collapses all replies, or expands them if all were already collapsed |
| **TOC** | Show / hide the right-side question outline |
| **Select ▾** | Batch checkbox modes: `All` / `Question` / `Answer` / `None` |
| **Export ▾** | `PDF` (opens print window) or `Markdown` (downloads `.md`) |
| **EN / 中** | Toggle UI language |

### Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Alt+Shift+C` | Collapse / Expand toggle |
| `Alt+Shift+E` | Force-expand all |
| `Alt+Shift+T` | Show / hide TOC |
| `Alt+Shift+A` | Toggle select-all checkboxes |
| `Alt+Shift+P` | Export as PDF |
| `Alt+Shift+M` | Export as Markdown |

### Per-message controls

- **Top-right of each AI reply** — "Collapse / Expand" button (becomes opaque on hover)
- **Left edge of every message** — checkbox controlling print/export inclusion
- **TOC items** — single click to jump, **double-click to rename**

---

## 🔐 Privacy

- ❌ No conversation content is collected
- ❌ No data is sent to any server
- ❌ No login, no cookie reads
- ✅ Custom TOC titles and language choice live only in your browser's `localStorage`
- ✅ Manifest requests **no** `tabs`, `storage`, `webRequest`, or background permissions. Content script runs only on the three matched chat hosts.

You can audit the entire codebase in under 30 minutes — it's about 800 lines of plain JavaScript and 400 lines of CSS, no build step, no dependencies.

---

## 🌍 Compatibility

| Browser | Status |
|---|---|
| Microsoft Edge | ✅ Tested (v1.7+) |
| Google Chrome | ✅ Should work (Manifest V3, Chromium) |
| Brave / Vivaldi / Arc | ✅ Chromium-based, should work |
| Firefox | ⚠️ Untested; may need `host_permissions` adaptation |
| Safari | ❌ Not supported |

---

## 🧱 Project structure

```
chatscope/
├── manifest.json      # MV3 declaration
├── content.js         # All logic (~800 lines, vanilla JS)
├── styles.css         # UI styles (~400 lines)
├── icon-16.png        # toolbar / details icon
├── icon-48.png        # extensions page icon
├── icon-128.png       # store / install icon
├── banner.png         # README banner
├── README.md          # 中文
├── README.en.md       # English (this file)
└── LICENSE
```

Zero dependencies, zero build step, zero network traffic.

---

## 🐛 Known limitations

- **Selectors are tied to site DOM**: `[data-message-author-role]` for ChatGPT and `.font-claude-response` / `[data-testid="user-message"]` for Claude. If a site changes these, the badge shows red `Q 0 · A 0` — please open an issue.
- **No syntax highlighting in exported code blocks** (relies on the host page's `highlight.js` CSS). Indentation, monospaced font, and dark background are preserved.
- **Math (KaTeX)** is exported as rendered HTML for PDF but flattened to plain text for Markdown.

---

## 🤝 Contributing

PRs welcome. Please:

1. Fork → change → manually test on both ChatGPT and Claude.ai
2. **Never** inject inline `<script>` into the host page — ChatGPT/Claude's CSP rejects it and Edge will silently de-list your extension's permissions on that host
3. Prefer attribute selectors over class names; provide a fallback (e.g., class lookup + `data-testid` lookup) when possible

---

## 🪪 License

MIT — see [LICENSE](./LICENSE).

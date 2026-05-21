(function () {
  'use strict';

  const COLLAPSED_CLASS = 'cgpt-collapsed';
  const PLACEHOLDER_CLASS = 'cgpt-placeholder';
  const TOGGLE_CLASS = 'cgpt-toggle-btn';
  const CHECKBOX_CLASS = 'cgpt-msg-checkbox';
  const MSG_PROCESSED_ATTR = 'data-cgpt-msg-processed';
  const PROCESSED_ATTR = 'data-cgpt-processed';
  const FAB_ID = 'cgpt-collapser-fab';
  const TOC_ID = 'cgpt-toc';
  const STORAGE_PREFIX = 'cgpt-toc:';

  const ALL_MESSAGE_SELECTOR = [
    '[data-message-author-role="user"]',
    '[data-message-author-role="assistant"]',
    '[data-testid="user-message"]',
    '.font-claude-response',
  ].join(',');

  // ===== 国际化（中 / English） =====
  const I18N = {
    zh: {
      collapse: '收起',
      expand: '展开',
      toggleTip: '收起 / 展开此条回复',
      placeholder: '回复已收起 · 点击展开',
      placeholderTip: '点击展开此条回复',
      checkboxTip: '勾选 → 打印 / PDF 时包含这一条；取消勾选 → 跳过',
      collapseToggle: '折叠 / 展开', collapseToggleTip: '一键折叠或展开全部回复 (Alt+Shift+C)',
      toc: '目录',             tocTip: '显示/隐藏右侧目录 (Alt+Shift+T)',
      selectModePlaceholder: '选择 …',
      selectModeTip: '按类型批量勾选打印项',
      optNone: 'None',
      exportPlaceholder: '导出 …',
      exportTip: '把已勾选的消息导出为 PDF 或 Markdown',
      exportPDF: 'PDF (Alt+Shift+P)',
      exportMD: 'Markdown (Alt+Shift+M)',
      langSwitch: 'EN',        langSwitchTip: 'Switch to English',
      detecting: '检测中…',
      badgeTip: '检测到的问题数 · 回复数',
      badge: (u, a) => `问题 ${u} · 回复 ${a}`,
      questionList: '问题目录',
      tocToggleTip: '折叠 / 展开目录',
      tocItemTip: '单击跳转 · 双击编辑',
      tocItemOriginal: '原文：',
      noContent: '没有找到对话内容。请确认当前页面是 ChatGPT 或 Claude.ai 对话页。',
      noContentMD: '没有找到对话内容。',
      noSelection: '没有勾选任何消息。请至少勾选一条后再打印。',
      noSelectionMD: '没有勾选任何消息。请至少勾选一条后再导出。',
      noAssistant: '当前页面没有检测到 AI 回复。\n\n可能原因：页面还在加载、URL 不是 ChatGPT / Claude.ai 的对话页、或网站结构变了。请确认地址栏是 chatgpt.com 或 claude.ai 的对话页。',
      confirmPartialPrint: (s, t) => `将打印勾选的 ${s} / ${t} 条消息（${t - s} 条已跳过）。继续？`,
      confirmPartialMD: (s, t) => `将导出勾选的 ${s} / ${t} 条消息为 Markdown（${t - s} 条已跳过）。继续？`,
      popupBlocked: '弹窗被浏览器拦截。请在地址栏右侧允许此站点弹出窗口后重试。',
      pageTitle: 'AI 对话',
      me: '我', ai: 'AI',
      zoomLabel: '缩放：',
      printBtnInWin: '打印 / 另存为 PDF',
      closeBtn: '关闭',
      exportPrefix: '导出于',
      msgCount: (n) => `共 ${n} 条消息`,
      mdMe: (n) => `🙋 Q${n}`,
      mdAI: (n) => `🤖 A${n}`,
      mdExportLine: (time, n) => `> 导出于 ${time} · 共 ${n} 条消息`,
    },
    en: {
      collapse: 'Collapse',
      expand: 'Expand',
      toggleTip: 'Collapse / expand this reply',
      placeholder: 'Reply collapsed · click to expand',
      placeholderTip: 'Click to expand',
      checkboxTip: 'Check to include in Print / PDF; uncheck to skip',
      collapseToggle: 'Collapse / Expand', collapseToggleTip: 'Toggle collapse all replies (Alt+Shift+C)',
      toc: 'TOC',                  tocTip: 'Show / hide TOC (Alt+Shift+T)',
      selectModePlaceholder: 'Select …',
      selectModeTip: 'Batch select print items by type',
      optNone: 'None',
      exportPlaceholder: 'Export …',
      exportTip: 'Export selected messages to PDF or Markdown',
      exportPDF: 'PDF (Alt+Shift+P)',
      exportMD: 'Markdown (Alt+Shift+M)',
      langSwitch: '中',             langSwitchTip: '切换到中文',
      detecting: 'Detecting…',
      badgeTip: 'Detected questions / replies',
      badge: (u, a) => `Q ${u} · A ${a}`,
      questionList: 'Questions',
      tocToggleTip: 'Collapse / expand TOC',
      tocItemTip: 'Click to jump · Double-click to edit',
      tocItemOriginal: 'Original: ',
      noContent: 'No conversation found. Make sure you are on a ChatGPT or Claude.ai chat page.',
      noContentMD: 'No conversation found.',
      noSelection: 'No messages selected. Check at least one before printing.',
      noSelectionMD: 'No messages selected. Check at least one before exporting.',
      noAssistant: 'No AI replies detected on this page.\n\nPossible reasons: page is still loading, URL is not a ChatGPT / Claude.ai chat page, or site structure changed.',
      confirmPartialPrint: (s, t) => `Print ${s} of ${t} selected messages (${t - s} skipped). Continue?`,
      confirmPartialMD: (s, t) => `Export ${s} of ${t} selected messages to Markdown (${t - s} skipped). Continue?`,
      popupBlocked: 'Popup blocked by browser. Allow popups for this site and try again.',
      pageTitle: 'AI Chat',
      me: 'You', ai: 'AI',
      zoomLabel: 'Zoom:',
      printBtnInWin: 'Print / Save as PDF',
      closeBtn: 'Close',
      exportPrefix: 'Exported at',
      msgCount: (n) => `${n} messages`,
      mdMe: (n) => `🙋 Q${n}`,
      mdAI: (n) => `🤖 A${n}`,
      mdExportLine: (time, n) => `> Exported at ${time} · ${n} messages`,
    },
  };

  let currentLang = (() => {
    try {
      const saved = localStorage.getItem('cgpt-lang');
      if (saved && I18N[saved]) return saved;
    } catch (e) {}
    return (navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'zh';
  })();

  function t(key, ...args) {
    const v = (I18N[currentLang] && I18N[currentLang][key]) ?? I18N.zh[key];
    if (typeof v === 'function') return v(...args);
    return v != null ? v : key;
  }

  function setLang(lang) {
    if (!I18N[lang] || lang === currentLang) return;
    currentLang = lang;
    try { localStorage.setItem('cgpt-lang', lang); } catch (e) {}
    refreshUI();
  }

  function refreshUI() {
    // 重建 FAB 和 TOC（让它们用新语言）
    const fab = document.getElementById(FAB_ID);
    if (fab) fab.remove();
    const toc = document.getElementById(TOC_ID);
    if (toc) toc.remove();
    // 更新所有已存在的折叠按钮 / placeholder / checkbox 的文本和 tooltip
    document.querySelectorAll('.' + TOGGLE_CLASS).forEach((btn) => {
      let node = btn.parentElement;
      let collapsed = false;
      while (node && node !== document.body) {
        if (node.classList && node.classList.contains(COLLAPSED_CLASS)) { collapsed = true; break; }
        node = node.parentElement;
      }
      btn.textContent = collapsed ? t('expand') : t('collapse');
      btn.title = t('toggleTip');
    });
    document.querySelectorAll('.' + PLACEHOLDER_CLASS).forEach((p) => {
      p.textContent = t('placeholder');
      p.title = t('placeholderTip');
    });
    document.querySelectorAll('.' + CHECKBOX_CLASS).forEach((cb) => {
      cb.title = t('checkboxTip');
    });
    processAll();
  }

  // ===== 选择器 =====
  // 用户问题选择器（ChatGPT + Claude.ai）
  const USER_SELECTORS = [
    '[data-message-author-role="user"]',
    '[data-testid="user-message"]',
  ];

  // 助手回复选择器（带 fallback）
  function getAssistantTargets() {
    const set = new Set();
    // ChatGPT
    document
      .querySelectorAll('[data-message-author-role="assistant"]')
      .forEach((msg) => set.add(msg.closest('article') || msg));
    // Claude.ai 主选择器
    document
      .querySelectorAll('.font-claude-response')
      .forEach((msg) => set.add(msg));
    // Claude.ai 兜底：每个 turn 容器，如果里面没有 user-message，就当作 Claude 回复
    if (document.querySelector('.font-claude-response') === null) {
      document
        .querySelectorAll('div[data-test-render-count]')
        .forEach((turn) => {
          if (!turn.querySelector('[data-testid="user-message"]')) {
            set.add(turn);
          }
        });
    }
    return Array.from(set);
  }

  function getUserQuestions() {
    return Array.from(document.querySelectorAll(USER_SELECTORS.join(',')));
  }

  // 注：原先这里有一个 exposeDebugToMainWorld()，用 inline <script> 把
  // __cgptDebug 注入到页面 main world。但 ChatGPT/Claude.ai 的 CSP 严格禁止
  // inline script，会触发 "Executing inline script violates CSP" 错误并被 Edge
  // 视为扩展错误，进而降级扩展在该网站的注入行为。已彻底移除。
  // 如需诊断，使用前文提供的独立 IIFE 诊断片段（不依赖任何扩展暴露的全局）。

  // ===== 折叠/展开 =====

  function setCollapsed(target, collapsed) {
    target.classList.toggle(COLLAPSED_CLASS, collapsed);
    // 按钮可能在 target 内的任意层级（现在挂在 assistant 消息元素上），用普通后代选择器
    const btn = target.querySelector('.' + TOGGLE_CLASS);
    if (btn) btn.textContent = collapsed ? t('expand') : t('collapse');
  }

  function addControls(target) {
    // target 是折叠的容器（ChatGPT 是 <article>，Claude 是 .font-claude-response）
    // 把按钮挂到内部的助手消息元素本身（紧贴回复内容），位置更稳定
    const btnHost =
      target.querySelector('[data-message-author-role="assistant"]') ||
      (target.matches?.('.font-claude-response') ? target : null) ||
      target;

    // ─── 折叠按钮（自愈：每次检查是否存在） ───
    if (!btnHost.querySelector(':scope > .' + TOGGLE_CLASS)) {
      if (getComputedStyle(btnHost).position === 'static') {
        btnHost.style.position = 'relative';
      }
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = TOGGLE_CLASS;
      btn.textContent = target.classList.contains(COLLAPSED_CLASS) ? t('expand') : t('collapse');
      btn.title = t('toggleTip');
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        setCollapsed(target, !target.classList.contains(COLLAPSED_CLASS));
      });
      btnHost.appendChild(btn);
    }

    // ─── 折叠占位条（也自愈） ───
    const next = target.nextElementSibling;
    if (!next || !next.classList.contains(PLACEHOLDER_CLASS)) {
      const placeholder = document.createElement('div');
      placeholder.className = PLACEHOLDER_CLASS;
      placeholder.textContent = t('placeholder');
      placeholder.title = t('placeholderTip');
      placeholder.addEventListener('click', () => setCollapsed(target, false));
      target.after(placeholder);
    }

    // 兼容老逻辑：保留 PROCESSED_ATTR 但不再用它阻止重入
    target.setAttribute(PROCESSED_ATTR, 'true');
  }

  // ===== 消息勾选框（用于选择性打印） =====

  function getAllMessages() {
    return Array.from(document.querySelectorAll(ALL_MESSAGE_SELECTOR));
  }

  function addMessageCheckbox(msg) {
    // 不依赖 attribute 标记 —— React 可能清掉 checkbox 但保留 attribute，那样就再也补不回来
    // 改为直接检查 checkbox 是否实际存在
    if (msg.querySelector(':scope > .' + CHECKBOX_CLASS)) return;

    // 用 inline style 强制 position relative，避免依赖 :has() 选择器或被站点 CSS 覆盖
    if (getComputedStyle(msg).position === 'static') {
      msg.style.position = 'relative';
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = CHECKBOX_CLASS;
    // 保留之前用户的勾选状态（如果有的话用 dataset 记一下）—— 默认勾选
    checkbox.checked = msg.dataset.cgptChecked !== 'false';
    checkbox.title = t('checkboxTip');
    checkbox.addEventListener('click', (e) => e.stopPropagation());
    checkbox.addEventListener('change', (e) => {
      msg.dataset.cgptChecked = checkbox.checked ? 'true' : 'false';
    });
    msg.appendChild(checkbox);
  }

  function setCheckboxState(cb, checked) {
    cb.checked = checked;
    // 同步到所在 message 的 dataset，确保 React 重建 checkbox 时能恢复
    if (cb.parentElement) {
      cb.parentElement.dataset.cgptChecked = checked ? 'true' : 'false';
    }
  }

  function toggleSelectAll() {
    const boxes = document.querySelectorAll('.' + CHECKBOX_CLASS);
    if (boxes.length === 0) return;
    const allChecked = Array.from(boxes).every((cb) => cb.checked);
    boxes.forEach((cb) => setCheckboxState(cb, !allChecked));
  }

  // mode = 'all' | 'questions' | 'answers' | 'none'
  function applySelectionMode(mode) {
    const messages = getAllMessages();
    messages.forEach((msg) => {
      const cb = msg.querySelector(':scope > .' + CHECKBOX_CLASS);
      if (!cb) return;
      const isUser =
        msg.matches('[data-message-author-role="user"]') ||
        msg.matches('[data-testid="user-message"]');
      let checked;
      if (mode === 'all') checked = true;
      else if (mode === 'questions') checked = isUser;
      else if (mode === 'answers') checked = !isUser;
      else if (mode === 'none') checked = false;
      else return;
      setCheckboxState(cb, checked);
    });
  }

  function collapseAll() {
    const targets = getAssistantTargets();
    if (targets.length === 0) {
      alert(t('noAssistant'));
      return;
    }
    targets.forEach((t) => setCollapsed(t, true));
  }

  function expandAll() {
    getAssistantTargets().forEach((tgt) => setCollapsed(tgt, false));
  }

  // 智能 toggle：当前若全部已收起 → 展开；否则 → 全部收起
  function toggleCollapseAll() {
    const targets = getAssistantTargets();
    if (targets.length === 0) {
      alert(t('noAssistant'));
      return;
    }
    const allCollapsed = targets.every((tgt) => tgt.classList.contains(COLLAPSED_CLASS));
    targets.forEach((tgt) => setCollapsed(tgt, !allCollapsed));
  }

  // ===== 持久化的自定义标题 =====

  function hashString(s) {
    let hash = 5381;
    for (let i = 0; i < s.length; i++) {
      hash = ((hash << 5) + hash) ^ s.charCodeAt(i);
      hash = hash >>> 0;
    }
    return hash.toString(36);
  }

  function getStorageKey(rawText) {
    return STORAGE_PREFIX + location.pathname + ':' + hashString(rawText.slice(0, 200));
  }

  function loadCustomTitle(rawText) {
    try {
      return localStorage.getItem(getStorageKey(rawText));
    } catch (e) {
      return null;
    }
  }

  function saveCustomTitle(rawText, title) {
    try {
      if (title) localStorage.setItem(getStorageKey(rawText), title);
      else localStorage.removeItem(getStorageKey(rawText));
    } catch (e) {
      console.warn('[AI 对话工具] 无法保存标题到 localStorage：', e);
    }
  }

  // ===== 右侧浮动目录（TOC） =====

  function createTOC() {
    if (document.getElementById(TOC_ID)) return document.getElementById(TOC_ID);

    const toc = document.createElement('div');
    toc.id = TOC_ID;

    const header = document.createElement('div');
    header.className = 'cgpt-toc-header';

    const title = document.createElement('span');
    title.className = 'cgpt-toc-title';
    title.textContent = t('questionList');

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'cgpt-toc-toggle';
    toggle.title = t('tocToggleTip');
    toggle.textContent = '−';
    toggle.addEventListener('click', () => {
      const collapsed = toc.classList.toggle('cgpt-toc-collapsed');
      toggle.textContent = collapsed ? '+' : '−';
    });

    header.appendChild(title);
    header.appendChild(toggle);

    const list = document.createElement('div');
    list.className = 'cgpt-toc-list';

    toc.appendChild(header);
    toc.appendChild(list);
    document.body.appendChild(toc);

    return toc;
  }

  function enterEditMode(item, rawText, defaultText) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'cgpt-toc-input';
    input.value = loadCustomTitle(rawText) || defaultText;

    item.classList.add('cgpt-toc-editing');
    item.innerHTML = '';
    item.appendChild(input);
    input.focus();
    input.select();

    let committed = false;
    function commit() {
      if (committed) return;
      committed = true;
      const val = input.value.trim();
      if (val && val !== defaultText) {
        saveCustomTitle(rawText, val);
      } else {
        saveCustomTitle(rawText, null);
      }
      updateTOC();
    }
    function cancel() {
      committed = true;
      updateTOC();
    }

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        commit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancel();
      }
    });
    input.addEventListener('blur', commit);
    input.addEventListener('click', (e) => e.stopPropagation());
  }

  function flashElement(el) {
    el.classList.add('cgpt-flash');
    setTimeout(() => el.classList.remove('cgpt-flash'), 1500);
  }

  function updateTOC() {
    const toc = createTOC();
    const list = toc.querySelector('.cgpt-toc-list');
    const questions = getUserQuestions();

    // "因没有问题而自动隐藏" 用 cgpt-toc-no-content 类管理，
    // 不动 inline style，避免覆盖用户点 "目录" 按钮设置的 cgpt-toc-hidden 状态
    toc.classList.toggle('cgpt-toc-no-content', questions.length === 0);
    if (questions.length === 0) return;

    list.innerHTML = '';
    questions.forEach((q, i) => {
      const rawText = (q.textContent || '').trim();
      if (!rawText) return;

      const defaultText = rawText.slice(0, 30) + (rawText.length > 30 ? '…' : '');
      const customTitle = loadCustomTitle(rawText);
      const displayText = customTitle || defaultText;

      const item = document.createElement('div');
      item.className = 'cgpt-toc-item';
      if (customTitle) item.classList.add('cgpt-toc-custom');
      item.title = (customTitle ? t('tocItemOriginal') + rawText + '\n\n' : '') + t('tocItemTip');

      const indexSpan = document.createElement('span');
      indexSpan.className = 'cgpt-toc-index';
      indexSpan.textContent = (i + 1) + '.';

      const textSpan = document.createElement('span');
      textSpan.className = 'cgpt-toc-text';
      textSpan.textContent = displayText;

      item.appendChild(indexSpan);
      item.appendChild(textSpan);

      item.addEventListener('click', (e) => {
        if (item.classList.contains('cgpt-toc-editing')) return;
        q.scrollIntoView({ behavior: 'smooth', block: 'center' });
        flashElement(q);
      });
      item.addEventListener('dblclick', (e) => {
        e.preventDefault();
        e.stopPropagation();
        enterEditMode(item, rawText, defaultText);
      });

      list.appendChild(item);
    });
  }

  function toggleTOCVisibility() {
    const toc = createTOC();
    toc.classList.toggle('cgpt-toc-hidden');
  }

  // ===== 导出 / 打印 =====

  function escapeHTML(s) {
    return String(s).replace(/[<>&"']/g, (c) => ({
      '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  // ─── HTML → Markdown 转换器（覆盖 ChatGPT/Claude 常见结构） ───
  function nodeToMarkdown(node) {
    if (node.nodeType === 3) return node.textContent; // text
    if (node.nodeType !== 1) return '';
    const tag = node.tagName.toLowerCase();
    const inner = Array.from(node.childNodes).map(nodeToMarkdown).join('');
    switch (tag) {
      case 'h1': return `\n\n# ${inner}\n\n`;
      case 'h2': return `\n\n## ${inner}\n\n`;
      case 'h3': return `\n\n### ${inner}\n\n`;
      case 'h4': return `\n\n#### ${inner}\n\n`;
      case 'h5': return `\n\n##### ${inner}\n\n`;
      case 'h6': return `\n\n###### ${inner}\n\n`;
      case 'p':  return `\n\n${inner}\n\n`;
      case 'br': return '\n';
      case 'hr': return '\n\n---\n\n';
      case 'strong': case 'b': return `**${inner}**`;
      case 'em': case 'i':     return `*${inner}*`;
      case 'del': case 's':    return `~~${inner}~~`;
      case 'code': {
        // <pre><code> 由 <pre> 分支处理；这里只处理 inline code
        if (node.parentElement && node.parentElement.tagName.toLowerCase() === 'pre') return inner;
        return '`' + inner + '`';
      }
      case 'pre': {
        const codeEl = node.querySelector('code');
        const langMatch = (codeEl?.className || '').match(/language-([\w+-]+)/);
        const lang = langMatch ? langMatch[1] : '';
        const text = (codeEl ? codeEl.textContent : node.textContent) || '';
        return `\n\n\`\`\`${lang}\n${text.replace(/\n+$/, '')}\n\`\`\`\n\n`;
      }
      case 'a': {
        const href = node.getAttribute('href') || '';
        return href ? `[${inner}](${href})` : inner;
      }
      case 'img': {
        const src = node.getAttribute('src') || '';
        const alt = node.getAttribute('alt') || '';
        return src ? `![${alt}](${src})` : '';
      }
      case 'ul': case 'ol': {
        const items = Array.from(node.children).filter((c) => c.tagName.toLowerCase() === 'li');
        const lines = items.map((li, i) => {
          const prefix = tag === 'ul' ? '- ' : `${i + 1}. `;
          return prefix + nodeToMarkdown(li).trim().replace(/\n/g, '\n  ');
        });
        return '\n\n' + lines.join('\n') + '\n\n';
      }
      case 'li': return inner;
      case 'blockquote':
        return '\n\n' + inner.trim().split('\n').map((l) => '> ' + l).join('\n') + '\n\n';
      case 'table': {
        const rows = Array.from(node.querySelectorAll('tr'));
        if (!rows.length) return inner;
        const cells = (row) => Array.from(row.children).map((c) => c.textContent.trim().replace(/\|/g, '\\|'));
        const header = cells(rows[0]);
        const out = ['| ' + header.join(' | ') + ' |'];
        out.push('| ' + header.map(() => '---').join(' | ') + ' |');
        rows.slice(1).forEach((r) => out.push('| ' + cells(r).join(' | ') + ' |'));
        return '\n\n' + out.join('\n') + '\n\n';
      }
      default: return inner;
    }
  }

  function htmlToMarkdown(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    // 多余空行收敛为 2 个
    return nodeToMarkdown(tmp).replace(/\n{3,}/g, '\n\n').trim();
  }

  function downloadTextFile(filename, content, mime) {
    const blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function sanitizeFilename(s) {
    return String(s).replace(/[\/\\:*?"<>|]+/g, '_').replace(/\s+/g, ' ').trim().slice(0, 80) || t('pageTitle');
  }

  function cleanInnerHTML(el) {
    const clone = el.cloneNode(true);
    clone
      .querySelectorAll(
        'button, [role="button"], .cgpt-toggle-btn, .' + CHECKBOX_CLASS + ', [aria-hidden="true"]'
      )
      .forEach((n) => n.remove());
    return clone.innerHTML;
  }

  function collectMessages(onlySelected) {
    return Array.from(document.querySelectorAll(ALL_MESSAGE_SELECTOR))
      .filter((el) => {
        if (!onlySelected) return true;
        const cb = el.querySelector(':scope > .' + CHECKBOX_CLASS);
        return !cb || cb.checked; // 没注入到 checkbox 的默认包含
      })
      .map((el) => {
        const isUser =
          el.matches('[data-message-author-role="user"]') ||
          el.matches('[data-testid="user-message"]');
        return { role: isUser ? 'user' : 'assistant', html: cleanInnerHTML(el) };
      });
  }

  // 合并相邻同 role 的消息（ChatGPT 的"思考过程 + 答案"是两个独立的 assistant 元素，
  // 但逻辑上是一条回复 —— 导出时合并掉）
  function mergeAdjacentSameRole(messages) {
    const merged = [];
    messages.forEach((m) => {
      const last = merged[merged.length - 1];
      if (last && last.role === m.role) {
        last.html += '\n\n' + m.html;
      } else {
        merged.push({ role: m.role, html: m.html });
      }
    });
    return merged;
  }

  function buildExportHTML(messages) {
    const pageTitle = document.title || t('pageTitle');
    const exportTime = new Date().toLocaleString();
    // 注意：故意不设 page-break-inside: avoid —— 否则长消息无法跨页，
    // 浏览器会在前面留大块空白把整条挪到下一页。用户希望消息可以跨页"连着印"。
    const css = `
      *{box-sizing:border-box}
      body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",system-ui,sans-serif;line-height:1.65;color:#222;max-width:820px;margin:0 auto;padding:28px 24px}
      h1{font-size:20px;margin:0 0 4px}.meta{color:#888;font-size:12px;margin-bottom:24px}
      .msg{margin:14px 0;padding:12px 16px;border-radius:8px;break-inside:auto;page-break-inside:auto}
      .role{break-after:avoid;page-break-after:avoid}
      .msg.user{background:#f0f7ff;border-left:3px solid #3b82f6}
      .msg.assistant{background:#fafafa;border-left:3px solid #10a37f}
      .role{font-size:11px;font-weight:600;color:#666;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
      .content{word-break:break-word}.content p{margin:6px 0}
      .content pre{background:#1e1e1e;color:#d4d4d4;padding:12px;border-radius:6px;overflow-x:auto;font-size:13px;white-space:pre-wrap;word-wrap:break-word}
      .content code{font-family:"Menlo","SF Mono","Consolas",monospace}
      .content :not(pre)>code{background:rgba(0,0,0,.06);padding:1px 5px;border-radius:3px;font-size:.9em}
      .content table{border-collapse:collapse;margin:8px 0}
      .content table td,.content table th{border:1px solid #ddd;padding:6px 10px}
      .content img{max-width:100%;height:auto}
      .content blockquote{border-left:3px solid #ddd;margin:8px 0;padding-left:12px;color:#555}
      .toolbar{position:sticky;top:0;background:#fff;padding:12px 0;border-bottom:1px solid #eee;margin-bottom:16px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
      .toolbar button{background:#10a37f;color:#fff;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-size:13px}
      .toolbar button:hover{background:#0d8b6c}
      .toolbar label{font-size:13px;color:#666;margin-right:-4px}
      .toolbar select{font-size:13px;padding:5px 8px;border-radius:6px;border:1px solid #ccc;background:#fff;cursor:pointer}
      body{zoom:1}
      @media print{body{padding:0;max-width:none}.toolbar{display:none}.msg.assistant{background:transparent}}
    `;
    let qIdx = 0, aIdx = 0;
    const body = messages.map((m) => {
      let label;
      if (m.role === 'user') { qIdx += 1; label = `Q${qIdx}`; }
      else                    { aIdx += 1; label = `A${aIdx}`; }
      return `<div class="msg ${m.role}"><div class="role">${label}</div><div class="content">${m.html}</div></div>`;
    }).join('');
    // 注意：不能含任何 inline script 或 onclick 属性 —— Edge 给扩展打开的新窗口
    // 应用了 CSP（script-src 'self' …），任何 inline 都会被拦截并记为扩展错误。
    // 按钮的事件由 exportConversation() 在新窗口加载后通过 addEventListener 绑定。
    const zoomOptions = [
      { v: '0.75', t: '75%' },
      { v: '0.9',  t: '90%' },
      { v: '1',    t: '100%', selected: true },
      { v: '1.15', t: '115%' },
      { v: '1.3',  t: '130%' },
      { v: '1.5',  t: '150%' },
    ].map((o) => `<option value="${o.v}"${o.selected ? ' selected' : ''}>${o.t}</option>`).join('');
    const htmlLang = currentLang === 'en' ? 'en' : 'zh-CN';
    return `<!DOCTYPE html><html lang="${htmlLang}"><head><meta charset="utf-8"><title>${escapeHTML(pageTitle)}</title><style>${css}</style></head><body><div class="toolbar"><label for="cgpt-zoom-select">${t('zoomLabel')}</label><select id="cgpt-zoom-select">${zoomOptions}</select><button id="cgpt-print-btn" type="button">${t('printBtnInWin')}</button><button id="cgpt-close-btn" type="button">${t('closeBtn')}</button></div><h1>${escapeHTML(pageTitle)}</h1><div class="meta">${t('exportPrefix')} ${escapeHTML(exportTime)} · ${t('msgCount', messages.length)}</div>${body}</body></html>`;
  }

  function exportMarkdown() {
    const total = getAllMessages().length;
    const rawSelected = collectMessages(true);
    const selectedCount = rawSelected.length;

    if (total === 0) {
      alert(t('noContentMD'));
      return;
    }
    if (selectedCount === 0) {
      alert(t('noSelectionMD'));
      return;
    }
    if (selectedCount < total) {
      if (!confirm(t('confirmPartialMD', selectedCount, total))) return;
    }

    // 合并相邻同 role 消息后再 Q1/A1 单独编号
    const messages = mergeAdjacentSameRole(rawSelected);
    const pageTitle = document.title || t('pageTitle');
    const exportTime = new Date().toLocaleString();
    let md = `# ${pageTitle}\n\n`;
    md += `${t('mdExportLine', exportTime, messages.length)}\n\n---\n\n`;
    let qIdx = 0, aIdx = 0;
    messages.forEach((m) => {
      let heading;
      if (m.role === 'user') {
        qIdx += 1;
        heading = '## ' + t('mdMe', qIdx);
      } else {
        aIdx += 1;
        heading = '## ' + t('mdAI', aIdx);
      }
      md += `${heading}\n\n${htmlToMarkdown(m.html)}\n\n---\n\n`;
    });
    downloadTextFile(sanitizeFilename(pageTitle) + '.md', md, 'text/markdown;charset=utf-8');
  }

  function exportConversation() {
    const total = getAllMessages().length;
    const rawSelected = collectMessages(true);
    const selectedCount = rawSelected.length;

    if (total === 0) {
      alert(t('noContent'));
      return;
    }
    if (selectedCount === 0) {
      alert(t('noSelection'));
      return;
    }
    if (selectedCount < total) {
      if (!confirm(t('confirmPartialPrint', selectedCount, total))) return;
    }
    // 同样合并相邻同 role 消息，让"思考 + 答案"变成一条
    const messages = mergeAdjacentSameRole(rawSelected);
    const win = window.open('', '_blank');
    if (!win) {
      alert(t('popupBlocked'));
      return;
    }
    win.document.open();
    win.document.write(buildExportHTML(messages));
    win.document.close();

    // 在新窗口里通过 addEventListener 绑定按钮（不能用 inline onclick，被 CSP 拦）
    // 并自动调起打印对话框
    function bindAndPrint() {
      try {
        const doc = win.document;
        const printBtn = doc.getElementById('cgpt-print-btn');
        const closeBtn = doc.getElementById('cgpt-close-btn');
        const zoomSelect = doc.getElementById('cgpt-zoom-select');
        if (printBtn) printBtn.addEventListener('click', () => win.print());
        if (closeBtn) closeBtn.addEventListener('click', () => win.close());
        if (zoomSelect) {
          // 用 CSS zoom 属性，Chromium 系（Chrome/Edge）支持，并且会影响打印输出
          zoomSelect.addEventListener('change', () => {
            doc.body.style.zoom = zoomSelect.value;
          });
        }
        setTimeout(() => { try { win.print(); } catch (e) {} }, 400);
      } catch (e) {
        console.warn('[AI 对话工具] 打印窗口事件绑定失败', e);
      }
    }
    if (win.document.readyState === 'complete') {
      bindAndPrint();
    } else {
      win.addEventListener('load', bindAndPrint);
    }
  }

  // ===== 浮动控制面板 =====

  function createFAB() {
    if (document.getElementById(FAB_ID)) return;

    const fab = document.createElement('div');
    fab.id = FAB_ID;

    const buttons = [
      { text: t('collapseToggle'), cls: '',             title: t('collapseToggleTip'), onClick: toggleCollapseAll },
      { text: t('toc'),            cls: 'cgpt-fab-toc', title: t('tocTip'),            onClick: toggleTOCVisibility },
    ];

    // 状态徽章：实时显示检测到的问题/回复数
    const badge = document.createElement('div');
    badge.className = 'cgpt-fab-badge';
    badge.id = 'cgpt-fab-badge';
    badge.textContent = t('detecting');
    badge.title = t('badgeTip');
    fab.appendChild(badge);

    buttons.forEach(({ text, cls, title, onClick }) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cgpt-fab-btn ' + cls;
      btn.textContent = text;
      btn.title = title;
      btn.addEventListener('click', onClick);
      fab.appendChild(btn);
    });

    // ─── 按类型快速勾选（紫色下拉菜单） ───
    const select = document.createElement('select');
    select.className = 'cgpt-fab-btn cgpt-fab-select';
    select.title = t('selectModeTip');
    const opts = [
      { value: '', label: t('selectModePlaceholder'), disabled: true, selected: true },
      { value: 'all', label: 'All' },
      { value: 'questions', label: 'Question' },
      { value: 'answers', label: 'Answer' },
      { value: 'none', label: t('optNone') },
    ];
    opts.forEach((o) => {
      const opt = document.createElement('option');
      opt.value = o.value;
      opt.textContent = o.label;
      if (o.disabled) opt.disabled = true;
      if (o.selected) opt.selected = true;
      select.appendChild(opt);
    });
    select.addEventListener('change', () => {
      if (select.value) {
        applySelectionMode(select.value);
        // 保留当前选项显示，让你知道刚才选的是哪个模式
      }
    });
    fab.appendChild(select);

    // ─── 导出下拉（PDF / Markdown） ───
    const exportSelect = document.createElement('select');
    exportSelect.className = 'cgpt-fab-btn cgpt-fab-export';
    exportSelect.title = t('exportTip');
    const exportOpts = [
      { value: '', label: t('exportPlaceholder'), disabled: true, selected: true },
      { value: 'pdf', label: t('exportPDF') },
      { value: 'md',  label: t('exportMD') },
    ];
    exportOpts.forEach((o) => {
      const opt = document.createElement('option');
      opt.value = o.value;
      opt.textContent = o.label;
      if (o.disabled) opt.disabled = true;
      if (o.selected) opt.selected = true;
      exportSelect.appendChild(opt);
    });
    exportSelect.addEventListener('change', () => {
      const v = exportSelect.value;
      // 重置回 placeholder，导出是一次性动作而不是状态
      exportSelect.value = '';
      if (v === 'pdf') exportConversation();
      else if (v === 'md') exportMarkdown();
    });
    fab.appendChild(exportSelect);

    // ─── 语言切换按钮（中 / EN） ───
    const langBtn = document.createElement('button');
    langBtn.type = 'button';
    langBtn.className = 'cgpt-fab-btn cgpt-fab-lang';
    langBtn.textContent = t('langSwitch');
    langBtn.title = t('langSwitchTip');
    langBtn.addEventListener('click', () => setLang(currentLang === 'zh' ? 'en' : 'zh'));
    fab.appendChild(langBtn);

    document.body.appendChild(fab);
  }

  function updateBadge() {
    const badge = document.getElementById('cgpt-fab-badge');
    if (!badge) return;
    const u = getUserQuestions().length;
    const a = getAssistantTargets().length;
    badge.textContent = t('badge', u, a);
    badge.classList.toggle('cgpt-fab-badge-warn', u === 0 && a === 0);
  }

  // ===== 主循环 =====

  function processAll() {
    // FAB 可能被 React/SPA 框架在水合或路由切换时清掉，每次都补一次
    createFAB();
    getAllMessages().forEach(addMessageCheckbox);
    getAssistantTargets().forEach(addControls);
    updateTOC();
    updateBadge();
  }

  let debounceTimer = null;
  const observer = new MutationObserver(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(processAll, 300);
  });

  function init() {
    createFAB();
    processAll();
    observer.observe(document.body, { childList: true, subtree: true });
    // 在 content script 自己的 console 打印一次状态（DevTools 中可能需切换 context 才能看到）
    console.log('[ChatScope v1.8.0] init done · lang=' + currentLang, {
      url: location.href,
      userMessages: getUserQuestions().length,
      assistantTargets: getAssistantTargets().length,
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!e.altKey || !e.shiftKey) return;
    const key = e.key.toLowerCase();
    if (key === 'c') { e.preventDefault(); toggleCollapseAll(); }
    else if (key === 'e') { e.preventDefault(); expandAll(); }
    else if (key === 'p') { e.preventDefault(); exportConversation(); }
    else if (key === 't') { e.preventDefault(); toggleTOCVisibility(); }
    else if (key === 'a') { e.preventDefault(); toggleSelectAll(); }
    else if (key === 'm') { e.preventDefault(); exportMarkdown(); }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

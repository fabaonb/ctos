addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  if (url.pathname === '/') {
    const acceptLanguage = request.headers.get('accept-language') || 'en'
    const userLang = acceptLanguage.startsWith('zh') ? 'zh' : 'en'

    return new Response(generateHTML(userLang), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Vary': 'Accept-Language'
      }
    })
  }

  const acceptLanguage = request.headers.get('accept-language') || 'en'
  const userLang = acceptLanguage.startsWith('zh') ? 'zh' : 'en'
  const notFoundText = userLang === 'zh' ? '页面未找到' : 'Page not found'

  return new Response(notFoundText, {
    status: 404
  })
}

function generateHTML(lang = 'zh') {
  const translations = {
    zh: {
      title: 'Clash转Socks5代理工具',
      inputPlaceholder: '在此粘贴Clash配置文件内容...',
      copyOriginalBtn: '复制原本代码',
      startPortLabel: '起始端口：',
      clearBtn: '清空',
      outputPlaceholder: '生成的配置将显示在这里...',
      copyBtn: '复制生成代码',
      downloadBtn: '下载 .yaml 文件',
      successMessage: (count) => `转换成功 - 已转换 ${count} 个代理`,
      errorMessage: (error) => `错误: ${error}`,
      invalidConfig: "无效的Clash配置文件"
    },
    en: {
      title: 'Clash to SOCKS5 Proxy Converter',
      inputPlaceholder: 'Paste Clash config content here...',
      copyOriginalBtn: 'Copy Original',
      startPortLabel: 'Start Port:',
      clearBtn: 'Clear',
      outputPlaceholder: 'Generated config will appear here...',
      copyBtn: 'Copy Generated',
      downloadBtn: 'Download .yaml',
      successMessage: (count) => `Success - Converted ${count} proxies`,
      errorMessage: (error) => `Error: ${error}`,
      invalidConfig: "Invalid Clash config file"
    }
  }

  const t = translations[lang] || translations.zh

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <title>${t.title}</title>
  <style>
    :root {
      --primary: #0ff;
      --secondary: #f0f;
      --bg-dark: #121218;
      --bg-darker: #0a0a0f;
      --text: #e0e0e0;
      --text-dim: #a0a0b0;
      --success: #0f0;
      --warning: #ff0;
      --error: #f00;
    }
    
    @font-face {
      font-family: 'Cyber';
      src: url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
    }
    
    body {
      font-family: 'Share Tech Mono', monospace;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: var(--bg-dark);
      color: var(--text);
      background-image: 
        radial-gradient(circle at 10% 20%, rgba(0, 255, 255, 0.05) 0%, transparent 20%),
        radial-gradient(circle at 90% 80%, rgba(255, 0, 255, 0.05) 0%, transparent 20%),
        linear-gradient(to bottom, var(--bg-darker), var(--bg-dark));
      min-height: 100vh;
    }
    
    .container {
      background-color: rgba(18, 18, 24, 0.8);
      padding: 2rem;
      margin: 0 auto;
      max-width: 900px;
      border: 1px solid rgba(0, 255, 255, 0.2);
      box-shadow: 
        0 0 15px rgba(0, 255, 255, 0.1),
        0 0 30px rgba(255, 0, 255, 0.1);
      border-radius: 0;
      position: relative;
      overflow: hidden;
    }
    
    .container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--primary), var(--secondary));
      animation: scanline 3s linear infinite;
    }
    
    @keyframes scanline {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    
    h1 {
      color: var(--primary);
      font-size: 2rem;
      margin-top: 0;
      text-align: center;
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
      letter-spacing: 2px;
      position: relative;
      padding-bottom: 1rem;
    }
    
    h1::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 25%;
      right: 25%;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--primary), transparent);
    }
    
    textarea {
      background-color: rgba(10, 10, 15, 0.7);
      border: 1px solid rgba(0, 255, 255, 0.3);
      border-radius: 0;
      padding: 1rem;
      width: 100%;
      height: 200px;
      margin: 1rem 0;
      box-sizing: border-box;
      resize: none;
      color: var(--text);
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }
    
    textarea:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
    }
    
    .controls {
      margin: 1.5rem 0;
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .port-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .port-range {
      color: var(--primary);
      text-align: center;
      margin: 0.5rem 0;
      font-size: 0.9rem;
    }
    
    label {
      color: var(--text-dim);
      font-size: 0.9rem;
    }
    
    input[type="number"] {
      background-color: rgba(10, 10, 15, 0.7);
      border: 1px solid rgba(0, 255, 255, 0.3);
      color: var(--text);
      padding: 0.5rem;
      border-radius: 0;
      width: 6rem;
      font-family: 'Share Tech Mono', monospace;
    }
    
    input[type="number"]:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
    }
    
    .button-group {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
      justify-content: flex-end;
    }
    
    .btn {
      display: inline-block;
      padding: 0.6rem 1.2rem;
      border: 1px solid transparent;
      border-radius: 0;
      cursor: pointer;
      font-size: 0.9rem;
      text-decoration: none;
      text-align: center;
      font-family: 'Share Tech Mono', monospace;
      letter-spacing: 1px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: all 0.5s ease;
    }
    
    .btn:hover::before {
      left: 100%;
    }
    
    .download-btn {
      background-color: rgba(0, 255, 0, 0.1);
      color: var(--success);
      border-color: var(--success);
    }
    
    .download-btn:hover {
      background-color: rgba(0, 255, 0, 0.2);
      box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
    }
    
    .copy-btn {
      background-color: rgba(0, 150, 255, 0.1);
      color: var(--primary);
      border-color: var(--primary);
    }
    
    .copy-btn:hover {
      background-color: rgba(0, 150, 255, 0.2);
      box-shadow: 0 0 10px rgba(0, 150, 255, 0.3);
    }
    
    .copy-original-btn {
      background-color: rgba(150, 0, 255, 0.1);
      color: var(--secondary);
      border-color: var(--secondary);
    }
    
    .copy-original-btn:hover {
      background-color: rgba(150, 0, 255, 0.2);
      box-shadow: 0 0 10px rgba(150, 0, 255, 0.3);
    }
    
    .clear-btn {
      background-color: rgba(255, 0, 0, 0.1);
      color: var(--error);
      border-color: var(--error);
    }
    
    .clear-btn:hover {
      background-color: rgba(255, 0, 0, 0.2);
      box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
    }
    
    .status {
      color: var(--warning);
      margin: 1rem 0;
      min-height: 1.5rem;
      text-align: center;
      font-size: 0.9rem;
      text-shadow: 0 0 5px currentColor;
    }
    
    .success {
      color: var(--success);
    }
    
    .error {
      color: var(--error);
    }
    
    .glow {
      animation: glow 2s infinite alternate;
    }
    
    @keyframes glow {
      from {
        text-shadow: 0 0 5px currentColor;
      }
      to {
        text-shadow: 0 0 15px currentColor;
      }
    }
    
    .corner {
      position: absolute;
      width: 20px;
      height: 20px;
      border-style: solid;
      border-color: var(--primary);
      pointer-events: none;
    }
    
    .corner-tl {
      top: 0;
      left: 0;
      border-width: 2px 0 0 2px;
    }
    
    .corner-tr {
      top: 0;
      right: 0;
      border-width: 2px 2px 0 0;
    }
    
    .corner-bl {
      bottom: 0;
      left: 0;
      border-width: 0 0 2px 2px;
    }
    
    .corner-br {
      bottom: 0;
      right: 0;
      border-width: 0 2px 2px 0;
    }
    
    .input-buttons {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 0.5rem;
    }
    
    .output-buttons {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 0.5rem;
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js"></script>
</head>
<body>
  <div class="container">
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>
    
    <h1>${t.title}</h1>
    
    <textarea id="inputYAML" placeholder="${t.inputPlaceholder}"></textarea>
    
    <div class="input-buttons">
      <button id="copyOriginalBtn" class="btn copy-original-btn">${t.copyOriginalBtn}</button>
    </div>
    
    <div class="controls">
      <div class="port-controls">
        <label>${t.startPortLabel}</label>
        <input type="number" id="startPort" min="1" step="1" value="10000">
        <button id="clearBtn" class="btn clear-btn">${t.clearBtn}</button>
      </div>
    </div>
    
    <div class="status" id="infoDiv"></div>
    <div class="port-range" id="portRangeDiv"></div>
    
    <textarea id="outputYAML" placeholder="${t.outputPlaceholder}" readonly></textarea>
    
    <div class="output-buttons">
      <button id="copyBtn" class="btn copy-btn" style="display: none;">${t.copyBtn}</button>
      <a id="downloadLink" class="btn download-btn" style="display: none;">${t.downloadBtn}</a>
    </div>
  </div>

  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const inputYAML = document.getElementById('inputYAML');
      const outputYAML = document.getElementById('outputYAML');
      const infoDiv = document.getElementById('infoDiv');
      const portRangeDiv = document.getElementById('portRangeDiv');
      const downloadLink = document.getElementById('downloadLink');
      const copyBtn = document.getElementById('copyBtn');
      const copyOriginalBtn = document.getElementById('copyOriginalBtn');
      const clearBtn = document.getElementById('clearBtn');
      const startPort = document.getElementById('startPort');
      
      const translations = {
        zh: {
          copySuccess: '已复制!',
          copyOriginalSuccess: '已复制!',
          successMessage: (count) => \`转换成功 - 已转换 \${count} 个代理\`,
          errorMessage: (error) => \`错误: \${error}\`,
          invalidConfig: "无效的Clash配置文件"
        },
        en: {
          copySuccess: 'Copied!',
          copyOriginalSuccess: 'Copied!',
          successMessage: (count) => \`Success - Converted \${count} proxies\`,
          errorMessage: (error) => \`Error: \${error}\`,
          invalidConfig: "Invalid Clash config file"
        }
      }
      
      function getCurrentLang() {
        return document.documentElement.lang || 'zh';
      }
      
      function t(key, ...args) {
        const lang = getCurrentLang();
        const value = translations[lang]?.[key] || translations.zh[key];
        return typeof value === 'function' ? value(...args) : value;
      }
      
      let timeoutId = null;
      let currentBlobUrl = null;
      
      function convertConfig() {
        try {
          if (!inputYAML.value.trim()) {
            outputYAML.value = '';
            downloadLink.style.display = 'none';
            copyBtn.style.display = 'none';
            infoDiv.textContent = '';
            infoDiv.className = 'status';
            portRangeDiv.textContent = '';
            return;
          }
          
          const yamlData = jsyaml.load(inputYAML.value);
          if (!yamlData || !yamlData.proxies) {
            throw new Error(t('invalidConfig'));
          }
          
          const port = parseInt(startPort.value);
          const numProxies = yamlData.proxies.length;
          const endPort = port + numProxies - 1;
          
          const newYAML = {
            'allow-lan': true,
            listeners: yamlData.proxies.map((proxy, i) => ({
              name: 'mixed-' + (proxy.name || i),
              type: 'mixed',
              port: port + i,
              proxy: proxy.name
            })),
            proxies: yamlData.proxies
          };
          
          const newYAMLString = jsyaml.dump(newYAML);
          outputYAML.value = newYAMLString;
          
          if (currentBlobUrl) {
            URL.revokeObjectURL(currentBlobUrl);
          }
          
          const blob = new Blob([newYAMLString], {type: 'text/yaml'});
          currentBlobUrl = URL.createObjectURL(blob);
          
          downloadLink.href = currentBlobUrl;
          downloadLink.setAttribute('download', 'CLASH to SOCKS5.yaml');
          downloadLink.style.display = 'inline-block';
          copyBtn.style.display = 'inline-block';
          
          infoDiv.textContent = t('successMessage', numProxies);
          infoDiv.className = 'status success glow';
          portRangeDiv.className = 'port-range glow';
          
        } catch(error) {
          infoDiv.textContent = t('errorMessage', error.message);
          infoDiv.className = 'status error glow';
          portRangeDiv.textContent = '';
          outputYAML.value = '';
          downloadLink.style.display = 'none';
          copyBtn.style.display = 'none';
        }
      }
      
      function clearAll() {
        inputYAML.value = '';
        outputYAML.value = '';
        infoDiv.textContent = '';
        infoDiv.className = 'status';
        portRangeDiv.textContent = '';
        downloadLink.style.display = 'none';
        copyBtn.style.display = 'none';
        if (currentBlobUrl) {
          URL.revokeObjectURL(currentBlobUrl);
          currentBlobUrl = null;
        }
      }
      
      function copyTextToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('复制失败:', err);
        }
        
        document.body.removeChild(textarea);
      }
      
      function copyToClipboard() {
        copyTextToClipboard(outputYAML.value);
        
        const originalText = copyBtn.textContent;
        copyBtn.textContent = t('copySuccess');
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      }
      
      function copyOriginalToClipboard() {
        copyTextToClipboard(inputYAML.value);
        
        const originalText = copyOriginalBtn.textContent;
        copyOriginalBtn.textContent = t('copyOriginalSuccess');
        setTimeout(() => {
          copyOriginalBtn.textContent = originalText;
        }, 2000);
      }
      
      inputYAML.addEventListener('input', function() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(convertConfig, 500);
      });
      
      startPort.addEventListener('change', convertConfig);
      startPort.addEventListener('input', function() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(convertConfig, 500);
      });
      
      clearBtn.addEventListener('click', clearAll);
      
      copyBtn.addEventListener('click', copyToClipboard);
      copyOriginalBtn.addEventListener('click', copyOriginalToClipboard);
      
      inputYAML.focus();
    });
  </script>
</body>
</html>`;
}

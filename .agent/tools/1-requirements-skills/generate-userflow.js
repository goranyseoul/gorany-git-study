#!/usr/bin/env node

/**
 * generate-userflow.js
 * Mermaid.js 기반 사용자 플로우 HTML 생성기
 * 
 * 사용법: node generate-userflow.js <프로젝트경로> <프로젝트명> <mermaid코드>
 * 예시: node generate-userflow.js ./my-project "My App" "flowchart TD..."
 */

const fs = require('fs');
const path = require('path');

const projectPath = process.argv[2] || '.';
const projectName = process.argv[3] || '프로젝트';
const mermaidCode = process.argv[4] || getDefaultMermaid();

function getDefaultMermaid() {
    return `flowchart TD
    subgraph 온보딩
        A([🚀 시작]) --> B[스플래시]
        B --> C{첫 방문?}
        C -->|Yes| D[튜토리얼]
        C -->|No| E[로그인]
        D --> E
    end

    subgraph 메인
        E --> F[홈 화면]
        F --> G[기능 A]
        F --> H[기능 B]
    end

    subgraph 완료
        G --> I([✅ 종료])
        H --> I
    end

    style A fill:#22c55e,stroke:#16a34a,color:#fff
    style I fill:#ef4444,stroke:#dc2626,color:#fff
    style C fill:#f59e0b,stroke:#d97706,color:#fff`;
}

const htmlTemplate = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>사용자 플로우 - ${projectName}</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      min-height: 100vh;
      padding: 2rem;
      color: #eee;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 {
      text-align: center;
      margin-bottom: 0.5rem;
      font-size: 2rem;
      background: linear-gradient(90deg, #00d4ff, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle { text-align: center; color: #888; margin-bottom: 2rem; }
    .diagram-card {
      background: rgba(255,255,255,0.05);
      border-radius: 16px;
      padding: 2rem;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
    }
    .mermaid { display: flex; justify-content: center; }
    .mermaid svg { max-width: 100%; height: auto; }
    .legend {
      margin-top: 2rem;
      display: flex;
      gap: 2rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    .legend-item { display: flex; align-items: center; gap: 0.5rem; color: #aaa; }
    .legend-box { width: 20px; height: 20px; border-radius: 4px; }
    .legend-start { background: #22c55e; }
    .legend-action { background: #3b82f6; }
    .legend-decision { background: #f59e0b; }
    .legend-end { background: #ef4444; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔄 사용자 플로우</h1>
    <p class="subtitle">${projectName}</p>
    <div class="diagram-card">
      <div class="mermaid">
${mermaidCode}
      </div>
    </div>
    <div class="legend">
      <div class="legend-item"><div class="legend-box legend-start"></div><span>시작</span></div>
      <div class="legend-item"><div class="legend-box legend-action"></div><span>액션</span></div>
      <div class="legend-item"><div class="legend-box legend-decision"></div><span>분기</span></div>
      <div class="legend-item"><div class="legend-box legend-end"></div><span>종료</span></div>
    </div>
  </div>
  <script>
    mermaid.initialize({ startOnLoad: true, theme: 'dark', flowchart: { useMaxWidth: true, curve: 'basis' } });
  </script>
</body>
</html>`;

// required 폴더 생성
const requiredDir = path.join(projectPath, 'required');
if (!fs.existsSync(requiredDir)) {
    fs.mkdirSync(requiredDir, { recursive: true });
}

// HTML 파일 생성
const outputPath = path.join(requiredDir, 'userflow.html');
fs.writeFileSync(outputPath, htmlTemplate);

console.log(`✅ 사용자 플로우 생성 완료: ${outputPath}`);

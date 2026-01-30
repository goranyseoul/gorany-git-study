/**
 * generate-feature-board.js
 * features.csv를 읽어서 Mermaid.js 기반 칸반 보드 HTML을 생성합니다.
 */

const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(process.cwd(), 'docs/2-기능정의/features.csv');
const OUTPUT_PATH = path.join(process.cwd(), 'docs/기능정의_board.html');

// CSV 파싱
function parseCSV(content) {
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((h, i) => obj[h.trim()] = (values[i] || '').trim());
        return obj;
    });
}

// 상태별 이모지
function getStatusEmoji(status) {
    switch (status) {
        case 'done': return '✅';
        case 'in-progress': return '🔄';
        default: return '⬜';
    }
}

// 우선순위별 색상
function getPriorityColor(priority) {
    switch (priority) {
        case 'MVP': return '#ef4444';
        case '중요': return '#f59e0b';
        case '부가': return '#22c55e';
        default: return '#6b7280';
    }
}

// 노션 앱 URL로 변환 (앱이 있으면 앱으로, 없으면 웹으로)
function getNotionAppUrl(url) {
    if (!url) return '';
    return url.replace('https://www.notion.so/', 'notion://');
}

// 버전별 버튼 HTML 생성
function generateVersionButtons(features) {
    const versions = [...new Set(features.map(f => f.version))].sort();

    const colors = {
        'v1.0': '#ef4444',  // MVP - 빨강
        'v1.1': '#f59e0b',  // 중요 - 노랑
        'v2.0': '#22c55e',  // 부가 - 초록
        'v3.0': '#3b82f6',  // 파랑
        'v4.0': '#8b5cf6',  // 보라
    };

    let buttonsHtml = '';
    versions.forEach((version, idx) => {
        const color = colors[version] || '#6b7280';
        const safeVersion = version.replace(/\./g, '-');
        const versionFeatures = features.filter(f => f.version === version);
        const total = versionFeatures.length;
        const done = versionFeatures.filter(f => f.status === 'done').length;
        const inProgress = versionFeatures.filter(f => f.status === 'in-progress').length;

        // 상태 아이콘 결정
        let statusIcon = '⬜';  // 시작 전
        if (done === total) statusIcon = '✅';  // 완료
        else if (done > 0 || inProgress > 0) statusIcon = '🔄';  // 진행중

        buttonsHtml += `<button class="version-btn" style="background:${color}" onclick="showVersion('${safeVersion}')">
            <span style="font-size:1.5rem">${statusIcon}</span><br>
            ${version}<br>
            <small style="opacity:0.8">${done}/${total}</small>
        </button>`;
        if (idx < versions.length - 1) {
            buttonsHtml += `<span class="arrow">→</span>`;
        }
    });

    return buttonsHtml;
}

// 버전별 세부 다이어그램 생성
function generateVersionDetails(features) {
    const versions = [...new Set(features.map(f => f.version))].sort();

    let detailsHtml = '';
    let diagramsJs = {};

    versions.forEach(version => {
        const versionFeatures = features.filter(f => f.version === version);
        const safeVersion = version.replace(/\./g, '-');

        let mermaid = 'flowchart TD\n';
        versionFeatures.forEach((f, idx) => {
            const statusEmoji = f.status === 'done' ? '✅' : f.status === 'in-progress' ? '🔄' : '⬜';
            const fillColor = f.status === 'done' ? '#22c55e' : f.status === 'in-progress' ? '#f59e0b' : '#6b7280';
            mermaid += `        ${f.id}["${statusEmoji} ${f.name}"]\n`;
            mermaid += `        style ${f.id} fill:${fillColor},color:#fff\n`;
            if (idx < versionFeatures.length - 1) {
                mermaid += `        ${f.id} --> ${versionFeatures[idx + 1].id}\n`;
            }
        });

        diagramsJs[safeVersion] = mermaid;

        detailsHtml += `
        <div id="detail-${safeVersion}" class="detail-view">
            <h3 style="margin-bottom:1rem;">${version} 기능 목록</h3>
            <div class="mermaid-container" id="diagram-${safeVersion}"></div>
        </div>`;
    });

    return { detailsHtml, diagramsJs };
}

// HTML 생성
function generateHTML(features) {
    const grouped = {
        'MVP': features.filter(f => f.priority === 'MVP'),
        '중요': features.filter(f => f.priority === '중요'),
        '부가': features.filter(f => f.priority === '부가')
    };

    const versionButtons = generateVersionButtons(features);
    const { detailsHtml, diagramsJs } = generateVersionDetails(features);

    return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>기능 정의 보드</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #1a1a2e; color: #eee; padding: 20px; }
        h1 { text-align: center; margin-bottom: 30px; color: #fff; }
        .board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
        .column { background: #16213e; border-radius: 12px; padding: 16px; }
        .column-header { font-size: 18px; font-weight: bold; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid; }
        .mvp .column-header { border-color: #ef4444; color: #ef4444; }
        .important .column-header { border-color: #f59e0b; color: #f59e0b; }
        .nice .column-header { border-color: #22c55e; color: #22c55e; }
        .card { background: #0f3460; border-radius: 8px; padding: 12px; margin-bottom: 10px; cursor: pointer; transition: transform 0.2s; }
        .card:hover { transform: translateY(-2px); }
        .card-id { font-size: 12px; color: #888; }
        .card-name { font-size: 14px; margin: 4px 0; }
        .card-version { display: inline-block; font-size: 10px; padding: 2px 8px; border-radius: 10px; background: #4f46e5; color: #fff; margin-top: 4px; }
        .notion-link { display: inline-block; font-size: 10px; padding: 2px 8px; border-radius: 10px; background: #333; color: #fff; margin-left: 4px; text-decoration: none; }
        .notion-link:hover { background: #555; }
        .status { float: right; }
        .roadmap-section { background: #16213e; border-radius: 12px; padding: 20px; }
        .roadmap-section h2 { margin-bottom: 20px; }
        .version-overview { text-align: center; padding: 2rem 0; }
        .version-btn { padding: 1rem 2rem; margin: 0.5rem; border-radius: 12px; color: #fff; font-size: 1.1rem; font-weight: 600; cursor: pointer; border: none; transition: transform 0.2s; }
        .version-btn:hover { transform: scale(1.05); }
        .arrow { color: #666; font-size: 2rem; margin: 0 0.5rem; }
        .detail-view { display: none; background: rgba(255,255,255,0.05); border-radius: 12px; padding: 1.5rem; margin-top: 1rem; }
        .detail-view.active { display: block; }
        .back-btn { padding: 0.5rem 1rem; background: #7c3aed; border: none; border-radius: 8px; color: #fff; cursor: pointer; margin-bottom: 1rem; display: none; }
        .mermaid-container { display: flex; justify-content: center; }
        .mermaid { background: #fff; border-radius: 8px; padding: 20px; }
        .stats { display: flex; justify-content: center; gap: 30px; margin-bottom: 30px; }
        .stat { text-align: center; }
        .stat-value { font-size: 32px; font-weight: bold; }
        .stat-label { font-size: 12px; color: #888; }
        .export-btn { display: block; margin: 0 auto 30px; padding: 12px 24px; background: #4f46e5; color: #fff; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; transition: background 0.2s; }
        .export-btn:hover { background: #4338ca; }
    </style>
</head>
<body>
    <h1>📋 기능 정의 보드</h1>
    
    <div class="stats">
        <div class="stat">
            <div class="stat-value">${features.length}</div>
            <div class="stat-label">전체 기능</div>
        </div>
        <div class="stat">
            <div class="stat-value" style="color: #22c55e">${features.filter(f => f.status === 'done').length}</div>
            <div class="stat-label">완료</div>
        </div>
        <div class="stat">
            <div class="stat-value" style="color: #f59e0b">${features.filter(f => f.status === 'in-progress').length}</div>
            <div class="stat-label">진행중</div>
        </div>
        <div class="stat">
            <div class="stat-value" style="color: #888">${features.filter(f => f.status === 'todo').length}</div>
            <div class="stat-label">예정</div>
        </div>
    </div>
    
    <!-- 진행률 차트 -->
    <div style="display: flex; justify-content: center; margin-bottom: 30px;">
        <div style="position: relative; width: 150px; height: 150px;">
            <svg viewBox="0 0 36 36" style="transform: rotate(-90deg);">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#333" stroke-width="3"/>
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#22c55e" stroke-width="3" 
                    stroke-dasharray="${Math.round(features.filter(f => f.status === 'done').length / features.length * 100)}, 100"/>
            </svg>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                <div style="font-size: 24px; font-weight: bold;">${Math.round(features.filter(f => f.status === 'done').length / features.length * 100)}%</div>
                <div style="font-size: 10px; color: #888;">진행률</div>
            </div>
        </div>
    </div>
    
    <button class="export-btn" onclick="exportCSV()">📥 CSV 내보내기 (변경사항 저장)</button>

    <div style="text-align: center; margin-bottom: 20px;">
        <input type="text" id="searchInput" placeholder="🔍 기능 검색..." oninput="filterCards()" 
            style="padding: 10px 16px; border-radius: 8px; background: #16213e; color: #fff; border: 1px solid #333; width: 200px; margin-right: 20px;">
        
        <label style="margin-right: 10px;">버전:</label>
        <select id="versionFilter" onchange="filterCards()" style="padding: 8px; border-radius: 8px; background: #16213e; color: #fff; border: 1px solid #333;">
            <option value="all">전체</option>
            ${[...new Set(features.map(f => f.version))].sort().map(v => `<option value="${v}">${v}</option>`).join('')}
        </select>
        
        <label style="margin-left: 20px; margin-right: 10px;">상태:</label>
        <select id="statusFilter" onchange="filterCards()" style="padding: 8px; border-radius: 8px; background: #16213e; color: #fff; border: 1px solid #333;">
            <option value="all">전체</option>
            <option value="todo">⬜ 예정</option>
            <option value="in-progress">🔄 진행중</option>
            <option value="done">✅ 완료</option>
        </select>
    </div>

    <div class="board">
        <div class="column mvp">
            <div class="column-header">🔴 MVP (필수)</div>
            ${grouped['MVP'].map(f => `
                <div class="card" data-id="${f.id}" data-version="${f.version}" data-status="${f.status}">
                    <span class="status">${getStatusEmoji(f.status)}</span>
                    <div class="card-id">${f.id}</div>
                    <div class="card-name">${f.name}</div>
                    <div class="card-version">${f.version}</div>
                    ${f.notion_url ? `<a href="${f.notion_url}" target="_blank" class="notion-link" onclick="event.stopPropagation()">📝 노션</a>` : ''}
                </div>
            `).join('')}
        </div>
        <div class="column important">
            <div class="column-header">🟡 중요</div>
            ${grouped['중요'].map(f => `
                <div class="card" data-id="${f.id}" data-version="${f.version}" data-status="${f.status}">
                    <span class="status">${getStatusEmoji(f.status)}</span>
                    <div class="card-id">${f.id}</div>
                    <div class="card-name">${f.name}</div>
                    <div class="card-version">${f.version}</div>
                    ${f.notion_url ? `<a href="${f.notion_url}" target="_blank" class="notion-link" onclick="event.stopPropagation()">📝 노션</a>` : ''}
                </div>
            `).join('')}
        </div>
        <div class="column nice">
            <div class="column-header">🟢 부가</div>
            ${grouped['부가'].map(f => `
                <div class="card" data-id="${f.id}" data-version="${f.version}" data-status="${f.status}">
                    <span class="status">${getStatusEmoji(f.status)}</span>
                    <div class="card-id">${f.id}</div>
                    <div class="card-name">${f.name}</div>
                    <div class="card-version">${f.version}</div>
                    ${f.notion_url ? `<a href="${f.notion_url}" target="_blank" class="notion-link" onclick="event.stopPropagation()">📝 노션</a>` : ''}
                </div>
            `).join('')}
        </div>
    </div>

    <div class="roadmap-section">
        <h2>📅 버전별 로드맵</h2>
        <p style="color:#888; text-align:center; margin-bottom:1rem;">버전을 클릭하면 세부 기능을 볼 수 있어요</p>
        <button class="back-btn" id="backBtn" onclick="showOverview()">← 전체 보기</button>
        
        <div id="overview" class="version-overview">
            ${versionButtons}
        </div>
        
        ${detailsHtml}
    </div>

    <script>
        mermaid.initialize({ startOnLoad: false, theme: 'dark' });
        
        const diagrams = ${JSON.stringify(diagramsJs)};
        
        async function showVersion(version) {
            document.getElementById('overview').style.display = 'none';
            document.querySelectorAll('.detail-view').forEach(v => v.classList.remove('active'));
            document.getElementById('detail-' + version).classList.add('active');
            document.getElementById('backBtn').style.display = 'block';
            
            const container = document.getElementById('diagram-' + version);
            if (!container.innerHTML) {
                const { svg } = await mermaid.render('svg-' + version, diagrams[version]);
                container.innerHTML = svg;
            }
        }
        
        function showOverview() {
            document.getElementById('overview').style.display = 'block';
            document.querySelectorAll('.detail-view').forEach(v => v.classList.remove('active'));
            document.getElementById('backBtn').style.display = 'none';
        }
        
        // 카드 필터링
        function filterCards() {
            const searchQuery = document.getElementById('searchInput').value.toLowerCase();
            const versionFilter = document.getElementById('versionFilter').value;
            const statusFilter = document.getElementById('statusFilter').value;
            
            document.querySelectorAll('.card').forEach(card => {
                const cardName = card.querySelector('.card-name').textContent.toLowerCase();
                const cardId = card.querySelector('.card-id').textContent.toLowerCase();
                const cardVersion = card.dataset.version;
                const cardStatus = card.dataset.status;
                
                const searchMatch = !searchQuery || cardName.includes(searchQuery) || cardId.includes(searchQuery);
                const versionMatch = versionFilter === 'all' || cardVersion === versionFilter;
                const statusMatch = statusFilter === 'all' || cardStatus === statusFilter;
                
                card.style.display = (searchMatch && versionMatch && statusMatch) ? 'block' : 'none';
            });
        }
        
        // 카드 클릭 시 상태 토글 (localStorage 저장)
        document.querySelectorAll('.card').forEach(card => {
            const id = card.dataset.id;
            const saved = localStorage.getItem('feature-' + id);
            if (saved) {
                card.querySelector('.status').textContent = saved === 'done' ? '✅' : saved === 'in-progress' ? '🔄' : '⬜';
            }
            
            card.addEventListener('click', () => {
                const status = card.querySelector('.status');
                let newStatus;
                if (status.textContent === '⬜') { newStatus = 'in-progress'; status.textContent = '🔄'; }
                else if (status.textContent === '🔄') { newStatus = 'done'; status.textContent = '✅'; }
                else { newStatus = 'todo'; status.textContent = '⬜'; }
                localStorage.setItem('feature-' + id, newStatus);
            });
        });
    </script>
</body>
</html>`;
}

// 메인 실행
function main() {
    if (!fs.existsSync(CSV_PATH)) {
        console.log('⚠️ features.csv가 없습니다. 샘플을 생성합니다.');
        const sample = `id, name, priority, version, status
    FT-001, 간편 로그인, MVP, v1.0, todo
    FT-002, 노션 연결, MVP, v1.0, todo
    FT-003, 웹사이트 배포, MVP, v1.0, todo
    FT - 101, 커스텀 도메인, 중요, v1.1, todo
    FT - 102, 방문자 분석, 중요, v1.1, todo
    FT - 201, 테마 선택, 부가, v2.0, todo
    FT - 202, 이메일 수집, 부가, v2.0, todo`;
        fs.writeFileSync(CSV_PATH, sample, 'utf-8');
        console.log('✅ 샘플 features.csv 생성 완료');
    }

    const csv = fs.readFileSync(CSV_PATH, 'utf-8');
    const features = parseCSV(csv);
    const html = generateHTML(features);

    fs.writeFileSync(OUTPUT_PATH, html, 'utf-8');
    console.log('✅ 기능 보드 생성 완료:', OUTPUT_PATH);

    // 브라우저 열기
    const { exec } = require('child_process');
    exec(`open "${OUTPUT_PATH}"`);
}

main();

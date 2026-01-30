# Figma Web Exporter

웹사이트에서 디자인 토큰과 컴포넌트를 자동 추출하는 CLI 도구

## 사용법

```bash
cd .agent/tools/5-디자인-추출
node figma-web-exporter/extract-components.js <URL>
```

### 예시
```bash
# naver.com 추출 → symlinks/naver.com/ 폴더에 저장
node figma-web-exporter/extract-components.js https://www.naver.com

# wanted.co.kr 추출 → symlinks/wanted.co.kr/ 폴더에 저장
node figma-web-exporter/extract-components.js https://www.wanted.co.kr
```

## 출력 경로

**`symlinks/{도메인}/`** 폴더에 자동 생성됩니다.

예시:
- `https://www.naver.com` → `symlinks/naver.com/`
- `https://www.wanted.co.kr` → `symlinks/wanted.co.kr/`
- `https://example.com:8080` → `symlinks/example.com_8080/`

> 💡 URL의 도메인을 자동 추출하여 폴더명으로 사용합니다.
> 특수문자(`<>:"/\|?*`)는 `_`로 변환됩니다.

## 출력 파일

| 파일 | 설명 |
|------|------|
| `styleguide.html` | 인터랙티브 스타일가이드 |
| `tokens.json` | 디자인 토큰 (색상, 폰트 등) |
| `screenshot.png` | 페이지 스크린샷 |
| `styles.css` | 추출된 CSS |
| `images/` | 컴포넌트 미리보기 이미지 |

## 작업 폴더

**모든 결과물은 `symlinks/` 폴더에 저장됩니다.**

```
team-ai-md/
└── symlinks/           ← 작업 결과물 위치
    ├── naver.com/
    ├── wanted.co.kr/
    └── ...
```

> ⚠️ `symlinks/` 폴더는 `.gitignore`에 포함되어 있어 각 사용자마다 독립적입니다.

## 의존성

```bash
cd .agent/tools/5-디자인-추출
npm install  # puppeteer 설치
```

## 관련 도구

| 폴더 | 용도 |
|------|------|
| `figma-web-exporter/` | CLI 자동 추출 (Node.js) |
| `figma-web-parsing/` | 브라우저 콘솔 수동 추출 |
| `figma-plugin/` | Figma 플러그인 |

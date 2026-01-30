

# Rule: Remotion 비디오 프로토타입 생성

## 적용 범위
4번 프로토타입 워크플로우 - 방법 C

## 사전 설치 (프로젝트당 1회)

### 빠른 설치 (복사-붙여넣기)
```bash
# 1. 폴더 생성
mkdir -p docs/4-프로토타입/remotion-video/src

# 2. package.json 생성
cat > docs/4-프로토타입/remotion-video/package.json << 'EOF'
{
  "name": "remotion-prototype",
  "scripts": {
    "start": "remotion studio",
    "render": "remotion render PrototypeDemo ../media/demo.mp4",
    "render:gif": "remotion render PrototypeDemo ../media/demo.gif --codec=gif"
  },
  "dependencies": {
    "@remotion/cli": "^4.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "remotion": "^4.0.0"
  }
}
EOF

# 3. 설치
cd docs/4-프로토타입/remotion-video && npm install
```

## 데모 컴포넌트 템플릿

`src/PrototypeDemo.tsx` 생성 시 아래 구조 사용:

```tsx
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';

const screens = [
  { title: '화면 1', color: '#0ea5e9' },
  { title: '화면 2', color: '#8b5cf6' },
  // screens.md 기반으로 추가
];

const FRAMES_PER_SCREEN = 90; // 3초 @ 30fps

export const PrototypeDemo = () => (
  <>
    {screens.map((screen, i) => (
      <Sequence key={i} from={i * FRAMES_PER_SCREEN} durationInFrames={FRAMES_PER_SCREEN}>
        <ScreenSlide {...screen} />
      </Sequence>
    ))}
  </>
);
```

## 렌더링 명령어

```bash
# MP4 렌더링
cd docs/4-프로토타입/remotion-video && npm run render

# GIF 렌더링
cd docs/4-프로토타입/remotion-video && npm run render:gif
```

## 출력 파일
- `docs/4-프로토타입/media/demo.mp4`
- `docs/4-프로토타입/media/demo.gif`

## 주의사항
- node_modules는 .gitignore에서 제외됨
- 첫 렌더링 시 Chrome Headless Shell 자동 다운로드 (1회)


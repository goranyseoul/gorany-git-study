#!/usr/bin/env node
/**
 * 웹사이트 컴포넌트 추출 도구
 * 스크린샷 미리보기 + 복사 가능한 HTML 코드 제공
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log(`
🧩 웹사이트 컴포넌트 추출

사용법:
  node extract-components.js <URL> [출력폴더]

출력:
  - 스크린샷 미리보기 (이미지)
  - 복사 가능한 HTML 코드
`);
  process.exit(0);
}

const targetUrl = args[0];
// URL에서 도메인 추출 (www 제거) + 특수문자 제거 (폴더명 안전화)
const urlObj = new URL(targetUrl.startsWith('http') ? targetUrl : 'https://' + targetUrl);
const siteDomain = urlObj.hostname
  .replace(/^www\./, '')           // www. 제거
  .replace(/[<>:"/\\|?*]/g, '_')   // 폴더명 불가 문자 → _
  .replace(/_+/g, '_')             // 연속 _ 제거
  .replace(/^_|_$/g, '');          // 앞뒤 _ 제거
// 기본 출력 경로: symlinks/{도메인} (예: symlinks/wanted.co.kr)
const outputDir = args[1] || path.join(__dirname, '../../../../symlinks', siteDomain);

async function main() {
  console.log('\n🧩 웹사이트 컴포넌트 추출\n');
  console.log('📍 URL: ' + targetUrl);
  console.log('📁 출력: ' + outputDir + '\n');

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const imgDir = path.join(outputDir, 'images');
  if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

  let browser;
  try {
    console.log('🌐 브라우저 시작...');
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
    await page.setViewport({ width: 1440, height: 900 });

    console.log('📄 페이지 로딩...');
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    // 스크롤
    await page.evaluate(async () => {
      await new Promise(r => {
        let t = 0;
        const i = setInterval(() => {
          window.scrollBy(0, 500); t += 500;
          if (t >= document.body.scrollHeight || t > 5000) { clearInterval(i); window.scrollTo(0, 0); r(); }
        }, 100);
      });
    });
    await new Promise(r => setTimeout(r, 2000));

    // 🆕 브라우저 콘솔 로그 캡처
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    console.log('🔍 컴포넌트 탐색...');

    // 1단계: 컴포넌트 위치와 정보 수집
    const componentData = await page.evaluate(async () => {
      function rgbToHex(rgb) {
        if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') return null;
        const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!m) return rgb;
        return '#' + [m[1], m[2], m[3]].map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
      }

      function getType(el) {
        // 태그명만 반환 (a, span, div, button, img...)
        return el.tagName.toLowerCase();
      }

      // 🆕 1단계: 자식 Element가 없는 요소만, iframe은 4단계
      function getLevel(el) {
        const tag = el.tagName.toLowerCase();

        // iframe은 4단계 (내부 요소들은 별도로 추출됨)
        if (tag === 'iframe') return 4;

        // 자식 Element가 없으면 1단계, 있으면 0 (제외)
        return el.children.length === 0 ? 1 : 0;
      }

      // 🆕 2단계 탐색: 1단계에서 1-2레벨만 올라간 래퍼
      function findLevel2Parent(el) {
        let current = el.parentElement;
        let depth = 0;

        while (current && current !== document.body && depth < 2) {
          depth++;

          // 현재 요소에 형제가 있는지 체크
          const siblings = Array.from(current.parentElement?.children || []).filter(c =>
            c !== current && c.offsetWidth > 0 && c.offsetHeight > 0
          );

          if (siblings.length > 0) {
            // 형제가 있으면 현재가 2단계
            return current;
          }

          // 형제가 없으면 계속 올라감
          current = current.parentElement;
        }
        return null; // 2단계 없음 (너무 깊음)
      }

      // 컴포넌트에 임시 ID 부여
      let counter = 0;
      const components = [];
      const seen = new Set();
      const level2Elements = new Set(); // 2단계 요소 추적

      // 🆕 형제 요소 중복 체크용: 부모별로 스타일 시그니처 추적
      const siblingStyles = new Map(); // parent -> Set<styleSignature>

      // 스타일 시그니처 생성 (형제 중복 판별용)
      function getStyleSignature(el, cs) {
        const tag = el.tagName.toLowerCase();
        return [
          tag,
          Math.round(el.offsetWidth / 10) * 10,  // 10px 단위로 반올림
          Math.round(el.offsetHeight / 10) * 10,
          cs.padding,
          cs.fontSize,
          cs.backgroundColor,
          cs.borderRadius
        ].join('|');
      }

      // 🆕 모든 요소 수집 (iframe 포함)
      function collectElements(doc, elements = []) {
        doc.querySelectorAll('*').forEach(el => elements.push(el));

        // iframe 내부 탐색 (same-origin만 가능)
        doc.querySelectorAll('iframe').forEach(iframe => {
          try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (iframeDoc) {
              collectElements(iframeDoc, elements);
            }
          } catch (e) {
            // cross-origin iframe은 접근 불가 - 무시
          }
        });

        return elements;
      }

      const allElements = collectElements(document);
      const globalStyles = new Set();

      console.log('발견된 요소 (iframe 포함):', allElements.length);

      allElements.forEach(el => {
        try {
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden') return;

          const w = el.offsetWidth, h = el.offsetHeight;
          if (w < 1 || h < 1) return;

          const level = getLevel(el);

          // 1단계면 2단계 부모도 수집
          if (level === 1) {
            const level2Parent = findLevel2Parent(el);
            if (level2Parent && !level2Elements.has(level2Parent)) {
              level2Elements.add(level2Parent);
            }
          }

          addComponent(el, w, h, cs);
        } catch (e) {
          // iframe 내부 요소 접근 실패 시 무시
        }
      });

      // 🆕 2단계 요소들 추가
      level2Elements.forEach(el => {
        try {
          const cs = getComputedStyle(el);
          const w = el.offsetWidth, h = el.offsetHeight;
          if (w < 1 || h < 1) return;

          // 2단계로 직접 추가
          const rect = el.getBoundingClientRect();
          const tempId = '__comp_' + counter++;
          el.setAttribute('data-comp-id', tempId);

          // 부모 배경색 찾기
          function findParentBg2(element) {
            let current = element.parentElement;
            while (current && current !== document.body) {
              const pcs = getComputedStyle(current);
              if (pcs.backgroundColor && pcs.backgroundColor !== 'rgba(0, 0, 0, 0)' && pcs.backgroundColor !== 'transparent') {
                return pcs.backgroundColor;
              }
              current = current.parentElement;
            }
            return '#fff';
          }

          const styles = {
            display: cs.display,
            position: cs.position,
            width: cs.width,
            height: cs.height,
            padding: cs.padding,
            margin: cs.margin,
            background: cs.background,
            color: cs.color,
            fontSize: cs.fontSize,
            fontFamily: cs.fontFamily,
            borderRadius: cs.borderRadius,
            boxShadow: cs.boxShadow,
            parentBg: findParentBg2(el) // 🆕 부모 배경색
          };

          // 🆕 type: 포함된 1단계 요소들의 이름과 ID
          // 내부에서 자식이 없는 요소들 (1단계) 찾기
          const childLevel1Els = Array.from(el.querySelectorAll('*'))
            .filter(c => c.children.length === 0 && c.offsetWidth > 0)
            .slice(0, 5);

          const childLevel1 = childLevel1Els.map(c => getType(c));
          const childLevel1Ids = childLevel1Els.map(c => c.getAttribute('data-comp-id')).filter(Boolean);

          const className = el.className?.toString().split(' ')[0] || '';
          // 2단계 이름: wrap (자식 내용은 썸네일로 표시됨)
          const typeName = 'wrap';

          components.push({
            tempId: tempId,
            type: typeName,
            level: 2,
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY,
            width: w,
            height: h,
            html: el.outerHTML,
            styles: styles,
            childIds: childLevel1Ids // 🆕 포함된 1단계 ID들
          });

          // 🆕 1단계 컴포넌트들에 역참조 추가 (이 2단계가 자기를 사용한다고)
          childLevel1Ids.forEach(childId => {
            const childComp = components.find(c => c.tempId === childId);
            if (childComp) {
              if (!childComp.parentIds) childComp.parentIds = [];
              childComp.parentIds.push(tempId);
            }
          });
        } catch (e) { }
      });

      // 🆕 3단계 탐지: 동일한 자식 구조를 가진 2단계 요소들의 공통 부모
      const level3Elements = new Set();

      // 2단계 요소들의 부모별로 그룹화
      const parentToLevel2 = new Map();
      level2Elements.forEach(el => {
        const parent = el.parentElement;
        if (parent && parent !== document.body) {
          if (!parentToLevel2.has(parent)) {
            parentToLevel2.set(parent, []);
          }
          parentToLevel2.get(parent).push(el);
        }
      });

      // 같은 부모 아래에 2개 이상의 2단계 요소가 있으면 그 부모가 3단계
      parentToLevel2.forEach((children, parent) => {
        if (children.length >= 2 && !level2Elements.has(parent)) {
          level3Elements.add(parent);
        }
      });

      // 3단계 요소들 추가
      level3Elements.forEach(el => {
        try {
          const cs = getComputedStyle(el);
          const w = el.offsetWidth, h = el.offsetHeight;
          if (w < 1 || h < 1) return;

          const rect = el.getBoundingClientRect();
          const tempId = '__comp_' + counter++;
          el.setAttribute('data-comp-id', tempId);

          // 부모 배경색 찾기
          function findParentBg3(element) {
            let current = element.parentElement;
            while (current && current !== document.body) {
              const pcs = getComputedStyle(current);
              if (pcs.backgroundColor && pcs.backgroundColor !== 'rgba(0, 0, 0, 0)' && pcs.backgroundColor !== 'transparent') {
                return pcs.backgroundColor;
              }
              current = current.parentElement;
            }
            return '#fff';
          }

          const styles = {
            display: cs.display,
            position: cs.position,
            width: cs.width,
            height: cs.height,
            padding: cs.padding,
            margin: cs.margin,
            background: cs.background,
            color: cs.color,
            fontSize: cs.fontSize,
            fontFamily: cs.fontFamily,
            borderRadius: cs.borderRadius,
            boxShadow: cs.boxShadow,
            parentBg: findParentBg3(el)
          };

          // 포함된 2단계 요소들의 ID 수집
          const childLevel2Ids = parentToLevel2.get(el)?.map(c => c.getAttribute('data-comp-id')).filter(Boolean) || [];

          components.push({
            tempId: tempId,
            type: 'group',  // 3단계는 group
            level: 3,
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY,
            width: w,
            height: h,
            html: el.outerHTML,
            styles: styles,
            childIds: childLevel2Ids // 포함된 2단계 ID들
          });

          // 🆕 2단계 컴포넌트들에 역참조 추가 (이 3단계가 자기를 사용한다고)
          childLevel2Ids.forEach(childId => {
            const childComp = components.find(c => c.tempId === childId);
            if (childComp) {
              if (!childComp.parentIds) childComp.parentIds = [];
              childComp.parentIds.push(tempId);
            }
          });
        } catch (e) { }
      });

      // 🆕 4단계 탐지: 3단계 요소들의 공통 부모
      const level4Elements = new Set();

      const parentToLevel3 = new Map();
      level3Elements.forEach(el => {
        const parent = el.parentElement;
        if (parent && parent !== document.body) {
          if (!parentToLevel3.has(parent)) parentToLevel3.set(parent, []);
          parentToLevel3.get(parent).push(el);
        }
      });

      parentToLevel3.forEach((children, parent) => {
        if (children.length >= 2 && !level3Elements.has(parent) && !level2Elements.has(parent)) {
          level4Elements.add(parent);
        }
      });

      level4Elements.forEach(el => {
        try {
          const cs = getComputedStyle(el);
          const w = el.offsetWidth, h = el.offsetHeight;
          if (w < 1 || h < 1) return;

          const rect = el.getBoundingClientRect();
          const tempId = '__comp_' + counter++;
          el.setAttribute('data-comp-id', tempId);

          function findParentBg4(element) {
            let current = element.parentElement;
            while (current && current !== document.body) {
              const pcs = getComputedStyle(current);
              if (pcs.backgroundColor && pcs.backgroundColor !== 'rgba(0, 0, 0, 0)' && pcs.backgroundColor !== 'transparent') return pcs.backgroundColor;
              current = current.parentElement;
            }
            return '#fff';
          }

          const styles = { display: cs.display, position: cs.position, width: cs.width, height: cs.height, padding: cs.padding, margin: cs.margin, background: cs.background, color: cs.color, fontSize: cs.fontSize, fontFamily: cs.fontFamily, borderRadius: cs.borderRadius, boxShadow: cs.boxShadow, parentBg: findParentBg4(el) };

          const childLevel3Ids = parentToLevel3.get(el)?.map(c => c.getAttribute('data-comp-id')).filter(Boolean) || [];

          components.push({ tempId, type: 'template', level: 4, x: rect.left + window.scrollX, y: rect.top + window.scrollY, width: w, height: h, html: el.outerHTML, styles, childIds: childLevel3Ids });

          childLevel3Ids.forEach(childId => {
            const childComp = components.find(c => c.tempId === childId);
            if (childComp) {
              if (!childComp.parentIds) childComp.parentIds = [];
              childComp.parentIds.push(tempId);
            }
          });
        } catch (e) { }
      });

      function addComponent(el, w, h, cs) {
        const rect = el.getBoundingClientRect();

        // 중복 체크 제거 - 모든 컴포넌트 허용

        const tempId = '__comp_' + counter++;
        el.setAttribute('data-comp-id', tempId);

        // 🆕 부모 체인에서 배경색 찾기
        function findParentBg(element) {
          let current = element.parentElement;
          while (current && current !== document.body) {
            const pcs = getComputedStyle(current);
            if (pcs.backgroundColor && pcs.backgroundColor !== 'rgba(0, 0, 0, 0)' && pcs.backgroundColor !== 'transparent') {
              return pcs.backgroundColor;
            }
            current = current.parentElement;
          }
          return '#ffffff'; // 기본값
        }

        const parentBg = findParentBg(el);

        const styles = {
          display: cs.display,
          position: cs.position,
          width: cs.width,
          height: cs.height,
          padding: cs.padding,
          margin: cs.margin,
          background: cs.background.substring(0, 80),
          parentBg: parentBg, // 🆕 부모 배경색
          color: cs.color,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          fontFamily: cs.fontFamily.split(',')[0].replace(/"/g, ''),
          borderRadius: cs.borderRadius,
          boxShadow: cs.boxShadow !== 'none' ? cs.boxShadow.substring(0, 50) : 'none',
          border: cs.border
        };

        // 인라인 스타일 포함 HTML 생성 - 사이즈 기반 분리
        function getStyledHtml(el, parentW = 0, parentH = 0) {
          if (el.nodeType === 3) return el.textContent; // 텍스트 노드
          if (el.nodeType !== 1) return '';

          const tag = el.tagName.toLowerCase();
          const cs = getComputedStyle(el);
          const w = parseInt(cs.width) || el.offsetWidth;
          const h = parseInt(cs.height) || el.offsetHeight;

          // 불필요한 태그 스킵
          if (['script', 'style', 'link', 'meta', 'noscript'].includes(tag)) return '';

          // 🆕 SVG, IMG는 그대로 렌더링하도록 허용
          // video/canvas 등은 플레이스홀더 처리
          const isMediaTag = ['video', 'i', 'icon', 'canvas'].includes(tag);
          const hasBgImage = cs.backgroundImage && cs.backgroundImage !== 'none';

          // ::before pseudo-element 체크
          let hasPseudoBgImage = false;
          try {
            const beforeStyle = getComputedStyle(el, '::before');
            const afterStyle = getComputedStyle(el, '::after');
            hasPseudoBgImage = (beforeStyle.backgroundImage && beforeStyle.backgroundImage !== 'none') ||
              (afterStyle.backgroundImage && afterStyle.backgroundImage !== 'none');
          } catch (e) { }

          // icon 관련 클래스 확인 (svg가 아닌 경우만)
          const hasIconClass = el.className && typeof el.className === 'string' &&
            (el.className.includes('icon') || el.className.includes('ico_')) && tag !== 'svg';

          if (isMediaTag || hasBgImage || hasPseudoBgImage || hasIconClass) {
            const iconW = Math.max(w, 20);
            const iconH = Math.max(h, 20);
            return '<div style="width:' + iconW + 'px;height:' + iconH + 'px;background:#e8e8e8;border:1px dashed #bbb;border-radius:4px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0"><span style="color:#999;font-size:10px">MEDIA</span></div>';
          }

          // 너무 작은 요소 스킵 (5px 미만) - 단, SVG/IMG는 예외
          if ((w < 5 || h < 5) && !['svg', 'path', 'img'].includes(tag)) return '';

          // 🆕 전체 computedStyle을 인라인으로 적용
          const makeStyle = () => {
            // ... (기존 makeStyle 로직 유지)
            const importantProps = [
              'display', 'position', 'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
              'margin', 'padding', 'border', 'border-radius', 'box-sizing', 'overflow',
              'background', 'background-color', 'background-image', 'background-size', 'background-position',
              'color', 'font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing', 'text-align', 'text-decoration', 'text-transform',
              'flex', 'flex-direction', 'flex-wrap', 'align-items', 'justify-content', 'gap',
              'grid-template-columns', 'grid-template-rows', 'grid-gap',
              'opacity', 'visibility', 'z-index', 'cursor', 'box-shadow', 'transform', 'transition',
              'fill', 'stroke', 'stroke-width' // SVG 관련 스타일 추가
            ];

            const result = [];
            for (const prop of importantProps) {
              const camelProp = prop.replace(/-([a-z])/g, (m, c) => c.toUpperCase());
              const value = cs[camelProp];
              if (value && value !== 'none' && value !== 'normal' && value !== 'auto' && value !== 'initial') {
                if (prop === 'margin' && value === '0px') continue;
                if (prop === 'padding' && value === '0px') continue;
                if (prop === 'border' && value.includes('0px')) continue;
                if (prop === 'border-radius' && value === '0px') continue;
                if (prop === 'opacity' && value === '1') continue;
                if (prop === 'z-index' && value === 'auto') continue;
                if (prop === 'visibility' && value === 'visible') continue;
                if (prop === 'background-color' && value === 'rgba(0, 0, 0, 0)') continue;
                if (prop === 'transform' && value === 'none') continue;
                result.push(prop + ':' + value);
              }
            }
            return result.join(';');
          };

          // 🆕 속성(Attributes) 복사 로직 추가 (ID, Class, SRC, HREF 등)
          // on* 이벤트 핸들러는 제외
          let attrStr = '';
          if (el.attributes) {
            for (let i = 0; i < el.attributes.length; i++) {
              const attr = el.attributes[i];
              const name = attr.name;
              let val = attr.value;

              if (name === 'style') continue; // style은 별도로 처리
              if (name === 'data-comp-id') continue; // 내부용 ID 제외
              if (name.startsWith('on')) continue; // 이벤트 핸들러 제외

              // URL 절대경로 변환
              if (name === 'src' || name === 'href') {
                try {
                  // el.src, el.href 속성이 있으면 절대경로가 들어있음
                  if (el[name] && typeof el[name] === 'string') {
                    val = el[name];
                  } else {
                    val = new URL(val, document.baseURI).href;
                  }
                } catch (e) { }
              }

              attrStr += ' ' + name + '="' + val.replace(/"/g, '&quot;') + '"';
            }
          }

          // input/textarea → 값 유지
          if (tag === 'input' || tag === 'textarea') {
            const val = el.value || '';
            // input 태그 그대로 사용 (닫는 태그 없음)
            if (tag === 'input') return '<input' + attrStr + ' style="' + makeStyle() + '" value="' + val.replace(/"/g, '&quot;') + '">';
            return '<textarea' + attrStr + ' style="' + makeStyle() + '">' + val + '</textarea>';
          }

          // 자식 처리
          const children = Array.from(el.childNodes).map(c => getStyledHtml(c, w, h)).join('');

          // 🆕 태그 유지 + 속성 포함 + Style
          return '<' + tag + attrStr + ' style="' + makeStyle() + '">' + children + '</' + tag + '>';
        }

        // components.push (getStyledHtml 정의 후)
        const level = getLevel(el);

        // 🆕 모든 레벨에서 getStyledHtml 사용하여 구조 보존 (1단계도 포함)
        // 기존: 1단계는 텍스트만 → 변경: 구조 전체 포함
        const htmlContent = getStyledHtml(el, 0, 0);

        components.push({
          tempId: tempId,
          type: getType(el),
          level: level,
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
          width: w,
          height: h,
          html: htmlContent,
          styles: styles
        });
      }

      // (역방향 탐색은 위에서 이미 실행됨)

      // 시각적 박스 탐지
      document.querySelectorAll('*').forEach(el => {
        if (el.hasAttribute('data-comp-id')) return;
        const w = el.offsetWidth, h = el.offsetHeight;
        if (w < 150 || h < 80 || w > 1200) return;

        const cs = getComputedStyle(el);
        if (cs.display === 'none') return;

        const hasBg = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent';
        const hasShadow = cs.boxShadow !== 'none';
        const hasRadius = parseFloat(cs.borderRadius) > 4;

        if (hasBg && (hasShadow || hasRadius)) {
          const rect = el.getBoundingClientRect();
          const key = Math.round(rect.left) + ':' + Math.round(rect.top) + ':' + w + ':' + h;
          if (seen.has(key)) return;
          seen.add(key);

          const tempId = '__comp_' + counter++;
          el.setAttribute('data-comp-id', tempId);

          components.push({
            tempId: tempId,
            type: 'card',
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY,
            width: w,
            height: h,
            html: '<div style="background:#f5f5f5;border-radius:8px;padding:8px">Card</div>'
          });
        }
      });

      // 색상 (사용처 포함)
      const colors = {};
      document.querySelectorAll('*').forEach(el => {
        const cs = getComputedStyle(el);
        const tag = el.tagName.toLowerCase();
        const cls = el.className?.toString().split(' ')[0] || '';
        const name = tag + (cls ? '.' + cls.substring(0, 15) : '');

        const props = { color: 'text', backgroundColor: 'bg', borderColor: 'border' };
        Object.entries(props).forEach(([p, usage]) => {
          const hex = rgbToHex(cs[p]);
          if (hex && hex !== '#000000' && hex !== '#ffffff') {
            if (!colors[hex]) colors[hex] = { count: 0, usages: { text: [], bg: [], border: [] } };
            colors[hex].count++;
            if (colors[hex].usages[usage].length < 5 && !colors[hex].usages[usage].includes(name)) {
              colors[hex].usages[usage].push(name);
            }
          }
        });
      });

      // 폰트
      const fonts = {};
      document.querySelectorAll('*').forEach(el => {
        const cs = getComputedStyle(el);
        const fam = cs.fontFamily.split(',')[0].replace(/"/g, '').trim();
        if (!fonts[fam]) fonts[fam] = { sizes: new Set(), weights: new Set() };
        fonts[fam].sizes.add(cs.fontSize);
        fonts[fam].weights.add(cs.fontWeight);
      });

      // 필터링: level이 0이면 제외
      const filtered = components.filter(comp => {
        // level 0은 제외
        if (comp.level === 0) return false;
        return true;
      }).sort((a, b) => (a.y - b.y) || (a.x - b.x)); // 위치순 정렬

      const deduplicated = filtered; // 임시: 중복 제거 비활성화

      // 🆕 레벨 우선, 타입별 그룹화 + 크기순 정렬
      const typeOrder = ['button', 'input', 'text', 'nav', 'menu', 'card', 'banner', 'header', 'footer', 'wrap', 'group', 'template', 'page', 'component'];
      const sortedByCategory = deduplicated.sort((a, b) => {
        // 1. 레벨 순서로 정렬 (1단계 → 4단계)
        if (a.level !== b.level) return a.level - b.level;
        // 2. 타입 알파벳 순
        if (a.type !== b.type) return a.type.localeCompare(b.type);
        // 3. 면적순 (작은 것 먼저)
        const areaA = a.width * a.height;
        const areaB = b.width * b.height;
        return areaA - areaB;
      });

      // 🆕 색상-컴포넌트 매핑: 각 색상에 해당 색상을 사용하는 컴포넌트 인덱스 추가
      const colorToCompMapping = {};
      const fontToCompMapping = {};

      sortedByCategory.forEach((comp, idx) => {
        if (comp.styles) {
          // 색상 매핑
          ['color', 'backgroundColor', 'borderColor'].forEach(prop => {
            const val = comp.styles[prop];
            if (val && val !== 'rgba(0, 0, 0, 0)' && val !== 'transparent') {
              // RGB를 HEX로 변환
              const match = val.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
              if (match) {
                const hex = '#' + [match[1], match[2], match[3]].map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
                if (!colorToCompMapping[hex]) colorToCompMapping[hex] = [];
                if (!colorToCompMapping[hex].includes(idx)) {
                  colorToCompMapping[hex].push(idx);
                }
              }
            }
          });
          // 폰트 매핑
          const fontFamily = comp.styles.fontFamily?.split(',')[0]?.replace(/"/g, '').trim();
          if (fontFamily) {
            if (!fontToCompMapping[fontFamily]) fontToCompMapping[fontFamily] = [];
            if (!fontToCompMapping[fontFamily].includes(idx)) {
              fontToCompMapping[fontFamily].push(idx);
            }
          }
        }
      });

      // 🆕 누락 체크: 모든 보이는 요소 vs 추출된 요소
      const allVisibleElements = [];
      document.querySelectorAll('*').forEach(el => {
        try {
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden') return;
          const w = el.offsetWidth, h = el.offsetHeight;
          if (w < 5 || h < 5) return;
          allVisibleElements.push({
            tag: el.tagName.toLowerCase(),
            hasCompId: el.hasAttribute('data-comp-id'),
            width: w,
            height: h,
            className: el.className?.toString().split(' ')[0] || ''
          });
        } catch (e) { }
      });

      const extractedCount = sortedByCategory.length;
      const totalVisible = allVisibleElements.length;
      const notExtracted = allVisibleElements.filter(e => !e.hasCompId);
      const missingByTag = {};
      notExtracted.forEach(e => {
        const key = e.tag;
        if (!missingByTag[key]) missingByTag[key] = 0;
        missingByTag[key]++;
      });

      const missingStats = {
        totalVisible,
        extractedCount,
        missingCount: notExtracted.length,
        coveragePercent: Math.round((extractedCount / totalVisible) * 100) || 0,
        missingByTag: Object.entries(missingByTag).sort((a, b) => b[1] - a[1]).slice(0, 10)
      };

      // 🆕 원본 페이지 CSS 링크 추출 (link 태그에서 직접)
      const cssLinks = [];
      let inlineCSS = '';

      // 1. link[rel=stylesheet] 태그에서 href 추출
      document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        if (link.href) cssLinks.push(link.href);
      });

      // 2. style 태그 내용 추출
      document.querySelectorAll('style').forEach(style => {
        inlineCSS += style.textContent + '\n';
      });

      console.log('CSS Links found:', cssLinks.length);

      // 🆕 라이브러리 감지
      const libraries = [];
      const detectedLibs = new Set();

      // 스크립트 태그에서 라이브러리 감지
      document.querySelectorAll('script[src]').forEach(script => {
        const src = script.src.toLowerCase();
        const patterns = [
          { pattern: /react[.-]?dom/i, name: 'React', icon: '⚛️', category: 'Framework' },
          { pattern: /react/i, name: 'React', icon: '⚛️', category: 'Framework' },
          { pattern: /vue(\.min)?(\.prod)?\.js/i, name: 'Vue.js', icon: '💚', category: 'Framework' },
          { pattern: /angular/i, name: 'Angular', icon: '🅰️', category: 'Framework' },
          { pattern: /next/i, name: 'Next.js', icon: '▲', category: 'Framework' },
          { pattern: /nuxt/i, name: 'Nuxt', icon: '💚', category: 'Framework' },
          { pattern: /svelte/i, name: 'Svelte', icon: '🔶', category: 'Framework' },
          { pattern: /jquery/i, name: 'jQuery', icon: '💲', category: 'Library' },
          { pattern: /lodash/i, name: 'Lodash', icon: '📦', category: 'Utility' },
          { pattern: /moment/i, name: 'Moment.js', icon: '⏰', category: 'Utility' },
          { pattern: /axios/i, name: 'Axios', icon: '🌐', category: 'HTTP' },
          { pattern: /gsap/i, name: 'GSAP', icon: '🎬', category: 'Animation' },
          { pattern: /anime(\.min)?\.js/i, name: 'Anime.js', icon: '🎬', category: 'Animation' },
          { pattern: /swiper/i, name: 'Swiper', icon: '📱', category: 'UI' },
          { pattern: /slick/i, name: 'Slick', icon: '🎠', category: 'UI' },
          { pattern: /bootstrap/i, name: 'Bootstrap', icon: '🅱️', category: 'CSS Framework' },
          { pattern: /tailwind/i, name: 'Tailwind CSS', icon: '🌊', category: 'CSS Framework' },
          { pattern: /mui|material-ui/i, name: 'Material UI', icon: '🎨', category: 'UI Framework' },
          { pattern: /ant-?design|antd/i, name: 'Ant Design', icon: '🐜', category: 'UI Framework' },
          { pattern: /chakra/i, name: 'Chakra UI', icon: '⚡', category: 'UI Framework' },
          { pattern: /chart\.?js/i, name: 'Chart.js', icon: '📊', category: 'Visualization' },
          { pattern: /d3(\.min)?\.js/i, name: 'D3.js', icon: '📈', category: 'Visualization' },
          { pattern: /three(\.min)?\.js/i, name: 'Three.js', icon: '🎮', category: '3D' },
          { pattern: /gtag|gtm|google-analytics|analytics/i, name: 'Google Analytics', icon: '📊', category: 'Analytics' },
          { pattern: /hotjar/i, name: 'Hotjar', icon: '🔥', category: 'Analytics' },
          { pattern: /sentry/i, name: 'Sentry', icon: '🐛', category: 'Monitoring' },
          { pattern: /datadog/i, name: 'Datadog', icon: '🐕', category: 'Monitoring' },
          { pattern: /amplitude/i, name: 'Amplitude', icon: '📈', category: 'Analytics' },
          { pattern: /facebook|fb-?sdk/i, name: 'Facebook SDK', icon: '📘', category: 'Social' },
          { pattern: /twitter/i, name: 'Twitter SDK', icon: '🐦', category: 'Social' },
          { pattern: /kakao/i, name: 'Kakao SDK', icon: '💬', category: 'Social' },
          { pattern: /naver/i, name: 'Naver SDK', icon: '🟢', category: 'Social' }
        ];

        patterns.forEach(({ pattern, name, icon, category }) => {
          if (pattern.test(src) && !detectedLibs.has(name)) {
            detectedLibs.add(name);
            libraries.push({ name, icon, category, source: script.src });
          }
        });
      });

      // window 객체에서 글로벌 변수 확인
      const globals = [
        { check: 'React', name: 'React', icon: '⚛️', category: 'Framework' },
        { check: 'Vue', name: 'Vue.js', icon: '💚', category: 'Framework' },
        { check: 'angular', name: 'Angular', icon: '🅰️', category: 'Framework' },
        { check: 'jQuery', name: 'jQuery', icon: '💲', category: 'Library' },
        { check: '$', name: 'jQuery', icon: '💲', category: 'Library' },
        { check: '_', name: 'Lodash/Underscore', icon: '📦', category: 'Utility' },
        { check: 'gsap', name: 'GSAP', icon: '🎬', category: 'Animation' },
        { check: 'Swiper', name: 'Swiper', icon: '📱', category: 'UI' },
        { check: 'ga', name: 'Google Analytics', icon: '📊', category: 'Analytics' },
        { check: 'gtag', name: 'Google Tag Manager', icon: '📊', category: 'Analytics' },
        { check: 'fbq', name: 'Facebook Pixel', icon: '📘', category: 'Analytics' },
        { check: 'Kakao', name: 'Kakao SDK', icon: '💬', category: 'Social' }
      ];

      globals.forEach(({ check, name, icon, category }) => {
        if (window[check] && !detectedLibs.has(name)) {
          detectedLibs.add(name);
          libraries.push({ name, icon, category, source: 'window.' + check });
        }
      });

      // CSS 파일에서 프레임워크 감지
      cssLinks.forEach(href => {
        const patterns = [
          { pattern: /bootstrap/i, name: 'Bootstrap', icon: '🅱️', category: 'CSS Framework' },
          { pattern: /tailwind/i, name: 'Tailwind CSS', icon: '🌊', category: 'CSS Framework' },
          { pattern: /bulma/i, name: 'Bulma', icon: '🎨', category: 'CSS Framework' },
          { pattern: /foundation/i, name: 'Foundation', icon: '🏗️', category: 'CSS Framework' },
          { pattern: /normalize/i, name: 'Normalize.css', icon: '📏', category: 'CSS Reset' },
          { pattern: /reset/i, name: 'CSS Reset', icon: '📏', category: 'CSS Reset' },
          { pattern: /animate/i, name: 'Animate.css', icon: '🎬', category: 'Animation' },
          { pattern: /font-?awesome|fontawesome/i, name: 'Font Awesome', icon: '🔤', category: 'Icons' },
          { pattern: /material-?icons/i, name: 'Material Icons', icon: '🎨', category: 'Icons' }
        ];

        patterns.forEach(({ pattern, name, icon, category }) => {
          if (pattern.test(href) && !detectedLibs.has(name)) {
            detectedLibs.add(name);
            libraries.push({ name, icon, category, source: href });
          }
        });
      });

      // 메타 태그에서 추가 정보
      const generator = document.querySelector('meta[name="generator"]')?.content;
      if (generator) {
        if (/next/i.test(generator) && !detectedLibs.has('Next.js')) {
          libraries.push({ name: 'Next.js', icon: '▲', category: 'Framework', source: 'meta generator' });
        }
        if (/gatsby/i.test(generator) && !detectedLibs.has('Gatsby')) {
          libraries.push({ name: 'Gatsby', icon: '💜', category: 'Framework', source: 'meta generator' });
        }
        if (/wordpress/i.test(generator) && !detectedLibs.has('WordPress')) {
          libraries.push({ name: 'WordPress', icon: '📝', category: 'CMS', source: 'meta generator' });
        }
      }

      console.log('Libraries detected:', libraries.length);

      return {
        url: location.href,
        title: document.title,
        components: sortedByCategory,
        colors: Object.entries(colors).sort((a, b) => b[1].count - a[1].count).slice(0, 25).map(([hex, data]) => ({
          hex,
          count: data.count,
          usages: data.usages,
          componentIds: colorToCompMapping[hex] || []
        })),
        fonts: Object.entries(fonts).map(([k, v]) => ({
          family: k,
          sizes: [...v.sizes],
          weights: [...v.weights].sort((a, b) => parseInt(a) - parseInt(b)),
          componentIds: fontToCompMapping[k] || []
        })),
        missingStats,
        cssLinks,  // 🆕 CSS 링크 배열 (Puppeteer에서 fetch)
        inlineCSS,  // 🆕 인라인 CSS
        libraries  // 🆕 감지된 라이브러리 목록
      };
    });

    // 🆕 Puppeteer로 외부 CSS 직접 fetch (CORS 우회)
    console.log('   🎨 CSS 가져오는 중...');
    let allCSS = componentData.inlineCSS || '';
    if (componentData.cssLinks && componentData.cssLinks.length > 0) {
      console.log('   🌐 Fetching ' + componentData.cssLinks.length + ' CSS files...');

      // 페이지 컨텍스트에서 fetch 실행 (훨씬 빠르고 안정적)
      const fetchedStyles = await page.evaluate(async (links) => {
        const results = [];
        for (const url of links) {
          try {
            // Promise.all로 병렬 처리하면 더 빠르지만, 너무 많으면 부하가 걸릴 수 있음
            // 순차 처리하되 timeout 짧게
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), 2000); // 2초 타임아웃

            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(id);

            if (res.ok) {
              results.push(await res.text());
            } else {
              results.push(''); // 실패 시 빈 문자열
            }
          } catch (e) {
            results.push('');
          }
        }
        return results;
      }, componentData.cssLinks); // 개수 제한 없이 모두 가져옴

      allCSS += '\n' + fetchedStyles.join('\n');
      console.log('   ✓ CSS fetch complete');
    }
    componentData.allCSS = allCSS;
    console.log('   📄 CSS 총 ' + allCSS.length + ' chars');

    console.log('   📦 ' + componentData.components.length + '개 컴포넌트');
    console.log('   🎨 ' + componentData.colors.length + '개 색상');
    if (componentData.missingStats) {
      const ms = componentData.missingStats;
      console.log('   📊 커버리지: ' + ms.coveragePercent + '% (' + ms.extractedCount + '/' + ms.totalVisible + ')');
      if (ms.missingByTag && ms.missingByTag.length > 0) {
        const top5 = ms.missingByTag.slice(0, 5).map(([tag, count]) => `${tag}(${count})`).join(', ');
        console.log('   ⚠️  누락 TOP5: ' + top5);
      }
    }
    console.log('');

    // 스크린샷 캡처 비활성화 (시간 절약)
    /*
    console.log('📸 스크린샷 캡처...');
    for (let i = 0; i < componentData.components.length; i++) {
      const comp = componentData.components[i];
      try {
        const el = await page.$('[data-comp-id="' + comp.tempId + '"]');
        if (el) {
          await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 100)), comp.y);
          await new Promise(r => setTimeout(r, 150));
          await el.screenshot({ path: path.join(imgDir, 'comp-' + i + '.png') });
          comp.image = 'images/comp-' + i + '.png';
        }
        process.stdout.write('.');
      } catch (e) {
        comp.image = null;
      }
    }
    console.log(' 완료!\\n');
    */

    // HTML 생성
    const colorSwatches = componentData.colors.map((c, i) =>
      `<div class="swatch" onclick="showColorComps(${i})" title="${c.componentIds?.length || 0}개 컴포넌트"><div style="background:${c.hex}"></div><span>${c.hex}</span><span class="swatch-count">${c.componentIds?.length || 0}</span></div>`
    ).join('');

    const fontItems = componentData.fonts.map((f, i) =>
      `<div class="font-item" onclick="showFontComps(${i})"><div class="font-abc" style="font-family:${f.family}">AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz</div><div class="font-kr" style="font-family:${f.family}">가나다라마바사아자차카타파하</div><div class="font-num" style="font-family:${f.family}">0123456789</div><div class="font-meta">${f.family} | ${f.weights.join(', ')} | <strong>${f.componentIds?.length || 0}개</strong></div></div>`
    ).join('');

    const compListItems = componentData.components.map((c, i) =>
      `<div class="comp-item" data-level="${c.level || 1}" data-type="${c.type}" data-idx="${i}" onclick="selectComp(${i})"><span class="item-level">L${c.level || 1}</span><span class="item-icon">${c.type === 'button' ? '🔘' : c.type === 'img' ? '�️' : c.type === 'a' ? '🔗' : c.type === 'input' ? '✏️' : c.type === 'span' ? '📝' : c.type === 'svg' ? '🎨' : '🧩'}</span><span class="item-name">${c.type}-${i}</span><span class="item-size">${c.width}×${c.height}</span></div>`
    ).join('');

    // 🆕 단계별 개수 집계
    const levelCounts = [0, 0, 0, 0, 0, 0]; // index 1~5 사용
    componentData.components.forEach(c => {
      levelCounts[c.level || 1]++;
    });

    // 🆕 1단계 태그별 개수 집계
    const level1Types = {};
    componentData.components.filter(c => c.level === 1).forEach(c => {
      level1Types[c.type] = (level1Types[c.type] || 0) + 1;
    });
    const level1TypeButtons = Object.entries(level1Types)
      .sort((a, b) => b[1] - a[1]) // 개수 많은 순
      .map(([type, count]) => `<button class="type-tab" onclick="filterType('${type}')">${type} (${count})</button>`)
      .join('');

    const compDetails = componentData.components.map((c, i) => {
      // HTML 대폭 정리
      let cleanHtml = c.html
        .replace(/ style="[^"]*"/gi, '') // 인라인 스타일 제거 (먼저 처리)
        .replace(/ (class|id|data-[a-z-]+|aria-[a-z-]+|role|tabindex|name|target|loading|frameborder|scrolling)="[^"]*"/gi, '') // 속성 제거
        .replace(/ href="[^"]*"/gi, ' href="#"') // URL 축약
        .replace(/ src="[^"]*"/gi, ' src="..."') // src 축약
        .replace(/<(i|span|div)>\s*<\/\1>/gi, '') // 빈 태그 제거
        .replace(/\s+/g, ' ') // 중복 공백 제거
        .replace(/>\s*</g, '>\n<'); // 줄바꿈 추가 (공백 유무 상관없이)

      // 🆕 HTML 들여쓰기 포맷팅
      const formatHtml = (html) => {
        let indent = 0;
        const lines = html.split('\n');
        return lines.map(line => {
          line = line.trim();
          if (!line) return '';
          // 닫는 태그면 먼저 들여쓰기 감소
          if (line.startsWith('</')) indent = Math.max(0, indent - 1);
          const formatted = '  '.repeat(indent) + line;
          // 여는 태그이고 self-closing이 아니면 들여쓰기 증가
          if (line.match(/^<[a-z][^\/]*>$/i) && !line.match(/<(br|hr|img|input|meta|link)[^>]*>$/i)) {
            indent++;
          }
          return formatted;
        }).filter(l => l).join('\n');
      };
      const formattedHtml = formatHtml(cleanHtml);
      const escapedHtml = formattedHtml.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      const styleProps = Object.entries(c.styles || {}).map(([k, v]) => `<div class="prop-row"><span class="prop-key">${k}</span><span class="prop-val">${v}</span></div>`).join('');
      const iframeHtml = c.html.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
      const parentBg = (c.styles && c.styles.parentBg) || '#fff';

      // 🆕 1-4단계면 사용되는 부모 표시
      let parentThumbnails = '';
      if (c.level >= 1 && c.level <= 4 && c.parentIds && c.parentIds.length > 0) {
        const labelMap = { 1: '⬆️ 사용되는 부모 (2단계)', 2: '⬆️ 사용되는 부모 (3단계)', 3: '⬆️ 사용되는 부모 (4단계)' };
        const labelText = labelMap[c.level] || '⬆️ 사용되는 부모';
        const parentItems = c.parentIds.map(tempId => {
          const idx = componentData.components.findIndex(comp => comp.tempId === tempId);
          if (idx >= 0) {
            const parent = componentData.components[idx];
            return '<div class="child-thumb" onclick="selectCompFromChild(' + idx + ')">' +
              (parent.image ? '<img src="' + parent.image + '" alt="' + parent.type + '">' : '<div class="no-img">' + parent.type + '</div>') +
              '<span>' + parent.type + '-' + idx + '</span></div>';
          }
          return '';
        }).filter(Boolean).join('');

        parentThumbnails = '<div class="child-section"><div class="preview-label">' + labelText + '</div><div class="child-thumbs">' + parentItems + '</div></div>';
      }

      // 🆕 2-4단계면 포함된 자식 썸네일 표시
      let childThumbnails = '';
      if (c.level >= 2 && c.level <= 4 && c.childIds && c.childIds.length > 0) {
        const labelMap = { 2: '🧩 포함된 1단계 요소들', 3: '🧩 포함된 2단계 요소들', 4: '🧩 포함된 3단계 요소들' };
        const labelText = labelMap[c.level] || '🧩 포함된 요소들';
        const childItems = c.childIds.map(tempId => {
          const idx = componentData.components.findIndex(comp => comp.tempId === tempId);
          if (idx >= 0) {
            const child = componentData.components[idx];
            return '<div class="child-thumb" onclick="selectCompFromChild(' + idx + ')">' +
              (child.image ? '<img src="' + child.image + '" alt="' + child.type + '">' : '<div class="no-img">' + child.type + '</div>') +
              '<span>' + child.type + '-' + idx + '</span></div>';
          }
          return '';
        }).filter(Boolean).join('<span class="child-plus">+</span>');

        childThumbnails = '<div class="child-section"><div class="preview-label">' + labelText + '</div><div class="child-thumbs">' + childItems + '</div><div class="child-arrow">↓</div></div>';
      }

      return `<div class="comp-detail" id="detail-${i}" style="${i === 0 ? '' : 'display:none'}">
        <div class="detail-header"><h3>${c.type}-${i}</h3><span>${c.width}×${c.height}px</span>${c.type === 'svg' ? `<button class="svg-download-btn" onclick="downloadSvg(${i})" title="SVG 다운로드">⬇️ SVG</button>` : ''}</div>

        ${parentThumbnails}
        ${childThumbnails}
        <div class="screenshot-row">
          <div class="preview-label">📸 원본 (스크린샷)</div>
          ${c.image ? `<img src="${c.image}" alt="screenshot" style="max-width:100%;border-radius:8px">` : '<div class="no-preview">없음</div>'}
        </div>
        <div class="code-sections">
          <div class="code-section html-section"><div class="section-header"><span>HTML 구조</span><button onclick="copySection(${i},'html')">📋</button></div><pre id="html-${i}">${escapedHtml}</pre></div>
          <div class="code-section props-section"><div class="section-header"><span>CSS 속성</span></div><div class="props-grid">${styleProps}</div></div>
        </div>
        <div class="render-row">
          <div class="preview-label">🔧 HTML 렌더링 (부모 배경: ${parentBg})</div>
          <div id="iframe-container-${i}" class="iframe-placeholder" style="display:block;margin:0 auto;width:${Math.min(c.width + 40, 700)}px;height:${Math.max(Math.min(c.height + 80, 600), 300)}px;border-radius:8px;background:${parentBg}"></div>
        </div>
      </div>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
              <title>Components - ${componentData.title}</title>
              <style>
                * {box - sizing: border-box; margin: 0; padding: 0; }
                body {background: #0a0a0a; color: #fff; font-family: -apple-system, sans-serif; min-height: 100vh; }

                /* 🎨 Custom Scrollbar - 전역 통일 */
                ::-webkit-scrollbar {width: 8px; height: 8px; }
                ::-webkit-scrollbar-track {background: transparent; }
                ::-webkit-scrollbar-thumb {background: linear-gradient(180deg, #6366f1, #a855f7); border-radius: 4px; }
                ::-webkit-scrollbar-thumb:hover {background: linear-gradient(180deg, #818cf8, #c084fc); }
                * {scrollbar-width: thin; scrollbar-color: #6366f1 transparent; }

                /* Header */
                .header {text - align: center; padding: 40px 24px 20px; }
                .header h1 {font - size: 24px; margin-bottom: 6px; }
                .header p {font - size: 13px; color: #888; }

                /* Tabs */
                .tabs {display: flex; justify-content: center; gap: 8px; padding: 16px; border-bottom: 1px solid #222; }
                .tab {background: #1a1a1a; border: none; color: #888; padding: 12px 32px; border-radius: 8px; cursor: pointer; font-size: 14px; transition: all 0.2s; }
                .tab:hover {background: #252525; color: #fff; }
                .tab.active {background: linear-gradient(135deg, #6366f1, #a855f7); color: #fff; }

                /* Content */
                .content {max - width: 1000px; margin: 0 auto; padding: 32px 24px; }
                .panel {display: none; animation: fadeIn 0.3s; }
                .panel.active {display: block; }
                @keyframes fadeIn {from {opacity: 0; transform: translateY(10px); } to {opacity: 1; transform: translateY(0); } }

                /* Colors - Split Layout */
                .color-palette-bar, .font-palette-bar {display: flex; gap: 8px; padding: 12px 0; margin-bottom: 16px; flex-wrap: wrap; }
                .palette-item {display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; }
                .palette-item:hover .palette-color {transform: scale(1.1); }
                .palette-item.active .palette-color {border - color: #fff; box-shadow: 0 0 0 2px #6366f1; }
                .palette-color {width: 32px; height: 32px; border-radius: 6px; border: 2px solid transparent; transition: all 0.2s; }
                .palette-code {font - size: 9px; color: #888; font-family: monospace; }
                .font-palette-item {padding: 8px 12px; background: #222; border-radius: 8px; cursor: pointer; transition: all 0.2s; border: 2px solid transparent; }
                .font-palette-item:hover {background: #333; }
                .font-palette-item.active {border - color: #6366f1; background: #333; }
                .font-palette-name {font - size: 11px; color: #aaa; }
                .color-layout {display: grid; grid-template-columns: 240px 1fr; gap: 24px; min-height: 400px; }
                .color-list {background: #151515; border-radius: 12px; padding: 12px; max-height: 500px; overflow-y: auto; }
                .color-item {display: flex; align-items: center; gap: 12px; padding: 10px; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
                .color-item:hover {background: #252525; }
                .color-item.active {background: linear-gradient(135deg, #6366f1, #a855f7); }
                .color-swatch {width: 36px; height: 36px; border-radius: 8px; border: 1px solid #444; flex-shrink: 0; }
                .color-info {display: flex; flex-direction: column; gap: 2px; }
                .color-hex {font - size: 13px; font-family: monospace; }
                .color-count {font - size: 11px; color: #888; }
                .color-item.active .color-count {color: rgba(255,255,255,0.7); }

                .color-detail {background: #151515; border-radius: 12px; padding: 24px; }
                .color-preview {height: 100px; border-radius: 12px; margin-bottom: 16px; }
                .color-hex-big {font - size: 24px; font-family: monospace; margin-bottom: 12px; }
                .copy-btn {background: #6366f1; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-bottom: 20px; }
                .copy-btn:hover {background: #4f46e5; }
                .usage-section {margin - bottom: 16px; }
                .usage-section h4 {font - size: 13px; color: #888; margin-bottom: 8px; }
                .usage-tags {display: flex; flex-wrap: wrap; gap: 6px; }
                .usage-tag {background: #252525; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-family: monospace; }
                .no-usage {color: #555; font-size: 12px; }
                /* details/summary 접힘 스타일 */
                details.usage-section {margin-top: 12px; }
                details.usage-section summary {cursor: pointer; color: #aaa; font-size: 13px; padding: 8px 0; user-select: none; }
                details.usage-section summary:hover {color: #fff; }
                details.usage-section[open] summary {color: #a855f7; }
                .usage-comps {display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
                .usage-comp-tag {background: #3730a3; color: #c7d2fe; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-family: monospace; cursor: pointer; transition: all 0.2s; }
                .usage-comp-tag:hover {background: #4f46e5; color: #fff; }
                .more-tag {background: #333; color: #888; padding: 4px 10px; border-radius: 4px; font-size: 11px; }
                .style-usage-panel {position: fixed; bottom: 20px; right: 20px; background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 16px; max-width: 400px; max-height: 300px; overflow-y: auto; z-index: 1000; box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
                .usage-comp-list {display: flex; flex-wrap: wrap; gap: 8px; }
                .usage-comp {background: #252525; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; transition: all 0.2s; }
                .usage-comp:hover {background: #4f46e5; color: #fff; }

                /* Fonts - Split Layout */
                .font-layout {display: grid; grid-template-columns: 240px 1fr; gap: 24px; min-height: 400px; }
                .font-list {background: #151515; border-radius: 12px; padding: 12px; max-height: 500px; overflow-y: auto; }
                .font-item {display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
                .font-item:hover {background: #252525; }
                .font-item.active {background: linear-gradient(135deg, #6366f1, #a855f7); }
                .font-preview {font - size: 24px; width: 48px; text-align: center; }
                .font-info {display: flex; flex-direction: column; gap: 2px; }
                .font-family {font - size: 13px; }
                .font-weights {font - size: 11px; color: #888; }
                .font-item.active .font-weights {color: rgba(255,255,255,0.7); }
                .font-missing {font - size: 10px; color: #ef4444; display: block !important; }

                .font-detail {background: #151515; border-radius: 12px; overflow: hidden; }
                .font-detail-header {padding: 20px; background: #1a1a1a; }
                .font-detail-header h3 {font - size: 18px; margin-bottom: 6px; }
                .font-detail-header span {font - size: 12px; color: #888; }
                .font-samples {padding: 20px; display: flex; flex-direction: column; gap: 16px; }
                .font-sample {background: #1a1a1a; border-radius: 8px; padding: 16px; }
                .sample-label {font - size: 11px; color: #6366f1; margin-bottom: 10px; }
                .sample-text {font - size: 20px; line-height: 1.6; }
                .sample-text div:last-child {color: #aaa; }

                /* Components - Split Layout */
                .comp-layout {display: grid; grid-template-columns: 280px 1fr; gap: 24px; min-height: 500px; }
                .comp-list {background: #151515; border-radius: 12px; padding: 12px; max-height: 600px; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #6366f1 #252525; }
                .comp-list::-webkit-scrollbar {width: 8px; }
                .comp-list::-webkit-scrollbar-track {background: #252525; border-radius: 4px; }
                .comp-list::-webkit-scrollbar-thumb {background: linear-gradient(180deg, #6366f1, #a855f7); border-radius: 4px; }
                .comp-list::-webkit-scrollbar-thumb:hover {background: linear-gradient(180deg, #818cf8, #c084fc); }
                details.usage-section {margin-top: 12px; }
                details.usage-section summary {cursor: pointer; font-weight: 600; color: #a78bfa; padding: 8px 0; user-select: none; transition: color 0.2s; }
                details.usage-section summary:hover {color: #c4b5fd; }
                details[open].usage-section summary {color: #fff; }
                details.usage-section[open] summary::after {content: ''; }
                .comp-item {display: flex; align-items: center; gap: 10px; padding: 12px; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
                .comp-item:hover {background: #252525; }
                .comp-item.active {background: linear-gradient(135deg, #6366f1, #a855f7); }
                .item-level {background: #333; color: #888; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: bold; }
                .comp-item.active .item-level {background: rgba(255,255,255,0.2); color: #fff; }

                /* Level Tabs */
                .level-tabs {display: flex; gap: 6px; padding: 12px 0; margin-bottom: 16px; flex-wrap: wrap; }
                .level-tab {background: #1a1a1a; border: 1px solid #333; color: #888; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-size: 12px; transition: all 0.2s; }
                .level-tab:hover {background: #252525; color: #fff; border-color: #555; }
                .level-tab.active {background: #6366f1; color: #fff; border-color: #6366f1; }
                
                /* Type Tabs (Sub-filters) */
                .type-tabs {display: flex; gap: 4px; padding: 8px 0; margin-bottom: 12px; flex-wrap: wrap; border-top: 1px solid #333; }
                .type-tab {background: #0d0d0d; border: 1px solid #2a2a2a; color: #666; padding: 6px 12px; border-radius: 5px; cursor: pointer; font-size: 11px; transition: all 0.2s; }
                .type-tab:hover {background: #1a1a1a; color: #aaa; border-color: #444; }
                .type-tab.active {background: #3b3b4f; color: #a5b4fc; border-color: #6366f1; }
                
                .item-icon {font - size: 18px; }
                .item-name {flex: 1; font-size: 14px; }
                .item-size {font - size: 11px; color: #888; }
                .comp-item.active .item-size {color: rgba(255,255,255,0.7); }

                .comp-detail {background: #151515; border-radius: 12px; overflow: hidden; }
                .detail-header {padding: 16px 20px; background: #1a1a1a; display: flex; justify-content: space-between; align-items: center; }
                .detail-header h3 {font - size: 16px; }
                .detail-header span {font - size: 13px; color: #888; }
                .svg-download-btn {background: linear-gradient(135deg, #10b981, #059669); border: none; color: #fff; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.2s; margin-left: auto; }
                .svg-download-btn:hover {background: linear-gradient(135deg, #34d399, #10b981); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }

                .preview-compare {display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: #333; }
                .preview-box {background: #fff; min-height: 180px; display: flex; flex-direction: column; }
                .preview-label {padding: 8px 12px; background: #222; color: #888; font-size: 11px; }
                .preview-box img {max - width: 100%; max-height: 200px; object-fit: contain; padding: 12px; }
                .preview-box iframe {flex: 1; width: 100%; min-height: 150px; border: none; }
                .no-preview {padding: 20px; color: #999; font-size: 12px; text-align: center; }

                /* 🆕 2단계 1단계 연결 시각화 */
                .child-section {margin - bottom: 16px; }
                .child-thumbs {display: flex; align-items: center; gap: 8px; padding: 16px; background: #1a1a1a; border-radius: 8px; flex-wrap: wrap; }
                .child-thumb {display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; padding: 8px; border-radius: 8px; background: #252525; transition: all 0.2s; }
                .child-thumb:hover {background: #333; transform: scale(1.05); }
                .child-thumb img {max - width: 80px; max-height: 60px; object-fit: contain; border-radius: 4px; }
                .child-thumb span {font - size: 10px; color: #888; }
                .child-thumb .no-img {width: 60px; height: 40px; display: flex; align-items: center; justify-content: center; background: #333; border-radius: 4px; font-size: 10px; color: #666; }
                .child-plus {font - size: 20px; color: #666; font-weight: bold; }
                .child-arrow {text - align: center; font-size: 24px; color: #666; margin-top: 8px; }

                .code-sections {display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid #222; }
                .code-section {border - right: 1px solid #222; }
                .code-section:last-child {border - right: none; }
                .section-header {padding: 8px 12px; background: #1a1a1a; display: flex; justify-content: space-between; align-items: center; }
                .section-header span {font - size: 11px; color: #888; font-weight: 600; }
                .section-header button {background: transparent; border: none; cursor: pointer; font-size: 12px; opacity: 0.6; }
                .section-header button:hover {opacity: 1; }
                .code-section pre {padding: 12px; background: #0d0d0d; color: #888; font-size: 10px; font-family: 'SF Mono', Consolas, monospace; overflow: auto; max-height: 150px; white-space: pre-wrap; word-break: break-all; margin: 0; scrollbar-width: none; -ms-overflow-style: none; }
                .code-section pre::-webkit-scrollbar {display: none; }

                .props-grid {padding: 8px 12px; background: #0d0d0d; max-height: 150px; overflow-y: auto; scrollbar-width: none; -ms-overflow-style: none; }
                .props-grid::-webkit-scrollbar {display: none; }
                .prop-row {display: flex; padding: 4px 0; border-bottom: 1px solid #1a1a1a; }
                .prop-key {width: 90px; font-size: 10px; color: #a855f7; font-family: monospace; flex-shrink: 0; }
                .prop-val {font - size: 10px; color: #888; font-family: monospace; word-break: break-all; }

                /* Libraries Panel */
                .libs-header {text-align: center; margin-bottom: 24px; }
                .libs-header h2 {font-size: 24px; margin-bottom: 8px; }
                .libs-header p {color: #888; font-size: 14px; }
                .libs-grid {display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
                .libs-category {background: #151515; border-radius: 12px; padding: 20px; }
                .libs-category h3 {font-size: 16px; color: #a78bfa; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #333; }
                .libs-items {display: flex; flex-direction: column; gap: 12px; }
                .lib-card {display: flex; align-items: center; gap: 12px; padding: 12px; background: #1a1a1a; border-radius: 8px; transition: all 0.2s; }
                .lib-card:hover {background: #252525; transform: translateX(4px); }
                .lib-icon {font-size: 28px; width: 40px; text-align: center; }
                .lib-info {display: flex; flex-direction: column; gap: 2px; overflow: hidden; }
                .lib-name {font-weight: 600; font-size: 14px; }
                .lib-source {font-size: 11px; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .no-libs {text-align: center; color: #666; padding: 40px; font-size: 16px; }

                /* Toast */
                .toast {position: fixed; bottom: 24px; right: 24px; background: #22c55e; color: #fff; padding: 12px 24px; border-radius: 8px; opacity: 0; transform: translateY(20px); transition: all 0.3s; z-index: 999; }

                .toast.show {opacity: 1; transform: translateY(0); }
              </style>
          </head>
          <body>
            <div class="header">
              <h1>🧩 Component Library</h1>
              <p>${componentData.url}</p>
            </div>

            <nav class="tabs">
              <button class="tab active" onclick="showTab('colors')">🎨 Colors</button>
              <button class="tab" onclick="showTab('fonts')">📝 Fonts</button>
              <button class="tab" onclick="showTab('components')">🧩 Components</button>
              <button class="tab" onclick="showTab('libraries')">📚 Libraries</button>
            </nav>

            <main class="content">
              <!-- Colors Panel -->
              <div class="panel active" id="panel-colors">
                <div class="color-palette-bar">
                  ${componentData.colors.map((c, i) => `<div class="palette-item" onclick="selectColor(${i})"><div class="palette-color" style="background:${c.hex}" title="${c.hex}"></div><span class="palette-code">${c.hex.slice(0, 7)}</span></div>`).join('')}
                </div>
                <div class="color-layout">
                  <div class="color-list">${componentData.colors.map((c, i) => `<div class="color-item ${i === 0 ? 'active' : ''}" id="color-item-${i}" onclick="selectColor(${i})"><div class="color-swatch" style="background:${c.hex}"></div><div class="color-info"><span class="color-hex">${c.hex}</span><span class="color-count">${c.count}회 | ${c.componentIds?.length || 0}개</span></div></div>`).join('')}</div>
                  <div class="color-details">${componentData.colors.map((c, i) => `<div class="color-detail" id="color-${i}" style="${i === 0 ? '' : 'display:none'}"><div class="color-preview" style="background:${c.hex}"></div><div class="color-hex-big">${c.hex}</div><button class="copy-btn" onclick="copy('${c.hex}')">📋 복사</button><div class="usage-section"><h4>📝 Text Color</h4><div class="usage-tags">${c.usages.text.length ? c.usages.text.map(t => `<span class="usage-tag">${t}</span>`).join('') : '<span class="no-usage">사용 없음</span>'}</div></div><div class="usage-section"><h4>🎨 Background</h4><div class="usage-tags">${c.usages.bg.length ? c.usages.bg.map(t => `<span class="usage-tag">${t}</span>`).join('') : '<span class="no-usage">사용 없음</span>'}</div></div><div class="usage-section"><h4>🔲 Border</h4><div class="usage-tags">${c.usages.border.length ? c.usages.border.map(t => `<span class="usage-tag">${t}</span>`).join('') : '<span class="no-usage">사용 없음</span>'}</div></div><details class="usage-section"><summary>🧩 컴포넌트 (${c.componentIds?.length || 0}개) ▸</summary><div class="usage-comps">${c.componentIds?.length ? c.componentIds.slice(0, 50).map(idx => `<span class="usage-comp-tag" onclick="goToComp(${idx})">${componentData.components[idx]?.type}-${idx}</span>`).join('') + (c.componentIds.length > 50 ? `<span class="no-usage">+${c.componentIds.length - 50}개 더</span>` : '') : '<span class="no-usage">없음</span>'}</div></details></div>`).join('')}</div>
                </div>
              </div>
              <div id="style-usage-panel" class="style-usage-panel" style="display:none;"></div>

              <!-- Fonts Panel -->
              <div class="panel" id="panel-fonts">
                <div class="font-palette-bar">
                  ${componentData.fonts.map((f, i) => `<div class="font-palette-item" onclick="selectFont(${i})"><span class="font-palette-name" style="font-family:'${f.family}'">${f.family}</span></div>`).join('')}
                </div>
                <div class="font-layout">
                  <div class="font-list">
                    ${componentData.fonts.map((f, i) => `<div class="font-item ${i === 0 ? 'active' : ''}" data-font="${f.family}" onclick="selectFont(${i})"><span class="font-preview" style="font-family:'${f.family}'">Aa</span><div class="font-info"><span class="font-family">${f.family}</span><span class="font-weights">${f.weights.length}개 웨이트</span><span class="font-missing" style="display:none">⚠️ 로컬에 없음</span></div></div>`).join('')}
                  </div>
                  <div class="font-details">
                    ${componentData.fonts.map((f, i) => `<div class="font-detail" id="font-${i}" style="${i === 0 ? '' : 'display:none'}"><div class="font-samples">${f.weights.map(w => `<div class="font-sample"><div class="sample-label">Weight ${w}</div><div class="sample-text" style="font-family:${f.family};font-weight:${w}"><div>AaBbCcDdEeFfGg 0123456789</div><div>가나다라마바사 아자차카타파하</div></div></div>`).join('')}</div><details class="usage-section"><summary>🧩 컴포넌트 (${f.componentIds?.length || 0}개) ▸</summary><div class="usage-comps">${f.componentIds?.length ? f.componentIds.slice(0, 50).map(idx => `<span class="usage-comp-tag" onclick="goToComp(${idx})">${componentData.components[idx]?.type}-${idx}</span>`).join('') + (f.componentIds.length > 50 ? `<span class="no-usage">+${f.componentIds.length - 50}개 더</span>` : '') : '<span class="no-usage">없음</span>'}</div></details></div>`).join('')}
                  </div>
                </div>
              </div>

              <!-- Components Panel -->
              <div class="panel" id="panel-components">
                <div class="level-tabs">
                  <button class="level-tab active" onclick="filterLevel(0)">전체 (${componentData.components.length})</button>
                  <button class="level-tab" onclick="filterLevel(1)">1단계 원자 (${levelCounts[1]})</button>
                  <button class="level-tab" onclick="filterLevel(2)">2단계 분자 (${levelCounts[2]})</button>
                  <button class="level-tab" onclick="filterLevel(3)">3단계 유기체 (${levelCounts[3]})</button>
                  <button class="level-tab" onclick="filterLevel(4)">4단계 템플릿 (${levelCounts[4]})</button>
                </div>
                <div class="level-tabs" id="type-tabs" style="display:none;margin-top:-8px">
                  <button class="type-tab" onclick="filterType('all')">전체</button>
                  ${level1TypeButtons}
                </div>
                <div class="comp-layout">
                  <div class="comp-list">${compListItems}</div>
                  <div class="comp-details">${compDetails}</div>
                </div>
              </div>

              <!-- Libraries Panel -->
              <div class="panel" id="panel-libraries">
                <div class="libs-header">
                  <h2>📚 감지된 라이브러리 (${componentData.libraries?.length || 0}개)</h2>
                  <p>이 웹사이트에서 사용된 라이브러리 및 프레임워크</p>
                </div>
                <div class="libs-grid">
                  ${(() => {
        const grouped = {};
        (componentData.libraries || []).forEach(lib => {
          if (!grouped[lib.category]) grouped[lib.category] = [];
          grouped[lib.category].push(lib);
        });
        return Object.entries(grouped).map(([category, libs]) => `
                      <div class="libs-category">
                        <h3>${category}</h3>
                        <div class="libs-items">
                          ${libs.map(lib => `
                            <div class="lib-card">
                              <span class="lib-icon">${lib.icon}</span>
                              <div class="lib-info">
                                <span class="lib-name">${lib.name}</span>
                                <span class="lib-source" title="${lib.source}">${lib.source.length > 50 ? lib.source.slice(0, 47) + '...' : lib.source}</span>
                              </div>
                            </div>
                          `).join('')}
                        </div>
                      </div>
                    `).join('') || '<div class="no-libs">감지된 라이브러리가 없습니다.</div>';
      })()}
                </div>
              </div>
            </main>


            <div class="toast" id="toast">복사됨!</div>

            <script>
              // 🆕 컴포넌트 데이터를 전역 변수로 정의 (자식/부모 클릭 동작에 필요)
              const componentData = ${JSON.stringify(componentData)};
              
              function showTab(name) {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
              event.target.classList.add('active');
              document.getElementById('panel-' + name).classList.add('active');
              // 색상/폰트 결과 패널 숨기기
              document.getElementById('style-usage-panel').style.display = 'none';
    }

    // 🆕 색상 클릭 시 해당 색상을 사용하는 컴포넌트 표시
    function showColorComps(colorIdx) {
      const color = componentData.colors[colorIdx];
      if (!color || !color.componentIds || color.componentIds.length === 0) {
        alert('이 색상을 사용하는 컴포넌트가 없습니다.');
        return;
      }
      
      // 패널 표시
      const panel = document.getElementById('style-usage-panel');
      panel.style.display = 'block';
      panel.innerHTML = '<h3 style="margin:0 0 12px 0;">🎨 ' + color.hex + ' 사용 컴포넌트 (' + color.componentIds.length + '개)</h3>' +
        '<div class="usage-comp-list">' + color.componentIds.map(idx => {
          const c = componentData.components[idx];
          return '<div class="usage-comp" onclick="goToComp(' + idx + ')">' + c.type + '-' + idx + ' <span style="opacity:0.5">' + c.width + '×' + c.height + '</span></div>';
        }).join('') + '</div>';
    }

    // 🆕 폰트 클릭 시 해당 폰트를 사용하는 컴포넌트 표시
    function showFontComps(fontIdx) {
      const font = componentData.fonts[fontIdx];
      if (!font || !font.componentIds || font.componentIds.length === 0) {
        alert('이 폰트를 사용하는 컴포넌트가 없습니다.');
        return;
      }
      
      const panel = document.getElementById('style-usage-panel');
      panel.style.display = 'block';
      panel.innerHTML = '<h3 style="margin:0 0 12px 0;">🔤 ' + font.family + ' 사용 컴포넌트 (' + font.componentIds.length + '개)</h3>' +
        '<div class="usage-comp-list">' + font.componentIds.map(idx => {
          const c = componentData.components[idx];
          return '<div class="usage-comp" onclick="goToComp(' + idx + ')">' + c.type + '-' + idx + ' <span style="opacity:0.5">' + c.width + '×' + c.height + '</span></div>';
        }).join('') + '</div>';
    }

    // 🆕 컴포넌트로 이동 (Components 탭으로 전환)
    function goToComp(idx) {
      // Components 탭으로 전환
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      document.querySelector('.tab[onclick*="components"]').classList.add('active');
      document.getElementById('panel-components').classList.add('active');
      
      // 전체 필터로 전환
      document.querySelectorAll('.level-tab').forEach(t => t.classList.remove('active'));
      document.querySelector('.level-tab').classList.add('active');
      document.querySelectorAll('.comp-item').forEach(item => item.style.display = 'flex');
      document.getElementById('type-tabs').style.display = 'none';
      document.getElementById('style-usage-panel').style.display = 'none';
      
      // 컴포넌트 선택 및 스크롤
      selectComp(idx);
      const targetItem = document.querySelector('.comp-item[data-idx="' + idx + '"]');
      if (targetItem) {
        targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

              function selectComp(i) {
                document.querySelectorAll('.comp-item').forEach(el => el.classList.remove('active'));
                document.querySelectorAll('.comp-detail').forEach(el => el.style.display = 'none');
                const items = document.querySelectorAll('.comp-item');
                items.forEach(item => {
                  if (item.dataset.idx === String(i)) item.classList.add('active');
                });
                document.getElementById('detail-' + i).style.display = 'block';
                
                // 🆕 Lazy Iframe Loading: 브라우저 1000개 iframe 제한 우회
                // 선택된 컴포넌트에만 동적으로 단일 iframe 생성
                const container = document.getElementById('iframe-container-' + i);
                if (container) {
                  const comp = componentData.components[i];
                  if (!comp) return;
                  const parentBg = (comp.styles && comp.styles.parentBg) || '#fff';
                  
                  // 기존 iframe이 있으면 재사용, 없으면 새로 생성
                  let iframe = container.querySelector('iframe');
                  if (!iframe) {
                    iframe = document.createElement('iframe');
                    iframe.style.cssText = 'width:100%;height:100%;border:none;border-radius:8px;';
                    container.innerHTML = ''; // placeholder 내용 제거
                    container.appendChild(iframe);
                  }
                  
                  // srcdoc을 사용하여 안정적으로 콘텐츠 주입
                  const htmlContent = \`<!DOCTYPE html><html><head>
                    <base href="${componentData.url}">
                    <style>
                    * { box-sizing: border-box; }
                    body { margin: 0; padding: 16px; background: \${parentBg}; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
                    /* 원본 CSS 먼저 적용 */
                    \${componentData.allCSS || ''}
                    /* 이미지/비디오/SVG placeholder - 마지막에 적용하여 오버라이드 */
                    img, video { 
                      min-width: 50px !important; min-height: 50px !important; 
                      background: repeating-linear-gradient(45deg, #e0e0e0, #e0e0e0 10px, #f0f0f0 10px, #f0f0f0 20px) !important;
                      display: inline-block !important;
                      border: 1px dashed #ccc !important;
                      visibility: visible !important;
                      opacity: 1 !important;
                    }
                    svg { background: repeating-linear-gradient(45deg, #ddd, #ddd 10px, #eee 10px, #eee 20px) !important; }
                  </style></head><body>\${comp.html}</body></html>\`;
                  
                  try {
                    iframe.srcdoc = htmlContent;
                  } catch (e) {
                    console.warn('iframe render error:', e);
                  }
                }
    }
    
    // 🆕 2단계 썸네일에서 1단계로 이동할 때 사용 (필터 초기화 + 스크롤)
    function selectCompFromChild(i) {
                // 해당 컴포넌트의 레벨로 필터 전환
                const comp = componentData.components[i];
                const level = comp ? comp.level : 0;
                
                // 해당 레벨 탭 활성화 및 필터 적용
                document.querySelectorAll('.level-tab').forEach(t => t.classList.remove('active'));
                const levelTabs = document.querySelectorAll('.level-tab');
                if (level > 0 && levelTabs[level]) {
                  levelTabs[level].classList.add('active');
                  // 해당 레벨만 표시
                  document.querySelectorAll('.comp-item').forEach(item => {
                    const itemLevel = componentData.components[item.dataset.idx]?.level;
                    item.style.display = itemLevel === level ? 'flex' : 'none';
                  });
                } else {
                  levelTabs[0]?.classList.add('active'); // 전체 탭
                  document.querySelectorAll('.comp-item').forEach(item => item.style.display = 'flex');
                }
                document.getElementById('type-tabs').style.display = 'none';
                
                selectComp(i);
                
                // 왼쪽 목록에서 해당 항목으로 스크롤
                const targetItem = document.querySelector('.comp-item[data-idx="' + i + '"]');
                if (targetItem) {
                  targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
    }

              function filterLevel(level) {
                // 탭 활성화
                document.querySelectorAll('.level-tab').forEach(t => t.classList.remove('active'));
              event.target.classList.add('active');

      // 아이템 필터링
      document.querySelectorAll('.comp-item').forEach(item => {
        if (level === 0 || item.dataset.level === String(level)) {
                item.style.display = 'flex';
        } else {
                item.style.display = 'none';
        }
      });

              // 첫 번째 보이는 아이템 선택
              const visible = document.querySelector('.comp-item[style="display: flex"], .comp-item:not([style*="display: none"])');
              if (visible) {
                selectComp(parseInt(visible.dataset.idx));
      }
              // 🆕 동적 서브탭 생성: 해당 레벨의 타입들
              const typeTabs = document.getElementById('type-tabs');
              if (level === 0) {
                typeTabs.style.display = 'none';
              } else {
                // 해당 레벨의 타입들 수집
                const types = {};
                document.querySelectorAll('.comp-item').forEach(item => {
                  if (item.dataset.level === String(level)) {
                    const t = item.dataset.type;
                    types[t] = (types[t] || 0) + 1;
                  }
                });
                // 서브탭 HTML 생성
                const sorted = Object.entries(types).sort((a,b) => b[1] - a[1]);
                typeTabs.innerHTML = '<div class="type-tab active" onclick="filterTypeForLevel(' + level + ', \\'all\\')" style="font-size:12px">전체</div>' +
                  sorted.map(([t, cnt]) => '<div class="type-tab" onclick="filterTypeForLevel(' + level + ', \\'' + t + '\\')" style="font-size:12px">' + t + ' (' + cnt + ')</div>').join('');
                typeTabs.style.display = 'flex';
              }
    }
    
    // 🆕 레벨별 타입 필터
    function filterTypeForLevel(level, type) {
      document.querySelectorAll('.type-tab').forEach(t => t.classList.remove('active'));
      event.target.classList.add('active');
      
      document.querySelectorAll('.comp-item').forEach(item => {
        const matchLevel = item.dataset.level === String(level);
        const matchType = type === 'all' || item.dataset.type === type;
        item.style.display = matchLevel && matchType ? 'flex' : 'none';
      });
      
      const visible = document.querySelector('.comp-item[style="display: flex"]');
      if (visible) selectComp(parseInt(visible.dataset.idx));
    }

              function filterType(type) {
                // 탭 활성화
                document.querySelectorAll('.type-tab').forEach(t => t.classList.remove('active'));
              event.target.classList.add('active');

      // 아이템 필터링 (현재 활성 레벨 기준)
      const activeLevel = document.querySelector('.level-tab.active')?.dataset?.level || '0';
      document.querySelectorAll('.comp-item').forEach(item => {
        const matchLevel = activeLevel === '0' || item.dataset.level === activeLevel;
        const matchType = type === 'all' || item.dataset.type === type;
        item.style.display = matchLevel && matchType ? 'flex' : 'none';
      });

              // 첫 번째 보이는 아이템 선택
              const visible = document.querySelector('.comp-item[style="display: flex"]');
              if (visible) selectComp(parseInt(visible.dataset.idx));
    }

              function selectColor(i) {
                document.querySelectorAll('.color-item').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.palette-item').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.color-detail').forEach(el => el.style.display = 'none');
              const item = document.getElementById('color-item-' + i);
              const paletteItems = document.querySelectorAll('.palette-item');
              if (item) {
                item.classList.add('active');
              item.scrollIntoView({behavior: 'smooth', block: 'center' });
      }
              if (paletteItems[i]) paletteItems[i].classList.add('active');
              document.getElementById('color-' + i).style.display = 'block';
    }

              function selectFont(i) {
                document.querySelectorAll('.font-item').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.font-palette-item').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.font-detail').forEach(el => el.style.display = 'none');
              document.querySelectorAll('.font-item')[i].classList.add('active');
              const fontPaletteItems = document.querySelectorAll('.font-palette-item');
              if (fontPaletteItems[i]) fontPaletteItems[i].classList.add('active');
              document.getElementById('font-' + i).style.display = 'block';
    }

              // 폰트 존재 여부 체크
              function checkFonts() {
                document.querySelectorAll('.font-item').forEach(item => {
                  const fontName = item.dataset.font;
                  if (!document.fonts.check('16px "' + fontName + '"')) {
                    item.querySelector('.font-missing').style.display = 'block';
                  }
                });
    }
              document.fonts.ready.then(checkFonts);

              function showCodeTab(compIdx, tabName) {
      const detail = document.getElementById('detail-' + compIdx);
      detail.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
      detail.querySelectorAll('.code-panel').forEach(p => p.classList.remove('active'));
              event.target.classList.add('active');
              document.getElementById('code-' + tabName + '-' + compIdx).classList.add('active');
    }

              function toast(msg) {
      const t = document.getElementById('toast');
              t.textContent = msg;
              t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 2000);
    }

              function copy(text) {
                navigator.clipboard.writeText(text).then(() => toast(text + ' 복사됨'));
    }

              function copySection(i, type) {
      const el = document.getElementById(type + '-' + i);
              const code = el.textContent.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
      navigator.clipboard.writeText(code).then(() => toast(type.toUpperCase() + ' 복사됨!'));
    }

    // 🆕 SVG 다운로드 함수
    function downloadSvg(i) {
      const comp = componentData.components[i];
      if (!comp || comp.type !== 'svg') {
        toast('SVG 컴포넌트가 아닙니다');
        return;
      }
      
      // SVG HTML 추출 및 정리
      let svgContent = comp.html;
      
      // xmlns 속성이 없으면 추가 (SVG 파일 호환성)
      if (!svgContent.includes('xmlns=')) {
        svgContent = svgContent.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      
      // viewBox가 없으면 추가
      if (!svgContent.includes('viewBox') && comp.width && comp.height) {
        svgContent = svgContent.replace('<' + 'svg', '<' + 'svg viewBox="0 0 ' + comp.width + ' ' + comp.height + '"');
      }
      
      // Blob 생성 및 다운로드
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = comp.type + '-' + i + '.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast(comp.type + '-' + i + '.svg 다운로드됨');
    }
    
    // 🆕 페이지 로드 시 첫 번째 컴포넌트 자동 선택
    setTimeout(() => {
      if (componentData.components.length > 0) {
        selectComp(0);
      }
    }, 100);
            </script>
          </body>
        </html>`;
    fs.writeFileSync(path.join(outputDir, 'styleguide.html'), html);
    console.log('  ✅ styleguide.html');

    // tokens.json
    fs.writeFileSync(path.join(outputDir, 'tokens.json'), JSON.stringify({
      url: componentData.url,
      title: componentData.title,
      colors: componentData.colors,
      fonts: componentData.fonts,
      components: componentData.components.map((c, i) => ({
        name: c.type + '-' + i,
        type: c.type,
        width: c.width,
        height: c.height,
        image: c.image,
        html: c.html
      })),
      missingStats: componentData.missingStats,
      allCSS: componentData.allCSS
    }, null, 2));
    console.log('  ✅ tokens.json');

    // styles.css
    let css = ':root {\n';
    componentData.colors.forEach((c, i) => css += '  --color-' + (i + 1) + ': ' + c + ';\n');
    css += '}\n';
    fs.writeFileSync(path.join(outputDir, 'styles.css'), css);
    console.log('  ✅ styles.css');

    await page.screenshot({ path: path.join(outputDir, 'screenshot.png'), fullPage: false });
    console.log('  📸 screenshot.png');

    console.log('\n🎉 완료! ' + componentData.components.length + '개 컴포넌트');
    console.log('   📂 ' + outputDir + '/styleguide.html 열어보세요\n');

  } catch (error) {
    console.error('❌ 에러:', error.message);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
}

main();

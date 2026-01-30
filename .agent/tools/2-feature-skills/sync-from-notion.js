/**
 * sync-from-notion.js
 * 노션 DB에서 기능 상태를 읽어와 CSV를 업데이트합니다.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CSV_PATH = path.join(process.cwd(), 'docs/2-기능정의/features.csv');
const NOTION_DB_ID = '2e4295ae-c7dc-8097-b003-cc1fb69f9274';

// 노션 API 호출 (MCP 통해서는 안되므로 수동 안내)
console.log('📋 노션 동기화 안내');
console.log('================');
console.log('');
console.log('노션 DB URL: https://www.notion.so/' + NOTION_DB_ID.replace(/-/g, ''));
console.log('');
console.log('현재 노션 MCP API 제한으로 자동 동기화가 어렵습니다.');
console.log('');
console.log('💡 대안: 에이전트에게 요청하세요');
console.log('   "@2-feature-planner 노션에서 기능 상태 읽어와서 CSV 업데이트해줘"');
console.log('');
console.log('또는 노션에서 직접 CSV로 내보내기 후 덮어쓰기:');
console.log('   1. 노션 DB 열기 → ... → Export → CSV');
console.log('   2. 다운로드된 파일을 docs/2-기능정의/features.csv로 복사');
console.log('');

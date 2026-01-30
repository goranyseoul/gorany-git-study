# Requirements Skills

요구사항 분석 및 문서화를 위한 도구 모음입니다.

## 사용 가능한 도구

### Notion MCP (내장)
- `mcp_notion-mcp-server_API-post-page`: 새 페이지 생성
- `mcp_notion-mcp-server_API-post-search`: 페이지 검색
- `mcp_notion-mcp-server_API-patch-block-children`: 콘텐츠 추가

### 출력 형식
기능 목록은 다음 JSON 스키마를 따릅니다:

```json
{
  "features": [
    {
      "id": "F001",
      "name": "기능명",
      "description": "설명",
      "priority": "P0|P1|P2",
      "userStory": {
        "asA": "사용자 유형",
        "iWantTo": "행동",
        "soThat": "목적"
      }
    }
  ]
}
```

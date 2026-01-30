#!/bin/bash

#######################################
# 🚀 SDLC 개발 환경 자동 설치 스크립트
# 
# 사용법: 터미널에서 아래 한 줄만 복사해서 실행하세요!
# 
#   bash setup.sh
#
#######################################

set -e

echo ""
echo "🚀 ======================================"
echo "   SDLC 개발 환경 자동 설치"
echo "========================================"
echo ""

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 함수: 성공 메시지
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# 함수: 진행 메시지
info() {
    echo -e "${YELLOW}⏳ $1${NC}"
}

# 함수: 에러 메시지
error() {
    echo -e "${RED}❌ $1${NC}"
}

#######################################
# Step 1: Homebrew 설치
#######################################
echo ""
echo "📦 Step 1/5: Homebrew 확인..."

if command -v brew &> /dev/null; then
    success "Homebrew 이미 설치됨"
else
    info "Homebrew 설치 중... (시간이 좀 걸릴 수 있어요)"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # PATH 설정 (Apple Silicon)
    if [[ -f "/opt/homebrew/bin/brew" ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
    # PATH 설정 (Intel)
    if [[ -f "/usr/local/bin/brew" ]]; then
        echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/usr/local/bin/brew shellenv)"
    fi
    
    success "Homebrew 설치 완료!"
fi

#######################################
# Step 2: Git 확인
#######################################
echo ""
echo "📦 Step 2/5: Git 확인..."

if command -v git &> /dev/null; then
    success "Git 이미 설치됨 ($(git --version))"
else
    info "Git 설치 중..."
    brew install git
    success "Git 설치 완료!"
fi

#######################################
# Step 3: nvm + Node.js 설치
#######################################
echo ""
echo "📦 Step 3/5: Node.js 확인..."

if command -v node &> /dev/null; then
    success "Node.js 이미 설치됨 ($(node -v))"
else
    info "nvm 설치 중..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    
    # nvm 로드
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    info "Node.js LTS 설치 중..."
    nvm install --lts
    nvm use --lts
    
    success "Node.js 설치 완료! ($(node -v))"
fi

#######################################
# Step 4: GitHub CLI 설치
#######################################
echo ""
echo "📦 Step 4/5: GitHub CLI 확인..."

if command -v gh &> /dev/null; then
    success "GitHub CLI 이미 설치됨"
else
    info "GitHub CLI 설치 중..."
    brew install gh
    success "GitHub CLI 설치 완료!"
fi

#######################################
# Step 5: GitHub 로그인 안내
#######################################
echo ""
echo "📦 Step 5/5: GitHub 연결..."

if gh auth status &> /dev/null; then
    success "GitHub 이미 로그인됨"
else
    echo ""
    echo "🔐 GitHub 로그인이 필요합니다."
    echo "   다음 명령어를 실행하고 브라우저에서 인증하세요:"
    echo ""
    echo "   ${GREEN}gh auth login${NC}"
    echo ""
fi

#######################################
# 완료!
#######################################
echo ""
echo "🎉 ======================================"
echo "   설치 완료!"
echo "========================================"
echo ""
echo "설치된 도구:"
echo "  • Homebrew: $(brew --version 2>/dev/null | head -1 || echo '확인 필요')"
echo "  • Git: $(git --version 2>/dev/null || echo '확인 필요')"
echo "  • Node.js: $(node -v 2>/dev/null || echo '확인 필요')"
echo "  • GitHub CLI: $(gh --version 2>/dev/null | head -1 || echo '확인 필요')"
echo ""
echo "👉 다음 단계: GitHub 로그인"
echo "   터미널에서 'gh auth login' 실행 후 브라우저 인증"
echo ""
echo "👉 그 다음: 프로젝트 시작"
echo "   @1-requirements-planner 요구사항 작성해줘"
echo ""

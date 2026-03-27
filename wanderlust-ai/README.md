# WanderLust AI - AI 여행 플래너 앱

AI 기반 맞춤형 여행 일정 생성 모바일 앱입니다.

## 🚀 주요 기능

- **여행 DNA 분석**: 사용자의 여행 스타일 파악
- **맞춤형 목적지 추천**: AI가 선호도에 맞는 여행지 제안
- **스마트 일정 생성**: 자동으로 최적화된 여행 일정 생성
- **인터랙티브 UI**: 직관적이고 아름다운 사용자 인터페이스

## 📱 설치 방법

### 1. 필수 요구사항
- Node.js 14 이상
- npm 또는 yarn
- Expo CLI (선택사항)

### 2. 프로젝트 설치

```bash
# 프로젝트 폴더로 이동
cd wanderlust-ai

# 의존성 설치
npm install

# 또는 yarn 사용
yarn install
```

### 3. 앱 실행

```bash
# Expo 개발 서버 시작
npm start

# iOS 시뮬레이터에서 실행 (Mac만 가능)
npm run ios

# Android 에뮬레이터에서 실행
npm run android

# 웹 브라우저에서 실행
npm run web
```

### 4. 실제 기기에서 테스트

1. 스마트폰에 **Expo Go** 앱 설치
   - iOS: App Store에서 "Expo Go" 검색
   - Android: Google Play에서 "Expo Go" 검색

2. `npm start` 실행 후 나오는 QR 코드를 Expo Go 앱으로 스캔

## 🔧 Claude API 연동 (다음 단계)

현재 버전은 UI만 구현되어 있습니다. Claude API를 연동하려면:

1. Anthropic Console에서 API 키 발급
2. `services/claudeAPI.js` 파일 생성
3. API 호출 로직 구현

```javascript
// services/claudeAPI.js 예시
const CLAUDE_API_KEY = 'your-api-key-here';

export const generateItinerary = async (travelData) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Create a travel itinerary based on: ${JSON.stringify(travelData)}`
      }]
    })
  });
  
  return await response.json();
};
```

## 📂 프로젝트 구조

```
wanderlust-ai/
├── App.js              # 메인 앱 컴포넌트
├── package.json        # 프로젝트 의존성
├── app.json           # Expo 설정
└── README.md          # 이 파일
```

## 🎨 화면 구성

1. **홈 화면**: 앱 소개 및 시작 버튼
2. **목적지 선택**: 여행지 선택
3. **여행 DNA**: 여행 스타일 설정
4. **세부 정보**: 날짜, 예산, 동행자 입력
5. **일정 화면**: AI 생성 여행 일정 표시

## 🛠️ 기술 스택

- React Native
- Expo
- JavaScript
- Claude API (예정)

## 📝 다음 개발 계획

- [ ] Claude API 연동
- [ ] 실제 지도 통합 (Google Maps API)
- [ ] 사용자 로그인/회원가입
- [ ] 일정 저장 및 공유 기능
- [ ] 오프라인 모드
- [ ] 다국어 지원

## 💡 문제 해결

### Metro bundler 오류
```bash
npm start -- --reset-cache
```

### iOS 빌드 오류
```bash
cd ios && pod install && cd ..
```

## 📄 라이센스

이 프로젝트는 개인 학습 목적으로 만들어졌습니다.

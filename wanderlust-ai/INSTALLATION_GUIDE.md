# WanderLust AI 설치 및 실행 가이드

## 📋 목차
1. [시작하기 전에](#시작하기-전에)
2. [빠른 시작](#빠른-시작)
3. [상세 설치 가이드](#상세-설치-가이드)
4. [Claude API 연동](#claude-api-연동)
5. [문제 해결](#문제-해결)

---

## 시작하기 전에

### 필수 설치 항목

1. **Node.js** (v14 이상)
   - 다운로드: https://nodejs.org/
   - 설치 확인: `node --version`

2. **npm** (Node.js와 함께 설치됨)
   - 확인: `npm --version`

3. **Git** (선택사항)
   - 다운로드: https://git-scm.com/

### 권장 도구

- **VS Code**: 코드 에디터 (https://code.visualstudio.com/)
- **Expo Go**: 모바일 테스트용 앱
  - iOS: App Store에서 다운로드
  - Android: Google Play에서 다운로드

---

## 빠른 시작

```bash
# 1. 프로젝트 폴더로 이동
cd wanderlust-ai

# 2. 패키지 설치
npm install

# 3. 앱 실행
npm start
```

그러면 터미널에 QR 코드가 나타납니다. 스마트폰의 Expo Go 앱으로 스캔하세요!

---

## 상세 설치 가이드

### 1단계: 프로젝트 다운로드

이미 파일을 받으셨다면 이 단계는 건너뛰세요.

```bash
# Git으로 클론 (예시)
git clone [repository-url]
cd wanderlust-ai
```

### 2단계: 의존성 설치

```bash
# npm 사용
npm install

# 또는 yarn 사용 (yarn이 설치되어 있다면)
yarn install
```

**설치되는 주요 패키지:**
- `expo`: React Native 개발 플랫폼
- `react`: React 라이브러리
- `react-native`: 네이티브 모바일 앱 프레임워크

### 3단계: 앱 실행

#### 방법 1: Expo Go 앱으로 실행 (추천)

```bash
npm start
```

1. 터미널에 나타난 QR 코드를 스캔
2. Expo Go 앱이 자동으로 열립니다
3. 앱이 로드되면 사용 가능!

#### 방법 2: iOS 시뮬레이터 (Mac만 가능)

```bash
# Xcode가 설치되어 있어야 함
npm run ios
```

#### 방법 3: Android 에뮬레이터

```bash
# Android Studio가 설치되어 있어야 함
npm run android
```

#### 방법 4: 웹 브라우저

```bash
npm run web
```

---

## Claude API 연동

현재 앱은 샘플 데이터로 작동합니다. 실제 AI 기능을 사용하려면 Claude API를 연동해야 합니다.

### 1단계: API 키 발급

1. https://console.anthropic.com 접속
2. 로그인 (Claude.ai 계정 사용)
3. 왼쪽 메뉴에서 "API Keys" 클릭
4. "Create Key" 버튼 클릭
5. API 키 복사 (⚠️ 한 번만 표시됩니다!)

### 2단계: API 키 설정

`services/claudeAPI.js` 파일을 열고:

```javascript
// 이 줄을 찾아서
const CLAUDE_API_KEY = 'your-api-key-here';

// 실제 API 키로 교체
const CLAUDE_API_KEY = 'sk-ant-api03-xxxxx...';
```

### 3단계: API 기능 활성화

`App.js` 파일에서 Claude API 사용:

```javascript
import { generateItinerary } from './services/claudeAPI';

// FinalDetailsScreen의 onGenerate 함수에서
const handleGenerate = async () => {
  try {
    const itinerary = await generateItinerary(travelData);
    // 생성된 일정 사용
    setGeneratedItinerary(itinerary);
    setCurrentScreen('itinerary');
  } catch (error) {
    console.error('일정 생성 실패:', error);
    alert('일정 생성에 실패했습니다. 다시 시도해주세요.');
  }
};
```

### ⚠️ 보안 주의사항

**절대 하지 말아야 할 것:**
- API 키를 GitHub에 올리지 마세요!
- API 키를 앱 코드에 하드코딩하지 마세요!

**권장 방법:**
- 백엔드 서버를 만들어서 서버에서 Claude API 호출
- 환경 변수 사용 (.env 파일)
- React Native의 react-native-dotenv 패키지 사용

---

## 문제 해결

### 문제 1: `npm install` 실패

**증상:**
```
npm ERR! code EACCES
npm ERR! syscall access
```

**해결:**
```bash
# 권한 오류 - sudo 사용 (Mac/Linux)
sudo npm install

# 또는 npm 캐시 정리
npm cache clean --force
npm install
```

### 문제 2: Metro bundler 오류

**증상:**
```
error: bundling failed: Error: Unable to resolve module...
```

**해결:**
```bash
# 캐시 초기화
npm start -- --reset-cache

# 또는
expo start -c
```

### 문제 3: Expo Go에서 앱이 로드되지 않음

**해결 방법:**
1. 컴퓨터와 스마트폰이 같은 Wi-Fi에 연결되어 있는지 확인
2. 방화벽 확인 (19000, 19001 포트 허용)
3. Expo Go 앱 재시작
4. 터미널에서 `npm start` 재실행

### 문제 4: iOS 시뮬레이터 빌드 오류

**해결:**
```bash
# Xcode Command Line Tools 설치
xcode-select --install

# CocoaPods 설치/업데이트
sudo gem install cocoapods

# Pod 재설치
cd ios
pod install
cd ..
```

### 문제 5: Android 빌드 오류

**해결:**
1. Android Studio 설치 확인
2. Android SDK 설치 확인
3. 환경 변수 설정:
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

### 문제 6: Claude API 호출 실패

**증상:**
```
API Error: 401 Unauthorized
```

**해결:**
1. API 키가 올바른지 확인
2. API 키에 따옴표가 제대로 있는지 확인
3. Anthropic Console에서 API 키가 활성화되어 있는지 확인
4. API 크레딧 잔액 확인

**증상:**
```
API Error: 429 Too Many Requests
```

**해결:**
- API 호출 제한 초과. 잠시 후 다시 시도
- Rate limit 확인: https://docs.anthropic.com/claude/reference/rate-limits

---

## 추가 리소스

### 공식 문서
- **React Native**: https://reactnative.dev/
- **Expo**: https://docs.expo.dev/
- **Claude API**: https://docs.anthropic.com/

### 커뮤니티
- React Native Discord
- Expo Forums
- Stack Overflow

### 학습 자료
- React Native 튜토리얼: https://reactnative.dev/docs/tutorial
- Expo 튜토리얼: https://docs.expo.dev/tutorial/introduction/
- Claude API 가이드: https://docs.anthropic.com/claude/docs/

---

## 다음 단계

1. ✅ 앱 설치 완료
2. ✅ 로컬에서 실행 확인
3. 🔄 Claude API 연동
4. 🔄 기능 추가 개발
5. 🔄 앱스토어 배포

문제가 생기면 언제든 질문하세요! 😊

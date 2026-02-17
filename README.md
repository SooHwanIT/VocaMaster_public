# 📘 English Vocabulary Master (영어단어장)

Electron과 React, TypeScript를 기반으로 제작된 현대적인 영어 단어 학습 애플리케이션입니다.
매일 새로운 단어를 학습하고, 오프라인 음성 인식을 통해 발음 및 쓰기 연습을 할 수 있습니다.

## ✨ 주요 기능 (Key Features)

*   **일일 단어 학습:** 날짜별로 구성된 필수 영단어와 뜻, 예문 학습.
*   **다양한 퀴즈 모드:**
    *   **객관식 퀴즈 (Choice Quiz):** 빠르게 단어의 뜻을 맞추는 스피드 퀴즈.
    *   **쓰기 퀴즈 (Write Quiz):** 단어의 철자를 직접 입력하여 암기 확인.
    *   **음성 인식 퀴즈:** Vosk 엔진을 탑재하여 **오프라인** 환경에서도 정확한 영어 발음 연습 지원.
*   **아케이드 모드:** 게임 요소를 접목한 단어 학습 미니 게임.
*   **학습 통계 대시보드:**
    *   학습 진도율, 암기 완료 단어 수, 최근 학습 기록 시각화.
    *   일일 학습 목표 달성 여부 체크.
*   **단어장 관리 & 검색:**
    *   전체 단어 목록 조회 및 검색 기능.
    *   북마크 기능을 통해 어려운 단어 집중 관리.
*   **다크 모드:** 눈이 편안한 다크 모드 UI 지원.

## 🛠 기술 스택 (Tech Stack)

*   **Frontend Check:** [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
*   **Desktop Containers:** [Electron](https://www.electronjs.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Data Storage:** [Dexie.js](https://dexie.org/) (IndexedDB Wrapper)
*   **Speech Recognition:** [Vosk Browser](https://alphacephei.com/vosk/) (WebAssembly 기반 오프라인 음성 인식)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Date Utils:** date-fns

## 📂 프로젝트 구조 (Project Structure)

```text
├── dist-electron/     # Electron 메인 프로세스 빌드 결과물
├── electron/          # Electron 소스 코드 (Main, Preload)
├── public/
│   └── models/        # Vosk 음성 인식 모델 (vosk-model-small-en-us-0.15)
├── src/
│   ├── app/           # 앱 전역 상태, 스토리지, 유틸리티
│   ├── components/    # React UI 컴포넌트 (퀴즈, 통계, 뷰 등)
│   ├── data/          # 학습 데이터 (일별 단어장)
│   ├── App.tsx        # 메인 라우팅 및 레이아웃
│   └── main.tsx       # 애플리케이션 진입점
```

## 🚀 시작하기 (Getting Started)

### 사전 요구사항 (Prerequisites)
*   Node.js (LTS 버전 권장)
*   npm

### 설치 및 실행 (Installation & Run)

1.  **저장소 클론 및 의존성 설치**
    ```bash
    git clone <repository-url>
    cd my-electron-app
    npm install
    ```
    *참고: `vosk-browser` 등 일부 패키지는 설치 시간이 소요될 수 있습니다.*

2.  **음성 인식 모델 확인**
    `public/models/vosk-model-small-en-us-0.15` 경로에 모델 파일들이 존재하는지 확인해주세요. 모델 파일이 없으면 음성 인식 기능이 정상 작동하지 않을 수 있습니다.

3.  **개발 서버 실행 (Development)**
    Vite 서버와 Electron 창이 동시에 실행됩니다.
    ```bash
    npm run dev
    ```

4.  **프로덕션 빌드 (Build)**
    배포 가능한 실행 파일로 빌드합니다.
    ```bash
    npm run build
    ```

## ⚠️ 주의사항

이 앱은 **Vosk 음성 인식 모델**을 로컬에서 로드하여 사용합니다.
`public/models` 폴더 내에 올바른 모델 파일이 있어야 음성 인식 기능이 동작합니다.

## 📝 라이선스

이 프로젝트는 개인 학습 및 포트폴리오 용도로 제작되었습니다.

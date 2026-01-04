# Nano Banana Pro Gallery 🍌

고급스러운 갤러리 스타일의 다이나믹 웹페이지로 Nano Banana Pro 프롬프트를 탐색하세요.

## ✨ 특징

- 🎨 **모던한 UI/UX**: 깔끔하고 세련된 갤러리 디자인
- 🌓 **라이트/다크 모드**: 완벽한 테마 지원
- 🎭 **부드러운 애니메이션**: Framer Motion을 활용한 인터랙티브 경험
- 📱 **완전 반응형**: 모든 디바이스에서 완벽하게 작동
- 🔍 **카테고리 필터링**: 원하는 프롬프트를 쉽게 찾기
- 📋 **프롬프트 복사**: 원클릭으로 프롬프트 복사
- 💻 **코드 하이라이팅**: JSON/텍스트 프롬프트를 아름답게 표시

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:5173](http://localhost:5173)을 열어 확인하세요.

### 빌드

```bash
npm run build
```

### 미리보기

```bash
npm run preview
```

## 🛠 기술 스택

- **React 18** - 최신 React 기능
- **TypeScript** - 타입 안정성
- **Vite** - 빠른 개발 환경
- **Tailwind CSS** - 유틸리티 우선 CSS
- **Framer Motion** - 부드러운 애니메이션
- **React Syntax Highlighter** - 코드 하이라이팅

## 📁 프로젝트 구조

```
├── src/
│   ├── components/      # React 컴포넌트
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Gallery.tsx
│   │   ├── PromptCard.tsx
│   │   ├── PromptModal.tsx
│   │   ├── CategoryFilter.tsx
│   │   └── ThemeToggle.tsx
│   ├── contexts/       # React 컨텍스트
│   │   └── ThemeContext.tsx
│   ├── data/           # 데이터 파일
│   │   └── prompts.ts
│   ├── types/          # TypeScript 타입
│   │   └── index.ts
│   ├── App.tsx         # 메인 앱 컴포넌트
│   ├── main.tsx        # 진입점
│   └── index.css       # 글로벌 스타일
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## 🎨 커스터마이징

### 테마 색상 변경

`tailwind.config.js`에서 `primary` 색상을 수정하세요:

```js
colors: {
  primary: {
    // 원하는 색상으로 변경
  }
}
```

### 프롬프트 추가

`src/data/prompts.ts` 파일에 새로운 프롬프트를 추가하세요:

```typescript
{
  id: '1.3',
  title: 'Your Prompt Title',
  description: 'Description',
  category: 'Category Name',
  categoryId: 1,
  // ...
}
```

## 📝 라이선스

이 프로젝트는 원본 [Awesome Nano Banana Pro](https://github.com/ZeroLu/awesome-nanobanana-pro) 저장소의 데이터를 사용합니다.

## 🙏 감사의 말

원본 프롬프트 컬렉션을 만든 모든 기여자들에게 감사드립니다.


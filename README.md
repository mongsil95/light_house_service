# Light House Service

반려해변 전국대회 라이트하우스 컨시어지 서비스

> **⚠️ 중요**: 프로젝트 시작 전 반드시 [워크스페이스 가이드](docs/기초문서/workspace_start.md)를 읽어주세요.

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **State Management**: Zustand (필요시)
- **Data Fetching**: TanStack Query (필요시)
- **Form Management**: React Hook Form + Zod (필요시)

## 시작하기

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 빌드

```bash
npm run build
```

### 프로덕션 실행

```bash
npm start
```

### 린트

```bash
npm run lint
```

### 포맷

```bash
npm run format
```

## 프로젝트 구조

```
light_house_service/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 메인 페이지
│   └── globals.css        # 전역 스타일
├── components/            # 재사용 가능한 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트
│   └── figma/            # Figma 디자인 컴포넌트
├── docs/                 # 문서
│   ├── 기초문서/
│   │   ├── workspace_start.md        # ⭐ 워크스페이스 가이드
│   │   ├── 데이터베이스_설계.md      # DB 설계 (TODO 태그 포함)
│   │   └── 기술스택.md
│   └── 벤치마킹/
│       └── 배민CEO_사이트_분석.md
├── public/               # 정적 파일
└── styles/              # 스타일 파일
```

## 개발 가이드라인

### DB 작업 분리

- ⚠️ **프론트엔드 팀은 DB를 직접 다루지 않습니다**
- DB 관련 작업이 필요한 경우 [데이터베이스\_설계.md](docs/기초문서/데이터베이스_설계.md)에 TODO 태그로 기록
- DB 팀이 별도로 작업을 진행합니다
- 자세한 내용은 [워크스페이스 가이드](docs/기초문서/workspace_start.md)를 참고하세요

## 배포

Vercel을 사용한 배포를 권장합니다:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 라이센스

© 2025 반려해변 전국대회 라이트하우스 서비스 - 이타서울 비영리

# OFFICE SURVIVAL

> 직장인 생존도구 — 일하는 척부터 진짜 업무까지.

겉으로는 평범한 생산성 SaaS처럼 보이지만, 안에는 회사에서 살아남기 위한 도구가 들어 있는
웹 서비스입니다. 로그인 없이 모든 기능을 사용할 수 있고, 모든 데이터는 브라우저에만 저장됩니다.

## 기능

| 영역 | 라우트 | 설명 |
| --- | --- | --- |
| 😎 일하는 척 | `/pretend/vscode` `/pretend/excel` `/pretend/terminal` `/pretend/dashboard` | 전체화면 업무 화면. `ESC` 또는 🚨 BOSS MODE 버튼으로 다른 업무 화면으로 즉시 전환 |
| 🛠 업무도구 | `/tools/calculator` `/tools/date-calculator` `/tools/time-calculator` `/tools/character-counter` | 계산기, 날짜·시간 계산, 글자수 세기 |
| 🤖 AI | `/ai` | 번역·요약·이메일·보고서 도구 (준비중, 라우팅과 UI 구조만 존재) |
| 😴 쉬어가기 | `/fun/quit-countdown` `/fun/2048` | 퇴근 카운트다운, 2048 |

검색은 `⌘K` / `Ctrl+K` 또는 `/search?q=...` 에서 사용합니다.

## 기술 스택

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — CSS 변수 기반 디자인 토큰, 다크 우선 / 라이트 지원
- **Firebase** (선택) — Analytics, 이후 Auth · Firestore 확장용
- 배포: **Vercel**

## 시작하기

```bash
npm install
cp .env.example .env.local   # 값은 비워둬도 동작합니다
npm run dev                  # http://localhost:3000
```

```bash
npm run build   # 프로덕션 빌드 (타입 체크 포함)
npm run lint    # ESLint
```

## 환경 변수

모든 값은 선택 사항이며, 비어 있으면 Firebase 관련 코드는 자동으로 비활성화됩니다.
비밀 키는 절대 코드에 하드코딩하지 않습니다.

| 변수 | 용도 |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | canonical URL, Open Graph, sitemap |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase 프로젝트 설정 (Analytics / 이후 Auth·Firestore) |

## 구조

```
src/
├── app/
│   ├── (site)/          헤더·푸터가 있는 일반 페이지
│   ├── (pretend)/       크롬 없는 전체화면 업무 화면
│   ├── icon.tsx         파비콘 (동적 생성)
│   ├── opengraph-image.tsx
│   ├── sitemap.ts · robots.ts
│   └── globals.css      디자인 토큰
├── components/
│   ├── layout/ navigation/ search/ cards/ ui/
│   ├── countdown/ tools/ pretend/ fun/ home/ analytics/
├── lib/
│   ├── registry/        도구 카탈로그 (단일 소스)
│   ├── storage/         localStorage 기반 설정 · 최근 사용
│   ├── analytics/       이벤트 추상화 (Firebase 선택)
│   ├── firebase/        지연 초기화 클라이언트
│   ├── tools/ games/    순수 계산 로직
│   ├── pretend/         업무 화면 설정 · 하이라이터
│   ├── hooks/ utils/ seo/
```

### 도구 추가하기

1. `src/lib/registry/data.ts` 에 항목을 추가합니다.
2. 해당 `href` 에 맞는 라우트를 만듭니다.

네비게이션, 홈 섹션, 카테고리 페이지, 검색, 사이트맵이 모두 레지스트리를 읽기 때문에
그 외에 수정할 곳은 없습니다.

## 아키텍처 원칙

- **Frontend / Admin / Automation 분리** — 이 저장소는 Next.js 프론트엔드만 담당합니다.
  관리자 도구(Streamlit)와 자동화(Python Bot)는 Firebase를 통해 연결될 예정입니다.
- **데이터 소스 추상화** — 도구 카탈로그는 `lib/registry`, 사용자 설정은 `lib/storage`,
  이벤트는 `lib/analytics` 를 통해서만 접근합니다. Firestore 로 옮길 때 이 세 곳만 바뀝니다.
- **로그인 강제 없음** — 즐겨찾기·동기화처럼 계정이 필요한 기능이 생길 때만 Auth 를 켭니다.
- **AI API 키는 서버에서만** — 클라이언트 번들에 노출하지 않습니다.

## 배포

Vercel에 저장소를 연결하면 기본 설정으로 배포됩니다.
`NEXT_PUBLIC_SITE_URL` 을 실제 도메인으로 설정하면 canonical·sitemap·OG 태그가 함께 갱신됩니다.

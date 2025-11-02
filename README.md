<p>
  <img src="https://github.com/user-attachments/assets/a0e8fc89-eff8-4e30-8bf5-35d0af231cad" width="30" />
  <img src="https://github.com/user-attachments/assets/69b368d2-78f2-4493-ba4a-42be6ba72496" width="100" />
</p>

<img width="1440" height="1024" alt="image" src="https://github.com/user-attachments/assets/9d02d7e4-3cc6-442f-b650-190078ace71c" />


<p align="center">
  <a href="https://inmyday.vercel.app/" target="_blank"><b>🔗 In My Day 배포 링크</b></a>
</p>


> **프로젝트 기간**: 2025.09.29 ~ 2025.11.03 <br>
**팀명**: Part4_2팀  <br>
**주제**: 원데이 클래스 예약 플랫폼  <br>
**설명**:
다양한 원데이 클래스를 손쉽게 등록하고 예약할 수 있는 서비스입니다. <br>
사용자는 판매자이자 체험자가 되어, 자신이 만든 클래스를 등록하거나 다른 사용자의 클래스를 예약할 수 있습니다.
> 

---

## 🚀 프로젝트 개요

### 🎯 주제 및 선정 배경

- **원데이 클래스 시장의 성장**과 함께, 누구나 쉽게 클래스 운영자가 될 수 있는 플랫폼의 필요성을 느낌
- **판매자와 체험자의 경계가 없는 구조** 구현 ("나도 만들고, 나도 체험한다")
- **캘린더 / 지도 SDK** 기반으로 예약 가능 시간 및 위치 탐색 기능 구축

---

## 💡 서비스 컨셉

- 다양한 원데이 클래스를 **등록 및 예약**할 수 있는 플랫폼
- 사용자는 **판매자이자 체험자**로, 자신이 만든 클래스를 올리거나 다른 사용자의 클래스를 예약 가능
- **캘린더 뷰 SDK**와 **지도 SDK**를 활용하여 예약 가능한 날짜/시간/위치 확인
- 후기 시스템과 단일 체험 중심의 예약 구조로 직관적인 UX 제공

---

## 🧭 주요 기능

| 구분 | 기능 설명 |
| --- | --- |
| 클래스 등록/관리 | 사용자가 직접 원데이 클래스를 등록, 수정, 삭제 가능 |
| 예약 기능 | 날짜·시간·인원 선택 기반의 예약 시스템 |
| 후기 작성 | 후기 및 별점 등록 가능 |
| 로그인 | 로컬 + 카카오 간편 로그인 |
| 마이페이지 | 내 정보 수정, 예약 내역 관리, 내 체험 관리  |
| 지도 / 캘린더 | 클래스 위치 및 예약 가능 일정 시각화 |

---

## 🎨 주요 페이지별 설명

### 🔐 회원가입 / 로그인

- 이메일, 비밀번호, 닉네임 기반 가입
- 비밀번호 정규식 검증 (영문+숫자, 8자 이상)
- 카카오 로그인 → 추가정보 입력 후 자동가입
- `zustand/persist`로 로그인 상태 유지

### 🏠 메인 페이지 `/`

- 이벤트 / 신규 클래스 배너
- 키워드 검색, 카테고리/가격 필터링
- 인기 체험(후기순 정렬) / 최신순 리스트
- 반응형 UI (모바일: 가로 스크롤 / PC: 버튼 네비게이션)

### 🧾 체험 상세 페이지 `/experience-detail/[id]`

- 소개 이미지(1~4장) 슬라이드
- 카카오 지도 기반 위치 표시
- 예약: 날짜 → 시간 → 인원 → 금액 확인
- 호스트 / 사용자 UI 분기 처리
- 수정·삭제 기능 및 예외 처리 (alert 표시)

### 👤 마이페이지 `/mypage`

- **내 정보 수정:** 닉네임, 비밀번호 검증
- **예약 내역:** 무한 스크롤, 필터링, 후기/취소 모달 제공
- **내 체험 관리:** 내 체험 관리 및 등록 / 수정 / 삭제 기능 제공
- **예약 현황 캘린더:** 월별 대시보드, 실시간 뱃지 갱신

---

## 👥 팀 구성 및 역할

| 이름 | 역할 | 담당 기능 |
| --- | --- | --- |
| [**백세진**](https://github.com/xha2023) | 팀장 | 초기 세팅, 공용 컴포넌트, 알림 시스템 |
| [**김희수**](https://github.com/nizoo0516) | 팀원 | 메인 화면, 체험 상세 페이지 |
| [**전유성**](https://github.com/Ucastle98) | 팀원 | 인증, 사용자 관리 (내 정보) |
| [**이은서**](https://github.com/les0498) | 팀원 | 내 체험 관리/등록/수정 페이지 |
| [**위성진**](https://github.com/WEESUNGJIN) | 팀원 | 예약 시스템 페이지 |

---

## ⚙️ 개발 환경

| 분류 | 기술 |
| --- | --- |
| Language | **TypeScript 5.9.2** |
| Framework | **Next.js 15.5.6 (App Router)** |
| Library | **React 19.1.1** |
| State & Fetching | React Query 5.90.5 / Zustand 5.0.8 / Axios 1.12.2 |
| UI/UX | Storybook 9.1.3 / TailwindCSS 3.4.17 / Floating UI / React-Calendar / React-Datepicker |
| Testing | Vitest 3.2.4 / Playwright 1.55.1 / Jest Types 30.0.0 |
| Build & Lint | ESLint 9.36.0 / Prettier 3.6.2 / Vite 3.2.4 |

---

## 🗂️ 폴더 구조

```
├── public
├── scripts
└── src/
    ├── api
    ├── app/
    │   ├── auth
    │   ├── experience-detail
    │   ├── experience-edit
    │   ├── experience-register
    │   ├── mypage/
    │   │   ├── bookings
    │   │   ├── calendar
    │   │   ├── experience
    │   │   └── profile
    │   ├── oauth
    ├── store
    ├── assets/
    ├── components/
    ├── context
    ├── features/
    ├── lib
    ├── providers
    ├── styles
    ├── types
    └── utils

```

---

## 🔄 Git 전략

- **main**: 배포용
- **develop**: 통합 브랜치
- **feature/**: 기능 단위 개발 (예: `feature/login-page`)

**커밋 규칙**

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
refactor: 코드 리팩토링
style: 코드 스타일 변경
```

---

## 🧩 프로젝트 수행 절차

- 매일 **14:00 ~ 16:00 코어타임** 운영
- 데일리 스크럼(오후)으로 진행 상황 공유
- 피그마 기반 UI/UX 보완 → 스토리북 컴포넌트 제작
- 기능 단위 브랜치 개발 → PR 리뷰 → develop 병합

---

## 🧠 주요 예외 처리 사례

| **이슈**                   | **문제**                                                                   | **해결 방법**                                                                                              |
| ------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| **로그인 상태 복원 오류**         | 새로고침 시 **Zustand 상태 초기화**로 로그인 정보 손실                                 | **persist 미들웨어 + onRehydrateStorage**로 복원 시점 제어 및 렌더링 지연                       |
| **useSearchParams 훅 오류** | **Next.js App Router 환경**에서 `useSearchParams()` 사용 시 **hydration 오류 발생** | 훅 대신 **searchParams props 전달 방식**으로 변경해 빌드·런타임 오류 해결                                |
| **예약 변경 중복 처리**          | 마이페이지에서 ‘예약 변경’ 클릭 후 시간/인원 수정 시 **“이미 신청한 예약입니다.” 오류 발생**                | 상세 페이지 이동 시 `mode=edit`과 `reservationId` **쿼리 추가**, **수정 중 예약은 중복 검사 제외 처리**                           |
| **프로필 이미지 404**          | 새로 업로드 한 프로필 이미지가 새로고침 후 **사라지거나 404 오류 발생**                              | `POST /users/me/image` 후 `PATCH /users/me` 요청 추가로 **DB 영구 저장**, **teamId 중복 경로 제거**                    |
| **예약된 체험 UI 미갱신**        | 예약이 있는 체험 수정 시 **백엔드 에러 후 UI 미갱신 / 모달 미표시**                              | `onError` 시 **alert 추가**, `DateSection key` 변경으로 **리렌더링 유도**, `invalidateQueries`로 **최신화** |
| **예약 현황 뱃지 실시간 오류**      | 예약 승인/거절 시 **캘린더 뱃지 숫자 즉시 반영 X / 중복 반영**                                 | `requestAnimationFrame()`으로 **렌더 완료 후 상태 변경**, `useRef` 기반 **중복 업데이트 방지**                              |
| **캘린더 패널 좌표 이동 오류**      | 월 전환 후 특정 날짜 클릭 시 패널이 **(0,0)으로 점프**하거나 화면 밖 이동                          | DOM 렌더 완료 후 `requestAnimationFrame()`으로 **안전 시점에 scrollIntoView() 실행**, `useScrollIntoView` **훅 공통화**  |
| **예약 일정 삭제 시 폼 불일치**     | 예약 일정 삭제 후 **서버 데이터와 폼 상태 불일치로 UI 반영 지연**                                | `queryClient.invalidateQueries`로 **즉시 최신 데이터 갱신**, `form.schedules` **재세팅으로 상태 동기화**                   |

---

## 🎯 향후 개선 방향

- 예약 변경 UX 개선 (부분 환불, 변경 내역 표시 등)
- 완료된 예약 상태 API 연동
- 성능 최적화 및 반응형 개선

---

## 📝 License

This project is licensed under the **MIT License**.

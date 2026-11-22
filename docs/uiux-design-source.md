# UI/UX Design Source — Josh Kern

> 출처: https://webdesign.kernjosh.com/
> 추출일: 2026-11-22
> 분석 대상: 807개 요소
> 제공된 디자인 추출 문서의 중복 본문을 제거하고 구현 참고용으로 정리한 자료입니다. 원본 사이트를 별도로 검증한 결과는 아닙니다.

## 1. 디자인 방향

- 따뜻한 크림색 배경과 짙은 잉크색 텍스트.
- Outfit, DM Sans 중심의 타이포그래피와 UglyDave 포인트 서체.
- 둥근 pill 버튼, 24px 카드 모서리, 각진 이미지.
- 넓은 여백과 절제된 테두리 및 그림자.
- 짧은 인터랙션 전환과 손그림 느낌의 프레임 애니메이션.

## 2. 색상

### 주요 색상

| 역할 | HEX | RGB | HSL | 사용 수 |
|---|---|---|---|---|
| Primary | `#ece3cb` | 236, 227, 203 | 44, 46%, 86% | 23 |
| Secondary | `#007aff` | 0, 122, 255 | 211, 100%, 50% | 20 |
| Accent | `#f3a100` | 243, 161, 0 | 40, 100%, 48% | 2 |

### 전체 색상 목록

| HEX | 적용 영역 | 사용 수 |
|---|---|---|
| `#0c0908` | 텍스트, 테두리, 배경 | 698 |
| `#e3e3db` | 텍스트, 테두리 | 362 |
| `#000000` | 텍스트, 테두리, 배경 | 307 |
| `#3f3f3f` | 텍스트, 테두리, 배경 | 167 |
| `#f5f1e6` | 배경, 텍스트, 테두리 | 24 |
| `#5f5f5f` | 텍스트, 테두리 | 24 |
| `#ece3cb` | 배경 | 23 |
| `#007aff` | 텍스트, 테두리 | 20 |
| `#ffffff` | 배경 | 17 |
| `#6b6b71` | 텍스트, 테두리 | 8 |
| `#0000ee` | 텍스트, 테두리 | 4 |
| `#f6f6f6` | 배경 | 4 |
| `#c7c7cc` | 텍스트, 테두리 | 4 |
| `#2a1d15` | 배경 | 2 |
| `#767676` | 테두리 | 2 |
| `#8f2f1f` | 텍스트, 테두리 | 2 |
| `#f3a100` | 배경 | 2 |
| `#9a9a9a` | 텍스트, 테두리 | 2 |
| `#e6b04e` | 텍스트, 테두리 | 2 |
| `#b8b8be` | 텍스트, 테두리 | 2 |
| `#ff3b30` | 텍스트, 테두리 | 2 |
| `#d4c7a6` | 배경 | 1 |

추가로 배경에 `#e6dfd0`, 텍스트에 `#0a0a0a`가 관찰되었습니다.

### 원본 CSS 변수

```css
:root {
  --base-100: #f5f1e6;
  --base-200: #e0dfd7;
  --base-300: #5f5f5f;
  --base-350: #3f3f3f;
  --base-400: #0c0908;
}
```

Semantic 색상 `success`, `warning`, `error`, `info`는 원본에 `[object Object]`로 기록되어 실제 값이 없습니다.

### 그라디언트

```css
.fade-top {
  background-image: linear-gradient(
    rgba(246, 246, 246, 0.92) 0%,
    rgba(246, 246, 246, 0.78) 70%,
    rgba(246, 246, 246, 0) 100%
  );
}

.fade-bottom {
  background-image: linear-gradient(
    rgba(246, 246, 246, 0) 0%,
    rgba(246, 246, 246, 0.78) 40%,
    rgba(246, 246, 246, 0.92) 100%
  );
}
```

## 3. 타이포그래피

### 서체

| 서체 | 관찰 요소 수 | 폰트 파일 정보 |
|---|---:|---|
| Outfit | 267 | Self-hosted, weight 100–900, normal |
| DM Sans | 218 | Self-hosted, weight 100–1000, normal |
| -apple-system | 133 | 시스템 서체 |
| Arial | 111 | 시스템 서체 |
| UglyDave | 50 | Self-hosted, weight 400, normal |
| Times New Roman | 28 | 시스템 서체 |

폰트 파일의 실제 경로는 제공되지 않았습니다.

### 타입 스케일

| px | rem | Weight | Line height | Letter spacing | 요소 |
|---|---|---|---|---|---|
| 24 | 1.5 | 400 | normal | -0.24px | tspan, button, span, h2 |
| 23.04 | 1.44 | 500 | 27.648px | normal | h2 |
| 22.4 | 1.4 | 400 | 24.64px | -0.224px | h2 |
| 19 | 1.1875 | 400 | 19px | normal | span |
| 18.4 | 1.15 | 500 | 22.08px | normal | h2 |
| 18 | 1.125 | 600 | normal | -0.18px | div, span, textarea |
| 17.2 | 1.075 | 700 | 17.2px | normal | span |
| 17 | 1.0625 | 400 | normal | -0.17px | button, span, input |
| 16 | 1 | 400 | normal | normal | html 등 |
| 15.2 | 0.95 | 400 | 22.8px | normal | p |
| 15 | 0.9375 | 600 | normal | -0.15px | div, span, svg, rect |
| 14.72 | 0.92 | 400 | 22.08px | normal | p |
| 14.4 | 0.9 | 400 | 25.2px | normal | h1, span, img |
| 14.08 | 0.88 | 400 | normal | normal | tspan, dd, ul, li |
| 14 | 0.875 | 400 | 18.48px | -0.07px | div, p, span, a |

본문 기본값: `14.08px / 400 / normal`.

Weight 관찰 횟수: `400` 677회, `700` 65회, `600` 35회, `500` 30회.

제목은 단일 전역 규칙이 아니라 여러 변형이 관찰되었습니다. `h2`는 24px, 23.04px, 22.4px, 18.4px이고 `h1`은 14.4px입니다. 이를 동일 선택자로 연속 선언하면 마지막 규칙만 적용되므로 구현 시 변형 클래스로 구분합니다.

## 4. 여백

추출된 기본 단위: **2px**. 실제 관찰값에는 1px 및 소수 단위도 포함됩니다.

| Token | px | rem |
|---|---:|---:|
| spacing-1 | 1 | 0.0625 |
| spacing-14 | 14 | 0.875 |
| spacing-24 | 24 | 1.5 |
| spacing-28 | 28 | 1.75 |
| spacing-30 | 30 | 1.875 |
| spacing-32 | 32 | 2 |
| spacing-40 | 40 | 2.5 |
| spacing-44 | 44 | 2.75 |
| spacing-48 | 48 | 3 |
| spacing-64 | 64 | 4 |
| spacing-70 | 70 | 4.375 |
| spacing-80 | 80 | 5 |
| spacing-96 | 96 | 6 |
| spacing-106 | 106 | 6.625 |
| spacing-144 | 144 | 9 |
| spacing-160 | 160 | 10 |

## 5. 모서리와 그림자

| Radius | 값 | 관찰 수 |
|---|---|---:|
| xs | 2px | 2 |
| xl | 24px | 2 |
| full | 999px | 29 |

```css
.shadow-inset {
  box-shadow: rgba(12, 9, 8, 0.14) 0 0 0 1px inset;
}
.shadow-sm {
  box-shadow: rgba(12, 9, 8, 0.08) 0 0 0 1px;
}
.shadow-xs {
  box-shadow: rgba(0, 0, 0, 0.06) 0 1px 2px 0;
}
```

## 6. 컴포넌트 패턴

아래는 추출 결과의 대표 스타일입니다. 일부 속성만 추출되었으므로 완성된 컴포넌트 명세로 간주하지 않습니다.

| 패턴 | 수 | 주요 스타일 |
|---|---:|---|
| Button | 66 | 배경 `#ece3cb`, 글자 `#0c0908`, 13.3333px/400, radius 0, 상단·우측 padding 0 |
| Card | 3 | 배경 `#f5f1e6`, radius 24px, 상단·우측 padding 40px |
| Input | 8 | 흰 배경, 검정 글자, 테두리 `#0c0908`, radius 0, 16px, 상단·우측 padding 0 |
| Link | 13 | 글자 `#5f5f5f`, 12px/400 |
| Navigation | 37 | 배경 `#ece3cb`, 글자 `#0c0908`, padding 0, position relative |
| Footer | 1 | 글자 `#0c0908`, 11px, 상하 padding 0 |
| Modal | 19 | 배경 `rgba(12,9,8,0.35)`, radius 0, 상단·우측 padding 0 |
| Dropdown | 2 | radius 0, 테두리 `#0c0908`, 상단 padding 0 |
| Badge | 16 | 흰 배경, 글자 `#0c0908`, 16px/700, radius 999px, 상단·우측 padding 0 |
| Tab | 1 | 글자·테두리 `#0c0908`, 24px/400, 상단 padding 3.2px, 우측 1.6px, radius 0 |
| Progress bar | 9 | 배경 `color(srgb 0.960784 0.945098 0.901961 / 0.6)`, 검정 글자, 13.3333px, radius 0 |
| Switch | 16 | 배경 `#ece3cb`, 테두리 `#0c0908`, radius 0 |

### 재사용 가능한 버튼 변형

클래스 이름은 문서 정리를 위해 부여했습니다.

```css
.button-pill {
  background: #ece3cb;
  color: #0c0908;
  padding: 7.2px 19.2px 7.2px 11.2px;
  border-radius: 999px;
  border: 0;
  font-size: 16px;
  font-weight: 700;
}

.button-pill-dark {
  background: #2a1d15;
  color: #f5f1e6;
  padding: 7.2px 11.2px 7.2px 19.2px;
  border-radius: 999px;
  border: 0;
  font-size: 16px;
  font-weight: 700;
}

.button-text {
  background: transparent;
  color: #0c0908;
  padding: 3.2px 1.6px 5.6px;
  border-radius: 0;
  border: 0;
  font-size: 24px;
  font-weight: 400;
}

.button-pill-ghost {
  background: transparent;
  color: #0c0908;
  padding: 7.2px 17.6px;
  border-radius: 999px;
  border: 0;
  font-size: 16px;
  font-weight: 700;
}
```

### 구조별 클러스터

| 클러스터 | 인스턴스 | 변형 |
|---|---:|---|
| Button A | 2 | 밝은 pill 1, 어두운 pill 1 |
| Button B | 14 | 밝은 pill 4, 텍스트 버튼 10 |
| Button C | 1 | 투명 배경, `#e3e3db`, 16px/400, padding·radius·border 0 |
| Button D | 5 | 투명 배경, 검정, 13.3333px/400, padding·radius·border 0 |
| Button E | 2 | ghost pill |
| Button F | 1 | `#e6dfd0` 배경, 검정, 13.3333px/400, padding·radius·border 0 |
| Button G | 9 | Button F와 동일한 대표 스타일 |
| Card A | 1 | 투명 배경, `#0c0908`, 16px/400, padding·radius·border 0 |
| Button H | 8 | 흰 배경 pill 5, 투명 배경 radius 0 버튼 3. 공통 `#0a0a0a`, 13.3333px/400, padding·border 0 |

## 7. 레이아웃과 반응형

- Grid 컨테이너: 18개.
- Flex 컨테이너: 96개.
- 최대 너비: `1400px`, `100%`, `640px` — 관찰 padding 0.
- Grid 패턴: 2열 5회, 3열 4회, 1열 2회.
- Flex 패턴: row/nowrap 76회, column/nowrap 16회, row/wrap 4회.
- 관찰된 breakpoint: `@media (max-width: 600px)`.

```css
/* 관찰된 계산값. 고정된 반응형 설계 규칙은 아닙니다. */
.grid-observed-a {
  grid-template-columns: 1224px;
  gap: normal 64px;
}
.grid-observed-b {
  grid-template-columns: 1152px;
}
.grid-observed-c {
  grid-template-columns: 32px 1108px;
  gap: 4.8px 12px;
}
```

관찰 gap: `4px`, `4.928px`, `5px`, `6px`, `6.4px`, `8px`, `8.8px`, `9.6px`, `10px`, `11px`, `12px`, `16px`, `25.6px`, `40px`, `4.8px 12px`, `6.4px 20px`, `normal 64px`.

## 8. 모션

### 전환

관찰 duration: `0s`, `0.1s`, `0.12s`, `0.15s`, `0.18s`, `0.2s`, `0.22s`, `0.25s`, `0.26s`, `0.28s`, `0.3s`, `0.32s`, `0.35s`, `0.4s`, `0.42s`, `0.5s`, `0.55s`, `0.66s`, `0.72s`, `0.85s`.

```css
/* 각 줄은 개별 요소에서 관찰된 대안입니다. */
/* transition: all; */
/* transition: opacity 0.12s; */
/* transition: opacity 0.3s; */
/* transition: opacity 0.35s; */
/* transition: opacity 0.4s; */
/* transition: opacity 0.18s 0.18s; */
/* transition: opacity 0.18s; */
/* transition: background-color 0.25s; */

.motion-transform {
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.motion-pill {
  transition:
    background-color 0.25s,
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    width 0.26s cubic-bezier(0.22, 1, 0.36, 1),
    padding 0.26s cubic-bezier(0.22, 1, 0.36, 1),
    gap 0.26s cubic-bezier(0.22, 1, 0.36, 1);
}
```

별도 easing 목록의 7개 항목은 `[object Object]`로 추출되어 복원할 수 없습니다. 위 cubic-bezier는 실제 제공된 transition 값입니다.

### 키프레임

중복된 `stickTravel` 및 `stickFace` 정의는 하나로 통합했습니다.

```css
@keyframes stickTravel {
  0% { transform: translateX(0px); }
  100% { transform: translateX(var(--walk-x, calc(100vw - 160px))); }
}
@keyframes stickFace {
  0%, 50% { transform: scaleX(1) translateZ(0px); }
  50.01%, 100% { transform: scaleX(-1) translateZ(0px); }
}
@keyframes backPillIn {
  0% { opacity: 0; transform: translate(-4px) scale(0.98); }
  100% { opacity: 1; transform: none; }
}
@keyframes boil-a {
  50% { visibility: hidden; }
}
@keyframes boil-b {
  50% { visibility: visible; }
}
@keyframes ink-boil-a {
  0%, 49.999% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
@keyframes ink-boil-b {
  0%, 49.999% { opacity: 0; }
  50%, 100% { opacity: 1; }
}
@keyframes flower-boot {
  0% { opacity: 0; }
  7.15% { opacity: 1; }
  50% { opacity: 1; }
  57.15% { opacity: 0; }
  100% { opacity: 0; }
}
```

## 9. 레이어

23개의 고유 z-index 값이 4개 레이어로 분류되었습니다. 아래 요소 이름은 추출 과정에서 문자 사이에 삽입된 점을 제거해 표기했습니다.

| 레이어 | 추출 범위 | 대표 요소 |
|---|---|---|
| modal | 10000–100000000 | nav.nav, div.noise-overlay, div.preloader.is-done.is-parked |
| dropdown | 200–998 | div.about-modal, footer.legal-footer, div.burst-layer |
| sticky | 15–70 | div.scrollbar, div.loading-hint, div.scroll-hint |
| base | -1–9 | div.header, img.item-shadow |

원본의 레이어 이슈 항목은 `[object Object]`로 기록되어 내용이 없습니다.

## 10. 아이콘과 이미지

SVG 아이콘 11개, 주 스타일은 outline입니다. 크기 분류는 xs 2개, sm 9개이며 실제 픽셀 크기는 제공되지 않았습니다.

아이콘 색상: `#0c0908`, `#0a0a0a`, `currentColor`, `#000000`.

| 이미지 패턴 | 수 | object-fit | Radius | 추출 shape |
|---|---:|---|---|---|
| thumbnail | 56 | fill | 0 | square |
| general | 20 | contain | 0 | square |
| gallery | 9 | contain | 0 | square |

실제 비율 분포: 1:1 51개, 3:2 17개, 3:4 9개, 9:16 4개, 16:9 2개, 2:3 1개, 4:3 1개. `square`라는 분류가 모든 이미지의 실제 종횡비를 뜻하지는 않습니다.

## 11. 접근성 — 제공된 추출 결과

원본 보고서 점수: **100%**, 색상 쌍 통과 11개, 실패 0개. 이는 제공된 색상 검사 결과이며 전체 WCAG 2.1 준수를 보장하는 검증은 아닙니다.

| 전경 | 배경 | 대비 | 수준 |
|---|---|---|---|
| `#0c0908` | `#ece3cb` | 15.51:1 | AAA |
| `#5f5f5f` | `#f5f1e6` | 5.66:1 | AA |
| `#f5f1e6` | `#2a1d15` | 14.48:1 | AAA |

## 12. 디자인 시스템 평가 — 제공된 추출 결과

전체: **82/100, B**.

| 항목 | 점수 |
|---|---:|
| Color Discipline | 92 |
| Typography Consistency | 40 |
| Spacing System | 100 |
| Shadow Consistency | 100 |
| Border Radius Consistency | 100 |
| Accessibility | 100 |
| CSS Tokenization | 50 |

강점: 제한된 색상 팔레트, 정의된 여백 스케일, 절제된 그림자, 일관된 모서리, 높은 색상 대비.

보고된 개선 항목:

- 서체 6종: 제목과 본문 중심으로 정리 가능.
- 글자 크기 25종: 타입 스케일 단순화 가능.
- `!important` 11개.
- 미사용 CSS 62%.
- 중복 CSS 선언 1,606개.

## 13. 구현 시 활용

1. Outfit과 DM Sans를 주 서체 후보로 사용하고 UglyDave는 필요한 포인트에 적용합니다.
2. 원본 CSS 변수를 공통 테마에 반영합니다.
3. 여백, radius, 그림자, 모션 값을 재사용 토큰으로 정의합니다.
4. 버튼 변형과 카드 패턴을 컴포넌트로 구성합니다.
5. 600px 이하 화면에서 레이아웃을 확인합니다. 추출된 고정 열 너비는 실제 화면에 맞게 조정합니다.

원본 Quick Start에서 언급한 `variables.css`, `tailwind.config.js`, `uiextractor-tokens.json`의 실제 파일은 제공되지 않았습니다. 이 문서는 디자인 참고 자료이며 해당 파일이나 UI 구현을 생성한 것은 아닙니다.

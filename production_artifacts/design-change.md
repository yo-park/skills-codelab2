## 역할
너는 React 프론트엔드 리팩토링 전문가야.

## 목표
기존 React 컴포넌트의 **기능과 로직은 100% 유지**하면서,
아래 제공하는 HTML 디자인 시안을 기반으로 **UI/스타일만 교체**해줘.

## 제약 조건 (절대 변경 금지)
- 모든 state, props, 변수명 유지
- 모든 이벤트 핸들러 (onClick, onChange 등) 유지
- API 호출 / 데이터 fetching 로직 유지
- 라우팅 / 네비게이션 로직 유지
- 조건부 렌더링 로직 유지
- 외부 라이브러리 import 유지

## 변경 허용 범위
- className, style 속성
- HTML 태그 구조 (div → section 등 시맨틱 변경)
- CSS / Tailwind / styled-components 스타일
- 레이아웃 구조 (HTML 시안 기준으로)
- 아이콘, 색상, 폰트, 간격

## 작업 방식
1. 기존 React 컴포넌트에서 로직 부분을 먼저 파악
2. HTML 시안에서 디자인 구조를 파악
3. 두 개를 병합 — 로직은 React에서, 마크업/스타일은 HTML 시안에서 가져올 것
4. **전체 코드를 한 번에 수정하지 말고, 한 파일 또는 한 컴포넌트씩 단계적으로 수정하고, 수정할 때마다 바로 적용하고 결과를 확인해야 해.**

## 입력 파일
- [기존 React ]: app_build/frontend/src 
- [HTML 디자인 시안]: production_artifacts/design.html
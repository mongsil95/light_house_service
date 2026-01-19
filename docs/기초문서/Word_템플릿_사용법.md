# Word 템플릿 사용법

## 개요

이지 가이드에서 작성한 정보를 Word 템플릿에 자동으로 삽입하여 다운로드할 수 있습니다.

## 템플릿 파일 위치

- 원본: `/docs/참고자료/붙임1] [행정용] 대한민국 반려해변 입양 가입서.docx`
- 템플릿: `/public/templates/반려해변_입양_가입서_템플릿.docx`

## 템플릿 필드 설정 방법

### 1. Word 문서에서 플레이스홀더 추가

템플릿 파일을 열고 데이터가 삽입될 위치에 중괄호 `{}`로 필드명을 입력합니다.

예시:

```
기관명: {organizationName}
대표자: {representativeName}
직통내선: {officePhone}
핸드폰: {mobilePhone}
이메일: {email}
```

### 2. 사용 가능한 필드 목록

| 필드명                  | 설명                     | 예시                                                              |
| ----------------------- | ------------------------ | ----------------------------------------------------------------- |
| `{organizationName}`    | 기관명                   | 해말은사회적기업                                                  |
| `{organizationType}`    | 단체 형태                | 비영리법인/단체                                                   |
| `{registrationNumber}`  | 사업자 등록번호          | 123-45-67890                                                      |
| `{representativeName}`  | 대표자명                 | 홍길동                                                            |
| `{managerName}`         | 담당자명                 | 김철수                                                            |
| `{officePhone}`         | 담당자 직통내선          | 02-1234-1234                                                      |
| `{mobilePhone}`         | 담당자 핸드폰번호        | 010-1234-1234                                                     |
| `{email}`               | 이메일                   | example@email.com                                                 |
| `{address}`             | 주소                     | 서울시 강남구...                                                  |
| `{beachCount}`          | 입양할 해변 개수         | 2                                                                 |
| `{fundAmount}`          | 해변 입양 기금           | 6,000,000원 (2개 × 300만원)                                       |
| `{grassrootsSupport}`   | 풀뿌리 환경단체 지원여부 | 예                                                                |
| `{grassrootsCount}`     | 풀뿌리 환경단체 지원개수 | 3                                                                 |
| `{grassrootsAmount}`    | 풀뿌리 환경단체 지원금액 | 3개 단체 × 150만원 = 4,500,000원                                  |
| `{paymentMethod}`       | 기부금 집행 방식         | 계좌 이체                                                         |
| `{paymentMethodDetail}` | 기부금 집행 방식 상세    | 현금                                                              |
| `{paymentDate}`         | 기부금 납입 예정일       | 2026년 3월 15일                                                   |
| `{beachLocation}`       | 입양 희망 해변 위치      | 해운대 해수욕장                                                   |
| `{beachAdminDistrict}`  | 해변 행정구역            | 부산광역시 해운대구                                               |
| `{activityPeriod}`      | 예상 활동 계획           | 매월 첫째 주 토요일 해변 정화 활동, 분기별 환경교육 프로그램 운영 |
| `{safetyInsurance}`     | 보험 가입 여부           | 가입 예정                                                         |
| `{safetyMeasure}`       | 안전사고 대비 방안       | 별도 여행보험 가입 진행                                           |
| `{consentDate}`         | 동의 날짜                | 2026-01-19                                                        |
| `{currentDate}`         | 현재 날짜                | 2026. 1. 19.                                                      |

### 3. 템플릿 작성 예시

#### 기관 정보 섹션

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. 기관 정보
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

기관명: {organizationName}
단체 형태: {organizationType}
사업자 등록번호: {registrationNumber}
대표자: {representativeName}
담당자: {managerName}
직통내선: {officePhone}
핸드폰: {mobilePhone}
이메일: {email}
주소: {address}
```

#### 입양 신청 정보

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. 입양 신청 정보
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

입양할 해변 개수: {beachCount}개
입양 희망 해변: {beachLocation}
행정구역: {beachAdminDistrict}
활동 계획: {activityPeriod}
보험 가입: {safetyInsurance}
```

#### 기부금 정보

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. 기부금 정보
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

기본 기금: {fundAmount}
풀뿌리 환경단체 지원: {grassrootsSupport}
{#grassrootsAmount}
지원 개수: {grassrootsCount}개
지원 금액: {grassrootsAmount}
{/grassrootsAmount}

기부금 집행 방식: {paymentMethod}
{#paymentMethodDetail}
상세: {paymentMethodDetail}
{/paymentMethodDetail}
납입 예정일: {paymentDate}
```

#### 서명란

```
작성일: {currentDate}

_________________ (서명)
```

## 템플릿 수정 후 적용 방법

1. Word 템플릿 파일(`/public/templates/반려해변_입양_가입서_템플릿.docx`)을 수정
2. 수정한 파일을 저장
3. 서버 재시작 (개발 환경에서는 자동 새로고침)
4. 이지 가이드에서 정보 입력 후 Word 다운로드 테스트

## 주의사항

1. **필드명은 정확히 입력**: `{organizationName}` (O), `{organization name}` (X)
2. **중괄호 사용**: 반드시 `{}`로 감싸야 합니다
3. **대소문자 구분**: 필드명은 정확히 일치해야 합니다
4. **공백 제거**: `{ organizationName }` (X), `{organizationName}` (O)

## 고급 기능

### 조건부 표시

특정 조건에서만 텍스트를 표시하려면:

```
{#safetyInsurance}
보험에 가입되었습니다: {safetyInsurance}
{/safetyInsurance}
```

### 반복문

리스트 데이터를 반복하려면:

```
{#participants}
- {name}: {role}
{/participants}
```

## 문제 해결

### 템플릿이 적용되지 않을 때

1. 브라우저 캐시 삭제
2. 개발 서버 재시작
3. 템플릿 파일 경로 확인
4. 콘솔 로그 확인

### 필드가 빈 값으로 나올 때

1. `formData`에 해당 키가 있는지 확인
2. 철자가 정확한지 확인
3. 브라우저 콘솔에서 `formData` 값 확인

## 참고 자료

- [Docxtemplater 공식 문서](https://docxtemplater.com/)
- [템플릿 문법 가이드](https://docxtemplater.com/docs/tag-types/)

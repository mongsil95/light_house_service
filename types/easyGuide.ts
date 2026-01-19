export interface FormData {
  organizationName?: string;
  organizationType?: string; // 새로 추가: 단체 형태
  registrationNumber?: string; // 새로 추가: 사업자 등록번호
  representativeName?: string;
  managerName?: string; // 새로 추가: 담당자 이름
  officePhone?: string; // 새로 추가: 담당자 직통내선
  mobilePhone?: string; // 새로 추가: 담당자 핸드폰번호
  email?: string;
  address?: string;
  beachCount?: string; // 새로 추가: 입양할 해변 개수
  fundAmount?: string; // 자동 계산: 해변 입양 기금 (beachCount × 300만원)
  grassrootsSupport?: string; // 새로 추가: 풀뿌리 환경단체 지원 여부
  grassrootsCount?: string; // 새로 추가: 풀뿌리 환경단체 지원 개수
  grassrootsAmount?: string; // 새로 추가: 풀뿌리 환경단체 지원 금액 (자동 계산)
  paymentMethod?: string; // 새로 추가: 기부금 집행 방식
  paymentMethodDetail?: string; // 새로 추가: 기부금 집행 방식 상세
  paymentDate?: string; // 새로 추가: 기부금 납입 예정일
  beachLocation?: string; // 새로 추가: 활동 희망 해변
  beachAdminDistrict?: string; // 새로 추가: 해변 행정구역
  participantCount?: string;
  activityPeriod?: string; // 예상 활동 계획
  safetyInsurance?: string;
  safetyMeasure?: string;
  consent?: string; // 새로 추가: 개인정보 수집 및 이용 동의
  consentRejected?: string; // 새로 추가: 동의 거부 시 재확인
  consentDate?: string;
}

export interface Message {
  id: string;
  type: "bot" | "user";
  content: string;
  timestamp: Date;
  questionIndex?: number;
  note?: string; // 해당 질문의 참고사항
  example?: string; // 해당 질문의 예시 답변
}

export interface QuestionFlow {
  key: keyof FormData;
  question: string;
  example?: string;
  note?: string;
  options?: string[]; // 버튼으로 응답할 경우 선택지
  nextQuestion: (answer: string, formData?: FormData) => string | null;
}

export interface FormData {
  organizationName?: string;
  representativeName?: string;
  contact?: string;
  email?: string;
  address?: string;
  participantCount?: string;
  activityPeriod?: string;
  safetyInsurance?: string;
  safetyMeasure?: string;
  fundAmount?: string;
  fundNote?: string;
  consentName?: string;
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

"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { generatePDF, generateWordFromTemplate } from "@/lib/documentGenerator";
import { FormData, Message, QuestionFlow } from "@/types/easyGuide";
import { ArrowLeft, Download, Edit2, FileText, RefreshCw, Save, Send } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function EasyGuideChatPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "안녕하세요! 해변 입양 신청을 도와드리겠습니다. 😊\n\n먼저, 귀 기관의 이름을 알려주시겠어요?",
      timestamp: new Date(),
      questionIndex: 0,
      note: "사업자등록증(단체 등록증)에 명시되어 있는 기관명을 작성해주세요.",
      example: "예: 해말은사회적기업, (주)그린비치, 서울환경교육센터",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [formData, setFormData] = useState<FormData>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fieldRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // 로컬스토리지 키
  const STORAGE_KEY = "easyGuide_formData";
  const STORAGE_STEP_KEY = "easyGuide_currentStep";
  const STORAGE_MESSAGES_KEY = "easyGuide_messages";

  // 페이지 로드 시 및 formData 변경 시 저장된 데이터 확인
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // localStorage의 데이터와 현재 formData가 다르면 불러오기 버튼 표시
        const isSame = JSON.stringify(parsedData) === JSON.stringify(formData);
        setHasSavedData(!isSame && Object.keys(parsedData).length > 0);
      } catch (e) {
        setHasSavedData(false);
      }
    } else {
      setHasSavedData(false);
    }
  }, [formData]);

  // 메시지 변경 시 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 15초마다 자동 임시저장
  useEffect(() => {
    if (isCompleted) return; // 완료된 경우 자동저장 중지

    const autoSaveInterval = setInterval(() => {
      // 폼 데이터가 있을 때만 저장
      if (Object.keys(formData).length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        localStorage.setItem(STORAGE_STEP_KEY, currentStep.toString());
        localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(messages));
        console.log("✅ 자동 임시저장 완료:", new Date().toLocaleTimeString());
      }
    }, 15000); // 15초 = 15000ms

    return () => clearInterval(autoSaveInterval);
  }, [formData, currentStep, messages, isCompleted]);

  // 저장된 데이터 불러오기
  const loadSavedData = () => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedStep = localStorage.getItem(STORAGE_STEP_KEY);
    const savedMessages = localStorage.getItem(STORAGE_MESSAGES_KEY);

    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages);
      setMessages(
        parsedMessages.map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
      );
    }
    // hasSavedData는 useEffect에서 자동으로 false로 변경됨
  };

  // 임시저장
  const handleSaveTemp = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    localStorage.setItem(STORAGE_STEP_KEY, currentStep.toString());
    localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(messages));
    alert("✅ 수동 임시저장이 완료되었습니다!");
  };

  // 임시저장 데이터 삭제
  const clearSavedData = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_STEP_KEY);
    localStorage.removeItem(STORAGE_MESSAGES_KEY);
    setHasSavedData(false);
  };

  // 유효성 검증 함수
  const validateInput = (key: string, value: string): { valid: boolean; error?: string } => {
    // 전화번호 검증 (officePhone, mobilePhone)
    if (key === "officePhone" || key === "mobilePhone") {
      const phoneRegex = /^[0-9-]+$/;
      if (!phoneRegex.test(value)) {
        return { valid: false, error: "숫자와 하이픈(-)만 입력 가능합니다." };
      }
      const digitCount = value.replace(/-/g, "").length;
      if (digitCount < 9) {
        return { valid: false, error: "전화번호는 최소 9자리 이상이어야 합니다." };
      }
    }

    // 이름 검증 (representativeName, managerName)
    if (key === "representativeName" || key === "managerName") {
      if (value.trim().length < 2) {
        return { valid: false, error: "이름은 최소 2글자 이상이어야 합니다." };
      }
    }

    // 이메일 검증
    if (key === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return { valid: false, error: "올바른 이메일 형식이 아닙니다. (예: example@email.com)" };
      }
    }

    // 입양 해변 개수 검증
    if (key === "beachCount") {
      const count = parseInt(value);
      if (isNaN(count) || count < 1) {
        return { valid: false, error: "입양 해변 개수는 최소 1개 이상이어야 합니다." };
      }
    }

    // 풀뿌리 환경단체 개수 검증
    if (key === "grassrootsCount") {
      const count = parseInt(value);
      if (isNaN(count) || count < 1) {
        return { valid: false, error: "지원 개수는 최소 1개 이상이어야 합니다." };
      }
    }

    return { valid: true };
  };

  // 질문 플로우 정의
  const questionFlow: QuestionFlow[] = [
    {
      key: "organizationName",
      question: "귀 기관의 이름을 알려주시겠어요?",
      example: "예: 해말은사회적기업, (주)그린비치, 서울환경교육센터",
      note: "사업자등록증(단체 등록증)에 명시되어 있는 기관명을 작성해주세요.",
      nextQuestion: (answer: string) => `감사합니다, ${answer}님! 👍\n\n단체 형태를 선택해주세요.`,
    },
    {
      key: "organizationType",
      question: "단체 형태를 선택해주세요.",
      options: [
        "대기업",
        "중견기업",
        "중소기업",
        "스타트업/창업기업",
        "비영리법인/단체",
        "교육기관",
        "공기업/준정부기관/출연기관/공공기관",
        "기타",
      ],
      nextQuestion: () => "사업자 등록번호(단체 등록번호)를 알려주세요.",
    },
    {
      key: "registrationNumber",
      question: "사업자 등록번호(단체 등록번호)를 알려주세요.",
      example: "예: 123-45-67890, 1234567890",
      note: "사업자등록증 또는 단체 등록증에 명시된 번호를 입력해주세요.",
      nextQuestion: () => "대표자 성함을 알려주세요.",
    },
    {
      key: "representativeName",
      question: "대표자 성함을 알려주세요.",
      example: "예: 김해말, 이바다, 박환경",
      note: "기관의 대표자 성명을 작성해주세요.",
      nextQuestion: (answer: string) => `담당자님의 성함을 알려주세요.`,
    },
    {
      key: "managerName",
      question: "담당자 이름을 알려주세요.",
      example: "예: 홍길동, 김철수",
      note: "실무 담당자 성명을 작성해주세요.",
      nextQuestion: (answer: string) =>
        `${answer}님, 반갑습니다! 담당자님의 직통내선 번호를 알려주세요.`,
    },
    {
      key: "officePhone",
      question: "담당자님의 직통내선 번호를 알려주세요.",
      example: "예: 02-1234-1234, 051-123-4567",
      note: "사무실 전화번호 또는 직통내선 번호를 알려주세요. 없다면 휴대폰 번호를 입력하셔도 됩니다.",
      nextQuestion: () => "담당자님의 핸드폰 번호도 알려주세요.",
    },
    {
      key: "mobilePhone",
      question: "담당자님의 핸드폰 번호를 알려주세요.",
      example: "예: 010-1234-1234, 010-9876-5432",
      note: "담당자님께서 직접 받으실 수 있는 핸드폰 번호를 알려주세요.",
      nextQuestion: () => "담당자님의 이메일 주소도 알려주시겠어요? 📧",
    },
    {
      key: "email",
      question: "담당자님의 이메일 주소를 알려주세요.",
      example: "예: beach@example.com, eco@greenbeach.org",
      note: "담당자님께서 받으실 수 있는 이메일을 알려주세요.",
      nextQuestion: () => "기관의 주소를 입력해주세요.",
    },
    {
      key: "address",
      question: "기관의 주소를 입력해주세요.",
      example: "예: 서울특별시 종로구 세종대로 209, 부산광역시 해운대구 우동 1375",
      note: "사업자등록증(단체 등록증)에 명시되어 있는 주소를 작성해주세요.",
      nextQuestion: () => "몇 개의 해변을 입양하실 예정인가요?",
    },
    {
      key: "beachCount",
      question: "몇 개의 해변을 입양하실 예정인가요?",
      example: "예: 1, 2, 3",
      note: "해변 1개당 300만원의 기금이 필요합니다.",
      nextQuestion: (answer: string) => {
        const count = parseInt(answer) || 1;
        const amount = count * 3000000;
        setFormData((prev) => ({
          ...prev,
          fundAmount: `${amount.toLocaleString()}원`,
        }));
        return `${count}개 해변 입양 기금은 ${amount.toLocaleString()}원입니다.\n\n어떤 해변에서 활동하고 싶으신가요?`;
      },
    },
    {
      key: "beachLocation",
      question: "어떤 해변에서 활동하고 싶으신가요?",
      example: "예: 해운대 해수욕장, 경포대 해변, 을왕리 해수욕장",
      note: "희망하시는 해변의 이름을 작성해주세요.",
      nextQuestion: () => "해당 해변의 행정구역을 알려주세요.",
    },
    {
      key: "beachAdminDistrict",
      question: "해당 해변의 행정구역을 알려주세요.",
      example: "예: 부산광역시 해운대구, 강원도 강릉시, 인천광역시 중구",
      note: "중복되는 이름의 해변이 있을 수 있으니 정확한 행정구역을 작성해주세요.",
      nextQuestion: () => "풀뿌리 환경단체를 추가로 지원하시겠어요?",
    },
    {
      key: "grassrootsSupport",
      question: "풀뿌리 환경단체를 추가로 지원하시겠어요?",
      note: "1개의 풀뿌리 환경단체 당 150만원 지원을 약속합니다.",
      options: ["예", "아니오"],
      nextQuestion: (answer: string) => {
        if (answer === "예") {
          return "몇 개의 풀뿌리 환경단체를 지원하시겠어요?";
        }
        return "기부금 집행 방식을 선택해주세요.";
      },
    },
    {
      key: "grassrootsCount",
      question: "몇 개의 풀뿌리 환경단체를 지원하시겠어요?",
      example: "예: 1, 2, 3",
      note: "풀뿌리 환경단체 1개당 150만원입니다.",
      nextQuestion: (answer: string) => {
        const count = parseInt(answer) || 0;
        const amount = count * 1500000;
        setFormData((prev) => ({
          ...prev,
          grassrootsAmount: `${count}개 단체 × 150만원 = 일금${amount.toLocaleString()}원`,
        }));
        return `${count}개 풀뿌리 환경단체 지원 금액은 ${amount.toLocaleString()}원입니다.\n\n기부금 집행 방식을 선택해주세요.`;
      },
    },
    {
      key: "paymentMethod",
      question: "기부금 집행 방식을 선택해주세요.",
      options: ["계좌 이체", "카드 결제", "그 외"],
      nextQuestion: (answer: string) => {
        if (answer === "그 외") {
          return "어떤 방식으로 기부금을 납입하실 예정인지 알려주세요.";
        }
        return "기부금 납입 예정일을 알려주세요.";
      },
    },
    {
      key: "paymentMethodDetail",
      question: "어떤 방식으로 기부금을 납입하실 예정인지 알려주세요.",
      example: "예: 현금, 물품 지원, 무통장 입금 등",
      nextQuestion: () => "기부금 납입 예정일을 알려주세요.",
    },
    {
      key: "paymentDate",
      question: "기부금 납입 예정일을 선택해주세요.",
      note: "날짜를 선택해주세요. (YYYY-MM-DD 형식)",
      nextQuestion: () => "예상 활동 계획을 알려주세요.",
    },
    {
      key: "activityPeriod",
      question: "예상 활동 계획을 알려주세요.",
      example: "예: 매월 셋째주 화요일 해변정화, 4월 1회차 활동 및 9월 2회차 활동 예정",
      note: "연간 활동 계획이나 주요 활동 일정을 자유롭게 작성해주세요.",
      nextQuestion: () => "구성원 안전을 위한 보험 가입이 가입되어 있나요?",
    },
    {
      key: "safetyInsurance",
      question: "구성원 안전을 위한 단체상해보험 가입이 되어 있나요?",
      note: "반려해변 활동 중 발생하는 사고의 책임은 입양기관에게 있습니다.",
      options: ["예", "아니오"],
      nextQuestion: (answer: string) => {
        if (answer === "아니오") {
          return "단체상해보험이 없으시군요. 안전사고에 대해서 어떻게 대비하실 예정이신지 구체적으로 작성해주세요.";
        }
        return "개인정보 수집 및 이용에 동의하시나요?";
      },
    },
    {
      key: "safetyMeasure",
      question: "안전사고에 대한 책임을 어떻게 대비하실 예정이신지 구체적으로 작성해주세요.",
      example: "예: 임직원 개인 보험으로 진행, 별도 여행보험 가입 진행",
      note: "단체상해보험 미가입 시 안전사고 예방 및 대응 방안을 반드시 마련해야 합니다.",
      nextQuestion: () => "개인정보 수집 및 이용에 동의하시나요?",
    },
    {
      key: "consent",
      question: "개인정보 수집 및 이용에 동의하시나요?",
      note: "수집 항목: 기관명, 대표자명, 담당자명, 연락처, 이메일, 주소\n수집 목적: 해변 입양 프로그램 운영 및 관리\n보유 기간: 수집일로부터 3년 (자세한 내용은 오른쪽 입력현황의 '자세히보기' 버튼을 클릭해주세요)",
      options: ["동의합니다", "동의하지 않습니다"],
      nextQuestion: (answer: string) => {
        if (answer === "동의하지 않습니다") {
          return "개인정보 수집 및 이용 동의는 필수입니다. 동의하지 않으시면 신청을 진행할 수 없습니다.";
        }

        // 동의 날짜는 오늘 날짜로 자동 설정
        const today = new Date();
        const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
        setFormData((prev) => ({ ...prev, consentDate: formattedDate }));

        return "🎉 모든 정보 입력이 완료되었습니다!\n\n아래 버튼을 클릭하여 작성된 서류를 다운로드하세요.";
      },
    },
    {
      key: "consentRejected",
      question: "개인정보 수집 및 이용 동의는 필수입니다.",
      note: "동의하지 않으시면 신청을 진행할 수 없습니다. 다시 동의하시겠습니까?",
      options: ["동의합니다"],
      nextQuestion: () => {
        // 동의 날짜는 오늘 날짜로 자동 설정
        const today = new Date();
        const formattedDate = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
        setFormData((prev) => ({ ...prev, consentDate: formattedDate }));

        return "🎉 모든 정보 입력이 완료되었습니다!\n\n아래 버튼을 클릭하여 작성된 서류를 다운로드하세요.";
      },
    },
  ];

  const handleSendMessage = () => {
    const currentQuestion = questionFlow[currentStep];

    if (!inputValue.trim() || !currentQuestion) return;

    // 유효성 검증
    const validation = validateInput(currentQuestion.key, inputValue);
    if (!validation.valid) {
      // 유효성 검증 실패 시 에러 메시지 표시
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "bot",
        content: `❌ ${validation.error}\n\n다시 입력해주세요.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // 폼 데이터 저장
    const updatedFormData = {
      ...formData,
      [currentQuestion.key]: inputValue,
    };
    setFormData(updatedFormData);

    // 다음 질문으로 이동
    processNextQuestion(inputValue, updatedFormData);

    setInputValue("");
  };

  // 버튼 선택 핸들러
  const handleOptionClick = (option: string) => {
    const currentQuestion = questionFlow[currentStep];

    if (!currentQuestion) return;

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: option,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // 폼 데이터 저장
    const updatedFormData = {
      ...formData,
      [currentQuestion.key]: option,
    };
    setFormData(updatedFormData);

    // 다음 질문으로 이동
    processNextQuestion(option, updatedFormData);
  };

  // 다음 질문 처리 공통 로직
  const processNextQuestion = (answer: string, updatedFormData: FormData) => {
    setTimeout(() => {
      const currentQuestion = questionFlow[currentStep];
      const nextQuestionText = currentQuestion.nextQuestion(answer, updatedFormData);

      if (!nextQuestionText) {
        // nextQuestion이 null을 반환하면 해당 질문 건너뛰기
        let nextStep = currentStep + 1;

        // safetyInsurance가 "예"면 safetyMeasure 건너뛰기
        if (currentQuestion.key === "safetyInsurance" && answer === "예") {
          nextStep = questionFlow.findIndex((q) => q.key === "fundAmount");
        }
        // fundAmount가 "300만원"이면 fundNote 건너뛰기
        else if (currentQuestion.key === "fundAmount" && answer === "300만원") {
          nextStep = questionFlow.findIndex((q) => q.key === "consentDate");
        }

        // 다음 단계의 값이 이미 입력되어 있으면 건너뛰기
        while (
          nextStep < questionFlow.length &&
          updatedFormData[questionFlow[nextStep].key as keyof FormData]
        ) {
          nextStep++;
        }

        if (nextStep < questionFlow.length) {
          const nextQuestion = questionFlow[nextStep];
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: "bot",
            content: nextQuestion.question,
            timestamp: new Date(),
            questionIndex: nextStep,
            note: nextQuestion.note,
            example: nextQuestion.example,
          };
          setMessages((prev) => [...prev, botMessage]);
          setCurrentStep(nextStep);
        } else {
          // 완료
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: "bot",
            content:
              "🎉 모든 정보 입력이 완료되었습니다!\n\n아래 버튼을 클릭하여 작성된 서류를 다운로드하세요.",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, botMessage]);
          setIsCompleted(true);
        }
        return;
      }

      // nextQuestionText를 사용하여 다음 단계 찾기
      let nextStep = currentStep + 1;
      const originalNextStep = nextStep; // 건너뛰기 전 단계 저장

      // 특정 질문으로 이동해야 하는 경우
      if (currentQuestion.key === "grassrootsSupport" && answer === "아니오") {
        nextStep = questionFlow.findIndex((q) => q.key === "paymentMethod");
      } else if (currentQuestion.key === "grassrootsSupport" && answer === "예") {
        nextStep = questionFlow.findIndex((q) => q.key === "grassrootsCount");
      } else if (currentQuestion.key === "safetyInsurance" && answer === "아니오") {
        nextStep = questionFlow.findIndex((q) => q.key === "safetyMeasure");
      } else if (currentQuestion.key === "safetyInsurance" && answer === "예") {
        nextStep = questionFlow.findIndex((q) => q.key === "consent");
      } else if (currentQuestion.key === "paymentMethod" && answer !== "그 외") {
        nextStep = questionFlow.findIndex((q) => q.key === "paymentDate");
      } else {
        // 다음 단계의 값이 이미 입력되어 있으면 건너뛰기
        while (
          nextStep < questionFlow.length &&
          updatedFormData[questionFlow[nextStep].key as keyof FormData]
        ) {
          nextStep++;
        }
      }

      if (nextStep < questionFlow.length) {
        // 다음 질문 표시
        const nextQuestion = questionFlow[nextStep];

        // 건너뛰었으면 해당 질문의 기본 텍스트 사용, 아니면 개인화된 텍스트 사용
        const messageContent =
          nextStep !== originalNextStep
            ? nextQuestion?.question || nextQuestionText
            : nextQuestionText;

        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content: messageContent,
          timestamp: new Date(),
          questionIndex: nextStep,
          note: nextQuestion?.note,
          example: nextQuestion?.example,
        };
        setMessages((prev) => [...prev, botMessage]);
        setCurrentStep(nextStep);
      } else {
        // 완료
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "bot",
          content:
            "🎉 모든 정보 입력이 완료되었습니다!\n\n아래 버튼을 클릭하여 작성된 서류를 다운로드하세요.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsCompleted(true);
      }
    }, 500);
  };

  // 특정 항목 수정
  const handleEditField = (key: keyof FormData) => {
    const stepIndex = questionFlow.findIndex((q) => q.key === key);
    if (stepIndex !== -1) {
      // 해당 단계로 이동
      setCurrentStep(stepIndex);
      setIsCompleted(false);

      // 수정할 필드의 값을 삭제 (새로 입력받기 위해)
      const newFormData = { ...formData };
      delete newFormData[key];
      setFormData(newFormData);

      // 해당 단계의 질문을 다시 표시
      const botMessage: Message = {
        id: Date.now().toString(),
        type: "bot",
        content: `${questionFlow[stepIndex].question}\n\n현재 입력된 값: ${formData[key] || "(없음)"}`,
        timestamp: new Date(),
        questionIndex: stepIndex,
        note: questionFlow[stepIndex].note,
        example: questionFlow[stepIndex].example,
      };
      setMessages((prev) => [...prev, botMessage]);

      // 입력 현황에서 해당 항목으로 스크롤
      setTimeout(() => {
        fieldRefs.current[key]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // 다운로드 전 localStorage에 현재 상태 저장
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      localStorage.setItem(STORAGE_STEP_KEY, currentStep.toString());
      localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(messages));

      await generatePDF(formData);
      // 다운로드 성공 메시지 (데이터는 유지)
      alert("✅ PDF 문서가 다운로드되었습니다!");
    } catch (error) {
      console.error("PDF 생성 오류:", error);
      alert("PDF 다운로드 중 오류가 발생했습니다.");
    }
  };

  const handleDownloadWord = async () => {
    try {
      // 다운로드 전 localStorage에 현재 상태 저장
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      localStorage.setItem(STORAGE_STEP_KEY, currentStep.toString());
      localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(messages));

      // 템플릿 기반 Word 생성 시도
      await generateWordFromTemplate(formData);
      // 다운로드 성공 메시지 (데이터는 유지)
      alert("✅ Word 문서가 다운로드되었습니다!");
    } catch (error) {
      console.error("Word 생성 오류:", error);
      const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";
      alert(
        `Word 다운로드 중 오류가 발생했습니다.\n\n오류 내용: ${errorMessage}\n\n콘솔을 확인해주세요.`
      );
    }
  };

  // 입력 현황 데이터 구조
  const allFormFields = [
    { key: "organizationName" as keyof FormData, label: "기관명" },
    { key: "organizationType" as keyof FormData, label: "단체 형태" },
    { key: "registrationNumber" as keyof FormData, label: "사업자 등록번호" },
    { key: "representativeName" as keyof FormData, label: "대표자명" },
    { key: "managerName" as keyof FormData, label: "담당자명" },
    { key: "officePhone" as keyof FormData, label: "직통내선" },
    { key: "mobilePhone" as keyof FormData, label: "핸드폰번호" },
    { key: "email" as keyof FormData, label: "이메일" },
    { key: "address" as keyof FormData, label: "주소" },
    { key: "beachCount" as keyof FormData, label: "입양 해변 개수" },
    { key: "fundAmount" as keyof FormData, label: "기금 금액" },
    { key: "grassrootsSupport" as keyof FormData, label: "풀뿌리 환경단체 지원" },
    { key: "grassrootsCount" as keyof FormData, label: "풀뿌리 지원 개수" },
    { key: "grassrootsAmount" as keyof FormData, label: "풀뿌리 지원 내역" },
    { key: "paymentMethod" as keyof FormData, label: "기부금 집행 방식" },
    { key: "paymentMethodDetail" as keyof FormData, label: "기부금 방식 상세" },
    { key: "paymentDate" as keyof FormData, label: "기부금 납입 예정일" },
    { key: "beachLocation" as keyof FormData, label: "활동 희망 해변" },
    { key: "beachAdminDistrict" as keyof FormData, label: "해변 행정구역" },
    { key: "activityPeriod" as keyof FormData, label: "예상 활동 계획" },
    { key: "safetyInsurance" as keyof FormData, label: "보험 가입" },
    { key: "safetyMeasure" as keyof FormData, label: "안전대책" },
    { key: "consent" as keyof FormData, label: "개인정보 수집 동의" },
    { key: "consentDate" as keyof FormData, label: "동의 날짜" },
  ];

  // 조건부 필드 제외
  const formFields = allFormFields.filter((field) => {
    // 풀뿌리 환경단체 지원이 '아니오'인 경우 관련 필드 제외
    if (formData.grassrootsSupport === "아니오") {
      if (field.key === "grassrootsCount" || field.key === "grassrootsAmount") {
        return false;
      }
    }

    // 보험 가입이 '예'인 경우 안전대책 필드 제외
    if (formData.safetyInsurance === "예") {
      if (field.key === "safetyMeasure") {
        return false;
      }
    }

    // 기부금 집행 방식이 '계좌 이체' 또는 '카드 결제'인 경우 상세 필드 제외
    if (formData.paymentMethod === "계좌 이체" || formData.paymentMethod === "카드 결제") {
      if (field.key === "paymentMethodDetail") {
        return false;
      }
    }

    return true;
  });

  // 실제 필요한 총 질문 개수 = 필터링된 필드 개수
  const totalQuestions = formFields.length;

  // 실제 답변한 필드 개수 계산
  const answeredCount = formFields.filter((field) => formData[field.key]).length;

  // 진행률 계산
  const progress = isCompleted ? 100 : (answeredCount / totalQuestions) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 뒤로가기 버튼 */}
        <Link href="/application">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            다른 방식 선택하기
          </Button>
        </Link>

        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            친절한 등대지기와 함께 입양서류 작성하기
          </h1>
          <p className="text-lg text-gray-600">
            대화를 통해 하나씩 질문에 답하며 서류를 작성하세요
          </p>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 채팅 영역 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 진행률 표시바 */}
            <Card className="p-6 bg-white shadow-md">
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="font-medium">
                    진행 단계: {answeredCount} / {totalQuestions}
                  </span>
                  <span className="font-medium">{Math.round(progress)}% 완료</span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>🏢 기관 정보</span>
                  <span>👥 활동 정보</span>
                  <span>📋 확약 정보</span>
                  <span>✅ 완료</span>
                </div>
              </div>
            </Card>

            {/* 채팅 영역 */}
            <Card className="bg-white shadow-lg">
              <div className="h-[500px] flex flex-col">
                {/* 메시지 목록 */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.type === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-3 ${
                          message.type === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="whitespace-pre-line">{message.content}</p>
                        {message.type === "bot" && message.note && (
                          <div className="mt-3 pt-3 border-t border-gray-300">
                            <p className="text-xs text-blue-700 font-semibold bg-blue-50 p-2 rounded border border-blue-200">
                              💡 {message.note}
                            </p>
                          </div>
                        )}
                        <span
                          className={`text-xs mt-1 block ${
                            message.type === "user" ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString("ko-KR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* 입력 영역 */}
                {!isCompleted ? (
                  <div className="border-t p-4 space-y-3">
                    {/* 버튼 옵션이 있는 경우 버튼으로 표시 */}
                    {questionFlow[currentStep]?.options ? (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 text-center">
                          아래 버튼 중 하나를 선택해주세요
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center">
                          {questionFlow[currentStep].options.map((option) => (
                            <Button
                              key={option}
                              onClick={() => handleOptionClick(option)}
                              className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
                              size="lg"
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : questionFlow[currentStep]?.key === "activityPeriod" ? (
                      // activityPeriod는 Textarea로 표시 (줄바꿈 가능)
                      <div className="space-y-2">
                        <Textarea
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder={questionFlow[currentStep]?.example || "답변을 입력하세요..."}
                          className="flex-1 placeholder:text-gray-400 min-h-[100px]"
                          rows={4}
                        />
                        <Button onClick={handleSendMessage} className="w-full">
                          <Send className="h-4 w-4 mr-2" />
                          보내기
                        </Button>
                      </div>
                    ) : questionFlow[currentStep]?.key === "paymentDate" ? (
                      // paymentDate는 date input으로 표시
                      <div className="space-y-2">
                        <Input
                          type="date"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          className="flex-1"
                        />
                        <Button onClick={handleSendMessage} className="w-full">
                          <Send className="h-4 w-4 mr-2" />
                          보내기
                        </Button>
                      </div>
                    ) : (
                      // 일반 텍스트 입력
                      <div className="flex gap-2">
                        <Input
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleSendMessage();
                            }
                          }}
                          placeholder={questionFlow[currentStep]?.example || "답변을 입력하세요..."}
                          className="flex-1 placeholder:text-gray-400"
                        />
                        <Button onClick={handleSendMessage} className="px-6">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div className="flex justify-end gap-2">
                      {hasSavedData && (
                        <Button
                          onClick={loadSavedData}
                          variant="default"
                          size="sm"
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                        >
                          <RefreshCw className="h-4 w-4" />
                          불러오기
                        </Button>
                      )}
                      <Button
                        onClick={handleSaveTemp}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-gray-600"
                      >
                        <Save className="h-4 w-4" />
                        임시저장
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-t p-6 bg-gradient-to-r from-green-50 to-blue-50">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={handleDownloadPDF}
                        className="flex-1 bg-red-600 hover:bg-red-700"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        PDF로 다운로드
                      </Button>
                      <Button
                        onClick={handleDownloadWord}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Word로 다운로드
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* 오른쪽: 입력 현황 */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-md">
              <div className="h-[500px] flex flex-col">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    입력 현황
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                  {formFields.map((field) => (
                    <div
                      key={field.key}
                      ref={(el) => {
                        fieldRefs.current[field.key] = el;
                      }}
                      className={
                        formData[field.key]
                          ? "p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
                          : "p-3 bg-gray-50 rounded-lg border border-gray-200"
                      }
                      onClick={() => formData[field.key] && handleEditField(field.key)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">{field.label}</p>
                          <p
                            className={
                              formData[field.key]
                                ? "text-sm font-medium text-gray-900"
                                : "text-sm text-gray-400 italic"
                            }
                          >
                            {formData[field.key] || "미입력"}
                          </p>
                          {field.key === "consent" && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="link"
                                  className="text-blue-600 p-0 h-auto text-xs mt-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  자세히보기 &gt;
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-xl font-bold">
                                    개인정보 처리방침
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6 text-sm">
                                  <section>
                                    <h3 className="font-bold text-lg mb-3">[ 이용 목적 ]</h3>
                                    <p className="leading-relaxed">
                                      반려해변사무국, 사단법인이타서울은 귀하의 개인정보 및 활동 중
                                      생성되는 콘텐츠(사진, 영상, 환경 데이터 등)를 중요하게 여기며,
                                      『개인정보 보호법』, 『정보통신망 이용촉진 및 정보보호 등에
                                      관한 법률』 등 관련 법령을 준수합니다.
                                    </p>
                                  </section>

                                  <section>
                                    <h3 className="font-bold text-base mb-3">
                                      1. 담당자 개인정보 수집 및 이용에 대한 안내
                                    </h3>
                                    <table className="w-full border-collapse border border-gray-300">
                                      <thead>
                                        <tr className="bg-gray-100">
                                          <th className="border border-gray-300 p-2">수집 항목</th>
                                          <th className="border border-gray-300 p-2">
                                            수집 및 이용 목적
                                          </th>
                                          <th className="border border-gray-300 p-2">
                                            보유 및 이용 기간
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td className="border border-gray-300 p-2">
                                            (필수) 입양기관 담당자 및 관리자 성명, 생년월일, 주소,
                                            휴대번호, 이메일
                                          </td>
                                          <td className="border border-gray-300 p-2">
                                            입양기관 활동의 본인확인 및 담당자 확인
                                            <br />
                                            지정기부 및 기부금 영수증 발급을 위한 정보 확인
                                          </td>
                                          <td className="border border-gray-300 p-2">
                                            수집일로부터 <strong>1년간 보관</strong>
                                            <br />
                                            이후 해양수산부 반려해변 정책 및 법령에 따른 보관 지침에
                                            따름
                                            <br />
                                            목적이 달성된 후에는 지체 없이 파기
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </section>

                                  <section>
                                    <h3 className="font-bold text-base mb-3">
                                      2. 반려해변 콘텐츠 수집 및 이용에 대한 안내
                                    </h3>
                                    <table className="w-full border-collapse border border-gray-300">
                                      <thead>
                                        <tr className="bg-gray-100">
                                          <th className="border border-gray-300 p-2">수집 항목</th>
                                          <th className="border border-gray-300 p-2">
                                            수집 및 이용 목적
                                          </th>
                                          <th className="border border-gray-300 p-2">
                                            보유 및 이용 기간
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td className="border border-gray-300 p-2">
                                            (필수) 반려해변 입양기관의 활동 사진, 영상, 콘텐츠, 환경
                                            데이터 등 제반 반려해변 공익활동 과정의 산출물
                                          </td>
                                          <td className="border border-gray-300 p-2">
                                            활동 결과의 기록 및 홍보 (웹사이트, 보고서, 언론보도 등
                                            공익 목적 활용)
                                            <br />
                                            반려해변 프로그램 운영 성과 측정 및 활동 평가, 활동
                                            보고서 작성 및 지정기부금 사용 내역 증빙 자료
                                          </td>
                                          <td className="border border-gray-300 p-2">
                                            <strong>수집일로부터 3년간 보관</strong>
                                            <br />
                                            이후 해양수산부 반려해변 정책 및 법령에 따른 보관 지침에
                                            따름
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </section>

                                  <section>
                                    <h3 className="font-bold text-base mb-3">
                                      3. 공유 범위 : 해양수산부, 해양환경공단, 반려해변 폐기물관리
                                      지방자치단체, 반려해변 지역 코디네이터
                                    </h3>
                                  </section>

                                  <section className="bg-blue-50 p-4 rounded-md">
                                    <p className="leading-relaxed mb-3">
                                      반려해변 사무국은 입양기관과 기금조성사의 개인정보를
                                      중요시하며 효과적으로 보호하고 있습니다. 반려해변 사무국은
                                      &quot;개인정보 보호법&quot;에 의거 지정기부 집행 이행에 따른
                                      최소한의 개인정보를 수집하며, 반드시 적법한 절차에 따라 동의를
                                      받으며 표기된 목적을 위해서만 사용됩니다.
                                    </p>
                                    <p className="leading-relaxed">
                                      수집된 개인정보 및 콘텐츠는 비영리 목적 외에는 사용되지
                                      않으며, 상업적 용도로 활용하거나 보유한 개인정보는 공유범위 외
                                      관계없는 제3자에게 일체 제공하지 않습니다. 본 동의는 최소한의
                                      필수 항목으로 거부 시 반려해변 활동 참여 및 지정기부가 제한될
                                      수 있습니다.
                                    </p>
                                  </section>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                        {formData[field.key] && (
                          <Edit2 className="h-4 w-4 text-blue-600 flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* 안내 문구 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            💡 답변하신 내용은 자동으로 서류에 입력되어 다운로드됩니다.
            <br />
            잘못 입력한 내용은 오른쪽 입력 현황에서 클릭하여 수정할 수 있습니다.
            <br />
            임시저장 버튼을 통해 작성 중인 내용을 저장하고 나중에 이어서 작성할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

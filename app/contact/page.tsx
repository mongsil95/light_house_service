"use client";

import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    organization: "",
    name: "",
    phone: "",
    email: "",
    content: "",
    method: "전화",
    preferredDate: "",
    preferredTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [contentError, setContentError] = useState("");
  const [dateError, setDateError] = useState("");

  // 전화번호 형식 검증
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(01[016789]-?\d{3,4}-?\d{4}|0[2-9][0-9]?-?\d{3,4}-?\d{4})$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  // 이메일 형식 검증
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 날짜 검증 (화요일 또는 목요일인지 확인)
  const validateDate = (dateString: string): { valid: boolean; message?: string } => {
    if (!dateString) return { valid: false };

    const selectedDate = new Date(dateString);
    const dayOfWeek = selectedDate.getDay(); // 0(일) ~ 6(토)

    // 화요일(2) 또는 목요일(4)인지 확인
    if (dayOfWeek !== 2 && dayOfWeek !== 4) {
      const dayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
      return {
        valid: false,
        message: `선택하신 날짜는 ${dayNames[dayOfWeek]}입니다. 화요일 또는 목요일만 선택 가능합니다.`,
      };
    }

    return { valid: true };
  };

  // 오늘 날짜 가져오기 (YYYY-MM-DD 형식)
  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 내일 날짜 가져오기 (당일 예약 방지)
  const getTomorrowDate = (): string => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const day = String(tomorrow.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    // 전화번호 검증
    if (!validatePhone(formData.phone)) {
      alert("올바른 전화번호 형식이 아닙니다.\n예: 010-1234-5678");
      return;
    }

    // 이메일 검증
    if (!validateEmail(formData.email)) {
      alert("올바른 이메일 형식이 아닙니다.\n예: example@email.com");
      return;
    }

    // 문의 내용 길이 검증
    if (formData.content.length < 100) {
      alert("문의 내용은 최소 100자 이상 작성해주세요.");
      return;
    }

    // 날짜 검증
    const dateValidation = validateDate(formData.preferredDate);
    if (!dateValidation.valid) {
      alert(dateValidation.message || "화요일 또는 목요일만 선택 가능합니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "예약 신청에 실패했습니다.");
      }

      alert(`무전 예약이 신청되었습니다!\n담당자가 확인 후 연락드리겠습니다.`);

      // 폼 초기화
      setFormData({
        organization: "",
        name: "",
        phone: "",
        email: "",
        content: "",
        method: "전화",
        preferredDate: "",
        preferredTime: "",
      });
      setEmailError("");
      setPhoneError("");
      setContentError("");
      setDateError("");

      // 홈으로 이동
      router.push("/");
    } catch (error: any) {
      console.error("Error submitting contact form:", error);
      alert(error.message || "예약 신청 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 이메일 실시간 검증
    if (name === "email") {
      if (value && !validateEmail(value)) {
        setEmailError("올바른 이메일 형식이 아닙니다. (예: example@email.com)");
      } else {
        setEmailError("");
      }
    }

    // 전화번호 실시간 검증
    if (name === "phone") {
      if (value && !validatePhone(value)) {
        setPhoneError("올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)");
      } else {
        setPhoneError("");
      }
    }

    // 문의 내용 실시간 검증
    if (name === "content") {
      if (value.length < 100) {
        setContentError(`최소 100자 이상 작성해주세요. (현재 ${value.length}자)`);
      } else {
        setContentError("");
      }
    }

    // 날짜 실시간 검증
    if (name === "preferredDate") {
      if (value) {
        const dateValidation = validateDate(value);
        if (!dateValidation.valid) {
          setDateError(dateValidation.message || "화요일 또는 목요일만 선택 가능합니다.");
        } else {
          setDateError("");
        }
      } else {
        setDateError("");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl text-gray-900 mb-4 font-[Cafe24_Ssurround]">
              등대 무전 예약
            </h1>
            <p className="text-lg text-gray-600 font-[Cafe24_Ssurround]">
              찾아도 안나오는 궁금증이 있으신가요? 등대지기에게 무전을 보내주세요!
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <Card className="border border-gray-200 shadow-sm w-full max-w-md">
              <CardContent className="p-6 text-center">
                <Clock className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-lg text-gray-900 mb-2 font-[Cafe24_Ssurround]">
                  무전 가능 시간
                </h3>
                <p className="text-gray-700 font-[Cafe24_Ssurround]">매주 화요일, 목요일</p>
                <p className="text-sm text-gray-600 mt-2 font-[Cafe24_Ssurround]">13:00 - 16:00</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl text-gray-900 mb-6 font-[Cafe24_Ssurround]">
                무전 예약 신청
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-['Pretendard']">
                      단체명 *
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:border-gray-400 font-['Pretendard']"
                      placeholder="소속 단체 또는 기업명"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-['Pretendard']">
                      성명 *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:border-gray-400 font-['Pretendard']"
                      placeholder="이름"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-['Pretendard']">
                      전화번호 *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-1 font-['Pretendard'] ${
                        phoneError
                          ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                          : "border-gray-300 focus:ring-gray-400 focus:border-gray-400"
                      }`}
                      placeholder="010-0000-0000"
                    />
                    {phoneError && (
                      <p className="text-xs text-red-600 mt-1 font-['Pretendard']">{phoneError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-['Pretendard']">
                      이메일 주소 *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-1 font-['Pretendard'] ${
                        emailError
                          ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                          : "border-gray-300 focus:ring-gray-400 focus:border-gray-400"
                      }`}
                      placeholder="email@example.com"
                    />
                    {emailError && (
                      <p className="text-xs text-red-600 mt-1 font-['Pretendard']">{emailError}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-['Pretendard']">
                    문의 내용 * (최소 100자)
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    minLength={100}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-1 font-['Pretendard'] ${
                      contentError
                        ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                        : "border-gray-300 focus:ring-gray-400 focus:border-gray-400"
                    }`}
                    placeholder={`궁금하신 내용에 대하여, 홈에서 충분히 찾아보셨을까요?

상담이 필요한 구체적인 내용을 작성해주세요. (프로젝트 협업, 교육 문의, 단체 활동 등)
자세히 작성해주실수록 더 나은 상담을 제공할 수 있습니다.`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {contentError ? (
                      <p className="text-xs text-red-600 font-['Pretendard']">{contentError}</p>
                    ) : (
                      <p className="text-xs text-gray-500 font-['Pretendard']">
                        {formData.content.length >= 100
                          ? `✓ ${formData.content.length}자`
                          : `${formData.content.length}자 / 최소 100자`}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-['Pretendard']">
                      무전 방법 *
                    </label>
                    <select
                      name="method"
                      value={formData.method}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:border-gray-400 font-['Pretendard']"
                    >
                      <option value="전화">전화 통화</option>
                      <option value="구글밋">구글 밋 (Google Meet)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-['Pretendard']">
                      희망 시간 * (13:00 - 16:00)
                    </label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-gray-400 focus:border-gray-400 font-['Pretendard']"
                    >
                      <option value="">선택해주세요</option>
                      <option value="13:00">13:00</option>
                      <option value="13:30">13:30</option>
                      <option value="14:00">14:00</option>
                      <option value="14:30">14:30</option>
                      <option value="15:00">15:00</option>
                      <option value="15:30">15:30</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-['Pretendard']">
                    희망 일자 * (화요일, 목요일만 가능)
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={getTomorrowDate()}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-1 font-['Pretendard'] ${
                      dateError
                        ? "border-red-400 focus:ring-red-400 focus:border-red-400"
                        : "border-gray-300 focus:ring-gray-400 focus:border-gray-400"
                    }`}
                  />
                  {dateError ? (
                    <p className="text-xs text-red-600 mt-1 font-['Pretendard']">{dateError}</p>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1 font-['Pretendard']">
                      * 화요일 또는 목요일로 선택해주세요
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 font-['Pretendard']">
                    📌 신청하신 내용은 담당자 확인 후 이메일 또는 전화로 최종 일정을 안내드립니다.
                  </p>
                  <p className="text-sm text-gray-700 mt-2 font-['Pretendard']">
                    📌 무전 가능 시간: 매주 화요일, 목요일 13:00 - 16:00
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-lg transition-all font-['Pretendard'] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      신청 중...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-5 h-5" />
                      무전 예약 신청하기
                    </>
                  )}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

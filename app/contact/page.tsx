"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";

export default function ContactPage() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 폼 제출 처리
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
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl text-blue-900 mb-4 font-[Cafe24_Ssurround]">
              등대 무전 예약
            </h1>
            <p className="text-lg text-gray-700 font-[Cafe24_Ssurround]">
              편하게 무전주세요 :) 등대지기가 상담해드립니다.
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <Card className="border-2 border-blue-200 w-full max-w-md">
              <CardContent className="p-6 text-center">
                <Clock className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <h3 className="text-lg text-blue-900 mb-2 font-[Cafe24_Ssurround]">
                  무전 가능 시간
                </h3>
                <p className="text-gray-700 font-[Cafe24_Ssurround]">매주 화요일, 목요일</p>
                <p className="text-sm text-gray-600 mt-2 font-[Cafe24_Ssurround]">13:00 - 16:00</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-blue-300">
            <CardContent className="p-8">
              <h2 className="text-2xl text-blue-900 mb-6 font-[Cafe24_Ssurround]">
                무전 예약 신청
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-[Cafe24_Ssurround]">
                      단체명 *
                    </label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[Cafe24_Ssurround]"
                      placeholder="소속 단체 또는 기업명"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-[Cafe24_Ssurround]">
                      성명 *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[Cafe24_Ssurround]"
                      placeholder="이름"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-[Cafe24_Ssurround]">
                      전화번호 *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[Cafe24_Ssurround]"
                      placeholder="010-0000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-[Cafe24_Ssurround]">
                      이메일 주소 *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[Cafe24_Ssurround]"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2 font-[Cafe24_Ssurround]">
                    문의 내용 *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[Cafe24_Ssurround]"
                    placeholder="일반적인 문의는 '일반 문의' 메뉴를 이용해주세요.&#10;&#10;상담이 필요한 구체적인 내용을 작성해주세요. (프로젝트 협업, 교육 문의, 단체 활동 등)&#10;자세히 작성해주실수록 더 나은 상담을 제공할 수 있습니다."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-[Cafe24_Ssurround]">
                      무전 방법 *
                    </label>
                    <select
                      name="method"
                      value={formData.method}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[Cafe24_Ssurround]"
                    >
                      <option value="전화">전화 통화</option>
                      <option value="구글밋">구글 밋 (Google Meet)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-[Cafe24_Ssurround]">
                      희망 시간 * (13:00 - 16:00)
                    </label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[Cafe24_Ssurround]"
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
                  <label className="block text-sm text-gray-700 mb-2 font-[Cafe24_Ssurround]">
                    희망 일자 * (화요일, 목요일만 가능)
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[Cafe24_Ssurround]"
                  />
                  <p className="text-sm text-gray-500 mt-1 font-[Cafe24_Ssurround]">
                    * 화요일 또는 목요일로 선택해주세요
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 font-[Cafe24_Ssurround]">
                    📌 신청하신 내용은 담당자 확인 후 이메일 또는 전화로 최종 일정을 안내드립니다.
                  </p>
                  <p className="text-sm text-gray-700 mt-2 font-[Cafe24_Ssurround]">
                    📌 무전 가능 시간: 매주 화요일, 목요일 13:00 - 16:00
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-300 text-white py-4 rounded-lg text-lg transition-all font-[Cafe24_Ssurround] flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  무전 예약 신청하기
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

"use client";

import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ExpertsPage() {
  const [selectedExpert, setSelectedExpert] = useState<(typeof experts)[0] | null>(null);

  // 전문가 목록
  const experts = [
    {
      id: 1,
      name: "이타서울 해양팀",
      organization: "이타서울 비영리",
      role: "환경 보호 전문가",
      description: "반려해변 전국대회를 운영하며 해양환경 보호 활동을 지원합니다.",
      email: "ocean@itaseoul.org",
      image: "🌊",
      logoImage: "https://via.placeholder.com/100x100?text=이타서울",
      answerCount: 156,
      tier: "마스터",
      tierColor: "text-purple-600",
      tierBgColor: "bg-purple-50",
      specialty: ["반려해변입양", "정화활동", "해봄프로그램"],
    },
    {
      id: 2,
      name: "해양환경공단",
      organization: "해양환경공단",
      role: "공공기관 전문가",
      description: "해양 생태계 보호와 환경 정화를 위한 전문 기관입니다.",
      email: "contact@koem.or.kr",
      image: "🐋",
      logoImage: "https://via.placeholder.com/100x100?text=해양환경공단",
      answerCount: 89,
      tier: "전문가",
      tierColor: "text-blue-600",
      tierBgColor: "bg-blue-50",
      specialty: ["정화활동", "운영·기타"],
    },
    {
      id: 3,
      name: "김민지 코디네이터",
      organization: "반려해변입양 전문",
      role: "입양 코디네이터",
      description: "반려해변입양 신청부터 운영까지 함께 돕겠습니다.",
      email: "minji.kim@adoptbeach.kr",
      image: "👩‍💼",
      logoImage: "https://via.placeholder.com/100x100?text=김민지",
      answerCount: 234,
      tier: "마스터",
      tierColor: "text-purple-600",
      tierBgColor: "bg-purple-50",
      specialty: ["반려해변입양", "운영·기타"],
    },
    {
      id: 4,
      name: "박준호 환경전문가",
      organization: "해양생태연구소",
      role: "해양생태 연구원",
      description: "해양 쓰레기 처리와 생태계 보호에 대한 전문 답변을 제공합니다.",
      email: "juno.park@ocean-lab.kr",
      image: "🔬",
      logoImage: "https://via.placeholder.com/100x100?text=박준호",
      answerCount: 67,
      tier: "숙련가",
      tierColor: "text-green-600",
      tierBgColor: "bg-green-50",
      specialty: ["정화활동", "해봄프로그램"],
    },
    {
      id: 5,
      name: "최서연 활동가",
      organization: "바다사랑실천단",
      role: "현장 활동 전문가",
      description: "10년 이상의 해변 정화 활동 경험을 바탕으로 실질적인 조언을 드립니다.",
      email: "seoyeon.choi@oceanlove.kr",
      image: "🌟",
      logoImage: "https://via.placeholder.com/100x100?text=최서연",
      answerCount: 42,
      tier: "숙련가",
      tierColor: "text-green-600",
      tierBgColor: "bg-green-50",
      specialty: ["정화활동", "해봄프로그램"],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* 뒤로가기 버튼 */}
          <Link
            href="/adopt-a-beach/expertsqna"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">전문가 Q&A로 돌아가기</span>
          </Link>

          {/* 헤더 */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">전문가 소개</h1>
            <p className="text-lg text-gray-600">
              💡 답변 50개 이상: 마스터 / 30개 이상: 전문가 / 10개 이상: 숙련가
            </p>
          </div>

          {/* 전문가 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experts.map((expert) => (
              <Card
                key={expert.id}
                className="border border-gray-200 hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => setSelectedExpert(expert)}
              >
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-5xl flex-shrink-0 shadow-lg mb-6">
                      {expert.image}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {expert.name}
                      </h4>
                      <Badge
                        className={`${expert.tierBgColor} ${expert.tierColor} text-xs font-bold`}
                      >
                        {expert.tier}
                      </Badge>
                    </div>
                    <p className="text-base text-gray-600 mb-2">{expert.organization}</p>
                    <p className="text-sm text-gray-500 mb-4">{expert.role}</p>
                    <p className="text-sm text-gray-700 line-clamp-3 mb-6">{expert.description}</p>

                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                      {expert.specialty.map((spec, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 pt-6 border-t border-gray-100 w-full justify-center">
                      <ThumbsUp className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold text-blue-600">{expert.answerCount}</span>
                      <span className="text-xs">답변</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* 전문가 상세 정보 모달 */}
      <Dialog open={!!selectedExpert} onOpenChange={(open) => !open && setSelectedExpert(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedExpert && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-6 mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-5xl flex-shrink-0 shadow-lg">
                    {selectedExpert.image}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <DialogTitle className="text-2xl font-bold text-gray-900">
                        {selectedExpert.name}
                      </DialogTitle>
                      <Badge
                        className={`${selectedExpert.tierBgColor} ${selectedExpert.tierColor} font-bold`}
                      >
                        {selectedExpert.tier}
                      </Badge>
                    </div>
                    <p className="text-base text-gray-600 mb-1">{selectedExpert.organization}</p>
                    <p className="text-sm text-gray-500">{selectedExpert.role}</p>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* 소개 */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-2">소개</h3>
                  <DialogDescription className="text-base text-gray-700 leading-relaxed">
                    {selectedExpert.description}
                  </DialogDescription>
                </div>

                {/* 전문 분야 */}
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-3">전문 분야</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedExpert.specialty.map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 활동 통계 */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <ThumbsUp className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-gray-600">답변 수</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{selectedExpert.answerCount}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="text-sm text-gray-600">등급</span>
                    </div>
                    <p className={`text-3xl font-bold ${selectedExpert.tierColor}`}>
                      {selectedExpert.tier}
                    </p>
                  </div>
                </div>

                {/* 연락처 */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-gray-700 mb-2">연락처</h3>
                  <div className="flex items-center gap-2 text-gray-700">
                    <span>📧</span>
                    <a
                      href={`mailto:${selectedExpert.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {selectedExpert.email}
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

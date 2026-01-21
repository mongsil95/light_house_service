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
import { supabase } from "@/lib/supabase";
import { ArrowLeft, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ExpertsPage() {
  const [selectedExpert, setSelectedExpert] = useState<any | null>(null);
  const [experts, setExperts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Supabase에서 전문가 목록 가져오기
  useEffect(() => {
    async function fetchExperts() {
      try {
        setLoading(true);

        // experts 테이블에서 활성화된 전문가만 가져오기
        const { data: expertsData, error: expertsError } = await supabase
          .from("experts")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (expertsError) throw expertsError;

        if (expertsData) {
          // 각 전문가의 답변 개수 계산
          const { data: answersData, error: answersError } = await supabase
            .from("qna_answers")
            .select("answerer_name");

          const answerCountMap = new Map();
          if (!answersError && answersData) {
            answersData.forEach((answer: any) => {
              const count = answerCountMap.get(answer.answerer_name) || 0;
              answerCountMap.set(answer.answerer_name, count + 1);
            });
          }

          // 전문가 데이터 포맷팅
          const formattedExperts = expertsData.map((expert) => {
            const answerCount = answerCountMap.get(expert.name) || 0;

            // 등급 결정
            let tier = "숙련가";
            let tierColor = "text-green-600";
            let tierBgColor = "bg-green-50";

            if (answerCount >= 50) {
              tier = "마스터";
              tierColor = "text-purple-600";
              tierBgColor = "bg-purple-50";
            } else if (answerCount >= 30) {
              tier = "전문가";
              tierColor = "text-blue-600";
              tierBgColor = "bg-blue-50";
            } else if (answerCount >= 10) {
              tier = "숙련가";
              tierColor = "text-green-600";
              tierBgColor = "bg-green-50";
            }

            return {
              id: expert.id,
              name: expert.name,
              organization: expert.organization || "전문가",
              role: expert.role || "전문가",
              description: expert.description || `${expert.name}의 전문가 답변을 확인해보세요.`,
              email: expert.email || "",
              image: expert.profile_image || "👤",
              answerCount: answerCount,
              tier: tier,
              tierColor: tierColor,
              tierBgColor: tierBgColor,
              specialty: expert.specialty || [],
            };
          });

          setExperts(formattedExperts);
        }
      } catch (error) {
        console.error("Error fetching experts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchExperts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* 뒤로가기 버튼 */}
          <Link
            href="/lighthouse-QnA"
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

          {/* 로딩 상태 */}
          {loading && (
            <div className="text-center py-20">
              <div className="text-xl text-gray-600">로딩 중...</div>
            </div>
          )}

          {/* 전문가 없음 */}
          {!loading && experts.length === 0 && (
            <div className="text-center py-20">
              <div className="text-xl text-gray-600">등록된 전문가가 없습니다.</div>
            </div>
          )}

          {/* 전문가 그리드 */}
          {!loading && experts.length > 0 && (
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
                      <p className="text-sm text-gray-700 line-clamp-3 mb-6">
                        {expert.description}
                      </p>

                      <div className="flex flex-wrap gap-2 justify-center mb-6">
                        {expert.specialty.map((spec: string, idx: number) => (
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
          )}
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
                    {selectedExpert.specialty.map((spec: string, idx: number) => (
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

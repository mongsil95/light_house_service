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
import { ChevronRight, Eye, HelpCircle, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdoptABeachCommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortOrder, setSortOrder] = useState("최근 답변순");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpert, setSelectedExpert] = useState<any | null>(null);
  const [qaList, setQaList] = useState<any[]>([]);
  const [experts, setExperts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Supabase에서 Q&A 데이터 가져오기
  useEffect(() => {
    async function fetchQnA() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("qna")
          .select("*")
          .eq("is_public", true)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          // Q&A 데이터 포맷팅
          const formattedQAs = data.map((qa) => ({
            id: qa.id,
            category: qa.category || "운영·기타",
            question: qa.title,
            views: qa.views || 0,
            likes: 0, // likes 필드가 없으므로 0으로 설정
            date: new Date(qa.created_at)
              .toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
              .replace(/\. /g, ".")
              .replace(/\.$/, ""),
            expert: qa.author_name,
            expertImage: getExpertImage(qa.author_name),
            answered: qa.status === "answered",
            content: qa.content,
          }));

          setQaList(formattedQAs);

          // 전문가 목록 가져오기 (experts 테이블에서)
          const { data: expertsData, error: expertsError } = await supabase
            .from("experts")
            .select("*")
            .eq("is_active", true)
            .order("display_order", { ascending: true });

          if (!expertsError && expertsData) {
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
          } else {
            setExperts([]);
          }
        }
      } catch (error) {
        console.error("Error fetching Q&A:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQnA();
  }, []);

  // 전문가별 아이콘 매핑
  function getExpertImage(name: string): string {
    return "👤";
  }

  // 카테고리
  const categories = [
    { id: "전체", label: "전체", icon: "🌐" },
    { id: "입양절차", label: "입양절차", icon: "🏖️" },
    { id: "활동계획", label: "활동계획", icon: "♻️" },
    { id: "기금납부", label: "기금납부", icon: "🌱" },
    { id: "기타", label: "기타", icon: "📋" },
  ];

  const filteredQAs = qaList.filter((qa) => {
    const matchesCategory = selectedCategory === "전체" || qa.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" || qa.question.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 정렬 적용
  const sortedQAs = [...filteredQAs].sort((a, b) => {
    if (sortOrder === "인기순") {
      return b.views - a.views;
    }
    // 최근 답변순 (기본)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // 인기 질문 TOP 6 (조회수 기준으로 정렬)
  const popularQuestions = [...qaList].sort((a, b) => b.views - a.views).slice(0, 6);

  // 페이지네이션 계산
  const totalPages = Math.ceil(sortedQAs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedQAs = sortedQAs.slice(startIndex, endIndex);

  // 페이지 변경 시 맨 위로 스크롤
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">로딩 중...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* 헤더 */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">등대지기 Q&A</h1>
          </div>

          {/* 카테고리 필터 */}
          <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full whitespace-nowrap font-semibold transition-all border-2 ${
                  selectedCategory === category.id
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 메인 콘텐츠 */}
            <div className="lg:col-span-2">
              {/* 인기 질문 */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  🔍 오늘 인기있는 질문
                </h2>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                  <p className="text-sm text-gray-600 mb-4">
                    {new Date()
                      .toLocaleDateString("ko-KR", {
                        month: "2-digit",
                        day: "2-digit",
                        weekday: "short",
                      })
                      .replace(/\. /g, ". ")}{" "}
                    실시간 기준
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {popularQuestions.map((qa, idx) => (
                      <Link
                        key={qa.id}
                        href={`/adopt-a-beach/expertsqna/${qa.id}`}
                        className="flex items-start gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-all group"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {qa.question}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* 검색 바 */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="질문을 검색하세요..."
                    className="w-full px-6 py-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-gray-900 placeholder-gray-400"
                  />
                  <HelpCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Q&A 목록 */}
              {/* 정렬 및 개수 */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  <span className="font-bold text-blue-600">{sortedQAs.length}</span>개
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSortOrder("최근 답변순")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      sortOrder === "최근 답변순"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    최근 답변순
                  </button>
                  <button
                    onClick={() => setSortOrder("인기순")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      sortOrder === "인기순"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    인기순
                  </button>
                </div>
              </div>

              {/* Q&A 리스트 */}
              <div className="space-y-4">
                {paginatedQAs.length === 0 ? (
                  <Card className="border border-gray-200">
                    <CardContent className="p-12 text-center">
                      <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-gray-900 mb-2">검색 결과가 없습니다</h3>
                      <p className="text-gray-600 mb-6">다른 검색어나 카테고리를 시도해보세요</p>
                      <Link href="/adopt-a-beach/expertsqna/ask">
                        <button className="px-6 py-3 bg-blue-300 text-white rounded-lg hover:bg-blue-400 transition-colors font-semibold">
                          새 질문하기
                        </button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  paginatedQAs.map((qa) => (
                    <Link key={qa.id} href={`/adopt-a-beach/expertsqna/${qa.id}`}>
                      <Card className="hover:shadow-lg transition-all border border-gray-200 cursor-pointer group">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                              {qa.expertImage}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs font-semibold">
                                  {qa.category}
                                </Badge>
                              </div>
                              <h3 className="font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                {qa.question}
                              </h3>
                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center gap-4">
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    조회 {qa.views}
                                  </span>
                                  <span>· {qa.date}</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                              </div>
                              <div className="mt-3 flex items-center gap-2 text-sm">
                                <div className="flex items-center gap-2 text-blue-600">
                                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-sm">
                                    {qa.expertImage}
                                  </div>
                                  <span className="font-semibold">{qa.expert}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    ‹
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          pageNumber === currentPage
                            ? "bg-blue-500 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    ›
                  </button>
                </div>
              )}
            </div>

            {/* 사이드바 */}
            <div className="space-y-8">
              {/* 질문하기 배너 */}
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-8 text-white text-center sticky top-24">
                <div className="mb-4">
                  <HelpCircle className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">찾으시는 질문이 없으신가요?</h3>
                  <p className="text-blue-50 text-sm mb-6">등대지기에게 질문해보세요</p>
                </div>
                <Link href="/adopt-a-beach/expertsqna/ask">
                  <button className="w-full px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors">
                    질문하기
                  </button>
                </Link>
              </div>

              {/* 전문가 소개 */}
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">등대지기 소개</h3>
                  <div className="text-xs text-gray-500">
                    💡 답변 50개 이상: 마스터 / 30개 이상: 전문가 / 10개 이상: 숙련가
                  </div>
                </div>
                <div className="space-y-4">
                  {experts.map((expert) => (
                    <Card
                      key={expert.id}
                      className="border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
                      onClick={() => setSelectedExpert(expert)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                            {expert.image}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {expert.name}
                              </h4>
                              <Badge
                                className={`${expert.tierBgColor} ${expert.tierColor} text-xs font-bold`}
                              >
                                {expert.tier}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{expert.organization}</p>
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {expert.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Link href="/adopt-a-beach/expertsqna/experts">
                    <button className="w-full px-4 py-3 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors border-2 border-blue-200">
                      전문가 전체보기 →
                    </button>
                  </Link>
                </div>
              </div>
            </div>
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

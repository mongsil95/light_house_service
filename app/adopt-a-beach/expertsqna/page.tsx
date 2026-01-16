"use client";

import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Eye, HelpCircle, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdoptABeachCommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortOrder, setSortOrder] = useState("최근 답변순");
  const [searchQuery, setSearchQuery] = useState("");

  // 카테고리
  const categories = [
    { id: "전체", label: "전체", icon: "🌐" },
    { id: "반려해변입양", label: "반려해변입양", icon: "🏖️" },
    { id: "정화활동", label: "정화활동", icon: "♻️" },
    { id: "해봄프로그램", label: "해봄프로그램", icon: "🌱" },
    { id: "운영·기타", label: "운영·기타", icon: "📋" },
  ];

  // 전문가 목록
  const experts = [
    {
      name: "이타서울 해양팀",
      organization: "이타서울 비영리",
      description: "반려해변 전국대회를 운영하며 해양환경 보호 활동을 지원합니다.",
      image: "🌊",
    },
    {
      name: "해양환경공단",
      organization: "해양환경공단",
      description: "해양 생태계 보호와 환경 정화를 위한 전문 기관입니다.",
      image: "🐋",
    },
    {
      name: "김민지 코디네이터",
      organization: "반려해변입양 전문",
      description: "반려해변입양 신청부터 운영까지 함께 돕겠습니다.",
      image: "👩‍💼",
    },
    {
      name: "박준호 환경전문가",
      organization: "해양생태연구소",
      description: "해양 쓰레기 처리와 생태계 보호에 대한 전문 답변을 제공합니다.",
      image: "🔬",
    },
  ];

  // Q&A 목록
  const qaList = [
    {
      id: 1,
      category: "반려해변입양",
      question: "반려해변입양 신청 시 필요한 서류는 무엇인가요?",
      views: 308,
      likes: 12,
      date: "2026.01.15",
      expert: "김민지 코디네이터",
      expertImage: "👩‍💼",
      answered: true,
    },
    {
      id: 2,
      category: "정화활동",
      question: "겨울철 해변 정화 활동 시 주의사항은?",
      views: 156,
      likes: 8,
      date: "2026.01.14",
      expert: "박준호 환경전문가",
      expertImage: "🔬",
      answered: true,
    },
    {
      id: 3,
      category: "해봄프로그램",
      question: "학교에서 단체로 참여하려면 어떻게 해야 하나요?",
      views: 89,
      likes: 5,
      date: "2026.01.13",
      expert: "이타서울 해양팀",
      expertImage: "🌊",
      answered: true,
    },
    {
      id: 4,
      category: "운영·기타",
      question: "정화 키트 신청 방법이 궁금합니다",
      views: 234,
      likes: 15,
      date: "2026.01.12",
      expert: "김민지 코디네이터",
      expertImage: "👩‍💼",
      answered: true,
    },
    {
      id: 5,
      category: "반려해변입양",
      question: "입양 후 월 1회 활동을 못하면 어떻게 되나요?",
      views: 445,
      likes: 28,
      date: "2026.01.11",
      expert: "이타서울 해양팀",
      expertImage: "🌊",
      answered: true,
    },
    {
      id: 6,
      category: "정화활동",
      question: "쓰레기 분류는 어떻게 해야 하나요?",
      views: 178,
      likes: 9,
      date: "2026.01.10",
      expert: "박준호 환경전문가",
      expertImage: "🔬",
      answered: true,
    },
    {
      id: 7,
      category: "반려해변입양",
      question: "개인도 반려해변입양 신청이 가능한가요?",
      views: 523,
      likes: 34,
      date: "2026.01.09",
      expert: "김민지 코디네이터",
      expertImage: "👩‍💼",
      answered: true,
    },
    {
      id: 8,
      category: "운영·기타",
      question: "정화 활동 인증서 발급은 어떻게 받나요?",
      views: 312,
      likes: 19,
      date: "2026.01.08",
      expert: "이타서울 해양팀",
      expertImage: "🌊",
      answered: true,
    },
  ];

  const filteredQAs = qaList.filter((qa) => {
    const matchesCategory = selectedCategory === "전체" || qa.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" || qa.question.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 인기 질문 TOP 6 (좋아요 수 기준으로 정렬)
  const popularQuestions = [...qaList].sort((a, b) => b.likes - a.likes).slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* 헤더 */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">전문가 Q&A</h1>
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
                  <p className="text-sm text-gray-600 mb-4">01. 16. (금) 실시간 기준</p>
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
                  <span className="font-bold text-blue-600">{filteredQAs.length}</span>개
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
                {filteredQAs.length === 0 ? (
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
                  filteredQAs.map((qa) => (
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
                                  <span className="flex items-center gap-1">
                                    <ThumbsUp className="w-4 h-4" />
                                    좋아요 {qa.likes}
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
              <div className="flex justify-center items-center gap-2 mt-12">
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  ‹
                </button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      page === 1 ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  ›
                </button>
              </div>
            </div>

            {/* 사이드바 */}
            <div className="space-y-8">
              {/* 질문하기 배너 */}
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-8 text-white text-center sticky top-24">
                <div className="mb-4">
                  <HelpCircle className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">찾으시는 질문이 없으신가요?</h3>
                  <p className="text-blue-50 text-sm mb-6">반려해변 전문가에게 질문해보세요</p>
                </div>
                <Link href="/adopt-a-beach/expertsqna/ask">
                  <button className="w-full px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors">
                    질문하기
                  </button>
                </Link>
              </div>

              {/* 전문가 소개 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">저희가 여러분을 돕습니다</h3>
                <div className="space-y-4">
                  {experts.map((expert, idx) => (
                    <Card
                      key={idx}
                      className="border border-gray-200 hover:shadow-lg transition-all"
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl flex-shrink-0">
                            {expert.image}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 mb-1">{expert.name}</h4>
                            <p className="text-xs text-gray-500 mb-2">{expert.organization}</p>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {expert.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <button className="w-full px-4 py-3 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors">
                    전문가 더보기 →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

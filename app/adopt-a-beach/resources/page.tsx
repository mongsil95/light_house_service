"use client";

import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Filter, MessageCircle, Search, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AdoptABeachResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["전체", "가이드", "입양절차", "공지", "활동사례", "FAQ"];

  const demoResources = [
    {
      id: 1,
      title: "반려해변이란? - 해변이 우리를 기다려요!",
      date: "2026-01-10",
      category: "가이드",
      views: 1234,
      comments: 15,
      likes: 42,
      author: "운영팀",
    },
    {
      id: 2,
      title: "2025년 반려해변 입양 기관 명단",
      date: "2025-01-08",
      category: "공지",
      views: 2341,
      comments: 28,
      likes: 89,
      author: "관리자",
    },
    {
      id: 3,
      title: "2025년 반려해변 운영 계획 안내",
      date: "2025-01-05",
      category: "공지",
      views: 3452,
      comments: 45,
      likes: 156,
      author: "운영팀",
    },
    {
      id: 4,
      title: "반려동물 동반 시설 상세 안내",
      date: "2025-01-03",
      category: "시설",
      views: 987,
      comments: 12,
      likes: 34,
      author: "운영팀",
    },
    {
      id: 5,
      title: "자주 묻는 질문 TOP 10",
      date: "2025-01-02",
      category: "FAQ",
      views: 5678,
      comments: 67,
      likes: 234,
      author: "고객지원팀",
    },
  ];

  const filteredResources = demoResources.filter(
    (resource) =>
      (selectedCategory === "전체" || resource.category === selectedCategory) &&
      resource.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <h1 className="text-3xl md:text-4xl text-gray-900 mb-3 font-[Cafe24_Ssurround]">
              반려해변 자료 게시판
            </h1>
            <p className="text-gray-600 font-[Cafe24_Ssurround]">
              반려해변 입양 및 관리 관련 공식 자료를 확인하세요
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar - Categories */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg text-gray-900 mb-4 font-[Cafe24_Ssurround] flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  카테고리
                </h2>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all font-[Cafe24_Ssurround] ${
                        selectedCategory === category
                          ? "bg-blue-50 text-blue-600 "
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {category}
                      <span className="float-right text-sm text-gray-400">
                        {category === "전체"
                          ? demoResources.length
                          : demoResources.filter((r) => r.category === category).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Search Bar */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[Cafe24_Ssurround]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Posts Grid */}
              <div className="space-y-4">
                {filteredResources.map((resource) => (
                  <Link key={resource.id} href={`/adopt-a-beach/resources/${resource.id}`}>
                    <Card className="hover:shadow-lg transition-all cursor-pointer border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full font-[Cafe24_Ssurround]">
                                {resource.category}
                              </span>
                              <span className="text-sm text-gray-500 font-[Cafe24_Ssurround]">
                                {resource.author}
                              </span>
                            </div>
                            <h3 className="text-lg text-gray-900 mb-2 font-[Cafe24_Ssurround] hover:text-blue-600 transition-colors">
                              {resource.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="font-[Cafe24_Ssurround]">{resource.date}</span>
                              <span className="flex items-center gap-1 font-[Cafe24_Ssurround]">
                                <Eye className="w-4 h-4" />
                                {resource.views.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1 font-[Cafe24_Ssurround]">
                                <MessageCircle className="w-4 h-4" />
                                {resource.comments}
                              </span>
                              <span className="flex items-center gap-1 font-[Cafe24_Ssurround]">
                                <ThumbsUp className="w-4 h-4" />
                                {resource.likes}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {filteredResources.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <p className="text-gray-500 font-[Cafe24_Ssurround]">검색 결과가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

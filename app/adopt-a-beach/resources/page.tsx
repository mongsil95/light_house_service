"use client";

import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Filter, MessageCircle, Search, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Resource {
  id: number;
  title: string;
  category: string;
  author: string;
  views: number;
  likes: number;
  published_at: string;
  created_at: string;
}

export default function AdoptABeachResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ["전체", "가이드", "공지", "FAQ", "시설"];

  // 데이터 로드
  useEffect(() => {
    fetchResources();
  }, [selectedCategory, searchTerm]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== "전체") params.append("category", selectedCategory);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/resources?${params.toString()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const result = await response.json();

      if (result.data) {
        setResources(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    } finally {
      setLoading(false);
    }
  };

  // 카테고리별 개수 계산
  const getCategoryCount = (category: string) => {
    if (category === "전체") return resources.length;
    return resources.filter((r) => r.category === category).length;
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

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
                        {getCategoryCount(category)}
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
              {loading ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <p className="text-gray-500 font-[Cafe24_Ssurround]">로딩 중...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {resources.map((resource) => (
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
                                <span className="font-[Cafe24_Ssurround]">
                                  {formatDate(resource.published_at || resource.created_at)}
                                </span>
                                <span className="flex items-center gap-1 font-[Cafe24_Ssurround]">
                                  <Eye className="w-4 h-4" />
                                  {(resource.views || 0).toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1 font-[Cafe24_Ssurround] hidden">
                                  <MessageCircle className="w-4 h-4" />0
                                </span>
                                <span className="flex items-center gap-1 font-[Cafe24_Ssurround] hidden">
                                  <ThumbsUp className="w-4 h-4" />
                                  {resource.likes || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}

              {!loading && resources.length === 0 && (
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

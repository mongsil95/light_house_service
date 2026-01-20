"use client";

import CategorySidebar from "@/components/CategorySidebar";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, MessageCircle, Search, ThumbsUp } from "lucide-react";
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

  // 반려해변 가이드 카테고리 구조
  const categories = [
    {
      label: "입양 안내",
      value: "입양안내",
      subItems: [
        { label: "전체", value: "입양안내" },
        { label: "입양 절차", value: "입양절차" },
        { label: "입양 혜택", value: "입양혜택" },
        { label: "참여 기관", value: "참여기관" },
      ],
    },
    {
      label: "활동 가이드",
      value: "활동가이드",
      subItems: [
        { label: "전체", value: "활동가이드" },
        { label: "정화 활동", value: "정화활동" },
        { label: "캠페인", value: "캠페인" },
        { label: "교육 프로그램", value: "교육프로그램" },
      ],
    },
    {
      label: "보고서/자료",
      value: "보고서자료",
      subItems: [
        { label: "전체", value: "보고서자료" },
        { label: "활동 보고서", value: "활동보고서" },
        { label: "데이터 리포트", value: "데이터리포트" },
        { label: "가이드북", value: "가이드북" },
      ],
    },
    {
      label: "공지사항",
      value: "공지",
      subItems: [
        { label: "전체", value: "공지" },
        { label: "일반 공지", value: "일반공지" },
        { label: "행사 안내", value: "행사안내" },
      ],
    },
  ];

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
              궁금했던 그 자료, 바로 찾아보세요
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 왼쪽 사이드바 */}
            <div className="lg:col-span-2">
              <CategorySidebar
                categories={categories}
                selectedCategory={selectedCategory}
                basePath="/adopt-a-beach/resources"
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-10">
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

"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Eye, MessageCircle, ThumbsUp, TrendingUp } from "lucide-react";

export default function HaebomCommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["전체", "후기", "질문", "정보공유", "사진"];

  const demoPosts = [
    {
      id: 1,
      title: "이번 주 정화 활동 참여 후기 - 너무 뿌듯했어요! 💚",
      author: "바다지킴이",
      date: "2025-01-11",
      comments: 24,
      views: 378,
      likes: 89,
      category: "후기",
      isHot: true,
    },
    {
      id: 2,
      title: "처음 참여했는데 정말 의미있는 시간이었습니다",
      author: "환경사랑",
      date: "2025-01-10",
      comments: 31,
      views: 456,
      likes: 112,
      category: "후기",
      isHot: true,
    },
    {
      id: 3,
      title: "다음 활동은 언제인가요? 꼭 참여하고 싶어요",
      author: "새내기",
      date: "2025-01-09",
      comments: 12,
      views: 189,
      likes: 34,
      category: "질문",
    },
    {
      id: 4,
      title: "오늘 수고하셨습니다! 다들 고생많으셨어요 👏",
      author: "리더",
      date: "2025-01-08",
      comments: 18,
      views: 298,
      likes: 67,
      category: "후기",
    },
    {
      id: 5,
      title: "해양 쓰레기 줍기 활동 노하우 공유합니다",
      author: "베테랑",
      date: "2025-01-07",
      comments: 45,
      views: 823,
      likes: 189,
      category: "정보공유",
      isHot: true,
    },
  ];

  const filteredPosts = demoPosts.filter(
    (post) =>
      (selectedCategory === "전체" || post.category === selectedCategory) &&
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl text-gray-900 mb-3 font-[Cafe24_Ssurround]">
                  해봄 자유 게시판
                </h1>
                <p className="text-gray-600 font-[Cafe24_Ssurround]">
                  해봄 활동 후기와 정보를 나눠보세요
                </p>
              </div>
              <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-[Cafe24_Ssurround] flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                글쓰기
              </button>
            </div>
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
                          ? demoPosts.length
                          : demoPosts.filter((p) => p.category === category).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content - 전체 글 */}
            <div className="flex-1 min-w-0">
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

              {/* All Posts Section */}
              <div className="mb-4">
                <h2 className="text-xl text-gray-900 mb-4 font-[Cafe24_Ssurround] flex items-center gap-2">
                  💬 전체 게시물
                </h2>
              </div>

              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="hover:shadow-lg transition-all cursor-pointer border-0 shadow-sm"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full font-[Cafe24_Ssurround]">
                              {post.category}
                            </span>
                            <span className="text-sm text-gray-600 font-[Cafe24_Ssurround]">
                              {post.author}
                            </span>
                          </div>
                          <h3 className="text-lg text-gray-900 mb-2 font-[Cafe24_Ssurround] hover:text-blue-600 transition-colors">
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="font-[Cafe24_Ssurround]">{post.date}</span>
                            <span className="flex items-center gap-1 font-[Cafe24_Ssurround]">
                              <Eye className="w-4 h-4" />
                              {post.views}
                            </span>
                            <span className="flex items-center gap-1 font-[Cafe24_Ssurround]">
                              <MessageCircle className="w-4 h-4" />
                              {post.comments}
                            </span>
                            <span className="flex items-center gap-1 font-[Cafe24_Ssurround]">
                              <ThumbsUp className="w-4 h-4" />
                              {post.likes}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <p className="text-gray-500 font-[Cafe24_Ssurround]">검색 결과가 없습니다.</p>
                </div>
              )}
            </div>

            {/* Right Sidebar - 인기 게시물 */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-lg text-gray-900 mb-4 font-[Cafe24_Ssurround] flex items-center gap-2">
                  🔥 지금 인기 있는 글
                </h2>
                <div className="space-y-3">
                  {demoPosts
                    .filter((post) => post.isHot)
                    .map((post) => (
                      <div
                        key={post.id}
                        className="p-4 bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-lg hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm text-gray-900 mb-2 font-[Cafe24_Ssurround] line-clamp-2 hover:text-blue-600 transition-colors">
                              {post.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full font-[Cafe24_Ssurround]">
                                {post.category}
                              </span>
                              <span className="font-[Cafe24_Ssurround]">{post.author}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                              <span className="flex items-center gap-1 font-[Cafe24_Ssurround]">
                                <Eye className="w-3 h-3" />
                                {post.views}
                              </span>
                              <span className="flex items-center gap-1 font-[Cafe24_Ssurround]">
                                <MessageCircle className="w-3 h-3" />
                                {post.comments}
                              </span>
                              <span className="flex items-center gap-1 font-[Cafe24_Ssurround]">
                                <ThumbsUp className="w-3 h-3" />
                                {post.likes}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

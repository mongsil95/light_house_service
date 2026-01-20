"use client";

import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { BookOpen, Calendar, Eye, MessageSquare, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Resource {
  id: number;
  title: string;
  content: string;
  category: string;
  views: number;
  created_at: string;
}

interface QnA {
  id: number;
  title: string;
  content: string;
  category: string;
  status: string;
  views: number;
  created_at: string;
  author_name: string;
}

export default function NewHome() {
  const [guides, setGuides] = useState<Resource[]>([]);
  const [qnas, setQnas] = useState<QnA[]>([]);
  const [loadingGuides, setLoadingGuides] = useState(true);
  const [loadingQnas, setLoadingQnas] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ guides: Resource[]; qnas: QnA[] }>({
    guides: [],
    qnas: [],
  });
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchGuides();
    fetchQnas();
  }, []);

  const fetchGuides = async () => {
    try {
      // 카테고리 구분 없이 랜덤으로 10개 가져오기
      const { data, error } = await supabase
        .from("resources")
        .select("id, title, content, category, views, created_at")
        .eq("status", "published")
        .limit(10);

      if (error) throw error;

      // 클라이언트에서 랜덤 정렬
      if (data) {
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setGuides(shuffled);
      }
    } catch (error) {
      console.error("가이드 로드 실패:", error);
    } finally {
      setLoadingGuides(false);
    }
  };

  const fetchQnas = async () => {
    try {
      const { data, error } = await supabase
        .from("qna")
        .select("id, title, content, category, status, views, created_at, author_name")
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      if (data) setQnas(data);
    } catch (error) {
      console.error("QnA 로드 실패:", error);
    } finally {
      setLoadingQnas(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
    > = {
      pending: { label: "대기중", variant: "secondary" },
      answered: { label: "답변완료", variant: "default" },
      closed: { label: "종료", variant: "outline" },
    };

    const statusInfo = statusMap[status] || { label: status, variant: "outline" };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const extractText = (html: string) => {
    // HTML 태그 제거
    let text = html.replace(/<[^>]*>/g, "");
    // 마크다운 문법 제거
    text = text.replace(/#{1,6}\s/g, ""); // 헤더 (#, ##, ###)
    text = text.replace(/\*\*([^*]+)\*\*/g, "$1"); // 굵게 (**text**)
    text = text.replace(/__([^_]+)__/g, "$1"); // 굵게 (__text__)
    text = text.replace(/\*([^*]+)\*/g, "$1"); // 기울임 (*text*)
    text = text.replace(/_([^_]+)_/g, "$1"); // 기울임 (_text_)
    text = text.replace(/~~([^~]+)~~/g, "$1"); // 취소선 (~~text~~)
    text = text.replace(/`([^`]+)`/g, "$1"); // 인라인 코드 (`code`)
    text = text.replace(/^\s*[-*+]\s/gm, ""); // 리스트 (-,*,+)
    text = text.replace(/^\s*\d+\.\s/gm, ""); // 숫자 리스트 (1. 2.)
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"); // 링크 [text](url)
    // 연속된 공백과 줄바꿈 정리
    return text.replace(/\s+/g, " ").trim();
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    try {
      const searchPattern = `%${searchQuery}%`;

      // 가이드 검색 - textSearch 또는 개별 필터 사용
      const { data: guideData, error: guideError } = await supabase
        .from("resources")
        .select("id, title, content, category, views, created_at")
        .eq("status", "published")
        .or(`title.ilike.${searchPattern},content.ilike.${searchPattern}`)
        .limit(5);

      // QnA 검색
      const { data: qnaData, error: qnaError } = await supabase
        .from("qna")
        .select("id, title, content, category, status, views, created_at, author_name")
        .eq("is_public", true)
        .or(`title.ilike.${searchPattern},content.ilike.${searchPattern}`)
        .limit(5);

      console.log("검색 결과:", { guideData, qnaData, guideError, qnaError });

      if (!guideError && !qnaError) {
        setSearchResults({
          guides: guideData || [],
          qnas: qnaData || [],
        });

        // 검색 기록 저장
        await supabase.from("search_history").insert([
          {
            query: searchQuery,
            result_count: (guideData?.length || 0) + (qnaData?.length || 0),
          },
        ]);
      } else {
        console.error("검색 오류:", { guideError, qnaError });
      }
    } catch (error) {
      console.error("검색 실패:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults({ guides: [], qnas: [] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white font-['Pretendard']">
      <Navigation />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* 검색 섹션 */}
          <section className="mt-16">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  반려해변에 대해 찾고 계신 내용이 있나요?
                </h2>
              </div>

              <form onSubmit={handleSearch} className="relative mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="키워드를 입력하세요"
                    autoComplete="off"
                    className="pl-12 pr-24 py-6 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-24 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSearching || !searchQuery.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isSearching ? "검색중..." : "검색"}
                  </button>
                </div>
              </form>

              {/* 검색 결과 */}
              {(searchResults.guides.length > 0 || searchResults.qnas.length > 0) && (
                <div className="space-y-8">
                  {/* 가이드 검색 결과 */}
                  {searchResults.guides.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        반려해변 가이드 ({searchResults.guides.length}개)
                      </h3>
                      <div className="space-y-3">
                        {searchResults.guides.map((guide) => (
                          <Link key={guide.id} href={`/adopt-a-beach/resources/${guide.id}`}>
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0 overflow-hidden">
                                    <CardTitle className="text-lg mb-2 hover:text-blue-600 truncate">
                                      {guide.title}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2">
                                      {extractText(guide.content)}
                                    </CardDescription>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                                  <Badge variant="outline">{guide.category}</Badge>
                                  <div className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    {guide.views}
                                  </div>
                                </div>
                              </CardHeader>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* QnA 검색 결과 */}
                  {searchResults.qnas.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-green-600" />
                        등대지기 Q&A ({searchResults.qnas.length}개)
                      </h3>
                      <div className="space-y-3">
                        {searchResults.qnas.map((qna) => (
                          <Link key={qna.id} href={`/adopt-a-beach/expertsqna/${qna.id}`}>
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                              <CardHeader className="pb-3">
                                <div className="flex items-center gap-2 mb-2">
                                  {getStatusBadge(qna.status)}
                                  {qna.category && <Badge variant="outline">{qna.category}</Badge>}
                                </div>
                                <CardTitle className="text-lg mb-2 hover:text-green-600 truncate">
                                  {qna.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-2">
                                  {extractText(qna.content)}
                                </CardDescription>
                                <div className="flex items-center gap-3 text-sm text-gray-500 mt-3">
                                  <span className="shrink-0">{formatDate(qna.created_at)}</span>
                                  <div className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    {qna.views}
                                  </div>
                                </div>
                              </CardHeader>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 검색 결과 없음 */}
              {searchQuery &&
                !isSearching &&
                searchResults.guides.length === 0 &&
                searchResults.qnas.length === 0 && (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-gray-500 mb-4">
                        <strong>'{searchQuery}'</strong>에 대한 검색 결과가 없습니다
                      </p>
                      <p className="text-gray-400 text-sm">다른 키워드로 검색해보세요</p>
                    </CardContent>
                  </Card>
                )}
            </div>
          </section>

          {/* 2열 그리드 레이아웃 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
            {/* 반려해변 가이드 섹션 */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">반려해변 가이드</h2>
                </div>
                <Link
                  href="/adopt-a-beach/resources"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  전체보기 →
                </Link>
              </div>

              {loadingGuides ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">로딩중...</p>
                </div>
              ) : guides.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-500">등록된 가이드가 없습니다.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {guides.map((guide) => (
                    <Link key={guide.id} href={`/adopt-a-beach/resources/${guide.id}`}>
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0 overflow-hidden">
                              <CardTitle className="text-lg mb-2 hover:text-blue-600 truncate">
                                {guide.title}
                              </CardTitle>
                              <CardDescription className="line-clamp-1 overflow-hidden text-ellipsis">
                                {extractText(guide.content)}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(guide.created_at)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {guide.views}
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* 등대지기 Q&A 섹션 */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-8 h-8 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">등대지기에게 묻기</h2>
                </div>
                <Link
                  href="/adopt-a-beach/expertsqna"
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  전체보기 →
                </Link>
              </div>

              {loadingQnas ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">로딩중...</p>
                </div>
              ) : qnas.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-500">등록된 질문이 없습니다.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {qnas.map((qna) => (
                    <Link key={qna.id} href={`/adopt-a-beach/expertsqna/${qna.id}`}>
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(qna.status)}
                            {qna.category && (
                              <Badge variant="outline" className="truncate max-w-[100px]">
                                {qna.category}
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg mb-2 hover:text-green-600 truncate">
                            {qna.title}
                          </CardTitle>
                          <CardDescription className="truncate">
                            {extractText(qna.content)}
                          </CardDescription>
                          <div className="flex items-center gap-3 text-sm text-gray-500 mt-3">
                            <span className="shrink-0">{formatDate(qna.created_at)}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <Eye className="w-4 h-4" />
                              {qna.views}
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

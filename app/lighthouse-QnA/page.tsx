"use client";

import CategorySidebar from "@/components/CategorySidebar";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { supabase } from "@/lib/supabase";
import { Calendar, ChevronDown, Eye, HelpCircle, Share2, ThumbsUp, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function QnAContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortOrder, setSortOrder] = useState("최근 답변순");
  const [searchQuery, setSearchQuery] = useState("");

  const [qaList, setQaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQa, setSelectedQa] = useState<any | null>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [liked, setLiked] = useState(false);
  const [qaId, setQaId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Q&A 카테고리 구조
  const qnaCategories = [
    {
      label: "입양관련",
      value: "입양관련",
      subItems: [
        { label: "전체", value: "입양관련" },
        { label: "입양절차", value: "입양절차" },
        { label: "신청방법", value: "신청방법" },
        { label: "참여조건", value: "참여조건" },
        { label: "기타", value: "입양기타" },
      ],
    },
    {
      label: "활동운영",
      value: "활동운영",
      subItems: [
        { label: "전체", value: "활동운영" },
        { label: "활동 매뉴얼", value: "활동매뉴얼" },
        { label: "정화 활동", value: "정화활동" },
        { label: "캠페인", value: "캠페인" },
        { label: "사례공유", value: "사례공유" },
        { label: "보고서", value: "보고서" },
      ],
    },
    {
      label: "기부금",
      value: "기부금",
      subItems: [
        { label: "전체", value: "기부금" },
        { label: "기금납부", value: "기금납부" },
        { label: "혜택", value: "혜택" },
      ],
    },
    {
      label: "기타",
      value: "기타",
      subItems: [
        { label: "전체", value: "기타" },
        { label: "일반문의", value: "일반문의" },
        { label: "공지사항", value: "공지사항" },
      ],
    },
  ];

  // Supabase에서 Q&A 데이터 가져오기
  useEffect(() => {
    async function fetchQnA() {
      try {
        setLoading(true);

        // Q&A 데이터 가져오기
        const { data: qnaData, error: qnaError } = await supabase
          .from("qna")
          .select("*")
          .eq("is_public", true)
          .eq("status", "answered")
          .order("created_at", { ascending: false });

        console.log("QnA Data:", qnaData, "Error:", qnaError);

        // Resources 데이터 가져오기 (thumbnail_url 포함)
        const { data: resourcesData, error: resourcesError } = await supabase
          .from("resources")
          .select("*")
          .order("created_at", { ascending: false });

        console.log("Resources Data:", resourcesData, "Error:", resourcesError);

        if (qnaError) {
          console.error("QnA Error:", qnaError);
          throw qnaError;
        }

        if (resourcesError) {
          console.error("Resources Error:", resourcesError);
        }

        const allItems = [];

        // Q&A 데이터 포맷팅
        if (qnaData) {
          const formattedQAs = qnaData.map((qa) => ({
            id: qa.id,
            type: "qna", // 타입 추가
            category: qa.category || "운영·기타",
            question: qa.title,
            views: qa.views || 0,
            likes: 0,
            date: new Date(qa.created_at)
              .toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
              .replace(/\. /g, ".")
              .replace(/\.$/, ""),
            expert: "익명",
            answered: qa.status === "answered",
            content: qa.content,
          }));
          allItems.push(...formattedQAs);
          console.log("Formatted QAs:", formattedQAs.length);
        }

        // Resources 데이터 포맷팅
        if (resourcesData && !resourcesError) {
          const formattedResources = resourcesData.map((resource) => ({
            id: `resource-${resource.id}`, // ID 충돌 방지
            type: "resource", // 타입 추가
            category: resource.category || "기타",
            question: resource.title,
            views: resource.views || 0,
            likes: 0,
            date: new Date(resource.created_at)
              .toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
              .replace(/\. /g, ".")
              .replace(/\.$/, ""),
            expert: "관리자",
            answered: true,
            content: resource.content,
            thumbnail_url: resource.thumbnail_url, // 썸네일 URL 추가
          }));
          allItems.push(...formattedResources);
          console.log("Formatted Resources:", formattedResources.length);
        }

        console.log("Total items:", allItems.length);

        // 날짜순으로 정렬
        allItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setQaList(allItems);
      } catch (error) {
        console.error("Error fetching Q&A:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQnA();
  }, []);

  // URL 파라미터 변경 감지
  useEffect(() => {
    const id = searchParams.get("id");
    const category = searchParams.get("category");

    setQaId(id);

    if (category) {
      setSelectedCategory(category);
    } else if (!id) {
      setSelectedCategory("전체");
    }
  }, [searchParams]);

  // URL 파라미터로 선택된 QA 동기화
  useEffect(() => {
    if (qaId && qaList.length > 0) {
      const qa = qaList.find((q) => q.id === qaId);
      setSelectedQa(qa || null);

      // 답변 가져오기 및 조회수 증가
      if (qa) {
        fetchAnswers(qaId);
        incrementViews(qaId);
      }
    } else {
      setSelectedQa(null);
      setAnswers([]);
    }
  }, [qaId, qaList]);

  // 답변 가져오기
  const fetchAnswers = async (qnaId: string) => {
    try {
      const { data, error } = await supabase
        .from("qna_answers")
        .select("*")
        .eq("qna_id", qnaId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setAnswers(data || []);
    } catch (error) {
      console.error("Error fetching answers:", error);
    }
  };

  // 조회수 증가
  const incrementViews = async (qnaId: string) => {
    try {
      const qa = qaList.find((q) => q.id === qnaId);
      if (qa) {
        await supabase
          .from("qna")
          .update({ views: (qa.views || 0) + 1 })
          .eq("id", qnaId);
      }
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  // 공유하기
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("링크가 복사되었습니다! 다른 사람들과 공유해보세요.");
      })
      .catch(() => {
        alert("링크 복사에 실패했습니다. 다시 시도해주세요.");
      });
  };

  // 카테고리
  const categories = [
    { id: "전체", label: "전체", icon: "🌐" },
    { id: "입양절차", label: "입양절차", icon: "🏖️" },
    { id: "활동계획", label: "활동계획", icon: "♻️" },
    { id: "기금납부", label: "기금납부", icon: "🌱" },
    { id: "기타", label: "기타", icon: "📋" },
  ];

  // 검색어 확장 함수
  const expandSearchQuery = (query: string): string[][] => {
    const trimmedQuery = query.trim();
    
    // 띄어쓰기가 있으면 단어별로 분리, 없으면 전체를 하나의 단어로
    const words = trimmedQuery.includes(' ') 
      ? trimmedQuery.split(/\s+/) 
      : [trimmedQuery];
    
    // 유사어/동의어 맵핑
    const synonyms: { [key: string]: string[] } = {
      기부금: ["기부금", "기금", "후원금", "후원", "기부"],
      기금: ["기금", "기부금", "후원금", "후원", "기부"],
      후원: ["후원", "기부", "기부금", "기금", "후원금"],
      입양: ["입양", "반려", "채택"],
      조건: ["조건", "요건", "자격"],
      절차: ["절차", "과정", "프로세스"],
      활동: ["활동", "운영", "실천", "참여"],
      신청: ["신청", "등록", "가입", "접수"],
    };

    // 각 단어별로 확장된 검색어 배열 생성
    return words.map((word) => {
      const lowerWord = word.toLowerCase();
      const expandedWords = [lowerWord];

      // 유사어 추가 - 정확히 일치하거나 포함하는 경우
      Object.keys(synonyms).forEach((key) => {
        if (lowerWord === key.toLowerCase() || lowerWord.includes(key.toLowerCase())) {
          synonyms[key].forEach((syn) => {
            if (!expandedWords.includes(syn.toLowerCase())) {
              expandedWords.push(syn.toLowerCase());
            }
          });
        }
      });

      // 연도 표현 확장
      const yearMatch = word.match(/(\d{2,4})년?/);
      if (yearMatch) {
        const year = yearMatch[1];
        if (year.length === 2) {
          expandedWords.push(`20${year}년`);
          expandedWords.push(`20${year}`);
        } else if (year.length === 4) {
          expandedWords.push(`${year.substring(2)}년`);
          expandedWords.push(year);
        }
      }

      return expandedWords;
    });
  };

  const filteredQAs = qaList.filter((qa) => {
    const matchesCategory = selectedCategory === "전체" || qa.category === selectedCategory;

    if (searchQuery === "") {
      return matchesCategory;
    }

    // 검색 대상 텍스트
    const searchableText = `${qa.question} ${qa.content}`.toLowerCase();
    
    // 각 단어별로 확장된 검색어 배열
    const expandedWordGroups = expandSearchQuery(searchQuery);
    
    // 모든 단어 그룹에서 최소 하나씩은 매칭되어야 함 (AND 조건)
    const matchesSearch = expandedWordGroups.every((wordGroup) => 
      wordGroup.some((word) => searchableText.includes(word))
    );

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

  // 인기 질문 TOP 5 (질문만 필터링, 조회수 기준으로 정렬)
  const popularQuestions = [...qaList]
    .filter((qa) => qa.type === "qna")
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 왼쪽 사이드바 - 데스크톱만 표시 */}
            <div className="hidden lg:block lg:col-span-2">
              <CategorySidebar
                categories={qnaCategories}
                selectedCategory={selectedCategory}
                basePath="/lighthouse-QnA"
              />
            </div>

            {/* 메인 콘텐츠 */}
            <div className="lg:col-span-7">
              {/* 모바일 카테고리 드롭다운 */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{selectedCategory}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      mobileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {mobileMenuOpen && (
                  <div className="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                    <Link
                      href="/lighthouse-QnA"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 ${
                        selectedCategory === "전체"
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      전체
                    </Link>
                    {qnaCategories.map((category) => (
                      <div key={category.value}>
                        <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                          {category.label}
                        </div>
                        {category.subItems.map((subItem) => (
                          <Link
                            key={subItem.value}
                            href={`/lighthouse-QnA?category=${subItem.value}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block px-6 py-2.5 ${
                              selectedCategory === subItem.value
                                ? "bg-blue-50 text-blue-600 font-semibold"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 검색 및 정렬 - 상세보기일 때 숨김 */}
              {!selectedQa && (
                <>
                  <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                      <div className="flex-1 w-full">
                        <input
                          type="text"
                          placeholder="질문 검색..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option>최근 답변순</option>
                        <option>인기순</option>
                      </select>
                    </div>
                  </div>
                  {/* 인기 질문: 메인에서 오른쪽 사이드바로 이동 */}

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
                </>
              )}

              {/* Q&A 리스트 */}
              <div className="space-y-4">
                {selectedQa ? (
                  <>
                    {/* Question Card */}
                    <Card className="mb-6 border border-gray-200">
                      <CardContent className="p-8">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Badge
                              className={`${
                                selectedQa.type === "resource"
                                  ? "bg-green-50 text-green-700 hover:bg-green-100"
                                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                              }`}
                            >
                              {selectedQa.type === "resource" ? "정보" : "질문"}
                            </Badge>
                            <Badge className="bg-gray-50 text-gray-700 hover:bg-gray-100">
                              {selectedQa.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{selectedQa.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{selectedQa.date}</span>
                            </div>
                          </div>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-6">
                          {selectedQa.question}
                        </h1>

                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                          <div
                            className="prose prose-sm sm:prose lg:prose-lg max-w-none prose-p:my-2 prose-p:leading-relaxed whitespace-pre-wrap break-words"
                            style={{
                              fontFamily:
                                "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                            }}
                            dangerouslySetInnerHTML={{ __html: selectedQa.content }}
                          />
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>익명</span>
                          </div>
                          <Badge variant={selectedQa.answered ? "default" : "secondary"}>
                            {selectedQa.answered ? "답변완료" : "답변대기"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Expert Answers */}
                    {answers.length > 0 &&
                      answers.map((answer, index) => (
                        <Card
                          key={answer.id}
                          className="mb-6 border-2 border-blue-100 bg-gradient-to-br from-blue-50/50 to-white"
                        >
                          <CardContent className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-bold text-gray-900">
                                    {answer.answerer_name}
                                  </h3>
                                  <Badge variant="secondary" className="text-xs">
                                    등대지기
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(answer.created_at)
                                    .toLocaleDateString("ko-KR", {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                    })
                                    .replace(/\. /g, ".")
                                    .replace(/\.$/, "")}{" "}
                                  답변
                                </p>
                              </div>
                            </div>

                            <div
                              className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-700 prose-p:my-2 prose-p:leading-relaxed whitespace-pre-wrap break-words"
                              style={{
                                fontFamily:
                                  "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                              }}
                              dangerouslySetInnerHTML={{ __html: answer.content }}
                            />

                            {index === 0 && (
                              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                                <button
                                  onClick={() => setLiked(!liked)}
                                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    liked
                                      ? "bg-blue-500 text-white"
                                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                  }`}
                                >
                                  <ThumbsUp className="w-4 h-4" />
                                  도움이 됐어요
                                </button>
                                <button
                                  onClick={handleShare}
                                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <Share2 className="w-4 h-4" />
                                  공유하기
                                </button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                  </>
                ) : paginatedQAs.length === 0 ? (
                  <Card className="border border-gray-200">
                    <CardContent className="p-12 text-center">
                      <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-gray-900 mb-2">검색 결과가 없습니다</h3>
                      <p className="text-gray-600 mb-6">다른 검색어나 카테고리를 시도해보세요</p>
                      <Link href="/lighthouse-QnA/ask">
                        <button className="px-6 py-3 bg-blue-300 text-white rounded-lg hover:bg-blue-400 transition-colors font-semibold">
                          새 질문하기
                        </button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  paginatedQAs.map((qa) => (
                    <div
                      key={qa.id}
                      onClick={() => {
                        router.push(`/lighthouse-QnA?id=${qa.id}`);
                        setQaId(qa.id);
                      }}
                    >
                      <Card className="hover:shadow-lg transition-all border border-gray-200 cursor-pointer group">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  variant="outline"
                                  className={`text-xs font-semibold ${
                                    qa.type === "resource"
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : "bg-blue-50 text-blue-700 border-blue-200"
                                  }`}
                                >
                                  {qa.type === "resource" ? "정보" : "질문"}
                                </Badge>
                                <Badge variant="outline" className="text-xs font-semibold">
                                  {qa.category}
                                </Badge>
                              </div>
                              <h3
                                className="font-bold text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-1"
                                style={{
                                  fontFamily:
                                    "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                                }}
                              >
                                {extractText(qa.question)}
                              </h3>
                              <p
                                className="text-sm text-gray-600 mb-2 line-clamp-1"
                                style={{
                                  fontFamily:
                                    "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                                }}
                              >
                                {extractText(qa.content)}
                              </p>
                              <div className="flex items-center text-xs text-gray-400">
                                <div className="flex items-center gap-3">
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    조회 {qa.views}
                                  </span>
                                  <span>· {qa.date}</span>
                                </div>
                              </div>
                            </div>
                            {/* 정보 타입일 때만 사진 영역 표시 (오른쪽) */}
                            {qa.type === "resource" && (
                              <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                                {qa.thumbnail_url ? (
                                  <Image
                                    src={qa.thumbnail_url}
                                    alt={extractText(qa.question)}
                                    width={96}
                                    height={96}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center text-gray-400 text-xs">
                                    No Image
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
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

            {/* 오른쪽 사이드바 */}
            <div className="lg:col-span-3 space-y-8">
              {/* 인기 질문 (사이드바) */}
              <div className="sticky top-24 space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">인기 질문</h4>
                  <div className="space-y-2">
                    {popularQuestions.map((qa, idx) => (
                      <Link
                        key={qa.id}
                        href={`/lighthouse-QnA?id=${qa.id}`}
                        className="flex items-center gap-3 p-2 rounded hover:bg-gray-50"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-semibold text-xs">
                          {idx + 1}
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-1 flex-1">
                          {extractText(qa.question)}
                        </p>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {qa.views}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* 질문하기 배너 (작고 무채색) */}
                <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                  <div className="mb-3">
                    <HelpCircle className="w-10 h-10 mx-auto mb-2 text-gray-500" />
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      찾으시는 질문이 없으신가요?
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">등대지기에게 질문해보세요</p>
                  </div>
                  <Link href="/lighthouse-QnA/ask">
                    <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition">
                      질문하기
                    </button>
                  </Link>
                </div>
              </div>

              {/* 전문가 소개 섹션 제거 */}
            </div>
          </div>
        </div>
      </main>

      {/* 전문가 모달 및 관련 UI 제거됨 */}
    </div>
  );
}

export default function LighthouseQnAPage() {
  return (
    <Suspense fallback={
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
    }>
      <QnAContent />
    </Suspense>
  );
}

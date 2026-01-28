"use client";

import CategorySidebar from "@/components/CategorySidebar";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { supabase } from "@/lib/supabase";
import { Copy, Eye, Filter, HelpCircle, Send, Share2, ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

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
  const [resourceFiles, setResourceFiles] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [liked, setLiked] = useState(false);
  const [qaId, setQaId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const viewedQaIds = useRef<Set<string>>(new Set());

  // 배너 모달 관련 상태
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [bannerFormData, setBannerFormData] = useState({
    organization: "",
    email: "",
  });
  const [isSubmittingBanner, setIsSubmittingBanner] = useState(false);

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
        { label: "활동 지원", value: "활동지원" },
      ],
    },
    {
      label: "기부금",
      value: "기부금",
      subItems: [
        { label: "전체", value: "기부금" },
        { label: "기금납부", value: "기금납부" },
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

        // Resources 데이터 가져오기 (thumbnail_url 포함)
        const { data: resourcesData, error: resourcesError } = await supabase
          .from("resources")
          .select("*")
          .order("created_at", { ascending: false });

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
            subtitle: extractText(qa.content).slice(0, 160),
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
            created_at_raw: qa.created_at,
            is_recommended: false,
          }));
          allItems.push(...formattedQAs);
        }

        // Resources 데이터 포맷팅
        if (resourcesData && !resourcesError) {
          const formattedResources = resourcesData.map((resource) => ({
            id: `resource-${resource.id}`, // ID 충돌 방지
            type: "resource", // 타입 추가
            category: resource.category || "기타",
            question: resource.title,
            subtitle: resource.subtitle || "",
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
            created_at_raw: resource.created_at,
            thumbnail_url: resource.thumbnail_url, // 썸네일 URL 추가
            author: resource.author || "운영팀",
            is_recommended: !!resource.is_recommended,
          }));
          allItems.push(...formattedResources);
        }

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
    const id = searchParams?.get("id") ?? null;
    const category = searchParams?.get("category");

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
      const qa = qaList.find((q) => String(q.id) === String(qaId));
      setSelectedQa(qa || null);

      // 답변 가져오기 및 조회수 증가 (한 번만)
      if (qa && !viewedQaIds.current.has(qaId)) {
        // qna 타입일 때만 답변을 가져오고, resource 타입은 리소스 파일만 별도 로드
        if (qa.type === "qna") {
          fetchAnswers(qaId);
        } else if (qa.type === "resource") {
          const resourceId = String(qaId).replace("resource-", "");
          fetchResourceFiles(resourceId);
        }

        incrementViews(qaId);
        viewedQaIds.current.add(qaId);
      } else if (qa) {
        // 이미 조회수를 증가시킨 경우
        if (qa.type === "qna") {
          fetchAnswers(qaId);
        } else if (qa.type === "resource") {
          const resourceId = String(qaId).replace("resource-", "");
          fetchResourceFiles(resourceId);
        }
      }
    } else {
      setSelectedQa(null);
      setAnswers([]);
    }
  }, [qaId, qaList]);

  // 추천 항목 생성 (선택된 게시물 변경 시)
  useEffect(() => {
    if (!selectedQa) {
      setRecommendations([]);
      return;
    }

    const pool = qaList.filter(
      (q) => q.type === selectedQa.type && String(q.id) !== String(selectedQa.id)
    );
    // 우선 추천 플래그가 있는 항목을 선택, 없으면 전체 pool에서 랜덤
    const recommendedPool = pool.filter((q) => !!q.is_recommended);
    const candidates = recommendedPool.length ? recommendedPool : pool;
    // 간단한 셔플
    const shuffled = candidates.sort(() => Math.random() - 0.5);
    setRecommendations(shuffled.slice(0, 3));
  }, [selectedQa, qaList]);

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

  const fetchResourceFiles = async (resourceId: string) => {
    try {
      const res = await fetch(`/api/resources/${resourceId}`);
      if (!res.ok) throw new Error("Failed to fetch resource files");
      const json = await res.json();
      setResourceFiles(json.data?.attachments || []);
    } catch (err) {
      console.error("fetchResourceFiles error:", err);
      setResourceFiles([]);
    }
  };

  // 조회수 증가
  const incrementViews = async (qnaId: string) => {
    try {
      const qa = qaList.find((q) => String(q.id) === String(qnaId));
      if (!qa) return;

      const newViews = (qa.views || 0) + 1;

      // Resource 타입인 경우
      if (qa.type === "resource") {
        // "resource-5" 형식에서 숫자 ID 추출
        const resourceId = qnaId.replace("resource-", "");
        const { error } = await supabase
          .from("resources")
          .update({ views: newViews })
          .eq("id", resourceId);

        if (error) {
          console.error("Error incrementing resource views:", error);
          return;
        }
      }
      // QnA 타입인 경우
      else if (qa.type === "qna") {
        const { error } = await supabase.from("qna").update({ views: newViews }).eq("id", qnaId);

        if (error) {
          console.error("Error incrementing qna views:", error);
          return;
        }
      }

      // 로컬 상태 업데이트하여 UI에 즉시 반영
      setQaList((prevList) =>
        prevList.map((q) => (String(q.id) === String(qnaId) ? { ...q, views: newViews } : q))
      );

      // 선택된 게시물도 업데이트
      if (selectedQa && String(selectedQa.id) === String(qnaId)) {
        setSelectedQa({ ...selectedQa, views: newViews });
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
        alert("링크가 복사되었어요! 다른 사람들과 공유해보세요.");
      })
      .catch(() => {
        alert("앗, 복사에 실패했어요. 다시 한번 시도해주시겠어요?");
      });
  };

  // 상세뷰 전용: 현재 URL 복사
  const copyCurrentUrl = async () => {
    try {
      // 우선, 선택된 게시물의 본문을 복사한다. 제목 + 본문 텍스트 형태.
      if (selectedQa && selectedQa.content) {
        const title = selectedQa.question || "";
        const bodyText = extractText(String(selectedQa.content));
        const payload = `${title}\n\n${bodyText}`.trim();
        await navigator.clipboard.writeText(payload);
        alert("본문 내용이 복사되었습니다.");
        return;
      }

      // 선택된 게시물이 없으면 URL을 복사
      await navigator.clipboard.writeText(window.location.href);
      alert("링크가 복사되었습니다.");
    } catch (e) {
      console.error(e);
      alert("복사에 실패했습니다.");
    }
  };

  const shareCurrentUrl = async () => {
    const url = window.location.href;
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({ title: selectedQa?.question || "", url });
      } catch (e) {
        // 사용자가 취소하거나 에러
      }
    } else {
      await copyCurrentUrl();
      alert("공유 API를 사용할 수 없어 링크를 복사했습니다.");
    }
  };

  // 배너 폼 제출
  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bannerFormData.organization.trim() || !bannerFormData.email.trim()) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    try {
      setIsSubmittingBanner(true);

      const response = await fetch("/api/admin/banner-inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organization: bannerFormData.organization,
          email: bannerFormData.email,
        }),
      });

      if (!response.ok) {
        throw new Error("제출 실패");
      }

      alert("이메일로 입양가이드를 보내드렸어요!\n감사합니다.");
      setIsBannerModalOpen(false);
      setBannerFormData({ organization: "", email: "" });
    } catch (error) {
      console.error("Error submitting banner inquiry:", error);
      alert("앗, 메일 발송에 문제가 생겼어요. 다시 한번 시도해주시겠어요?");
    } finally {
      setIsSubmittingBanner(false);
    }
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
    const words = trimmedQuery.includes(" ") ? trimmedQuery.split(/\s+/) : [trimmedQuery];

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
    let matchesCategory = false;

    if (selectedCategory === "전체") {
      matchesCategory = true;
    } else {
      // 정확히 일치하는 카테고리
      if (qa.category === selectedCategory) {
        matchesCategory = true;
      } else {
        // 상위 카테고리 선택 시 하위 카테고리도 포함
        const parentCategory = qnaCategories.find((cat) => cat.value === selectedCategory);
        if (parentCategory) {
          // 해당 상위 카테고리의 하위 항목 중 하나와 일치하는지 확인
          matchesCategory = parentCategory.subItems.some(
            (subItem) => subItem.value === qa.category
          );
        }
      }
    }

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

  // 메인 상단용 추천 리스트: 관리자에서 설정한 is_recommended 우선
  const topRecommended = qaList.filter((q) => q.type === "resource" && !!q.is_recommended);
  const topRecommendationList = topRecommended.length
    ? topRecommended.slice(0, 3)
    : sortedQAs.slice(0, 3);

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
                <p className="text-gray-600">잠시만 기다려주세요</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 데스크톱에서만 Navigation 표시 */}
      <div className="hidden md:block">
        <Navigation />
      </div>

      {/* 모바일 전용 헤더 */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-50 h-16 border-b border-gray-200">
        <div className="flex items-center justify-between h-full px-4">
          <Link href="/">
            <Image
              src="/images/adopt-a-beach.png"
              alt="반려해변 로고"
              width={80}
              height={26}
              className="object-contain"
            />
          </Link>
          <Link href="https://caresea.kr">
            <button className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs font-bold text-blue-600 hover:bg-gray-50 transition-colors">
              반려해변 홈
            </button>
          </Link>
        </div>
      </div>

      <main className="pt-24 pb-16 md:pt-24">
        <div className="max-w-7xl mx-auto px-0 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* 왼쪽 사이드바 - 데스크톱만 표시 */}
            <div className="hidden md:block md:col-span-2">
              <CategorySidebar
                categories={qnaCategories}
                selectedCategory={selectedCategory}
                basePath="/lighthouse-QnA"
              />
            </div>

            {/* 메인 콘텐츠 */}
            <div className="md:col-span-7">
              {/* 검색 및 정렬 - 상세보기일 때 숨김 */}
              {!selectedQa && (
                <>
                  {/* 검색창과 정렬 버튼을 한 줄에 배치 */}
                  <div className="mb-6 px-4 md:px-0">
                    <div className="flex items-center gap-3">
                      {/* 모바일: 검색창 + 필터 아이콘 */}
                      <div className="flex items-center gap-2 flex-1 md:hidden">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            placeholder="질문 검색"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-400 rounded-[5px] focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
                          />
                        </div>
                        <button
                          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                          className="flex-shrink-0 w-7 h-7 flex items-center justify-center border border-gray-400 rounded"
                          aria-label="필터"
                        >
                          <Filter className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>

                      {/* 데스크톱: 검색창 + 정렬 버튼 */}
                      <div className="hidden md:flex flex-1 bg-white rounded-lg shadow-sm p-4">
                        <input
                          type="text"
                          placeholder="질문 검색..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="hidden md:flex items-center gap-2">
                        <button
                          onClick={() => setSortOrder("최근 답변순")}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                            sortOrder === "최근 답변순"
                              ? "bg-blue-50 text-blue-600"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          최신순
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

                    {/* 모바일 필터 메뉴 (검색바 아래) */}
                    {mobileMenuOpen && (
                      <div className="md:hidden mt-2 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
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

                  {/* 등대지기가 추천하는 글 3가지 */}
                  <div className="mb-6 px-4 md:px-0">
                    <p
                      className="text-base font-bold text-black py-5"
                      style={{ fontFamily: "Cafe24_Ssurround, sans-serif" }}
                    >
                      사무국이 추천하는 글 3가지
                    </p>
                    <div className="space-y-3 pb-4">
                      {topRecommendationList.map((qa) => (
                        <Link key={qa.id} href={`/lighthouse-QnA?id=${qa.id}`} className="block">
                          <div className="bg-white border border-[#cecece] rounded-[15px] px-4 py-3 hover:shadow-sm transition-shadow">
                            <div className="flex items-center gap-3 min-w-0">
                              <Badge
                                className="bg-[#f0fdf4] text-[#15803d] border-[#c1f8d4] border hover:bg-[#f0fdf4] text-xs font-bold flex-shrink-0"
                                style={{ fontFamily: "Cafe24_Ssurround, sans-serif" }}
                              >
                                {qa.type === "resource" ? "추천" : "질문"}
                              </Badge>
                              <p
                                className="text-[17px] font-bold text-black flex-1 truncate"
                                style={{ fontFamily: "Pretendard, sans-serif" }}
                              >
                                {extractText(qa.question)}
                              </p>
                              <p
                                className="text-[13px] text-[#9ca3af]"
                                style={{ fontFamily: "Cafe24_Ssurround, sans-serif" }}
                              >
                                🖋️ {qa.type === "resource" ? qa.author || "운영팀" : "Editor.K"}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Q&A 리스트 */}
              <div className="bg-white px-4 md:px-0">
                {selectedQa ? (
                  <>
                    {/* Question Card */}
                    <Card className="mb-6 border-0 md:border md:border-gray-200">
                      <CardContent className="px-3 py-4 md:p-8">
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
                          <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500">
                            <div className="text-xs md:text-sm text-gray-500">
                              {typeof selectedQa.views === "number" && selectedQa.views > 0
                                ? `${selectedQa.views}명이 확인했어요`
                                : `00명이 확인했어요`}
                            </div>
                            <div className="text-xs md:text-sm text-gray-500">
                              {(() => {
                                const raw = (selectedQa as any).created_at_raw || selectedQa.date;
                                const d = new Date(raw);
                                if (isNaN(d.getTime())) return selectedQa.date || "";
                                const yy = String(d.getFullYear()).slice(2);
                                const mm = d.getMonth() + 1;
                                const dd = d.getDate();
                                const diffDays = Math.floor(
                                  (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24)
                                );
                                const rel = `(${diffDays}일전)`;
                                return `${yy}년 ${mm}월 ${dd}일 ${rel}`;
                              })()}
                            </div>
                          </div>
                        </div>

                        <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-6">
                          {selectedQa.question}
                        </h1>

                        {selectedQa.type === "resource" && selectedQa.author && (
                          <>
                            <div className="w-full border-t border-gray-200 mb-4" />
                            <div className="flex items-center justify-between mb-4">
                              <p className="text-sm text-gray-600">작성자: {selectedQa.author}</p>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={copyCurrentUrl}
                                  className="px-3 py-1 bg-white border border-gray-200 rounded text-sm hover:bg-gray-50"
                                >
                                  복사하기
                                </button>
                                <button
                                  type="button"
                                  onClick={shareCurrentUrl}
                                  className="px-3 py-1 bg-white border border-gray-200 rounded text-sm hover:bg-gray-50"
                                >
                                  공유하기
                                </button>
                              </div>
                            </div>
                          </>
                        )}

                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                          <div
                            className="prose prose-sm sm:prose-base max-w-none prose-p:my-2 prose-p:leading-relaxed whitespace-pre-wrap break-words"
                            style={{
                              fontFamily:
                                "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                            }}
                            dangerouslySetInnerHTML={{ __html: selectedQa.content }}
                          />
                          {selectedQa.type === "resource" && (
                            <>
                              <div className="w-full border-t border-gray-200 my-6" />
                              <div className="flex items-center justify-start gap-2">
                                <button
                                  type="button"
                                  onClick={copyCurrentUrl}
                                  className="px-3 py-1 border border-gray-200 rounded text-sm hover:bg-gray-50 flex items-center"
                                  aria-label="본문 복사"
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  복사하기
                                </button>
                                <button
                                  type="button"
                                  onClick={shareCurrentUrl}
                                  className="px-3 py-1 border border-gray-200 rounded text-sm hover:bg-gray-50 flex items-center"
                                  aria-label="공유하기"
                                >
                                  <Share2 className="w-4 h-4 mr-2" />
                                  공유하기
                                </button>
                              </div>
                            </>
                          )}
                        </div>

                        {/* 명확하게 보이는 다운로드 박스 (본문 바로 아래) */}
                        {resourceFiles && resourceFiles.length > 0 && (
                          <div className="mb-6 p-4 rounded-lg border border-green-200 bg-green-50">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">
                              자료 받아보기
                            </h4>
                            <div className="flex flex-col gap-2">
                              {resourceFiles.map((f) => (
                                <a
                                  key={f.id}
                                  href={`/api/admin/guides/files/download?path=${encodeURIComponent(
                                    f.file_path
                                  )}`}
                                  className="inline-flex items-center justify-between w-full px-4 py-2 bg-white border border-green-200 rounded-md hover:bg-green-100 text-sm text-green-800 shadow-sm"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <span className="truncate">{f.file_name}</span>
                                  <span className="text-xs text-gray-500 ml-2">
                                    {f.file_size ? `${Math.round(f.file_size / 1024)} KB` : ""}
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Expert Answers */}
                    {answers.length > 0 &&
                      answers.map((answer, index) => (
                        <Card
                          key={answer.id}
                          className="mb-6 border-0 md:border-2 md:border-blue-100 bg-gradient-to-br from-blue-50/50 to-white"
                        >
                          <CardContent className="px-3 py-4 md:p-8">
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
                              className="prose prose-sm sm:prose-base max-w-none text-gray-700 prose-p:my-2 prose-p:leading-relaxed whitespace-pre-wrap break-words"
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

                    {/* 추천 섹션 */}
                    {recommendations.length > 0 && (
                      <Card className="mb-6 border-0 md:border md:border-gray-200">
                        <CardContent className="px-3 py-4 md:p-6">
                          <h3 className="text-lg font-bold mb-4">
                            {selectedQa.type === "resource"
                              ? "이런 글은 어때요?"
                              : "이런 질문도 있었어요!"}
                          </h3>

                          <div className="flex flex-col gap-2">
                            {recommendations.map((item) => (
                              <Link
                                key={item.id}
                                href={`/lighthouse-QnA?id=${item.id}`}
                                className="block p-3 border border-gray-200 rounded-md hover:shadow-sm bg-white"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="text-xs font-semibold">
                                    {item.category}
                                  </Badge>
                                  <p className="text-sm font-medium text-gray-800 truncate whitespace-nowrap overflow-hidden">
                                    {item.question}
                                  </p>
                                </div>
                                <p
                                  className="text-xs text-gray-500 mt-1 truncate whitespace-nowrap overflow-hidden"
                                  style={{
                                    fontFamily:
                                      "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                                  }}
                                >
                                  {item.subtitle || extractText(item.content || "").slice(0, 120)}
                                </p>
                              </Link>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : paginatedQAs.length === 0 ? (
                  <Card className="hidden border border-gray-200">
                    <CardContent className="p-12 text-center">
                      <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-gray-900 mb-2">아직 질문이 없네요</h3>
                      <p className="text-gray-600 mb-6">첫 질문을 남겨보세요!</p>
                      <Link href="/lighthouse-QnA/ask">
                        <button className="px-6 py-3 bg-blue-300 text-white rounded-lg hover:bg-blue-400 transition-colors font-semibold">
                          질문하기
                        </button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  paginatedQAs.map((qa, index) => (
                    <Link key={qa.id} href={`/lighthouse-QnA?id=${qa.id}`} className="block">
                      <div className="hover:bg-gray-50 transition-all cursor-pointer group py-4 border-b border-gray-300">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                          {/* 정보 타입일 때만 사진 영역 표시 - 모바일에서는 먼저, 데스크톱에서는 오른쪽 */}
                          {qa.type === "resource" && (
                            <div className="flex-shrink-0 w-full md:w-[156px] md:h-[105px] bg-[#959595] rounded-[10px] overflow-hidden md:order-2">
                              {qa.thumbnail_url ? (
                                <Image
                                  src={qa.thumbnail_url}
                                  alt={extractText(qa.question)}
                                  width={220}
                                  height={124}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center text-gray-400 text-xs">
                                  No Image
                                </div>
                              )}
                            </div>
                          )}
                          <div className="flex-1 min-w-0 md:order-1">
                            <h3
                              className="font-bold text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-1 text-[20px]"
                              style={{
                                fontFamily:
                                  "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                              }}
                            >
                              {extractText(qa.question)}
                            </h3>
                            {qa.type === "resource" && qa.subtitle ? (
                              <p
                                className="text-[15px] text-[#545d6a] mb-2 line-clamp-1"
                                style={{
                                  fontFamily:
                                    "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                                }}
                              >
                                {qa.subtitle}
                              </p>
                            ) : qa.type !== "resource" ? (
                              <p
                                className="text-[15px] text-[#545d6a] mb-2 line-clamp-1"
                                style={{
                                  fontFamily:
                                    "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                                }}
                              >
                                {extractText(qa.content)}
                              </p>
                            ) : null}
                            <div className="flex items-center text-xs text-gray-400">
                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {qa.views}명이 확인했어요
                                </span>
                                <span>
                                  · {qa.type === "resource" ? qa.author || "운영팀" : qa.date}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && !selectedQa && (
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
            <div className="md:col-span-3 space-y-8">
              {/* 인기 질문 (사이드바) - hidden */}
              <div className="sticky top-24 space-y-4">
                <div className="hidden bg-white border border-gray-200 rounded-lg p-4">
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

                {/* 커스텀 배너 */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setIsBannerModalOpen(true)}
                    className="block w-full group cursor-pointer"
                  >
                    <div className="relative aspect-[16/13.5] bg-gray-100">
                      <Image
                        src="/images/banner.png"
                        alt="배너 이미지"
                        fill
                        className="object-cover group-hover:opacity-90 transition-opacity"
                      />
                    </div>
                  </button>
                </div>

                {/* 질문하기 배너 (작고 무채색) */}
                <div className="hidden bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
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

      {/* 배너 문의 모달 */}
      <Dialog open={isBannerModalOpen} onOpenChange={setIsBannerModalOpen}>
        <DialogContent
          className="sm:max-w-md"
          style={{
            fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
          }}
        >
          <DialogHeader>
            <DialogTitle
              className="text-xl font-bold text-gray-900"
              style={{
                fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
              }}
            >
              2026년 반려해변 입양가이드
            </DialogTitle>
            <DialogDescription
              className="text-sm text-gray-600"
              style={{
                fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
              }}
            >
              기관명과 이메일을 입력해주시면 이메일로 발송해드립니다.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBannerSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label
                htmlFor="organization"
                className="text-sm font-semibold text-gray-900"
                style={{
                  fontFamily:
                    "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                }}
              >
                기관명 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="organization"
                type="text"
                value={bannerFormData.organization}
                onChange={(e) =>
                  setBannerFormData({ ...bannerFormData, organization: e.target.value })
                }
                placeholder="기관명을 입력하세요"
                required
                className="h-11"
                style={{
                  fontFamily:
                    "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                }}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="bannerEmail"
                className="text-sm font-semibold text-gray-900"
                style={{
                  fontFamily:
                    "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                }}
              >
                이메일 주소 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="bannerEmail"
                type="email"
                value={bannerFormData.email}
                onChange={(e) => setBannerFormData({ ...bannerFormData, email: e.target.value })}
                placeholder="이메일 주소를 입력하세요"
                required
                className="h-11"
                style={{
                  fontFamily:
                    "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                }}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsBannerModalOpen(false)}
                disabled={isSubmittingBanner}
                className="flex-1 h-11"
                style={{
                  fontFamily:
                    "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                }}
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingBanner}
                className="flex-1 h-11 bg-blue-600 hover:bg-blue-700"
                style={{
                  fontFamily:
                    "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                }}
              >
                {isSubmittingBanner ? (
                  "전송 중..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    가이드 받기
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 전문가 모달 및 관련 UI 제거됨 */}
    </div>
  );
}

export default function LighthouseQnAPage() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <QnAContent />
    </Suspense>
  );
}

"use client";

import CategorySidebar from "@/components/CategorySidebar";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Calendar, ChevronRight, Eye, Home, Share2, ThumbsUp, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface QnA {
  id: number;
  title: string;
  content: string;
  category: string;
  author_name: string;
  author_email: string;
  author_phone: string;
  status: string;
  views: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

interface Answer {
  id: number;
  qna_id: number;
  content: string;
  answerer_name: string;
  created_at: string;
  updated_at: string;
}

interface RelatedQuestion {
  id: number;
  title: string;
  category: string;
}

export default function QuestionDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [qna, setQna] = useState<QnA | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [relatedQuestions, setRelatedQuestions] = useState<RelatedQuestion[]>([]);

  // Q&A 카테고리 구조
  const qnaCategories = [
    {
      label: "입양 관련",
      value: "입양관련",
      subItems: [
        { label: "전체", value: "입양관련" },
        { label: "입양 절차", value: "입양절차" },
        { label: "참여 조건", value: "참여조건" },
        { label: "계약 관련", value: "계약관련" },
      ],
    },
    {
      label: "활동 운영",
      value: "활동운영",
      subItems: [
        { label: "전체", value: "활동운영" },
        { label: "활동 계획", value: "활동계획" },
        { label: "활동 방법", value: "활동방법" },
        { label: "참여 인원", value: "참여인원" },
        { label: "활동 보고", value: "활동보고" },
      ],
    },
    {
      label: "지원·기금",
      value: "지원기금",
      subItems: [
        { label: "전체", value: "지원기금" },
        { label: "지원 제도", value: "지원제도" },
        { label: "기금 사용", value: "기금사용" },
        { label: "정산 절차", value: "정산절차" },
      ],
    },
    {
      label: "기타",
      value: "기타",
      subItems: [
        { label: "전체", value: "기타" },
        { label: "문의", value: "문의" },
        { label: "제안", value: "제안" },
      ],
    },
  ];

  useEffect(() => {
    if (id) {
      fetchQnA();
      fetchAnswers();
      fetchRelatedQuestions();
    }
  }, [id]);

  const fetchQnA = async () => {
    try {
      setLoading(true);

      // Q&A 조회
      const { data, error } = await supabase
        .from("qna")
        .select("*")
        .eq("id", id)
        .eq("is_public", true)
        .single();

      if (error) throw error;

      if (data) {
        setQna(data);

        // 조회수 증가
        await supabase
          .from("qna")
          .update({ views: (data.views || 0) + 1 })
          .eq("id", id);
      }
    } catch (error) {
      console.error("Error fetching Q&A:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnswers = async () => {
    try {
      const { data, error } = await supabase
        .from("qna_answers")
        .select("*")
        .eq("qna_id", id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setAnswers(data || []);
    } catch (error) {
      console.error("Error fetching answers:", error);
    }
  };

  const fetchRelatedQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("qna")
        .select("id, title, category")
        .eq("is_public", true)
        .neq("id", id)
        .limit(3)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRelatedQuestions(data || []);
    } catch (error) {
      console.error("Error fetching related questions:", error);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!qna) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">질문을 찾을 수 없습니다</h1>
            <Link href="/adopt-a-beach/expertsqna">
              <Button variant="outline">목록으로 돌아가기</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-blue-600">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/adopt-a-beach/expertsqna" className="hover:text-blue-600">
              전문가 Q&A
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{qna.category}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 왼쪽 사이드바 */}
            <div className="lg:col-span-1">
              <CategorySidebar
                categories={qnaCategories}
                selectedCategory={qna?.category || ""}
                basePath="/adopt-a-beach/expertsqna"
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Back Button */}
              <Link href="/adopt-a-beach/expertsqna">
                <Button variant="outline" className="mb-6">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  목록으로
                </Button>
              </Link>

              {/* Question Card */}
              <Card className="mb-6 border border-gray-200">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100">
                      {qna.category}
                    </Badge>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{qna.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(qna.created_at)
                            .toLocaleDateString("ko-KR", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })
                            .replace(/\. /g, ".")
                            .replace(/\.$/, "")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 mb-6">{qna.title}</h1>

                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <div
                      className="prose prose-sm sm:prose lg:prose-lg max-w-none prose-p:my-2 prose-p:leading-relaxed whitespace-pre-wrap break-words"
                      style={{
                        fontFamily:
                          "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                      }}
                      dangerouslySetInnerHTML={{ __html: qna.content }}
                    />
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>익명</span>
                    </div>
                    <Badge variant={qna.status === "answered" ? "default" : "secondary"}>
                      {qna.status === "answered"
                        ? "답변완료"
                        : qna.status === "pending"
                          ? "답변대기"
                          : "종료"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Expert Answer - 답변이 있을 때만 표시 */}
              {answers.length > 0 &&
                answers.map((answer, index) => (
                  <Card
                    key={answer.id}
                    className="mb-6 border-2 border-blue-100 bg-gradient-to-br from-blue-50/50 to-white"
                  >
                    <CardContent className="p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
                          👤
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">{answer.answerer_name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              전문가
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
                          <Button
                            variant={liked ? "default" : "outline"}
                            size="sm"
                            onClick={() => setLiked(!liked)}
                            className={liked ? "bg-blue-300" : ""}
                          >
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            도움이 됐어요
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleShare}>
                            <Share2 className="w-4 h-4 mr-2" />
                            공유하기
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

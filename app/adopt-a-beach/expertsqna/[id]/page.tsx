"use client";

import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Eye,
  Home,
  MessageCircle,
  Share2,
  ThumbsUp,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

// TODO: DB팀 - 질문 상세 조회 API 구현 필요
// GET /api/questions/:id

// 임시 질문 데이터
const questionData: Record<string, any> = {
  "1": {
    id: 1,
    category: "반려해변입양",
    question: "반려해변입양 신청 시 필요한 서류는 무엇인가요?",
    content:
      "안녕하세요. 학교에서 반려해변을 입양하려고 합니다. 신청 시 어떤 서류를 준비해야 하는지 자세히 알려주시면 감사하겠습니다.",
    askedBy: "환경동아리",
    askedDate: "2026.01.15",
    views: 308,
    likes: 12,
    expert: {
      name: "김민지 코디네이터",
      image: "👩‍💼",
      organization: "반려해변입양 전문",
    },
    answer: {
      content: `안녕하세요, 김민지 코디네이터입니다.

반려해변 입양 신청 시 다음 서류를 준비하시면 됩니다:

**필수 서류**
1. 입양 신청서 (홈페이지에서 다운로드 가능)
2. 사업자등록증 또는 고유번호증 사본
3. 담당자 신분증 사본
4. 활동 계획서

**선택 서류**
1. 기관 소개서
2. 과거 활동 이력 (있는 경우)

자세한 양식은 반려해변 입양 페이지의 "서류 제출하기" 섹션에서 확인하실 수 있습니다.

추가 문의사항이 있으시면 언제든 연락 주세요!`,
      answeredDate: "2026.01.15",
    },
    relatedQuestions: [
      {
        id: 2,
        question: "겨울철 해변 정화 활동 시 주의사항은?",
        category: "정화활동",
      },
      {
        id: 5,
        question: "입양 후 월 1회 활동을 못하면 어떻게 되나요?",
        category: "반려해변입양",
      },
      {
        id: 7,
        question: "개인도 반려해변입양 신청이 가능한가요?",
        category: "반려해변입양",
      },
    ],
  },
  "2": {
    id: 2,
    category: "정화활동",
    question: "겨울철 해변 정화 활동 시 주의사항은?",
    content:
      "겨울에도 정화 활동을 계속하고 싶은데, 날씨가 추워서 걱정입니다. 안전하게 활동하려면 어떤 점을 주의해야 할까요?",
    askedBy: "바다사랑모임",
    askedDate: "2026.01.14",
    views: 156,
    likes: 8,
    expert: {
      name: "박준호 환경전문가",
      image: "🔬",
      organization: "해양생태연구소",
    },
    answer: {
      content: `겨울철 해변 정화 활동 시 다음 사항들을 주의하시기 바랍니다:

**안전 수칙**
1. 방한복과 방수 장갑 착용 필수
2. 활동 시간을 평소보다 30% 단축
3. 파도가 높은 날은 활동 자제
4. 온수 보온병 준비

**겨울철 특징**
- 해양 쓰레기가 더 많이 밀려옴
- 미세플라스틱 수거에 집중
- 날씨 확인 후 활동 일정 조정

안전이 최우선입니다!`,
      answeredDate: "2026.01.14",
    },
    relatedQuestions: [
      {
        id: 6,
        question: "쓰레기 분류는 어떻게 해야 하나요?",
        category: "정화활동",
      },
    ],
  },
};

export default function QuestionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const question = questionData[id];

  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");

  if (!question) {
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
            <span className="text-gray-900 font-medium">{question.category}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
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
                      {question.category}
                    </Badge>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{question.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{question.askedDate}</span>
                      </div>
                    </div>
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 mb-6">{question.question}</h1>

                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {question.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{question.askedBy}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Expert Answer */}
              {question.answer && (
                <Card className="mb-6 border-2 border-blue-100 bg-gradient-to-br from-blue-50/50 to-white">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
                        {question.expert.image}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">{question.expert.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            전문가
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{question.expert.organization}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {question.answer.answeredDate} 답변
                        </p>
                      </div>
                    </div>

                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {question.answer.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                      <Button
                        variant={liked ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLiked(!liked)}
                        className={liked ? "bg-blue-600" : ""}
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        도움이 됐어요 {question.likes + (liked ? 1 : 0)}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        공유하기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Comments Section */}
              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    댓글
                  </h3>

                  <div className="mb-6">
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="댓글을 입력하세요..."
                      rows={4}
                      className="mb-3"
                    />
                    <div className="flex justify-end">
                      <Button className="bg-blue-600 hover:bg-blue-700">댓글 작성</Button>
                    </div>
                  </div>

                  <div className="text-center text-gray-500 py-8">
                    아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Expert Info */}
              <Card className="border border-gray-200 sticky top-24">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">답변 전문가</h3>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                      {question.expert.image}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{question.expert.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">{question.expert.organization}</p>
                      <Link href="/adopt-a-beach/expertsqna/ask">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 w-full">
                          질문하기
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Related Questions */}
              {question.relatedQuestions && question.relatedQuestions.length > 0 && (
                <Card className="border border-gray-200">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 mb-4">관련 질문</h3>
                    <div className="space-y-3">
                      {question.relatedQuestions.map((related: any) => (
                        <Link key={related.id} href={`/adopt-a-beach/expertsqna/${related.id}`}>
                          <div className="p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer group">
                            <Badge variant="outline" className="text-xs mb-2 inline-block">
                              {related.category}
                            </Badge>
                            <p className="text-sm text-gray-900 group-hover:text-blue-600 line-clamp-2">
                              {related.question}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

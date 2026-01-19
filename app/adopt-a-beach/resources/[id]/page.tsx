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
  Download,
  Eye,
  FileText,
  Home,
  MessageCircle,
  Share2,
  ThumbsUp,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// TODO: DB팀 - 게시글 상세 조회 API 구현 필요
// GET /api/resources/:id

// 임시 게시글 데이터
const resourceData: Record<string, any> = {
  "1": {
    id: 1,
    title: "반려해변이란? - 해변이 우리를 기다려요!",
    content: `안녕하세요, 반려해변 운영팀입니다.

반려해변 입양이란?

반려해변은 기업, 단체, 학교 등 기관이 도움이 필요한 해변을 '입양'하여 지속적으로 관리하고 보호하는 프로그램입니다. 마치 반려동물을 가족으로 맞이하듯, 우리의 소중한 해변을 책임지고 가꾸어 나가는 의미 있는 활동입니다.

입양 절차

1. 입양 신청
   - 홈페이지에서 입양 가능한 해변 확인
   - 입양 신청서 작성 및 제출
   - 기관 정보 및 활동 계획서 첨부

2. 서류 심사
   - 제출된 서류 검토 및 평가(선정위원회 심의를 통한 절차)
   - 필요시 추가 서류 요청
   - 승인 결과 안내

3. 기금 납부
   - 입양 기금 납부 (연간 300만원 권장)
   - 납부 확인 후 활동 진행
   - 풀뿌리 환경 단체 지원 가능(1팀당 150만원)

입양 후 활동

- 연 2회 이상 정화 활동, 1회의 캠페인 진행 필수
- 활동 사진 및 보고서 제출

지원 사항
- 우수 활동 기관 전국대회 시상
- 필수 활동 이행 시 입양증서 발급

감사합니다.`,
    category: "가이드",
    author: "운영팀",
    date: "2025-01-10",
    views: 1234,
    likes: 42,
    attachments: [
      {
        id: 1,
        name: "2025 반려해변 입양기관 기본안내서.pdf",
        size: "24.4MB",
        url: "/file/1. 2025 반려해변 입양기관 기본안내서.pdf",
      },
    ],
    comments: [
      {
        id: 1,
        author: "환경지킴이",
        content: "정말 유익한 정보 감사합니다! 학교에서 입양 신청 준비 중입니다.",
        date: "2025-01-11",
        likes: 5,
      },
      {
        id: 2,
        author: "바다사랑",
        content: "입양 기금이 어떻게 사용되는지 궁금합니다.",
        date: "2025-01-11",
        likes: 3,
      },
    ],
  },
  "2": {
    id: 2,
    title: "2025년 반려해변 입양 기관 명단",
    content: `2025년 반려해변 입양에 참여해 주신 모든 기관에 감사드립니다.

총 입양 현황
- 총 입양 기관: 127개
- 영리기업: 45개
- 비영리단체: 38개
- 학교: 32개
- 공공기관: 12개

주요 입양 기관

영리기업
- ㈜바다사랑기업 - 해운대 해수욕장
- 오션테크놀로지 - 광안리 해수욕장
- 그린마린 - 송도 해수욕장

비영리단체
- 환경보호협회 - 낙산 해수욕장
- 클린오션 - 망상 해수욕장
- 푸른바다 - 대천 해수욕장

학교
- 해양대학교 - 송정 해수욕장
- 서울환경고등학교 - 을왕리 해수욕장
- 부산여자중학교 - 다대포 해수욕장

2026년 신규 입양 신청

2026년 신규 입양 신청은 2월 1일부터 시작됩니다.
많은 관심과 참여 부탁드립니다.

문의: itaseoul@naver.com`,
    category: "공지",
    author: "관리자",
    date: "2025-01-08",
    views: 2341,
    likes: 89,
    attachments: [
      {
        id: 1,
        name: "2025년_입양기관_명단.xlsx",
        size: "245KB",
        url: "/templates/2025년_입양기관_명단.xlsx",
      },
    ],
    comments: [
      {
        id: 1,
        author: "신규지원자",
        content: "2026년 신청 일정이 궁금합니다!",
        date: "2025-01-09",
        likes: 7,
      },
    ],
  },
  "3": {
    id: 3,
    title: "2025년 반려해변 운영 계획 안내",
    content: `2025년 반려해변 운영 계획을 안내드립니다.

운영 목표
- 입양 해변 150개 달성
- 정화 활동 1,000회 이상 진행
- 해양 쓰레기 100톤 수거

주요 프로그램

1. 정기 정화 활동
   - 매월 첫째/셋째 주 토요일
   - 입양 기관별 자율 활동
   - 분기별 우수 기관 시상

2. 교육 프로그램
   - 해양 환경 교육 분기별 1회
   - 온라인 웨비나 월 1회
   - 전문가 특강 반기별 1회

3. 캠페인
   - 여름 해변 정화 대축제 (7월)
   - 가을 해양 보호 주간 (10월)
   - 연말 우수 활동 사례 공모전 (12월)

지원 사항
- 정화 키트 정기 지원
- 활동 보험 가입
- 홍보물 제작 지원
- 우수 기관 시상 및 인증서

일정
- 1분기: 신규 입양 기관 모집
- 2분기: 해변 정화 활동 집중
- 3분기: 교육 및 캠페인
- 4분기: 활동 평가 및 시상

많은 참여 부탁드립니다.`,
    category: "공지",
    author: "운영팀",
    date: "2025-01-05",
    views: 3452,
    likes: 156,
    comments: [],
  },
  "4": {
    id: 4,
    title: "반려동물 동반 시설 상세 안내",
    content: `반려동물과 함께하는 해변 정화 활동 안내입니다.

반려동물 동반 가능 해변
- 송정 해수욕장
- 을왕리 해수욕장
- 망상 해수욕장

준수사항
1. 반려동물 배변 봉투 지참 필수
2. 목줄 착용 의무
3. 다른 이용객 배려
4. 배설물 즉시 처리

시설 안내
- 반려동물 음수대
- 배변 봉투 비치함
- 반려동물 쉼터

문의: 070-8015-4120`,
    category: "시설",
    author: "운영팀",
    date: "2025-01-03",
    views: 987,
    likes: 34,
    comments: [],
  },
  "5": {
    id: 5,
    title: "자주 묻는 질문 TOP 10",
    content: `반려해변 입양 관련 자주 묻는 질문을 정리했습니다.

Q1. 개인도 입양 신청이 가능한가요?
A. 네, 가능합니다. 다만 개인의 경우 월 1회 이상 정화 활동을 지속할 수 있는지 확인이 필요합니다.

Q2. 입양 기금은 어디에 사용되나요?
A. 정화 키트 제작, 보험료, 교육 프로그램 운영 등에 사용됩니다.

Q3. 활동을 못하면 어떻게 되나요?
A. 3개월 연속 활동이 없을 경우 입양이 취소될 수 있습니다.

Q4. 여러 해변을 동시에 입양할 수 있나요?
A. 네, 가능합니다. 다만 각 해변별로 활동 계획이 필요합니다.

Q5. 입양증서는 언제 발급되나요?
A. 기금 납부 확인 후 7일 이내 등기우편으로 발송됩니다.

Q6. 외국인도 신청 가능한가요?
A. 국내 체류 중인 외국인은 신청 가능합니다.

Q7. 정화 키트는 무엇이 포함되나요?
A. 집게, 장갑, 쓰레기봉투, 안전조끼가 포함됩니다.

Q8. 활동 사진은 꼭 제출해야 하나요?
A. 네, 분기별 1회 이상 활동 인증이 필요합니다.

Q9. 기금 환불이 가능한가요?
A. 승인 전 취소 시 전액 환불, 승인 후에는 환불 불가입니다.

Q10. 단체 활동 시 몇 명이 필요한가요?
A. 최소 5명 이상 권장합니다.`,
    category: "FAQ",
    author: "고객지원팀",
    date: "2025-01-02",
    views: 5678,
    likes: 234,
    comments: [
      {
        id: 1,
        author: "궁금이",
        content: "Q11도 추가해주세요. 겨울에도 활동해야 하나요?",
        date: "2025-01-03",
        likes: 12,
      },
      {
        id: 2,
        author: "환경지킴이",
        content: "정말 유용한 정보네요!",
        date: "2025-01-03",
        likes: 8,
      },
    ],
  },
};

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const resource = resourceData[id];

  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");

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

  if (!resource) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">게시글을 찾을 수 없습니다</h1>
            <Link href="/adopt-a-beach/resources">
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
            <Link href="/adopt-a-beach/resources" className="hover:text-blue-600">
              자료 게시판
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{resource.category}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Back Button */}
              <Button variant="outline" className="mb-6" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                목록으로
              </Button>

              {/* Article Card */}
              <Card className="mb-6 border border-gray-200">
                <CardContent className="p-8">
                  {/* Header */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 mb-4">
                      {resource.category}
                    </Badge>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{resource.title}</h1>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{resource.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{resource.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>{resource.views.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Attachments */}
                  {resource.attachments && resource.attachments.length > 0 && (
                    <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        첨부파일 ({resource.attachments.length})
                      </h3>
                      <div className="space-y-2">
                        {resource.attachments.map((file: any) => (
                          <a
                            key={file.id}
                            href={file.url}
                            download
                            className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded group-hover:bg-blue-200 transition-colors">
                                <FileText className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">{file.size}</p>
                              </div>
                            </div>
                            <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="prose max-w-none mb-8">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {resource.content}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                    <Button
                      variant={liked ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLiked(!liked)}
                      className={liked ? "bg-blue-300" : ""}
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      좋아요 {resource.likes + (liked ? 1 : 0)}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="w-4 h-4 mr-2" />
                      공유하기
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Comments Section */}
              <Card className="border border-gray-200">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    댓글 {resource.comments.length}
                  </h3>

                  {/* Comment Form */}
                  <div className="mb-8">
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="댓글을 입력하세요..."
                      rows={4}
                      className="mb-3"
                    />
                    <div className="flex justify-end">
                      <Button
                        className="bg-blue-300 hover:bg-blue-400"
                        onClick={() => {
                          if (comment.trim()) {
                            alert("댓글이 등록되었습니다!");
                            setComment("");
                          }
                        }}
                      >
                        댓글 작성
                      </Button>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-6">
                    {resource.comments.length > 0 ? (
                      resource.comments.map((comment: any) => (
                        <div key={comment.id} className="bg-gray-50 rounded-lg p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{comment.author}</p>
                                <p className="text-xs text-gray-500">{comment.date}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              {comment.likes}
                            </Button>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Author Info */}
              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">작성자</h3>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{resource.author}</h4>
                      <p className="text-xs text-gray-500">반려해변 관리자</p>
                    </div>
                  </div>
                  <Link href="/adopt-a-beach/expertsqna/ask">
                    <Button size="sm" className="bg-blue-300 hover:bg-blue-400 w-full">
                      질문하기
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Recent Posts */}
              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">최근 게시글</h3>
                  <div className="space-y-3">
                    {Object.values(resourceData)
                      .filter((r: any) => r.id !== resource.id)
                      .slice(0, 5)
                      .map((r: any) => (
                        <Link key={r.id} href={`/adopt-a-beach/resources/${r.id}`}>
                          <div className="p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer group">
                            <Badge variant="outline" className="text-xs mb-2 inline-block">
                              {r.category}
                            </Badge>
                            <p className="text-sm text-gray-900 group-hover:text-blue-600 line-clamp-2">
                              {r.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{r.date}</p>
                          </div>
                        </Link>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

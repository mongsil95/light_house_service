"use client";

import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  FileText,
  Gift,
  HelpCircle,
  Phone,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  // 최신 전문가 답변 (전문가 Q&A에서 가져옴)
  const recentAnswers = [
    {
      id: 1,
      category: "반려해변입양",
      question: "반려해변입양 신청 시 필요한 서류는 무엇인가요?",
      expert: "김민지 코디네이터",
      expertImage: "👩‍💼",
      date: "2026.01.15",
      views: 308,
      likes: 12,
      badge: "NEW",
    },
    {
      id: 2,
      category: "정화활동",
      question: "겨울철 해변 정화 활동 시 주의사항은?",
      expert: "박준호 환경전문가",
      expertImage: "🔬",
      date: "2026.01.14",
      views: 156,
      likes: 8,
      badge: null,
    },
    {
      id: 3,
      category: "해봄프로그램",
      question: "학교에서 단체로 참여하려면 어떻게 해야 하나요?",
      expert: "이타서울 해양팀",
      expertImage: "🌊",
      date: "2026.01.13",
      views: 89,
      likes: 5,
      badge: null,
    },
  ];

  // 인기 질문 (전문가 Q&A와 동일)
  const popularQuestions = [
    "처음 해변 정화를 시작하는데 어떤 준비가 필요한가요?",
    "반려해변입양 신청 자격 요건이 어떻게 되나요?",
    "정화 활동 후 수거한 쓰레기는 어떻게 처리하나요?",
    "단체 참여 시 최소 인원이 있나요?",
    "해봄 프로그램 참여 후 인증서를 받을 수 있나요?",
  ];

  // 참여광장 퀴즈
  const quizzes = [
    {
      title: "🌊 바다 쓰레기 퀴즈",
      description: "우리 바다를 얼마나 알고 계신가요?",
      participants: 1247,
      daysLeft: 12,
      thumbnail: "🐋",
    },
    {
      title: "♻️ 분리배출 상식 테스트",
      description: "헷갈리는 분리배출, 제대로 알기",
      participants: 892,
      daysLeft: 8,
      thumbnail: "🌱",
    },
  ];

  // 활동 노하우 (숏폼)
  const activityTips = [
    {
      title: "해변 정화 처음이세요?",
      subtitle: "초보자를 위한 완벽 가이드",
      duration: "1:30",
      views: "2.4K",
      thumbnail: "🏖️",
    },
    {
      title: "효율적인 쓰레기 분류법",
      subtitle: "현장에서 바로 적용하는 팁",
      duration: "2:15",
      views: "1.8K",
      thumbnail: "📦",
    },
    {
      title: "안전한 정화 활동을 위한 준비물",
      subtitle: "필수 장비 체크리스트",
      duration: "1:45",
      views: "3.1K",
      thumbnail: "🧤",
    },
  ];

  // 바로가기
  const quickLinks = [
    { icon: <Calendar className="w-6 h-6" />, title: "활동 캘린더", color: "bg-blue-500" },
    { icon: <FileText className="w-6 h-6" />, title: "정화량 계산기", color: "bg-green-500" },
    { icon: <Award className="w-6 h-6" />, title: "인증서 발급", color: "bg-purple-500" },
    { icon: <Users className="w-6 h-6" />, title: "단체 신청", color: "bg-orange-500" },
  ];

  // 최신 소식
  const latestNews = [
    {
      title: "2026년 반려해변 전국대회 일정 공개",
      date: "2026.01.15",
      category: "공지사항",
      isNew: true,
    },
    {
      title: "겨울철 해변 정화 안전 수칙 안내",
      date: "2026.01.12",
      category: "안전가이드",
      isNew: true,
    },
    {
      title: "반려해변 입양 100호 돌파 기념 이벤트",
      date: "2026.01.10",
      category: "이벤트",
      isNew: false,
    },
  ];

  // 교육 콘텐츠
  const educationContents = [
    {
      title: "해양쓰레기 이해하기",
      category: "기초 교육",
      duration: "15분",
      views: "5.2K",
    },
    {
      title: "효과적인 정화 활동 방법",
      category: "실전 가이드",
      duration: "20분",
      views: "4.8K",
    },
    {
      title: "해양 생태계 보호 캠페인",
      category: "심화 학습",
      duration: "25분",
      views: "3.9K",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header Navigation */}
      <Navigation />

      {/* Hero Section - 배민 스타일 */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-600">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-white py-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium">해변을 지키는 모든 이를 위한 파트너</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              등대지기와 함께 성장하는
              <br />
              <span className="text-cyan-100">해양환경 생태계</span>
            </h1>

            <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
              반려해변 입양부터 해봄 프로그램까지, 모든 활동을 한 곳에서
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/adopt-a-beach">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8"
                >
                  반려해변 입양 신청하기
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-8"
                >
                  <Phone className="mr-2 w-5 h-5" />
                  상담 신청
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 반려해변 입양 배너 */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 왼쪽 배너 */}
            <div
              className="lg:col-span-2 rounded-2xl overflow-hidden h-64 lg:h-80"
              style={{
                backgroundImage:
                  "url(https://png.pngtree.com/thumb_back/fh260/back_our/20190625/ourmid/pngtree-fresh-green-minimalist-plant-banner-image_255294.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>

            {/* 오른쪽 CTA 카드 */}
            <div className="bg-white rounded-2xl p-8 border-2 border-blue-200 flex flex-col justify-center items-center text-center">
              <h4 className="text-2xl font-bold text-gray-900 mb-3">쉽고 빠른 입양을 도와드려요</h4>
              <p className="text-blue-600 font-bold text-lg mb-6">반려해변 입양 3단계</p>
              <Link href="/adopt-a-beach" className="w-full">
                <Button className="w-full bg-blue-300 hover:bg-blue-400 text-gray-900 text-lg py-6">
                  확인하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 최신 전문가 답변 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">최신 답변</h2>
              <p className="text-gray-600">전문가가 직접 답변한 최신 질문을 확인하세요</p>
            </div>
            <Link
              href="/adopt-a-beach/expertsqna"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              전체보기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentAnswers.map((answer) => (
              <Link key={answer.id} href="/adopt-a-beach/expertsqna">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {answer.category}
                      </Badge>
                      {answer.badge && (
                        <Badge className="bg-red-500 text-white text-xs">{answer.badge}</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-4 line-clamp-2 leading-snug">
                      {answer.question}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{answer.expertImage}</span>
                        <span className="font-medium">{answer.expert}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        좋아요 {answer.likes}
                      </span>
                      <span>{answer.date}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 인기 질문 (실시간 기준) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">인기 질문 TOP 5</h2>
              <p className="text-gray-600">실시간 기준 · 가장 많이 찾는 질문</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 divide-y">
            {popularQuestions.map((question, idx) => (
              <Link key={idx} href="/adopt-a-beach/expertsqna">
                <div className="p-5 hover:bg-gray-50 cursor-pointer flex items-center gap-4 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{question}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 참여광장 (퀴즈/투표) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">참여광장</h2>
              <p className="text-gray-600">퀴즈 풀고 환경 지식 UP!</p>
            </div>
            <Link
              href="/adopt-a-beach/expertsqna"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              전체보기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((quiz, idx) => (
              <Card
                key={idx}
                className="hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-8 text-white text-center">
                    <div className="text-6xl mb-4">{quiz.thumbnail}</div>
                    <h3 className="text-2xl font-bold mb-2">{quiz.title}</h3>
                    <p className="text-blue-50">{quiz.description}</p>
                  </div>
                  <div className="p-6 bg-white">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {quiz.participants.toLocaleString()}명 참여
                      </span>
                      <span className="text-orange-500 font-semibold">
                        마감 {quiz.daysLeft}일 남음
                      </span>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      퀴즈 참여하기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 활동 노하우 (숏폼) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">활동 노하우 숏폼</h2>
              <p className="text-gray-600">1~2분 만에 배우는 정화 활동 팁</p>
            </div>
            <Link
              href="/adopt-a-beach/resources"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              전체보기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activityTips.map((tip, idx) => (
              <Card
                key={idx}
                className="hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 overflow-hidden group"
              >
                <CardContent className="p-0">
                  <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 aspect-video flex items-center justify-center">
                    <div className="text-7xl">{tip.thumbnail}</div>
                    <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-sm font-semibold">
                      {tip.duration}
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center transition-colors">
                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-blue-600 border-b-8 border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-1">{tip.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{tip.subtitle}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>조회 {tip.views}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 바로가기 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">바로가기</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link, idx) => (
              <Card
                key={idx}
                className="hover:shadow-lg transition-all cursor-pointer border border-gray-200 hover:border-blue-300 group"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`${link.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform`}
                  >
                    {link.icon}
                  </div>
                  <p className="font-semibold text-gray-900">{link.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 최신 외식업 소식 → 최신 해양환경 소식 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">최신 해양환경 소식</h2>
              <p className="text-gray-600">꼭 알아야 할 소식을 놓치지 마세요</p>
            </div>
            <Link
              href="/inquiry"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              전체보기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {latestNews.map((news, idx) => (
              <Card
                key={idx}
                className="hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {news.category}
                        </Badge>
                        {news.isNew && <Badge className="bg-red-500 text-white text-xs">NEW</Badge>}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg">{news.title}</h3>
                    </div>
                    <div className="text-sm text-gray-500">{news.date}</div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 무료 교육 */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">등대아카데미 무료 교육</h2>
              <p className="text-gray-600">해양환경 전문가가 되는 첫걸음</p>
            </div>
            <Link
              href="/haebom/resources"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              전체보기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {educationContents.map((content, idx) => (
              <Card
                key={idx}
                className="hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <Badge variant="secondary" className="mb-3">
                    {content.category}
                  </Badge>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">{content.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{content.duration}</span>
                    <span>·</span>
                    <span>조회 {content.views}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 이벤트·혜택 */}
      <section className="py-16 bg-gradient-to-br from-orange-500 to-pink-500">
        <div className="max-w-7xl mx-auto px-6 text-center text-white">
          <Gift className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">신규 입양 기념 혜택</h2>
          <p className="text-xl mb-8 text-orange-50">반려해변 입양신청하고 OOOO 받아가세요!</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/adopt-a-beach">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-orange-50 font-semibold px-8"
              >
                혜택 자세히 보기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 전문가 Q&A */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <HelpCircle className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">궁금한 게 있으신가요?</h2>
            <p className="text-gray-600 mb-8">환경 전문가가 직접 답변해드립니다</p>
            <Link href="/inquiry">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                질문하러 가기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-16 md:py-20 lg:py-24 px-6 sm:px-6 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="border-t border-blue-700 pt-7 md:pt-8 text-center">
            <p className="text-blue-200 text-[13px] md:text-sm px-2">
              © 2026 반려해변 라이트하우스 서비스 - 이타서울 비영리 -
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

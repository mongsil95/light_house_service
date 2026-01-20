"use client";

import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { BookOpen, Calendar, CheckCircle2, PlayCircle, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface FAQ {
  id: number;
  title: string;
  content: string;
}

export default function NewHome() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from("resources")
        .select("id, title, content")
        .eq("category", "FAQ")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      if (data) setFaqs(data);
    } catch (error) {
      console.error("FAQ 로드 실패:", error);
    } finally {
      setLoadingFaqs(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-cyan-50 via-blue-50 to-pink-50 py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-blue-600 font-medium mb-4">반려해변 입양 선택이 망설여지신다면</p>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              등대지기의 랜턴 서비스를
              <br />
              무료로 체험하세요
            </h1>
            <p className="text-lg text-gray-600 mb-12">등대지기와 함께 반려해변에 대해 알아봐요!</p>

            {/* Main Package Card */}
            {/* TODO: 디자인/카피 검토 필요 — 배민 광고 페이지 레이아웃을 반영해 콘텐츠 확정하기 */}
            <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-5xl mx-auto border-4 border-blue-200 hidden">
              <div className="mb-8">
                <p className="text-sm text-gray-600 mb-2"></p>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">반려해변 성장 패키지</h2>
                <p className="text-gray-700">
                  반려해변 성장 패키지 사용 단체는
                  <br />첫 달 참여 횟수가{" "}
                  <span className="text-blue-600 font-bold text-xl">평균 4.8배*</span> 늘었어요!
                </p>
                <p className="text-xs text-gray-400 mt-2">*24년 이후 프로그램 가입 단체 기준</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Benefit 1 */}
                <div className="text-left">
                  <div className="bg-blue-50 rounded-2xl p-6 mb-4">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                        🚚
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">해변클린서비스 · 해변보호주문</p>
                        <p className="text-sm text-gray-700 mb-2">알뜰·한집배달, 픽업 모두</p>
                        <p className="text-4xl font-bold text-blue-600">14일 무료</p>
                        <p className="text-sm text-gray-500">최대 7.8%</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-center">
                      <div className="text-6xl">🏖️</div>
                    </div>
                  </div>
                </div>

                {/* Benefit 2 */}
                <div className="text-left">
                  <div className="bg-pink-50 rounded-2xl p-6 mb-4">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="bg-pink-500 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                        📣
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">우리해변클릭</p>
                        <p className="text-sm text-gray-700 mb-2">추가 홍보 비용도</p>
                        <p className="text-4xl font-bold text-pink-600">최대 20만원 혜택</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <div className="bg-white rounded-lg p-3 shadow-md">
                        <div className="text-3xl">🌊</div>
                        <p className="text-xs text-gray-600 mt-1">우리해변치킨</p>
                        <p className="text-xs text-gray-500">상담 ⏱️ 10~15분</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline" size="lg" className="px-8 text-base" asChild>
                  <Link href="/contact">전화 입양</Link>
                </Button>
                <Button size="lg" className="px-8 text-base bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/application">온라인 입양 후 무료체험</Link>
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                *입양 신청 시, 입양을 돕기 위해 1600-2111 또는 담당자의 연락처로 연락 드릴 수 있어요
              </p>
            </div>
          </div>
        </section>

        {/* Onboarding Steps Section */}
        <section className="py-20 bg-gradient-to-b from-cyan-50 to-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              반려해변이 어색하신가요? 등대지기가 하나씩 알려드릴게요
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "Step 1",
                  title: "반려해변에 대해서 알아보기",
                  desc: "반려해변이 뭐지? 하신다면 여기서부터!",
                  icon: "🏖️",
                  link: "/adopt-a-beach/resources/1",
                },
                {
                  step: "Step 2",
                  title: "입양 가능한 해변 알아보기",
                  desc: "우리 회사랑 가까운 해변은 어디일까요?",
                  icon: "📍",
                  link: "/beach-finder",
                },
                {
                  step: "Step 3",
                  title: "반려해변의 혜택 알아보기",
                  desc: "반려해변만의 특별한 혜택이 궁금하다면?",
                  icon: "🎁",
                  link: "/adopt-a-beach/resources/2",
                },
                {
                  step: "Step 4",
                  title: "전담 코디네이터 알아보기",
                  desc: "반려해변은 전문 코디네이터와 함께합니다.",
                  icon: "🤝",
                  link: "/adopt-a-beach/resources/#contact",
                },
              ].map((item, idx) => (
                <Card key={idx} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-5xl mb-4">{item.icon}</div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{item.step}</div>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{item.desc}</p>
                    {item.link !== "#" && (
                      <Button variant="link" className="text-blue-600" asChild>
                        <Link href={item.link}>자세히 </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Individual Products Section */}
        <section className="py-20 bg-gradient-to-b from-white to-cyan-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              반려해변에 이렇게 참여할 수 있어요
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48 w-full">
                  <Image
                    src="https://drive.google.com/uc?export=view&id=1cGR68xOnxWAjEjhxqcVCX1ds-o_c96WM"
                    alt="반려해변 입양"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-4xl">🏖️</div>
                    <h3 className="text-xl font-bold">반려해변 입양</h3>
                  </div>
                  <p className="text-gray-600 mb-4">임직원들과 함께하는 반려해변 활동!</p>
                  <ul className="space-y-2 text-sm text-gray-700 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>전문 코디네이터가 함께하는 반려해변 활동</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>활동 후에는 임직원의 활동이 데이터 리포트로!</span>
                    </li>
                  </ul>
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold text-blue-900">
                      필수활동 : 연 2회의 정화활동, 1회의 캠페인
                    </p>
                    <p className="text-xs text-gray-600">기금 : 300만원(1개해변당)</p>
                  </div>
                  <Button variant="link" className="text-blue-600 hidden" asChild>
                    <Link href="/adopt-a-beach/resources">👉 2025년 반려해변 보러가기</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48 w-full">
                  <Image
                    src="https://drive.google.com/uc?export=view&id=1N33NuYPwC_AlplFLCoBck2p_T6LncTCh"
                    alt="비영리단체 지원"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-4xl">📋</div>
                    <h3 className="text-xl font-bold">비영리단체 지원</h3>
                  </div>
                  <p className="text-gray-600 mb-4">비영리(풀뿌리)단체의 활동을 지원해주세요!</p>
                  <ul className="space-y-2 text-sm text-gray-700 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>직접 활동이 어려운 경우! 후원으로 함께해주세요</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>후원한 비영리단체의 활동이 데이터 리포트로!</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>매칭부터 리포트 제공까지 한번에!</span>
                    </li>
                  </ul>
                  <div className="bg-purple-50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold text-purple-900">
                      필수활동 : 연 2회의 정화활동, 1회의 캠페인
                    </p>
                    <p className="text-xs text-gray-600">기금 : 150만원(단체당)</p>
                  </div>
                  <Button variant="link" className="text-blue-600 hidden" asChild>
                    <Link href="/adopt-a-beach/resources">
                      {" "}
                      👉 2025년 함께한 비영리단체 보러가기
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48 w-full">
                  <Image
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8JUVCJUIwJTk0JUVCJThCJUE0JTIwJUVEJTkyJThEJUVBJUIyJUJEfGVufDB8fDB8fHww"
                    alt="반려해변 입양"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-4xl">📦</div>
                    <h3 className="text-xl font-bold">물품 지원</h3>
                  </div>
                  <p className="text-gray-600 mb-4">물품으로 활동을 지원해주세요!</p>
                  <ul className="space-y-2 text-sm text-gray-700 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>정화활동 물품 또는 리워드를 지원해주세요.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>비영리단체, 학교의 활동에 도움이 됩니다</span>
                    </li>
                  </ul>
                  <div className="bg-green-50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold text-green-900">
                      세부사항 : 사무국과 논의해주세요
                    </p>
                    <p className="text-xs text-gray-600">기부금 영수증 발행 가능</p>
                  </div>
                  <Button variant="link" className="text-blue-600 hidden" asChild>
                    <Link href="/adopt-a-beach/resources">자세히</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-8">
              <p className="text-lg font-semibold text-gray-900 mb-4">
                2026 반려해변 입양 시 받을 수 있는 혜택을 놓치지 마세요!
              </p>
              <p className="text-gray-700 mb-6">해변정화 + 데이터리포트 + 임직원과의 단합력</p>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/application">지금 바로 입양하러 가기</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Video Testimonials Section */}
        <section className="py-20 bg-white hidden">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              반려해변 입양 후 변화, 직접 경험해보세요
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "해변정화활동",
                  subtitle: "해변정화 시작하고 참여자가 빠르게 늘었어요.",
                  thumbnail: "🌊",
                  time: "2:34",
                },
                {
                  title: "후원물품",
                  subtitle: "후원으로 온오프라인 후원자 모두 사로잡아요.",
                  thumbnail: "📦",
                  time: "3:12",
                },
                {
                  title: "해변정화활동",
                  subtitle: "등대지기와 전략으로 지속 가능한 활동을 만들었어요.",
                  thumbnail: "🏖️",
                  time: "4:21",
                },
                {
                  title: "해변정화활동",
                  subtitle: "지방에서 반려해변을 만나고, 참여자가 늘었어요.",
                  thumbnail: "🌅",
                  time: "2:58",
                },
              ].map((video, idx) => (
                <Card
                  key={idx}
                  className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                >
                  <div className="relative bg-gradient-to-br from-blue-400 to-cyan-500 h-48 flex items-center justify-center">
                    <div className="text-6xl">{video.thumbnail}</div>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <PlayCircle className="w-16 h-16 text-white opacity-80" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.time}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="font-semibold text-sm text-blue-600 mb-1">{video.title}</p>
                    <p className="text-sm text-gray-700">{video.subtitle}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timing Benefits Section */}
        {/* TODO: 디자인/카피 검토 필요 */}
        <section className="py-20 bg-white hidden">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              지금 반려해변을 입양하면 좋은 이유
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Calendar className="w-12 h-12 text-blue-600" />
                    <div>
                      <h3 className="text-2xl font-bold">2025년</h3>
                      <h3 className="text-2xl font-bold">반려해변 전국대회</h3>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 mb-4">
                    <p className="text-sm text-gray-600 mb-2">작년 함께 했던 입양기관</p>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold text-blue-600">1</span>
                      <span className="text-xl text-gray-700">목요일 ~ 31 토요일</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mb-2">새해 첫달 ☀️</p>
                    <p className="text-sm text-gray-700 mb-2">
                      한 해의 건강과 환경을 기원하는 활동이 인기!
                    </p>
                    <p className="text-sm text-blue-600 font-semibold">
                      1월에는 해변 정화 활동 참여가 최대 113.2% 증가해요.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      단체님께 드리는 마케팅 혜택
                    </h3>
                    <p className="text-sm text-gray-700 mb-2">우리해변클릭 이용 시 2주 간</p>
                    <p className="text-2xl font-bold text-blue-600 mb-2">홍보비 20만 원 혜택</p>
                    <Button variant="link" className="text-blue-600 p-0" asChild>
                      <Link href="/adopt-a-beach/resources">자세히</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      단체만을 위한 다양한 제휴사 혜택 제공
                    </h3>
                    <Button variant="link" className="text-blue-600 p-0" asChild>
                      <Link href="/adopt-a-beach/resources">자세히</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Content Resources Section */}
        {/* TODO: 디자인/카피 검토 필요 */}
        <section className="py-20 bg-gradient-to-b from-white to-blue-50 hidden">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              시작부터 첫 활동까지 도와드릴 콘텐츠
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8 flex items-start gap-4">
                  <BookOpen className="w-12 h-12 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-600 font-semibold mb-2">등대지기 가이드</p>
                    <h3 className="font-bold text-lg mb-2">반려해변 입양 절차의 이해</h3>
                    <Button variant="link" className="text-blue-600 p-0" asChild>
                      <Link href="/adopt-a-beach/resources">자세히</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8 flex items-start gap-4">
                  <BookOpen className="w-12 h-12 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-600 font-semibold mb-2">등대지기 가이드</p>
                    <h3 className="font-bold text-lg mb-2">활동 접수 채널 이용</h3>
                    <Button variant="link" className="text-blue-600 p-0" asChild>
                      <Link href="/adopt-a-beach/resources">자세히</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Preparation Tools Section */}
        {/* TODO: 디자인/카피 검토 필요 */}
        <section className="py-20 bg-white hidden">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">성공적인 활동 운영을 위한 준비</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
                <CardContent className="p-8">
                  <div className="text-6xl mb-4 text-center">📋</div>
                  <h3 className="font-bold text-xl text-center mb-4">
                    우리해변 체크리스트로 활동을 준비해요
                  </h3>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/adopt-a-beach/resources">자세히</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                <CardContent className="p-8">
                  <div className="text-6xl mb-4 text-center">🎓</div>
                  <h3 className="font-bold text-xl text-center mb-4">
                    등대지기아카데미에서 활동운영을 배워보세요
                  </h3>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/adopt-a-beach/resources">자세히</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              반려해변 입양에 대해 더 궁금하신가요?
            </h2>
            <h4 className="text-xl font-medium text-center mb-12">
              등대지기가 자주 묻는 질문을 모아봤어요
            </h4>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-xl mb-6">자주 묻는 질문</h3>
                {loadingFaqs ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-4">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : faqs.length > 0 ? (
                  <div className="space-y-4">
                    {faqs.map((faq) => (
                      <Link key={faq.id} href={`/adopt-a-beach/resources/${faq.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <p className="text-sm text-gray-700">{faq.title}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-500 text-center">등록된 FAQ가 없습니다.</p>
                    </CardContent>
                  </Card>
                )}
                <Button variant="link" className="text-blue-600 mt-4" asChild>
                  <Link href="/adopt-a-beach/resources">질문 전체</Link>
                </Button>
              </div>
              {/* TODO: 디자인/카피 검토 필요 */}
              <div className="hidden">
                <h3 className="font-bold text-xl mb-6">도움 문의</h3>
                <Card className="mb-4">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">실시간 상담</h4>
                    <p className="text-sm text-gray-600 mb-4">원하는 시간에 상담할 수 있어요</p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                      <Link href="/contact">상담 시작</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-2">1:1 문의</h4>
                    <p className="text-sm text-gray-600 mb-4">질문을 남기시면 답변해드려요</p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/adopt-a-beach/expertsqna/ask">문의하기</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6">지금 바로 반려해변을 입양하세요</h2>
            <p className="text-xl mb-8 text-blue-50">
              등대지기와 함께 반려해변 입양의 첫 걸음을 내딛어보세요!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center hidden">
              <Button size="lg" variant="secondary" className="px-8 text-lg" asChild>
                <Link href="/application">온라인 입양 신청</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 text-lg bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600"
                asChild
              >
                <Link href="/contact">등대 무전 남기기</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

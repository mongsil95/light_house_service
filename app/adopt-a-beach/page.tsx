"use client";

import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CheckCircle2, CreditCard, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";

export default function PetBeachPage() {
  // 각 단계별 가이드 콘텐츠
  const step1Contents = [
    {
      title: "반려해변 입양 신청서 작성",
      description: "해변 정보와 입양 동기를 작성하세요",
      type: "가이드",
      link: "/adopt-a-beach/resources/1",
    },
    {
      title: "입양 가능한 해변 찾기",
      description: "전국 반려해변 지도에서 원하는 해변을 선택하세요",
      type: "가이드",
      link: "/adopt-a-beach/resources/2",
    },
    {
      title: "입양 신청 시 필요한 정보",
      description: "기관 정보, 담당자 연락처, 활동 계획 등",
      type: "가이드",
      link: "/adopt-a-beach/resources/3",
    },
    {
      title: "단체 입양 vs 개인 입양",
      description: "우리 기관에 맞는 입양 유형 선택하기",
      type: "가이드",
      link: "/adopt-a-beach/resources/4",
    },
  ];

  const step2Contents = [
    {
      title: "입양 계약서 다운로드 및 작성",
      description: "필수 서류 양식을 다운로드하고 작성하세요",
      type: "가이드",
      link: "/adopt-a-beach/resources/5",
    },
    {
      title: "기관 증빙 서류 제출",
      description: "사업자등록증 또는 고유번호증 제출 방법",
      type: "가이드",
      link: "/adopt-a-beach/resources/6",
    },
    {
      title: "활동 계획서 작성 팁",
      description: "승인률 높이는 활동 계획서 작성법",
      type: "가이드",
      link: "/adopt-a-beach/resources/7",
    },
    {
      title: "서류 제출 방법",
      description: "이메일, 우편, 온라인 제출 가이드",
      type: "가이드",
      link: "/adopt-a-beach/resources/8",
    },
  ];

  const step3Contents = [
    {
      title: "입양 기금 안내",
      description: "반려해변 입양 기금의 목적과 사용처",
      type: "가이드",
      link: "/adopt-a-beach/resources/9",
    },
    {
      title: "기금 납부 방법",
      description: "계좌이체, 카드결제 등 납부 방법 안내",
      type: "가이드",
      link: "/adopt-a-beach/resources/10",
    },
    {
      title: "납부 영수증 발급",
      description: "기부금 영수증 신청 및 발급 방법",
      type: "가이드",
      link: "/adopt-a-beach/resources/11",
    },
    {
      title: "정기 후원 신청",
      description: "지속적인 해변 관리를 위한 정기 후원 안내",
      type: "가이드",
      link: "/adopt-a-beach/resources/12",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-600 py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              반려해변 입양, 3단계로 완전정복!
            </h1>
            <p className="text-lg md:text-xl text-blue-50 max-w-2xl mx-auto">
              반려해변 입양 어렵지 않도록 단계별로 모아봤어요
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6">
          {/* 단계 네비게이션 */}
          <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 -mx-6 px-6 py-4 mb-12">
            <div className="flex items-center gap-4 overflow-x-auto">
              <a
                href="#step1"
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap font-semibold"
              >
                <FileText className="w-5 h-5" />
                <span>입양 신청하기</span>
              </a>
              <a
                href="#step2"
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap font-semibold"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>서류 제출하기</span>
              </a>
              <a
                href="#step3"
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap font-semibold"
              >
                <CreditCard className="w-5 h-5" />
                <span>기금 납부하기</span>
              </a>
            </div>
          </div>

          {/* 1단계 - 입양 신청하기 */}
          <section id="step1" className="mb-20 scroll-mt-32">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white font-bold text-xl">
                  1
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  반려해변 입양 신청하기
                </h2>
              </div>
              <p className="text-gray-600 ml-15">
                우리 기관에 맞는 해변을 찾고 입양 신청을 시작하세요
              </p>
            </div>

            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {step1Contents.map((content, idx) => (
                  <CarouselItem
                    key={idx}
                    className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                  >
                    <Link href={content.link} className="block h-full">
                      <Card className="border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group cursor-pointer h-full">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {content.type}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {content.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">{content.description}</p>
                          <div className="text-blue-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                            자세히 보기
                            <ExternalLink className="w-4 h-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
            </Carousel>
          </section>

          {/* 2단계 - 서류 제출하기 */}
          <section id="step2" className="mb-20 scroll-mt-32">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white font-bold text-xl">
                  2
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  반려해변 입양 서류 제출하기
                </h2>
              </div>
              <p className="text-gray-600 ml-15">
                필수 서류를 준비하고 제출하여 입양 승인을 받으세요
              </p>
            </div>

            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {step2Contents.map((content, idx) => (
                  <CarouselItem
                    key={idx}
                    className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                  >
                    <Link href={content.link} className="block h-full">
                      <Card className="border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all group cursor-pointer h-full">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {content.type}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                            {content.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">{content.description}</p>
                          <div className="text-green-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                            자세히 보기
                            <ExternalLink className="w-4 h-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
            </Carousel>
          </section>

          {/* 3단계 - 기금 납부하기 */}
          <section id="step3" className="mb-20 scroll-mt-32">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500 text-white font-bold text-xl">
                  3
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  반려해변 기금 납부하기
                </h2>
              </div>
              <p className="text-gray-600 ml-15">
                해변 관리를 위한 기금을 납부하고 정식 반려해변 파트너가 되세요
              </p>
            </div>

            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {step3Contents.map((content, idx) => (
                  <CarouselItem
                    key={idx}
                    className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                  >
                    <Link href={content.link} className="block h-full">
                      <Card className="border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all group cursor-pointer h-full">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                              <CreditCard className="w-5 h-5 text-purple-600" />
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {content.type}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                            {content.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">{content.description}</p>
                          <div className="text-purple-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                            자세히 보기
                            <ExternalLink className="w-4 h-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
            </Carousel>
          </section>

          {/* 하단 CTA */}
          <section className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              아직 궁금한 점이 있으신가요?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              반려해변 입양에 대해 더 자세히 알고 싶으시다면 전문가에게 직접 문의해보세요
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/inquiry">
                <button className="px-8 py-3 bg-blue-300 text-white rounded-lg hover:bg-blue-400 transition-colors font-semibold">
                  전문가에게 질문하기
                </button>
              </Link>
              <Link href="/contact">
                <button className="px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
                  등대지기에게 연락하기
                </button>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
